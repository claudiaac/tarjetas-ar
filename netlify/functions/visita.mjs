// Cuenta una visita a la tienda o a una sorpresa (lo que abre el QR).
// POST /.netlify/functions/visita  { pagina: 'tienda' | 'sorpresa', nuevo: true|false }
// No guarda IP, cookies ni nada de la persona: solo suma números por día.
import { almacen, diaMx, json } from '../lib/comun.mjs';

const PAGINAS = ['tienda', 'sorpresa'];

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Usa POST' }, 405);
  let cuerpo = {};
  try { cuerpo = await req.json(); } catch { /* sin cuerpo */ }
  const pagina = PAGINAS.includes(cuerpo.pagina) ? cuerpo.pagina : null;
  if (!pagina) return json({ error: 'Página desconocida' }, 400);
  if (/bot|crawl|spider|preview|headless/i.test(req.headers.get('user-agent') || '')) return json({ ok: true });

  const visitas = almacen('visitas');
  const dia = diaMx();
  const d = (await visitas.get(dia, { type: 'json' })) || { tienda: 0, sorpresa: 0, visitantes: 0 };
  d[pagina] = (d[pagina] || 0) + 1;
  if (cuerpo.nuevo === true) d.visitantes = (d.visitantes || 0) + 1; // primera visita del día en ese navegador
  await visitas.setJSON(dia, d);
  return json({ ok: true });
};
