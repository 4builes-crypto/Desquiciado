/**
 * Base de conocimiento de Desquiciado.
 *
 * Esto es lo único que el bot sabe. Si un dato no está acá, el bot tiene
 * prohibido inventarlo: deriva a un humano. Para agregar una etiqueta nueva,
 * copia un objeto de VINOS, cambia los datos y listo. No hace falta tocar
 * nada más del código.
 *
 * Fuentes: fichas técnicas de bodega, "Catálogo de vinos Argentinos.pdf" y
 * "Propuesta Distribución Colombia.pdf".
 */

export type Vino = {
  nombre: string;
  bodega: string;
  linea: string;
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
  /** Para qué ocasión la recomendaría la sommelier. Editable a gusto. */
  cuandoTomarlo: string;
};

export const VINOS: Vino[] = [
  // ---------- FINCA SOPHENIA · LINEA ALTOSUR ----------
  {
    nombre: 'Altosur Torrontés 2026',
    bodega: 'Finca Sophenia',
    linea: 'Altosur',
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
    cuandoTomarlo:
      'Para empezar la noche, con picada, ceviche, comida asiática o pescado. Es el vino que convence al que dice que el blanco no le gusta.',
  },
  {
    nombre: 'Altosur Dulce Natural 2026',
    bodega: 'Finca Sophenia',
    linea: 'Altosur',
    origen: 'Gualtallary, Tupungato, Mendoza, Argentina',
    anada: '2026',
    composicion: '100% Torrontés',
    color: 'Dorado brillante con notas verdosas',
    nariz: 'Frescos y frutales: cítricos, manzana verde y banana, con toques de té verde y manzanilla',
    boca: 'Dulzura equilibrada por una acidez fresca',
    servicio: '6 a 8 grados',
    analitica: 'Alcohol 8,8% · Acidez 5,12 g/l · Azúcar 32,03 g/l · pH 3,24',
    vinedo: 'Gualtallary, Tupungato, entre 1.000 y 1.200 msnm',
    cuandoTomarlo:
      'Para el postre, con quesos azules o frutas. También es la puerta de entrada perfecta para alguien que recién arranca con el vino.',
  },
  {
    nombre: 'Altosur Malbec 2025',
    bodega: 'Finca Sophenia',
    linea: 'Altosur',
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
    cuandoTomarlo:
      'El tinto que nunca falla: asado, carne roja, hamburguesa buena. Es el más premiado del catálogo y el más fácil de querer.',
  },
  {
    nombre: 'Altosur Red Blend 2025',
    bodega: 'Finca Sophenia',
    linea: 'Altosur',
    origen: 'Gualtallary, Tupungato, Mendoza, Argentina',
    anada: '2025',
    composicion: '50% Malbec y 50% Cabernet Sauvignon',
    color: 'Rojo rubi con notas violaceas',
    nariz: 'Muy expresivo: ciruela, especias, tomillo y pimienta negra',
    boca: 'Estructura firme, taninos suaves y jugosos, entrada dulce y acidez equilibrada',
    crianza: '3 a 4 meses en roble francés',
    servicio: '16 a 18 grados',
    analitica: 'Alcohol 14% · Acidez 5,41 g/l · Azúcar 2,9 g/l · pH 3,65',
    distinciones:
      '91 puntos James Suckling 2022 · entre 90 y 91 puntos de forma constante por James Suckling y Guía Descorchados entre 2019 y 2026',
    vinedo: 'Gualtallary, Tupungato, entre 1.000 y 1.200 msnm',
    cuandoTomarlo:
      'Para una comida larga con varios platos. Aguanta desde una pasta con salsa fuerte hasta un cordero.',
  },

  // ---------- GRAZIE MILLE · LINEA AMISTAD ----------
  {
    nombre: 'Amistad Assemblage de Blancas 2022',
    bodega: 'Grazie Mille',
    linea: 'Amistad',
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
    cuandoTomarlo:
      'Para una tarde larga con amigos, con quesos frescos, pescado o comida de mar. Los tres varietales se vinifican por separado y después se cortan.',
  },
  {
    nombre: 'Amistad Cabernet Sauvignon 2022',
    bodega: 'Grazie Mille',
    linea: 'Amistad',
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
    cuandoTomarlo:
      'Con carnes al horno, guisos y quesos maduros. El mentolado lo hace más fresco de lo que uno espera de un Cabernet.',
  },
  {
    nombre: 'Amistad Malbec 2022',
    bodega: 'Grazie Mille',
    linea: 'Amistad',
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
    cuandoTomarlo:
      'El de un día cualquiera. Asado, pizza, o solo. Es sedoso, no pesado, y por eso se toma sin ocasión especial.',
  },
  {
    nombre: 'Amistad Sangiovese Rosé 2024',
    bodega: 'Grazie Mille',
    linea: 'Amistad, gama premium',
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
    cuandoTomarlo:
      'Calor, terraza, comida picante o simplemente sed. Once grados de alcohol: es el más fácil de tomar del catálogo.',
  },

  // ---------- GRAZIE MILLE · LINEA LIBERTAD ----------
  {
    nombre: 'Libertad Cabernet Franc Unique Terroir 2020',
    bodega: 'Grazie Mille',
    linea: 'Libertad, Unique Terroir',
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
    cuandoTomarlo:
      'La botella para la ocasión que importa. Es el más complejo y el más guardable del catálogo. Carnes de caza, cordero, quesos añejos.',
  },
];

export const EMPRESA = {
  nombre: 'Desquiciado',
  razonSocial: 'Desquiciado S.A.S.',
  nit: '902.036.202-9',
  constitucion: 'febrero de 2026',
  sede: 'El Retiro, Antioquia, Colombia',
  sitio: 'desquiciado-sas.com',
  instagram: '@desquiciado.sas',
  // Ojo: el dominio lleva guion. "desquiciadosas.com" sin guion no existe,
  // y asi aparecia por error en la propuesta comercial en PDF.
  correo: 'contacto@desquiciado-sas.com',
  telefono: '+57 302 294 3003',
  whatsapp: '573022943003',
  tagline: 'Donde la locura se encuentra con la tierra',
  equipo: [
    'Rosenda Arroyo, la sommelier. Estudió cocina en Colombia, se formó como sommelier en Mendoza y hoy cata en Argentina. Es la que decide qué entra al catálogo y qué se queda por fuera.',
    'Lía García Arroyo, representante legal y CEO.',
    'Alejandro Builes.',
  ],
};

/** Todo lo que el bot puede afirmar sobre el negocio, más allá de las fichas. */
export const CONTEXTO_NEGOCIO = `
## Quiénes somos

Desquiciado es una importadora boutique y familiar de vinos, con sede en El Retiro, Antioquia.
Tres generaciones de la misma familia: Rosenda Arroyo, Lía García y Alejandro Builes.
Se constituyó en febrero de 2026.

## De dónde salió la idea

La gente en Colombia estaba pagando de más por vinos malos. Y cuando acertaba con el precio,
terminaba llevándose el vino equivocado para la ocasión, porque no había nadie acompañándola en
la elección. De ahí surgió la idea. Hay una sommelier en la familia, con el criterio, los contactos
y la posibilidad de ir a catar donde se cata. La decisión fue simple: traer el vino que ella sí se
tomaría, y no soltarle la mano a nadie a la hora de elegirlo.

## Qué vendemos y hacia dónde vamos

Hoy el catálogo es vino argentino: Mendoza, Valle de Uco, y también San Juan y Salta como orígenes
de interés. Argentina es el arranque, no el techo. Lo que sigue son otros orígenes como Chile,
España y Estados Unidos. Más adelante, vinoteca propia, tiendas en municipios turísticos, ferias y
marca propia. Nunca describas a Desquiciado como una importadora de solo vinos argentinos.

## Los tres pilares

1. Elegido a mano. Cada etiqueta pasó por la nariz de la sommelier antes de entrar. No traemos
   catálogos enteros, traemos lo que se aguanta el filtro.
2. Nadie elige solo. Te preguntamos para qué lo quieres, cómo te gusta y qué vas a comer. Después
   te decimos cuál. Sin cobrar por la conversación.
3. Catas desquiciadas. Catas, cenas y talleres donde se aprende tomando. Sin solemnidad, sin
   escupidera y sin nadie corrigiéndote la copa.

## Servicios

- Catas: armadas a la medida de la ocasión, entre amigos, en familia o con el equipo de la empresa.
  La sommelier elige las botellas según quién se sienta a la mesa.
- Talleres: cata y cocina, para personas y para empresas.
- Restaurantes y bares: armamos la carta de vinos y entrenamos al equipo que la va a vender.
- Empresas: regalos armados a la medida y vino para eventos de la compañía.

Importante sobre las catas: por ahora están anunciadas en el sitio como "muy pronto". Todavía no
hay fechas públicas ni reservas abiertas. Si alguien quiere una, se le toman los datos y el equipo
lo contacta.

## Canal profesional: restaurantes, bares, hoteles y clubes

Trabajamos con restaurantes, bares, hoteles, clubes sociales y tiendas especializadas en Medellín
y el Oriente antioqueño. Hoy ese canal es cerca del 40% de la venta.

Cómo trabajamos con bodegas y con el canal:
- Importación formal: gestionamos el registro sanitario INVIMA y la homologación de marca en
  Colombia, de forma exclusiva para cada bodega con la que trabajamos, y cumplimos el Decreto 1686
  de 2021 de principio a fin.
- Distribución curada: portafolio acotado, cada etiqueta con atención comercial real.
- Experiencias y catas que construyen marca, no solo rotación de inventario.

Ya operamos bajo un modelo de exclusividad de un año con una bodega argentina.

## Formas de pago

Se definen en la negociación: de contado o a crédito, con plazo a convenir entre las partes.

## Lo que NO sabemos y hay que derivar a un humano

- Precios de cualquier botella, de las catas o de los talleres. El precio nunca va en la
  conversación, se maneja en la cotización.
- Inventario y disponibilidad de una etiqueta puntual.
- Tiempos y costos de envío, cobertura de ciudades.
- Fechas de catas.
- Descuentos, promociones y condiciones comerciales concretas.
- Cualquier cosa sobre una etiqueta que no esté en la lista de vinos de este documento.
`.trim();

/** Convierte la lista de vinos en el bloque de texto que va dentro del prompt. */
export function renderCatalogo(): string {
  const bloques = VINOS.map((v) => {
    const lineas = [
      `### ${v.nombre}`,
      `Bodega: ${v.bodega} · Línea: ${v.linea}`,
      `Origen: ${v.origen} · Añada: ${v.anada}`,
      `Composición: ${v.composicion}`,
      `Vista: ${v.color}`,
      `Nariz: ${v.nariz}`,
      `Boca: ${v.boca}`,
      v.crianza ? `Crianza: ${v.crianza}` : null,
      `Temperatura de servicio: ${v.servicio}`,
      `Datos analíticos: ${v.analitica}`,
      v.distinciones ? `Distinciones: ${v.distinciones}` : null,
      v.vinedo ? `Viñedo: ${v.vinedo}` : null,
      `Cuándo recomendarlo: ${v.cuandoTomarlo}`,
    ];
    return lineas.filter(Boolean).join('\n');
  });

  return `## Catálogo completo (${VINOS.length} etiquetas)\n\n${bloques.join('\n\n')}`;
}
