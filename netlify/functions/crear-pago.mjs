// Crea un pago en Mercado Pago (Checkout Pro) y regresa la liga a la que se manda al cliente.
// El precio sale de js/disenos.js en el servidor: el navegador no puede cambiarlo.
import { PRECIO_MXN } from '../../js/disenos.js';

export default async (req) => {
  if (req.method !== 'POST') return Response.json({ error: 'Usa POST' }, { status: 405 });
  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) return Response.json({ error: 'Falta MP_ACCESS_TOKEN en Netlify' }, { status: 500 });

  let titulo = 'Tarjeta sorpresa';
  try {
    const cuerpo = await req.json();
    if (typeof cuerpo.titulo === 'string' && cuerpo.titulo.trim()) titulo = cuerpo.titulo.trim().slice(0, 120);
  } catch { /* sin cuerpo: se usa el título de siempre */ }

  const sitio = process.env.URL || new URL(req.url).origin; // Netlify pone URL con el dominio principal
  const referencia = crypto.randomUUID();
  const r = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'X-Idempotency-Key': referencia },
    body: JSON.stringify({
      items: [{ id: 'tarjeta', title: titulo, quantity: 1, unit_price: PRECIO_MXN, currency_id: 'MXN' }],
      external_reference: referencia,
      back_urls: {
        success: `${sitio}/?pago=listo`,
        pending: `${sitio}/?pago=pendiente`,
        failure: `${sitio}/?pago=error`,
      },
      auto_return: 'approved',
      statement_descriptor: 'TARJETAS SORPRESA',
    }),
  });
  const pref = await r.json();
  if (!r.ok) {
    console.error('Mercado Pago no creó el pago', r.status, pref);
    return Response.json({ error: 'Mercado Pago no respondió' }, { status: 502 });
  }
  return Response.json({ liga: pref.init_point, referencia });
};
