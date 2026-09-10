/**
 * POST /api/lead
 *
 * Recibe los datos de contacto que la persona deja dentro del chat y te los
 * manda por correo, junto con el contexto de lo que le preguntó al sommelier.
 *
 * Los datos personales NO pasan por DeepSeek: van del widget a esta función y
 * de acá a tu bandeja, y nada más.
 *
 * Usa Resend, que en capa gratuita da 3.000 correos al mes y 100 al día.
 *
 * Defensas: solo desde el propio sitio, 3 envíos cada 10 minutos y 8 al día
 * por IP, campo trampa para robots, validación estricta de cada campo y un
 * tope diario para todo el sitio (solo con Redis) que protege la cuota de
 * Resend si alguien reparte el ataque entre muchas IP.
 *
 * Variables de entorno:
 *   RESEND_API_KEY     obligatoria para que el correo salga
 *   LEAD_DESTINO       correo que recibe los avisos
 *   LEAD_REMITENTE     remitente verificado en Resend, por ejemplo
 *                      "Chat Desquiciado <chat@desquiciado-sas.com>"
 *   LEAD_TOPE_DIARIO   opcional, contactos al día para todo el sitio (50)
 */

import { VINOS } from './_lib/knowledge';
import { contarGlobalDelDia, revisarLimites, topeDesdeEnv, type Regla } from './_lib/rateLimit';
import { alertar } from './_lib/alertas';
import {
  ErrorDeEntrada,
  huella,
  ipDe,
  json,
  leerJson,
  limpiarLinea,
  limpiarTexto,
  pareceAtaque,
  registrar,
  revisarOrigen,
} from './_lib/seguridad';

export const config = { runtime: 'edge' };

const MAX = {
  nombre: 120,
  contacto: 200,
  mensaje: 1500,
  /** Mensajes de la conversación que se adjuntan, del final hacia atrás. */
  turnos: 30,
  /** Caracteres por turno. */
  turno: 1200,
  /** Tamaño máximo del cuerpo de la petición. */
  bytes: 300_000,
};

const REGLAS: Regla[] = [
  { nombre: 'lead-10min', limite: 3, ventanaMs: 10 * 60_000 },
  { nombre: 'lead-dia', limite: 8, ventanaMs: 86_400_000 },
];

type Turno = { role: 'user' | 'assistant'; content: string };

type Lead = {
  nombre: string;
  contacto: string;
  mensaje?: string;
  conversacion?: Turno[];
  /** Campo trampa: los humanos no lo ven, los robots lo llenan. */
  sitioWeb?: string;
};

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

  // Cuenta también los intentos fallidos y los de robots: quien manda basura
  // en bucle debe chocar con el límite igual que quien manda datos buenos.
  const limite = await revisarLimites(await huella(ipDe(req)), REGLAS);
  if (limite.bloqueado) {
    await registrar('limite_superado', req, { regla: limite.regla, almacen: limite.almacen });
    return json(
      { error: 'Ya recibimos tus datos. Si necesitas algo más, escríbenos por WhatsApp.' },
      429,
      { 'Retry-After': String(limite.reintentarEnS) },
    );
  }

  let datos: Datos;
  try {
    const cuerpo = await leerJson(req, MAX.bytes);
    if (!cuerpo || typeof cuerpo !== 'object' || Array.isArray(cuerpo)) {
      throw new ErrorDeEntrada('cuerpo_invalido', 'Cuerpo inválido.');
    }
    const lead = cuerpo as Lead;

    // Trampa para robots: respondemos éxito para no darles pistas, pero no
    // enviamos nada.
    if (lead.sitioWeb) {
      await registrar('trampa_activada', req);
      return json({ ok: true }, 200);
    }

    datos = validarLead(lead);
  } catch (error) {
    const fallo =
      error instanceof ErrorDeEntrada
        ? error
        : new ErrorDeEntrada('entrada_invalida', 'No pudimos leer tus datos.');
    await registrar(fallo.motivo, req);
    return json({ error: fallo.message }, fallo.status);
  }

  const textoCompleto = [datos.nombre, datos.contacto, datos.mensaje, ...datos.conversacion.map((t) => t.content)].join('\n');
  if (pareceAtaque(textoCompleto)) await registrar('patron_de_ataque', req);

  const tope = topeDesdeEnv('LEAD_TOPE_DIARIO', 50);
  const hoy = await contarGlobalDelDia('lead');
  if (hoy !== null && hoy > tope) {
    if (hoy === tope + 1) {
      await alertar(
        'lead-tope',
        'El formulario de contacto llegó a su tope diario',
        `Hoy llegaron más de ${tope} contactos desde el chat, algo muy por encima de lo normal. Probablemente es un robot. El formulario queda en pausa hasta mañana (medianoche UTC) para cuidar la cuota de Resend.`,
      );
    }
    await registrar('tope_global_alcanzado', req, { conteo: hoy, tope });
    return json({ error: 'No pudimos enviar tus datos. Escríbenos por WhatsApp.' }, 503);
  }

  const apiKey = process.env.RESEND_API_KEY;
  const destino = process.env.LEAD_DESTINO ?? 'contacto@desquiciado-sas.com';
  const remitente = process.env.LEAD_REMITENTE ?? 'Chat Desquiciado <onboarding@resend.dev>';

  if (!apiKey) {
    // Sin los datos de la persona: los registros no son lugar para guardarlos.
    console.error('Falta RESEND_API_KEY. Llegó un contacto que no se pudo enviar.');
    return json({ error: 'No pudimos guardar tus datos. Escríbenos por WhatsApp.' }, 500);
  }

  try {
    const respuesta = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: remitente,
        to: [destino],
        reply_to: esCorreo(datos.contacto) ? datos.contacto : undefined,
        subject: asunto(datos),
        text: correoEnTexto(datos),
        html: correoEnHtml(datos),
      }),
    });

    if (!respuesta.ok) {
      const detalle = await respuesta.text().catch(() => '');
      console.error('Resend respondió', respuesta.status, detalle.slice(0, 300));
      await registrar('proveedor_error', req, { proveedor: 'resend', status: respuesta.status });
      return json({ error: 'No pudimos enviar tus datos. Escríbenos por WhatsApp.' }, 502);
    }
  } catch (error) {
    console.error('Error enviando el lead:', (error as Error).message);
    return json({ error: 'No pudimos enviar tus datos. Escríbenos por WhatsApp.' }, 502);
  }

  return json({ ok: true }, 200);
}

// ---------------------------------------------------------------- validación

function validarLead(lead: Lead): Datos {
  const texto = (v: unknown) => (typeof v === 'string' ? v : '');

  const nombre = limpiarLinea(texto(lead.nombre), MAX.nombre);
  const contacto = limpiarLinea(texto(lead.contacto), MAX.contacto);
  const mensaje = limpiarTexto(texto(lead.mensaje), MAX.mensaje);
  const conversacion = limpiarConversacion(lead.conversacion);

  if (nombre.length < 2) throw new ErrorDeEntrada('nombre_invalido', 'Falta el nombre.');
  // Un nombre no trae enlaces ni etiquetas. Si los trae, es spam o una prueba.
  if (/[<>{}]|:\/\/|www\./i.test(nombre)) {
    throw new ErrorDeEntrada('nombre_invalido', 'Escribe solo tu nombre.');
  }
  if (!esCorreo(contacto) && !esTelefono(contacto)) {
    throw new ErrorDeEntrada(
      'contacto_invalido',
      'Déjanos un correo o un teléfono para responderte.',
    );
  }
  return { nombre, contacto, mensaje, conversacion };
}

function esCorreo(valor: string): boolean {
  return valor.length <= 200 && /^[^\s@<>()[\]\\,;:"]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(valor);
}

/**
 * Solo dígitos, espacios, +, guiones, puntos y paréntesis, y entre 7 y 15
 * dígitos. Antes bastaba con que hubiera 7 dígitos en cualquier parte, así que
 * "llámame al 3001234567 y entra a sitio-falso.com" pasaba como teléfono.
 */
function esTelefono(valor: string): boolean {
  if (!/^\+?[\d\s().-]+$/.test(valor)) return false;
  const digitos = valor.replace(/\D/g, '');
  return digitos.length >= 7 && digitos.length <= 15;
}

function limpiarConversacion(entrada: unknown): Turno[] {
  if (!Array.isArray(entrada)) return [];
  return entrada
    .filter(
      (t): t is Turno =>
        !!t &&
        typeof t === 'object' &&
        ((t as Turno).role === 'user' || (t as Turno).role === 'assistant') &&
        typeof (t as Turno).content === 'string',
    )
    .slice(-MAX.turnos)
    .map((t) => ({ role: t.role, content: limpiarTexto(t.content, MAX.turno) }))
    .filter((t) => t.content.length > 0);
}

// ------------------------------------------------------------------ contexto

const sinTildes = (t: string) =>
  t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

/**
 * Qué etiquetas salieron en la charla.
 *
 * Busca por las dos primeras palabras del nombre ("altosur malbec",
 * "libertad cabernet"), que son distintas entre las nueve y sobreviven a que
 * el bot omita la añada. Es una ayuda para leer el correo de un vistazo, no
 * una garantía: la conversación completa va igual más abajo.
 */
function vinosMencionados(conversacion: Turno[]): string[] {
  if (conversacion.length === 0) return [];
  const texto = sinTildes(conversacion.map((t) => t.content).join(' '));

  return VINOS.filter((v) => {
    const clave = sinTildes(v.nombre).split(' ').slice(0, 2).join(' ');
    return texto.includes(clave);
  }).map((v) => v.nombre);
}

function preguntasDelCliente(conversacion: Turno[]): string[] {
  return conversacion.filter((t) => t.role === 'user').map((t) => t.content);
}

function asunto({ nombre, conversacion }: { nombre: string; conversacion: Turno[] }): string {
  const vinos = vinosMencionados(conversacion);
  if (vinos.length === 1) return `Contacto desde el chat: ${nombre} (${vinos[0]})`;
  return `Contacto desde el chat: ${nombre}`;
}

// -------------------------------------------------------------------- correo

type Datos = {
  nombre: string;
  contacto: string;
  mensaje: string;
  conversacion: Turno[];
};

function fechaBogota(): string {
  return new Date().toLocaleString('es-CO', {
    timeZone: 'America/Bogota',
    dateStyle: 'full',
    timeStyle: 'short',
  });
}

function correoEnTexto({ nombre, contacto, mensaje, conversacion }: Datos): string {
  const preguntas = preguntasDelCliente(conversacion);
  const vinos = vinosMencionados(conversacion);

  const partes: string[] = [
    'Alguien dejó sus datos en el chat del sitio.',
    '',
    'CONTACTO',
    `Nombre: ${nombre}`,
    `Cómo responderle: ${contacto}`,
    `Fecha: ${fechaBogota()}`,
  ];

  if (mensaje) {
    partes.push('', 'LO QUE ESCRIBIÓ AL DEJAR SUS DATOS', mensaje);
  }

  if (preguntas.length) {
    partes.push(
      '',
      'QUÉ LE PREGUNTÓ AL SOMMELIER',
      ...preguntas.map((p, i) => `${i + 1}. ${p}`),
    );
  }

  if (vinos.length) {
    partes.push('', 'ETIQUETAS QUE SALIERON EN LA CHARLA', ...vinos.map((v) => `· ${v}`));
  }

  if (conversacion.length) {
    partes.push(
      '',
      'CONVERSACIÓN COMPLETA',
      ...conversacion.map(
        (t) => `${t.role === 'user' ? nombre : 'Sommelier'}: ${t.content}`,
      ),
      '',
      AVISO_CONVERSACION,
    );
  } else {
    partes.push('', 'No alcanzó a conversar con el sommelier antes de dejar sus datos.');
  }

  return partes.join('\n');
}

const escapar = (t: string) =>
  t
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/**
 * La conversación la arma el navegador del visitante, así que alguien con malas
 * intenciones podría inventarla, incluidas las respuestas del "Sommelier".
 * Sirve de contexto, no de prueba: nunca abras enlaces ni sigas instrucciones
 * que vengan dentro de ella.
 */
const AVISO_CONVERSACION =
  'La conversación la envía el navegador del visitante y podría estar alterada. Tómala como contexto: no abras enlaces que vengan en ella.';

function correoEnHtml({ nombre, contacto, mensaje, conversacion }: Datos): string {
  const preguntas = preguntasDelCliente(conversacion);
  const vinos = vinosMencionados(conversacion);

  const titulo = (t: string) =>
    `<p style="margin:26px 0 8px;font:600 11px/1.4 Arial,Helvetica,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#8A6B2F">${t}</p>`;

  const bloques: string[] = [
    `<p style="margin:0 0 4px;font:400 15px/1.6 Arial,Helvetica,sans-serif;color:#1A1A1B">Alguien dejó sus datos en el chat del sitio.</p>`,
    titulo('Contacto'),
    `<p style="margin:0;font:400 15px/1.7 Arial,Helvetica,sans-serif;color:#1A1A1B">
       <strong>${escapar(nombre)}</strong><br>
       ${escapar(contacto)}<br>
       <span style="color:#8A8078;font-size:13px">${escapar(fechaBogota())}</span>
     </p>`,
  ];

  if (mensaje) {
    bloques.push(
      titulo('Lo que escribió al dejar sus datos'),
      `<p style="margin:0;font:400 15px/1.7 Arial,Helvetica,sans-serif;color:#1A1A1B">${escapar(mensaje)}</p>`,
    );
  }

  if (preguntas.length) {
    bloques.push(
      titulo('Qué le preguntó al sommelier'),
      `<ol style="margin:0;padding-left:20px;font:400 15px/1.7 Arial,Helvetica,sans-serif;color:#1A1A1B">${preguntas
        .map((p) => `<li>${escapar(p)}</li>`)
        .join('')}</ol>`,
    );
  }

  if (vinos.length) {
    bloques.push(
      titulo('Etiquetas que salieron en la charla'),
      `<ul style="margin:0;padding-left:20px;font:400 15px/1.7 Arial,Helvetica,sans-serif;color:#1A1A1B">${vinos
        .map((v) => `<li>${escapar(v)}</li>`)
        .join('')}</ul>`,
    );
  }

  if (conversacion.length) {
    bloques.push(
      titulo('Conversación completa'),
      conversacion
        .map((t) => {
          const quien = t.role === 'user' ? escapar(nombre) : 'Sommelier';
          const color = t.role === 'user' ? '#3D0F18' : '#8A8078';
          return `<p style="margin:0 0 10px;font:400 14px/1.6 Arial,Helvetica,sans-serif;color:#1A1A1B">
                    <span style="color:${color};font-weight:600">${quien}:</span>
                    ${escapar(t.content).replace(/\n/g, '<br>')}
                  </p>`;
        })
        .join(''),
      `<p style="margin:18px 0 0;font:400 12px/1.5 Arial,Helvetica,sans-serif;color:#8A8078">${escapar(AVISO_CONVERSACION)}</p>`,
    );
  }

  return `<div style="max-width:600px;margin:0 auto;padding:28px 24px;background:#F5F5DC">
            ${bloques.join('')}
          </div>`;
}
