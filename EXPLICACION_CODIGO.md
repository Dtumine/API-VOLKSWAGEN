# 📖 Explicación Detallada del Código

## Backend - server.js

### Imports y Configuración Inicial

```javascript
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
```

- **express:** Framework para crear servidores HTTP
- **cors:** Permite peticiones del frontend
- **@supabase/supabase-js:** Cliente para conectar con Supabase
- **dotenv:** Lee variables del archivo `.env`

---

### Middleware

```javascript
app.use(cors());
app.use(express.json());
```

- **cors():** Habilita CORS (sin esto el frontend no puede acceder)
- **express.json():** Parsea JSON en el body de las peticiones

---

### Inicialización de Supabase

```javascript
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

let supabase;
let connectionStatus = 'not-initialized';

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
  connectionStatus = 'connected';
} else {
  connectionStatus = 'error-config';
}
```

- Lee las variables de entorno
- Crea cliente de Supabase si las credenciales existen
- Mantiene estado de conexión

---

### Endpoint: GET /api/status

**Propósito:** Verificar si la conexión con Supabase funciona

```javascript
app.get('/api/status', async (req, res) => {
  try {
    // 1. Verificar que hay configuración
    if (connectionStatus === 'error-config') {
      return res.status(500).json({
        status: 'error',
        message: 'Configuración de Supabase incompleta'
      });
    }

    // 2. Hacer una consulta simple a Supabase
    const { data, error } = await supabase
      .from('información')
      .select('*')
      .limit(1);
    
    // 3. Si hay error, retornar error
    if (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Error al conectar con Supabase',
        details: error.message
      });
    }

    // 4. Éxito
    res.json({
      status: 'success',
      message: 'Conexión exitosa con Supabase',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    // Captura cualquier otro error
    res.status(500).json({
      status: 'error',
      message: 'Error en el servidor',
      details: error.message
    });
  }
});
```

**Flujo:**
1. Usuario hace GET request a `/api/status`
2. Servidor verifica credenciales
3. Intenta consultar Supabase (SELECT * LIMIT 1)
4. Si funciona → responde con `status: 'success'`
5. Si no funciona → responde con `status: 'error'`

---

### Endpoint: GET /api/data

**Propósito:** Obtener todos los registros

```javascript
app.get('/api/data', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('información')
      .select('*');
    
    if (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Error al obtener datos',
        details: error.message
      });
    }

    res.json({
      status: 'success',
      data: data || []
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error en el servidor',
      details: error.message
    });
  }
});
```

**Flujo:**
1. Consulta: `SELECT * FROM información`
2. Retorna array de registros
3. Si no hay registros → retorna array vacío `[]`

---

### Endpoint: POST /api/data

**Propósito:** Crear un nuevo registro

```javascript
app.post('/api/data', async (req, res) => {
  try {
    // 1. Extraer datos del body
    const { title, description } = req.body;

    // 2. Validar que existan
    if (!title || !description) {
      return res.status(400).json({
        status: 'error',
        message: 'Los campos title y description son requeridos'
      });
    }

    // 3. Insertar en Supabase
    const { data, error } = await supabase
      .from('información')
      .insert([
        {
          title: title,
          description: description,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    // 4. Verificar errores
    if (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Error al crear registro',
        details: error.message
      });
    }

    // 5. Retornar éxito
    res.status(201).json({
      status: 'success',
      message: 'Registro creado exitosamente',
      data: data[0]
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error en el servidor',
      details: error.message
    });
  }
});
```

**Flujo:**
1. Extrae `title` y `description` del JSON body
2. Valida que no estén vacíos (línea de seguridad)
3. Inserta en Supabase con timestamp actual
4. Retorna el registro creado (status 201)

---

## Frontend - app.js

### Funciones Principales

#### 1. `checkConnection()`

```javascript
async function checkConnection() {
  try {
    // 1. Actualizar UI a estado "cargando"
    updateStatus('loading', 'Verificando...', 'Conectando...');
    addLog('Iniciando verificación...', 'info');

    // 2. Hacer petición GET
    const response = await fetch(`${API_URL}/status`);
    const data = await response.json();

    // 3. Si es exitosa
    if (response.ok && data.status === 'success') {
      updateStatus('success', '✅ Conexión Exitosa', 
        '¡Todo funciona!', 'La API está conectada');
      addLog('✅ Conexión exitosa', 'success');
      showToast('Verificado correctamente', 'success');
    } else {
      // Falló la conexión
      updateStatus('error', '❌ Error', 
        data.message, data.details);
      addLog(`❌ Error: ${data.message}`, 'error');
    }
  } catch (error) {
    // Error de red (API no disponible)
    updateStatus('error', '❌ Error', 
      'No se puede alcanzar la API', error.message);
  }
}
```

**Flujo del usuario:**
1. Clic en "Verificar de nuevo"
2. UI muestra spinner ⏳
3. Se envía petición a `/api/status`
4. Se espera respuesta (await)
5. Se actualiza UI con resultado (✅ o ❌)

---

#### 2. `loadData()`

```javascript
async function loadData() {
  try {
    addLog('Cargando datos...', 'info');
    const btn = document.getElementById('loadDataBtn');
    btn.disabled = true;
    btn.textContent = '⏳ Cargando...';

    // Petición GET
    const response = await fetch(`${API_URL}/data`);
    const result = await response.json();

    const dataList = document.getElementById('dataList');
    dataList.innerHTML = '';

    if (response.ok && result.status === 'success') {
      const data = result.data || [];
      
      if (data.length === 0) {
        // Si no hay datos
        dataList.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon">📭</div>
            <p>No hay datos</p>
          </div>
        `;
      } else {
        // Crear elemento para cada registro
        data.forEach((item) => {
          const itemDiv = document.createElement('div');
          itemDiv.className = 'data-item';
          itemDiv.innerHTML = `
            <h4>${item.title}</h4>
            <p>${item.description}</p>
            <p><small>📅 ${new Date(item.created_at).toLocaleString()}</small></p>
          `;
          dataList.appendChild(itemDiv);
        });
      }
    }
  } catch (error) {
    // Mostrar error
    document.getElementById('dataList').innerHTML = 
      `<div class="empty-state"><p>Error: ${error.message}</p></div>`;
  } finally {
    // Siempre: deshabilitar botón
    const btn = document.getElementById('loadDataBtn');
    btn.disabled = false;
    btn.textContent = '📋 Cargar datos';
  }
}
```

**Flujo:**
1. Desactiva botón (evita clics múltiples)
2. Petición GET a `/api/data`
3. Itera sobre los datos recibidos
4. Crea elementos HTML dinámicamente
5. Inserta en la página
6. Reactiva el botón

---

#### 3. `createData(event)`

```javascript
async function createData(event) {
  // Evita recargar la página
  event.preventDefault();

  // Obtener valores del formulario
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;

  // Validar
  if (!title.trim() || !description.trim()) {
    showToast('Completa todos los campos', 'error');
    return;
  }

  try {
    // Petición POST
    const response = await fetch(`${API_URL}/data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: title.trim(),
        description: description.trim()
      })
    });

    const result = await response.json();

    if (response.ok && result.status === 'success') {
      showToast('Registro creado', 'success');
      document.getElementById('dataForm').reset();
      loadData(); // Recargar lista
    } else {
      showToast(`Error: ${result.message}`, 'error');
    }
  } catch (error) {
    showToast(`Error: ${error.message}`, 'error');
  }
}
```

**Flujo:**
1. Usuario llena formulario y hace clic "Guardar"
2. `event.preventDefault()` evita recargar página
3. Valida que campos no estén vacíos
4. Envía POST con JSON
5. Si es exitoso:
   - Muestra mensaje ✅
   - Limpia formulario
   - Recarga datos automáticamente
6. Si hay error: muestra mensaje ❌

---

### Funciones Auxiliares

#### `updateStatus(status, title, message, details)`
Actualiza el indicador visual de estado:
```javascript
function updateStatus(status, title, message, details = '') {
  statusIndicator.className = `status-indicator ${status}`;
  statusTitle.textContent = title;
  statusMessage.textContent = message;
  statusDetails.textContent = details;
}
```

**Estados posibles:**
- `'loading'` → UI en espera
- `'success'` → Verde con ✓
- `'error'` → Rojo con ✕

---

#### `addLog(message, type)`
Registra acciones en la consola HTML:
```javascript
function addLog(message, type = 'info') {
  const time = new Date().toLocaleTimeString();
  const logEntry = document.createElement('div');
  logEntry.className = `log-entry log-${type}`;
  logEntry.innerHTML = `<span class="log-time">[${time}]</span> ${message}`;
  logsContainer.appendChild(logEntry);
}
```

**Tipos:**
- `'success'` → Verde
- `'error'` → Rojo
- `'warning'` → Naranja
- `'info'` → Azul

---

#### `showToast(message, type)`
Notificación flotante:
```javascript
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  // Desaparece después de 3 segundos
  setTimeout(() => toast.remove(), 3000);
}
```

---

### Event Listeners

```javascript
// Cuando se envía el formulario
document.getElementById('dataForm')
  .addEventListener('submit', createData);

// Cuando la página carga
window.addEventListener('load', () => {
  checkConnection(); // Verificar automáticamente
});
```

---

## Flujo Completo: De Principio a Fin

### Usuario abre la página

```
index.html carga
         ↓
app.js se ejecuta
         ↓
window load event
         ↓
checkConnection() se llama
         ↓
Fetch GET /api/status
         ↓
Backend recibe GET
         ↓
Consulta SELECT * FROM información LIMIT 1
         ↓
Supabase responde OK
         ↓
Backend retorna { status: 'success' }
         ↓
Frontend actualiza UI a verde ✅
         ↓
Mostramos mensaje "Conexión Exitosa"
```

### Usuario crea un registro

```
Usuario escribe título y descripción
         ↓
Hace clic en "Guardar"
         ↓
createData() se ejecuta
         ↓
Valida que no estén vacíos
         ↓
Fetch POST /api/data con datos
         ↓
Backend recibe POST
         ↓
Valida title y description
         ↓
INSERT INTO información (title, description, created_at)
         ↓
Supabase inserta y retorna el registro con ID
         ↓
Backend retorna { status: 'success', data: {registro} }
         ↓
Frontend muestra toast ✅
         ↓
Limpia formulario
         ↓
Llama loadData()
         ↓
Actualiza lista con nuevo registro
```

---

## Puntos Clave a Recordar

1. **async/await:** Las operaciones de red son asincrónicas
2. **try/catch:** Siempre captura errores
3. **JSON:** Frontend y backend se comunican con JSON
4. **Validación:** Validar datos antes de usarlos
5. **Estados:** Mostrar al usuario qué está pasando
6. **Manejo de errores:** No dejar procesos sin finalizar
