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
          <h2 className="font-serif text-5xl md:text-7xl text-coal">Qué hacemos</h2>
          <p className="text-xl font-light text-coal/60 italic">Traemos el vino, lo explicamos sin dictar cátedra y armamos la ocasión para tomárselo</p>
          <div className="w-24 h-[1px] bg-brand-red/30 mx-auto"></div>
        </motion.div>

        {/* Value Proposition */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {[
            { title: 'Elegido a mano', desc: 'Cada etiqueta pasó por la nariz de nuestra sommelier antes de entrar. No traemos catálogos enteros, traemos lo que se aguanta el filtro.' },
            { title: 'Nadie elige solo', desc: 'Te preguntamos para qué lo quieres, cómo te gusta y qué vas a comer. Después te decimos cuál. Sin cobrar por la conversación.' },
            { title: 'Catas desquiciadas', desc: 'Catas, cenas y talleres donde se aprende tomando. Sin solemnidad, sin escupidera y sin nadie corrigiéndote la copa.' }
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
            <h4 className="font-serif text-3xl text-coal border-b border-coal/10 pb-6">De dónde <span className="italic">viene</span></h4>
            <div className="space-y-10">
              <div className="group">
                <h5 className="text-brand-red font-bold uppercase tracking-widest text-xs mb-3">Hoy</h5>
                <p className="text-lg text-coal/80 font-light leading-relaxed">Vino argentino. Mendoza, Valle de Uco, San Juan y Salta, elegido en el lugar.</p>
              </div>
              <div className="group">
                <h5 className="text-brand-red font-bold uppercase tracking-widest text-xs mb-3">Lo que sigue</h5>
                <p className="text-lg text-coal/80 font-light leading-relaxed">Otros orígenes: Chile, España, Estados Unidos. Argentina es el arranque, no el techo.</p>
              </div>
              <div className="group">
                <h5 className="text-brand-red font-bold uppercase tracking-widest text-xs mb-3">Después</h5>
                <p className="text-lg text-coal/80 font-light leading-relaxed">Vinoteca propia, tiendas en los municipios turísticos, ferias y marca propia.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-12">
            <h4 className="font-serif text-3xl text-coal border-b border-coal/10 pb-6">Lo que <span className="italic">montamos</span></h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              {[
                { title: 'Catas', desc: 'Una cata desquiciada al mes y cenas armadas por nuestra sommelier. Trae sed.' },
                { title: 'Talleres', desc: 'Cata y cocina para quien quiera aprender, y también para empresas.' },
                { title: 'Restaurantes y bares', desc: 'Armamos la carta de vinos y entrenamos al equipo que la va a vender.' },
                { title: 'Empresas', desc: 'Regalos armados a la medida y vino para eventos de la compañía.' }
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
