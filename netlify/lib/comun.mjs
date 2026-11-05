// Ayudas que comparten las funciones del panel de administración.
import { getStore } from '@netlify/blobs';

// Netlify Blobs: almacén gratuito de Netlify. "strong" para que el panel vea lo último que se guardó.
export const almacen = (nombre) => getStore({ name: nombre, consistency: 'strong' });

// La tienda está en México: "hoy" es el día en la Ciudad de México (UTC−6 todo el año desde 2022).
export const ZONA = 'America/Mexico_City';
export const diaMx = (fecha = new Date()) => new Intl.DateTimeFormat('en-CA', { timeZone: ZONA }).format(fecha); // AAAA-MM-DD

export const sinCache = { 'Cache-Control': 'no-store' };
export const json = (datos, status = 200) => Response.json(datos, { status, headers: sinCache });
