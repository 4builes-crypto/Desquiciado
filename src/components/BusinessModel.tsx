import { motion } from 'framer-motion';

export function BusinessModel() {
  return (
    <section id="modelo" className="relative pt-40 pb-32 px-6 md:px-12 bg-cream overflow-hidden">
      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-24"
        >
          <h2 className="font-serif text-5xl md:text-7xl text-coal">Portafolio</h2>
          <p className="text-xl font-light text-coal/60 italic">desquiciado no vende solo vino: ofrece una experiencia completa de descubrimiento y disfrute</p>
          <div className="w-24 h-[1px] bg-brand-red/30 mx-auto"></div>
        </motion.div>

        {/* Value Proposition */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {[
            { title: 'Curaduría experta', desc: 'Selección con criterio enológico certificado. No cualquier vino, sino los correctos.' },
            { title: 'Conocimiento accesible', desc: 'Asesoría personalizada de nuestra Chef - Sommelier sin costo adicional. El cliente nunca elige solo.' },
            { title: 'Experiencias memorables', desc: 'Eventos y experiencias que educan y conectan. Degustaciones, cenas temáticas, workshops de maridaje y demás.' }
          ].map((pilar, i) => (
            <motion.div 
              key={pilar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/50 backdrop-blur-sm p-10 border-l-4 border-brand-red shadow-sm"
            >
              <h4 className="font-serif text-2xl text-coal mb-4">{pilar.title}</h4>
              <p className="text-lg font-light text-coal/70 leading-relaxed">{pilar.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Product Lines & Services */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-24">
          <div className="space-y-8">
            <h4 className="font-serif text-3xl text-coal border-b border-coal/10 pb-6">Líneas de <span className="italic">Importación</span></h4>
            <div className="space-y-10">
              <div className="group">
                <h5 className="text-brand-red font-bold uppercase tracking-widest text-xs mb-3">Premium</h5>
                <p className="text-lg text-coal/80 font-light leading-relaxed">Vinos boutique de regiones emblemáticas como Mendoza, San Juan y Salta.</p>
              </div>
              <div className="group">
                <h5 className="text-brand-red font-bold uppercase tracking-widest text-xs mb-3">Internacional</h5>
                <p className="text-lg text-coal/80 font-light leading-relaxed">Selección complementaria de los mejores terroirs de España, Italia y Chile.</p>
              </div>
              <div className="group">
                <h5 className="text-brand-red font-bold uppercase tracking-widest text-xs mb-3">Accesible</h5>
                <p className="text-lg text-coal/80 font-light leading-relaxed">Productos con alta relación calidad-precio diseñados para competir en volumen.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-12">
            <h4 className="font-serif text-3xl text-coal border-b border-coal/10 pb-6">Servicios <span className="italic">& Experiencias</span></h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              {[
                { title: 'Eventos', desc: 'Catas temáticas mensuales y cenas maridaje diseñadas por expertos.' },
                { title: 'Educación', desc: 'Workshops prácticos de cata y cocina para público general y corporativo.' },
                { title: 'Consultoría', desc: 'Diseño de cartas y formación de personal para el canal HORECA.' },
                { title: 'Corporativo', desc: 'Kits de regalos personalizados y catering para eventos institucionales.' }
              ].map((service, i) => (
                <motion.div 
                  key={service.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="p-10 border border-coal/5 bg-white/30 hover:bg-white hover:shadow-2xl transition-all duration-500 rounded-sm"
                >
                  <h5 className="font-serif text-2xl text-brand-red mb-4">{service.title}</h5>
                  <p className="text-lg font-light text-coal/70 leading-relaxed">{service.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
