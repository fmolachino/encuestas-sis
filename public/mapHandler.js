// Importar los datos de centros de salud
import data from './centroGeneralSalud.js';

// Inicializar el mapa
const map = L.map('map').setView([-34.52211, -58.70059], 16);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: ''
}).addTo(map);

// Coordenadas del polígono (se mantienen sin cambios)
const latlngs = [
  [-34.541, -58.773],
  [-34.486, -58.773],
  [-34.484, -58.653],
  [-34.541, -58.655]
];

// Agregar el polígono al mapa
let polygon = L.polygon(latlngs, { color: 'red' }).addTo(map);

// Referencia al contenedor de la lista de centros de salud
const centrosSaludLista = document.getElementById('centrosSalud');

// Función para agregar los centros de salud al mapa y a la lista
data.zonas.forEach(zona => {
  zona.centros_salud.forEach(centro => {
    // Usar las coordenadas del centro de salud para crear un marcador
    const [lat, lng] = centro.coordenadas;
    const marker = L.marker([lat, lng], {
      draggable: false
    }).addTo(map)
      .bindPopup(`<strong>${centro.nombre}</strong><br>${centro.direccion}`);

    // Agregar el centro de salud a la lista en el HTML
    const listItem = document.createElement('li');
    listItem.className = 'list-group-item';
    listItem.textContent = centro.nombre;
    listItem.addEventListener('click', () => {
      // Centrar el mapa en el marcador cuando se haga clic en el elemento de la lista
      map.setView(marker.getLatLng(), 16);
      marker.openPopup();
    });
    centrosSaludLista.appendChild(listItem);
  });
});
