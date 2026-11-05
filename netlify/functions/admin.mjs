// Datos del panel de administración (admin.html). Solo responde con la contraseña de ADMIN_PASSWORD.
// GET  /.netlify/functions/admin               → visitas, pedidos y mensajes de los últimos 30 días
// POST /.netlify/functions/admin  { accion: 'atendido' | 'pendiente' | 'borrar', id }  → cambia un mensaje
// La contraseña va en el encabezado Authorization: Bearer <contraseña>.
import { createHash, timingSafeEqual } from 'node:crypto';
import { almacen, diaMx, json } from '../lib/comun.mjs';

const DIAS = 30;
const huella = (s) => createHash('sha256').update(String(s)).digest();
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

function autorizado(req) {
  const clave = process.env.ADMIN_PASSWORD || '';
  if (clave.length < 10) return false; // sin contraseña (o muy corta) el panel queda cerrado
  const dada = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  return timingSafeEqual(huella(dada), huella(clave));
}

// Últimos 30 días, del más viejo a hoy
function ultimosDias() {
  const dias = [];
  for (let i = DIAS - 1; i >= 0; i--) dias.push(diaMx(new Date(Date.now() - i * 864e5)));
  return [...new Set(dias)];
}

async function visitas(dias) {
  const v = almacen('visitas');
  const filas = await Promise.all(dias.map((d) => v.get(d, { type: 'json' })));
  return dias.map((dia, i) => ({ dia, tienda: 0, sorpresa: 0, visitantes: 0, ...(filas[i] || {}) }));
}

async function mensajes() {
  const m = almacen('mensajes');
  const { blobs } = await m.list();
  const llaves = blobs.map((b) => b.key).sort().reverse().slice(0, 200);
  return (await Promise.all(llaves.map((k) => m.get(k, { type: 'json' })))).filter(Boolean);
}

// Pagos de Mercado Pago desde el primer día del periodo (hasta 500)
async function pedidos(desde) {
  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) return { error: 'Falta MP_ACCESS_TOKEN en Netlify', lista: [] };
  const lista = [];
  for (let offset = 0; offset < 500; offset += 100) {
    const q = new URLSearchParams({
      sort: 'date_created', criteria: 'desc', range: 'date_created',
      begin_date: `${desde}T00:00:00.000-06:00`, end_date: 'NOW', limit: '100', offset: String(offset),
    });
    const r = await fetch(`https://api.mercadopago.com/v1/payments/search?${q}`, { headers: { Authorization: `Bearer ${token}` } });
    if (!r.ok) {
      console.error('Mercado Pago no respondió la búsqueda', r.status, await r.text());
      return { error: 'Mercado Pago no respondió', lista };
    }
    const { results = [], paging = {} } = await r.json();
    for (const p of results) {
      lista.push({
        id: p.id,
        fecha: p.date_created,
        aprobado: p.date_approved,
        dia: diaMx(new Date(p.date_approved || p.date_created)),
        estado: p.status, // approved, pending, in_process, rejected, refunded, cancelled…
        descripcion: p.description || p.additional_info?.items?.[0]?.title || 'Tarjeta sorpresa',
        monto: p.transaction_amount || 0,
        neto: p.transaction_details?.net_received_amount ?? null, // lo que te queda después de la comisión
        moneda: p.currency_id,
        medio: p.payment_type_id, // credit_card, debit_card, ticket (OXXO), bank_transfer (SPEI), account_money…
        correo: p.payer?.email || '',
      });
    }
    if (results.length < 100 || offset + 100 >= (paging.total || 0)) break;
  }
  return { lista };
}

export default async (req) => {
  if (!autorizado(req)) {
    await espera(800); // frena a quien intente adivinar la contraseña
    return json({ error: process.env.ADMIN_PASSWORD ? 'Contraseña incorrecta' : 'Falta ADMIN_PASSWORD en Netlify' }, 401);
  }

  if (req.method === 'POST') {
    let c = {};
    try { c = await req.json(); } catch { return json({ error: 'Datos inválidos' }, 400); }
    const m = almacen('mensajes');
    const msj = typeof c.id === 'string' && (await m.get(c.id, { type: 'json' }));
    if (!msj) return json({ error: 'No encontré ese mensaje' }, 404);
    if (c.accion === 'borrar') await m.delete(c.id);
    else if (c.accion === 'atendido' || c.accion === 'pendiente') await m.setJSON(c.id, { ...msj, atendido: c.accion === 'atendido' });
    else return json({ error: 'Acción desconocida' }, 400);
    return json({ ok: true });
  }

  const dias = ultimosDias();
  const [v, msjs, ped] = await Promise.all([visitas(dias), mensajes(), pedidos(dias[0])]);
  return json({ hoy: diaMx(), dias, visitas: v, mensajes: msjs, pedidos: ped.lista, errorPedidos: ped.error || null });
};
