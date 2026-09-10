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
 * Orden de las defensas, de la mas barata a la mas cara:
 *   1. Solo POST y solo desde el propio sitio (cabecera Origin).
 *   2. Limite por IP: 10 mensajes por minuto y 120 por dia.
 *   3. Cuerpo JSON de hasta 200 KB, historial validado y limpio.
 *   4. Tope diario para todo el sitio (solo con Redis), con alerta al 80 %.
 *   5. Tope de tokens de la respuesta, y el tope de saldo en el panel de DeepSeek.
 *
 * Variables de entorno (Vercel > Settings > Environment Variables):
 *   DEEPSEEK_API_KEY     obligatoria
 *   DEEPSEEK_BASE_URL    opcional, por defecto https://api.deepseek.com
 *   DEEPSEEK_MODEL       opcional, por defecto deepseek-chat
 *   ORIGENES_PERMITIDOS  opcional, lista separada por comas
 *   CHAT_TOPE_DIARIO     opcional, mensajes al dia para todo el sitio (1500)
 */

import { buildSystemPrompt } from './_lib/systemPrompt';
import { contarGlobalDelDia, revisarLimites, topeDesdeEnv, type Regla } from './_lib/rateLimit';
import { alertar } from './_lib/alertas';
import {
  ErrorDeEntrada,
  huella,
  ipDe,
  json,
  leerJson,
  limpiarTexto,
  pareceAtaque,
  pareceManipulacion,
  registrar,
  revisarOrigen,
} from './_lib/seguridad';

export const config = { runtime: 'edge' };

/** Tope de mensajes de historia que enviamos. Controla el costo por turno. */
const MAX_MENSAJES = 14;
/** Tope de caracteres por mensaje. Corta pegados enormes que inflan la cuenta. */
const MAX_CARACTERES = 2000;
/** Tope de la respuesta. El bot debe ser breve, y esto lo obliga. */
const MAX_TOKENS_RESPUESTA = 700;
/** Tope del cuerpo de la peticion, con holgura para 14 mensajes largos. */
const MAX_BYTES = 200_000;

const REGLAS: Regla[] = [
  { nombre: 'chat-minuto', limite: 10, ventanaMs: 60_000 },
  { nombre: 'chat-dia', limite: 120, ventanaMs: 86_400_000 },
];

type Mensaje = { role: 'user' | 'assistant'; content: string };

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: { Allow: 'POST' } });
  }
  if (req.method !== 'POST') {
    await registrar('metodo_no_permitido', req, { metodo: req.method });
    return json({ error: 'Método no permitido' }, 405, { Allow: 'POST' });
  }

  const origen = revisarOrigen(req);
  if (!origen.ok) {
    await registrar(origen.motivo, req, { origen: req.headers.get('origin') ?? undefined });
    return json({ error: 'Origen no permitido' }, 403);
  }

  const limite = await revisarLimites(await huella(ipDe(req)), REGLAS);
  if (limite.bloqueado) {
    await registrar('limite_superado', req, { regla: limite.regla, almacen: limite.almacen });
    const mensaje =
      limite.regla === 'chat-dia'
        ? 'Por hoy llegaste al límite de mensajes. Escríbenos por WhatsApp y seguimos la charla.'
        : 'Vas muy rápido. Espera un momento y vuelve a escribir.';
    return json({ error: mensaje }, 429, { 'Retry-After': String(limite.reintentarEnS) });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    await alertar(
      'config-deepseek',
      'El chat no tiene llave de DeepSeek',
      'Falta DEEPSEEK_API_KEY en las variables de entorno de Vercel. El chat no responde a nadie.',
    );
    return json({ error: 'El chat no está configurado todavía.' }, 500);
  }

  let mensajes: Mensaje[];
  try {
    const cuerpo = (await leerJson(req, MAX_BYTES)) as { messages?: unknown } | null;
    mensajes = validarMensajes(cuerpo?.messages);
  } catch (error) {
    const fallo =
      error instanceof ErrorDeEntrada
        ? error
        : new ErrorDeEntrada('entrada_invalida', 'No pudimos leer tu mensaje.');
    await registrar(fallo.motivo, req);
    return json({ error: fallo.message }, fallo.status);
  }

  // Señales de alguien probando el sitio o intentando sacar al bot de su papel.
  // No bloqueamos: el prompt ya lo resiste y React muestra todo como texto.
  // Solo dejamos rastro para verlo venir.
  const ultimo = mensajes[mensajes.length - 1].content;
  if (pareceAtaque(ultimo)) await registrar('patron_de_ataque', req);
  if (pareceManipulacion(ultimo)) await registrar('posible_manipulacion_del_bot', req);

  const tope = topeDesdeEnv('CHAT_TOPE_DIARIO', 1500);
  const hoy = await contarGlobalDelDia('chat');
  if (hoy !== null) {
    if (hoy === Math.ceil(tope * 0.8)) {
      await alertar(
        'chat-80',
        'El chat va en el 80 % de su tope diario',
        `Hoy van ${hoy} mensajes de ${tope}. Si no es un día de mucho movimiento, puede ser un ataque repartido entre muchas IP.`,
      );
    }
    if (hoy > tope) {
      if (hoy === tope + 1) {
        await alertar(
          'chat-tope',
          'El chat llegó a su tope diario y dejó de responder',
          `Se alcanzaron los ${tope} mensajes del día. El chat responde con un aviso de WhatsApp hasta mañana (medianoche UTC). Para subirlo, cambia CHAT_TOPE_DIARIO en Vercel.`,
        );
      }
      await registrar('tope_global_alcanzado', req, { conteo: hoy, tope });
      return json(
        { error: 'El chat está descansando por hoy. Escríbenos por WhatsApp y te atendemos.' },
        503,
      );
    }
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
    console.error('No se pudo llamar a DeepSeek:', (error as Error).message);
    return json({ error: 'No pudimos conectarnos. Inténtalo de nuevo.' }, 502);
  }

  if (!upstream.ok || !upstream.body) {
    const detalle = await upstream.text().catch(() => '');
    console.error('DeepSeek respondio', upstream.status, detalle.slice(0, 300));
    await registrar('proveedor_error', req, { proveedor: 'deepseek', status: upstream.status });

    if (upstream.status === 401 || upstream.status === 403) {
      await alertar(
        'deepseek-llave',
        'DeepSeek rechazó la llave del chat',
        `DeepSeek respondió ${upstream.status}. La llave DEEPSEEK_API_KEY no es válida o fue revocada. Si no la cambiaste tú, genera una nueva en platform.deepseek.com, bórrala de allá y actualízala en Vercel.`,
      );
    } else if (upstream.status === 402) {
      await alertar(
        'deepseek-saldo',
        'El chat se quedó sin saldo en DeepSeek',
        'DeepSeek respondió 402. Recarga en platform.deepseek.com. Si el gasto fue más rápido de lo normal, revisa los registros por si hubo abuso.',
      );
    }

    const mensaje =
      upstream.status === 402
        ? 'El chat está sin saldo. Escríbenos por WhatsApp mientras lo arreglamos.'
        : 'El chat está ocupado. Inténtalo de nuevo en un momento.';
    return json({ error: mensaje }, 502);
  }

  // Pasamos el stream tal cual llega. El widget lo lee como SSE en formato
  // OpenAI, que es el mismo que hablan casi todos los proveedores: si algun dia
  // cambias de modelo, no hay que tocar el frontend.
  return new Response(upstream.body, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'X-Content-Type-Options': 'nosniff',
      Connection: 'keep-alive',
    },
  });
}

function validarMensajes(entrada: unknown): Mensaje[] {
  if (!Array.isArray(entrada) || entrada.length === 0) {
    throw new ErrorDeEntrada('historial_invalido', 'Falta el historial de la conversación.');
  }

  const limpios = entrada
    .slice(-MAX_MENSAJES)
    .filter(
      (m): m is Mensaje =>
        !!m &&
        typeof m === 'object' &&
        ((m as Mensaje).role === 'user' || (m as Mensaje).role === 'assistant') &&
        typeof (m as Mensaje).content === 'string',
    )
    // Solo pasan role y content: cualquier otro campo que venga (por ejemplo
    // un role "system" o parametros del modelo) se descarta.
    .map((m) => ({ role: m.role, content: limpiarTexto(m.content, MAX_CARACTERES) }))
    .filter((m) => m.content.length > 0);

  if (limpios.length === 0) {
    throw new ErrorDeEntrada('historial_invalido', 'El historial no tiene mensajes válidos.');
  }
  if (limpios[limpios.length - 1].role !== 'user') {
    throw new ErrorDeEntrada('historial_invalido', 'El último mensaje debe ser del usuario.');
  }
  return limpios;
}
