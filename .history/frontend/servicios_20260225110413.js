// ===========================
// 🔹 URLs APIs
// ===========================
const API_BASE = 'https://api-servicios-926g.onrender.com/api/servicios'; 
const API_AUTOS = 'https://api-autos-kxb7.onrender.com/api/autos';
const API_EMPLEADOS = 'https://api-empleados-i8xz.onrender.com/api/empleados';
const API_CLIENTES = 'https://api-clientes-6nvx.onrender.com/api/clientes'; 

// ===========================
// 🔹 Referencias DOM
// ===========================
const logs = document.getElementById('logs');
const serviciosList = document.getElementById('serviciosList');
const servicioForm = document.getElementById('servicioForm');

// ===========================
// 🔹 Logger
// ===========================
function addLog(msg, type = 'info') {
  const d = new Date().toLocaleTimeString();
  const el = document.createElement('div');
  el.className = `log-entry log-${type}`;
  el.innerHTML = `<span class="log-time">[${d}]</span> ${msg}`;
  logs.appendChild(el);
  logs.scrollTop = logs.scrollHeight;
}

// ===========================
// 🔹 Cargar Selectores DINÁMICOS
// ===========================
async function loadSelectOptions(url, selectId, labelField = 'nombre') {
  const select = document.getElementById(selectId);
  select.innerHTML = `<option value="">Cargando...</option>`;

  try {
    const res = await fetch(url);
    const result = await res.json();
    const items = result.data || [];

    select.innerHTML = `<option value="">Seleccione...</option>`;

    items.forEach(item => {
      const option = document.createElement('option');
      option.value = item.id_auto || item.id_empleado || item.id_cliente || item.id;
      option.textContent = `${option.value} - ${item[labelField] || 'Sin dato'}`;
      select.appendChild(option);
    });

  } catch (error) {
    select.innerHTML = `<option value="">Error cargando datos</option>`;
    addLog(`Error cargando ${selectId}`, 'error');
  }
}

// ===========================
// 🔹 Limpiar Form
// ===========================
function clearForm() {
  servicioForm.reset();
  document.getElementById('id_servicio').value = '';
  document.getElementById('estado').value = 'pendiente';
}

// ===========================
// 🔹 Cargar Servicios
// ===========================
async function loadServicios() {
  addLog('Cargando servicios...', 'info');
  serviciosList.innerHTML = '';

  try {
    const res = await fetch(API_BASE);
    const result = await res.json();

    if (!res.ok) {
      addLog(`Error cargando servicios`, 'error');
      return;
    }

    const items = result.data || [];
    if (items.length === 0) {
      serviciosList.innerHTML = `<div class="empty-state"><p>No hay servicios</p></div>`;
      return;
    }

    const table = document.createElement('table');
    table.style.width = '100%';
    table.innerHTML = `
      <thead>
        <tr>
          <th>ID</th><th>ID Auto</th><th>ID Empleado</th><th>ID Cliente</th>
          <th>Fecha</th><th>Tipo</th><th>Costo</th><th>KM</th>
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
        <td>${s.estado || ''}</td>
        <td>
          <button data-id="${s.id_servicio}" class="btn-edit">Editar</button>
          <button data-id="${s.id_servicio}" class="btn-delete">Eliminar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    serviciosList.appendChild(table);

    document.querySelectorAll('.btn-edit').forEach(b =>
      b.addEventListener('click', e => editServicio(e.target.dataset.id))
    );

    document.querySelectorAll('.btn-delete').forEach(b =>
      b.addEventListener('click', e => deleteServicio(e.target.dataset.id))
    );

  } catch (err) {
    addLog(err.message, 'error');
  }
}

// ===========================
// 🔹 Editar Servicio
// ===========================
async function editServicio(id) {
  const res = await fetch(`${API_BASE}/${id}`);
  const r = await res.json();
  const s = r.data;

  document.getElementById('id_servicio').value = s.id_servicio || '';
  document.getElementById('id_auto').value = s.id_auto || '';
  document.getElementById('id_empleado').value = s.id_empleado || '';
  document.getElementById('id_cliente').value = s.id_cliente || '';
  document.getElementById('tipo_servicio').value = s.tipo_servicio || '';
  document.getElementById('costo').value = s.costo || 0;
  document.getElementById('kilometraje').value = s.kilometraje || 0;
  document.getElementById('estado').value = s.estado || 'pendiente';
}

// ===========================
// 🔹 Eliminar Servicio
// ===========================
async function deleteServicio(id) {
  await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
  await loadServicios();
}

// ===========================
// 🔹 Submit
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
    costo: parseFloat(document.getElementById('costo').value) || 0,
    kilometraje: parseInt(document.getElementById('kilometraje').value) || 0,
    fecha_ingreso: document.getElementById('fecha_ingreso').value || null,
    fecha_entrega: document.getElementById('fecha_entrega').value || null,
    estado: document.getElementById('estado').value
  };

  if (id) {
    await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } else {
    await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  }

  clearForm();
  await loadServicios();
});

// ===========================
// 🔹 Load Inicial
// ===========================
window.addEventListener('load', async () => {

  addLog('Interfaz de Servicios cargada', 'info');

  // 🔥 ACA SE CARGAN LOS SELECTORES DINÁMICAMENTE
  await loadSelectOptions(API_AUTOS, 'id_auto', 'modelo');
  await loadSelectOptions(API_EMPLEADOS, 'id_empleado', 'nombre');
  await loadSelectOptions(API_CLIENTES, 'id_cliente', 'nombre');

  await loadServicios();
});

