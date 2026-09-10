/**
 * Limite de peticiones.
 *
 * Tiene dos almacenes:
 *
 * 1. Redis de Upstash (recomendado). Se activa solo con conectar Upstash desde
 *    Vercel > Storage (o Marketplace), que deja en el proyecto las variables
 *    KV_REST_API_URL y KV_REST_API_TOKEN (o UPSTASH_REDIS_REST_URL y
 *    UPSTASH_REDIS_REST_TOKEN). Con Redis el conteo es uno solo para todas las
 *    copias de la funcion, y ademas se activan los topes diarios globales.
 *
 * 2. Memoria, si no hay Redis o si Redis no responde. Cada copia de la funcion
 *    cuenta por su lado, asi que frena el abuso casual pero no a alguien
 *    decidido. Sirve de respaldo, no de defensa principal.
 *
 * Las claves se guardan con la huella de la IP, nunca con la IP en claro.
 */

export type Regla = {
  /** Nombre corto que aparece en los registros, por ejemplo "chat-minuto". */
  nombre: string;
  limite: number;
  ventanaMs: number;
};

export type Resultado =
  | { bloqueado: false; almacen: Almacen }
  | { bloqueado: true; almacen: Almacen; regla: string; reintentarEnS: number };

export type Almacen = 'redis' | 'memoria';

// ------------------------------------------------------------------- memoria

type Registro = { conteo: number; venceEn: number };
const memoria = new Map<string, Registro>();

function contarEnMemoria(clave: string, ventanaMs: number, ahora: number): number {
  const actual = memoria.get(clave);
  if (!actual || ahora > actual.venceEn) {
    memoria.set(clave, { conteo: 1, venceEn: ahora + ventanaMs });
    limpiarVencidos(ahora);
    return 1;
  }
  actual.conteo += 1;
  return actual.conteo;
}

/** Evita que el Map crezca sin fin en copias de larga vida. */
function limpiarVencidos(ahora: number): void {
  if (memoria.size < 1000) return;
  for (const [clave, registro] of memoria) {
    if (ahora > registro.venceEn) memoria.delete(clave);
  }
}

// --------------------------------------------------------------------- redis

function credencialesRedis(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ''), token } : null;
}

export function hayRedis(): boolean {
  return credencialesRedis() !== null;
}

/** Lee un tope numérico de las variables de entorno, con uno por defecto si falta o no es válido. */
export function topeDesdeEnv(variable: string, porDefecto: number): number {
  const valor = Number(process.env[variable]);
  return Number.isFinite(valor) && valor > 0 ? Math.floor(valor) : porDefecto;
}

/**
 * Manda varios comandos en un solo viaje. Si Redis tarda mas de 1,5 s o falla,
 * lanza un error y quien llama cae a memoria: preferimos que el chat siga
 * funcionando a que se caiga por culpa del contador.
 */
async function pipeline(comandos: (string | number)[][]): Promise<unknown[]> {
  const cred = credencialesRedis();
  if (!cred) throw new Error('Sin Redis');

  const control = new AbortController();
  const reloj = setTimeout(() => control.abort(), 1500);
  try {
    const respuesta = await fetch(`${cred.url}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${cred.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(comandos.map((c) => c.map(String))),
      signal: control.signal,
    });
    if (!respuesta.ok) throw new Error(`Redis respondio ${respuesta.status}`);
    const datos = (await respuesta.json()) as { result?: unknown; error?: string }[];
    return datos.map((d) => {
      if (d.error) throw new Error(`Redis: ${d.error}`);
      return d.result;
    });
  } finally {
    clearTimeout(reloj);
  }
}

// ------------------------------------------------------------------ conteo

/**
 * Suma una peticion a cada regla y dice si alguna se paso.
 * Ventana fija: la clave incluye el numero de ventana, asi cada una arranca en cero.
 */
export async function revisarLimites(clave: string, reglas: Regla[]): Promise<Resultado> {
  const ahora = Date.now();
  const claves = reglas.map((r) => `rl:${r.nombre}:${clave}:${Math.floor(ahora / r.ventanaMs)}`);

  let conteos: number[];
  let almacen: Almacen = 'memoria';

  try {
    const comandos: (string | number)[][] = [];
    reglas.forEach((r, i) => {
      comandos.push(['INCR', claves[i]]);
      comandos.push(['PEXPIRE', claves[i], r.ventanaMs]);
    });
    const resultados = await pipeline(comandos);
    conteos = reglas.map((_, i) => Number(resultados[i * 2]));
    almacen = 'redis';
  } catch (error) {
    if (hayRedis()) console.error('Rate limit: Redis no respondio, uso memoria.', (error as Error).message);
    conteos = reglas.map((r, i) => contarEnMemoria(claves[i], r.ventanaMs, ahora));
  }

  for (let i = 0; i < reglas.length; i++) {
    if (conteos[i] > reglas[i].limite) {
      const finVentana = (Math.floor(ahora / reglas[i].ventanaMs) + 1) * reglas[i].ventanaMs;
      return {
        bloqueado: true,
        almacen,
        regla: reglas[i].nombre,
        reintentarEnS: Math.max(1, Math.ceil((finVentana - ahora) / 1000)),
      };
    }
  }
  return { bloqueado: false, almacen };
}

/**
 * Tope diario para todo el sitio, sin importar de donde venga la peticion.
 * Es lo que frena a alguien que reparte el ataque entre muchas IP. Solo existe
 * con Redis: en memoria cada copia contaria por su lado y el numero no diria nada.
 * Devuelve el conteo del dia, o null si no hay Redis.
 */
export async function contarGlobalDelDia(nombre: string): Promise<number | null> {
  if (!hayRedis()) return null;
  const dia = Math.floor(Date.now() / 86_400_000);
  const clave = `global:${nombre}:${dia}`;
  try {
    const [conteo] = await pipeline([
      ['INCR', clave],
      ['EXPIRE', clave, 172_800],
    ]);
    return Number(conteo);
  } catch (error) {
    console.error('Tope global: Redis no respondio.', (error as Error).message);
    return null;
  }
}

/**
 * Devuelve true solo la primera vez dentro del plazo. Sirve para no mandar la
 * misma alerta cien veces seguidas.
 */
const marcasEnMemoria = new Map<string, number>();

export async function primeraVez(clave: string, plazoMs: number): Promise<boolean> {
  try {
    const [resultado] = await pipeline([['SET', `una-vez:${clave}`, '1', 'NX', 'PX', plazoMs]]);
    return resultado === 'OK';
  } catch {
    const ahora = Date.now();
    const vence = marcasEnMemoria.get(clave);
    if (vence && vence > ahora) return false;
    marcasEnMemoria.set(clave, ahora + plazoMs);
    return true;
  }
}
