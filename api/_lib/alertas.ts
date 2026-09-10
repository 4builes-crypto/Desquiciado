/**
 * Avisos por correo cuando pasa algo que no puede esperar a que alguien abra
 * los registros de Vercel: el chat llegó a su tope del día, DeepSeek rechazó la
 * llave, Resend dejó de enviar.
 *
 * Usa el mismo Resend y el mismo buzón que los contactos del chat
 * (RESEND_API_KEY, LEAD_DESTINO, LEAD_REMITENTE). Cada tipo de alerta sale como
 * mucho una vez por hora, para no llenar la bandeja justo en medio de un ataque.
 *
 * Solo se envían desde producción. En local y en las vistas previas quedan
 * únicamente en la consola.
 */

import { primeraVez } from './rateLimit';

const UNA_HORA = 60 * 60 * 1000;

export async function alertar(tipo: string, resumen: string, detalle: string): Promise<void> {
  console.error(JSON.stringify({ tipo: 'alerta', alerta: tipo, resumen }));

  if (process.env.VERCEL_ENV !== 'production') return;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;
  if (!(await primeraVez(`alerta:${tipo}`, UNA_HORA))) return;

  const destino = process.env.LEAD_DESTINO ?? 'contacto@desquiciado-sas.com';
  const remitente = process.env.LEAD_REMITENTE ?? 'Chat Desquiciado <onboarding@resend.dev>';

  try {
    const respuesta = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        from: remitente,
        to: [destino],
        subject: `Alerta del sitio: ${resumen}`,
        text: [
          resumen,
          '',
          detalle,
          '',
          'Qué revisar: Vercel > proyecto > Logs, filtrando por "seguridad" o "alerta".',
          'Este aviso no se repite durante la próxima hora aunque el problema siga.',
        ].join('\n'),
      }),
    });
    if (!respuesta.ok) console.error('No salió la alerta por correo:', respuesta.status);
  } catch (error) {
    console.error('No salió la alerta por correo:', (error as Error).message);
  }
}
