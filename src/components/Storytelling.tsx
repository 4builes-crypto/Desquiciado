import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDeviceDetect } from '../hooks/useDeviceDetect';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function Storytelling() {
  const { isMobile, isTablet } = useDeviceDetect();
  const [showCerts, setShowCerts] = useState(false);

  return (
    <section id="nosotros" className="relative pt-40 pb-32 px-6 md:px-12 bg-cream overflow-hidden">
      {/* Background Decorative Sketch */}
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
        <img
          src="/sketch-grapes.png"
          alt="Vintage grapes sketch"
          className="w-full h-full object-contain object-right"
        />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-32">

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h2 className="font-serif text-4xl md:text-5xl lg:text-7xl text-coal leading-tight">
              Un día nos <br /><span className="italic text-brand-red">dimos cuenta</span>
            </h2>
            <div className="w-16 h-[2px] bg-brand-red/50"></div>
            <div className="space-y-6 text-coal/80 text-lg md:text-xl font-light leading-relaxed">
              <p>
                La gente en Colombia estaba pagando de más por vinos malos. Y, cuando acertaba con el precio, terminaba llevándose el vino equivocado para la ocasión, porque no había nadie acompañándola en la elección.
              </p>
              <p>
                De ahí surgió la idea. Tenemos una sommelier en la familia, con el paladar, los contactos y la posibilidad de ir a catar donde se cata. La decisión fue simple: traer el vino que ella sí se tomaría, y no soltarle la mano a nadie a la hora de elegirlo.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className={`relative w-full rounded-sm overflow-hidden border border-coal/10 shadow-xl ${isMobile ? 'h-[400px]' : isTablet ? 'h-[500px]' : 'h-[600px]'}`}
          >
            <img
              src="/sketch-vineyard.png"
              alt="Vineyard Sketch"
              className="w-full h-full object-cover grayscale contrast-125"
            />
            <div className="absolute inset-0 bg-brand-red/5 mix-blend-multiply"></div>
            <div className="absolute bottom-10 left-10 right-10 p-8 bg-cream/80 backdrop-blur-md border border-coal/5">
              <p className="font-serif text-coal italic text-xl md:text-2xl text-center">Si no nos lo tomaríamos nosotros, no lo vendemos.</p>
            </div>
          </motion.div>

        </div>

        {/* Rosenda Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-32 grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white p-10 lg:p-16 rounded-sm shadow-xl border border-coal/5 relative overflow-hidden"
        >
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-brand-red/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="md:col-span-5 text-center md:text-left">
            <h3 className="font-serif text-3xl md:text-4xl text-brand-red mb-2">Nuestra Chef - Sommelier</h3>
            <p className="uppercase tracking-widest text-coal/50 text-xs font-bold">La que elige</p>
          </div>
          
          <div className="md:col-span-7 space-y-6 text-coal/80 text-lg font-light leading-relaxed border-t md:border-t-0 md:border-l border-coal/10 pt-6 md:pt-0 md:pl-10">
            <p>
              La que elige uno por uno los vinos que tenemos, la que te dice con qué comida van y la que arma las catas es <strong>Rosenda</strong>, nuestra sommelier desquiciada.
            </p>
            <p>
              Empezó en Colombia estudiando cocina, y ahí se le hizo el paladar. Después se fue a vivir a Mendoza a formarse como sommelier. Hoy cata en Argentina y decide qué entra al catálogo y qué se queda por fuera. Ese es el filtro, y no tiene atajos.
            </p>
            
            <div className="pt-4">
              <button 
                onClick={() => setShowCerts(!showCerts)}
                className="flex items-center gap-2 text-brand-red font-medium hover:text-brand-red/80 transition-colors"
              >
                <span>Ver los diplomas</span>
                {showCerts ? <ChevronUp /> : <ChevronDown />}
              </button>
              
              <AnimatePresence>
                {showCerts && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-6 pb-2 space-y-6">
                      <p className="text-sm italic text-coal/70 border-l-2 border-brand-red/30 pl-4">
                        Queremos que sepas quién eligió tu vino. Por eso los diplomas están acá y no en un cajón.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <a 
                          href="/Certificados/Diploma_somelier_argentina.pdf" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex flex-col p-4 border border-coal/10 rounded hover:border-brand-red/50 hover:bg-brand-red/5 transition-all group"
                        >
                          <span className="font-medium text-coal group-hover:text-brand-red transition-colors">EAS Argentina</span>
                          <span className="text-sm text-coal/60">Ver Diploma (PDF)</span>
                        </a>
                        <a 
                          href="/Certificados/Diploma_somelier_espana.pdf" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex flex-col p-4 border border-coal/10 rounded hover:border-brand-red/50 hover:bg-brand-red/5 transition-all group"
                        >
                          <span className="font-medium text-coal group-hover:text-brand-red transition-colors">EAS España</span>
                          <span className="text-sm text-coal/60">Ver Diploma (PDF)</span>
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Identity Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6 p-10 bg-coal text-cream rounded-sm"
          >
            <h3 className="font-serif text-3xl italic text-cream">Propósito</h3>
            <p className="text-lg font-light leading-relaxed opacity-90">
              Cambiar la percepción del vino en Colombia. Sacarlo de la comida de negocios y del aniversario cada dos años, y ponerlo en un día cualquiera. Todo lo que vendemos pasó por la nariz de nuestra sommelier.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-6 p-10 border border-coal/10 rounded-sm flex flex-col justify-center"
          >
            <h3 className="font-serif text-3xl italic text-brand-red">Visión</h3>
            <p className="text-lg font-light leading-relaxed text-coal/80">
              Ser la importadora de referencia en Antioquia, con distribución nacional y un catálogo que no dependa de un solo origen. Esta es la ruta, en el orden en que la vamos a recorrer.
            </p>
          </motion.div>
        </div>

        {/* La ruta de la visión */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 border-t border-coal/10 pt-12 mb-32"
        >
          {[
            { step: 'Hoy', desc: 'Vino argentino. Mendoza, Valle de Uco, San Juan y Salta, elegido en el lugar.' },
            { step: 'Lo que sigue', desc: 'Otros orígenes: Chile, España, Estados Unidos. Argentina es el arranque, no el techo.' },
            { step: 'Más adelante', desc: 'Vinoteca propia, tiendas en los municipios turísticos, ferias y marca propia.' }
          ].map((etapa) => (
            <div key={etapa.step}>
              <h5 className="text-brand-red font-bold uppercase tracking-widest text-xs mb-3">{etapa.step}</h5>
              <p className="text-lg text-coal/80 font-light leading-relaxed">{etapa.desc}</p>
            </div>
          ))}
        </motion.div>


        {/* Values Section */}
        <div className="space-y-12">
          <div className="text-center">
            <h3 className="font-serif text-4xl text-coal mb-4">Cómo somos</h3>
            <div className="w-24 h-[1px] bg-brand-red/30 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Disruptivos', desc: 'No hacemos lo que hace la categoría, aunque sea más fácil.' },
              { title: 'Divertidos', desc: 'Sin chistes. La gracia está en el atrevimiento, no en el remate.' },
              { title: 'Modernos', desc: 'Hablamos como habla la gente hoy, no como un catálogo de 1990.' },
                            { title: 'Con criterio', desc: 'Hay alguien que sabe detrás de cada botella. Ese es el límite de la locura.' }
            ].map((val, idx) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 text-center group hover:bg-white transition-colors duration-300 rounded-sm border border-transparent hover:border-coal/5"
              >
                <div className="text-brand-red font-serif italic text-2xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {val.title}
                </div>
                <p className="text-sm font-light text-coal/60 leading-relaxed">
                  {val.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
