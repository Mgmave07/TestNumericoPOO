const btnIngresar = document.getElementById('btnIngresar');
const input = document.getElementById('codigoInput');
const errorEl = document.getElementById('error');
const pantallaCodigo = document.getElementById('pantallaCodigo');
const pantallaTests = document.getElementById('pantallaTests');
const nombreEvaluado = document.getElementById('nombreEvaluado');
const listaTests = document.getElementById('listaTests');

// Paso 1: Validar código y mostrar tests disponibles
btnIngresar.addEventListener('click', async () => {
  try {
    const res = await fetch('/api/candidate/access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codigo: input.value.trim() })
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    // Guardar datos del evaluado
    sessionStorage.setItem('evaluadoId', data.evaluadoId);
    sessionStorage.setItem('nombreEvaluado', data.evaluado);

    // Mostrar pantalla de selección de tests
    nombreEvaluado.textContent = data.evaluado;
    pantallaCodigo.style.display = 'none';
    pantallaTests.style.display = 'block';

    // Renderizar lista de tests
    listaTests.innerHTML = '';
    
    if (data.tests.length === 0) {
      listaTests.innerHTML = '<p style="color: red;">No hay tests disponibles en este momento.</p>';
      return;
    }
    
    data.tests.forEach(test => {
      const card = document.createElement('div');
      card.className = 'test-card';
      card.innerHTML = `
        <h3>${test.nombre}</h3>
        <p>${test.descripcion || 'Sin descripción'}</p>
        <p><strong>Duración:</strong> ${test.tiempominutos} minutos</p>
        <p><strong>Código:</strong> ${test.codigo}</p>
        <button data-test-id="${test.id}">Iniciar este test</button>
      `;
      listaTests.appendChild(card);
    });

    // Agregar evento a cada botón de test
    document.querySelectorAll('#listaTests button').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const testId = parseInt(e.target.dataset.testId);
        await iniciarTest(testId);
      });
    });

  } catch (err) {
    errorEl.textContent = err.message;
    errorEl.style.display = 'block';
  }
});

// Paso 2: Iniciar el test seleccionado
async function iniciarTest(testId) {
  try {
    const evaluadoId = parseInt(sessionStorage.getItem('evaluadoId'));
    
    const res = await fetch('/api/candidate/start-test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ evaluadoId, testId })
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    // Guardar datos del test en sesión
    sessionStorage.setItem('testSession', JSON.stringify(data));
    
    // Redirigir a la pantalla del test
    window.location.href = 'test.html';
  } catch (err) {
    alert(err.message);
  }
}