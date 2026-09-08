import { motion } from 'framer-motion';
import { useDeviceDetect } from '../hooks/useDeviceDetect';

export function Hero({ onNavigate }: { onNavigate: (section: string) => void }) {
  const { isMobile, isTablet } = useDeviceDetect();
  
  // Adaptive values based on device
  const titleSize = isMobile ? 'text-5xl' : isTablet ? 'text-7xl' : 'text-8xl';
  const spacing = isMobile ? 'mt-16' : 'mt-24';
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-coal">
      {/* Background with Mendoza Vineyard Sketch */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 flex items-center justify-center mix-blend-screen opacity-10">
           <img 
            src="/sketch-vineyard.png" 
            alt="Vineyard Sketch" 
            className={`object-cover ${isMobile ? 'h-full w-auto' : 'w-full h-auto'} pointer-events-none grayscale invert contrast-125`} 
          />
        </div>
        {/* Gradients for depth and color palette integration */}
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-brand-red/40 via-transparent to-coal pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[100%] h-[100%] bg-gradient-to-tr from-brand-red/20 to-transparent rounded-full blur-[150px] pointer-events-none" />
      </div>

      <div className={`relative z-10 container mx-auto px-6 md:px-12 text-center flex flex-col items-center ${spacing}`}>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-cream/50 uppercase tracking-[0.4em] text-xs md:text-sm font-bold mb-0 relative z-20"
        >
          Vino elegido a mano · El Retiro, Antioquia
        </motion.p>
        
        <motion.img 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          src="/desquiciado_monograma_cream.png" 
          alt="Desquiciado Logo" 
          className="w-[118px] md:w-[157px] lg:w-[196px] h-auto mt-[59px] mb-[67px] md:mt-[73px] md:mb-[85px] lg:mt-[96px] lg:mb-[118px] object-contain drop-shadow-2xl relative z-10" 
        />

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className={`font-serif ${titleSize} text-cream font-light mb-8 max-w-6xl leading-[1.1] relative z-20`}
        >
          Donde la <span className="italic text-cream">locura</span> <br className="hidden md:block" /> se encuentra con la tierra
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-cream/70 max-w-3xl text-lg md:text-xl font-light mb-12 hidden md:block text-balance leading-relaxed"
        >
El vino en Colombia estaba mal contado. Que si es de comida de negocios, que si es de aniversario cada dos años, que si hay que saber mucho para tomarlo. Nada de eso.
          <br /><br />
          Traemos lo que <strong>nuestra sommelier sí se tomaría</strong>, elegido a mano, botella por botella. Lo que no pasa el filtro no entra al catálogo. Y sí, se toma un día cualquiera.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto mt-4"
        >
          <button 
            onClick={() => onNavigate('nosotros')} 
            className="px-10 py-5 bg-cream text-coal hover:bg-white hover:scale-105 transition-all duration-300 tracking-widest uppercase text-xs font-bold shadow-2xl"
          >
            La historia
          </button>
          <button 
            onClick={() => onNavigate('experiencias')} 
            className="px-10 py-5 border border-cream/30 text-cream hover:bg-cream/10 hover:border-cream/60 transition-all duration-300 tracking-widest uppercase text-xs font-bold"
          >
            Quiero una cata
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-16 mb-20 md:mb-24 text-[#C5A059] font-serif italic text-lg md:text-xl max-w-2xl text-center leading-relaxed"
        >
          El vino es historia. El vino es acompañar un buen momento. El vino es juventud.
        </motion.p>
      </div>

    </section>
  );
}
