export const WHATSAPP = '573022943003';

/** Enlace a WhatsApp con el mensaje ya escrito y listo para enviar. */
export function enlaceWhatsapp(texto: string): string {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;
}

/** Lo que dice quien llega desde la página sin pasar por el chat. */
export const MENSAJE_ELEGIR = 'Hola, vengo de la página. Quiero que me ayuden a elegir un vino.';
