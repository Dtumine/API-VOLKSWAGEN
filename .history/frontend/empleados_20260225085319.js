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
  document.getElementById('activo').checked = true;
}

// Cargar lista de empleados
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
          <th>ID</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Puesto</th>
          <th>Fecha Ingreso</th>
          <th>Activo</th>
          <th>Acciones</th>
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
        <td>${e.fecha_ingreso ? new Date(e.fecha_ingreso).toLocaleDateString() : ''}</td>
        <td>${e.activo ? 'Sí' : 'No'}</td>
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
    document.querySelectorAll('.btn-view').forEach(b => b.addEventListener('click', async (e) => viewEmpleado(e.target.dataset.id)));
    document.querySelectorAll('.btn-edit').forEach(b => b.addEventListener('click', async (e) => editEmpleado(e.target.dataset.id)));
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

// Ver empleado
async function viewEmpleado(id) {
  addLog(`Cargando empleado ${id}...`, 'info');
  try {
    const res = await fetch(`${API_BASE}/${id}`);
    const r = await res.json();
    if (!res.ok) { addLog(`Error: ${r.message}`, 'error'); return; }
    alert(JSON.stringify(r.data, null, 2));
  } catch (err) { addLog(err.message, 'error'); }
}

// Editar empleado (carga en formulario)
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
    document.getElementById('fecha_ingreso').value = e.fecha_ingreso ? e.fecha_ingreso.split('T')[0] : '';
    document.getElementById('activo').checked = e.activo;

    addLog('Formulario cargado para edición', 'success');
  } catch (err) { addLog(err.message, 'error'); }
}

// Eliminar empleado
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

// Guardar formulario (crear o actualizar)
empleadoForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('id_empleado').value;
  const payload = {
    nombre: document.getElementById('nombre').value.trim(),
    apellido: document.getElementById('apellido').value.trim(),
    puesto: document.getElementById('puesto').value.trim(),
    fecha_ingreso: document.getElementById('fecha_ingreso').value || new Date().toISOString(),
    activo: document.getElementById('activo').checked
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

// Botones auxiliares
document.getElementById('clearBtn').addEventListener('click', clearForm);
document.getElementById('reloadBtn').addEventListener('click', loadEmpleados);

// Carga inicial
window.addEventListener('load', () => {
  addLog('Interfaz de Empleados cargada', 'info');
  loadEmpleados();
});