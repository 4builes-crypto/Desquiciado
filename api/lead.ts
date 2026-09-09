/**
 * POST /api/lead
 *
 * Recibe los datos de contacto que la persona deja dentro del chat y te los
 * manda por correo, junto con el contexto de lo que le preguntó al sommelier.
 *
 * Los datos personales NO pasan por DeepSeek: van del widget a esta función y
 * de acá a tu bandeja, y nada más.
 *
 * Usa Resend, que en capa gratuita da 3.000 correos al mes.
 *
 * Variables de entorno:
 *   RESEND_API_KEY     obligatoria para que el correo salga
 *   LEAD_DESTINO       correo que recibe los avisos
 *   LEAD_REMITENTE     remitente verificado en Resend, por ejemplo
 *                      "Chat Desquiciado <chat@desquiciado-sas.com>"
 */

import { VINOS } from './_lib/knowledge';

export const config = { runtime: 'edge' };

const MAX = {
  nombre: 120,
  contacto: 200,
  mensaje: 1500,
  /** Mensajes de la conversación que se adjuntan, del final hacia atrás. */
  turnos: 30,
  /** Caracteres por turno. */
  turno: 1200,
};

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
  if (req.method === 'OPTIONS') return new Response(null, { status: 204 });
  if (req.method !== 'POST') {
    return json({ error: 'Método no permitido' }, 405);
  }

  let lead: Lead;
  try {
    lead = (await req.json()) as Lead;
  } catch {
    return json({ error: 'Cuerpo inválido' }, 400);
  }

  // Trampa para robots: respondemos éxito para no darles pistas, pero no
  // enviamos nada.
  if (lead.sitioWeb) return json({ ok: true }, 200);

  const nombre = (lead.nombre ?? '').trim().slice(0, MAX.nombre);
  const contacto = (lead.contacto ?? '').trim().slice(0, MAX.contacto);
  const mensaje = (lead.mensaje ?? '').trim().slice(0, MAX.mensaje);
  const conversacion = limpiarConversacion(lead.conversacion);

  if (nombre.length < 2) return json({ error: 'Falta el nombre.' }, 400);
  if (!contactoValido(contacto)) {
    return json({ error: 'Déjanos un correo o un teléfono para responderte.' }, 400);
  }

  const apiKey = process.env.RESEND_API_KEY;
  const destino = process.env.LEAD_DESTINO ?? 'contacto@desquiciado-sas.com';
  const remitente = process.env.LEAD_REMITENTE ?? 'Chat Desquiciado <onboarding@resend.dev>';

  if (!apiKey) {
    console.error('Falta RESEND_API_KEY. Lead recibido pero no enviado:', {
      nombre,
      contacto,
    });
    return json({ error: 'No pudimos guardar tus datos. Escríbenos por WhatsApp.' }, 500);
  }

  const datos = { nombre, contacto, mensaje, conversacion };

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
        reply_to: contacto.includes('@') ? contacto : undefined,
        subject: asunto(datos),
        text: correoEnTexto(datos),
        html: correoEnHtml(datos),
      }),
    });

    if (!respuesta.ok) {
      const detalle = await respuesta.text().catch(() => '');
      console.error('Resend respondió', respuesta.status, detalle.slice(0, 400));
      return json({ error: 'No pudimos enviar tus datos. Escríbenos por WhatsApp.' }, 502);
    }
  } catch (error) {
    console.error('Error enviando el lead:', error);
    return json({ error: 'No pudimos enviar tus datos. Escríbenos por WhatsApp.' }, 502);
  }

  return json({ ok: true }, 200);
}

// ---------------------------------------------------------------- validación

function contactoValido(valor: string): boolean {
  const esCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor);
  const digitos = valor.replace(/\D/g, '');
  const esTelefono = digitos.length >= 7 && digitos.length <= 15;
  return esCorreo || esTelefono;
}

function limpiarConversacion(entrada: unknown): Turno[] {
  if (!Array.isArray(entrada)) return [];
  return entrada
    .filter(
      (t): t is Turno =>
        !!t &&
        typeof t === 'object' &&
        ((t as Turno).role === 'user' || (t as Turno).role === 'assistant') &&
        typeof (t as Turno).content === 'string' &&
        (t as Turno).content.trim().length > 0,
    )
    .slice(-MAX.turnos)
    .map((t) => ({ role: t.role, content: t.content.trim().slice(0, MAX.turno) }));
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
    .replace(/"/g, '&quot;');

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
    );
  }

  return `<div style="max-width:600px;margin:0 auto;padding:28px 24px;background:#F5F5DC">
            ${bloques.join('')}
          </div>`;
}

function json(cuerpo: unknown, status: number): Response {
  return new Response(JSON.stringify(cuerpo), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
