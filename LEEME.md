# 🎈 Tarjetas Sorpresa

Tienda de tarjetas de cumpleaños e **invitaciones a fiesta** imprimibles con realidad aumentada: el cliente elige tarjeta o invitación, un diseño, escribe el nombre y el mensaje, y descarga un PDF. Quien recibe la tarjeta escanea el QR, apunta el celular al dibujo y salen globos, confeti, un pastel y la canción de cumpleaños.

- **Tienda:** https://claudiaac.github.io/tarjetas-ar/
- **Invitaciones:** https://claudiaac.github.io/tarjetas-ar/#invitacion
- **Ejemplo de sorpresa:** https://claudiaac.github.io/tarjetas-ar/ver.html?d=kawaii&n=Ana#demo

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
5. Ponle su nombre y descripción en inglés en `DISENOS_EN` de `js/idioma.js` (si falta, en inglés sale el nombre en español). Si el dibujo trae texto (como `oso-fiestero`), haz también `disenos/<id>-en.png` con el texto en inglés, genera su `.mind` y agrega el id en `DIBUJO_EN` de `js/idioma.js`.

## Inglés
El botón **ES / EN** de la tienda cambia el idioma; la primera vez se elige según el idioma del navegador. Liga directa a la tienda en inglés: `?lang=en`. Las tarjetas hechas en inglés llevan `lang=en` en el QR, así la sorpresa, el calendario y el WhatsApp de confirmar salen en inglés. En inglés, un WhatsApp de 10 dígitos sin lada se toma como de EE. UU. o Canadá (+1), y el calendario usa la zona horaria de quien compra.

## Pendiente
- **Cobro con Mercado Pago.** Para que nadie descargue sin pagar hace falta un servidor pequeño que confirme el pago (por ejemplo, una función en Netlify o Vercel). GitHub Pages solo sirve páginas estáticas.
- Los dibujos son originales. No uses personajes con marca (Disney, Sanrio, Pokémon, Studio Ghibli…) en tarjetas que se venden.
