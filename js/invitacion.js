// Datos de las invitaciones a fiesta: van en la URL del QR y se leen en ver.html.
// ?t=inv&d=<diseño>&n=<nombre>&e=<edad>&f=AAAA-MM-DD&h=HH:MM&l=<lugar>&a=<dirección>&w=<whatsapp>

const CAMPOS = { n: 'nombre', e: 'edad', f: 'fecha', h: 'hora', l: 'lugar', a: 'direccion', w: 'whatsapp' };

export function aParametros(url, inv) {
  url.searchParams.set('t', 'inv');
  for (const [p, campo] of Object.entries(CAMPOS)) {
    if (inv[campo]) url.searchParams.set(p, inv[campo]);
  }
}

export function deParametros(params) {
  if (params.get('t') !== 'inv') return null;
  const inv = {};
  for (const [p, campo] of Object.entries(CAMPOS)) inv[campo] = (params.get(p) || '').slice(0, 80);
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

// Google Calendar con la fiesta de 4 horas a la hora local de quien la abre.
export function ligaCalendario(inv) {
  const ini = cuando(inv), fin = new Date(ini.getTime() + 4 * 3600e3);
  const f = (d) => {
    const p = (x) => String(x).padStart(2, '0');
    return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}T${p(d.getHours())}${p(d.getMinutes())}00`;
  };
  const url = new URL('https://calendar.google.com/calendar/render');
  url.searchParams.set('action', 'TEMPLATE');
  url.searchParams.set('text', `Fiesta de ${inv.nombre || 'cumpleaños'} 🎉`);
  url.searchParams.set('dates', `${f(ini)}/${f(fin)}`);
  url.searchParams.set('location', [inv.lugar, inv.direccion].filter(Boolean).join(', '));
  return url.href;
}

export function ligaConfirmar(inv) {
  const texto = `¡Hola! Confirmo que voy a la fiesta de ${inv.nombre || 'cumpleaños'} 🎉`;
  return `https://wa.me/${inv.whatsapp}?text=${encodeURIComponent(texto)}`;
}
