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
function addLog(msg) {
  const d = new Date().toLocaleTimeString();
  logs.innerHTML += `[${d}] ${msg}<br>`;
  logs.scrollTop = logs.scrollHeight;
}

// ===========================
// 🔹 Cargar Select
// ===========================
async function loadSelectOptions(url, selectId, labelField) {
  const select = document.getElementById(selectId);
  select.innerHTML = '<option value="">Cargando...</option>';

  try {
    const res = await fetch(url);
    const data = await res.json();
    const items = data.data || [];

    select.innerHTML = '<option value="">Seleccione...</option>';

    items.forEach(item => {
      const option = document.createElement('option');
      option.value = item.id_cliente || item.id_empleado || item.id;
      option.textContent = `${option.value} - ${item[labelField]}`;
      select.appendChild(option);
    });

  } catch (error) {
    select.innerHTML = '<option>Error</option>';
  }
}

// ===========================
// 🔹 Buscar Auto por Cliente
// ===========================
async function loadAutoByCliente(idCliente) {

  const autoBox = document.getElementById('auto_info');
  const hiddenAutoInput = document.getElementById('id_auto');

  if (!idCliente) {
    autoBox.innerHTML = 'Seleccione un cliente...';
    hiddenAutoInput.value = '';
    return;
  }

  try {

    const res = await fetch(API_AUTOS);
    const result = await res.json();
    const autos = result.data || [];

    const auto = autos.find(a => a.id_cliente == idCliente);

    if (!auto) {
      autoBox.innerHTML = 'Este cliente no tiene auto asignado';
      hiddenAutoInput.value = '';
      return;
    }

    // ⚡ Mostramos solo los campos que REALMENTE existen
    autoBox.innerHTML = `
      🚗 ${auto.modelo || ''} <br>
      Año: ${auto.anio || 'No especificado'} <br>
      Patente: ${auto.patente || 'Sin patente'}
    `;

    hiddenAutoInput.value = auto.id_auto;

  } catch (error) {
    autoBox.innerHTML = 'Error cargando auto';
    hiddenAutoInput.value = '';
  }
}

// ===========================
// 🔹 Cargar Servicios
// ===========================

// ===========================
// 🔹 Editar
// ===========================
async function editServicio(id) {

  const res = await fetch(`${API_BASE}/${id}`);
  const r = await res.json();
  const s = r.data;

  document.getElementById('id_servicio').value = s.id_servicio;
  document.getElementById('id_cliente').value = s.id_cliente;
  document.getElementById('id_empleado').value = s.id_empleado;
  document.getElementById('tipo_servicio').value = s.tipo_servicio;
  document.getElementById('costo').value = s.costo;
  document.getElementById('estado').value = s.estado;

  await loadAutoByCliente(s.id_cliente);
}

// ===========================
// 🔹 Eliminar
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
    fecha_servicio: document.getElementById('fecha_servicio').value,
    tipo_servicio: document.getElementById('tipo_servicio').value,
    costo: parseFloat(document.getElementById('costo').value) || 0,
    estado: document.getElementById('estado').value
  }; 

  console.log("Payload:", JSON.stringify(payload)); 
  console.log("PAYLOAD FINAL:", payload);

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

  servicioForm.reset();
  await loadServicios();
});

// ===========================
// 🔹 Inicialización
// ===========================
window.addEventListener('load', async () => {

  addLog('Sistema iniciado');

  await loadSelectOptions(API_CLIENTES, 'id_cliente', 'nombre');
  await loadSelectOptions(API_EMPLEADOS, 'id_empleado', 'nombre');

  document.getElementById('id_cliente').addEventListener('change', (e) => {
    loadAutoByCliente(e.target.value);
  });

  await loadServicios();
});