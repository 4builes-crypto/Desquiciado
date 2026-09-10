import { useCallback, useRef, useState } from 'react';

/**
 * Toda la lógica del chat: estado, envío y lectura del stream.
 *
 * El backend nos devuelve el stream tal cual lo entrega DeepSeek, en formato SSE
 * estilo OpenAI. Lo parseamos acá. Ese formato lo hablan casi todos los
 * proveedores, así que cambiar de modelo no obliga a tocar este archivo.
 */

export type Mensaje = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

/** La etiqueta con la que el bot avisa que hay que pasar a un humano. */
const MARCA_HANDOFF = '[[HANDOFF]]';

/**
 * Quita la etiqueta del texto visible. También recorta un pedazo suelto del
 * final mientras va llegando por el stream, para que no se vea "[[HAN" en
 * pantalla por una fracción de segundo.
 */
function limpiar(texto: string): string {
  let limpio = texto.split(MARCA_HANDOFF).join('');
  for (let i = MARCA_HANDOFF.length - 1; i > 0; i--) {
    const parcial = MARCA_HANDOFF.slice(0, i);
    if (limpio.endsWith(parcial)) {
      limpio = limpio.slice(0, -i);
      break;
    }
  }
  return limpio;
}

const SALUDO: Mensaje = {
  id: 'saludo',
  role: 'assistant',
  content:
    'Hola. Soy el sommelier virtual de Desquiciado. Cuéntame para qué momento andas buscando vino y te recomiendo cuál es mejor para tu ocasión.',
};

export function useChat() {
  const [mensajes, setMensajes] = useState<Mensaje[]>([SALUDO]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Guarda el id del mensaje donde el bot ofreció pasar a un humano, no un
  // simple sí/no. Así la oferta pertenece a ese momento de la conversación y
  // no se queda pegada al fondo del panel para siempre.
  const [handoffEnMensaje, setHandoffEnMensaje] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const enviar = useCallback(
    async (texto: string) => {
      const limpio = texto.trim();
      if (!limpio || cargando) return;

      setError(null);
      const delUsuario: Mensaje = {
        id: `u-${Date.now()}`,
        role: 'user',
        content: limpio,
      };
      const idRespuesta = `a-${Date.now()}`;

      // Historia que va al modelo: sin el saludo, que ya vive en el prompt, y
      // solo los últimos 14 mensajes, que es lo que el servidor usa. Mandar más
      // solo engorda la petición hasta chocar con su tope de tamaño.
      const historia = [...mensajes, delUsuario]
        .filter((m) => m.id !== 'saludo')
        .slice(-14)
        .map((m) => ({ role: m.role, content: m.content }));

      setMensajes((previos) => [
        ...previos,
        delUsuario,
        { id: idRespuesta, role: 'assistant', content: '' },
      ]);
      setCargando(true);

      const controlador = new AbortController();
      abortRef.current = controlador;

      try {
        const respuesta = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: historia }),
          signal: controlador.signal,
        });

        if (!respuesta.ok || !respuesta.body) {
          const detalle = await respuesta.json().catch(() => null);
          throw new Error(
            detalle?.error ?? 'No pudimos responderte. Inténtalo de nuevo.',
          );
        }

        const lector = respuesta.body.getReader();
        const decodificador = new TextDecoder();
        let pendiente = '';
        let acumulado = '';

        for (;;) {
          const { done, value } = await lector.read();
          if (done) break;

          pendiente += decodificador.decode(value, { stream: true });
          const lineas = pendiente.split('\n');
          // La última puede venir cortada a la mitad: la guardamos para la
          // próxima vuelta.
          pendiente = lineas.pop() ?? '';

          for (const linea of lineas) {
            const recortada = linea.trim();
            if (!recortada.startsWith('data:')) continue;

            const datos = recortada.slice(5).trim();
            if (datos === '[DONE]') continue;

            try {
              const evento = JSON.parse(datos);
              const trozo: string = evento?.choices?.[0]?.delta?.content ?? '';
              if (!trozo) continue;

              acumulado += trozo;
              const visible = limpiar(acumulado);
              setMensajes((previos) =>
                previos.map((m) =>
                  m.id === idRespuesta ? { ...m, content: visible } : m,
                ),
              );
            } catch {
              // Un trozo de JSON incompleto: lo ignoramos y seguimos.
            }
          }
        }

        if (acumulado.includes(MARCA_HANDOFF)) setHandoffEnMensaje(idRespuesta);

        if (!limpiar(acumulado).trim()) {
          throw new Error('La respuesta llegó vacía. Inténtalo de nuevo.');
        }
      } catch (fallo) {
        if ((fallo as Error).name === 'AbortError') return;
        setError((fallo as Error).message);
        // Sacamos la burbuja vacía para no dejar un hueco en la conversación.
        setMensajes((previos) =>
          previos.filter((m) => !(m.id === idRespuesta && !m.content)),
        );
      } finally {
        setCargando(false);
        abortRef.current = null;
      }
    },
    [cargando, mensajes],
  );

  const detener = useCallback(() => {
    abortRef.current?.abort();
    setCargando(false);
  }, []);

  /**
   * La conversación sin el saludo, lista para adjuntarla al correo del lead.
   * Va estructurada, no como texto plano: el servidor la necesita así para
   * separar lo que preguntó la persona de lo que respondió el bot.
   */
  const conversacion = useCallback(
    () =>
      mensajes
        .filter((m) => m.id !== 'saludo' && m.content.trim())
        .map((m) => ({ role: m.role, content: m.content.trim() })),
    [mensajes],
  );

  return { mensajes, cargando, error, handoffEnMensaje, enviar, detener, conversacion };
}
