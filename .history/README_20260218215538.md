# Sistema de Conexión API REST + Supabase

Un proyecto completo que incluye una API REST en Node.js/Express y un frontend HTML+CSS+JS para verificar la conexión a Supabase.

## 📁 Estructura del Proyecto

```
clase1/
├── backend/
│   ├── server.js          # Servidor Express principal
│   ├── package.json       # Dependencias del proyecto
│   ├── .env              # Variables de entorno (configurar primero)
│   └── .env.example      # Plantilla de variables de entorno
└── frontend/
    ├── index.html        # Página principal
    ├── style.css         # Estilos
    └── app.js            # Código JavaScript del cliente
```

## 🚀 Instalación y Configuración

### Requisitos previos
- Node.js v14 o superior
- Una cuenta en [Supabase](https://supabase.com)
- npm o yarn

### Paso 1: Obtener las credenciales de Supabase

1. Ve a [Supabase](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. En el menú, ve a **Settings** > **API**
4. Copia:
   - **Project URL** (ejemplo: `https://tu-proyecto.supabase.co`)
   - **Public Key** (la clave apikey)

### Paso 2: Crear una tabla en Supabase

1. En Supabase, ve a **SQL Editor**
2. Ejecuta este SQL para crear la tabla:

```sql
CREATE TABLE información (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Habilitar RLS (Row Level Security) - opcional pero recomendado
ALTER TABLE información ENABLE ROW LEVEL SECURITY;

-- Política de lectura
CREATE POLICY "Allow public read" ON información
  FOR SELECT USING (true);

-- Política de inserción
CREATE POLICY "Allow public insert" ON información
  FOR INSERT WITH CHECK (true);
```

### Paso 3: Configurar el Backend

1. Abre una terminal en la carpeta `backend`:
   ```bash
   cd backend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Edita el archivo `.env` con tus credenciales de Supabase:
   ```
   SUPABASE_URL=https://tu-proyecto.supabase.co
   SUPABASE_KEY=tu-clave-publica-aqui
   PORT=3000
   ```

4. Inicia el servidor:
   ```bash
   npm start
   ```
   
   Para desarrollo con auto-reload:
   ```bash
   npm run dev
   ```

   Deberías ver: ✅ Servidor ejecutándose en http://localhost:3000

### Paso 4: Abrir el Frontend

1. Abre el archivo `frontend/index.html` en tu navegador
   - Opción 1: Haz doble clic en el archivo
   - Opción 2: Usa una extensión como "Live Server" en VS Code
   - Opción 3: Navega a `file:///ruta/al/frontend/index.html`

## 📝 Características

### API REST Endpoints

#### 1. **GET /api/status** - Verificar conexión
Verifica que el servidor esté conectado a Supabase.

**Response (éxito):**
```json
{
  "status": "success",
  "message": "Conexión exitosa con Supabase",
  "timestamp": "2024-02-18T10:30:00.000Z"
}
```

**Response (error):**
```json
{
  "status": "error",
  "message": "Error al conectar con Supabase",
  "details": "..."
}
```

#### 2. **GET /api/data** - Obtener todos los datos
Recupera todos los registros de la tabla.

#### 3. **POST /api/data** - Crear un registro
Inserta un nuevo registro en la base de datos.

**Body requerido:**
```json
{
  "title": "Tu título",
  "description": "Tu descripción"
}
```

### Frontend Características

✅ **Verificación de Conexión**: Chequea el estado de la API automáticamente
📋 **Listar Datos**: Carga y muestra todos los registros
➕ **Crear Registros**: Formulario para insertar nuevos datos
📊 **Sistema de Logs**: Registro de todas las acciones
🎨 **Interfaz Moderna**: Diseño responsive y atractivo
⚡ **Manejo de Errores**: Mensajes claros para los usuarios

## 🔧 Solución de Problemas

### "Cannot find module '@supabase/supabase-js'"
```bash
npm install @supabase/supabase-js
```

### "CORS error" o "Cannot reach API"
- Asegúrate que el servidor está ejecutándose en `http://localhost:3000`
- Verifica que el puerto 3000 no esté en uso
- Reinicia el servidor

### "Error: Configuración de Supabase incompleta"
- Verifica que el archivo `.env` tenga las credenciales correctas
- Copia el archivo `.env.example` y complétalo con tus datos
- Reinicia el servidor después de cambiar `.env`

### "Table 'información' not found"
- Asegúrate de haber creado la tabla en Supabase
- Verifica que el nombre es exactamente "información"
- Las políticas RLS deben permitir SELECT e INSERT

## 📚 Tecnologías Utilizadas

- **Backend**: Node.js, Express, Supabase JS Client
- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Base de Datos**: Supabase (PostgreSQL)
- **Otras**: CORS, dotenv

## 🎓 Notas para Aprender

1. **CORS**: La API permite solicitudes desde el frontend usando CORS
2. **Variables de Entorno**: Las credenciales se protegen usando `.env`
3. **Async/Await**: El frontend usa JavaScript moderno para llamadas HTTP
4. **REST API**: El servidor expone endpoints para CRUD básico
5. **Supabase**: Base de datos como servicio con RLS

## 📄 Licencia

Este proyecto es de uso educativo.

## 👨‍💻 Autor

Creado como parte de un curso de Node.js y APIs REST.
