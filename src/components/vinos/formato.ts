import type { Estilo, Vino } from '../../../compartido/vinos';

export const ESTILO: Record<Estilo, string> = {
  tinto: 'Tinto',
  blanco: 'Blanco',
  rosado: 'Rosado',
  dulce: 'Blanco dulce',
};

export const imagenDe = (v: Pick<Vino, 'id'>) => `/botellas/${v.id}.webp`;

/** "16 a 18 grados" se lee mejor como "16 a 18 °C". */
export const temperatura = (v: Vino) => v.servicio.replace(/\s*grados$/, ' °C');

/** El primer dato de la analítica siempre es el alcohol. */
export const alcohol = (v: Vino) => `Porcentaje de alcohol: ${v.analitica.split(' · ')[0].replace('Alcohol ', '')}`;

const mayuscula = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

export const distinciones = (v: Vino) => (v.distinciones ? v.distinciones.split(' · ').map(mayuscula) : []);

/** Datos analíticos uno por línea, con el alcohol dicho en palabras para quien no sabe qué es ese porcentaje. */
export const analitica = (v: Vino) => v.analitica.split(' · ').map((d) => d.replace(/^Alcohol /, 'Porcentaje de alcohol: '));

/**
 * Ilustración de una nota de cata: "Pimienta negra" usa public/notas/pimienta-negra.png.
 * Son siluetas recortadas del catálogo en PDF y se usan como máscara, así toman
 * el color del texto donde estén.
 */
export const ilustracionNota = (nota: string) =>
  `/notas/${nota
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-')}.png`;
