const btnLoad = document.getElementById('btnLoad');
const table = document.getElementById('resultsTable');
const tbody = table.querySelector('tbody');
const tokenInput = document.getElementById('adminToken');

btnLoad.addEventListener('click', async () => {
  const token = tokenInput.value;
  if(!token) return alert('Ingrese el token');

  try {
    const res = await fetch('/api/admin/resultados', {
      headers: { 'x-admin-token': token }
    });
    
    if (!res.ok) throw new Error('Token inválido o error de servidor');
    
    const data = await res.json();
    tbody.innerHTML = '';
    
    data.forEach(row => {
      tbody.innerHTML += `
        <tr>
          <td>${row.primernombre} ${row.primerapellido}</td>
          <td>${row.codigoacceso}</td>
          <td>${row.test_nombre}</td>
          <td>${row.estado}</td>
          <td>${row.aciertos ?? '-'}</td>
          <td>${row.errores ?? '-'}</td>
          <td>${row.omitidas ?? '-'}</td>
          <td><strong>${row.puntajedirecto ?? '-'}</strong></td>
          <td>${new Date(row.fechainicio).toLocaleString()}</td>
        </tr>
      `;
    });
    
    table.style.display = 'table';
  } catch (err) {
    alert(err.message);
  }
});