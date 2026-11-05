# 🎈 Tarjetas Sorpresa

Tienda de tarjetas de cumpleaños e **invitaciones a fiesta** imprimibles con realidad aumentada: el cliente elige tarjeta o invitación, un diseño, escribe el nombre y el mensaje, y descarga un PDF. Quien recibe la tarjeta escanea el QR, apunta el celular al dibujo y salen globos, confeti, un pastel y la canción de cumpleaños.

- **Tienda:** https://claudiaac.github.io/tarjetas-ar/
- **Invitaciones:** https://claudiaac.github.io/tarjetas-ar/#invitacion
- **Ejemplo de sorpresa:** https://claudiaac.github.io/tarjetas-ar/ver.html?d=kawaii&n=Ana#demo

## Publicar en Netlify
El sitio también se puede alojar en Netlify (HTTPS incluido, que la cámara necesita). `netlify.toml` ya trae la configuración: no hay compilación y se publica la carpeta raíz. En Netlify: **Add new site → Import an existing project → GitHub → `tarjetas-ar`**, rama `main`, y **Deploy**. Cada cambio que llegue a `main` se publica solo.

Los QR toman la dirección de la página donde se generó la tarjeta, así que las tarjetas hechas desde Netlify apuntan a Netlify y las que ya se imprimieron desde GitHub Pages siguen apuntando a GitHub Pages. Por eso conviene dejar GitHub Pages encendido.

## Cómo funciona
| Archivo | Para qué sirve |
|---|---|
| `index.html` | La tienda: 1) elige diseño, 2) personaliza, 3) descarga en PDF |
| `ver.html` | Lo que abre el QR. Lee `?d=<diseño>&n=<nombre>` y muestra la sorpresa con la cámara (o `#demo` sin cámara). En invitaciones (`t=inv`) también muestra fecha, lugar, nota y botones de mapa, calendario y confirmar por WhatsApp |
| `js/disenos.js` | Catálogo: nombre, tipo, colores, letra y **precio** (`PRECIO_MXN`) |
| `js/tarjeta.js` | Dibuja el frente y el reverso (de tarjeta o invitación) y arma el PDF |
| `js/invitacion.js` | Datos de la invitación en la URL del QR y ligas de mapa, calendario y WhatsApp |
| `js/fiesta.js` | Globos, confeti, pastel y canción |
| `js/idioma.js` | Español e inglés: textos de la tienda, de la tarjeta y de la sorpresa, y los nombres de los diseños en inglés |
| `disenos/<id>.svg/.png/.mind` | El dibujo, su imagen y el archivo con el que la cámara lo reconoce |

La cámara reconoce **solo el dibujo** (la parte cuadrada de arriba). El nombre se imprime debajo y el mensaje va atrás, por eso cada diseño necesita un solo archivo `.mind`, sin importar cuántas tarjetas se vendan.

## Agregar un diseño nuevo
1. Dibuja `disenos/<id>.svg` de 1000 × 1000 con mucho detalle y contraste (a la cámara le cuesta reconocer zonas lisas).
2. `powershell -File herramientas\render.ps1 <id>` → genera `disenos/<id>.png`. Si el dibujo ya es una imagen (como `picnic-cachorro` y `picnic-gato`), basta con guardarla como `disenos/<id>.png` cuadrada de 1000 × 1000.
3. `python herramientas/servidor.py` y abre `http://127.0.0.1:8766/herramientas/compilar.html?d=<id>` → genera `disenos/<id>.mind`.
4. Agrégalo en `js/disenos.js`.
5. Ponle su nombre y descripción en inglés en `DISENOS_EN` de `js/idioma.js` (si falta, en inglés sale el nombre en español).

## Inglés
El botón **ES / EN** de la tienda cambia el idioma; la primera vez se elige según el idioma del navegador. Liga directa a la tienda en inglés: `?lang=en`. Las tarjetas hechas en inglés llevan `lang=en` en el QR, así la sorpresa, el calendario y el WhatsApp de confirmar salen en inglés. En inglés, un WhatsApp de 10 dígitos sin lada se toma como de EE. UU. o Canadá (+1), y el calendario usa la zona horaria de quien compra.

## Cobro con Mercado Pago
Al tocar **Descargar PDF**, la tienda guarda la tarjeta en el navegador y manda al cliente a Mercado Pago (tarjeta, OXXO, SPEI o saldo). Al regresar, una función en Netlify le pregunta a Mercado Pago si el pago está aprobado y, si sí, se desbloquea la descarga. Si el cliente cambia el diseño o el texto, es otra tarjeta y se cobra de nuevo.

| Archivo | Para qué sirve |
|---|---|
| `netlify/functions/crear-pago.mjs` | Crea el pago por `PRECIO_MXN` (el precio lo pone el servidor, no el navegador) |
| `netlify/functions/verificar-pago.mjs` | Confirma que el pago es de ese pedido, por el precio completo y está aprobado |

Para activarlo:
1. Crea tu cuenta en [Mercado Pago](https://www.mercadopago.com.mx) y entra a [Tus integraciones](https://www.mercadopago.com.mx/developers/panel/app) → **Crear aplicación** (tipo *Pagos online*, producto *Checkout Pro*).
2. Copia el **Access Token** de *Credenciales de prueba* (empieza con `TEST-`).
3. En Netlify: *Site configuration → Environment variables* → agrega `MP_ACCESS_TOKEN` con ese valor y vuelve a publicar.
4. Prueba una compra con las [tarjetas de prueba](https://www.mercadopago.com.mx/developers/es/docs/checkout-pro/additional-content/your-integrations/test/cards).
5. Cuando funcione, cambia `MP_ACCESS_TOKEN` por el Access Token de *Credenciales de producción* (empieza con `APP_USR-`).

En `localhost` o `127.0.0.1` la descarga sigue libre para probar diseños. La tienda en GitHub Pages no tiene funciones, así que ahí ya no se puede descargar: los clientes deben comprar en el sitio de Netlify.

## Panel de administración
En **`/admin/`** (por ejemplo `https://<tu-sitio>.netlify.app/admin/`) está el panel de FiatCraftHaus, al estilo del Shop Manager de Etsy:

- **Inicio:** tareas principales (pedidos pagados hoy, pagos pendientes de OXXO o SPEI, mensajes sin atender, sorpresas abiertas hoy) y estadísticas de hoy, 7 o 30 días: vistas, visitas, pedidos e ingresos (lo cobrado y lo que te queda después de la comisión de Mercado Pago), con una gráfica por día.
- **Actividad reciente:** ventas, mensajes y visitas, lo más nuevo arriba, con filtros Todo, Compras, Mensajes y Visitas.
- **Pedidos:** los pagos de Mercado Pago de los últimos 30 días, con su estado.
- **Mensajes:** lo que llega del formulario *¿Dudas? Escríbenos* al final de la tienda. Se responden por correo o WhatsApp y se marcan como atendidos.

El panel no aparece en ningún menú y los buscadores no lo indexan, pero lo que de verdad lo protege es la contraseña: la página no trae datos, se los pide a `netlify/functions/admin.mjs` y esa función solo contesta con la contraseña correcta.

| Archivo | Para qué sirve |
|---|---|
| `admin/index.html` | El panel. El logo es `admin/logo-fiatcrafthaus.png` |
| `netlify/functions/admin.mjs` | Revisa la contraseña y junta visitas, mensajes y pedidos de Mercado Pago |
| `netlify/functions/visita.mjs` | Suma una visita por día (tienda o sorpresa). No guarda IP ni cookies |
| `netlify/functions/contacto.mjs` | Guarda los mensajes del formulario de contacto |
| `js/visitas.js` | Avisa de la visita desde `index.html` y `ver.html` |

Visitas y mensajes se guardan en **Netlify Blobs**, que es gratis y no hay que activar. Para entrar al panel:
1. En Netlify: *Site configuration → Environment variables* → agrega `ADMIN_PASSWORD` con una contraseña larga (mínimo 10 caracteres; mejor una frase de 4 o 5 palabras) y vuelve a publicar.
2. Abre `/admin/` y escribe la contraseña. Se olvida al cerrar la pestaña.
3. Los pedidos usan el mismo `MP_ACCESS_TOKEN` del cobro.

Las visitas no se cuentan en tu compu (`localhost`), ni en el navegador donde abriste el panel, ni las de robots. "Ver la sorpresa" desde la tienda (`#demo`) tampoco cuenta como sorpresa abierta.

## Pendiente
- Los dibujos son originales. No uses personajes con marca (Disney, Sanrio, Pokémon, Studio Ghibli…) en tarjetas que se venden.
