// Confirma con Mercado Pago que un pago está aprobado antes de dejar descargar el PDF.
// GET /.netlify/functions/verificar-pago?id=<payment_id>&ref=<referencia>
// Responde { estado: 'aprobado' | 'pendiente' | 'rechazado' }.
import { PRECIO_MXN } from '../../js/disenos.js';

export default async (req) => {
  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) return Response.json({ error: 'Falta MP_ACCESS_TOKEN en Netlify' }, { status: 500 });
  const q = new URL(req.url).searchParams;
  const id = q.get('id') || '', ref = q.get('ref') || '';
  if (!/^\d{1,20}$/.test(id) || !ref) return Response.json({ error: 'Faltan datos del pago' }, { status: 400 });

  const r = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, { headers: { Authorization: `Bearer ${token}` } });
  if (r.status === 404) return Response.json({ estado: 'rechazado' });
  if (!r.ok) return Response.json({ error: 'Mercado Pago no respondió' }, { status: 502 });
  const p = await r.json();

  // El pago tiene que ser de este pedido y por el precio completo
  if (p.external_reference !== ref || p.currency_id !== 'MXN' || p.transaction_amount < PRECIO_MXN) {
    return Response.json({ estado: 'rechazado' });
  }
  if (p.status === 'approved') return Response.json({ estado: 'aprobado' });
  if (['pending', 'in_process', 'authorized'].includes(p.status)) return Response.json({ estado: 'pendiente' });
  return Response.json({ estado: 'rechazado' });
};
