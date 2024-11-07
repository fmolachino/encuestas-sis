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

const polygonColor = 'green';

// Agregar el polígono al mapa
let polygon = L.polygon(latlngs, { color: polygonColor }).addTo(map);

// Referencia al contenedor de la lista de centros de salud
const centrosSaludLista = document.getElementById('centrosSalud');

// abrir la ventana modal de la atención
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

  document.getElementById('detailModal').addEventListener('hidden.bs.modal', function () {
    this.remove();
  });
}

// abrir la ventana emergente de la encuesta
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
              <div class="form-group mt-3">
                <label for="additionalComments">Comentarios adicionales:</label>
                <textarea id="additionalComments" name="additionalComments" class="form-control" rows="3" placeholder="Escribe tus comentarios aquí..."></textarea>
              </div>
              </br>
              <button type="button" class="btn btn-primary" onclick="previewSurvey()">Enviar</button>
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            </form>
            <!-- Contenedor para la vista previa -->
            <div id="previewContainer" class="mt-4" style="display: none;">
              <h5>Vista Previa de Respuestas:</h5>
              <div id="previewContent"></div>
              <button type="button" class="btn btn-success mt-2" onclick="submitSurvey()">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', surveyHtml);
  const surveyModal = new bootstrap.Modal(document.getElementById('surveyModal'));
  surveyModal.show();

  document.getElementById('surveyModal').addEventListener('hidden.bs.modal', function () {
    this.remove();
  });
}

// mostrar la vista previa
window.previewSurvey = function() {
  const previewContainer = document.getElementById('previewContainer');
  const previewContent = document.getElementById('previewContent');
  
  // Captura de las respuestas
  let responsesHtml = '<ul>';
  for (let i = 1; i <= 10; i++) {
    const ratingValue = document.getElementById(`question${i}`).value || 'Sin respuesta';
    responsesHtml += `<li><strong>Pregunta ${i}:</strong> ${ratingValue}</li>`;
  }
  const additionalComments = document.getElementById('additionalComments').value || 'Sin comentarios';
  responsesHtml += `<li><strong>Comentarios adicionales:</strong> ${additionalComments}</li>`;
  responsesHtml += '</ul>';

  // Mostrar en el contenedor de vista previa
  previewContent.innerHTML = responsesHtml;
  previewContainer.style.display = 'block';
}

// enviar el formulario de encuesta
window.submitSurvey = function() {
  alert('Gracias por su respuesta!');
  closePopup('surveyModal');
}

// abrir la ventana emergente de la encuesta
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
              <div class="form-group mt-3">
                <label for="additionalComments">Comentarios adicionales:</label>
                <textarea id="additionalComments" name="additionalComments" class="form-control" rows="3" placeholder="Escribe tus comentarios aquí..."></textarea>
              </div>
              </br>
              <button type="button" class="btn btn-primary" onclick="previewSurvey()">Vista Previa</button>
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Vista Previa -->
    <div class="modal fade" id="previewModal" tabindex="-1" aria-labelledby="previewModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="previewModalLabel">Vista Previa de Respuestas</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" id="previewContent">
            <!-- Aquí se mostrará la vista previa de las respuestas -->
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-success" onclick="submitSurvey()">Confirmar</button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', surveyHtml);
  const surveyModal = new bootstrap.Modal(document.getElementById('surveyModal'));
  surveyModal.show();

  document.getElementById('surveyModal').addEventListener('hidden.bs.modal', function () {
    this.remove();
  });
}

// mostrar la vista previa en un modal separado
window.previewSurvey = function() {
  const previewContent = document.getElementById('previewContent');
  
  // Captura de las respuestas
  let responsesHtml = '<ul>';
  for (let i = 1; i <= 10; i++) {
    const ratingValue = document.getElementById(`question${i}`).value || 'Sin respuesta';
    responsesHtml += `<li><strong>Pregunta ${i}:</strong> ${ratingValue}</li>`;
  }
  const additionalComments = document.getElementById('additionalComments').value || 'Sin comentarios';
  responsesHtml += `<li><strong>Comentarios adicionales:</strong> ${additionalComments}</li>`;
  responsesHtml += '</ul>';

  // Mostrar en el contenedor de vista previa
  previewContent.innerHTML = responsesHtml;

  // Abrir el modal de vista previa
  const previewModal = new bootstrap.Modal(document.getElementById('previewModal'));
  previewModal.show();
}

// enviar el formulario de encuesta
window.submitSurvey = function() {
  alert('Gracias por su respuesta!');
  closePopup('previewModal');
  closePopup('surveyModal');
}

// obtener la referencia de calificación
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

// auxiliar para cerrar el popup
function closePopup(modalId) {
  const modalElement = document.getElementById(modalId);
  const modalInstance = bootstrap.Modal.getInstance(modalElement);
  modalInstance.hide();
}


// seleccionar la calificación
window.selectRating = function(value, questionId) {
  const inputField = document.getElementById(questionId);
  inputField.value = value;

  const stars = document.querySelectorAll(`#rating-${questionId.split('question')[1]} .star`);
  stars.forEach((star, index) => {
    if (index < value) {
      star.classList.add('selected');
    } else {
      star.classList.remove('selected');
    }
  });
}

// cerrar el popup
window.closePopup = function(modalId) {
  const modalElement = document.getElementById(modalId);
  if (modalElement) {
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) {
      modal.hide();
    }
  }
}

// agregar los centros de salud al mapa y a la lista
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
      map.setView([lat, lng], 16);
      marker.openPopup();
    });

    centrosSaludLista.appendChild(listItem);
  });
});
