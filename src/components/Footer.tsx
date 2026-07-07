export function Footer({ onNavigate }: { onNavigate: (section: string) => void }) {
  return (
    <footer className="bg-[#1A1A1B] text-[#F5F5DC] py-16 px-6 md:px-12 border-t border-[#F5F5DC]/10">
      <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center md:items-start gap-12">

        <div className="text-center md:text-left space-y-4 flex flex-col items-center md:items-start">
          <img src="/logo_bigw_nobackground.jpg" alt="Desquiciado Logo" className="h-32 md:h-40 w-auto object-contain" />
          <p className="text-[#F5F5DC]/50 font-light text-sm max-w-xs">
            Importadora boutique de vinos internacionales. Exclusividad y pasión en cada botella seleccionada por nuestra sommelier fundadora.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-12 md:gap-24 text-center md:text-left">
          <div className="space-y-4">
            <h5 className="text-xs uppercase tracking-widest text-[#F5F5DC]/80 font-semibold">Navegación</h5>
            <ul className="space-y-2 text-sm font-light text-[#F5F5DC]/70">
              <li><button onClick={() => onNavigate('nosotros')} className="hover:text-[#F5F5DC] transition-colors">Sobre Nosotros</button></li>
              <li><button onClick={() => onNavigate('modelo')} className="hover:text-[#F5F5DC] transition-colors">Portafolio</button></li>
              <li><button onClick={() => onNavigate('experiencias')} className="hover:text-[#F5F5DC] transition-colors">Experiencias</button></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h5 className="text-xs uppercase tracking-widest text-[#F5F5DC]/80 font-semibold">Contacto</h5>
            <ul className="space-y-2 text-sm font-light text-[#F5F5DC]/70">
              <li>desquiciadosas@gmail.com</li>
              <li>+57 3022943003</li>
              <li>Retiro, Antioquia, Colombia</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl mt-16 pt-8 border-t border-[#F5F5DC]/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-light text-[#F5F5DC]/40">
        <p>&copy; {new Date().getFullYear()} Desquiciado Importadora. Todos los derechos reservados.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-[#F5F5DC] transition-colors">Instagram</a>
          <a href="#" className="hover:text-[#F5F5DC] transition-colors">Términos de Servicio</a>
        </div>
      </div>
    </footer>
  );
}
