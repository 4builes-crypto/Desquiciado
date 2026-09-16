import { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, Eye } from 'lucide-react';
import { BODEGAS, VINOS as TODOS } from '../../compartido/vinos';
import { TarjetaVino } from './vinos/TarjetaVino';
import { FichaVino } from './vinos/FichaVino';

// Solo lo que ya se puede vender, y solo las bodegas que tienen algo a la venta.
const VINOS = TODOS.filter((v) => v.enVenta);
const BODEGAS_EN_VENTA = BODEGAS.filter((b) => VINOS.some((v) => v.bodega === b.nombre));

export function Catalog() {
  const [abierto, setAbierto] = useState<number | null>(null);

  const cerrar = useCallback(() => setAbierto(null), []);
  const anterior = useCallback(() => setAbierto((i) => (i === null ? i : (i - 1 + VINOS.length) % VINOS.length)), []);
  const siguiente = useCallback(() => setAbierto((i) => (i === null ? i : (i + 1) % VINOS.length)), []);

  return (
    <section id="catalogo" className="relative py-32 px-6 md:px-12 bg-coal text-cream min-h-screen flex flex-col justify-center items-center">
      {/* Background Decorative Sketch */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none mix-blend-overlay">
        <img src="/sketch-vineyard.png" alt="Vineyard background" className="w-full h-full object-cover" />
      </div>

      <div className="container mx-auto max-w-3xl relative z-10 flex flex-col items-center text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-5xl md:text-7xl mb-6"
        >
          Nuestros <span className="italic text-gold">vinos</span>
        </motion.h2>
        <div className="w-24 h-[1px] bg-gold mb-12"></div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-cream/80 font-light text-lg mb-12 max-w-2xl leading-relaxed"
        >
          Cada botella de esta lista la eligió personalmente nuestra sommelier. Lo que no pasa su filtro no entra. Hoy vienen de Mendoza; ya estamos detrás de otros orígenes.
        </motion.p>
      </div>

      <div className="container mx-auto max-w-6xl relative z-10 space-y-16">
        {BODEGAS_EN_VENTA.map((bodega) => (
          <div key={bodega.nombre}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              className="mb-6 grid gap-2 border-b border-gold/30 pb-5 md:grid-cols-[auto_1fr] md:items-end md:gap-10"
            >
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">{bodega.lugar}</p>
                <h3 className="mt-1 font-serif text-3xl md:text-4xl">{bodega.nombre}</h3>
              </div>
              <p className="max-w-2xl text-sm font-light leading-relaxed text-cream/60 md:justify-self-end md:text-right">
                {bodega.descripcion}
              </p>
            </motion.div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {VINOS.map((vino, i) =>
                vino.bodega === bodega.nombre ? (
                  <motion.div
                    key={vino.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.5 }}
                  >
                    <TarjetaVino vino={vino} alAbrir={() => setAbierto(i)} />
                  </motion.div>
                ) : null,
              )}
            </div>
          </div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 mt-20 flex flex-col gap-4 w-full max-w-2xl mx-auto sm:flex-row"
      >
        <a
          href="/catalogo.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-1 items-center justify-center gap-3 bg-gold text-coal px-6 py-5 rounded-sm hover:bg-cream hover:text-coal transition-all duration-300 font-bold tracking-[0.2em] uppercase text-sm border border-gold"
        >
          <Eye size={20} />
          Ver el catálogo
        </a>

        <a
          href="/catalogo.pdf"
          download="Catalogo_Vinos_Desquiciado.pdf"
          className="inline-flex flex-1 items-center justify-center gap-3 bg-transparent text-gold px-6 py-5 rounded-sm hover:bg-gold hover:text-coal transition-all duration-300 font-bold tracking-[0.2em] uppercase text-sm border border-gold"
        >
          <Download size={20} />
          Descargarlo en PDF
        </a>
      </motion.div>

      <AnimatePresence>
        {abierto !== null && (
          <FichaVino
            key="ficha"
            vino={VINOS[abierto]}
            alCerrar={cerrar}
            alAnterior={anterior}
            alSiguiente={siguiente}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
