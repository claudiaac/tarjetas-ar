// Guarda un mensaje del formulario "¿Dudas? Escríbenos" de la tienda.
// POST /.netlify/functions/contacto  { nombre, contacto, mensaje, sitio }  (sitio es una trampa para robots: debe ir vacío)
import { almacen, json } from '../lib/comun.mjs';

const texto = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Usa POST' }, 405);
  let c = {};
  try { c = await req.json(); } catch { return json({ error: 'Datos inválidos' }, 400); }
  if (c.sitio) return json({ ok: true }); // lo llenó un robot: se ignora sin avisarle

  const nombre = texto(c.nombre, 60), contacto = texto(c.contacto, 80), mensaje = texto(c.mensaje, 1000);
  if (!nombre || !contacto || mensaje.length < 3) return json({ error: 'Faltan datos' }, 400);

  const fecha = new Date().toISOString();
  const id = `${fecha.replace(/[:.]/g, '-')}-${crypto.randomUUID().slice(0, 8)}`;
  await almacen('mensajes').setJSON(id, {
    id, fecha, nombre, contacto, mensaje, idioma: c.idioma === 'en' ? 'en' : 'es', atendido: false,
  });
  return json({ ok: true });
};
