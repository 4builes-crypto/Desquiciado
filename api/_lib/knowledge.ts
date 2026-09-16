/**
 * Base de conocimiento de Desquiciado.
 *
 * Esto es lo único que el bot sabe. Si un dato no está acá, el bot tiene
 * prohibido inventarlo: deriva a un humano. Los vinos viven en
 * compartido/vinos.ts, que también alimenta las tarjetas de "Nuestros vinos":
 * para agregar una etiqueta nueva, solo ese archivo.
 *
 * Fuentes: fichas técnicas de bodega, "Catálogo de vinos Argentinos.pdf" y
 * "Propuesta Distribución Colombia.pdf".
 */

import { VINOS } from '../../compartido/vinos';

export { VINOS };
export type { Vino } from '../../compartido/vinos';

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
