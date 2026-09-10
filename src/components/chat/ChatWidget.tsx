import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, MessageSquare, Square, Wine, X } from 'lucide-react';
import { useChat } from './useChat';
import { LeadForm } from './LeadForm';
import { enlaceWhatsapp as enlaceConTexto } from '../../lib/whatsapp';

type Vista = 'chat' | 'formulario';

export function ChatWidget({ onAbiertoChange }: { onAbiertoChange?: (abierto: boolean) => void }) {
  const [abierto, setAbierto] = useState(false);
  const [vista, setVista] = useState<Vista>('chat');
  const { mensajes, cargando, error, handoffEnMensaje, enviar, detener, conversacion } = useChat();
  const [borrador, setBorrador] = useState('');
  const finRef = useRef<HTMLDivElement>(null);
  const entradaRef = useRef<HTMLTextAreaElement>(null);

  // La burbuja de WhatsApp necesita saber si el panel está abierto para esconderse.
  useEffect(() => {
    onAbiertoChange?.(abierto);
  }, [abierto, onAbiertoChange]);

  // Baja al final también cuando aparecen los botones de paso a humano o el
  // formulario, no solo cuando llega un mensaje.
  useEffect(() => {
    // Mientras el texto llega token a token, el salto tiene que ser inmediato:
    // un desplazamiento suave por cada token nunca alcanza a terminar y el
    // panel se queda corto del final. Suave solo cuando ya no hay stream.
    finRef.current?.scrollIntoView({
      behavior: cargando ? 'auto' : 'smooth',
      block: 'end',
    });
  }, [mensajes, cargando, vista, handoffEnMensaje]);

  useEffect(() => {
    if (abierto) entradaRef.current?.focus();
  }, [abierto]);

  // Escape cierra el panel.
  useEffect(() => {
    if (!abierto) return;
    function alPresionar(e: KeyboardEvent) {
      if (e.key === 'Escape') setAbierto(false);
    }
    window.addEventListener('keydown', alPresionar);
    return () => window.removeEventListener('keydown', alPresionar);
  }, [abierto]);

  // La oferta de pasar a un humano vive solo mientras ese mensaje sea el último
  // de la conversación. Si el bot vuelve a ofrecerla más adelante, reaparece.
  const ofrecePaso =
    vista === 'chat' &&
    !cargando &&
    handoffEnMensaje !== null &&
    mensajes[mensajes.length - 1]?.id === handoffEnMensaje;

  function enviarBorrador() {
    const texto = borrador;
    setBorrador('');
    void enviar(texto);
  }

  /**
   * Mensaje que WhatsApp deja escrito y listo para enviar.
   *
   * Va en primera persona y solo con lo que preguntó la persona, no con el
   * historial completo: quien escribe es el cliente, y nadie manda por WhatsApp
   * una transcripción de la charla con un bot. Con sus últimas preguntas basta
   * para que el equipo sepa de qué se trata.
   */
  const enlaceWhatsapp = () => {
    const preguntas = conversacion()
      .filter((m) => m.role === 'user')
      .map((m) => (m.content.length > 160 ? `${m.content.slice(0, 157)}...` : m.content))
      .slice(-3);

    const texto = preguntas.length
      ? `Hola, vengo del chat de la página. Les escribo por esto:\n\n${preguntas
          .map((p) => `· ${p}`)
          .join('\n')}`
      : 'Hola, vengo del chat de la página.';

    return enlaceConTexto(texto);
  };

  return (
    <>
      {/* ---------- Burbuja ---------- */}
      <motion.button
        onClick={() => setAbierto((v) => !v)}
        aria-label={abierto ? 'Cerrar el chat' : 'Abrir el chat con el sommelier virtual'}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.4 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`fixed bottom-5 right-5 z-[60] w-14 h-14 rounded-full bg-brand-red text-cream
                   border border-gold/40 shadow-xl items-center justify-center
                   hover:border-gold transition-colors
                   ${/* En móvil el panel ocupa toda la pantalla y la burbuja taparía el
                        botón de enviar, así que la escondemos: el panel ya trae su propia X. */ ''}
                   ${abierto ? 'hidden sm:flex' : 'flex'}`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {abierto ? (
            <motion.span key="cerrar" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={22} strokeWidth={1.5} />
            </motion.span>
          ) : (
            <motion.span key="abrir" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <Wine size={22} strokeWidth={1.5} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ---------- Panel ---------- */}
      <AnimatePresence>
        {abierto && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            role="dialog"
            aria-label="Chat con el sommelier virtual de Desquiciado"
            className="fixed z-[59] bg-noche border border-humo/25 shadow-2xl flex flex-col
                       inset-0 rounded-none
                       sm:inset-auto sm:bottom-24 sm:right-5 sm:w-[380px] sm:h-[min(600px,calc(100vh-8rem))] sm:rounded-sm"
          >
            {/* Encabezado */}
            <header className="flex items-center gap-3 px-4 py-3 bg-brand-red border-b border-gold/25 shrink-0">
              <img
                src="/desquiciado_monograma_cream.png"
                alt=""
                className="h-5 w-auto opacity-90"
              />
              <div className="flex-1 min-w-0">
                <p className="font-serif text-base text-cream leading-tight">
                  Sommelier virtual
                </p>
                <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-cream/60">
                  Elegido a mano
                </p>
              </div>
              <button
                onClick={() => setAbierto(false)}
                aria-label="Cerrar"
                className="text-cream/70 hover:text-cream transition-colors p-1"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </header>

              <>
                {/* Conversacion */}
                <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
                  {mensajes.map((m) => (
                    <div
                      key={m.id}
                      className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
                    >
                      <div
                        className={
                          m.role === 'user'
                            ? 'max-w-[85%] bg-brand-red text-cream rounded-sm px-3.5 py-2.5 font-sans text-sm leading-relaxed whitespace-pre-wrap'
                            : 'max-w-[88%] bg-coal text-cream/95 rounded-sm px-3.5 py-2.5 font-sans text-sm leading-relaxed whitespace-pre-wrap border border-humo/15'
                        }
                      >
                        {m.content || (
                          <span className="inline-flex gap-1 items-center py-1" aria-label="Escribiendo">
                            {[0, 1, 2].map((i) => (
                              <motion.span
                                key={i}
                                className="w-1.5 h-1.5 rounded-full bg-gold/70"
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
                              />
                            ))}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  {error && (
                    <p className="font-sans text-xs text-ambar bg-ambar/10 border border-ambar/25 rounded-sm px-3 py-2">
                      {error}
                    </p>
                  )}

                  {/* Paso a un humano.
                      Solo aparece pegado al mensaje donde el bot lo ofreció: en
                      cuanto la persona sigue escribiendo, desaparece. Antes se
                      quedaba fijo al fondo del panel el resto de la sesión. */}
                  {ofrecePaso && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-wrap gap-2"
                    >
                      <a
                        href={enlaceWhatsapp()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 border border-gold/45 text-gold
                                   px-3 py-1.5 rounded-sm font-sans text-[11px] tracking-wide
                                   hover:bg-gold hover:text-coal transition-colors"
                      >
                        <MessageSquare size={12} strokeWidth={2} />
                        WhatsApp
                      </a>
                      <button
                        onClick={() => setVista('formulario')}
                        className="inline-flex items-center gap-1.5 border border-humo/40 text-humo
                                   px-3 py-1.5 rounded-sm font-sans text-[11px] tracking-wide
                                   hover:text-cream hover:border-cream transition-colors"
                      >
                        Dejar mis datos
                      </button>
                    </motion.div>
                  )}

                  {vista === 'formulario' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border-t border-humo/20 pt-3"
                    >
                      <LeadForm conversacion={conversacion()} onListo={() => setVista('chat')} />
                    </motion.div>
                  )}

                  <div ref={finRef} />
                </div>

                {/* Entrada */}
                <div className="shrink-0 border-t border-humo/20 p-3">
                  <div className="flex items-end gap-2">
                    <textarea
                      ref={entradaRef}
                      value={borrador}
                      onChange={(e) => setBorrador(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          enviarBorrador();
                        }
                      }}
                      rows={1}
                      maxLength={2000}
                      placeholder="Qué vas a comer, para qué ocasión..."
                      aria-label="Escribe tu mensaje"
                      className="flex-1 bg-transparent border border-humo/35 rounded-sm px-3 py-2.5
                                 font-sans text-sm text-cream placeholder:text-humo resize-none
                                 max-h-28 focus:border-gold focus:outline-none transition-colors"
                    />
                    {cargando ? (
                      <button
                        onClick={detener}
                        aria-label="Detener la respuesta"
                        className="shrink-0 w-10 h-10 rounded-sm border border-humo/35 text-humo
                                   flex items-center justify-center hover:text-cream hover:border-cream
                                   transition-colors"
                      >
                        <Square size={14} strokeWidth={2} fill="currentColor" />
                      </button>
                    ) : (
                      <button
                        onClick={enviarBorrador}
                        disabled={!borrador.trim()}
                        aria-label="Enviar"
                        className="shrink-0 w-10 h-10 rounded-sm bg-gold text-coal flex items-center
                                   justify-center hover:bg-cream transition-colors
                                   disabled:opacity-35 disabled:hover:bg-gold"
                      >
                        <ArrowUp size={17} strokeWidth={2.2} />
                      </button>
                    )}
                  </div>
                  <p className="mt-2 font-sans text-[10px] text-humo leading-snug">
                    Te acompañamos a elegir. Precios y pedidos los ve{' '}
                    <a
                      href={enlaceWhatsapp()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-humo/40 underline-offset-2 hover:text-gold transition-colors"
                    >
                      una persona del equipo
                    </a>
                    .
                  </p>
                </div>
              </>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
