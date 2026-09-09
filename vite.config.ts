import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import type { IncomingMessage, ServerResponse } from 'node:http';

/**
 * En produccion, Vercel convierte cada archivo de /api en una funcion.
 * En desarrollo eso no existe, asi que este plugin monta las mismas funciones
 * dentro del servidor de Vite. Resultado: "npm run dev" sirve el sitio y el
 * chat igual que en produccion, sin instalar nada mas.
 */
function funcionesEnDesarrollo(entorno: Record<string, string>): Plugin {
  return {
    name: 'desquiciado-api-dev',
    configureServer(servidor) {
      // Las funciones leen process.env, no import.meta.env, igual que en Vercel.
      for (const [clave, valor] of Object.entries(entorno)) {
        if (process.env[clave] === undefined) process.env[clave] = valor;
      }

      servidor.middlewares.use(async (req, res, siguiente) => {
        const url = req.url ?? '';
        if (!url.startsWith('/api/')) return siguiente();

        const nombre = url.split('?')[0].slice('/api/'.length);
        if (!/^[a-z0-9_-]+$/i.test(nombre)) return siguiente();

        try {
          const modulo = await servidor.ssrLoadModule(`/api/${nombre}.ts`);
          const manejar = modulo.default as (peticion: Request) => Promise<Response>;
          const respuesta = await manejar(await comoRequest(req));
          await escribirRespuesta(res, respuesta);
        } catch (error) {
          servidor.config.logger.error(`[api/${nombre}] ${(error as Error).message}`);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Fallo la funcion local. Mira la consola.' }));
        }
      });
    },
  };
}

/** Convierte la peticion de Node en la Request estandar que esperan las funciones. */
async function comoRequest(req: IncomingMessage): Promise<Request> {
  const trozos: Buffer[] = [];
  for await (const trozo of req) trozos.push(trozo as Buffer);

  const cabeceras = new Headers();
  for (const [clave, valor] of Object.entries(req.headers)) {
    if (typeof valor === 'string') cabeceras.set(clave, valor);
    else if (Array.isArray(valor)) cabeceras.set(clave, valor.join(', '));
  }

  const anfitrion = req.headers.host ?? 'localhost:5173';
  const metodo = req.method ?? 'GET';

  return new Request(`http://${anfitrion}${req.url}`, {
    method: metodo,
    headers: cabeceras,
    body: metodo === 'GET' || metodo === 'HEAD' || trozos.length === 0
      ? undefined
      : Buffer.concat(trozos),
  });
}

/** Vuelca la Response estandar en la respuesta de Node, respetando el streaming. */
async function escribirRespuesta(res: ServerResponse, respuesta: Response): Promise<void> {
  respuesta.headers.forEach((valor, clave) => res.setHeader(clave, valor));
  res.writeHead(respuesta.status);
  res.flushHeaders?.();

  if (!respuesta.body) {
    res.end();
    return;
  }

  const lector = respuesta.body.getReader();
  for (;;) {
    const { done, value } = await lector.read();
    if (done) break;
    res.write(Buffer.from(value));
  }
  res.end();
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // El tercer argumento vacio hace que se carguen TODAS las variables del .env,
  // no solo las que empiezan por VITE_. Las secretas nunca llegan al navegador:
  // solo viven en process.env del servidor de desarrollo.
  const entorno = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), funcionesEnDesarrollo(entorno)],
    server: {
      // Respeta el puerto que asigne el entorno; si no hay ninguno, el de siempre.
      port: Number(process.env.PORT) || 5173,
    },
  };
});
