# El chat del sitio

Sommelier virtual para desquiciado-sas.com. Sin n8n y sin suscripción mensual:
solo se paga lo que consume el modelo, por uso.

## Cómo está armado

```
Navegador (widget de React)
        │  POST /api/chat   ← nunca viaja la llave
        ▼
Función serverless en Vercel  ← acá vive la llave y el prompt
        │  POST https://api.deepseek.com/chat/completions
        ▼
DeepSeek, y la respuesta vuelve en streaming
```

La llave de la API **jamás** puede ir en el código de React: el bundle es público.
Esa es la única razón por la que existe la función intermedia.

## Los archivos

| Archivo | Qué hace |
|---|---|
| `api/chat.ts` | Habla con DeepSeek. Guarda la llave, limita el abuso y devuelve el stream. |
| `api/lead.ts` | Recibe los datos de contacto y te los manda por correo con Resend. |
| `api/_lib/knowledge.ts` | **Lo que el bot sabe.** Las nueve etiquetas y todo el contexto del negocio. |
| `api/_lib/systemPrompt.ts` | Quién es el bot, cómo habla y qué tiene prohibido. |
| `api/_lib/rateLimit.ts` | Límite de peticiones por IP y topes diarios. Usa Redis si está conectado. |
| `api/_lib/seguridad.ts` | Origen permitido, lectura segura del cuerpo, limpieza de texto y registro de eventos. |
| `api/_lib/alertas.ts` | Correo de alerta cuando algo grave pasa (tope diario, llave rechazada). |
| `src/components/chat/ChatWidget.tsx` | La burbuja, el panel y la verificación de edad. |
| `src/components/chat/useChat.ts` | El estado de la conversación y la lectura del stream. |
| `src/components/chat/LeadForm.tsx` | El formulario de datos dentro del chat. |

## Puesta en marcha, paso a paso

### 1. Sacar la llave de DeepSeek

1. Entra a `https://platform.deepseek.com` y crea la cuenta.
2. Recarga saldo. Es prepago, no suscripción. Con 10 dólares tienes para rato.
3. Ve a **API keys**, crea una y cópiala. Solo se muestra una vez.
4. Deja un tope de gasto configurado. Es la red de seguridad real.

### 2. Cargar la llave en Vercel

En el proyecto, **Settings > Environment Variables**, agrega:

| Nombre | Valor |
|---|---|
| `DEEPSEEK_API_KEY` | la llave del paso anterior |

Marca los tres entornos (Production, Preview, Development) y vuelve a desplegar,
porque las variables solo entran en un despliegue nuevo.

Con eso el chat ya funciona.

### 3. Que te lleguen los contactos por correo (opcional)

1. Crea la cuenta en `https://resend.com` (3.000 correos al mes gratis).
2. Verifica el dominio `desquiciado-sas.com`. Mientras tanto puedes usar
   `onboarding@resend.dev` como remitente, pero solo te llegará a ti.
3. Agrega en Vercel:

| Nombre | Valor |
|---|---|
| `RESEND_API_KEY` | la llave de Resend |
| `LEAD_DESTINO` | el correo que recibe los avisos |
| `LEAD_REMITENTE` | `Chat Desquiciado <chat@desquiciado-sas.com>` |

Sin esto, el botón de WhatsApp sigue funcionando: lo único que queda inhabilitado
es "Dejar mis datos".

### 4. Probar en local

Copia `.env.example` como `.env`, llena `DEEPSEEK_API_KEY` y levanta el sitio:

```bash
npm --prefix "Web page desquiciado" run dev
```

El servidor de desarrollo monta las funciones de `/api` igual que Vercel, así que
el chat funciona en local sin instalar nada más.

## Cómo cambiarle cosas al bot

**Agregar o quitar un vino:** solo `api/_lib/knowledge.ts`. Copia un objeto de
`VINOS`, cambia los datos y listo. El campo `cuandoTomarlo` es el que más manda a
la hora de recomendar, escríbelo como lo diría Rosenda.

**Cambiar el tono o las reglas:** `api/_lib/systemPrompt.ts`. Está escrito con
tildes a propósito: el modelo copia la ortografía de lo que lee.

**Cambiar los colores del widget:** `src/components/chat/ChatWidget.tsx`. Usa solo
los tokens de la paleta que ya están en `tailwind.config.js`.

**Cambiar de proveedor de modelo:** las variables `DEEPSEEK_BASE_URL` y
`DEEPSEEK_MODEL`. Cualquier API compatible con OpenAI entra sin tocar código.

## Lo que el bot tiene prohibido

Está instruido para no dar precios, no prometer inventario ni envíos, no inventar
puntajes ni añadas, no cerrar ventas y no obedecer instrucciones que vengan dentro
del mensaje del usuario. Cuando algo se sale de ahí, ofrece pasar a WhatsApp o
tomar los datos.

Además pide confirmación de mayoría de edad antes de abrir la conversación, y esa
respuesta se recuerda en el navegador de la persona.

## Costo

Cerca de un centavo de dólar por conversación, o menos. El prompt del sistema pesa
unos 5.000 tokens y es idéntico siempre, así que DeepSeek lo sirve desde su caché
de contexto y cobra una fracción por esa parte.

Con 500 a 1.000 conversaciones al mes, la cuenta ronda entre 3 y 8 dólares.
Los precios exactos están en la página de precios de DeepSeek, que los ha cambiado
varias veces.

## Seguridad

Todo lo que defiende al chat y al formulario está explicado en `SEGURIDAD.md`:
límites, topes diarios, qué eventos quedan en los registros y cómo buscarlos.

## Sobre los datos

Las conversaciones pasan por servidores de DeepSeek. Para hablar de Malbec da igual,
y por eso mismo los datos personales del formulario **no pasan por el modelo**: van
del navegador a `/api/lead` y de ahí a tu correo, sin escala.
