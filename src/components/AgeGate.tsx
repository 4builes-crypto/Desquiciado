import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// La misma clave que usaba el chat antes de que la pregunta pasara a la entrada
// del sitio, así quien ya respondió en el chat no vuelve a ver el aviso.
const CLAVE_EDAD = 'desquiciado_mayor_de_edad';

function yaRespondio(): boolean {
  try {
    return localStorage.getItem(CLAVE_EDAD) === 'si';
  } catch {
    return false;
  }
}

/**
 * Aviso de mayoría de edad al entrar. La respuesta se recuerda en el navegador.
 * Se lee al crear el estado, no en un efecto, para que quien ya respondió no
 * vea el aviso asomarse un instante en cada visita.
 */
export function AgeGate() {
  const [confirmado, setConfirmado] = useState(yaRespondio);
  const [menor, setMenor] = useState(false);
  const botonRef = useRef<HTMLButtonElement>(null);

  // Mientras el aviso está en pantalla, la página de atrás no se desplaza.
  useEffect(() => {
    if (confirmado) return;
    const previo = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previo;
    };
  }, [confirmado]);

  useEffect(() => {
    if (!confirmado && !menor) botonRef.current?.focus();
  }, [confirmado, menor]);

  function confirmar() {
    try {
      localStorage.setItem(CLAVE_EDAD, 'si');
    } catch {
      // Navegador con almacenamiento bloqueado: entra igual, solo que la
      // próxima visita vuelve a preguntar.
    }
    setConfirmado(true);
  }

  return (
    <AnimatePresence>
      {!confirmado && (
        <motion.div
          key="aviso-edad"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="aviso-edad-titulo"
          className="fixed inset-0 z-[80] flex items-center justify-center p-5 bg-noche/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full max-w-md bg-cream rounded-sm shadow-2xl border-t-2 border-gold
                       px-8 py-10 sm:px-12 sm:py-12 text-center"
          >
            <img
              src="/desquiciado_logotipo_principal_coal.png"
              alt="Desquiciado"
              className="h-5 sm:h-6 w-auto mx-auto"
            />

            {menor ? (
              <div className="mt-10 space-y-5">
                <h2 id="aviso-edad-titulo" className="font-serif text-3xl sm:text-4xl text-brand-red leading-tight">
                  Te esperamos
                </h2>
                <p className="font-sans text-[15px] text-coal/75 leading-relaxed">
                  Esta página es solo para mayores de edad. Vuelve cuando cumplas 18.
                </p>
                <button
                  onClick={() => setMenor(false)}
                  className="font-sans text-xs text-oro-tostado underline underline-offset-4
                             decoration-oro-tostado/40 hover:text-brand-red transition-colors"
                >
                  Me equivoqué, sí soy mayor de edad
                </button>
              </div>
            ) : (
              <div className="mt-10">
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-oro-tostado">
                  Antes de servir
                </p>
                <h2 id="aviso-edad-titulo" className="mt-3 font-serif text-3xl sm:text-4xl text-brand-red leading-tight">
                  ¿Eres mayor de edad?
                </h2>
                <p className="mt-4 font-sans text-[15px] text-coal/75 leading-relaxed">
                  Aquí se habla de vino, y para eso necesitamos saber que ya cumpliste 18.
                </p>
                <div className="mt-8 flex flex-col gap-3">
                  <button
                    ref={botonRef}
                    onClick={confirmar}
                    className="w-full bg-brand-red text-cream px-6 py-4 rounded-sm font-sans font-semibold
                               tracking-[0.15em] uppercase text-xs hover:bg-coal transition-colors"
                  >
                    Sí, soy mayor de edad
                  </button>
                  <button
                    onClick={() => setMenor(true)}
                    className="w-full border border-brand-red/40 text-brand-red px-6 py-4 rounded-sm font-sans
                               font-semibold tracking-[0.15em] uppercase text-xs hover:border-brand-red
                               transition-colors"
                  >
                    No, soy menor de 18
                  </button>
                </div>
              </div>
            )}

            <p className="mt-8 pt-6 border-t border-coal/10 font-sans text-[11px] text-coal/60 leading-relaxed">
              El exceso de alcohol es perjudicial para la salud. Prohíbase el expendio de bebidas
              embriagantes a menores de edad.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
