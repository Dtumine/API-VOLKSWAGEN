const API_VENTAS = 'https://api-ventas-jyr8.onrender.com';
const API_AUTOS = 'https://api-autos-kxb7.onrender.com/api/autos';
const API_EMPLEADOS = 'https://api-empleados-i8xz.onrender.com/api/empleados';
const API_CLIENTES = 'https://api-clientes-6nvx.onrender.com/api/clientes';

const ventasList = document.getElementById('ventasList');
const ventaForm = document.getElementById('ventaForm');

async function loadSelectOptions(url, selectId, labelField){
  const select = document.getElementById(selectId);
  const res = await fetch(url);
  const data = await res.json();
  const items = data.data || [];

  select.innerHTML = '<option value="">Seleccione...</option>';

  items.forEach(item=>{
    const opt = document.createElement('option');
    opt.value = item.id_cliente || item.id_empleado;
    opt.textContent = `${opt.value} - ${item[labelField]}`;
    select.appendChild(opt);
  });
}

async function loadAutoByCliente(idCliente){

  const autoBox = document.getElementById('auto_info');
  const hiddenAutoInput = document.getElementById('id_auto');

  if(!idCliente){
    autoBox.innerHTML = 'Seleccione un cliente...';
    return;
  }

  const res = await fetch(API_AUTOS);
  const data = await res.json();
  const autos = data.data || [];

  const auto = autos.find(a=>a.id_cliente == idCliente);

  if(!auto){
    autoBox.innerHTML = 'Cliente sin auto';
    return;
  }

  autoBox.innerHTML = `🚗 ${auto.modelo} - ${auto.patente}`;
  hiddenAutoInput.value = auto.id_auto;
}

async function loadVentas(){

  const [venRes, autoRes, empRes, cliRes] = await Promise.all([
    fetch(API_VENTAS),
    fetch(API_AUTOS),
    fetch(API_EMPLEADOS),
    fetch(API_CLIENTES)
  ]);

  const ventas = (await venRes.json()).data || [];
  const autos = (await autoRes.json()).data || [];
  const empleados = (await empRes.json()).data || [];
  const clientes = (await cliRes.json()).data || [];

  const table = document.createElement('table');

  table.innerHTML = `
  <thead>
    <tr>
      <th>ID</th>
      <th>Cliente</th>
      <th>Auto</th>
      <th>Empleado</th>
      <th>Fecha</th>
      <th>Total</th>
      <th>Estado</th>
      <th>Acciones</th>
    </tr>
  </thead>
  <tbody></tbody>
  `;

  const tbody = table.querySelector('tbody');

  ventas.forEach(v=>{

    const auto = autos.find(a=>a.id_auto == v.id_auto);
    const cliente = clientes.find(c=>c.id_cliente == v.id_cliente);
    const empleado = empleados.find(e=>e.id_empleado == v.id_empleado);

    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${v.id_venta}</td>
      <td>${cliente?.nombre || ''}</td>
      <td>${auto?.modelo || ''}</td>
      <td>${empleado?.nombre || ''}</td>
      <td>${v.fecha_venta?.split('T')[0]}</td>
      <td>$${v.total}</td>
      <td>${v.anulada ? 'Anulada' : 'Activa'}</td>
      <td>
        <button class="btn-edit" onclick="editVenta(${v.id_venta})">Editar</button>
        <button class="btn-delete" onclick="deleteVenta(${v.id_venta})">Eliminar</button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  ventasList.innerHTML = '';
  ventasList.appendChild(table);
}

ventaForm.addEventListener('submit', async(e)=>{
  e.preventDefault();

  const payload = {
    id_cliente: parseInt(document.getElementById('id_cliente').value),
    id_auto: parseInt(document.getElementById('id_auto').value),
    id_empleado: parseInt(document.getElementById('id_empleado').value),
    fecha_venta: document.getElementById('fecha_venta').value,
    precio: parseFloat(document.getElementById('total').value),
    anulada: document.getElementById('anulada').value === 'true'
  };

  await fetch(API_VENTAS,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(payload)
  });

  ventaForm.reset();
  loadVentas();
});

window.addEventListener('load', async()=>{
  await loadSelectOptions(API_CLIENTES,'id_cliente','nombre');
  await loadSelectOptions(API_EMPLEADOS,'id_empleado','nombre');

  document.getElementById('id_cliente').addEventListener('change', e=>{
    loadAutoByCliente(e.target.value);
  });

  loadVentas();
});