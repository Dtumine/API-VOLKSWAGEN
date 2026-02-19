# API Clientes - Documentación

Nueva API REST que gestiona la tabla **"clientes"** en Supabase.

---

## 🚀 Inicio Rápido

### 1️⃣ Crear la tabla en Supabase

Ver: [SQL_CLIENTES.md](SQL_CLIENTES.md)

Ejecuta el SQL para crear la tabla "clientes"

---

### 2️⃣ Iniciar la API

En terminal (carpeta `backend`):

```powershell
npm start-clientes
```

Deberías ver:
```
✅ API Clientes ejecutándose en http://localhost:3030
Estado de conexión: connected
```

---

## 📡 Endpoints

### 1. Status - Verificar Conexión

```
GET http://localhost:3030/api/status
```

**Respuesta exitosa:**
```json
{
  "status": "success",
  "message": "Conexión exitosa con Supabase (Tabla clientes)",
  "timestamp": "2024-02-18T10:30:00.000Z"
}
```

---

### 2. Obtener Todos los Clientes

```
GET http://localhost:3030/api/clientes
```

**Respuesta:**
```json
{
  "status": "success",
  "total": 2,
  "data": [
    {
      "id_cliente": 1,
      "nombre": "Juan",
      "apellido": "Pérez",
      "dni": "12345678",
      "telefono": "555-1234",
      "email": "juan@example.com",
      "fecha_alta": "2024-02-18T10:00:00.000Z"
    },
    {
      "id_cliente": 2,
      "nombre": "María",
      "apellido": "García",
      "dni": "87654321",
      "telefono": "555-5678",
      "email": "maria@example.com",
      "fecha_alta": "2024-02-18T10:05:00.000Z"
    }
  ]
}
```

---

### 3. Obtener un Cliente por ID

```
GET http://localhost:3030/api/clientes/1
```

**Respuesta:**
```json
{
  "status": "success",
  "data": {
    "id_cliente": 1,
    "nombre": "Juan",
    "apellido": "Pérez",
    "dni": "12345678",
    "telefono": "555-1234",
    "email": "juan@example.com",
    "fecha_alta": "2024-02-18T10:00:00.000Z"
  }
}
```

---

### 4. Crear un Cliente (POST)

```
POST http://localhost:3030/api/clientes
Content-Type: application/json
```

**Body:**
```json
{
  "nombre": "Carlos",
  "apellido": "López",
  "dni": "11223344",
  "telefono": "555-9999",
  "email": "carlos@example.com",
  "fecha_alta": "2024-02-18T10:10:00.000Z"
}
```

**Respuesta:**
```json
{
  "status": "success",
  "message": "Cliente creado exitosamente",
  "data": {
    "id_cliente": 3,
    "nombre": "Carlos",
    "apellido": "López",
    "dni": "11223344",
    "telefono": "555-9999",
    "email": "carlos@example.com",
    "fecha_alta": "2024-02-18T10:10:00.000Z"
  }
}
```

**Campos obligatorios:**
- `nombre`
- `apellido`
- `dni`
- `email`

**Campos opcionales:**
- `telefono`
- `fecha_alta` (si no se proporciona, usa la fecha actual)

---

### 5. Actualizar un Cliente (PUT)

```
PUT http://localhost:3030/api/clientes/1
Content-Type: application/json
```

**Body:**
```json
{
  "nombre": "Juan",
  "apellido": "Pérez García",
  "dni": "12345678",
  "telefono": "555-9999",
  "email": "juan.nueva@example.com"
}
```

**Respuesta:**
```json
{
  "status": "success",
  "message": "Cliente actualizado exitosamente",
  "data": {
    "id_cliente": 1,
    "nombre": "Juan",
    "apellido": "Pérez García",
    "dni": "12345678",
    "telefono": "555-9999",
    "email": "juan.nueva@example.com"
  }
}
```

---

### 6. Eliminar un Cliente (DELETE)

```
DELETE http://localhost:3030/api/clientes/1
```

**Respuesta:**
```json
{
  "status": "success",
  "message": "Cliente eliminado exitosamente",
  "data": {
    "id_cliente": 1,
    "nombre": "Juan",
    "apellido": "Pérez",
    "dni": "12345678",
    "telefono": "555-1234",
    "email": "juan@example.com"
  }
}
```

---

## 🧪 Ejemplos con JavaScript (Fetch)

### Obtener todos los clientes

```javascript
fetch('http://localhost:3030/api/clientes')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error('Error:', err));
```

---

### Crear un cliente

```javascript
const nuevoCliente = {
  nombre: "Pedro",
  apellido: "Martínez",
  dni: "99887766",
  telefono: "555-4567",
  email: "pedro@example.com"
};

fetch('http://localhost:3030/api/clientes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(nuevoCliente)
})
  .then(res => res.json())
  .then(data => console.log('Cliente creado:', data))
  .catch(err => console.error('Error:', err));
```

---

### Obtener un cliente específico

```javascript
fetch('http://localhost:3030/api/clientes/1')
  .then(res => res.json())
  .then(data => console.log('Cliente:', data.data))
  .catch(err => console.error('Error:', err));
```

---

### Actualizar un cliente

```javascript
const datosActualizados = {
  nombre: "Juan",
  apellido: "Pérez Nuevo",
  dni: "12345678",
  telefono: "555-0000",
  email: "juan.nuevo@example.com"
};

fetch('http://localhost:3030/api/clientes/1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(datosActualizados)
})
  .then(res => res.json())
  .then(data => console.log('Cliente actualizado:', data))
  .catch(err => console.error('Error:', err));
```

---

### Eliminar un cliente

```javascript
fetch('http://localhost:3030/api/clientes/1', {
  method: 'DELETE'
})
  .then(res => res.json())
  .then(data => console.log('Cliente eliminado:', data))
  .catch(err => console.error('Error:', err));
```

---

## 🧪 Ejemplos con cURL

### Obtener todos

```bash
curl http://localhost:3030/api/clientes
```

### Obtener uno

```bash
curl http://localhost:3030/api/clientes/1
```

### Crear cliente

```bash
curl -X POST http://localhost:3030/api/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "nombre":"Pedro",
    "apellido":"Martínez",
    "dni":"99887766",
    "telefono":"555-4567",
    "email":"pedro@example.com"
  }'
```

### Actualizar cliente

```bash
curl -X PUT http://localhost:3030/api/clientes/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nombre":"Juan",
    "apellido":"Pérez García",
    "dni":"12345678",
    "telefono":"555-0000",
    "email":"juan.nuevo@example.com"
  }'
```

### Eliminar cliente

```bash
curl -X DELETE http://localhost:3030/api/clientes/1
```

---

## 📊 Respuestas de Error

### Error 400 - Datos faltantes

```json
{
  "status": "error",
  "message": "Los campos nombre, apellido, dni y email son obligatorios"
}
```

---

### Error 404 - Cliente no encontrado

```json
{
  "status": "error",
  "message": "Cliente no encontrado"
}
```

---

### Error 500 - Error del servidor

```json
{
  "status": "error",
  "message": "Error al obtener clientes",
  "details": "..."
}
```

---

## 🔍 Validaciones

### Tabla clientes

| Campo | Tipo | Validación |
|-------|------|-----------|
| id_cliente | BIGSERIAL | PK, auto-increment |
| nombre | VARCHAR(100) | Requerido |
| apellido | VARCHAR(100) | Requerido |
| dni | VARCHAR(20) | Requerido, UNIQUE |
| telefono | VARCHAR(20) | Opcional |
| email | VARCHAR(100) | Requerido, UNIQUE |
| fecha_alta | TIMESTAMP | Default: NOW() |

---

## 🚀 Ejecutar Ambas APIs Simultáneamente

Si quieres correr ambas servidores a la vez:

**Terminal 1:**
```powershell
cd backend
npm start
# Puerto 3000
```

**Terminal 2:**
```powershell
cd backend
npm start-clientes
# Puerto 3030
```

Ahora tienes:
- API original en `http://localhost:3000` (tabla "información")
- API clientes en `http://localhost:3030` (tabla "clientes")

---

## 📝 Modo Desarrollo

Para desarrollo con auto-reload (reinicia automáticamente al cambiar código):

```powershell
npm dev-clientes
```

---

## ✅ Checklist

- [ ] Tabla "clientes" creada en Supabase
- [ ] PORT_CLIENTES=3030 agregado a .env
- [ ] npm start-clientes ejecutándose
- [ ] API responde en http://localhost:3030/api/status
- [ ] Puedo enviar y recibir datos

¡Listo! 🚀
