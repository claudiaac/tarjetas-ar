// Animación de cumpleaños que aparece sobre la tarjeta (1000x1000 = tamaño del dibujo)
// y la canción "Happy Birthday" con notitas (Web Audio).

const ESTILOS = `
  .fiesta { position: relative; width: 1000px; height: 1000px; pointer-events: none; visibility: hidden; }
  .fiesta.show { visibility: visible; }
  .fiesta .titulo {
    position: absolute; left: -200px; width: 1400px; top: -360px; text-align: center; line-height: 1.05;
    font-size: 140px; -webkit-text-stroke: 16px #fff; paint-order: stroke fill;
    text-shadow: 0 10px 0 rgba(0, 0, 0, .12);
  }
  .fiesta .pastel { position: absolute; left: 760px; top: 760px; font-size: 200px; }
  .fiesta .globo { position: absolute; bottom: -80px; font-size: 150px; }
  .fiesta .confeti { position: absolute; width: 24px; height: 36px; border-radius: 5px; top: 480px; left: 490px; opacity: 0; }
  .fiesta.show .titulo { animation: f-pop .9s cubic-bezier(.2, 1.6, .4, 1) both, f-menear 2.4s ease-in-out .9s infinite; }
  .fiesta.show .pastel { animation: f-pop .8s cubic-bezier(.2, 1.6, .4, 1) .6s both, f-brinco 1.3s ease-in-out 1.4s infinite; }
  .fiesta.show .globo { animation: f-subir var(--dur) ease-in var(--delay) infinite; }
  .fiesta.show .confeti { animation: f-explotar 1.6s ease-out var(--delay) both; }
  /* diseños con binario: la pantalla de la laptop se traduce letra por letra */
  .fiesta .pantalla {
    position: absolute; left: 140px; top: 199px; width: 714px; height: 417px; box-sizing: border-box; padding: 24px 30px;
    background: #fff; border-radius: 10px; display: flex; flex-direction: column; justify-content: center; gap: 14px;
    text-align: center; color: #000; font-family: 'Share Tech Mono', monospace; opacity: 0;
  }
  .fiesta.show .pantalla { animation: f-aparecer .4s ease-out .3s both; }
  .fiesta .pantalla .linea { font-size: 64px; line-height: 1.1; word-break: break-word; }
  .fiesta .pantalla .linea.binario { font-size: 36px; line-height: 1.35; }
  .fiesta .pantalla .linea b { color: #1DB954; font-weight: 400; }
  .fiesta .pantalla .verso { font-size: 36px; line-height: 1.3; }
  .fiesta .pantalla .cursor { animation: f-parpadeo .8s steps(1) infinite; }
  /* lluvia estilo Matrix: columnas de 0 y 1 que caen */
  .fiesta .lluvia {
    position: absolute; overflow: hidden; opacity: 0;
    -webkit-mask-image: linear-gradient(to bottom, #000 80%, transparent); mask-image: linear-gradient(to bottom, #000 80%, transparent);
  }
  .fiesta.show .lluvia { animation: f-aparecer .6s ease-out both; }
  .fiesta .columna {
    position: absolute; top: 0; width: 44px; text-align: center; font: 40px/44px 'Share Tech Mono', monospace;
    color: var(--lluvia); text-shadow: 0 0 8px var(--lluvia); white-space: pre; transform: translateY(-100%);
    -webkit-mask-image: linear-gradient(to bottom, transparent, #000 75%); mask-image: linear-gradient(to bottom, transparent, #000 75%);
  }
  .fiesta .columna::after { content: attr(data-punta); display: block; filter: brightness(1.6); }
  .fiesta.show .columna { animation: f-caer var(--dur) linear var(--delay) infinite; }
  @keyframes f-caer { from { transform: translateY(-100%); } to { transform: translateY(var(--alto)); } }
  @keyframes f-parpadeo { 50% { opacity: 0; } }
  @keyframes f-aparecer { from { opacity: 0; } to { opacity: 1; } }
  @keyframes f-pop { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  @keyframes f-menear { 0%, 100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }
  @keyframes f-brinco { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-24px); } }
  @keyframes f-subir {
    0% { transform: translate(0, 0) rotate(-6deg); opacity: 0; }
    10% { opacity: 1; }
    50% { transform: translate(var(--vaiven), -800px) rotate(6deg); }
    100% { transform: translate(0, -1700px) rotate(-6deg); opacity: 0; }
  }
  @keyframes f-explotar {
    0% { transform: translate(0, 0) rotate(0); opacity: 1; }
    100% { transform: translate(var(--x), var(--y)) rotate(var(--r)); opacity: 0; }
  }
`;

export function crearFiesta(diseno, nombre, texto) {
  if (!document.getElementById('estilos-fiesta')) {
    const st = document.createElement('style');
    st.id = 'estilos-fiesta';
    st.textContent = ESTILOS;
    document.head.appendChild(st);
  }
  const el = document.createElement('div');
  el.className = 'fiesta';

  if (diseno.lluvia) {
    // a los lados y arriba de la laptop, para no tapar el dibujo
    for (const [x, y, ancho, alto] of [[-310, -420, 300, 1500], [1010, -420, 300, 1500], [-10, -420, 1020, 410]]) {
      el.appendChild(crearLluvia(el, diseno.lluvia, x, y, ancho, alto));
    }
  }

  const titulo = document.createElement('div');
  titulo.className = 'titulo';
  titulo.style.color = diseno.tinta;
  titulo.style.fontFamily = `'${diseno.fuente}', sans-serif`;
  titulo.style.fontWeight = diseno.peso;
  if (diseno.contorno) titulo.style.webkitTextStroke = `16px ${diseno.contorno}`;
  if (diseno.fuente === 'Press Start 2P') titulo.style.fontSize = '80px';
  titulo.textContent = texto || (nombre ? `¡Feliz cumpleaños, ${nombre}!` : '¡Feliz cumpleaños!');
  el.appendChild(titulo);

  if (diseno.descifrar) el.appendChild(crearPantalla(diseno, el));

  const pastel = document.createElement('div');
  pastel.className = 'pastel';
  pastel.textContent = '🎂';
  el.appendChild(pastel);

  ['🎈', '🎈', '💖', '🎈', '⭐', '🎈', '🎉', '🎈'].forEach((g, i) => {
    const b = document.createElement('div');
    b.className = 'globo';
    b.textContent = g;
    b.style.left = (i % 2 ? 820 + Math.random() * 260 : -260 + Math.random() * 260) + 'px';
    b.style.setProperty('--dur', (5 + Math.random() * 3).toFixed(1) + 's');
    b.style.setProperty('--delay', (i * 0.7).toFixed(1) + 's');
    b.style.setProperty('--vaiven', (Math.random() * 160 - 80).toFixed(0) + 'px');
    if (i % 3 === 1) b.style.filter = `hue-rotate(${i * 70}deg)`;
    el.appendChild(b);
  });

  for (let i = 0; i < 60; i++) {
    const c = document.createElement('div');
    c.className = 'confeti';
    c.style.background = diseno.confeti[i % diseno.confeti.length];
    const ang = Math.random() * Math.PI * 2, dist = 420 + Math.random() * 600;
    c.style.setProperty('--x', (Math.cos(ang) * dist).toFixed(0) + 'px');
    c.style.setProperty('--y', (Math.sin(ang) * dist).toFixed(0) + 'px');
    c.style.setProperty('--r', (Math.random() * 1080 - 540).toFixed(0) + 'deg');
    c.style.setProperty('--delay', (Math.random() * 0.4).toFixed(2) + 's');
    el.appendChild(c);
  }
  return el;
}

export function reiniciar(el) {
  el.classList.remove('show');
  void el.offsetWidth; // reinicia las animaciones
  el.classList.add('show');
  el.alMostrar?.();
}

const bit = () => (Math.random() < 0.5 ? '0' : '1');

// Columnas de 0 y 1 cayendo; mientras se ve la sorpresa, algunos dígitos cambian solos.
function crearLluvia(el, color, x0, y0, ancho, alto) {
  const lluvia = document.createElement('div');
  lluvia.className = 'lluvia';
  Object.assign(lluvia.style, { left: x0 + 'px', top: y0 + 'px', width: ancho + 'px', height: alto + 'px' });
  lluvia.style.setProperty('--lluvia', color);
  lluvia.style.setProperty('--alto', alto + 'px');
  const columnas = [];
  for (let x = 2; x + 44 <= ancho; x += 48) {
    const c = document.createElement('div');
    c.className = 'columna';
    c.style.left = x + 'px';
    const largo = 8 + Math.floor(Math.random() * 14);
    c.textContent = Array.from({ length: largo }, bit).join('\n');
    c.dataset.punta = bit();
    c.style.setProperty('--dur', ((alto / 1500) * (3 + Math.random() * 4) + 1).toFixed(1) + 's');
    c.style.setProperty('--delay', (-Math.random() * 6).toFixed(1) + 's');
    columnas.push(c);
    lluvia.appendChild(c);
  }
  setInterval(() => {
    if (!el.classList.contains('show') || document.hidden) return;
    for (let i = 0; i < 6; i++) {
      const c = columnas[Math.floor(Math.random() * columnas.length)];
      const d = c.textContent.split('\n');
      d[Math.floor(Math.random() * d.length)] = bit();
      c.textContent = d.join('\n');
      c.dataset.punta = bit();
    }
  }, 120);
  return lluvia;
}

const binario = (texto) => [...texto].map((c) => c.charCodeAt(0).toString(2).padStart(8, '0'));
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

// Pantalla de la laptop: cada texto de diseno.descifrar se muestra en binario y se traduce
// byte por byte; si el diseño tiene versículo, al final aparece tecleado.
function crearPantalla(diseno, el) {
  const pantalla = document.createElement('div');
  pantalla.className = 'pantalla';
  let turno = 0;

  async function traducir(texto, yo) {
    const linea = document.createElement('div');
    linea.className = 'linea binario';
    pantalla.appendChild(linea);
    const bytes = binario(texto), letras = [...texto];
    linea.textContent = bytes.join(' ');
    await esperar(900);
    for (let i = 0; i < letras.length; i++) {
      if (yo !== turno) return false;
      const hechas = letras.slice(0, i + 1).join('');
      linea.textContent = '';
      const b = document.createElement('b');
      b.textContent = hechas;
      linea.append(b, ' ' + bytes.slice(i + 1).join(' '));
      await esperar(140);
    }
    linea.className = 'linea';
    linea.textContent = texto;
    return true;
  }

  async function teclear(texto, yo) {
    const verso = document.createElement('div');
    verso.className = 'verso';
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    cursor.textContent = '▌';
    pantalla.appendChild(verso);
    for (let i = 1; i <= texto.length; i++) {
      if (yo !== turno) return;
      verso.textContent = texto.slice(0, i);
      verso.appendChild(cursor);
      await esperar(35);
    }
  }

  el.alMostrar = async () => {
    const yo = ++turno;
    pantalla.textContent = '';
    const [primero, ...resto] = diseno.descifrar;
    await esperar(300);
    if (!(await traducir(primero, yo))) return;
    await esperar(1800);
    for (const texto of resto) {
      if (yo !== turno) return;
      pantalla.textContent = '';
      if (!(await traducir(texto, yo))) return;
    }
    if (diseno.versiculo && yo === turno) await teclear(diseno.versiculo, yo);
  };
  return pantalla;
}

const NOTAS = { G4: 392, A4: 440, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99 };
const MELODIA = [
  ['G4', .75], ['G4', .25], ['A4', 1], ['G4', 1], ['C5', 1], ['B4', 2],
  ['G4', .75], ['G4', .25], ['A4', 1], ['G4', 1], ['D5', 1], ['C5', 2],
  ['G4', .75], ['G4', .25], ['G5', 1], ['E5', 1], ['C5', 1], ['B4', 1], ['A4', 2],
  ['F5', .75], ['F5', .25], ['E5', 1], ['C5', 1], ['D5', 1], ['C5', 3],
];

// El navegador solo deja sonar audio después de un toque, así que crea el reproductor
// dentro de un evento de clic y luego llama a cantar() cuando quieras.
export function crearCancion() {
  const audio = new AudioContext();
  let tocando = false;
  return function cantar() {
    if (tocando) return;
    tocando = true;
    const beat = 0.42;
    let t = audio.currentTime + 0.15;
    for (const [nota, dur] of MELODIA) {
      const osc = audio.createOscillator(), vol = audio.createGain();
      osc.type = 'triangle';
      osc.frequency.value = NOTAS[nota];
      vol.gain.setValueAtTime(0, t);
      vol.gain.linearRampToValueAtTime(0.25, t + 0.02);
      vol.gain.exponentialRampToValueAtTime(0.001, t + dur * beat * 0.95);
      osc.connect(vol).connect(audio.destination);
      osc.start(t);
      osc.stop(t + dur * beat);
      t += dur * beat;
    }
    setTimeout(() => (tocando = false), (t - audio.currentTime) * 1000 + 1500);
  };
}
