import { Award, Hourglass, Percent, Plus, Thermometer } from 'lucide-react';
import type { Vino } from '../../../compartido/vinos';
import { alcohol, distinciones, ESTILO, imagenDe, temperatura } from './formato';
import { NotaDeCata } from './NotaDeCata';

/**
 * Frente: bodega, línea, nombre y botella, como en el inventario.
 * Al pasar el cursor (o al llegar con el teclado) la carta se voltea y muestra
 * en el reverso lo esencial para elegir. En pantallas táctiles no hay cursor, así que el toque
 * abre directo la ficha completa.
 */
export function TarjetaVino({ vino, alAbrir }: { vino: Vino; alAbrir: () => void }) {
  const premios = distinciones(vino);

  return (
    <button
      type="button"
      onClick={alAbrir}
      aria-haspopup="dialog"
      aria-label={`${vino.nombre}, ver ficha completa`}
      className="tarjeta-vino block h-72 w-full rounded-xl text-left text-coal outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-coal"
    >
      <span className="cartas relative block h-full w-full">
        {/* Frente */}
        <span className="cara absolute inset-0 flex overflow-hidden rounded-xl bg-cream shadow-lg shadow-black/20">
          <span className="flex w-28 shrink-0 items-end justify-center pb-4 pt-5 pl-4">
            <img
              src={imagenDe(vino)}
              alt=""
              loading="lazy"
              draggable={false}
              className="h-full w-auto object-contain drop-shadow-[0_10px_12px_rgba(26,26,27,0.25)]"
            />
          </span>
          <span className="flex min-w-0 flex-1 flex-col py-6 pl-3 pr-5">
            <span className="versalita text-oro-tostado">{vino.bodega}</span>
            <span className="versalita mt-1 text-coal/50">{vino.linea}</span>
            <span className="mt-3 font-serif text-[26px] leading-[1.1] text-brand-red">{vino.varietal}</span>
            <span className="mt-1 font-serif text-lg italic text-brand-red/70">{vino.anada}</span>
            <span className="mt-auto text-xs leading-relaxed text-coal/60">
              <span className="block">{ESTILO[vino.estilo]}</span>
              <span className="block">{alcohol(vino)}</span>
            </span>
          </span>
        </span>

        {/* Reverso */}
        <span aria-hidden className="cara reverso absolute inset-0 flex flex-col overflow-hidden rounded-xl bg-cream px-6 py-5 text-coal shadow-lg shadow-black/20">
          <span className="versalita text-oro-tostado">
            {vino.linea} · {vino.varietal} {vino.anada}
          </span>

          <span className="mt-3 flex items-center gap-2 text-sm">
            <Thermometer size={15} className="shrink-0 text-oro-tostado" />
            Servir a {temperatura(vino)}
          </span>
          <span className="mt-1.5 flex items-center gap-2 text-sm">
            <Percent size={15} className="shrink-0 text-oro-tostado" />
            {alcohol(vino)}
          </span>
          {vino.crianza && (
            <span className="mt-1.5 flex items-center gap-2 text-sm">
              <Hourglass size={15} className="shrink-0 text-oro-tostado" />
              {vino.crianza}
            </span>
          )}
          {premios.length > 0 && (
            <span className="mt-1.5 flex items-start gap-2 text-sm">
              <Award size={15} className="mt-0.5 shrink-0 text-oro-tostado" />
              <span>
                {premios[0]}
                {premios.length > 1 && <span className="text-coal/50"> y {premios.length - 1} más</span>}
              </span>
            </span>
          )}

          <span className="versalita mt-3 text-coal/50">Notas de cata</span>
          <span className="mt-2 grid grid-cols-5 gap-1 font-serif text-[9.5px] uppercase tracking-wide text-brand-red">
            {vino.notas.map((n) => (
              <NotaDeCata key={n} nota={n} tamano="h-9 w-9" />
            ))}
          </span>

          <span className="mt-auto flex items-center gap-1.5 pt-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand-red">
            <Plus size={14} /> Ficha completa
          </span>
        </span>
      </span>
    </button>
  );
}
