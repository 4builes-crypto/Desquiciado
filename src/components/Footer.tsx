import { Instagram } from 'lucide-react';

const INSTAGRAM_URL = 'https://www.instagram.com/desquiciado.sas?igsi=cG05bTRkbXBvaTYy&utm_source=qr';

export function Footer({ onNavigate }: { onNavigate: (section: string) => void }) {
  return (
    <footer className="bg-[#1A1A1B] text-[#F5F5DC] py-16 px-6 md:px-12 border-t border-[#F5F5DC]/10">
      <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center md:items-start gap-12">

        <div className="text-center md:text-left space-y-4 flex flex-col items-center md:items-start">
          <img src="/desquiciado_logotipo_principal_cream.png" alt="Desquiciado Logo" className="w-[154px] md:w-[192px] h-auto object-contain mt-[55px] mb-[52px] md:mt-[69px] md:mb-[65px]" />
          <p className="text-[#F5F5DC]/50 font-light text-sm max-w-xs">
            Traemos a Colombia el vino que nuestra sommelier sí se tomaría. Elegido a mano, botella por botella. Se toma un día cualquiera.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-12 md:gap-24 text-center md:text-left">
          <div className="space-y-4">
            <h5 className="text-xs uppercase tracking-widest text-[#F5F5DC]/80 font-semibold">Navegación</h5>
            <ul className="space-y-2 text-sm font-light text-[#F5F5DC]/70">
              <li><button onClick={() => onNavigate('nosotros')} className="hover:text-[#F5F5DC] transition-colors">La historia</button></li>
              <li><button onClick={() => onNavigate('modelo')} className="hover:text-[#F5F5DC] transition-colors">Qué hacemos</button></li>
              <li><button onClick={() => onNavigate('experiencias')} className="hover:text-[#F5F5DC] transition-colors">Catas</button></li>
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
          <div className="space-y-4">
            <h5 className="text-xs uppercase tracking-widest text-[#F5F5DC]/80 font-semibold">Redes</h5>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Síguenos en Instagram"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-[#F5F5DC]/30 text-[#F5F5DC]/70 hover:text-[#F5F5DC] hover:border-[#F5F5DC] transition-colors"
            >
              <Instagram size={18} strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl mt-16 pt-8 border-t border-[#F5F5DC]/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-light text-[#F5F5DC]/40">
        <p>&copy; {new Date().getFullYear()} Desquiciado SAS. El Retiro, Antioquia, Colombia.</p>
        <div className="flex gap-4">
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[#F5F5DC] transition-colors">Instagram</a>
          <a href="#" className="hover:text-[#F5F5DC] transition-colors">Términos</a>
        </div>
      </div>
    </footer>
  );
}
