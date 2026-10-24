// Datos de las invitaciones a fiesta: van en la URL del QR y se leen en ver.html.
// ?t=inv&d=<diseño>&n=<nombre>&e=<edad>&f=AAAA-MM-DD&h=HH:MM&l=<lugar>&a=<dirección>&w=<whatsapp>&o=<nota>

const CAMPOS = { n: 'nombre', e: 'edad', f: 'fecha', h: 'hora', l: 'lugar', a: 'direccion', w: 'whatsapp', o: 'nota' };
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

// "sábado 12 de diciembre"
export function fechaTexto(inv) {
  if (!inv.fecha) return '';
  return cuando(inv).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' }).replace(',', '');
}

// "5:00 p.m."
export function horaTexto(inv) {
  if (!inv.hora) return '';
  return cuando(inv).toLocaleTimeString('es-MX', { hour: 'numeric', minute: '2-digit' });
}

export function ligaMapa(inv) {
  const q = [inv.lugar, inv.direccion].filter(Boolean).join(', ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

// Las fiestas son en México: el calendario usa esa zona horaria aunque el invitado esté en otra.
const ZONA = 'America/Mexico_City';

// Google Calendar con la fiesta de 4 horas.
export function ligaCalendario(inv) {
  // Se calcula en UTC solo para sumar las horas: la fecha y hora resultantes se leen en ZONA
  const [a, m, d] = inv.fecha.split('-').map(Number);
  const [h, min] = (inv.hora || '12:00').split(':').map(Number);
  const ini = new Date(Date.UTC(a, m - 1, d, h, min)), fin = new Date(ini.getTime() + 4 * 3600e3);
  const f = (x) => x.toISOString().slice(0, 16).replace(/[-:]/g, '') + '00';
  const url = new URL('https://calendar.google.com/calendar/render');
  url.searchParams.set('action', 'TEMPLATE');
  url.searchParams.set('text', `Fiesta de ${inv.nombre || 'cumpleaños'} 🎉`);
  url.searchParams.set('dates', `${f(ini)}/${f(fin)}`);
  url.searchParams.set('ctz', ZONA);
  url.searchParams.set('location', [inv.lugar, inv.direccion].filter(Boolean).join(', '));
  if (inv.nota) url.searchParams.set('details', inv.nota);
  return url.href;
}

export function ligaConfirmar(inv) {
  const texto = `¡Hola! Confirmo que voy a la fiesta de ${inv.nombre || 'cumpleaños'} 🎉`;
  return `https://wa.me/${inv.whatsapp}?text=${encodeURIComponent(texto)}`;
}
