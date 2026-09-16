import { ilustracionNota } from './formato';

/** Ilustración de la nota de cata con su nombre debajo, como en el catálogo. Toma el color del texto. */
export function NotaDeCata({ nota, tamano, className = '' }: { nota: string; tamano: string; className?: string }) {
  const url = `url(${ilustracionNota(nota)})`;
  return (
    <span className={`flex flex-col items-center text-center ${className}`}>
      <span
        aria-hidden
        className={`block bg-current ${tamano}`}
        style={{ maskImage: url, WebkitMaskImage: url, maskSize: 'contain', WebkitMaskSize: 'contain', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskPosition: 'center' }}
      />
      <span className="mt-1.5 leading-tight">{nota}</span>
    </span>
  );
}
