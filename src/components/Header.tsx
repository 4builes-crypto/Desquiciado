import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Header({ activeSection, onNavigate }: { activeSection: string, onNavigate: (section: string) => void }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Sobre Nosotros', id: 'nosotros' },
    { name: 'Portafolio', id: 'modelo' },
    { name: 'Experiencias Privadas', id: 'experiencias' },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${isScrolled || activeSection !== 'home' ? 'bg-cream/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
        }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
        <button
          onClick={() => onNavigate('home')}
          className="transition-colors duration-300 flex items-center justify-start -ml-8 md:-ml-20"
        >
          <img 
            src={isScrolled || activeSection !== 'home' ? '/logo_bigb_nobackground.png' : '/logo_bigw_nobackground.jpg'} 
            alt="Desquiciado Logo" 
            className="h-28 md:h-36 w-auto object-contain object-left transform origin-left scale-110 md:scale-125 -my-10 md:-my-12"
          />
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 items-center -mr-8 md:-mr-16">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className={`text-sm uppercase tracking-wider transition-colors duration-300 ${isScrolled || activeSection !== 'home'
                ? (activeSection === link.id ? 'text-brand-red font-bold' : 'text-coal/80 hover:text-brand-red')
                : 'text-cream/80 hover:text-cream'
                }`}
            >
              {link.name}
            </button>
          ))}
        </nav>

        {/* Mobile Toggle */}
        <button
          className={`md:hidden -mr-6 ${isScrolled || activeSection !== 'home' ? 'text-coal' : 'text-cream'}`}
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-cream z-50 flex flex-col pt-24 px-6"
          >
            <button
              className="absolute top-6 right-6 text-coal"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={32} />
            </button>
            <nav className="flex flex-col gap-8 mt-12 items-center">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    onNavigate(link.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`font-serif text-3xl transition-colors duration-300 ${activeSection === link.id ? 'text-brand-red' : 'text-coal hover:text-brand-red'
                    }`}
                >
                  {link.name}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
