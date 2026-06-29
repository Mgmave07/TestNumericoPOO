const session = JSON.parse(sessionStorage.getItem('testSession'));
if (!session) window.location.href = 'index.html';

document.getElementById('nombreEvaluado').textContent = session.evaluado;
const form = document.getElementById('testForm');
const timerEl = document.getElementById('timer');

async function loadTest() {
  const res = await fetch(`/api/candidate/test/${session.aplicacionId}`);
  const preguntas = await res.json();

  preguntas.forEach(p => {
    const card = document.createElement('div');
    card.className = 'question-card';
    card.innerHTML = `<h3>Pregunta ${p.numero}</h3><p>${p.enunciado}</p>`;
    
    p.opciones.forEach(o => {
      card.innerHTML += `
        <label class="option-label">
          <input type="radio" name="pregunta_${p.id}" value="${o.id}">
          ${o.letra}) ${o.texto}
        </label>
      `;
    });
    form.appendChild(card);
  });
}

let timeLeft = session.tiempoMinutos * 60;
const timerInterval = setInterval(() => {
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  timerEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    submitTest();
  }
  timeLeft--;
}, 1000);

async function submitTest() {
  clearInterval(timerInterval);
  const formData = new FormData(form);
  const respuestas = [];
  
  // Agrupar respuestas
  const preguntasMap = new Map();
  formData.forEach((value, key) => {
    const preguntaId = parseInt(key.split('_')[1]);
    preguntasMap.set(preguntaId, parseInt(value));
  });
  
  preguntasMap.forEach((opcionId, preguntaId) => {
    respuestas.push({ 
      preguntaId: parseInt(preguntaId), 
      opcionId: parseInt(opcionId) 
    });
  });

  try {
    const res = await fetch(`/api/candidate/test/${session.aplicacionId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ respuestas })
    });
    const data = await res.json();
    alert(`Test enviado. Aciertos: ${data.aciertos}`);
    sessionStorage.clear();
    window.location.href = 'index.html';
  } catch (err) {
    alert('Error al enviar el test');
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if(confirm('¿Está seguro de finalizar el test?')) {
    submitTest();
  }
});

loadTest();