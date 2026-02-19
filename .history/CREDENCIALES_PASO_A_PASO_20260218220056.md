# 🔑 Guía Paso a Paso: Cómo Agregar Credenciales de Supabase

## Paso 1: Obtener tus Credenciales de Supabase

### 1.1 Crea una cuenta en Supabase

```
🌐 Ve a: https://supabase.com
```

- Haz clic en "Sign Up"
- Usa tu email o GitHub
- Confirma tu email

---

### 1.2 Crea un nuevo proyecto

```
1. Dashboard > New Project
2. Dale un nombre (ej: "api-rest-clase")
3. Selecciona región más cercana
4. Crea password para la BD
5. Espera a que se cree (~2 minutos)
```

---

### 1.3 Obtén el SUPABASE_URL

```
1. En tu proyecto, ve al menú de la izquierda
2. Click en "Settings" ⚙️
3. Click en "API"
4. Busca la sección "Project URL"

Verás algo como:
    https://xyzabc123.supabase.co
    
👉 COPIA esta URL completa
```

**Ejemplo real:**
```
https://ejemplo-proyecto-abc123.supabase.co
```

---

### 1.4 Obtén el SUPABASE_KEY (anon public key)

```
En la misma página de Settings > API, busca:
    
    "anon (public)"
    
Debajo verás una clave larga como:
    
    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
    
👉 COPIA esta clave completa
```

**Ejemplo real:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMzc5MjAwMCwiZXhwIjoyMDIzNzkyMDAwfQ.abc123xyz...
```

---

## Paso 2: Crear la Tabla en Supabase (IMPORTANTE)

Sin la tabla, la conexión fallará.

### 2.1 Abre SQL Editor

```
1. En Supabase, ve a "SQL Editor" 
2. Click en "+ New Query"
```

---

### 2.2 Copia y ejecuta este SQL

```sql
CREATE TABLE información (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE información ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON información
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert" ON información
  FOR INSERT WITH CHECK (true);
```

---

### 2.3 Ejecuta la consulta

```
1. Pega el código en el editor
2. Click en "Run" (botón azul)
3. Espera a que termine
4. Deberías ver: "Success: 0 rows affected"
```

---

## Paso 3: Editar el archivo .env

Este es el **ARCHIVO MÁS IMPORTANTE** para testery la conexión.

### 3.1 Ubicación exacta del archivo

```
📂 Tu carpeta del proyecto
  📂 backend
    📄 .env  👈 ESTE ARCHIVO
    📄 server.js
    📄 package.json
```

### 3.2 Abre el archivo `.env`

En VS Code:
```
1. Abre la carpeta "backend"
2. Busca el archivo ".env"
3. Haz doble clic para abrirlo
```

**Contenido actual (vacío o con placeholder):**
```
# Supabase Configuration
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-clave-publica-aqui

# Server
PORT=3000
```

---

### 3.3 Reemplaza los valores

**ANTES (como está ahora):**
```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-clave-publica-aqui
```

**DESPUÉS (con TUS valores):**
```env
SUPABASE_URL=https://xyzabc123.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### 3.4 Ejemplo REAL paso a paso

**Tu URL de Supabase:** `https://mi-proyecto-clase.supabase.co`
**Tu clave:** `eyJhbGciOiJIUzI1Ni...`

**Archivo `.env` debe quedar así:**

```env
# Supabase Configuration
SUPABASE_URL=https://mi-proyecto-clase.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1Ni...

# Server
PORT=3000
```

---

### 3.5 Guarda el archivo

```
Ctrl+S (en Windows)
```

**Resultado:** ✅ El archivo se guarda automáticamente

---

## Paso 4: Instalar Dependencias

En PowerShell (Terminal), ubicado en carpeta `backend`:

```powershell
cd backend
npm install
```

Esto instalará:
- express
- @supabase/supabase-js
- cors
- dotenv

**Espera a que termine** (~1 minuto)

---

## Paso 5: Iniciar el Servidor

Desde la carpeta `backend`:

```powershell
npm start
```

**Resultado esperado en la terminal:**
```
✅ Servidor ejecutándose en http://localhost:3000
Estado de conexión: connected
```

Si ves **"connected"** → ¡Tu configuración es CORRECTA! ✅

Si ves **"error-config"** → El `.env` tiene problemas ❌

---

## Paso 6: Verificar la Conexión desde Frontend

### 6.1 Abre el frontend

```
1. Abre el archivo: frontend/index.html
2. En el navegador verás una página
3. Espera 2 segundos
```

### 6.2 Observa el estado de conexión

**Si está verde ✅:**
```
Estado de Conexión
    ✓
    "✅ Conexión Exitosa"
    "¡Todo está funcionando correctamente!"
    "La API rest está conectada a Supabase"
```

**Si está rojo ❌:**
```
Estado de Conexión
    ✕
    "❌ Error de Conexión"
    "Error: ..."
```

---

## Troubleshooting Rápido

### ❌ Dice "Configuración de Supabase incompleta"

**Causa:** El archivo `.env` está vacío o no se guardó

**Solución:**
1. Verifica que `.env` tiene ambas líneas:
   - `SUPABASE_URL=...`
   - `SUPABASE_KEY=...`
2. Guardar con Ctrl+S
3. Reiniciar server (Ctrl+C en terminal, luego `npm start`)

---

### ❌ Dice "relation "información" does not exist"

**Causa:** La tabla no existe en Supabase

**Solución:**
1. Ve a Supabase > SQL Editor
2. Ejecuta el código SQL para crear la tabla
3. Reinicia el server

---

### ❌ Terminal muestra "error-config"

**Causa:** Las variables de entorno no cargan

**Solución:**
1. Verifica que el archivo se llama `.env` (no `.env.txt`)
2. Está en la carpeta `backend/`
3. Contiene:
   ```
   SUPABASE_URL=...
   SUPABASE_KEY=...
   PORT=3000
   ```
4. Reinicia server

---

## ✅ Checklist Final

Antes de decir "¡funciona!", verifica:

- [ ] Creé cuenta en Supabase
- [ ] Creé un proyecto
- [ ] Copié la URL (https://...)
- [ ] Copié la clave (eyJ...)
- [ ] Pegué ambas en backend/.env
- [ ] Creé la tabla con el SQL
- [ ] Guardé .env (Ctrl+S)
- [ ] Ejecuté `npm install`
- [ ] Ejecuté `npm start`
- [ ] La terminal dice "connected"
- [ ] El frontend muestra ✅ verde

Si todo dice ✅ → **¡Listo para aprender!** 🎓

---

## 📸 Guía Visual (Texto)

```
SUPABASE DASHBOARD
├── Settings ⚙️
│   └── API
│       ├── Project URL: https://abc123.supabase.co ← COPIAR
│       └── Anon Public Key: eyJ... ← COPIAR
│
VS CODE
├── backend/
│   └── .env
│       ├── SUPABASE_URL=https://abc123.supabase.co ← PEGAR
│       └── SUPABASE_KEY=eyJ... ← PEGAR
│
TERMINAL
├── npm install
└── npm start → Connected ✅

NAVEGADOR
├── frontend/index.html
└── Estado: ✅ Conexión Exitosa
```

---

## 💡 Tips

1. **Las credenciales no son sensibles (de lectura):**
   - Puedes compartir la URL y clave pública
   - No compartas la clave privada/secreta (server key)

2. **El .env no se sube a GitHub:**
   - Por eso existe `.env.example`
   - Cada persona usa sus propias credenciales

3. **Puedes crear múltiples proyectos:**
   - Uno para desarrollo
   - Otro para producción
   - Cada uno con sus propias credenciales

4. **Si algo falla:**
   - Recrea el `.env` desde `.env.example`
   - Verifica que no hay espacios extra
   - Reinicia el servidor

¡Adelante! 🚀
