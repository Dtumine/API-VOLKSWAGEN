const API_BASE = 'https://api-empleados-i8xz.onrender.com/api/empleados';

const logs = document.getElementById('logs');
const empleadosList = document.getElementById('empleadosList');
const empleadoForm = document.getElementById('empleadoForm');

function addLog(msg, type = 'info') {
  const d = new Date().toLocaleTimeString();
  const el = document.createElement('div');
  el.className = `log-entry log-${type}`;
  el.innerHTML = `<span class="log-time">[${d}]</span> ${msg}`;
  logs.appendChild(el);
  logs.scrollTop = logs.scrollHeight;
}

function clearForm() {
  empleadoForm.reset();
  document.getElementById('id_empleado').value = '';
}

async function loadEmpleados() {
  addLog('Cargando empleados...', 'info');
  empleadosList.innerHTML = '';
  try {
    const res = await fetch(API_BASE);
    const result = await res.json();

    if (!res.ok) {
      addLog(`Error cargando empleados: ${result.message || res.statusText}`, 'error');
      empleadosList.innerHTML = `<div class="empty-state"><p>Error: ${result.message || res.statusText}</p></div>`;
      return;
    }

    const items = result.data || [];
    if (items.length === 0) {
      empleadosList.innerHTML = `<div class="empty-state"><p>No hay empleados</p></div>`;
      addLog('No hay empleados', 'warning');
      return;
    }

    const table = document.createElement('table');
    table.style.width = '100%';
    table.innerHTML = `
      <thead>
        <tr>
          <th>ID</th><th>Nombre</th><th>Apellido</th><th>Puesto</th><th>Acciones</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;

    const tbody = table.querySelector('tbody');

    items.forEach(e => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${e.id_empleado}</td>
        <td>${e.nombre || ''}</td>
        <td>${e.apellido || ''}</td>
        <td>${e.puesto || ''}</td>
        <td>
          <button data-id="${e.id_empleado}" class="btn btn-secondary btn-view">Ver</button>
          <button data-id="${e.id_empleado}" class="btn btn-primary btn-edit">Editar</button>
          <button data-id="${e.id_empleado}" class="btn btn-danger btn-delete">Eliminar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    empleadosList.appendChild(table);

    // Attach actions
    document.querySelectorAll('.btn-view').forEach(b => b.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      await viewEmpleado(id);
    }));

    document.querySelectorAll('.btn-edit').forEach(b => b.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      await editEmpleado(id);
    }));

    document.querySelectorAll('.btn-delete').forEach(b => b.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      if (!confirm('¿Eliminar empleado?')) return;
      await deleteEmpleado(id);
    }));

    addLog(`✅ ${items.length} empleado(s) cargado(s)`, 'success');
  } catch (err) {
    addLog(`Error de red: ${err.message}`, 'error');
    empleadosList.innerHTML = `<div class="empty-state"><p>${err.message}</p></div>`;
  }
}

async function viewEmpleado(id) {
  addLog(`Cargando empleado ${id}...`, 'info');
  try {
    const res = await fetch(`${API_BASE}/${id}`);
    const r = await res.json();
    if (!res.ok) { addLog(`Error: ${r.message}`, 'error'); return; }
    const e = r.data;
    alert(JSON.stringify(e, null, 2));
  } catch (err) { addLog(err.message, 'error'); }
}

async function editEmpleado(id) {
  addLog(`Obteniendo empleado ${id} para edición...`, 'info');
  try {
    const res = await fetch(`${API_BASE}/${id}`);
    const r = await res.json();
    if (!res.ok) { addLog(`Error: ${r.message}`, 'error'); return; }
    const e = r.data;
    document.getElementById('id_empleado').value = e.id_empleado || '';
    document.getElementById('nombre').value = e.nombre || '';
    document.getElementById('apellido').value = e.apellido || '';
    document.getElementById('puesto').value = e.puesto || '';
    addLog('Formulario cargado para edición', 'success');
  } catch (err) { addLog(err.message, 'error'); }
}

async function deleteEmpleado(id) {
  addLog(`Eliminando empleado ${id}...`, 'info');
  try {
    const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    const r = await res.json();
    if (!res.ok) { addLog(`Error: ${r.message}`, 'error'); return; }
    addLog('Empleado eliminado', 'success');
    await loadEmpleados();
  } catch (err) { addLog(err.message, 'error'); }
}

empleadoForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('id_empleado').value;
  const payload = {
    nombre: document.getElementById('nombre').value.trim(),
    apellido: document.getElementById('apellido').value.trim(),
    puesto: document.getElementById('puesto').value.trim()
  };

  try {
    if (id) {
      addLog(`Actualizando empleado ${id}...`, 'info');
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const r = await res.json();
      if (!res.ok) { addLog(`Error: ${r.message}`, 'error'); return; }
      addLog('Empleado actualizado', 'success');
    } else {
      addLog('Creando empleado...', 'info');
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const r = await res.json();
      if (!res.ok) { addLog(`Error: ${r.message}`, 'error'); return; }
      addLog('Empleado creado', 'success');
    }
    clearForm();
    await loadEmpleados();
  } catch (err) { addLog(err.message, 'error'); }
});

document.getElementById('clearBtn').addEventListener('click', () => clearForm());
document.getElementById('reloadBtn').addEventListener('click', () => loadEmpleados());

window.addEventListener('load', () => {
  addLog('Interfaz de Empleados cargada', 'info');
  loadEmpleados();
});
