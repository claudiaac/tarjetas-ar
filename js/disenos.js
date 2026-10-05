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
];

export const FUENTES_URL =
  'https://fonts.googleapis.com/css2?family=Amatic+SC:wght@700&family=Baloo+2:wght@600;800' +
  '&family=Fredoka:wght@500;600&family=Great+Vibes&family=Press+Start+2P' +
  '&family=Zen+Maru+Gothic:wght@500;700&display=swap';

export const porId = (id) => DISENOS.find((d) => d.id === id) || DISENOS[0];
