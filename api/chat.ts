/**
 * POST /api/chat
 *
 * El unico intermediario entre el navegador y DeepSeek. Existe por una sola
 * razon: la llave de la API no puede vivir en el frontend, porque el bundle de
 * React es publico y cualquiera la sacaria en dos minutos.
 *
 * Corre en el runtime edge de Vercel, que soporta streaming nativo y responde
 * desde el nodo mas cercano al visitante.
 *
 * Variables de entorno (Vercel > Settings > Environment Variables):
 *   DEEPSEEK_API_KEY   obligatoria
 *   DEEPSEEK_BASE_URL  opcional, por defecto https://api.deepseek.com
 *   DEEPSEEK_MODEL     opcional, por defecto deepseek-chat
 *   ORIGENES_PERMITIDOS  opcional, lista separada por comas
 */

import { buildSystemPrompt } from './_lib/systemPrompt';
import { ipDe, superaElLimite } from './_lib/rateLimit';

export const config = { runtime: 'edge' };

/** Tope de mensajes de historia que enviamos. Controla el costo por turno. */
const MAX_MENSAJES = 14;
/** Tope de caracteres por mensaje. Corta pegados enormes que inflan la cuenta. */
const MAX_CARACTERES = 2000;
/** Tope de la respuesta. El bot debe ser breve, y esto lo obliga. */
const MAX_TOKENS_RESPUESTA = 700;

type Mensaje = { role: 'user' | 'assistant'; content: string };

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cabecerasCors(req) });
  }
  if (req.method !== 'POST') {
    return json({ error: 'Método no permitido' }, 405, req);
  }
  if (!origenPermitido(req)) {
    return json({ error: 'Origen no permitido' }, 403, req);
  }
  if (superaElLimite(ipDe(req))) {
    return json(
      { error: 'Vas muy rápido. Espera un momento y vuelve a escribir.' },
      429,
      req,
    );
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    console.error('Falta DEEPSEEK_API_KEY en las variables de entorno');
    return json({ error: 'El chat no está configurado todavía.' }, 500, req);
  }

  let mensajes: Mensaje[];
  try {
    const cuerpo = (await req.json()) as { messages?: unknown };
    mensajes = validarMensajes(cuerpo.messages);
  } catch (error) {
    return json({ error: (error as Error).message }, 400, req);
  }

  const baseUrl = process.env.DEEPSEEK_BASE_URL ?? 'https://api.deepseek.com';
  const modelo = process.env.DEEPSEEK_MODEL ?? 'deepseek-chat';

  let upstream: Response;
  try {
    upstream = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelo,
        stream: true,
        // Suficiente para que suene humano, no tanto como para que se desvie
        // del territorio de marca.
        temperature: 0.9,
        max_tokens: MAX_TOKENS_RESPUESTA,
        messages: [
          { role: 'system', content: buildSystemPrompt() },
          ...mensajes,
        ],
      }),
    });
  } catch (error) {
    console.error('No se pudo llamar a DeepSeek:', error);
    return json({ error: 'No pudimos conectarnos. Inténtalo de nuevo.' }, 502, req);
  }

  if (!upstream.ok || !upstream.body) {
    const detalle = await upstream.text().catch(() => '');
    console.error('DeepSeek respondio', upstream.status, detalle.slice(0, 500));
    const mensaje =
      upstream.status === 402
        ? 'El chat está sin saldo. Escríbenos por WhatsApp mientras lo arreglamos.'
        : 'El chat está ocupado. Inténtalo de nuevo en un momento.';
    return json({ error: mensaje }, 502, req);
  }

  // Pasamos el stream tal cual llega. El widget lo lee como SSE en formato
  // OpenAI, que es el mismo que hablan casi todos los proveedores: si algun dia
  // cambias de modelo, no hay que tocar el frontend.
  return new Response(upstream.body, {
    headers: {
      ...cabecerasCors(req),
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}

function validarMensajes(entrada: unknown): Mensaje[] {
  if (!Array.isArray(entrada) || entrada.length === 0) {
    throw new Error('Falta el historial de la conversación.');
  }

  const limpios = entrada
    .slice(-MAX_MENSAJES)
    .filter(
      (m): m is Mensaje =>
        !!m &&
        typeof m === 'object' &&
        (m as Mensaje).role !== undefined &&
        ((m as Mensaje).role === 'user' || (m as Mensaje).role === 'assistant') &&
        typeof (m as Mensaje).content === 'string' &&
        (m as Mensaje).content.trim().length > 0,
    )
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CARACTERES) }));

  if (limpios.length === 0) throw new Error('El historial no tiene mensajes válidos.');
  if (limpios[limpios.length - 1].role !== 'user') {
    throw new Error('El último mensaje debe ser del usuario.');
  }
  return limpios;
}

function origenesPermitidos(): string[] {
  const desdeEnv = process.env.ORIGENES_PERMITIDOS;
  if (desdeEnv) return desdeEnv.split(',').map((o) => o.trim()).filter(Boolean);
  return ['https://desquiciado-sas.com', 'https://www.desquiciado-sas.com'];
}

function origenPermitido(req: Request): boolean {
  const origen = req.headers.get('origin');
  // Sin cabecera Origin no es una peticion de navegador entre sitios, la dejamos pasar.
  if (!origen) return true;
  if (origenesPermitidos().includes(origen)) return true;
  // Las vistas previas de Vercel cambian de subdominio en cada despliegue.
  if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origen)) return true;
  // En desarrollo aceptamos cualquier puerto local, porque Vite cambia de puerto
  // cuando el habitual esta ocupado. En produccion esto queda cerrado.
  if (process.env.VERCEL_ENV === 'production') return false;
  return /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origen);
}

function cabecerasCors(req: Request): Record<string, string> {
  const origen = req.headers.get('origin');
  if (!origen || !origenPermitido(req)) return {};
  return {
    'Access-Control-Allow-Origin': origen,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function json(cuerpo: unknown, status: number, req: Request): Response {
  return new Response(JSON.stringify(cuerpo), {
    status,
    headers: { ...cabecerasCors(req), 'Content-Type': 'application/json; charset=utf-8' },
  });
}
