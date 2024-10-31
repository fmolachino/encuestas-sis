//CentroSalud data import
import data from './centroGeneralSalud.js';

console.log(data);

const centroSaludA = data.zonas[0].centros_salud[0].nombre;
const latlngs = [
  [-34.541, -58.773],
  [-34.486, -58.773],
  [-34.484, -58.653],
  [-34.541, -58.655]
];

// Initialize map
const map = L.map('map').setView([-34.52211, -58.70059], 16);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: ''
}).addTo(map);

// Draggable marker
const marker = L.marker([-34.52211, -58.70059], {
  draggable: "true",
}).addTo(map)
  .bindPopup(centroSaludA)
  .openPopup();

// Add polygon
let polygon = L.polygon(latlngs, { color: 'red' }).addTo(map);
