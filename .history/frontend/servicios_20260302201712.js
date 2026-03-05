// ===========================
// 🔹 URLs APIs
// ===========================
const API_BASE ='https:'          /* 'https://api-servicios-926g.onrender.com/api/servicios'; */
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
async function loadServicios() {

  serviciosList.innerHTML = '';

  try {

    const [servRes, autoRes, empRes, cliRes] = await Promise.all([
      fetch(API_BASE),
      fetch(API_AUTOS),
      fetch(API_EMPLEADOS),
      fetch(API_CLIENTES)
    ]);

    const servJson = await servRes.json();
    const autoJson = await autoRes.json();
    const empJson = await empRes.json();
    const cliJson = await cliRes.json();

    const servicios = servJson.data || servJson || [];
    const autos = autoJson.data || autoJson || [];
    const empleados = empJson.data || empJson || [];
    const clientes = cliJson.data || cliJson || [];

    console.log("Servicios:", servicios);
    console.log("Autos:", autos);
    console.log("Empleados:", empleados);
    console.log("Clientes:", clientes);

    if (!servicios.length) {
      serviciosList.innerHTML = "<p>No hay servicios cargados.</p>";
      return;
    }

    const table = document.createElement('table');

    table.innerHTML = `
      <thead>
        <tr>
          <th>ID</th>
          <th>Cliente</th>
          <th>Auto</th>
          <th>Empleado</th>
          <th>Tipo</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;

    const tbody = table.querySelector('tbody');

    servicios.forEach(s => {

      const auto = autos.find(a => a.id_auto == s.id_auto);
      const empleado = empleados.find(e => e.id_empleado == s.id_empleado);
      const cliente = auto
        ? clientes.find(c => c.id_cliente == auto.id_cliente)
        : null;

      const nombreCliente = cliente ? cliente.nombre : 'Sin cliente';
      const nombreEmpleado = empleado ? empleado.nombre : 'Sin empleado';
      const nombreAuto = auto
        ? `${auto.modelo || ''} - ${auto.patente || ''}`
        : 'Sin auto';

      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td>${s.id_servicio}</td>
        <td>${nombreCliente}</td>
        <td>${nombreAuto}</td>
        <td>${nombreEmpleado}</td>
        <td>${s.tipo_servicio}</td>
        <td>${s.estado}</td>
        <td>
          <button class="btn-edit" onclick="editServicio(${s.id_servicio})">Editar</button>
          <button class="btn-delete" onclick="deleteServicio(${s.id_servicio})">Eliminar</button>
        </td>
      `;

      tbody.appendChild(tr);
    });

    serviciosList.appendChild(table);

  } catch (error) {
    console.error("ERROR:", error);
    serviciosList.innerHTML = "<p>Error cargando servicios</p>";
  }
}
// ===========================
// 🔹 Editar
// ===========================
async function editServicio(id) {

  const res = await fetch(`${API_BASE}/${id}`);
  const r = await res.json();
  const s = r.data || r;

  console.log("Servicio edit:", s);

  document.getElementById('id_servicio').value = s.id_servicio;

  // 🔹 1. Traemos todos los autos
  const autoRes = await fetch(API_AUTOS);
  const autoJson = await autoRes.json();
  const autos = autoJson.data || [];

  // 🔹 2. Buscamos el auto del servicio
  const auto = autos.find(a => a.id_auto == s.id_auto);

  if (auto) {

    // 🔹 3. Seteamos el cliente correcto
    document.getElementById('id_cliente').value = auto.id_cliente;

    // 🔹 4. Cargamos el box visual y el hidden input
    await loadAutoByCliente(auto.id_cliente);

    // 🔹 5. Nos aseguramos que el hidden tenga el auto correcto
    document.getElementById('id_auto').value = auto.id_auto;
  }

  document.getElementById('id_empleado').value = s.id_empleado;
  document.getElementById('tipo_servicio').value = s.tipo_servicio;
  document.getElementById('costo').value = s.costo;
  document.getElementById('estado').value = s.estado;
  document.getElementById('fecha_servicio').value = s.fecha_servicio?.split('T')[0];
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