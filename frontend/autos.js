const API_AUTOS = 'https://api-autos-kxb7.onrender.com/api/autos';
const API_CLIENTES = 'https://api-clientes-6nvx.onrender.com/api/clientes';

const logs = document.getElementById('logs');
const autosList = document.getElementById('autosList');
const autoForm = document.getElementById('autoForm');
const clienteSelect = document.getElementById('id_cliente'); 
const filterCliente = document.getElementById('filterCliente');

let allAutos = [];
let allClientes = []; 

filterCliente.addEventListener('change', () => {
  const clienteId = filterCliente.value;

  if (!clienteId) {
    renderAutos(allAutos);
    return;
  }

  const filtrados = allAutos.filter(a =>
    a.id_cliente == clienteId
  );

  renderAutos(filtrados);
});

// ================= LOGS =================
function addLog(msg, type = 'info') {
  const d = new Date().toLocaleTimeString();
  const el = document.createElement('div');
  el.className = `log-entry log-${type}`;
  el.innerHTML = `<span class="log-time">[${d}]</span> ${msg}`;
  logs.appendChild(el);
  logs.scrollTop = logs.scrollHeight;
}

// ================= UTIL =================
function clearForm() {
  autoForm.reset();
  document.getElementById('id_auto').value = '';
}

// ================= CLIENTES SELECT =================
async function loadClientes() {
  const res = await fetch(API_CLIENTES);
  const r = await res.json();
  allClientes = r.data || [];

  clienteSelect.innerHTML = '';
  filterCliente.innerHTML = '<option value="">-- Todos los clientes --</option>';

  allClientes.forEach(c => {
    const nombre = `${c.nombre} ${c.apellido}`;

    // selector del formulario
    const optForm = document.createElement('option');
    optForm.value = c.id_cliente;
    optForm.textContent = nombre;
    clienteSelect.appendChild(optForm);

    // selector de filtro
    const optFilter = document.createElement('option');
    optFilter.value = c.id_cliente;
    optFilter.textContent = nombre;
    filterCliente.appendChild(optFilter);
  });
}
// ================= AUTOS =================
async function loadAutos() {
  addLog('Cargando autos...', 'info');
  autosList.innerHTML = '';

  try {
    const res = await fetch(API_AUTOS);
    const result = await res.json();

    if (!res.ok) {
      addLog(result.message || 'Error', 'error');
      return;
    }

    allAutos = result.data || [];
    renderAutos(allAutos);
    addLog(`✅ ${allAutos.length} auto(s) cargado(s)`, 'success');
  } catch (err) {
    addLog(err.message, 'error');
  }
}

function renderAutos(items) {
  autosList.innerHTML = '';

  if (items.length === 0) {
    autosList.innerHTML = `<div class="empty-state"><p>No hay autos</p></div>`;
    return;
  }

  const table = document.createElement('table');
  table.style.width = '100%';
  table.innerHTML = `
    <thead>
      <tr>
        <th>ID</th><th>Cliente</th><th>Modelo</th><th>Año</th><th>Patente</th><th>KMs</th><th>Acciones</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  const tbody = table.querySelector('tbody');

  items.forEach(a => {
    const cliente = allClientes.find(c => c.id_cliente == a.id_cliente);
    const nombreCliente = cliente ? `${cliente.nombre} ${cliente.apellido}` : a.id_cliente;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${a.id_auto}</td>
      <td>${nombreCliente}</td>
      <td>${a.modelo}</td>
      <td>${a.anio}</td>
      <td>${a.patente}</td>
      <td>${a.kilometraje || ''}</td>
      <td>
        <button data-id="${a.id_auto}" class="btn btn-primary btn-edit">Editar</button>
        <button data-id="${a.id_auto}" class="btn btn-danger btn-delete">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  autosList.appendChild(table);
  attachActions();
}

// ================= CRUD =================
async function editAuto(id) {
  const res = await fetch(`${API_AUTOS}/${id}`);
  const r = await res.json();
  const a = r.data;

  document.getElementById('id_auto').value = a.id_auto;
  document.getElementById('id_cliente').value = a.id_cliente;
  document.getElementById('modelo').value = a.modelo;
  document.getElementById('anio').value = a.anio;
  document.getElementById('patente').value = a.patente;
  document.getElementById('kilometraje').value = a.kilometraje;
}

async function deleteAuto(id) {
  if (!confirm('¿Eliminar auto?')) return;

  await fetch(`${API_AUTOS}/${id}`, { method: 'DELETE' });
  addLog('Auto eliminado', 'success');
  await loadAutos();
}

autoForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('id_auto').value;

  const payload = {
    id_cliente: document.getElementById('id_cliente').value,
    modelo: document.getElementById('modelo').value,
    anio: document.getElementById('anio').value,
    patente: document.getElementById('patente').value,
    kilometraje: document.getElementById('kilometraje').value
  };

  if (id) {
    await fetch(`${API_AUTOS}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    addLog('Auto actualizado', 'success');
  } else {
    await fetch(API_AUTOS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    addLog('Auto creado', 'success');
  }

  clearForm();
  await loadAutos();
});

// ================= SEARCH =================
document.getElementById('searchInput')
  .addEventListener('input', () => {
    const t = document.getElementById('searchInput')
      .value.toLowerCase().trim();

    const filtered = allAutos.filter(a =>
      (a.modelo || '').toLowerCase().startsWith(t) ||
      (a.patente || '').toLowerCase().startsWith(t)
    );

    renderAutos(filtered);
  });

function attachActions() {
  document.querySelectorAll('.btn-edit').forEach(b =>
    b.addEventListener('click', e => editAuto(e.target.dataset.id))
  );

  document.querySelectorAll('.btn-delete').forEach(b =>
    b.addEventListener('click', e => deleteAuto(e.target.dataset.id))
  );
}

document.getElementById('clearBtn')
  .addEventListener('click', clearForm);

document.getElementById('reloadBtn')
  .addEventListener('click', loadAutos);

window.addEventListener('load', async () => {
  addLog('Interfaz Autos cargada', 'info');
  await loadClientes();
  await loadAutos();
});