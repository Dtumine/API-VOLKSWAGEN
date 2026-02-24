const API_BASE ='https://api-clientes-6nvx.onrender.com/api/clientes';

const logs = document.getElementById('logs');
const clientesList = document.getElementById('clientesList');
const clienteForm = document.getElementById('clienteForm'); 
let allClientes = [];
let currentLetter = null;

function addLog(msg, type = 'info') {
  const d = new Date().toLocaleTimeString();
  const el = document.createElement('div');
  el.className = `log-entry log-${type}`;
  el.innerHTML = `<span class="log-time">[${d}]</span> ${msg}`;
  logs.appendChild(el);
  logs.scrollTop = logs.scrollHeight;
}

function clearForm() {
  clienteForm.reset();
  document.getElementById('id_cliente').value = '';
}

async function loadClientes() {
  addLog('Cargando clientes...', 'info');
  clientesList.innerHTML = '';
  try {
    const res = await fetch(API_BASE);
    const result = await res.json();

    if (!res.ok) {
      addLog(`Error cargando clientes: ${result.message || res.statusText}`, 'error');
      clientesList.innerHTML = `<div class="empty-state"><p>Error: ${result.message || res.statusText}</p></div>`;
      return;
    }

    const items = result.data || []; 
    allClientes = items;
   renderClientes(items);
   createAlphabetFilter();
    // Attach actions
    document.querySelectorAll('.btn-view').forEach(b => b.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      await viewCliente(id);
    }));

    document.querySelectorAll('.btn-edit').forEach(b => b.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      await editCliente(id);
    }));

    document.querySelectorAll('.btn-delete').forEach(b => b.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      if (!confirm('¿Eliminar cliente?')) return;
      await deleteCliente(id);
    }));

    addLog(`✅ ${items.length} cliente(s) cargado(s)`, 'success');
  } catch (err) {
    addLog(`Error de red: ${err.message}`, 'error');
    clientesList.innerHTML = `<div class="empty-state"><p>${err.message}</p></div>`;
  }
}

async function viewCliente(id) {
  addLog(`Cargando cliente ${id}...`, 'info');
  try {
    const res = await fetch(`${API_BASE}/${id}`);
    const r = await res.json();
    if (!res.ok) { addLog(`Error: ${r.message}`, 'error'); return; }
    const c = r.data;
    alert(JSON.stringify(c, null, 2));
  } catch (err) { addLog(err.message, 'error'); }
}

async function editCliente(id) {
  addLog(`Obteniendo cliente ${id} para edición...`, 'info');
  try {
    const res = await fetch(`${API_BASE}/${id}`);
    const r = await res.json();
    if (!res.ok) { addLog(`Error: ${r.message}`, 'error'); return; }
    const c = r.data;
    document.getElementById('id_cliente').value = c.id_cliente || '';
    document.getElementById('nombre').value = c.nombre || '';
    document.getElementById('apellido').value = c.apellido || '';
    document.getElementById('dni').value = c.dni || '';
    document.getElementById('telefono').value = c.telefono || '';
    document.getElementById('email').value = c.email || '';
    if (c.fecha_alta) {
      const d = new Date(c.fecha_alta);
      const iso = d.toISOString().substring(0,10);
      document.getElementById('fecha_alta').value = iso;
    }
    addLog('Formulario cargado para edición', 'success');
  } catch (err) { addLog(err.message, 'error'); }
}

async function deleteCliente(id) {
  addLog(`Eliminando cliente ${id}...`, 'info');
  try {
    const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    const r = await res.json();
    if (!res.ok) { addLog(`Error: ${r.message}`, 'error'); return; }
    addLog('Cliente eliminado', 'success');
    await loadClientes();
  } catch (err) { addLog(err.message, 'error'); }
}

clienteForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('id_cliente').value;
  const payload = {
    nombre: document.getElementById('nombre').value.trim(),
    apellido: document.getElementById('apellido').value.trim(),
    dni: document.getElementById('dni').value.trim(),
    telefono: document.getElementById('telefono').value.trim() || null,
    email: document.getElementById('email').value.trim(),
    fecha_alta: document.getElementById('fecha_alta').value || new Date().toISOString()
  };

  try {
    if (id) {
      addLog(`Actualizando cliente ${id}...`, 'info');
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const r = await res.json();
      if (!res.ok) { addLog(`Error: ${r.message}`, 'error'); return; }
      addLog('Cliente actualizado', 'success');
    } else {
      addLog('Creando cliente...', 'info');
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const r = await res.json();
      if (!res.ok) { addLog(`Error: ${r.message}`, 'error'); return; }
      addLog('Cliente creado', 'success');
    }
    clearForm();
    await loadClientes();
  } catch (err) { addLog(err.message, 'error'); }
});

document.getElementById('clearBtn').addEventListener('click', () => clearForm());
document.getElementById('reloadBtn').addEventListener('click', () => loadClientes()); 
document.getElementById('searchInput').addEventListener('input', filterClientes);

function renderClientes(items) {
  clientesList.innerHTML = '';

  if (items.length === 0) {
    clientesList.innerHTML = `<div class="empty-state"><p>No hay clientes</p></div>`;
    return;
  }

  const table = document.createElement('table');
  table.style.width = '100%';
  table.innerHTML = `
    <thead>
      <tr>
        <th>ID</th><th>Nombre</th><th>Apellido</th><th>DNI</th><th>Tel</th><th>Email</th><th>Fecha Alta</th><th>Acciones</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  const tbody = table.querySelector('tbody');

  items.forEach(c => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${c.id_cliente}</td>
      <td>${c.nombre || ''}</td>
      <td>${c.apellido || ''}</td>
      <td>${c.dni || ''}</td>
      <td>${c.telefono || ''}</td>
      <td>${c.email || ''}</td>
      <td>${c.fecha_alta ? new Date(c.fecha_alta).toLocaleDateString() : ''}</td>
      <td>
        <button data-id="${c.id_cliente}" class="btn btn-secondary btn-view">Ver</button>
        <button data-id="${c.id_cliente}" class="btn btn-primary btn-edit">Editar</button>
        <button data-id="${c.id_cliente}" class="btn btn-danger btn-delete">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  clientesList.appendChild(table);

  attachActions();
}

function createAlphabetFilter() {
  const container = document.getElementById('alphabetFilter');
  container.innerHTML = '';

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  letters.forEach(letter => {
    const btn = document.createElement('button');
    btn.textContent = letter;
    btn.style.margin = '2px';
    btn.className = 'btn btn-secondary';

    btn.addEventListener('click', () => {
      currentLetter = letter;
      filterClientes();
    });

    container.appendChild(btn);
  });

  // Botón limpiar filtro
  const clearBtn = document.createElement('button');
  clearBtn.textContent = 'Todos';
  clearBtn.className = 'btn btn-primary';
  clearBtn.style.marginLeft = '10px'; 



  clearBtn.addEventListener('click', () => {
    currentLetter = null;
    document.getElementById('searchInput').value = '';
    renderClientes(allClientes);
  });

  container.appendChild(clearBtn);
}

function filterClientes() {
  const searchText = document.getElementById('searchInput').value.toLowerCase();

  let filtered = allClientes;

  if (currentLetter) {
    filtered = filtered.filter(c =>
      (c.nombre || '').toUpperCase().startsWith(currentLetter)
    );
  }

  if (searchText) {
    filtered = filtered.filter(c =>
      (c.nombre || '').toLowerCase().includes(searchText) ||
      (c.apellido || '').toLowerCase().includes(searchText) ||
      (c.dni || '').toLowerCase().includes(searchText)
    );
  }

  renderClientes(filtered);
}

function attachActions() {
  document.querySelectorAll('.btn-view').forEach(b =>
    b.addEventListener('click', async e => viewCliente(e.target.dataset.id))
  );

  document.querySelectorAll('.btn-edit').forEach(b =>
    b.addEventListener('click', async e => editCliente(e.target.dataset.id))
  );

  document.querySelectorAll('.btn-delete').forEach(b =>
    b.addEventListener('click', async e => {
      if (!confirm('¿Eliminar cliente?')) return;
      await deleteCliente(e.target.dataset.id);
    })
  );
}

window.addEventListener('load', () => {
  addLog('Interfaz de Clientes cargada', 'info');
  loadClientes();
});
