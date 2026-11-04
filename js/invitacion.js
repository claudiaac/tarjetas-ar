// Datos de las invitaciones a fiesta: van en la URL del QR y se leen en ver.html.
// ?t=inv&d=<diseño>&n=<nombre>&e=<edad>&f=AAAA-MM-DD&h=HH:MM&l=<lugar>&a=<dirección>&w=<whatsapp>&o=<nota>&z=<zona horaria>
// (más &lang=en en las invitaciones en inglés)
import { textos } from './idioma.js';

const CAMPOS = { n: 'nombre', e: 'edad', f: 'fecha', h: 'hora', l: 'lugar', a: 'direccion', w: 'whatsapp', o: 'nota', z: 'zona' };
const LARGO = { nota: 110 };

export function aParametros(url, inv) {
  url.searchParams.set('t', 'inv');
  for (const [p, campo] of Object.entries(CAMPOS)) {
    if (inv[campo]) url.searchParams.set(p, inv[campo]);
  }
}

export function deParametros(params) {
  if (params.get('t') !== 'inv') return null;
  const inv = {};
  for (const [p, campo] of Object.entries(CAMPOS)) inv[campo] = (params.get(p) || '').slice(0, LARGO[campo] || 80);
  inv.whatsapp = inv.whatsapp.replace(/\D/g, '');
  return inv;
}

const cuando = ({ fecha, hora }) => new Date(`${fecha}T${hora || '12:00'}`);

// "sábado 12 de diciembre" / "Saturday, December 12"
export function fechaTexto(inv, lang) {
  if (!inv.fecha) return '';
  const texto = cuando(inv).toLocaleDateString(textos(lang).locale, { weekday: 'long', day: 'numeric', month: 'long' });
  return lang === 'en' ? texto : texto.replace(',', '');
}

// "5:00 p.m." / "5:00 PM"
export function horaTexto(inv, lang) {
  if (!inv.hora) return '';
  return cuando(inv).toLocaleTimeString(textos(lang).locale, { hour: 'numeric', minute: '2-digit' });
}

export function ligaMapa(inv) {
  const q = [inv.lugar, inv.direccion].filter(Boolean).join(', ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

// Las fiestas son en México: el calendario usa esa zona horaria aunque el invitado esté en otra.
// Las invitaciones en inglés guardan la zona de quien la compró (`z`).
const ZONA = 'America/Mexico_City';
const zonaValida = (z) => {
  try { return z && Intl.DateTimeFormat('en', { timeZone: z }) && z; } catch { return ''; }
};

// Google Calendar con la fiesta de 4 horas.
export function ligaCalendario(inv, lang) {
  // Se calcula en UTC solo para sumar las horas: la fecha y hora resultantes se leen en ZONA
  const [a, m, d] = inv.fecha.split('-').map(Number);
  const [h, min] = (inv.hora || '12:00').split(':').map(Number);
  const ini = new Date(Date.UTC(a, m - 1, d, h, min)), fin = new Date(ini.getTime() + 4 * 3600e3);
  const f = (x) => x.toISOString().slice(0, 16).replace(/[-:]/g, '') + '00';
  const url = new URL('https://calendar.google.com/calendar/render');
  url.searchParams.set('action', 'TEMPLATE');
  url.searchParams.set('text', textos(lang).eventoCalendario(inv.nombre));
  url.searchParams.set('dates', `${f(ini)}/${f(fin)}`);
  url.searchParams.set('ctz', zonaValida(inv.zona) || ZONA);
  url.searchParams.set('location', [inv.lugar, inv.direccion].filter(Boolean).join(', '));
  if (inv.nota) url.searchParams.set('details', inv.nota);
  return url.href;
}

export function ligaConfirmar(inv, lang) {
  const texto = textos(lang).mensajeConfirmar(inv.nombre);
  return `https://wa.me/${inv.whatsapp}?text=${encodeURIComponent(texto)}`;
}
