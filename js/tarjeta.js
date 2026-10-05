// Dibuja el frente y el reverso de la tarjeta en canvas (125 x 175 mm a ~300 dpi)
// y arma el PDF carta horizontal para imprimir y doblar.

export const ANCHO = 1476, ALTO = 2067;
const ESCALA_FUENTE = { 'Press Start 2P': 0.5, 'Great Vibes': 1.2, 'Amatic SC': 1.3 };

const imagenes = {};
function cargarImagen(src) {
  imagenes[src] ??= new Promise((ok, mal) => {
    const img = new Image();
    img.onload = () => ok(img);
    img.onerror = mal;
    img.src = src;
  });
  return imagenes[src];
}

async function cargarFuente(d) {
  try { await document.fonts.load(`${d.peso} 100px "${d.fuente}"`); } catch { /* usa la de respaldo */ }
}

function fuente(d, px) {
  return `${d.peso} ${Math.round(px * (ESCALA_FUENTE[d.fuente] || 1))}px "${d.fuente}", sans-serif`;
}

// Escribe una línea centrada achicando la letra hasta que quepa en `max` px.
function lineaAjustada(ctx, d, texto, y, px, max) {
  let tam = px;
  do {
    ctx.font = fuente(d, tam);
    tam -= 6;
  } while (ctx.measureText(texto).width > max && tam > 30);
  ctx.fillText(texto, ANCHO / 2, y);
}

function partirTexto(ctx, texto, max) {
  const lineas = [];
  for (const parrafo of texto.split('\n')) {
    let actual = '';
    for (const palabra of parrafo.split(/\s+/)) {
      const prueba = actual ? actual + ' ' + palabra : palabra;
      if (ctx.measureText(prueba).width > max && actual) {
        lineas.push(actual);
        actual = palabra;
      } else {
        actual = prueba;
      }
    }
    lineas.push(actual);
  }
  return lineas;
}

function rectRedondo(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

export async function dibujarFrente(canvas, d, nombre) {
  await cargarFuente(d);
  const img = await cargarImagen(`disenos/${d.id}.png`);
  canvas.width = ANCHO;
  canvas.height = ALTO;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = d.fondo;
  ctx.fillRect(0, 0, ANCHO, ALTO);

  // el dibujo (esta es la parte que reconoce la cámara: no se le pone nada encima)
  ctx.save();
  rectRedondo(ctx, 63, 63, 1350, 1350, 40);
  ctx.clip();
  ctx.drawImage(img, 63, 63, 1350, 1350);
  ctx.restore();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = d.suave;
  lineaAjustada(ctx, d, '¡Feliz cumpleaños!', 1580, 96, 1300);
  ctx.fillStyle = d.tinta;
  lineaAjustada(ctx, d, nombre || 'Tu nombre', 1830, 230, 1320);
  ctx.fillStyle = d.suave;
  ctx.globalAlpha = 0.8;
  ctx.font = `600 40px "Baloo 2", sans-serif`;
  ctx.fillText('✨ apunta la cámara al dibujo ✨', ANCHO / 2, 1985);
  ctx.globalAlpha = 1;
}

export async function dibujarReverso(canvas, d, { nombre, mensaje, de, url }) {
  await cargarFuente(d);
  canvas.width = ANCHO;
  canvas.height = ALTO;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = d.fondo;
  ctx.fillRect(0, 0, ANCHO, ALTO);
  ctx.textAlign = 'center';

  ctx.fillStyle = d.tinta;
  lineaAjustada(ctx, d, '¡Escanéame!', 230, 120, 1200);

  // código QR
  const qr = qrcode(0, 'M');
  qr.addData(url);
  qr.make();
  const n = qr.getModuleCount(), caja = 700, x0 = (ANCHO - caja) / 2, y0 = 300;
  ctx.fillStyle = '#FFFFFF';
  rectRedondo(ctx, x0, y0, caja, caja, 36);
  ctx.fill();
  const margen = 50, celda = (caja - margen * 2) / n;
  ctx.fillStyle = '#2B1B24';
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (qr.isDark(r, c)) ctx.fillRect(x0 + margen + c * celda, y0 + margen + r * celda, Math.ceil(celda), Math.ceil(celda));
    }
  }

  // mensaje
  ctx.fillStyle = d.tinta;
  ctx.font = `500 60px "Baloo 2", sans-serif`;
  const texto = mensaje || `Que este día esté lleno de alegría, ${nombre || 'amiga'}. 💖`;
  const lineas = partirTexto(ctx, texto, 1200).slice(0, 6);
  let y = 1140;
  for (const l of lineas) { ctx.fillText(l, ANCHO / 2, y); y += 78; }
  if (de) {
    ctx.fillStyle = d.suave;
    ctx.font = `600 56px "Baloo 2", sans-serif`;
    ctx.fillText(`Con cariño, ${de}`, ANCHO / 2, y + 40);
  }

  // instrucciones
  ctx.fillStyle = d.suave;
  ctx.font = `600 38px "Baloo 2", sans-serif`;
  ctx.fillText('1. Escanea el código   2. Toca «¡Abrir sorpresa!»', ANCHO / 2, 1900);
  ctx.fillText('3. Apunta la cámara al dibujo del frente   🔊 sube el volumen', ANCHO / 2, 1955);
}

export async function descargarPDF(d, datos) {
  const frente = document.createElement('canvas');
  const reverso = document.createElement('canvas');
  await dibujarFrente(frente, d, datos.nombre);
  await dibujarReverso(reverso, d, datos);

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'letter' });
  const w = 125, h = 175, x = (279.4 - w * 2) / 2, y = (215.9 - h) / 2;
  pdf.addImage(reverso.toDataURL('image/jpeg', 0.92), 'JPEG', x, y, w, h);
  pdf.addImage(frente.toDataURL('image/jpeg', 0.92), 'JPEG', x + w, y, w, h);
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(0.2);
  pdf.rect(x, y, w * 2, h);
  pdf.setLineDashPattern([2, 2], 0);
  pdf.line(x + w, y - 6, x + w, y + h + 6);
  pdf.setFontSize(8);
  pdf.setTextColor(150, 150, 150);
  pdf.text('doblar aquí', x + w, y - 8, { align: 'center' });
  pdf.text('Recorta por la orilla gris e imprime al 100 % (sin "ajustar a la página").', 279.4 / 2, y + h + 10, { align: 'center' });
  const archivo = `tarjeta-${d.id}-${(datos.nombre || 'cumple').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\w]+/g, '-').replace(/^-|-$/g, '').toLowerCase()}.pdf`;
  pdf.save(archivo);
}
