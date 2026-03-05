const API_VENTAS = 'https://api-ventas-jyr8.onrender.com/api/ventas';
const API_AUTOS = 'https://api-autos-kxb7.onrender.com/api/autos';
const API_EMPLEADOS = 'https://api-empleados-i8xz.onrender.com/api/empleados';
const API_CLIENTES = 'https://api-clientes-6nvx.onrender.com/api/clientes';

const ventasList = document.getElementById('ventasList');
const ventaForm = document.getElementById('ventaForm');

let ventasCache = [];

async function fetchData(url){

  try{

    const res = await fetch(url);

    if(!res.ok){
      throw new Error(`Error ${res.status}`);
    }

    const data = await res.json();

    return data.data || [];

  }catch(err){

    console.error("Error cargando:", url, err.message);
    return [];

  }

}

async function loadSelectOptions(url, selectId, labelField){

  const select = document.getElementById(selectId);
  const items = await fetchData(url);

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
    hiddenAutoInput.value = '';
    return;

  }

  const autos = await fetchData(API_AUTOS);
  const auto = autos.find(a=>a.id_cliente == idCliente);

  if(!auto){

    autoBox.innerHTML = 'Cliente sin auto';
    hiddenAutoInput.value = '';
    return;

  }

  autoBox.innerHTML = `🚗 ${auto.modelo} - ${auto.patente}`;
  hiddenAutoInput.value = auto.id_auto;

}

async function loadVentas(){

  ventasList.innerHTML = "Cargando ventas...";

  const [ventas, autos, empleados, clientes] = await Promise.all([
    fetchData(API_VENTAS),
    fetchData(API_AUTOS),
    fetchData(API_EMPLEADOS),
    fetchData(API_CLIENTES)
  ]);

  ventasCache = ventas;

  if(!ventas.length){

    ventasList.innerHTML = "No hay ventas registradas.";
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
      <td>${v.fecha_venta ? v.fecha_venta.split('T')[0] : ''}</td>
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

  const idVenta = document.getElementById('id_venta').value;

  const payload = {

    id_cliente: parseInt(document.getElementById('id_cliente').value),
    id_auto: parseInt(document.getElementById('id_auto').value),
    id_empleado: parseInt(document.getElementById('id_empleado').value),
    fecha_venta: document.getElementById('fecha_venta').value,
    total: parseFloat(document.getElementById('total').value),
    anulada: document.getElementById('anulada').value === 'true'

  };

  try{

    const url = idVenta ? `${API_VENTAS}/${idVenta}` : API_VENTAS;
    const method = idVenta ? 'PUT' : 'POST';

    const res = await fetch(url,{
      method: method,
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });

    if(!res.ok){
      throw new Error(`Error ${res.status}`);
    }

    ventaForm.reset();
    document.getElementById('id_venta').value = '';

    loadVentas();

  }catch(err){

    console.error("Error guardando venta:", err.message);
    alert("Error al guardar la venta.");

  }

});

async function deleteVenta(id){

  if(!confirm("¿Seguro que desea eliminar la venta?")) return;

  try{

    await fetch(`${API_VENTAS}/${id}`,{
      method:'DELETE'
    });

    loadVentas();

  }catch(err){

    console.error("Error eliminando venta:", err);

  }

}

function editVenta(id){

  const v = ventasCache.find(v => v.id_venta == id);

  if(!v) return;

  document.getElementById('id_venta').value = v.id_venta;
  document.getElementById('id_cliente').value = v.id_cliente;
  document.getElementById('id_empleado').value = v.id_empleado;
  document.getElementById('fecha_venta').value = v.fecha_venta.split('T')[0];
  document.getElementById('total').value = v.total;
  document.getElementById('anulada').value = v.anulada ? 'true' : 'false';

  loadAutoByCliente(v.id_cliente);

  window.scrollTo({top:0, behavior:'smooth'});

}

function cancelEdit(){

  ventaForm.reset();
  document.getElementById('id_venta').value = '';

}

window.addEventListener('load', async()=>{

  await loadSelectOptions(API_CLIENTES,'id_cliente','nombre');
  await loadSelectOptions(API_EMPLEADOS,'id_empleado','nombre');

  document.getElementById('id_cliente').addEventListener('change', e=>{
    loadAutoByCliente(e.target.value);
  });

  loadVentas();

});