# 📍 Guía Visual: Dónde Encontrar las Credenciales

## 🎯 Ruta en Supabase

### Pantalla 1: Dashboard de tu Proyecto

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ SUPABASE DASHBOARD                              ┃
┃                                                  ┃
┃ 🏠 Home    Proyectos    Tu Organización    👤   ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                  ┃
┃  Mis Proyectos                                   ┃
┃  ├─ api-rest-clase          👈 Tu proyecto     ┃
┃  └─ otro-proyecto                               ┃
┃                                                  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

👉 Haz clic en tu proyecto
```

---

### Pantalla 2: Dentro del Proyecto (Vista General)

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ api-rest-clase          🏠 Dashboard              ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                     ┃
┃ MENÚ IZQUIERDO:                                    ┃
┃ ├─ 🏠 Project            ← Estás aquí            ┃
┃ ├─ 📊 SQL Editor                                  ┃
┃ ├─ 📚 Tables                                      ┃
┃ ├─ 🔐 Authentication                             ┃
┃ ├─ 📁 Storage                                     ┃
┃ ├─ 🔧 Functions                                   ┃
┃ ├─ 🛡️ Extensions                                  ┃
┃ └─ ⚙️ Settings          ← AQUÍ VAMOS             ┃
┃                                                     ┃
┃ CONTENIDO PRINCIPAL:                              ┃
┃ ┌─────────────────────────────────────────────┐  ┃
┃ │ Welcome!                                     │  ┃
┃ │ Here's what you need to know...               │  ┃
┃ └─────────────────────────────────────────────┘  ┃
┃                                                     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

👉 Haz clic en "⚙️ Settings" en el menú izquierdo
```

---

### Pantalla 3: Settings > API

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Settings                                             ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                     ┃
┃ Tabs:                                              ┃
┃ ├─ General                                         ┃
┃ ├─ API           ← HAZ CLIC AQUÍ                  ┃
┃ ├─ Authentication                                 ┃
┃ ├─ Database                                       ┃
┃ └─ ...                                             ┃
┃                                                     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

👉 Haz clic en la pestaña "API"
```

---

### Pantalla 4: Dentro de Settings > API

Aquí encontrarás TODO lo que necesitas:

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ SETTINGS > API                                     ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                    ┃
┃ 📌 PROJECT SETTINGS                               ┃
┃                                                    ┃
┃ ┌──────────────────────────────────────────────┐ ┃
┃ │ 1️⃣  Project URL (SUPABASE_URL)              │ ┃
┃ │                                              │ ┃
┃ │ https://xyzabc.supabase.co                   │ ┃
┃ │                                              │ ┃
┃ │ [Icon copiar]  👈 COPIA ESTE                │ ┃
┃ └──────────────────────────────────────────────┘ ┃
┃                                                    ┃
┃ ┌──────────────────────────────────────────────┐ ┃
┃ │ 2️⃣  API KEYS                                 │ ┃
┃ │                                              │ ┃
┃ │ anon (public)                                │ ← Esta                    │
┃ │                                              │ ┃
┃ │ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...     │ ┃
┃ │                                              │ ┃
┃ │ [Icon copiar]  👈 COPIA ESTE                │ ┃
┃ │                                              │ ┃
┃ └──────────────────────────────────────────────┘ ┃
┃                                                    ┃
┃ ┌──────────────────────────────────────────────┐ ┃
┃ │ service_role (secret)                        │ ┃
┃ │                                              │ ┃
┃ │ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...     │ ┃
┃ │                                              │ ┃
┃ │ ⚠️ NO COPIES ESTA - Es secreto              │ ┃
┃ └──────────────────────────────────────────────┘ ┃
┃                                                    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

## 📋 Qué Copiar

### ✅ Sí Copiar (Public)

```
1. Project URL
   Ubicación: Settings > API > PROJECT SETTINGS
   Empieza con: https://
   Ejemplo: https://abc123xyz.supabase.co
   
   👉 COPIA AQUÍ → SUPABASE_URL en .env

2. anon (public) API Key
   Ubicación: Settings > API > API KEYS > anon (public)
   Empieza con: eyJ...
   Ejemplo: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   
   👉 COPIA AQUÍ → SUPABASE_KEY en .env
```

### ❌ NO Copiar (Secret)

```
service_role (secret) API Key
   ⚠️ NUNCA copies esto
   Es para operaciones sensibles en el servidor
   Si alguien lo obtiene, puede modificar tu BD
```

---

## 🖱️ Paso a Paso Clickeando

```
1. Entra a https://supabase.com
   └── Login con tu cuenta

2. Ves tus proyectos
   └── Haz clic en el tuyo

3. Menú izquierdo
   └── Haz clic en "⚙️ Settings"

4. Arriba hay pestañas
   └── Haz clic en "API"

5. Ves "Project URL"
   └── Haz clic en el botón 📋 copiar
   └── Pega en tu .env como SUPABASE_URL

6. Más abajo ves "anon (public)"
   └── Haz clic en el botón 📋 copiar
   └── Pega en tu .env como SUPABASE_KEY

7. Guarda .env (Ctrl+S)

8. Listo ✅
```

---

## 🎬 En tu Editor (VS Code)

### Paso 1: Abre la carpeta backend

```
File > Open Folder
└── Selecciona carpeta "backend"
```

### Paso 2: Busca .env

```
En el explorador (izquierda):
backend/
├── .env          👈 Este archivo
├── .env.example
├── server.js
└── package.json
```

### Paso 3: Abre .env

```
Haz clic en .env
```

### Paso 4: Edita el contenido

```
ANTES:
┌──────────────────────────────────────────┐
│ # Supabase Configuration                 │
│ SUPABASE_URL=https://tu-proyecto...     │
│ SUPABASE_KEY=tu-clave-publica-aqui      │
│ PORT=3000                                │
└──────────────────────────────────────────┘

DESPUÉS (reemplaza con tus valores):
┌──────────────────────────────────────────┐
│ # Supabase Configuration                 │
│ SUPABASE_URL=https://abc123.supabase.co │
│ SUPABASE_KEY=eyJhbGciOiJIUzI1NiI...    │
│ PORT=3000                                │
└──────────────────────────────────────────┘
```

### Paso 5: Guarda

```
Ctrl+S (Windows/Linux)
Cmd+S (Mac)

Verás que desaparece el punto blanco en la pestaña
(significa que se guardó)
```

---

## 🔍 Verificar que está Correcto

### Verificación 1: Archivo .env guardado

```
En VS Code, la pestaña .env debe estar así:
├─ .env   (sin símbolos especiales = guardado ✅)

Si ves:
├─ .env •  (con punto = no guardado ❌)

Solución: Ctrl+S
```

### Verificación 2: Contenido es correcto

```
.env debe tener:
┌─────────────────────────────────────────────┐
│ SUPABASE_URL=https://... (empieza con https)  
│ SUPABASE_KEY=eyJ... (empieza con eyJ)        
│ PORT=3000                                   
└─────────────────────────────────────────────┘
```

### Verificación 3: Terminal dice "connected"

```
Abre terminal en carpeta backend:
└── npm start

Deberías ver:
✅ Servidor ejecutándose en http://localhost:3000
Estado de conexión: connected
```

Si ves `connected` → ¡Perfecto! ✅

---

## 🌍 Vista Rápida: URL Patterns

### Patrón URL de Supabase

```
Siempre es:
    https://[NOMBRE-PROYECTO].[REGIÓN].supabase.co

Ejemplos reales:
    https://my-app.supabase.co
    https://clase-api.supabase.co
    https://proyecto-final.eu.supabase.co
    https://database123abc.ap-northeast-1.supabase.co
```

### Patrón API Key

```
Siempre empieza con:
    eyJ...

Es un JWT (JSON Web Token), muy largo
Mide ~200+ caracteres

Ejemplo (recortado):
    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
    [200+ caracteres más]
```

---

## 📱 Para Celular (Si lo necesitas)

```
1. Ve a https://supabase.com desde tu teléfono
2. Login
3. Menú ☰ > Tu proyecto
4. Scroll hasta "Settings"
5. Busca "API"
6. Project URL y anon key
7. Copia cada uno a tu computadora (email, WhatsApp, etc)
8. Pega en .env
9. Listo
```

---

## ⚠️ Errores Comunes Al Copiar

### ❌ Error 1: Espacios en blanco

```
MAL:
SUPABASE_URL= https://abc.supabase.co
           ↑ espacio extra

BIEN:
SUPABASE_URL=https://abc.supabase.co
```

### ❌ Error 2: Comillas extra

```
MAL:
SUPABASE_URL="https://abc.supabase.co"
           ↑ comillas

BIEN:
SUPABASE_URL=https://abc.supabase.co
```

### ❌ Error 3: URL incompleta

```
MAL:
SUPABASE_URL=https://abc  ← Falta .supabase.co

BIEN:
SUPABASE_URL=https://abc.supabase.co
```

### ❌ Error 4: Key incompleta

```
MAL:
SUPABASE_KEY=eyJhbGciOiJIUzI1NiI...  ← Copiaste solo parte

BIEN:
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJyb2xlIjoiYW5vbiI...
        (toda la clave, muy larga)
```

---

## ✨ Top Tips

1. **Copia toda la URL:**
   - Desde el `https://` hasta `.co`
   - No dejes nada afuera

2. **Copia toda la KEY:**
   - Aunque sea muy larga
   - Usa Ctrl+A en el campo de Supabase para seleccionar todo
   - Luego Ctrl+C para copiar

3. **Pega exactamente:**
   - No hagas cambios manuales
   - Copy-paste directo

4. **Guarda siempre después de editar:**
   - Ctrl+S en VS Code
   - Verifica que se guardó

5. **Reinicia el servidor:**
   - Después de guardar .env
   - Para que cargue las nuevas variables

---

## ✅ Resumen: Los 3 Pasos Clave

```
1. Supabase Console
   └─→ Settings > API
       ├─→ Copiar Project URL
       └─→ Copiar anon (public) key

2. VS Code
   └─→ Editar backend/.env
       ├─→ Pegar URL en SUPABASE_URL
       └─→ Pegar key en SUPABASE_KEY

3. Terminal
   └─→ npm start
       └─→ Ver "connected" ✅
```

¡Ahora sí estás listo! 🚀
