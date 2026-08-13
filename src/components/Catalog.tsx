import { motion } from 'framer-motion';
import { Download, Eye } from 'lucide-react';

export function Catalog() {
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
          Nuestro <span className="italic text-gold">Catálogo</span>
        </motion.h2>
        <div className="w-24 h-[1px] bg-gold mb-12"></div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-cream/80 font-light text-lg mb-12 max-w-2xl leading-relaxed"
        >
          Descubre nuestra selección exclusiva de vinos. Cada botella ha sido cuidadosamente seleccionada para ofrecerte la expresión más auténtica de su terruño.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-6 w-full max-w-md mx-auto"
        >
          <a 
            href="/catalogo.pdf" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 bg-gold text-coal px-8 py-5 rounded-sm hover:bg-cream hover:text-coal transition-all duration-300 font-bold tracking-[0.2em] uppercase text-sm border border-gold w-full"
          >
            <Eye size={20} />
            Visualizar Catálogo
          </a>
          
          <a 
            href="/catalogo.pdf" 
            download="Catalogo_Vinos_Desquiciado.pdf"
            className="inline-flex items-center justify-center gap-3 bg-transparent text-gold px-8 py-5 rounded-sm hover:bg-gold hover:text-coal transition-all duration-300 font-bold tracking-[0.2em] uppercase text-sm border border-gold w-full"
          >
            <Download size={20} />
            Descargar PDF
          </a>
        </motion.div>
      </div>
    </section>
  );
}
