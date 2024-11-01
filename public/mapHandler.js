// Importar los datos de centros de salud
import data from './centroGeneralSalud.js';

// Inicializar el mapa
const map = L.map('map').setView([-34.52211, -58.70059], 16);

// Agregar capa de mapa
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: ''
}).addTo(map);

// Coordenadas del polígono
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

// Función para abrir la ventana modal de la atención
window.openDetailModal = function(centerName) {
  const centro = data.zonas.flatMap(z => z.centros_salud).find(c => c.nombre === centerName);
  const atencion = centro.atencion;

  const modalHtml = `
    <div class="modal fade" id="detailModal" tabindex="-1" aria-labelledby="detailModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="detailModalLabel">Detalles de Atención en ${centerName}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>Nombre del paciente: ${atencion.nombre}</p>
            <p>Fecha de atención: ${atencion.fecha}</p>
            <button class="btn btn-primary" onclick="openSurveyPopup('${centerName}')">Responder Encuesta</button>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  const detailModal = new bootstrap.Modal(document.getElementById('detailModal'));
  detailModal.show();

  // Eliminar el modal del DOM al cerrarlo
  document.getElementById('detailModal').addEventListener('hidden.bs.modal', function () {
    this.remove();
  });
}

// Función para abrir la ventana emergente de la encuesta
window.openSurveyPopup = function(centerName) {
  const surveyHtml = `
    <div class="modal fade" id="surveyModal" tabindex="-1" aria-labelledby="surveyModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="surveyModalLabel">Encuesta de Atención en ${centerName}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="surveyForm">
              ${[...Array(10)].map((_, index) => `
                <div>
                  <label>Pregunta ${index + 1}:</label>
                  <div class="rating" id="rating-${index + 1}">
                    ${[...Array(10)].map((_, num) => `
                      <span class="star" onclick="selectRating(${num + 1}, 'question${index + 1}')">★</span>
                    `).join('')}
                  </div>
                  <input type="hidden" id="question${index + 1}" name="question${index + 1}" required />
                  <span class="rating-reference">
                    ${getRatingReference(index + 1)}
                  </span>
                </div>
              `).join('')}
              <button type="submit" class="btn btn-primary">Enviar</button>
              <button type="button" class="btn btn-secondary" onclick="closePopup('surveyModal')">Cerrar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', surveyHtml);
  const surveyModal = new bootstrap.Modal(document.getElementById('surveyModal'));
  surveyModal.show();

  document.getElementById('surveyForm').onsubmit = function(event) {
    event.preventDefault();
    alert('Gracias por su respuesta!');
    closePopup('surveyModal');
  };

  // Eliminar el modal del DOM al cerrarlo
  document.getElementById('surveyModal').addEventListener('hidden.bs.modal', function () {
    this.remove();
  });
}

// Función para obtener la referencia de calificación
function getRatingReference(questionNumber) {
  const references = [
    '1 - Mucho tiempo, 10 - Muy poco tiempo',
    '1 - Muy insatisfecho, 10 - Muy satisfecho',
    '1 - Muy baja disponibilidad, 10 - Muy alta disponibilidad',
    '1 - Definitivamente no, 10 - Definitivamente sí',
    '1 - Muy mala experiencia, 10 - Excelente experiencia',
    '1 - Muy difícil, 10 - Muy fácil',
    '1 - Muy ineficaz, 10 - Muy eficaz',
    '1 - Muy desorganizado, 10 - Muy organizado',
    '1 - Muy poco conocimiento, 10 - Muy bien informado',
    '1 - Muy malo, 10 - Excelente'
  ];
  return references[questionNumber - 1];
}

// Función para seleccionar la calificación
window.selectRating = function(value, questionId) {
  const inputField = document.getElementById(questionId);
  inputField.value = value;

  // Obtener todos los elementos de estrellas dentro del mismo contenedor de la pregunta
  const stars = document.querySelectorAll(`#rating-${questionId.split('question')[1]} .star`);
  stars.forEach((star, index) => {
    if (index < value) {
      star.classList.add('selected');
    } else {
      star.classList.remove('selected');
    }
  });
}

// Función para cerrar el popup
function closePopup(modalId) {
  const modal = new bootstrap.Modal(document.getElementById(modalId));
  modal.hide();
}

// Función para agregar los centros de salud al mapa y a la lista
data.zonas.forEach(zona => {
  zona.centros_salud.forEach(centro => {
    const [lat, lng] = centro.coordenadas;
    const marker = L.marker([lat, lng], {
      draggable: false
    }).addTo(map)
      .bindPopup(`
        <strong>${centro.nombre}</strong><br>${centro.direccion}<br>
        <button onclick="openDetailModal('${centro.nombre}')">Ver Atención</button>
      `);

    const listItem = document.createElement('li');
    listItem.className = 'list-group-item';
    listItem.textContent = centro.nombre;
    listItem.addEventListener('click', () => {
      map.setView(marker.getLatLng(), 16);
      marker.openPopup();
    });
    centrosSaludLista.appendChild(listItem);
  });
});
