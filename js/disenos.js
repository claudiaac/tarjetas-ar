// Catálogo de diseños. Para agregar uno nuevo:
// 1. Dibuja disenos/<id>.svg (1000x1000) y genera el PNG con herramientas/render.ps1
// 2. Genera disenos/<id>.mind con herramientas/servidor.py + compilar.html
// 3. Agrégalo aquí.
export const PRECIO_MXN = 49;

export const TIPOS = {
  kawaii: 'Kawaii',
  acuarela: 'Anime acuarela',
  coquette: 'Coquette',
  cottagecore: 'Cottagecore',
  pixel: 'Pixel art',
  mascotas: 'Mascotas chibi',
  geek: 'Geek',
  oso: 'Oso fiestero',
};

export const DISENOS = [
  {
    id: 'kawaii', tipo: 'kawaii', nombre: 'Pastelito kawaii',
    descripcion: 'Un cupcake con carita, chispas y estrellitas pastel.',
    fondo: '#FFE4EF', tinta: '#F2557A', suave: '#C2457A',
    fuente: 'Baloo 2', peso: 800, confeti: ['#FF7FA3', '#FFD166', '#7FD4F5', '#B69CFF', '#8EDB9C'],
  },
  {
    id: 'acuarela', tipo: 'acuarela', nombre: 'Picnic en la colina',
    descripcion: 'Paisaje tipo anime en acuarela: nubes, casita y un pastel bajo el árbol.',
    fondo: '#F7EFE3', tinta: '#3D5A80', suave: '#6F8BA8',
    fuente: 'Zen Maru Gothic', peso: 700, confeti: ['#F28C8C', '#F7D37A', '#8EC5F0', '#9ACB7A', '#FFFFFF'],
  },
  {
    id: 'picnic-cachorro', tipo: 'acuarela', nombre: 'Picnic en la colina: cachorro',
    descripcion: 'Un cachorro con paliacate de picnic en la colina, con fresas, sándwiches y limonada.',
    fondo: '#F7EFE3', tinta: '#3D5A80', suave: '#6F8BA8',
    fuente: 'Zen Maru Gothic', peso: 700, confeti: ['#F28C8C', '#F7D37A', '#8EC5F0', '#9ACB7A', '#FFFFFF'],
  },
  {
    id: 'picnic-gato', tipo: 'acuarela', nombre: 'Picnic en la colina: gatito',
    descripcion: 'Un gatito calicó con paliacate de picnic en la colina, con fresas, sándwiches y limonada.',
    fondo: '#F7EFE3', tinta: '#3D5A80', suave: '#6F8BA8',
    fuente: 'Zen Maru Gothic', peso: 700, confeti: ['#F28C8C', '#F7D37A', '#8EC5F0', '#9ACB7A', '#FFFFFF'],
  },
  {
    id: 'coquette', tipo: 'coquette', nombre: 'Moño y cerezas',
    descripcion: 'Pastel con cerezas, perlas, encaje y un gran moño rosa.',
    fondo: '#FFF7F2', tinta: '#D9728F', suave: '#B5768A',
    fuente: 'Great Vibes', peso: 400, confeti: ['#F7B6C8', '#E88AA6', '#FFFFFF', '#D7263D', '#F9DDE3'],
  },
  {
    id: 'cottagecore', tipo: 'cottagecore', nombre: 'Pastel de fresas',
    descripcion: 'Fresas, margaritas, hongos y un conejito sobre mantel de cuadros.',
    fondo: '#F4F1E1', tinta: '#7A5236', suave: '#8C6A4A',
    fuente: 'Amatic SC', peso: 700, confeti: ['#E0474C', '#F2C14E', '#7DA86A', '#9FC9EB', '#F2A1B5'],
  },
  {
    id: 'pixel', tipo: 'pixel', nombre: 'Level up',
    descripcion: 'Pastel de 8 bits con corazones, monedas y hongos de videojuego retro.',
    fondo: '#1B1F3B', tinta: '#FFD166', suave: '#7FD4F5',
    fuente: 'Press Start 2P', peso: 400, confeti: ['#FFD166', '#7FD4F5', '#FF7FA3', '#8EDB9C', '#B69CFF'],
  },
  {
    id: 'mascotas', tipo: 'mascotas', nombre: 'Perrito y gatito',
    descripcion: 'Un perrito y un gatito chibi con gorritos de fiesta y globos.',
    fondo: '#E6F7F0', tinta: '#3FA48E', suave: '#5E8C7E',
    fuente: 'Fredoka', peso: 600, confeti: ['#FF7FA3', '#FFD166', '#7FD4F5', '#B69CFF', '#FFB347'],
  },
  {
    id: 'geek-oscuro', tipo: 'geek', nombre: 'Laptop binaria (oscura)',
    // mensaje del reverso si el cliente no escribe uno: "Salmo 20:5" en binario
    mensaje: '01010011 01100001 01101100 01101101 01101111 00100000 00110010 00110000 00111010 00110101',
    // la sorpresa traduce el binario de la pantalla: cada texto aparece primero en binario
    descifrar: ['Happy Birthday', 'Salmo 20:5'],
    versiculo: 'Nosotros nos alegraremos en tu salvación, y alzaremos pendón en el nombre de nuestro Dios; conceda Jehová todas tus peticiones.',
    descripcion: 'Una laptop que dice "Happy Birthday" en código binario, sobre fondo negro.',
    fondo: '#000000', tinta: '#FFFFFF', suave: '#B5B5B5',
    // contorno del título de la sorpresa: blanco sobre letra blanca rellenaba los huecos de la "m"
    contorno: '#000000',
    fuente: 'Share Tech Mono', peso: 400, confeti: ['#FFFFFF', '#39FF14', '#00E5FF', '#B5B5B5', '#7CFC00'],
  },
  {
    id: 'geek-claro', tipo: 'geek', nombre: 'Laptop binaria (clara)',
    // mensaje del reverso si el cliente no escribe uno: "Psalm 20:5" en binario
    mensaje: '01010000 01110011 01100001 01101100 01101101 00100000 00110010 00110000 00111010 00110101',
    descifrar: ['Happy Birthday', 'Psalm 20:5'],
    versiculo: 'We will rejoice in thy salvation, and in the name of our God we will set up our banners: the Lord fulfil all thy petitions.',
    descripcion: 'Una laptop que dice "Happy Birthday" en código binario, sobre fondo blanco.',
    fondo: '#FFFFFF', tinta: '#000000', suave: '#555555',
    fuente: 'Share Tech Mono', peso: 400, confeti: ['#000000', '#1DB954', '#0091EA', '#888888', '#39FF14'],
  },
  {
    id: 'oso-fiestero', tipo: 'oso', nombre: 'Oso fiestero',
    descripcion: 'Un oso con lentes oscuros y gorrito brindando con su tarro de cerveza en una fiesta en el bosque.',
    voladores: ['🍺', '🍻', '🍺'], // en la sorpresa salen cervezas volando y un brindis 🍻
    fondo: '#FBF0D5', tinta: '#C8641A', suave: '#7A4A26',
    fuente: 'Baloo 2', peso: 800, confeti: ['#F5B700', '#FFFFFF', '#3FA9F5', '#E5484D', '#7DBA5A'],
  },
];

export const FUENTES_URL =
  'https://fonts.googleapis.com/css2?family=Amatic+SC:wght@700&family=Baloo+2:wght@600;800' +
  '&family=Fredoka:wght@500;600&family=Great+Vibes&family=Press+Start+2P&family=Share+Tech+Mono' +
  '&family=Zen+Maru+Gothic:wght@500;700&display=swap';

export const porId = (id) => DISENOS.find((d) => d.id === id) || DISENOS[0];
