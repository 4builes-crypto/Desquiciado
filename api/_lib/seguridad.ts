/**
 * Todo lo que /api/chat y /api/lead comparten para defenderse: quién puede
 * llamarlas, cómo se lee el cuerpo sin riesgo, cómo se limpia el texto que
 * escribe la gente y cómo se deja rastro de lo sospechoso.
 *
 * Ninguna de las dos funciones necesita ser llamada desde otro sitio web: el
 * widget vive en el mismo dominio. Por eso no devolvemos cabeceras CORS. Un
 * navegador en otro dominio no puede leer la respuesta, y como exigimos
 * Content-Type application/json, tampoco puede disparar la petición sin pasar
 * antes por una verificación previa que nunca aprobamos.
 */

// --------------------------------------------------------------------- origen

/** Dominios de producción. Se pueden reemplazar con ORIGENES_PERMITIDOS. */
const ORIGENES_POR_DEFECTO = ['https://desquiciado-sas.com', 'https://www.desquiciado-sas.com'];

function origenesExtra(): string[] {
  const desdeEnv = process.env.ORIGENES_PERMITIDOS;
  const lista = desdeEnv
    ? desdeEnv.split(',').map((o) => o.trim()).filter(Boolean)
    : [...ORIGENES_POR_DEFECTO];

  // La propia vista previa de Vercel, y solo esa. Antes se aceptaba cualquier
  // *.vercel.app, lo que dejaba a cualquiera montar una página en Vercel y
  // gastar tu saldo de DeepSeek desde ella.
  for (const variable of ['VERCEL_URL', 'VERCEL_BRANCH_URL', 'VERCEL_PROJECT_PRODUCTION_URL']) {
    const anfitrion = process.env[variable];
    if (anfitrion) lista.push(`https://${anfitrion}`);
  }
  return lista;
}

export type RevisionOrigen = { ok: true } | { ok: false; motivo: 'origen_ausente' | 'origen_rechazado' };

/**
 * Todo navegador moderno manda la cabecera Origin en un POST, incluso al mismo
 * dominio. Si no viene, quien llama es un script, y lo rechazamos.
 */
export function revisarOrigen(req: Request): RevisionOrigen {
  const origen = req.headers.get('origin');
  if (!origen) return { ok: false, motivo: 'origen_ausente' };

  let propio = '';
  try {
    propio = new URL(req.url).origin;
  } catch {
    // URL rara: seguimos solo con la lista.
  }
  if (origen === propio || origenesExtra().includes(origen)) return { ok: true };
  return { ok: false, motivo: 'origen_rechazado' };
}

// ------------------------------------------------------------------ petición

/** La IP real del visitante. Vercel sobrescribe estas cabeceras, no se pueden falsear. */
export function ipDe(req: Request): string {
  const reenviada = req.headers.get('x-forwarded-for');
  if (reenviada) return reenviada.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'desconocida';
}

/**
 * Huella corta de la IP. Sirve para contar peticiones y cruzar registros sin
 * guardar la IP tal cual en ningún lado.
 */
export async function huella(valor: string): Promise<string> {
  const sal = process.env.SAL_REGISTROS ?? 'desquiciado';
  const datos = new TextEncoder().encode(`${sal}:${valor}`);
  const resumen = await crypto.subtle.digest('SHA-256', datos);
  return Array.from(new Uint8Array(resumen).slice(0, 8))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export class ErrorDeEntrada extends Error {
  constructor(
    public motivo: string,
    mensaje: string,
    public status = 400,
  ) {
    super(mensaje);
  }
}

/**
 * Lee el JSON del cuerpo con un tope de tamaño. Sin tope, alguien podría mandar
 * megas de texto para inflar la cuenta de DeepSeek o tumbar la función.
 */
export async function leerJson(req: Request, maxBytes: number): Promise<unknown> {
  const tipo = req.headers.get('content-type') ?? '';
  if (!tipo.toLowerCase().startsWith('application/json')) {
    throw new ErrorDeEntrada('tipo_contenido_invalido', 'Formato no admitido.', 415);
  }

  const declarado = Number(req.headers.get('content-length') ?? '0');
  if (declarado > maxBytes) {
    throw new ErrorDeEntrada('cuerpo_demasiado_grande', 'El mensaje es demasiado largo.', 413);
  }

  const texto = await req.text();
  if (new TextEncoder().encode(texto).length > maxBytes) {
    throw new ErrorDeEntrada('cuerpo_demasiado_grande', 'El mensaje es demasiado largo.', 413);
  }

  try {
    return JSON.parse(texto);
  } catch {
    throw new ErrorDeEntrada('json_invalido', 'Cuerpo inválido.');
  }
}

// -------------------------------------------------------------------- texto

/**
 * Caracteres de control e invisibles que no tienen nada que hacer en un
 * formulario. Los de dirección de texto (U+202A a U+202E, U+2066 a U+2069)
 * permiten disfrazar lo que se lee en un correo, por eso también salen.
 */
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const INVISIBLES = /[\u200B\u202A-\u202E\u2066-\u2069\uFEFF]/g;

/** Texto libre de varias líneas: conserva saltos de línea, quita lo demás. */
export function limpiarTexto(valor: string, max: number): string {
  return valor
    .normalize('NFC')
    .replace(/\r\n?/g, '\n')
    .replace(CONTROL, '')
    .replace(INVISIBLES, '')
    .trim()
    .slice(0, max);
}

/** Campos de una sola línea (nombre, contacto): sin saltos ni espacios dobles. */
export function limpiarLinea(valor: string, max: number): string {
  return limpiarTexto(valor.replace(/[\r\n\t]+/g, ' '), max * 2)
    .replace(/\s{2,}/g, ' ')
    .slice(0, max);
}

const sinTildes = (t: string) =>
  t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

/**
 * Señales de alguien probando el sitio: etiquetas de script, inyección SQL,
 * rutas del sistema. React ya muestra todo como texto plano y no hay base de
 * datos, así que no hacen daño, pero dicen mucho de quién escribe.
 */
const PATRONES_DE_ATAQUE: RegExp[] = [
  /<\s*\/?\s*(script|iframe|img|svg|object|embed)\b/i,
  /javascript\s*:/i,
  /\bon(error|load|click|mouseover)\s*=/i,
  /\bunion\s+(all\s+)?select\b/i,
  /;\s*(drop|delete|truncate|alter)\s+table\b/i,
  /'\s*(or|and)\s+'?\d+'?\s*=\s*'?\d+/i,
  /\.\.\/\.\.\//,
  /\$\{jndi:/i,
];

/** Frases típicas de quien intenta sacar al bot de su papel. */
const PATRONES_DE_MANIPULACION: RegExp[] = [
  /(ignora|ignore|olvida|forget|omite)\b.{0,40}\b(instruccion|regla|indicacion|instruction|rule|prompt|anterior|previous)/,
  /(system|sistema)\s*prompt/,
  /(revela|muestra|repite|imprime|reveal|show|print|repeat).{0,40}\b(prompt|instrucciones|instructions|reglas)/,
  /\b(jailbreak|dan mode|developer mode|modo desarrollador)\b/,
];

export function pareceAtaque(texto: string): boolean {
  return PATRONES_DE_ATAQUE.some((p) => p.test(texto));
}

export function pareceManipulacion(texto: string): boolean {
  const normal = sinTildes(texto);
  return PATRONES_DE_MANIPULACION.some((p) => p.test(normal));
}

// ---------------------------------------------------------------- registros

/**
 * Deja una línea JSON en los registros de Vercel (Logs, filtra por
 * "seguridad"). Nunca guarda el texto que escribió la persona ni sus datos de
 * contacto: solo qué pasó, dónde y una huella de la IP.
 */
export async function registrar(
  evento: string,
  req: Request,
  detalle: Record<string, unknown> = {},
): Promise<void> {
  let ruta = '';
  try {
    ruta = new URL(req.url).pathname;
  } catch {
    // Sin ruta, el resto del registro sigue sirviendo.
  }
  const linea = {
    tipo: 'seguridad',
    evento,
    ruta,
    ip: await huella(ipDe(req)),
    pais: req.headers.get('x-vercel-ip-country') ?? undefined,
    agente: (req.headers.get('user-agent') ?? '').slice(0, 120) || undefined,
    ...detalle,
  };
  console.warn(JSON.stringify(linea));
}

// --------------------------------------------------------------- respuestas

export function json(cuerpo: unknown, status: number, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(cuerpo), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      ...extra,
    },
  });
}
