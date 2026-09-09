/**
 * Limite de peticiones por IP, en memoria.
 *
 * Cada instancia de la funcion tiene su propio contador, asi que esto no es una
 * barrera infalible: es un freno barato contra el abuso casual y contra alguien
 * que le pegue al endpoint en bucle. La defensa de fondo contra un gasto grande
 * es el tope de saldo que dejes puesto en el panel de DeepSeek.
 */

type Registro = { conteo: number; reinicioEn: number };

const registros = new Map<string, Registro>();

export const LIMITE_POR_VENTANA = 20;
export const VENTANA_MS = 60_000;

export function superaElLimite(ip: string): boolean {
  const ahora = Date.now();
  const actual = registros.get(ip);

  if (!actual || ahora > actual.reinicioEn) {
    registros.set(ip, { conteo: 1, reinicioEn: ahora + VENTANA_MS });
    limpiarVencidos(ahora);
    return false;
  }

  actual.conteo += 1;
  return actual.conteo > LIMITE_POR_VENTANA;
}

/** Evita que el Map crezca sin fin en instancias de larga vida. */
function limpiarVencidos(ahora: number): void {
  if (registros.size < 500) return;
  for (const [ip, registro] of registros) {
    if (ahora > registro.reinicioEn) registros.delete(ip);
  }
}

export function ipDe(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'desconocida';
}
