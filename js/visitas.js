// Cuenta la visita en el panel de administración (netlify/functions/visita.mjs).
// No cuenta en tu compu (localhost) ni en el navegador donde abriste el panel (admin.html).
export function contarVisita(pagina) {
  if (['localhost', '127.0.0.1'].includes(location.hostname) || location.protocol === 'file:') return;
  let nuevo = false;
  try {
    if (localStorage.getItem('soy-admin')) return;
    const hoy = new Date().toDateString();
    nuevo = localStorage.getItem('ultima-visita') !== hoy;
    localStorage.setItem('ultima-visita', hoy);
  } catch { /* modo privado: se cuenta sin saber si es nuevo */ }
  fetch('/.netlify/functions/visita', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pagina, nuevo }), keepalive: true,
  }).catch(() => {});
}
