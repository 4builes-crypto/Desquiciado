/**
 * Las etiquetas del catálogo. Una sola fuente para las tarjetas de "Nuestros
 * vinos" y para el sommelier virtual (api/_lib/knowledge.ts las importa de acá).
 *
 * Para agregar un vino: copia un objeto de VINOS, cambia los datos y deja la
 * foto de la botella en public/botellas/<id>.webp (fondo transparente). Si una
 * nota de cata es nueva, su ilustración va en public/notas/ (ver src/components/vinos/formato.ts).
 *
 * Fuentes: fichas técnicas de bodega y "Catálogo de vinos Argentinos.pdf".
 */

export type Estilo = 'tinto' | 'blanco' | 'rosado' | 'dulce';

export type Vino = {
  /** Identificador corto, también nombre del archivo de la foto. */
  id: string;
  nombre: string;
  bodega: string;
  linea: string;
  /** Cepa o nombre del vino sin línea ni añada, como lo muestra la tarjeta. */
  varietal: string;
  estilo: Estilo;
  /**
   * Si ya se puede vender. En false no sale en las tarjetas de "Nuestros vinos".
   * Las de Finca Sophenia están en false hasta que se puedan comercializar.
   */
  enVenta: boolean;
  origen: string;
  anada: string;
  composicion: string;
  color: string;
  nariz: string;
  boca: string;
  crianza?: string;
  servicio: string;
  analitica: string;
  distinciones?: string;
  vinedo?: string;
  /** Las notas de cata del catálogo. Cada una usa su ilustración de public/notas/. */
  notas: string[];
  /** Para qué ocasión la recomendaría la sommelier. Editable a gusto. */
  cuandoTomarlo: string;
};

export type Bodega = { nombre: string; lugar: string; descripcion: string };

export const BODEGAS: Bodega[] = [
  {
    nombre: 'Finca Sophenia',
    lugar: 'Gualtallary, Tupungato, Mendoza',
    descripcion:
      'La línea Altosur nace de viñedos entre 1.000 y 1.200 msnm en el Valle de Uco. Bajo la dirección del enólogo Joaquín Martín, vinos expresivos, con la frescura y la estructura propias de Gualtallary.',
  },
  {
    nombre: 'Grazie Mille',
    lugar: 'La Consulta, Valle de Uco, Mendoza',
    descripcion:
      'Viñedos del sur del Valle de Uco, delimitado por el río Tunuyán, entre 950 y 1.300 msnm. Suelos aluviales de gran diversidad mineral, que le dan carácter propio a cada varietal.',
  },
];

export const VINOS: Vino[] = [
  // ---------- FINCA SOPHENIA · LINEA ALTOSUR ----------
  {
    id: 'altosur-torrontes',
    nombre: 'Altosur Torrontés 2026',
    bodega: 'Finca Sophenia',
    linea: 'Altosur',
    varietal: 'Torrontés',
    estilo: 'blanco',
    enVenta: false,
    origen: 'Gualtallary, Tupungato, Mendoza, Argentina',
    anada: '2026',
    composicion: '100% Torrontés',
    color: 'Amarillo pálido con reflejos verdosos',
    nariz: 'Florales combinados con frutos tropicales, manzanilla y notas cítricas',
    boca: 'Intenso, cítrico y mineral, con un final muy fresco y elegante',
    servicio: '8 a 10 grados',
    analitica: 'Alcohol 12,7% · Acidez 5,07 g/l · Azúcar 1,8 g/l · pH 3,23',
    distinciones: '91 puntos Tim Atkin 2018 · 89 puntos Guía Descorchados 2018',
    vinedo: 'Viñedos entre 1.000 y 1.200 msnm en el Valle de Uco, bajo la dirección del enólogo Joaquín Martín',
    notas: ['Florales', 'Frutas tropicales', 'Manzanilla', 'Cítricos'],
    cuandoTomarlo:
      'Para empezar la noche, con picada, ceviche, comida asiática o pescado. Es el vino que convence al que dice que el blanco no le gusta.',
  },
  {
    id: 'altosur-dulce-natural',
    nombre: 'Altosur Dulce Natural 2026',
    bodega: 'Finca Sophenia',
    linea: 'Altosur',
    varietal: 'Dulce Natural',
    estilo: 'dulce',
    enVenta: false,
    origen: 'Gualtallary, Tupungato, Mendoza, Argentina',
    anada: '2026',
    composicion: '100% Torrontés',
    color: 'Dorado brillante con notas verdosas',
    nariz: 'Frescos y frutales: cítricos, manzana verde y banana, con toques de té verde y manzanilla',
    boca: 'Dulzura equilibrada por una acidez fresca',
    servicio: '6 a 8 grados',
    analitica: 'Alcohol 8,8% · Acidez 5,12 g/l · Azúcar 32,03 g/l · pH 3,24',
    vinedo: 'Gualtallary, Tupungato, entre 1.000 y 1.200 msnm',
    notas: ['Cítricos', 'Manzana verde', 'Banana', 'Manzanilla', 'Té verde'],
    cuandoTomarlo:
      'Para el postre, con quesos azules o frutas. También es la puerta de entrada perfecta para alguien que recién arranca con el vino.',
  },
  {
    id: 'altosur-malbec',
    nombre: 'Altosur Malbec 2025',
    bodega: 'Finca Sophenia',
    linea: 'Altosur',
    varietal: 'Malbec',
    estilo: 'tinto',
    enVenta: false,
    origen: 'Gualtallary, Tupungato, Mendoza, Argentina',
    anada: '2025',
    composicion: '100% Malbec',
    color: 'Rojo atractivo con tonos violetas',
    nariz: 'Cereza, mora y ciruela fresca junto a notas especiadas y florales',
    boca: 'Taninos dulces y redondos, buena intensidad y persistencia',
    crianza: '3 a 4 meses en roble francés',
    servicio: '16 a 18 grados',
    analitica: 'Alcohol 13,7% · Acidez 5,54 g/l · Azúcar 3,23 g/l · pH 3,59',
    distinciones:
      '97 puntos Best in Show Platinum DWWA 2022 · 95 puntos Gold Value DWWA 2024 y 2026 · 94 puntos Decanter DWWA 2018 · reconocido por James Suckling, Wine Spectator y Decanter en varias añadas',
    vinedo: 'Gualtallary, Tupungato, entre 1.000 y 1.200 msnm',
    notas: ['Cereza', 'Mora', 'Ciruela', 'Especias', 'Flores'],
    cuandoTomarlo:
      'El tinto que nunca falla: asado, carne roja, hamburguesa buena. Es el más premiado del catálogo y el más fácil de querer.',
  },
  {
    id: 'altosur-red-blend',
    nombre: 'Altosur Red Blend 2025',
    bodega: 'Finca Sophenia',
    linea: 'Altosur',
    varietal: 'Red Blend',
    estilo: 'tinto',
    enVenta: false,
    origen: 'Gualtallary, Tupungato, Mendoza, Argentina',
    anada: '2025',
    composicion: '50% Malbec y 50% Cabernet Sauvignon',
    color: 'Rojo rubí con notas violáceas',
    nariz: 'Muy expresivo: ciruela, especias, tomillo y pimienta negra',
    boca: 'Estructura firme, taninos suaves y jugosos, entrada dulce y acidez equilibrada',
    crianza: '3 a 4 meses en roble francés',
    servicio: '16 a 18 grados',
    analitica: 'Alcohol 14% · Acidez 5,41 g/l · Azúcar 2,9 g/l · pH 3,65',
    distinciones:
      '91 puntos James Suckling 2022 · entre 90 y 91 puntos de forma constante por James Suckling y Guía Descorchados entre 2019 y 2026',
    vinedo: 'Gualtallary, Tupungato, entre 1.000 y 1.200 msnm',
    notas: ['Ciruela', 'Especias', 'Tomillo', 'Pimienta negra', 'Frutos negros'],
    cuandoTomarlo:
      'Para una comida larga con varios platos. Aguanta desde una pasta con salsa fuerte hasta un cordero.',
  },

  // ---------- GRAZIE MILLE · LINEA AMISTAD ----------
  {
    id: 'amistad-assemblage-de-blancas',
    nombre: 'Amistad Assemblage de Blancas 2022',
    bodega: 'Grazie Mille',
    linea: 'Amistad',
    varietal: 'Assemblage de Blancas',
    estilo: 'blanco',
    enVenta: true,
    origen: 'La Consulta, San Carlos, Mendoza, Argentina',
    anada: '2022',
    composicion: '50% Semillón, 30% Sauvignon Blanc y 20% Viognier',
    color: 'Amarillo verdoso con tonalidades aceradas',
    nariz: 'Florales de tilo y rosas, con notas silvestres de tomillo, miel y durazno',
    boca: 'Fresco y brillante, buen equilibrio y excelente acidez',
    servicio: '5 grados',
    analitica: 'Alcohol 13,5% · Azúcares residuales 1,70 g/l · Acidez total 5,50 g/l · 750 ml',
    vinedo:
      '7 hectáreas plantadas en 1973, vid pie franco, parral, rendimiento 12.000 kg por hectárea. Suelos limosos y arenosos del sur del Valle de Uco',
    notas: ['Tilo', 'Rosas', 'Tomillo', 'Miel', 'Durazno'],
    cuandoTomarlo:
      'Para una tarde larga con amigos, con quesos frescos, pescado o comida de mar. Los tres varietales se vinifican por separado y después se cortan.',
  },
  {
    id: 'amistad-cabernet-sauvignon',
    nombre: 'Amistad Cabernet Sauvignon 2022',
    bodega: 'Grazie Mille',
    linea: 'Amistad',
    varietal: 'Cabernet Sauvignon',
    estilo: 'tinto',
    enVenta: true,
    origen: 'La Consulta, San Carlos, Mendoza, Argentina',
    anada: '2022',
    composicion: 'Cabernet Sauvignon',
    color: 'Rojo intenso con destellos morados y negros',
    nariz: 'Mermelada de pimientos y especias, con notas mentoladas que denotan frescura',
    boca: 'Acidez equilibrada y estructura redonda, acabado elegante y persistente',
    crianza: '6 meses en barricas de roble usadas',
    servicio: '16 grados',
    analitica: 'Alcohol 13,9% · Azúcares residuales 2,10 g/l · Acidez total 5,50 g/l · 750 ml',
    vinedo:
      '5 hectáreas plantadas en 1995, espaldera alta, vid pie franco, rendimiento 8.500 kg por hectárea',
    notas: ['Pimiento rojo', 'Especias', 'Menta', 'Frutos negros', 'Roble'],
    cuandoTomarlo:
      'Con carnes al horno, guisos y quesos maduros. El mentolado lo hace más fresco de lo que uno espera de un Cabernet.',
  },
  {
    id: 'amistad-malbec',
    nombre: 'Amistad Malbec 2022',
    bodega: 'Grazie Mille',
    linea: 'Amistad',
    varietal: 'Malbec',
    estilo: 'tinto',
    enVenta: true,
    origen: 'La Consulta, San Carlos, Mendoza, Argentina',
    anada: '2022',
    composicion: 'Malbec',
    color: 'Violeta intenso con destellos morados y negros',
    nariz: 'Intensas fragancias florales y frutos rojos',
    boca: 'Marcados destellos de mermelada de ciruelas, acidez equilibrada y redondez, acabado sedoso, pleno y persistente',
    crianza: '6 meses en barricas de roble usadas',
    servicio: '16 grados',
    analitica: 'Alcohol 13,8% · Azúcares residuales 2,70 g/l · Acidez total 5,40 g/l · 750 ml',
    vinedo:
      '5 hectáreas plantadas en 1996, espaldera con poda Guyot, vid pie franco, rendimiento 9.000 kg por hectárea',
    notas: ['Flores', 'Frutos rojos', 'Ciruela', 'Mermelada de ciruela', 'Barrica'],
    cuandoTomarlo:
      'El de un día cualquiera. Asado, pizza, o solo. Es sedoso, no pesado, y por eso se toma sin ocasión especial.',
  },
  {
    id: 'amistad-sangiovese-rose',
    nombre: 'Amistad Sangiovese Rosé 2024',
    bodega: 'Grazie Mille',
    linea: 'Amistad, gama premium',
    varietal: 'Sangiovese Rosé',
    estilo: 'rosado',
    enVenta: true,
    origen: 'La Consulta, San Carlos, Mendoza, Argentina',
    anada: '2024',
    composicion: '100% Sangiovese',
    color: 'Tonos salmón con destellos rosados claros, luminoso y brillante',
    nariz: 'Florales de jazmín y rosas, con frutas rojas en almíbar, miel y durazno',
    boca: 'Fresco, de buen equilibrio y acidez',
    servicio: '5 grados',
    analitica: 'Alcohol 11,0% · Azúcares residuales 1,50 g/l · Acidez total 5,40 g/l · 750 ml',
    vinedo:
      '2 hectáreas plantadas en 1978, espaldera con poda Guyot, vid pie franco, rendimiento 12.000 kg por hectárea',
    notas: ['Jazmín', 'Rosas', 'Frutos rojos', 'Miel', 'Durazno'],
    cuandoTomarlo:
      'Calor, terraza, comida picante o simplemente sed. Once grados de alcohol: es el más fácil de tomar del catálogo.',
  },

  // ---------- GRAZIE MILLE · LINEA LIBERTAD ----------
  {
    id: 'libertad-cabernet-franc',
    nombre: 'Libertad Cabernet Franc Unique Terroir 2020',
    bodega: 'Grazie Mille',
    linea: 'Libertad, Unique Terroir',
    varietal: 'Cabernet Franc',
    estilo: 'tinto',
    enVenta: true,
    origen: 'Paraje Altamira, La Consulta, San Carlos, Mendoza, Argentina',
    anada: '2020',
    composicion: 'Cabernet Franc',
    color: 'Rojo rubí con destellos morados brillantes',
    nariz: 'Cereza y mora, con matices a pimienta negra y cuero',
    boca: 'Taninos dulces y redondeados, cuerpo completo, especiado y profundo, de final elegante y complejo',
    crianza: '12 meses en barricas de roble',
    servicio: '16 grados',
    analitica: 'Alcohol 14,1% · Azúcares residuales 2,30 g/l · Acidez total 5,45 g/l',
    vinedo:
      '3 hectáreas plantadas en 2005, riego por goteo, vid pie franco, rendimiento 8.000 kg por hectárea. Paraje Altamira, con piedras redondeadas recubiertas de caliza y amplitud térmica de hasta 15 grados entre el día y la noche',
    notas: ['Cereza', 'Mora', 'Pimienta negra', 'Cuero', 'Especias'],
    cuandoTomarlo:
      'La botella para la ocasión que importa. Es el más complejo y el más guardable del catálogo. Carnes de caza, cordero, quesos añejos.',
  },
];
