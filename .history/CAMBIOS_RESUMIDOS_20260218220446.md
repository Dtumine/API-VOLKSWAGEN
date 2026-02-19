# 🎯 RESUMEN VISUAL: De Dónde a Dónde Cambiar

## 📂 Tu Carpeta

```
clase1/
├── backend/
│   ├── .env         👈 ESTE ARCHIVO
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── index.html
    ├── style.css
    └── app.js
```

---

## 🔄 El Viaje de tus Credenciales

```
SITIO WEB          →        TU COMPUTADORA
═══════════════════         ══════════════════

Supabase           →        backend/.env
  • URL            →        SUPABASE_URL
  • API Key        →        SUPABASE_KEY

backend/.env       →        backend/server.js
                            (Lee .env)

backend/server.js  →        frontend/app.js
                            (Es la API)

frontend/app.js    →        Tu Navegador
                            (Muestra ✅ o ❌)
```

---

## 📋 Los 3 Cambios Que Debes Hacer

### Cambio #1: SUPABASE_URL

```
📍 Ubicación: backend/.env (LÍNEA 2)

ANTES:
SUPABASE_URL=https://tu-proyecto.supabase.co

DESPUÉS (tu URL de Supabase):
SUPABASE_URL=https://abc123xyz.supabase.co
           ↑ Reemplaza todo esto


De dónde lo copias:
┌────────────────────────────────────┐
│ Supabase Dashboard                 │
│ Settings > API > Project URL       │ ← copiar
│ https://abc123xyz.supabase.co      │
└────────────────────────────────────┘
```

---

### Cambio #2: SUPABASE_KEY

```
📍 Ubicación: backend/.env (LÍNEA 3)

ANTES:
SUPABASE_KEY=tu-clave-publica-aqui

DESPUÉS (tu clave de Supabase):
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
           ↑ Reemplaza todo esto


De dónde lo copias:
┌────────────────────────────────────┐
│ Supabase Dashboard                 │
│ Settings > API > anon (public)     │ ← copiar
│ eyJhbGciOiJIUzI1NiIsInR5cCI...    │
└────────────────────────────────────┘
```

---

### Cambio #3: Crear Tabla en Supabase

```
📍 Ubicación: Supabase SQL Editor

ANTES:
┌────────────────────────────────────┐
│ Tabla "información": EXISTE ❌     │
└────────────────────────────────────┘

DESPUÉS:
┌────────────────────────────────────┐
│ Tabla "información": EXISTE ✅     │
│ • id (BIGSERIAL)                   │
│ • title (VARCHAR)                  │
│ • description (TEXT)               │
│ • created_at (TIMESTAMP)           │
└────────────────────────────────────┘


Qué ejecutar:
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

## ⚙️ El Archivo .env: ANTES y DESPUÉS

### ANTES (Como viene)
```dotenv
# Supabase Configuration
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-clave-publica-aqui

# Server
PORT=3000
```

**Problema:** Tiene valores de ejemplo


### DESPUÉS (Después de editar)
```dotenv
# Supabase Configuration
SUPABASE_URL=https://miproyecto-abc123.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMzc5MjAwMCwiZXhwIjoyMDIzNzkyMDAwfQ.abc123xyz

# Server
PORT=3000
```

**Correcto:** Tiene TUS valores reales


---

## ✏️ Cómo Editar en VS Code

### Paso Visual 1: Abre el archivo
```
📂 backend/
  📄 .env    ← Double click aquí
```

### Paso Visual 2: Ves el contenido
```
┌─────────────────────────────────────────────────────┐
│  Line 2: SUPABASE_URL=https://tu-proyecto...       │
│          ↑                                          │
│          Aquí cambias el valor                      │
└─────────────────────────────────────────────────────┘
```

### Paso Visual 3: Selecciona y borra
```
┌─────────────────────────────────────────────────────┐
│              https://tu-proyecto.supabase.co        │
│              └─────────────────────────────────────┘│
│              Selecciona esto y borra (Delete)       │
└─────────────────────────────────────────────────────┘
```

### Paso Visual 4: Pega tu valor
```
┌─────────────────────────────────────────────────────┐
│ SUPABASE_URL=https://miproyecto-abc123.supabase.co │
│              └─────────────────────────────────────┘│
│              Pega aquí (Ctrl+V)                     │
└─────────────────────────────────────────────────────┘
```

### Paso Visual 5: Repite con la Key
```
┌─────────────────────────────────────────────────────┐
│ SUPABASE_KEY=eyJhbGciOiJIUzI1NiIs...               │
│              └──────────────────────────────────────┤
│              Mismo proceso: Selecciona, Borra, Pega │
└─────────────────────────────────────────────────────┘
```

### Paso Visual 6: Guarda
```
┌─────────────────────────────────────────────────────┐
│ Ctrl+S                                              │
│ El punto blanco en la pestaña desaparece ✅        │
└─────────────────────────────────────────────────────┘
```

---

## 🌐 Después de Editar: El Flujo

```
backend/.env                    (Tienes las credenciales)
        ↓
npm start                       (Servidor lee .env)
        ↓
Servidor conecta a Supabase     (Si .env es correcto)
        ↓
Terminal dice "connected" ✅    (Conexión exitosa)
        ↓
frontend/index.html             (Tu página web)
        ↓
Página muestra verde ✅         (UI feliz)
```

---

## ✅ Checkpoints: Verifica Aquí

### Checkpoint 1: Antes de editar
```
❓ ¿Copié la URL de Supabase?
   Debe empezar con: https://
   Debe terminar con: .supabase.co
   
❓ ¿Copié la API Key?
   Debe empezar con: eyJ
   Debe ser muy larga (200+ caracteres)
```

### Checkpoint 2: Después de editar
```
❓ ¿El .env tiene el contenido correcto?
   Línea 2: SUPABASE_URL=https://tuURL.supabase.co
   Línea 3: SUPABASE_KEY=eyJ...
   
❓ ¿No hay espacios extra al inicio?
   No debe haber espacios antes de SUPABASE_
   
❓ ¿Guardé el archivo?
   Ctrl+S → El punto blanco desaparece
```

### Checkpoint 3: Terminal muestra "connected"
```
✅ Ves: "Servidor ejecutándose en http://localhost:3000"
✅ Ves: "Estado de conexión: connected"

❌ Si ves: "error-config"
   → Revisa el .env (espacios, caracteres faltantes)
   → Reinicia servidor
```

### Checkpoint 4: Frontend muestra verde
```
✅ Abres: frontend/index.html
✅ Ves: Círculo verde ✓
✅ Ves: "Conexión Exitosa"

❌ Si ves: Círculo rojo ✕
   → ¿El servidor está corriendo?
   → ¿Las credenciales son correctas?
```

---

## 📊 Timeline Total

```
⏱️  ~5 minutos → Obtener credenciales de Supabase
⏱️  ~3 minutos → Editar backend/.env
⏱️  ~2 minutos → Crear tabla en Supabase SQL
⏱️  ~2 minutos → npm install
⏱️  ~1 minuto  → npm start (esperar "connected")
⏱️  ~1 minuto  → Test en navegador (ver verde ✅)
────────────────
⏱️  ~15 minutos TOTAL
```

---

## 🎯 Objetivo Final

```
┌─────────────────────────────────────────┐
│      backend/.env CORRECTO              │
│                                         │
│ SUPABASE_URL=https://...supabase.co    │
│ SUPABASE_KEY=eyJ...                    │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│      server.js INICIA                   │
│                                         │
│ npm start                               │
│ → "connected" ✅                        │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│      Frontend CONECTA                   │
│                                         │
│ index.html abierto                      │
│ → Verde ✅                              │
│ → "Conexión Exitosa"                    │
└─────────────────────────────────────────┘
```

---

## 📞 TL;DR (Very Short Version)

```
1. Supabase Settings > API
   → Copiar URL y Key

2. Editar backend/.env
   → Reemplazar placeholders con el Step 1

3. Terminal: npm install

4. Terminal: npm start
   → Ver "connected"

5. Abrir index.html
   → Ver verde ✅

LISTO 🚀
```

---

## 🖼️ Lo Que Verás en Cada Paso

### Supabase (Settings > API)
```
┌──────────────────────────────────────────┐
│ 1. Project URL                           │
│    https://myproject-abc123.supabase.co │ ← COPIAR
│    [📋 copiar]                           │
│                                          │
│ 2. API KEYS                              │
│    anon (public)                         │
│    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXV... │ ← COPIAR
│    [📋 copiar]                           │
└──────────────────────────────────────────┘
```

### VS Code (.env editado)
```
┌──────────────────────────────────────────┐
│ .env                                     │
├──────────────────────────────────────────┤
│ SUPABASE_URL=https://myproject-abc...   │ ✅
│ SUPABASE_KEY=eyJhbGciOiJIUzI1NiIs...   │ ✅
│ PORT=3000                                │ ✅
│                                          │
│ Ctrl+S (guardado)                        │
└──────────────────────────────────────────┘
```

### Terminal (npm start)
```
┌──────────────────────────────────────────┐
│ PS> npm start                            │
│                                          │
│ ✅ Servidor ejecutándose en...          │
│ http://localhost:3000                   │
│ Estado de conexión: connected            │ ✅
│                                          │
│ PS>                                      │
└──────────────────────────────────────────┘
```

### Navegador (index.html)
```
┌──────────────────────────────────────────┐
│ 🚀 Sistema de Conexión                  │
│                                          │
│ Estado de Conexión                      │
│     ✓                                    │
│ ✅ Conexión Exitosa                     │
│ ¡Todo está funcionando!                  │ ✅
│                                          │
│ [🔄 Verificar de nuevo]                 │
└──────────────────────────────────────────┘
```

---

¡Eso es TODO! Ahora ya sabes exactamente qué, dónde y cómo cambiar. 🎉
