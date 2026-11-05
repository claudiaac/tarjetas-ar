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
| `disenos/<id>.svg/.png/.mind` | El dibujo, su imagen y el archivo con el que la cámara lo reconoce |

La cámara reconoce **solo el dibujo** (la parte cuadrada de arriba). El nombre se imprime debajo y el mensaje va atrás, por eso cada diseño necesita un solo archivo `.mind`, sin importar cuántas tarjetas se vendan.

## Agregar un diseño nuevo
1. Dibuja `disenos/<id>.svg` de 1000 × 1000 con mucho detalle y contraste (a la cámara le cuesta reconocer zonas lisas).
2. `powershell -File herramientas\render.ps1 <id>` → genera `disenos/<id>.png`. Si el dibujo ya es una imagen (como `picnic-cachorro` y `picnic-gato`), basta con guardarla como `disenos/<id>.png` cuadrada de 1000 × 1000.
3. `python herramientas/servidor.py` y abre `http://127.0.0.1:8766/herramientas/compilar.html?d=<id>` → genera `disenos/<id>.mind`.
4. Agrégalo en `js/disenos.js`.

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

## Pendiente
- Los dibujos son originales. No uses personajes con marca (Disney, Sanrio, Pokémon, Studio Ghibli…) en tarjetas que se venden.
