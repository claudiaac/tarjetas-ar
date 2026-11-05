// Cosas que cruzan volando la tarjeta en la sorpresa (por ejemplo, cervezas en el oso fiestero).
// Se activa con `voladores: ['🍺', '🍻']` en el diseño de js/disenos.js.

const ESTILOS = `
  .fiesta .volador { position: absolute; font-size: 130px; line-height: 1; opacity: 0; }
  .fiesta.show .volador { animation: f-volar var(--dur) cubic-bezier(.3, .1, .6, 1) var(--delay) infinite; }
  .fiesta .salud { position: absolute; left: 370px; top: 980px; font-size: 260px; line-height: 1; opacity: 0; }
  .fiesta.show .salud { animation: f-salud 3.2s ease-in-out 1.2s infinite; }
  /* sale de abajo, sube en arco hasta el otro lado girando y cae fuera de la tarjeta */
  @keyframes f-volar {
    0% { transform: translate(0, 0) rotate(0) scale(.7); opacity: 0; }
    8% { opacity: 1; }
    50% { transform: translate(calc(var(--dx) / 2), var(--alto)) rotate(calc(var(--giro) / 2)) scale(1.15); }
    92% { opacity: 1; }
    100% { transform: translate(var(--dx), 200px) rotate(var(--giro)) scale(.8); opacity: 0; }
  }
  /* el brindis debajo de la tarjeta (para no tapar al oso): crece, choca de lado a lado y se desvanece */
  @keyframes f-salud {
    0% { transform: scale(0) rotate(0); opacity: 0; }
    15% { transform: scale(1.1) rotate(-12deg); opacity: 1; }
    25% { transform: scale(1) rotate(12deg); }
    35% { transform: scale(1.05) rotate(-8deg); }
    45%, 70% { transform: scale(1) rotate(0); opacity: 1; }
    85%, 100% { transform: scale(1.3) rotate(0); opacity: 0; }
  }
`;

export function agregarVoladores(el, emojis) {
  if (!document.getElementById('estilos-voladores')) {
    const st = document.createElement('style');
    st.id = 'estilos-voladores';
    st.textContent = ESTILOS;
    document.head.appendChild(st);
  }
  for (let i = 0; i < 12; i++) {
    const v = document.createElement('div');
    v.className = 'volador';
    v.textContent = emojis[i % emojis.length];
    const izquierda = i % 2 === 0; // salen alternando de cada lado y cruzan al contrario
    const x = izquierda ? -280 + Math.random() * 300 : 860 + Math.random() * 300;
    v.style.left = x.toFixed(0) + 'px';
    v.style.top = (900 + Math.random() * 200).toFixed(0) + 'px';
    const dx = (izquierda ? 1 : -1) * (700 + Math.random() * 500);
    v.style.setProperty('--dx', dx.toFixed(0) + 'px');
    v.style.setProperty('--alto', (-900 - Math.random() * 500).toFixed(0) + 'px');
    v.style.setProperty('--giro', ((izquierda ? 1 : -1) * (360 + Math.random() * 360)).toFixed(0) + 'deg');
    v.style.setProperty('--dur', (3 + Math.random() * 1.5).toFixed(1) + 's');
    v.style.setProperty('--delay', (0.3 + i * 0.45).toFixed(2) + 's');
    el.appendChild(v);
  }
  const salud = document.createElement('div');
  salud.className = 'salud';
  salud.textContent = '🍻';
  el.appendChild(salud);
}
