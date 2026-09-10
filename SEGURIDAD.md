# Seguridad del sitio

El sitio no tiene cuentas, contraseñas ni base de datos. Lo único que recibe
datos de afuera son dos funciones: `/api/chat` (el sommelier) y `/api/lead` (el
formulario "Dejar mis datos"). Todo lo de abajo protege esas dos puertas y el
bolsillo que hay detrás de ellas (el saldo de DeepSeek y la cuota de Resend).

## Qué hace cada defensa

| Defensa | Dónde | Qué frena |
|---|---|---|
| Llaves solo en variables de entorno | Vercel y `.env` (fuera de git) | Que alguien lea la llave en el código o en el navegador |
| Build que se niega a publicar `VITE_*KEY` | `vite.config.ts` | Que una llave termine por error en el bundle público |
| Solo POST y solo desde el propio sitio | `api/_lib/seguridad.ts` | Que otra página use tu chat y gaste tu saldo |
| Límite por IP | `api/_lib/rateLimit.ts` | Chat: 10 por minuto y 120 al día. Formulario: 3 cada 10 minutos y 8 al día |
| Tope diario para todo el sitio | Solo con Redis | Chat: 1.500 al día. Formulario: 50 al día. Frena ataques repartidos entre muchas IP |
| Tope de tamaño del cuerpo | 200 KB el chat, 300 KB el formulario | Pegados enormes que inflan la cuenta o tumban la función |
| Limpieza de texto | Todo lo que escribe la gente | Caracteres de control e invisibles, y enlaces o etiquetas en el nombre |
| Campo trampa | Formulario | Robots que llenan todo lo que ven |
| Texto siempre plano | React y el correo escapado | Que un `<script>` escrito en el chat se ejecute |
| Cabeceras de seguridad | `vercel.json` | Que el sitio se meta en un iframe ajeno, o que cargue scripts de otros dominios |

## Límite de peticiones compartido (Redis)

Sin Redis, cada copia de la función cuenta por su lado, y Vercel levanta muchas.
Con Redis el conteo es uno solo. Para activarlo:

1. Vercel > proyecto > **Storage** > **Create** > **Upstash for Redis** (plan gratuito).
2. Conéctalo al proyecto. Vercel agrega solo `KV_REST_API_URL` y `KV_REST_API_TOKEN`.
3. Vuelve a desplegar.

No hay que tocar código: la función lo detecta sola.

## Qué queda en los registros

Cada evento sospechoso deja una línea JSON en **Vercel > proyecto > Logs**. Filtra
por `seguridad`. Nunca se guarda lo que escribió la persona ni sus datos de
contacto: solo el evento, la ruta, el país y una huella de la IP (no la IP).

| Evento | Qué significa | Cuándo preocuparse |
|---|---|---|
| `limite_superado` | Alguien pasó el límite por IP | Muchas seguidas desde la misma huella: alguien insiste con un script |
| `tope_global_alcanzado` | Se llenó el tope diario del sitio | Siempre. Llega también un correo de alerta |
| `origen_rechazado` | Una página de otro dominio intentó usar el chat | Si se repite, alguien quiere colgar tu chat en su sitio |
| `origen_ausente` | Llamada sin cabecera Origin, es decir, desde un script | Muchas: alguien automatizando llamadas |
| `metodo_no_permitido` | GET u otro método contra la API | Suele ser un escáner automático recorriendo rutas |
| `trampa_activada` | Un robot llenó el campo invisible | Si son muchas, hay un robot apuntando al formulario |
| `patron_de_ataque` | Texto con forma de ataque (`<script>`, `UNION SELECT`, `../`) | Alguien está probando el sitio a mano. Vale la pena mirar |
| `posible_manipulacion_del_bot` | Intentos de "ignora tus instrucciones" o "muestra tu prompt" | Unos pocos son curiosidad. Muchos de la misma huella, un intento serio |
| `tipo_contenido_invalido`, `cuerpo_demasiado_grande`, `json_invalido`, `historial_invalido`, `nombre_invalido`, `contacto_invalido` | Peticiones mal formadas | El widget nunca las produce: si aparecen, alguien está armando peticiones a mano |
| `proveedor_error` | DeepSeek o Resend respondieron con error | 401 o 403: la llave falló. 402: sin saldo. Llega alerta en el caso de DeepSeek |

## Alertas por correo

Llegan a `LEAD_DESTINO`, como mucho una por hora por tipo, y solo desde producción:

- El chat llegó al 80 % de su tope diario (necesita Redis).
- El chat o el formulario llegaron a su tope diario (necesita Redis).
- DeepSeek rechazó la llave o se quedó sin saldo.
- Falta la llave de DeepSeek.

Si Resend es el que falla, la alerta no puede salir por correo: queda solo en los
registros como `proveedor_error` con `proveedor: resend`.

## Si una llave se filtra

1. Genera una nueva en el panel del proveedor (DeepSeek o Resend).
2. Cámbiala en Vercel > Settings > Environment Variables y vuelve a desplegar.
3. Borra la vieja en el panel del proveedor. Hasta que no la borres, sigue sirviendo.
4. Revisa el consumo del proveedor de los últimos días.
