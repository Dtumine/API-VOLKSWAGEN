# 📡 Ejemplos de Uso de la API

## 🔗 Endpoints Disponibles

### 1. Verificar Conexión (GET)

**Endpoint:**
```
GET http://localhost:3000/api/status
```

**Con JavaScript (Fetch):**
```javascript
fetch('http://localhost:3000/api/status')
  .then(res => res.json())
  .then(data => console.log(data));
```

**Con cURL:**
```bash
curl http://localhost:3000/api/status
```

**Respuesta exitosa:**
```json
{
  "status": "success",
  "message": "Conexión exitosa con Supabase",
  "timestamp": "2024-02-18T10:30:00.000Z"
}
```

---

### 2. Obtener Todos los Datos (GET)

**Endpoint:**
```
GET http://localhost:3000/api/data
```

**Con JavaScript:**
```javascript
fetch('http://localhost:3000/api/data')
  .then(res => res.json())
  .then(data => {
    console.log('Datos:', data.data);
  })
  .catch(err => console.error('Error:', err));
```

**Con cURL:**
```bash
curl http://localhost:3000/api/data
```

**Respuesta:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "title": "Mi primer registro",
      "description": "Esta es una descripción",
      "created_at": "2024-02-18T10:20:00.000Z"
    },
    {
      "id": 2,
      "title": "Segundo registro",
      "description": "Otra descripción",
      "created_at": "2024-02-18T10:25:00.000Z"
    }
  ]
}
```

---

### 3. Crear un Nuevo Registro (POST)

**Endpoint:**
```
POST http://localhost:3000/api/data
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "title": "Mi nuevo registro",
  "description": "Esta es la descripción del registro"
}
```

**Con JavaScript (Fetch):**
```javascript
const newData = {
  title: "Nuevo título",
  description: "Nueva descripción"
};

fetch('http://localhost:3000/api/data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(newData)
})
  .then(res => res.json())
  .then(data => {
    console.log('Registro creado:', data.data);
  })
  .catch(err => console.error('Error:', err));
```

**Con cURL:**
```bash
curl -X POST http://localhost:3000/api/data \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mi nuevo registro",
    "description": "Esta es la descripción"
  }'
```

**Con PowerShell:**
```powershell
$body = @{
    title = "Mi nuevo registro"
    description = "Esta es la descripción"
} | ConvertTo-Json

Invoke-WebRequest -Uri 'http://localhost:3000/api/data' `
  -Method POST `
  -Headers @{ 'Content-Type' = 'application/json' } `
  -Body $body
```

**Respuesta exitosa:**
```json
{
  "status": "success",
  "message": "Registro creado exitosamente",
  "data": {
    "id": 3,
    "title": "Mi nuevo registro",
    "description": "Esta es la descripción del registro",
    "created_at": "2024-02-18T10:35:00.000Z"
  }
}
```

---

## 🛠️ Códigos de Estado HTTP

| Código | Significado | Ejemplo |
|--------|-------------|---------|
| 200 | OK - Éxito en GET | Datos obtenidos correctamente |
| 201 | Created - Registro creado | POST exitoso |
| 400 | Bad Request - Error en datos | Falta algún campo requerido |
| 500 | Internal Server Error | Error en la API o conexión |

---

## ⚠️ Respuestas de Error

### Error de configuración:
```json
{
  "status": "error",
  "message": "Configuración de Supabase incompleta",
  "details": "Faltan variables de entorno: SUPABASE_URL y/o SUPABASE_KEY"
}
```

### Error de conexión a Supabase:
```json
{
  "status": "error",
  "message": "Error al conectar con Supabase",
  "details": "relation \"información\" does not exist"
}
```

### Error de validación:
```json
{
  "status": "error",
  "message": "Los campos title y description son requeridos"
}
```

---

## 🧪 Pruebas Rápidas

### Con Postman

1. Descarga [Postman](https://www.postman.com/)
2. Crea una nueva carpeta llamada "API Supabase"
3. Añade las 3 peticiones anteriores
4. Prueba cada endpoint

### Con Thunder Client (extensión VS Code)

1. Instala la extensión "Thunder Client"
2. Click en el icono de Thunder Client
3. Crea una nueva petición
4. Prueba los endpoints

### Con curl en Terminal

```bash
# Verificar conexión
curl http://localhost:3000/api/status

# Obtener datos
curl http://localhost:3000/api/data

# Crear registro
curl -X POST http://localhost:3000/api/data \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"Test description"}'
```

---

## 💡 Tips y Trucos

1. **Verificar que el servidor está corriendo:**
   ```bash
   curl http://localhost:3000/api/status
   ```

2. **Ver los logs del servidor:**
   - El servidor muestra logs en la terminal donde lo ejecutaste

3. **Debuggear la API:**
   - Abre el navegador en http://localhost:3000/api/data
   - Verás la respuesta JSON

4. **Reiniciar el servidor:**
   - Presiona Ctrl+C en la terminal
   - Ejecuta `npm start` nuevamente

---

## 📚 Recursos

- [Documentación de Supabase](https://supabase.com/docs)
- [Documentación de Express](https://expressjs.com/)
- [MDN - Fetch API](https://developer.mozilla.org/es/docs/Web/API/Fetch_API)
- [Postman Learning Center](https://learning.postman.com/)
