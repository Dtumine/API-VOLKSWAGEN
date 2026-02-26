const API_BASE = 'https://api-servicios-926g.onrender.com/api/servicios'; 

const API_AUTOS = 'https://api-autos-7890.onrender.com/api/autos';
const API_EMPLEADOS = 'https://api-empleados-i8xz.onrender.com/api/empleados';
const API_CLIENTES = 'https://api-clientes-1234.onrender.com/api/clientes';

const logs = document.getElementById('logs');
const serviciosList = document.getElementById('serviciosList');
const servicioForm = document.getElementById('servicioForm');

function addLog(msg, type = 'info') {
  const d = new Date().toLocaleTimeString();
  const el = document.createElement('div');
  el.className = `log-entry log-${type}`;
  el.innerHTML = `<span class="log-time">[${d}]</span> ${msg}`;
  logs.appendChild(el);
  logs.scrollTop = logs.scrollHeight;
}

function clearForm() {
  servicioForm.reset();
  document.getElementById('id_servicio').value = '';
  document.getElementById('estado').value = 'pendiente';
}

// ===========================
// Cargar todos los servicios
// ===========================
async function loadServicios() {
  addLog('Cargando servicios...', 'info');
  serviciosList.innerHTML = '';
  try {
    const res = await fetch(API_BASE);
    const result = await res.json();

    if (!res.ok) {
      addLog(`Error cargando servicios: ${result.message || res.statusText}`, 'error');
      serviciosList.innerHTML = `<div class="empty-state"><p>Error: ${result.message || res.statusText}</p></div>`;
      return;
    }

    const items = result.data || [];
    if (items.length === 0) {
      serviciosList.innerHTML = `<div class="empty-state"><p>No hay servicios</p></div>`;
      addLog('No hay servicios', 'warning');
      return;
    }

    const table = document.createElement('table');
    table.style.width = '100%';
    table.innerHTML = `
      <thead>
        <tr>
          <th>ID</th><th>ID Auto</th><th>ID Empleado</th><th>ID Cliente</th>
          <th>Fecha Servicio</th><th>Tipo Servicio</th><th>Costo</th><th>Kilometraje</th>
          <th>Entrada</th><th>Entrega</th><th>Estado</th><th>Acciones</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;

    const tbody = table.querySelector('tbody');

    items.forEach(s => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${s.id_servicio}</td>
        <td>${s.id_auto || ''}</td>
        <td>${s.id_empleado || ''}</td>
        <td>${s.id_cliente || ''}</td>
        <td>${s.fecha_servicio ? new Date(s.fecha_servicio).toLocaleDateString() : ''}</td>
        <td>${s.tipo_servicio || ''}</td>
        <td>$${s.costo ? s.costo.toFixed(2) : '0.00'}</td>
        <td>${s.kilometraje || ''}</td>
        <td>${s.fecha_ingreso ? new Date(s.fecha_ingreso).toLocaleDateString() : ''}</td>
        <td>${s.fecha_entrega ? new Date(s.fecha_entrega).toLocaleDateString() : ''}</td>
        <td><span class="status-badge status-${s.estado}">${s.estado || ''}</span></td>
        <td>
          <button data-id="${s.id_servicio}" class="btn btn-secondary btn-view">Ver</button>
          <button data-id="${s.id_servicio}" class="btn btn-primary btn-edit">Editar</button>
          <button data-id="${s.id_servicio}" class="btn btn-danger btn-delete">Eliminar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    serviciosList.appendChild(table);

    // Attach actions
    document.querySelectorAll('.btn-view').forEach(b => b.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      await viewServicio(id);
    }));

    document.querySelectorAll('.btn-edit').forEach(b => b.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      await editServicio(id);
    }));

    document.querySelectorAll('.btn-delete').forEach(b => b.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      if (!confirm('¿Eliminar servicio?')) return;
      await deleteServicio(id);
    }));

    addLog(`✅ ${items.length} servicio(s) cargado(s)`, 'success');
  } catch (err) {
    addLog(`Error de red: ${err.message}`, 'error');
    serviciosList.innerHTML = `<div class="empty-state"><p>${err.message}</p></div>`;
  }
}

// ===========================
// Ver servicio
// ===========================
async function viewServicio(id) {
  addLog(`Cargando servicio ${id}...`, 'info');
  try {
    const res = await fetch(`${API_BASE}/${id}`);
    const r = await res.json();
    if (!res.ok) { addLog(`Error: ${r.message}`, 'error'); return; }
    const s = r.data;
    alert(JSON.stringify(s, null, 2));
  } catch (err) { addLog(err.message, 'error'); }
}

// ===========================
// Editar servicio
// ===========================
async function editServicio(id) {
  addLog(`Obteniendo servicio ${id} para edición...`, 'info');
  try {
    const res = await fetch(`${API_BASE}/${id}`);
    const r = await res.json();
    if (!res.ok) { addLog(`Error: ${r.message}`, 'error'); return; }
    const s = r.data;
    document.getElementById('id_servicio').value = s.id_servicio || '';
    document.getElementById('id_auto').value = s.id_auto || '';
    document.getElementById('id_empleado').value = s.id_empleado || '';
    document.getElementById('id_cliente').value = s.id_cliente || '';
    document.getElementById('tipo_servicio').value = s.tipo_servicio || '';
    document.getElementById('costo').value = s.costo || 0;
    document.getElementById('kilometraje').value = s.kilometraje || 0;
    document.getElementById('estado').value = s.estado || 'pendiente';

    if (s.fecha_servicio) {
      document.getElementById('fecha_servicio').value = new Date(s.fecha_servicio).toISOString().substring(0,10);
    }
    if (s.fecha_ingreso) {
      document.getElementById('fecha_ingreso').value = new Date(s.fecha_ingreso).toISOString().substring(0,10);
    }
    if (s.fecha_entrega) {
      document.getElementById('fecha_entrega').value = new Date(s.fecha_entrega).toISOString().substring(0,10);
    }

    addLog('Formulario cargado para edición', 'success');
  } catch (err) { addLog(err.message, 'error'); }
}

// ===========================
// Eliminar servicio
// ===========================
async function deleteServicio(id) {
  addLog(`Eliminando servicio ${id}...`, 'info');
  try {
    const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    const r = await res.json();
    if (!res.ok) { addLog(`Error: ${r.message}`, 'error'); return; }
    addLog('Servicio eliminado', 'success');
    await loadServicios();
  } catch (err) { addLog(err.message, 'error'); }
}

// ===========================
// Submit (crear / actualizar)
// ===========================
servicioForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('id_servicio').value;
  const payload = {
    id_auto: parseInt(document.getElementById('id_auto').value),
    id_empleado: parseInt(document.getElementById('id_empleado').value),
    id_cliente: parseInt(document.getElementById('id_cliente').value),
    fecha_servicio: document.getElementById('fecha_servicio').value,
    tipo_servicio: document.getElementById('tipo_servicio').value.trim(),
    costo: parseFloat(document.getElementById('costo').value) || 0.00,
    kilometraje: parseInt(document.getElementById('kilometraje').value) || 0,
    fecha_ingreso: document.getElementById('fecha_ingreso').value || new Date().toISOString(),
    fecha_entrega: document.getElementById('fecha_entrega').value || null,
    estado: document.getElementById('estado').value
  };

  try {
    if (id) {
      addLog(`Actualizando servicio ${id}...`, 'info');
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const r = await res.json();
      if (!res.ok) { addLog(`Error: ${r.message}`, 'error'); return; }
      addLog('Servicio actualizado', 'success');
    } else {
      addLog('Creando servicio...', 'info');
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const r = await res.json();
      if (!res.ok) { addLog(`Error: ${r.message}`, 'error'); return; }
      addLog('Servicio creado', 'success');
    }

    clearForm();
    await loadServicios();
  } catch (err) { addLog(err.message, 'error'); }
});

// ===========================
// Botones
// ===========================
document.getElementById('clearBtn').addEventListener('click', () => clearForm());
document.getElementById('reloadBtn').addEventListener('click', () => loadServicios());

window.addEventListener('load', () => {
  addLog('Interfaz de Servicios cargada', 'info');
  loadServicios();
});

