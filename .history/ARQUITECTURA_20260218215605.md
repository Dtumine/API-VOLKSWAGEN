# 🏗️ Arquitectura del Proyecto

## Flujo General

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│              (HTML + CSS + JavaScript)                       │
│           ┌──────────────────────┐                           │
│           │  - index.html        │                           │
│           │  - style.css         │                           │
│           │  - app.js            │                           │
│           └──────────────────────┘                           │
│                        ↓                                     │
│              Llamadas HTTP (Fetch)                           │
│                        ↓                                     │
└─────────────────────────────────────────────────────────────┘
              │
              │ HTTP Requests
              ▼
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND - API REST                      │
│              (Node.js + Express + Supabase)                  │
│           ┌──────────────────────┐                           │
│           │    Express Server    │                           │
│           │   (server.js)        │                           │
│           │                      │                           │
│           │  GET  /api/status    │                           │
│           │  GET  /api/data      │                           │
│           │  POST /api/data      │                           │
│           └──────────────────────┘                           │
│                        ↓                                     │
│        Supabase JavaScript Client                           │
│                        ↓                                     │
└─────────────────────────────────────────────────────────────┘
              │
              │ SQL Queries
              ▼
┌─────────────────────────────────────────────────────────────┐
│                      BASE DE DATOS                           │
│           (Supabase - PostgreSQL en la nube)                │
│           ┌──────────────────────┐                           │
│           │  Tabla: información  │                           │
│           │  - id                │                           │
│           │  - title             │                           │
│           │  - description       │                           │
│           │  - created_at        │                           │
│           └──────────────────────┘                           │
└─────────────────────────────────────────────────────────────┘
```

---

## Componentes

### 1. Frontend (Cliente)

**Ubicación:** `/frontend/`

**Archivos:**
- `index.html` - Estructura HTML
- `style.css` - Estilos visuales
- `app.js` - Lógica del cliente

**Responsabilidades:**
- Mostrar interfaz al usuario
- Capturar eventos (clicks, envíos de formulario)
- Hacer peticiones HTTP a la API
- Mostrar resultados y errores
- Mantener logs de actividades

**Funciones principales:**
```javascript
checkConnection()    // Verifica la conexión a la API
loadData()           // Carga datos de la BD
createData()         // Crea nuevos registros
updateStatus()       // Actualiza el estado visual
addLog()             // Registra actividades
```

---

### 2. Backend (Servidor)

**Ubicación:** `/backend/`

**Archivos:**
- `server.js` - Servidor Express
- `package.json` - Dependencias
- `.env` - Variables de entorno (configuración)

**Responsabilidades:**
- Recibir peticiones HTTP del frontend
- Conectarse a Supabase
- Ejecutar operaciones en la base de datos
- Devolver respuestas JSON
- Manejar errores

**Endpoints:**

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/status` | Verifica conexión con Supabase |
| GET | `/api/data` | Obtiene todos los registros |
| POST | `/api/data` | Crea un nuevo registro |

---

### 3. Base de Datos (Supabase)

**Tipo:** PostgreSQL (en la nube)

**Tabla: `información`**
```sql
id (BIGSERIAL) - Identificador único
title (VARCHAR) - Título del registro
description (TEXT) - Descripción
created_at (TIMESTAMP) - Fecha de creación
```

**Configuración RLS (Row Level Security):**
- **SELECT:** Permitido públicamente
- **INSERT:** Permitido públicamente
- **UPDATE:** No habilitado
- **DELETE:** No habilitado

---

## Flujo de Datos

### Flujo 1: Verificar Conexión

```
Usuario hace click en "Verificar de nuevo"
         ↓
   app.js: checkConnection()
         ↓
   Fetch a GET /api/status
         ↓
   server.js recibe la petición
         ↓
   Intenta conectar con Supabase
         ↓
   Envía respuesta JSON
         ↓
   app.js procesa respuesta
         ↓
   Actualiza UI (verde ✅ o rojo ❌)
         ↓
   Añade log de la acción
```

### Flujo 2: Crear Registro

```
Usuario completa formulario y hace click "Guardar"
         ↓
   app.js: createData()
         ↓
   Valida que los campos no estén vacíos
         ↓
   Fetch POST /api/data con datos
         ↓
   server.js recibe JSON con title y description
         ↓
   Valida los datos
         ↓
   Supabase inserta en tabla "información"
         ↓
   Devuelve datos insertados
         ↓
   app.js muestra toast "Registro creado"
         ↓
   Recarga automáticamente la lista de datos
         ↓
   Limpia el formulario
```

### Flujo 3: Cargar Datos

```
Usuario hace click en "Cargar datos"
         ↓
   app.js: loadData()
         ↓
   Fetch GET /api/data
         ↓
   server.js consulta a Supabase
         ↓
   Supabase retorna todos los registros
         ↓
   app.js recibe array de datos
         ↓
   Crea elementos HTML para cada registro
         ↓
   Muestra en la página
         ↓
   Registra en logs
```

---

## Manejo de Errores

### Posibles Errores

1. **No se instalan dependencias**
   - Error: `Cannot find module 'express'`
   - Solución: `npm install`

2. **Credenciales de Supabase incorrectas**
   - Error: Conexión fallida
   - Solución: Verificar `.env`

3. **Tabla no existe**
   - Error: `relation "información" does not exist`
   - Solución: Crear la tabla en Supabase

4. **CORS error**
   - Error: Browser bloquea la petición
   - Solución: Backend tiene CORS habilitado

5. **API no responde**
   - Error: Timeout o "Cannot reach server"
   - Solución: Verificar que el servidor está corriendo

---

## Seguridad

### Implementado

✅ **CORS:** Solo acepta peticiones válidas
✅ **Validación:** Verifica que los datos sean válidos
✅ **Variables de entorno:** Credenciales no en código
✅ **RLS en Supabase:** Políticas de acceso a datos
✅ **Manejo de errores:** No expone detalles sensibles

### No implementado (Futuros mejoras)

- [ ] Autenticación de usuarios
- [ ] Tokens JWT
- [ ] Rate limiting
- [ ] Encriptación de datos sensibles
- [ ] Logging de accesos
- [ ] API Keys para frontend

---

## Tecnologías y Versiones

| Tecnología | Versión | Propósito |
|------------|---------|----------|
| Node.js | ≥ 14 | Runtime JavaScript |
| Express | ^4.18.2 | Framework backend |
| Supabase JS | ^2.38.4 | Cliente para Supabase |
| CORS | ^2.8.5 | Permitir peticiones cross-origin |
| dotenv | ^16.4.5 | Variables de entorno |

---

## Notas Importantes

1. **El frontend necesita que el backend esté corriendo** en `localhost:3000`

2. **Las credenciales de Supabase** se guardan en `.env` (NO se versionan)

3. **Los datos se almacenan en la nube** de Supabase, no localmente

4. **Cada usuario comparte la misma base de datos** (no hay aislamiento por usuario)

5. **Las peticiones son asincrónicas** (el UI no se congela mientras se cargan datos)
