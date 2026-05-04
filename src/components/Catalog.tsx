import { motion } from 'framer-motion';
import { Vino } from '../types';
import { useDeviceDetect } from '../hooks/useDeviceDetect';

const inventory: Vino[] = [
  {
    id: 1,
    name: "Corte Maestro",
    bodega: "Finca Los Andes",
    region: "Valle de Uco, Mendoza",
    notes: "Aromas intensos a frutos negros, notas de tabaco y vainilla. Taninos potentes pero redondos.",
    pairing: "Carnes rojas asadas, quesos maduros y preparaciones con trufa.",
    year: "2018",
  },
  {
    id: 2,
    name: "Malbec de Altura",
    bodega: "Viña Alta",
    region: "Luján de Cuyo, Mendoza",
    notes: "Expresión pura de la fruta roja, acidez vibrante y un final extraordinariamente largo. Mineralidad presente.",
    pairing: "Cordero patagónico, pastas con salsas oscuras y chocolate amargo.",
    year: "2020",
  },
  {
    id: 3,
    name: "Cabernet Franc Reserva",
    bodega: "Bodega del Piedemonte",
    region: "Tupungato, Mendoza",
    notes: "Pimiento rojo asado, especias dulces y un toque herbáceo elegante. Estructura firme y sofisticada.",
    pairing: "Aves de caza, cerdo braseado y vegetales asados con romero.",
    year: "2019",
  }
];

export function Catalog() {
  const { isMobile } = useDeviceDetect();
  
  return (
    <section id="catalogo" className="relative py-32 px-6 md:px-12 bg-coal text-cream overflow-hidden">
      {/* Background Decorative Sketch */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none mix-blend-screen">
        <img src="/sketch-vineyard.png" alt="Vineyard background" className="w-full h-full object-cover" />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        
        <div className="mb-24 text-center">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-serif text-4xl md:text-7xl mb-6"
          >
            Colección <span className="italic text-brand-red">Privada</span>
          </motion.h2>
          <div className="w-24 h-[1px] bg-brand-red mx-auto mb-8"></div>
          <p className="max-w-2xl mx-auto text-cream/60 font-light text-lg leading-relaxed">
            Cada etiqueta ha sido catada y aprobada por nuestra sommelier. No buscamos cantidad, sino la expresión más pura y "desquiciadamente" auténtica de cada terruño.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-20">
          {inventory.map((wine, i) => (
            <motion.div
              key={wine.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group"
            >
              <div className={`w-full bg-cream/5 rounded-sm flex items-end justify-center mb-10 relative overflow-hidden transition-all duration-700 group-hover:bg-brand-red/10 ${isMobile ? 'h-[300px]' : 'h-[450px]'} border border-cream/5 shadow-2xl`}>
                {/* Wine Bottle Visual */}
                <div className={`${isMobile ? 'w-[70px] h-[240px]' : 'w-[90px] h-[350px]'} bg-gradient-to-br from-[#111] via-[#222] to-[#111] border border-cream/10 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.9)] relative transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-4`}>
                  {/* Neck/Capsule */}
                  <div className={`absolute top-0 left-0 right-0 ${isMobile ? 'h-[50px]' : 'h-[90px]'} bg-brand-red/60 border-b border-cream/5`}></div>
                  {/* Label */}
                  <div className={`absolute ${isMobile ? 'top-[90px] h-[100px]' : 'top-[140px] h-[140px]'} left-0 right-0 bg-cream flex flex-col items-center justify-center p-4 text-center text-coal shadow-inner`}>
                    <span className="font-serif text-[8px] md:text-[10px] tracking-[0.3em] uppercase text-coal/40 mb-2">{wine.bodega}</span>
                    <span className="font-serif text-xs md:text-lg font-bold leading-tight border-y border-coal/10 py-2 w-full">{wine.name}</span>
                    <span className="font-serif text-[10px] italic mt-2 text-brand-red">{wine.year}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-2xl group-hover:text-brand-red transition-colors">{wine.name}</h3>
                  <p className="text-xs tracking-[0.2em] uppercase text-brand-red mt-2 font-bold">{wine.region}</p>
                </div>
                
                <div className="space-y-4 border-l border-brand-red/30 pl-6">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-cream/30 block mb-1">Notas</span>
                    <p className="text-sm text-cream/70 font-light italic leading-relaxed">"{wine.notes}"</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-cream/30 block mb-1">Maridaje</span>
                    <p className="text-sm text-cream/70 font-light leading-relaxed">{wine.pairing}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
