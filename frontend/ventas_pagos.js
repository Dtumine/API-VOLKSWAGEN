const API_BASE = 'http://localhost:3060/api';

const logs = document.getElementById('logs');
const ventasList = document.getElementById('ventasList');
const pagosList = document.getElementById('pagosList');
const ventaForm = document.getElementById('ventaForm');
const pagoForm = document.getElementById('pagoForm');

function addLog(msg, type = 'info') {
  const d = new Date().toLocaleTimeString();
  const el = document.createElement('div');
  el.className = `log-entry log-${type}`;
  el.innerHTML = `<span class="log-time">[${d}]</span> ${msg}`;
  logs.appendChild(el);
  logs.scrollTop = logs.scrollHeight;
}

function switchTab(tab) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  document.getElementById(tab).classList.add('active');
  event.target.classList.add('active');
}

function clearFormVenta() {
  ventaForm.reset();
  document.getElementById('id_venta').value = '';
}

function clearFormPago() {
  pagoForm.reset();
  document.getElementById('id_pago').value = '';
}

// ============================================
// VENTAS
// ============================================

async function loadVentas() {
  addLog('Cargando ventas...', 'info');
  ventasList.innerHTML = '';
  try {
    const res = await fetch(`${API_BASE}/ventas`);
    const result = await res.json();

    if (!res.ok) {
      addLog(`Error cargando ventas: ${result.message || res.statusText}`, 'error');
      ventasList.innerHTML = `<div class="empty-state"><p>Error: ${result.message || res.statusText}</p></div>`;
      return;
    }

    const items = result.data || [];
    if (items.length === 0) {
      ventasList.innerHTML = `<div class="empty-state"><p>No hay ventas</p></div>`;
      addLog('No hay ventas', 'warning');
      return;
    }

    const table = document.createElement('table');
    table.innerHTML = `
      <thead>
        <tr>
          <th>ID</th><th>Cliente</th><th>Auto</th><th>Fecha</th><th>Precio</th><th>Empleado</th><th>Acciones</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;

    const tbody = table.querySelector('tbody');

    items.forEach(v => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${v.id_venta}</td>
        <td>${v.id_cliente}</td>
        <td>${v.id_auto}</td>
        <td>${v.fecha_venta ? new Date(v.fecha_venta).toLocaleDateString() : ''}</td>
        <td>$${parseFloat(v.precio).toFixed(2)}</td>
        <td>${v.id_empleado}</td>
        <td>
          <button data-id="${v.id_venta}" class="btn btn-secondary btn-small btn-edit-venta">Editar</button>
          <button data-id="${v.id_venta}" class="btn btn-danger btn-small btn-delete-venta">Eliminar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    ventasList.appendChild(table);

    document.querySelectorAll('.btn-edit-venta').forEach(b => b.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      await editVenta(id);
    }));

    document.querySelectorAll('.btn-delete-venta').forEach(b => b.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      if (!confirm('¿Eliminar venta?')) return;
      await deleteVenta(id);
    }));

    addLog(`✅ ${items.length} venta(s) cargada(s)`, 'success');
  } catch (err) {
    addLog(`Error de red: ${err.message}`, 'error');
    ventasList.innerHTML = `<div class="empty-state"><p>${err.message}</p></div>`;
  }
}

async function editVenta(id) {
  addLog(`Obteniendo venta ${id} para edición...`, 'info');
  try {
    const res = await fetch(`${API_BASE}/ventas/${id}`);
    const r = await res.json();
    if (!res.ok) { addLog(`Error: ${r.message}`, 'error'); return; }
    const v = r.data;
    document.getElementById('id_venta').value = v.id_venta || '';
    document.getElementById('id_cliente').value = v.id_cliente || '';
    document.getElementById('id_auto').value = v.id_auto || '';
    document.getElementById('precio').value = v.precio || '';
    document.getElementById('id_empleado').value = v.id_empleado || '';
    if (v.fecha_venta) {
      const d = new Date(v.fecha_venta);
      const iso = d.toISOString().substring(0, 10);
      document.getElementById('fecha_venta').value = iso;
    }
    addLog('Formulario cargado para edición', 'success');
  } catch (err) { addLog(err.message, 'error'); }
}

async function deleteVenta(id) {
  addLog(`Eliminando venta ${id}...`, 'info');
  try {
    const res = await fetch(`${API_BASE}/ventas/${id}`, { method: 'DELETE' });
    const r = await res.json();
    if (!res.ok) { addLog(`Error: ${r.message}`, 'error'); return; }
    addLog('Venta eliminada', 'success');
    await loadVentas();
  } catch (err) { addLog(err.message, 'error'); }
}

ventaForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('id_venta').value;
  const payload = {
    id_cliente: parseInt(document.getElementById('id_cliente').value),
    id_auto: parseInt(document.getElementById('id_auto').value),
    fecha_venta: document.getElementById('fecha_venta').value,
    precio: parseFloat(document.getElementById('precio').value),
    id_empleado: parseInt(document.getElementById('id_empleado').value)
  };

  try {
    if (id) {
      addLog(`Actualizando venta ${id}...`, 'info');
      const res = await fetch(`${API_BASE}/ventas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const r = await res.json();
      if (!res.ok) { addLog(`Error: ${r.message}`, 'error'); return; }
      addLog('Venta actualizada', 'success');
    } else {
      addLog('Creando venta...', 'info');
      const res = await fetch(`${API_BASE}/ventas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const r = await res.json();
      if (!res.ok) { addLog(`Error: ${r.message}`, 'error'); return; }
      addLog('Venta creada', 'success');
    }
    clearFormVenta();
    await loadVentas();
  } catch (err) { addLog(err.message, 'error'); }
});

document.getElementById('clearVentaBtn').addEventListener('click', () => clearFormVenta());
document.getElementById('reloadVentasBtn').addEventListener('click', () => loadVentas());

// ============================================
// PAGOS
// ============================================

async function loadPagos() {
  addLog('Cargando pagos...', 'info');
  pagosList.innerHTML = '';
  try {
    const res = await fetch(`${API_BASE}/pagos`);
    const result = await res.json();

    if (!res.ok) {
      addLog(`Error cargando pagos: ${result.message || res.statusText}`, 'error');
      pagosList.innerHTML = `<div class="empty-state"><p>Error: ${result.message || res.statusText}</p></div>`;
      return;
    }

    const items = result.data || [];
    if (items.length === 0) {
      pagosList.innerHTML = `<div class="empty-state"><p>No hay pagos</p></div>`;
      addLog('No hay pagos', 'warning');
      return;
    }

    const table = document.createElement('table');
    table.innerHTML = `
      <thead>
        <tr>
          <th>ID</th><th>Venta</th><th>Monto</th><th>Método</th><th>Fecha</th><th>Acciones</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;

    const tbody = table.querySelector('tbody');

    items.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${p.id_pago}</td>
        <td>${p.id_venta}</td>
        <td>$${parseFloat(p.monto).toFixed(2)}</td>
        <td>${p.metodo_pago}</td>
        <td>${p.created_at ? new Date(p.created_at).toLocaleDateString() : ''}</td>
        <td>
          <button data-id="${p.id_pago}" class="btn btn-secondary btn-small btn-edit-pago">Editar</button>
          <button data-id="${p.id_pago}" class="btn btn-danger btn-small btn-delete-pago">Eliminar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    pagosList.appendChild(table);

    document.querySelectorAll('.btn-edit-pago').forEach(b => b.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      await editPago(id);
    }));

    document.querySelectorAll('.btn-delete-pago').forEach(b => b.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      if (!confirm('¿Eliminar pago?')) return;
      await deletePago(id);
    }));

    addLog(`✅ ${items.length} pago(s) cargado(s)`, 'success');
  } catch (err) {
    addLog(`Error de red: ${err.message}`, 'error');
    pagosList.innerHTML = `<div class="empty-state"><p>${err.message}</p></div>`;
  }
}

async function editPago(id) {
  addLog(`Obteniendo pago ${id} para edición...`, 'info');
  try {
    const res = await fetch(`${API_BASE}/pagos/${id}`);
    const r = await res.json();
    if (!res.ok) { addLog(`Error: ${r.message}`, 'error'); return; }
    const p = r.data;
    document.getElementById('id_pago').value = p.id_pago || '';
    document.getElementById('id_venta_pago').value = p.id_venta || '';
    document.getElementById('monto').value = p.monto || '';
    document.getElementById('metodo_pago').value = p.metodo_pago || '';
    addLog('Formulario cargado para edición', 'success');
  } catch (err) { addLog(err.message, 'error'); }
}

async function deletePago(id) {
  addLog(`Eliminando pago ${id}...`, 'info');
  try {
    const res = await fetch(`${API_BASE}/pagos/${id}`, { method: 'DELETE' });
    const r = await res.json();
    if (!res.ok) { addLog(`Error: ${r.message}`, 'error'); return; }
    addLog('Pago eliminado', 'success');
    await loadPagos();
  } catch (err) { addLog(err.message, 'error'); }
}

pagoForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('id_pago').value;
  const payload = {
    id_venta: parseInt(document.getElementById('id_venta_pago').value),
    monto: parseFloat(document.getElementById('monto').value),
    metodo_pago: document.getElementById('metodo_pago').value
  };

  try {
    if (id) {
      addLog(`Actualizando pago ${id}...`, 'info');
      const res = await fetch(`${API_BASE}/pagos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const r = await res.json();
      if (!res.ok) { addLog(`Error: ${r.message}`, 'error'); return; }
      addLog('Pago actualizado', 'success');
    } else {
      addLog('Creando pago...', 'info');
      const res = await fetch(`${API_BASE}/pagos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const r = await res.json();
      if (!res.ok) { addLog(`Error: ${r.message}`, 'error'); return; }
      addLog('Pago creado', 'success');
    }
    clearFormPago();
    await loadPagos();
  } catch (err) { addLog(err.message, 'error'); }
});

document.getElementById('clearPagoBtn').addEventListener('click', () => clearFormPago());
document.getElementById('reloadPagosBtn').addEventListener('click', () => loadPagos());

// ============================================
// INIT
// ============================================

window.addEventListener('load', () => {
  addLog('Interfaz Ventas/Pagos cargada', 'info');
  loadVentas();
  loadPagos();
});
