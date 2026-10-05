# 🎈 Tarjetas Sorpresa

Tienda de tarjetas de cumpleaños imprimibles con realidad aumentada: el cliente elige un diseño, escribe el nombre y el mensaje, y descarga un PDF. Quien recibe la tarjeta escanea el QR, apunta el celular al dibujo y salen globos, confeti, un pastel y la canción de cumpleaños.

- **Tienda:** https://claudiaac.github.io/tarjetas-ar/
- **Ejemplo de sorpresa:** https://claudiaac.github.io/tarjetas-ar/ver.html?d=kawaii&n=Ana#demo

## Cómo funciona
| Archivo | Para qué sirve |
|---|---|
| `index.html` | La tienda: 1) elige diseño, 2) personaliza, 3) descarga en PDF |
| `ver.html` | Lo que abre el QR. Lee `?d=<diseño>&n=<nombre>` y muestra la sorpresa con la cámara (o `#demo` sin cámara) |
| `js/disenos.js` | Catálogo: nombre, tipo, colores, letra y **precio** (`PRECIO_MXN`) |
| `js/tarjeta.js` | Dibuja el frente y el reverso y arma el PDF |
| `js/fiesta.js` | Globos, confeti, pastel y canción |
| `disenos/<id>.svg/.png/.mind` | El dibujo, su imagen y el archivo con el que la cámara lo reconoce |

La cámara reconoce **solo el dibujo** (la parte cuadrada de arriba). El nombre se imprime debajo y el mensaje va atrás, por eso cada diseño necesita un solo archivo `.mind`, sin importar cuántas tarjetas se vendan.

## Agregar un diseño nuevo
1. Dibuja `disenos/<id>.svg` de 1000 × 1000 con mucho detalle y contraste (a la cámara le cuesta reconocer zonas lisas).
2. `powershell -File herramientas\render.ps1 <id>` → genera `disenos/<id>.png`.
3. `python herramientas/servidor.py` y abre `http://127.0.0.1:8766/herramientas/compilar.html?d=<id>` → genera `disenos/<id>.mind`.
4. Agrégalo en `js/disenos.js`.

## Pendiente
- **Cobro con Mercado Pago.** Para que nadie descargue sin pagar hace falta un servidor pequeño que confirme el pago (por ejemplo, una función en Netlify o Vercel). GitHub Pages solo sirve páginas estáticas.
- Los dibujos son originales. No uses personajes con marca (Disney, Sanrio, Pokémon, Studio Ghibli…) en tarjetas que se venden.
