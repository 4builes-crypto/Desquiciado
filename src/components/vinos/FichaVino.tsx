import { useEffect, useRef, type ReactNode, type Ref } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import {
  Award,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  Hourglass,
  Leaf,
  MapPin,
  Mountain,
  Thermometer,
  X,
} from 'lucide-react';
import type { Vino } from '../../../compartido/vinos';
import { enlaceWhatsapp } from '../../lib/whatsapp';
import { analitica, distinciones, ESTILO, imagenDe, temperatura } from './formato';
import { NotaDeCata } from './NotaDeCata';

/**
 * La ficha del catálogo en PDF, en pantalla. Va en un portal porque la sección
 * entra con una animación de transform y eso rompe el position: fixed.
 */
export function FichaVino({
  vino,
  alCerrar,
  alAnterior,
  alSiguiente,
}: {
  vino: Vino;
  alCerrar: () => void;
  alAnterior: () => void;
  alSiguiente: () => void;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const cerrar = useRef<HTMLButtonElement>(null);

  // Teclado, bloqueo del scroll de fondo y foco de vuelta a la tarjeta al cerrar.
  useEffect(() => {
    const previoFoco = document.activeElement as HTMLElement | null;
    const previoScroll = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    cerrar.current?.focus();

    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === 'Escape') alCerrar();
      else if (e.key === 'ArrowLeft') alAnterior();
      else if (e.key === 'ArrowRight') alSiguiente();
      else if (e.key === 'Tab' && panel.current) {
        const enfocables = panel.current.querySelectorAll<HTMLElement>('a[href], button');
        const primero = enfocables[0];
        const ultimo = enfocables[enfocables.length - 1];
        if (e.shiftKey && document.activeElement === primero) {
          e.preventDefault();
          ultimo.focus();
        } else if (!e.shiftKey && document.activeElement === ultimo) {
          e.preventDefault();
          primero.focus();
        }
      }
    };
    document.addEventListener('keydown', alTeclear);
    return () => {
      document.removeEventListener('keydown', alTeclear);
      document.body.style.overflow = previoScroll;
      previoFoco?.focus();
    };
  }, [alCerrar, alAnterior, alSiguiente]);

  // Al pasar a otro vino, la ficha arranca desde arriba.
  useEffect(() => {
    panel.current?.scrollTo({ top: 0 });
  }, [vino.id]);

  const premios = distinciones(vino);
  const pedido = enlaceWhatsapp(`Hola, vengo de la página. Me interesa el ${vino.nombre} de ${vino.bodega}.`);

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-noche/80 backdrop-blur-sm sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={alCerrar}
    >
      <motion.div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ficha-titulo"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-t-2xl bg-cream text-coal shadow-2xl sm:rounded-2xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-coal/10 bg-cream/95 px-4 py-3 backdrop-blur sm:px-6">
          <div className="flex gap-1">
            <BotonIcono etiqueta="Vino anterior" onClick={alAnterior}>
              <ChevronLeft size={20} />
            </BotonIcono>
            <BotonIcono etiqueta="Vino siguiente" onClick={alSiguiente}>
              <ChevronRight size={20} />
            </BotonIcono>
          </div>
          <span className="versalita truncate text-oro-tostado">{vino.bodega}</span>
          <BotonIcono etiqueta="Cerrar" onClick={alCerrar} refBoton={cerrar}>
            <X size={20} />
          </BotonIcono>
        </div>

        <div className="grid gap-8 px-6 pb-8 pt-6 sm:px-10 sm:pb-10 md:grid-cols-[1fr_15rem]">
          <div className="min-w-0">
            <h3 id="ficha-titulo" className="font-serif text-4xl leading-tight text-brand-red sm:text-5xl">
              {vino.varietal} <span className="whitespace-nowrap">{vino.anada}</span>
            </h3>
            <p className="versalita mt-3 text-oro-tostado">
              {vino.linea} · {ESTILO[vino.estilo]}
            </p>
            <p className="mt-3 flex items-start gap-2 text-sm font-medium text-brand-red">
              <MapPin size={16} className="mt-0.5 shrink-0" />
              {vino.origen}
            </p>

            <div className="my-6 h-px bg-gradient-to-r from-gold via-gold/60 to-transparent" />

            {/* En móvil la botella va arriba de la descripción. */}
            <div className="mb-6 flex justify-center md:hidden">
              <Botella vino={vino} className="h-64" />
            </div>

            <dl className="space-y-3 text-[15px] leading-relaxed">
              <Sensorial etiqueta="Vista">{vino.color}</Sensorial>
              <Sensorial etiqueta="Nariz">{vino.nariz}</Sensorial>
              <Sensorial etiqueta="Boca">{vino.boca}</Sensorial>
            </dl>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <Dato icono={<Leaf size={18} />} titulo="Composición">
                {vino.composicion}
              </Dato>
              <Dato icono={<Thermometer size={18} />} titulo="Servicio">
                {temperatura(vino)}
              </Dato>
              {vino.crianza && (
                <Dato icono={<Hourglass size={18} />} titulo="Crianza">
                  {vino.crianza}
                </Dato>
              )}
              <Dato icono={<FlaskConical size={18} />} titulo="Datos analíticos">
                <ul>
                  {analitica(vino).map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </Dato>
              {premios.length > 0 && (
                <Dato icono={<Award size={18} />} titulo="Distinciones" ancho>
                  <ul className="space-y-1">
                    {premios.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </Dato>
              )}
              {vino.vinedo && (
                <Dato icono={<Mountain size={18} />} titulo="Viñedo" ancho>
                  {vino.vinedo}
                </Dato>
              )}
            </div>

            <div className="mt-8 border-t border-coal/10 pt-6">
              <p className="versalita text-coal/50">Notas de cata</p>
              <div className="mt-4 grid grid-cols-3 gap-y-5 sm:grid-cols-5">
                {vino.notas.map((n) => (
                  <NotaDeCata
                    key={n}
                    nota={n}
                    tamano="h-14 w-14"
                    className="border-l border-brand-red/25 px-2 font-serif text-xs uppercase tracking-wide text-brand-red first:border-l-0"
                  />
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-xl bg-brand-red px-6 py-5 text-cream">
              <p className="versalita text-gold">Cuándo abrirlo</p>
              <p className="mt-2 font-serif text-lg italic leading-snug">{vino.cuandoTomarlo}</p>
            </div>

            <a
              href={pedido}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-sm border border-brand-red bg-brand-red px-6 py-4 text-sm font-bold uppercase tracking-[0.2em] text-cream transition-colors hover:bg-coal sm:w-auto"
            >
              Pedir este vino
            </a>
          </div>

          <div className="hidden md:block">
            <div className="sticky top-20 flex justify-center">
              <div className="absolute bottom-6 h-56 w-56 rounded-full bg-gold/15" aria-hidden />
              <Botella vino={vino} className="relative h-[30rem]" />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}

function Botella({ vino, className }: { vino: Vino; className: string }) {
  return (
    <img
      src={imagenDe(vino)}
      alt={`Botella de ${vino.nombre}`}
      draggable={false}
      className={`w-auto object-contain drop-shadow-[0_18px_20px_rgba(26,26,27,0.3)] ${className}`}
    />
  );
}

function Sensorial({ etiqueta, children }: { etiqueta: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[4.5rem_1fr] gap-3">
      <dt className="versalita pt-1 text-oro-tostado">{etiqueta}</dt>
      <dd className="text-coal/85">{children}</dd>
    </div>
  );
}

function Dato({ icono, titulo, children, ancho }: { icono: ReactNode; titulo: string; children: ReactNode; ancho?: boolean }) {
  return (
    <div className={`flex gap-3 ${ancho ? 'sm:col-span-2' : ''}`}>
      <span className="mt-0.5 text-oro-tostado">{icono}</span>
      <div className="min-w-0 border-l border-gold/50 pl-3">
        <p className="versalita text-oro-tostado">{titulo}</p>
        <div className="mt-1 text-[15px] leading-relaxed text-coal/85">{children}</div>
      </div>
    </div>
  );
}

function BotonIcono({
  etiqueta,
  onClick,
  children,
  refBoton,
}: {
  etiqueta: string;
  onClick: () => void;
  children: ReactNode;
  refBoton?: Ref<HTMLButtonElement>;
}) {
  return (
    <button
      ref={refBoton}
      type="button"
      onClick={onClick}
      aria-label={etiqueta}
      className="flex h-9 w-9 items-center justify-center rounded-full text-brand-red transition-colors hover:bg-brand-red/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-red"
    >
      {children}
    </button>
  );
}
