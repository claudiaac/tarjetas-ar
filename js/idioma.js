// Español e inglés. La tienda usa el idioma del navegador (o el que elija el cliente) y lo
// guarda en la URL del QR (`lang=en`), así la sorpresa sale en el idioma de la tarjeta.
// El español es el idioma base: si falta una traducción se usa el texto en español.

export const IDIOMAS = { es: 'Español', en: 'English' };

const CLAVE = 'tarjetas-idioma';

// ?lang=en en la URL > lo que eligió antes > idioma del navegador
export function idiomaInicial() {
  const url = new URLSearchParams(location.search).get('lang');
  if (url in IDIOMAS) return url;
  try {
    const guardado = localStorage.getItem(CLAVE);
    if (guardado in IDIOMAS) return guardado;
  } catch { /* modo privado */ }
  return (navigator.language || 'es').toLowerCase().startsWith('es') ? 'es' : 'en';
}

export function guardarIdioma(l) {
  try { localStorage.setItem(CLAVE, l); } catch { /* modo privado */ }
}

// Nombres de diseños y tipos en inglés (en español se usan los de disenos.js)
const DISENOS_EN = {
  kawaii: ['Kawaii cupcake', 'A cupcake with a smiley face, sprinkles and pastel stars.'],
  acuarela: ['Hillside picnic', 'Anime-style watercolor landscape: clouds, a cottage and a cake under a tree.'],
  'picnic-cachorro': ['Hillside picnic: puppy', 'A puppy in a bandana having a picnic on the hill, with strawberries, sandwiches and lemonade.'],
  'picnic-gato': ['Hillside picnic: kitten', 'A calico kitten in a bandana having a picnic on the hill, with strawberries, sandwiches and lemonade.'],
  coquette: ['Bow & cherries', 'A cake with cherries, pearls, lace and a big pink bow.'],
  cottagecore: ['Strawberry cake', 'Strawberries, daisies, mushrooms and a bunny on a gingham tablecloth.'],
  pixel: ['Level up', 'An 8-bit cake with hearts, coins and retro video game mushrooms.'],
  mascotas: ['Puppy & kitten', 'A chibi puppy and kitten with party hats and balloons.'],
  'geek-oscuro': ['Binary laptop (dark)', 'A laptop that says "Happy Birthday" in binary code, on a black background.'],
  'geek-claro': ['Binary laptop (light)', 'A laptop that says "Happy Birthday" in binary code, on a white background.'],
};
const TIPOS_EN = {
  kawaii: 'Kawaii', acuarela: 'Anime watercolor', coquette: 'Coquette', cottagecore: 'Cottagecore',
  pixel: 'Pixel art', mascotas: 'Chibi pets', geek: 'Geek',
};

export const nombreDiseno = (d, l) => (l === 'en' && DISENOS_EN[d.id]?.[0]) || d.nombre;
export const descripcionDiseno = (d, l) => (l === 'en' && DISENOS_EN[d.id]?.[1]) || d.descripcion;
export const nombreTipo = (tipo, TIPOS, l) => (l === 'en' && TIPOS_EN[tipo]) || TIPOS[tipo] || tipo;

// Textos que arma el código (los fijos de index.html se traducen con data-t, ver TIENDA_EN)
const TEXTOS = {
  es: {
    locale: 'es-MX',
    todos: 'Todos',
    elegido: '✓ Elegido',
    tarjeta: 'Tarjeta',
    invitacion: 'Invitación',
    mensaje: { tarjeta: 'Mensaje', invitacion: 'Nota (opcional)' },
    ejemploMensaje: {
      tarjeta: 'Ej. Gracias por enseñarnos con tanto cariño. ¡Que tengas un día increíble!',
      invitacion: 'Ej. Trae traje de baño 🩱 ¡Habrá alberca!',
    },
    falta: { nombre: 'el nombre de quien cumple años', fecha: 'la fecha de la fiesta', hora: 'la hora', lugar: 'el lugar' },
    escribe: (x) => `Escribe ${x} 🎂`,
    fechaPasada: 'La fecha de la fiesta ya pasó, elige otra 📅',
    preparando: 'Preparando… 🎀',
    descargar: 'Descargar PDF',
    errorPDF: 'No se pudo crear el PDF. Intenta de nuevo.',

    // tarjeta impresa
    felizCumple: '¡Feliz cumpleaños!',
    venAños: (edad) => `Ven a celebrar los ${edad} años de`,
    venFiesta: 'Ven a la fiesta de',
    tuNombre: 'Tu nombre',
    apunta: '✨ apunta la cámara al dibujo ✨',
    escaneame: '¡Escanéame!',
    mensajeDefault: (nombre) => `Que este día esté lleno de alegría, ${nombre || 'amiga'}. 💖`,
    conCarino: (de) => `Con cariño, ${de}`,
    pasos1: '1. Escanea el código   2. Toca «¡Abrir sorpresa!»',
    pasos2: '3. Apunta la cámara al dibujo del frente   🔊 sube el volumen',
    invPasos1: (confirmar) => 'Escanea el código para ver la sorpresa, el mapa' + (confirmar ? ' y confirmar' : ''),
    invPasos2: 'Luego apunta la cámara al dibujo del frente   🔊 sube el volumen',
    doblar: 'doblar aquí',
    imprimir: 'Recorta por la orilla gris e imprime al 100 % (sin "ajustar a la página").',
    archivo: { tarjeta: 'tarjeta', invitacion: 'invitacion', cumple: 'cumple' },

    // sorpresa (ver.html)
    sorpresa: '¡Una sorpresa para ti!',
    sorpresaPara: (n) => `¡Una sorpresa para ${n}!`,
    tituloCumple: (n) => (n ? `¡Feliz cumpleaños, ${n}!` : '¡Feliz cumpleaños!'),
    teInvita: (n) => `¡${n} te invita a su fiesta!`,
    invitado: '¡Estás invitado a una fiesta!',
    venFiestaDe: (n) => (n ? `¡Ven a la fiesta de ${n}!` : '¡Ven a mi fiesta!'),
    instrucciones: 'Toca el botón, permite usar la cámara y apunta al dibujo de tu tarjeta 💖',
    instruccionesInv: 'Toca el botón, permite usar la cámara y apunta al dibujo de tu invitación 💖',
    abrir: '¡Abrir sorpresa! ✨',
    sinCamara: 'o verla sin cámara',
    pista: 'Apunta la cámara al dibujo 🎀',
    repetir: 'Toca la tarjeta para repetir 🎶',
    comoLlegar: '📍 Cómo llegar',
    agendar: '📅 Agendar',
    confirmar: '💌 Confirmar',
    abriendo: 'Abriendo cámara… 🎀',
    noAbre: '¿No se abre la cámara? Abre esta página en Chrome o Safari (menú ⋮ → "Abrir en el navegador") 🙏',
    reintentar: 'Intentar de nuevo 🔄',
    errorCamara: 'No se pudo abrir la cámara. Revisa que diste permiso, o ve la tarjeta sin cámara 👇',
    eventoCalendario: (n) => `Fiesta de ${n || 'cumpleaños'} 🎉`,
    mensajeConfirmar: (n) => `¡Hola! Confirmo que voy a la fiesta de ${n || 'cumpleaños'} 🎉`,
  },
  en: {
    locale: 'en-US',
    todos: 'All',
    elegido: '✓ Selected',
    tarjeta: 'Card',
    invitacion: 'Invitation',
    mensaje: { tarjeta: 'Message', invitacion: 'Note (optional)' },
    ejemploMensaje: {
      tarjeta: 'E.g. Thank you for teaching us with so much love. Have an amazing day!',
      invitacion: 'E.g. Bring a swimsuit 🩱 There will be a pool!',
    },
    falta: { nombre: 'the birthday person’s name', fecha: 'the party date', hora: 'the time', lugar: 'the place' },
    escribe: (x) => `Please enter ${x} 🎂`,
    fechaPasada: 'That party date has already passed, please pick another 📅',
    preparando: 'Getting it ready… 🎀',
    descargar: 'Download PDF',
    errorPDF: 'We couldn’t create the PDF. Please try again.',

    felizCumple: 'Happy Birthday!',
    venAños: (edad) => `Come celebrate the ${ordinal(edad)} birthday of`,
    venFiesta: 'You’re invited to the party of',
    tuNombre: 'Your name',
    apunta: '✨ point your camera at the picture ✨',
    escaneame: 'Scan me!',
    mensajeDefault: (nombre) => `May your day be filled with joy, ${nombre || 'friend'}. 💖`,
    conCarino: (de) => `With love, ${de}`,
    pasos1: '1. Scan the code   2. Tap “Open surprise!”',
    pasos2: '3. Point the camera at the front picture   🔊 turn up the volume',
    invPasos1: (confirmar) => 'Scan the code to see the surprise, the map' + (confirmar ? ' and RSVP' : ''),
    invPasos2: 'Then point the camera at the front picture   🔊 turn up the volume',
    doblar: 'fold here',
    imprimir: 'Cut along the gray edge and print at 100% (no "fit to page").',
    archivo: { tarjeta: 'card', invitacion: 'invitation', cumple: 'birthday' },

    sorpresa: 'A surprise for you!',
    sorpresaPara: (n) => `A surprise for ${n}!`,
    tituloCumple: (n) => (n ? `Happy Birthday, ${n}!` : 'Happy Birthday!'),
    teInvita: (n) => `${n} invites you to their party!`,
    invitado: 'You’re invited to a party!',
    venFiestaDe: (n) => (n ? `Come to ${n}’s party!` : 'Come to my party!'),
    instrucciones: 'Tap the button, allow the camera and point it at the picture on your card 💖',
    instruccionesInv: 'Tap the button, allow the camera and point it at the picture on your invitation 💖',
    abrir: 'Open surprise! ✨',
    sinCamara: 'or watch it without the camera',
    pista: 'Point the camera at the picture 🎀',
    repetir: 'Tap the card to play again 🎶',
    comoLlegar: '📍 Directions',
    agendar: '📅 Add to calendar',
    confirmar: '💌 RSVP',
    abriendo: 'Opening camera… 🎀',
    noAbre: 'Camera not opening? Open this page in Chrome or Safari (menu ⋮ → "Open in browser") 🙏',
    reintentar: 'Try again 🔄',
    errorCamara: 'We couldn’t open the camera. Check that you allowed it, or watch the card without the camera 👇',
    eventoCalendario: (n) => (n ? `${n}’s party 🎉` : 'Birthday party 🎉'),
    mensajeConfirmar: (n) => `Hi! I’m coming to ${n ? `${n}’s party` : 'the birthday party'} 🎉`,
  },
};

// 1st, 2nd, 3rd, 4th… 11th, 12th, 13th, 21st
function ordinal(n) {
  const x = Number(n), dec = x % 100;
  const suf = dec >= 11 && dec <= 13 ? 'th' : { 1: 'st', 2: 'nd', 3: 'rd' }[x % 10] || 'th';
  return `${n}${suf}`;
}

export const textos = (l) => TEXTOS[l] || TEXTOS.es;

// Textos fijos de index.html en inglés, por su data-t. El español se queda en el HTML.
export const TIENDA_EN = {
  titulo: 'Surprise Cards: augmented reality birthday cards and party invitations',
  descripcion: 'Printable birthday cards and party invitations with augmented reality: point your phone and balloons, confetti and the birthday song pop out.',
  marca: '🎈 Surprise Cards',
  'nav-disenos': 'Designs',
  'nav-personaliza': 'Customize',
  'nav-descarga': 'Download',
  'hero-titulo': 'Cards and invitations that <span>come to life</span> ✨',
  'hero-texto': 'Print your card or invitation, point your phone at the picture and out come balloons, confetti, a cake and the birthday song. No apps needed.',
  'mini-1': '1 · Pick your design',
  'mini-2': '2 · Customize',
  'mini-3': '3 · Download as PDF',
  'paso1-titulo': '<span class="num">1</span> Pick your design',
  'paso1-ayuda': 'Card or invitation? Then filter by style and tap the design you like best.',
  'producto-tarjeta': '<strong>🎂 Birthday card</strong><small>A gift, with your message on the back.</small>',
  'producto-invitacion': '<strong>💌 Party invitation</strong><small>With date, place, map and RSVP by WhatsApp.</small>',
  'paso2-titulo': '<span class="num">2</span> Customize',
  'paso2-ayuda-tarjeta': 'This is how your card will look. The name goes on the front; the message and QR code on the back.',
  'paso2-ayuda-invitacion': 'This is how your invitation will look. The name goes on the front; the party details and QR code on the back.',
  'l-nombre': 'Birthday person’s name',
  'ph-nombre': 'E.g. Miss Lulu',
  'l-edad': 'Age they’re turning (optional)',
  'ph-edad': 'E.g. 7',
  'l-fecha': 'Date',
  'l-hora': 'Time',
  'l-lugar': 'Place',
  'ph-lugar': 'E.g. Little World Party Hall',
  'l-direccion': 'Address (optional)',
  'ph-direccion': 'E.g. 120 Main St, Springfield',
  'pista-direccion': 'With the address, the QR code opens the map to get there.',
  'l-whatsapp': 'WhatsApp for RSVPs (optional)',
  'ph-whatsapp': 'E.g. +1 555 123 4567',
  'pista-whatsapp': 'Guests RSVP with one tap from the QR code. Include the country code.',
  'l-de': 'From (optional)',
  'ph-de': 'E.g. Your 3rd grade students',
  'lado-frente': 'Front',
  'lado-reverso': 'Back',
  'paso3-titulo': '<span class="num">3</span> Download as PDF',
  'paso3-ayuda': 'A letter-size sheet ready to print, cut and fold.',
  demo: '👀 See the surprise',
  'nota-copias': '🖨️ Print as many copies as you need from the same PDF: they all share the same QR code.',
  'nota-pago': '💳 Mercado Pago checkout: coming soon. For now downloads are free so you can try it.',
  pie: 'Print on matte paper at 100%. The surprise works in Chrome (Android) and Safari (iPhone).',
};
