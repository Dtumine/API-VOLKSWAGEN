// Detectar entorno
const API_AUTOS = window.location.hostname === 'localhost'
  ? 'http://localhost:3040/api'
  : 'https://TU-API-AUTOS.onrender.com/api';

const API_CLIENTES = window.location.hostname === 'localhost'
  ? 'http://localhost:3030/api'
  : 'https://TU-API-CLIENTES.onrender.com/api';

const tabla = document.getElementById("tablaAutos");
const form = document.getElementById("formAuto");
const selectCliente = document.getElementById("id_cliente");

// ==========================
// CARGAR CLIENTES SELECTOR
// ==========================
async function cargarClientes() {
  const res = await fetch(`${API_CLIENTES}/clientes`);
  const json = await res.json();

  selectCliente.innerHTML = "";

  json.data.forEach(cliente => {
    const option = document.createElement("option");
    option.value = cliente.id_cliente;
    option.textContent = `${cliente.nombre} ${cliente.apellido}`;
    selectCliente.appendChild(option);
  });
}

// ==========================
// CARGAR AUTOS
// ==========================
async function cargarAutos() {
  const res = await fetch(`${API_AUTOS}/autos`);
  const json = await res.json();

  tabla.innerHTML = "";

  json.data.forEach(auto => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${auto.id_auto}</td>
      <td>${auto.id_cliente}</td>
      <td>${auto.modelo}</td>
      <td>${auto.anio}</td>
      <td>${auto.patente}</td>
      <td>${auto.kilometraje}</td>
      <td>
        <button onclick="editarAuto(${auto.id_auto})">Editar</button>
        <button onclick="eliminarAuto(${auto.id_auto})">Eliminar</button>
      </td>
    `;

    tabla.appendChild(tr);
  });
}

// ==========================
// GUARDAR AUTO
// ==========================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("id_auto").value;

  const auto = {
    id_cliente: selectCliente.value,
    modelo: document.getElementById("modelo").value,
    anio: document.getElementById("anio").value,
    patente: document.getElementById("patente").value,
    kilometraje: document.getElementById("kilometraje").value
  };

  if (id) {
    await fetch(`${API_AUTOS}/autos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(auto)
    });
  } else {
    await fetch(`${API_AUTOS}/autos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(auto)
    });
  }

  form.reset();
  cargarAutos();
});

// ==========================
// EDITAR
// ==========================
async function editarAuto(id) {
  const res = await fetch(`${API_AUTOS}/autos/${id}`);
  const json = await res.json();
  const auto = json.data;

  document.getElementById("id_auto").value = auto.id_auto;
  selectCliente.value = auto.id_cliente;
  document.getElementById("modelo").value = auto.modelo;
  document.getElementById("anio").value = auto.anio;
  document.getElementById("patente").value = auto.patente;
  document.getElementById("kilometraje").value = auto.kilometraje;
}

// ==========================
// ELIMINAR
// ==========================
async function eliminarAuto(id) {
  await fetch(`${API_AUTOS}/autos/${id}`, {
    method: "DELETE"
  });

  cargarAutos();
}

// ==========================
// INICIALIZAR
// ==========================
cargarClientes();
cargarAutos();