/**
 * POST /api/lead
 *
 * Recibe los datos de contacto que la persona deja dentro del chat y te los
 * manda por correo. Los datos personales NO pasan por DeepSeek: van del widget
 * a esta funcion y de aca a tu bandeja, y nada mas.
 *
 * Usa Resend, que en capa gratuita da 3.000 correos al mes.
 *
 * Variables de entorno:
 *   RESEND_API_KEY     obligatoria para que el correo salga
 *   LEAD_DESTINO       correo que recibe los avisos
 *   LEAD_REMITENTE     remitente verificado en Resend, por ejemplo
 *                      "Chat Desquiciado <chat@desquiciado-sas.com>"
 */

export const config = { runtime: 'edge' };

const MAX = { nombre: 120, contacto: 200, mensaje: 1500, resumen: 4000 };

type Lead = {
  nombre: string;
  contacto: string;
  mensaje?: string;
  resumen?: string;
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

  // Trampa para robots: respondemos exito para no darles pistas, pero no
  // enviamos nada.
  if (lead.sitioWeb) return json({ ok: true }, 200);

  const nombre = (lead.nombre ?? '').trim().slice(0, MAX.nombre);
  const contacto = (lead.contacto ?? '').trim().slice(0, MAX.contacto);
  const mensaje = (lead.mensaje ?? '').trim().slice(0, MAX.mensaje);
  const resumen = (lead.resumen ?? '').trim().slice(0, MAX.resumen);

  if (nombre.length < 2) return json({ error: 'Falta el nombre.' }, 400);
  if (!contactoValido(contacto)) {
    return json({ error: 'Déjanos un correo o un teléfono para responderte.' }, 400);
  }

  const apiKey = process.env.RESEND_API_KEY;
  const destino = process.env.LEAD_DESTINO ?? 'desquiciadosas@gmail.com';
  const remitente = process.env.LEAD_REMITENTE ?? 'Chat Desquiciado <onboarding@resend.dev>';

  if (!apiKey) {
    console.error('Falta RESEND_API_KEY. Lead recibido pero no enviado:', {
      nombre,
      contacto,
    });
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
        reply_to: contacto.includes('@') ? contacto : undefined,
        subject: `Nuevo contacto desde el chat: ${nombre}`,
        text: cuerpoDelCorreo({ nombre, contacto, mensaje, resumen }),
      }),
    });

    if (!respuesta.ok) {
      const detalle = await respuesta.text().catch(() => '');
      console.error('Resend respondio', respuesta.status, detalle.slice(0, 400));
      return json({ error: 'No pudimos enviar tus datos. Escríbenos por WhatsApp.' }, 502);
    }
  } catch (error) {
    console.error('Error enviando el lead:', error);
    return json({ error: 'No pudimos enviar tus datos. Escríbenos por WhatsApp.' }, 502);
  }

  return json({ ok: true }, 200);
}

function contactoValido(valor: string): boolean {
  const esCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor);
  const digitos = valor.replace(/\D/g, '');
  const esTelefono = digitos.length >= 7 && digitos.length <= 15;
  return esCorreo || esTelefono;
}

function cuerpoDelCorreo(lead: {
  nombre: string;
  contacto: string;
  mensaje: string;
  resumen: string;
}): string {
  const fecha = new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' });
  return [
    'Alguien dejó sus datos en el chat del sitio.',
    '',
    `Nombre: ${lead.nombre}`,
    `Contacto: ${lead.contacto}`,
    `Fecha: ${fecha}`,
    '',
    lead.mensaje ? `Lo que escribió:\n${lead.mensaje}\n` : '',
    lead.resumen ? `Conversación:\n${lead.resumen}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

function json(cuerpo: unknown, status: number): Response {
  return new Response(JSON.stringify(cuerpo), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
