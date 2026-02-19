# ✅ CHECKLIST INTERACTIVO: Test la Conexión

Usa este checklist mientras testas. Marca cada paso mientras lo completas.

---

## 📍 FASE 1: Obtener Credenciales (5 minutos)

### Paso 1.1: Acceder a Supabase
- [ ] Abro https://supabase.com
- [ ] Hago login con mi cuenta
- [ ] Veo la lista de mis proyectos
- [ ] Hago clic en mi proyecto
- [ ] Estoy dentro del proyecto

**Si no llegué aquí:**
> Ve a https://supabase.com y crea una cuenta

---

### Paso 1.2: Navegación a Settings > API
- [ ] Veo el menú izquierdo
- [ ] Encuentro la opción "Settings" (⚙️)
- [ ] Hago clic en Settings
- [ ] Veo las pestañas (General, API, Authentication, etc)
- [ ] Hago clic en la pestaña "API"

**Ubicación visual:**
```
Menú Izquierdo:
├─ Project
├─ SQL Editor
├─ Tables
├─ Authentication
├─ Storage
├─ Functions
├─ Extensions
└─ Settings ⚙️  ← HAZ CLIC

Luego arriba:
├─ General
├─ API  ← HAZ CLIC AQUÍ
└─ ...
```

---

### Paso 1.3: Copiar PROJECT URL
- [ ] Veo una sección "PROJECT SETTINGS"
- [ ] Veo un campo que dice "Project URL"
- [ ] La URL empieza con `https://`
- [ ] La URL termina con `.supabase.co`
- [ ] Hago clic en el botón 📋 (copiar)
- [ ] Veo notificación "Copied!" o similar

**Tiempo:** 10 segundos
**URL ejemplo:** `https://myproject-abc123.supabase.co`

---

### Paso 1.4: Copiar API KEY (anon public)
- [ ] Veo una sección "API KEYS"
- [ ] Encuentro una entrada que dice "anon (public)"
- [ ] Veo una clave muy larga que empieza con `eyJ`
- [ ] Hago clic en el botón 📋 (copiar)
- [ ] Veo notificación "Copied!" o similar

**Tiempo:** 10 segundos
**Key ejemplo:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

**⚠️ Importante:**
```
Ignora completamente la sección "service_role (secret)"
Esa NO se copia - Es para cosas secretas
```

---

## 📂 FASE 2: Editar .env en VS Code (3 minutos)

### Paso 2.1: Abrir carpeta backend

- [ ] Tengo VS Code abierto
- [ ] Voy a File > Open Folder
- [ ] Navego a: `d:\ClasesFlutter\ClasesAPIVisualStudio\clase1`
- [ ] Selecciono la carpeta `backend`
- [ ] Hago clic en "Select Folder"

**Resultado:** En VS Code ves `backend` en el explorador

---

### Paso 2.2: Localizar archivo .env

En el explorador (izquierda):
```
backend/
├─ .env         ← LO VES AQUÍ
├─ .env.example
├─ server.js
├─ package.json
└─ node_modules/
```

- [ ] Veo el archivo `.env` en la raíz de backend
- [ ] Hago doble clic en él
- [ ] El archivo se abre en la pestaña del editor

---

### Paso 2.3: Contenido actual

Debo ver:
```
# Supabase Configuration
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-clave-publica-aqui

# Server
PORT=3000
```

- [ ] Veo estas exactas líneas
- [ ] Si no las veo, algo está mal

---

### Paso 2.4: Editar SUPABASE_URL

**En la línea 2:**

ANTES:
```
SUPABASE_URL=https://tu-proyecto.supabase.co
```

QUÉ HACER:
- [ ] Sitúo el cursor después del `=`
- [ ] Selecciono el texto `https://tu-proyecto.supabase.co`
- [ ] Presiono Delete o Backspace
- [ ] Pego aquí mi URL copiada de Supabase (Ctrl+V)

DESPUÉS:
```
SUPABASE_URL=https://mi-proyecto-abc123.supabase.co
```

- [ ] La línea ahora tiene MI URL (no el placeholder)
- [ ] No hay espacios al inicio
- [ ] Empieza con `https://`
- [ ] Termina con `.supabase.co`

---

### Paso 2.5: Editar SUPABASE_KEY

**En la línea 3:**

ANTES:
```
SUPABASE_KEY=tu-clave-publica-aqui
```

QUÉ HACER:
- [ ] Sitúo el cursor después del `=`
- [ ] Selecciono el texto `tu-clave-publica-aqui`
- [ ] Presiono Delete o Backspace
- [ ] Pego aquí mi KEY copiada de Supabase (Ctrl+V)

DESPUÉS:
```
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJyb2xlIjoiYW5vbiM...
```

- [ ] La línea ahora tiene MI KEY (no el placeholder)
- [ ] Es muy larga (200+ caracteres)
- [ ] Empieza con `eyJ`
- [ ] Sin espacios

---

### Paso 2.6: Guardar el archivo

- [ ] Presiono **Ctrl+S** (Windows) o **Cmd+S** (Mac)
- [ ] El punto blanco en la pestaña desaparece
- [ ] Archivo guardado ✅

**Verificación visual:**
```
ANTES (no guardado):
├─ .env •   ← punto blanco = sin guardar

DESPUÉS (guardado):
├─ .env     ← sin punto = guardado ✅
```

**Tiempo:** 1 segundo

---

## 💾 FASE 3: Crear Tabla en Supabase (2 minutos)

**Importante:** Si no haces esto, la conexión fallará

### Paso 3.1: Ir a SQL Editor

- [ ] En Supabase, menú izquierdo
- [ ] Hago clic en **"SQL Editor"**
- [ ] Veo el editor SQL

---

### Paso 3.2: Crear nueva query

- [ ] Busco botón **"+ New Query"** o similar
- [ ] Hago clic
- [ ] Se abre un editor vacío

---

### Paso 3.3: Copiar y pegar SQL

**Copia este código completo:**
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

QUÉ HACER:
- [ ] Selecciono TODO el código anterior
- [ ] Presiono Ctrl+C (copiar)
- [ ] En Supabase SQL Editor, hago clic
- [ ] Presiono Ctrl+V (pegar)
- [ ] El código se pega en el editor

---

### Paso 3.4: Ejecutar

- [ ] Busco el botón **"Run"** (usualmente azul)
- [ ] Hago clic en Run
- [ ] Espero a que termine
- [ ] Debe mostrar: "Success" o "0 rows affected"

**Resultado:**
```
✅ La tabla se creó correctamente
```

- [ ] Veo un mensaje de éxito
- [ ] Si hay error, revisaré después

---

## 🖥️ FASE 4: Backend - npm install (2 minutos)

### Paso 4.1: Abrir Terminal

En VS Code:
- [ ] Presiono **Ctrl+`** (backtick)
- [ ] Se abre terminal en la parte inferior
- [ ] Veo `PowerShell` o `bash` o `cmd`

**O manualmente:**
- [ ] Terminal > New Terminal
- [ ] Se abre terminal

---

### Paso 4.2: Navegar a backend

En la terminal:
- [ ] Escribo: `cd backend`
- [ ] Presiono Enter
- [ ] Veo la ruta cambiar a: `.../backend>`

**Verificación:**
```powershell
PS D:\ClasesFlutter\ClasesAPIVisualStudio\clase1\backend>
                                                    ↑ debe decir "backend"
```

- [ ] Confirmo que estoy en la carpeta backend

---

### Paso 4.3: Instalar dependencias

- [ ] Escribo: `npm install`
- [ ] Presiono Enter
- [ ] Espero a que termine (1-2 minutos)

**Mientras se instala ves:**
```
npm warn deprecated...
found 0 vulnerabilities
```

**Cuando termina ves:**
```
added XYZ packages
```

**Resultado:**
- [ ] Se creó la carpeta `node_modules/`
- [ ] npm install terminó correctamente

---

## 🚀 FASE 5: Backend - npm start (2 minutos)

### Paso 5.1: Iniciar servidor

En la terminal (carpeta backend):
- [ ] Escribo: `npm start`
- [ ] Presiono Enter
- [ ] Espero a que inicie

---

### Paso 5.2: Verificar inicio

**Busco EXACTAMENTE estos mensajes:**

✅ **CORRECTO:**
```
✅ Servidor ejecutándose en http://localhost:3000
Estado de conexión: connected
```

- [ ] Veo "Servidor ejecutándose"
- [ ] Veo "http://localhost:3000"
- [ ] Veo "Estado de conexión: connected"

❌ **INCORRECTO:**
```
Estado de conexión: error-config
```
- [ ] Significa: el .env tiene un problema
- [ ] Ve y revisa que no haya espacios

---

### Paso 5.3: Terminal activa

- [ ] La terminal sigue corriendo
- [ ] El cursor está esperando
- [ ] NO presiono nada (dejar corriendo)
- [ ] Si presiono Ctrl+C para

---

## 🌐 FASE 6: Frontend - Test en Navegador (2 minutos)

### Paso 6.1: Abrir frontend

- [ ] Desde el explorador de W10, navego a: 
  ```
  d:\ClasesFlutter\ClasesAPIVisualStudio\clase1\frontend
  ```
- [ ] Hago clic en `index.html`
- [ ] Presiono Enter o doble clic
- [ ] Se abre en el navegador

**O con Live Server en VS Code:**
- [ ] Hago clic derecho en `index.html`
- [ ] Selecciono "Open with Live Server"
- [ ] Se abre automáticamente

---

### Paso 6.2: Esperar carga

- [ ] La página carga
- [ ] Veo el título "Sistema de Conexión"
- [ ] Espero 2-3 segundos

---

### Paso 6.3: Verificar indicador de conexión

**ÉXITO ✅ (Verde):**
```
Estado de Conexión
    ✓
"✅ Conexión Exitosa"
"¡Todo está funcionando correctamente!"
"La API rest está conectada a Supabase"
```

- [ ] Veo un círculo VERDE
- [ ] Con una marca ✓
- [ ] Dice "Conexión Exitosa"
- [ ] Las notificaciones muestran en verde

🎉 **¡TERMINADO! ¡FUNCIONA!**

---

**FALLO ❌ (Rojo):**
```
Estado de Conexión
    ✕
"❌ Error de Conexión"
"No se puede alcanzar la API"
```

- [ ] Veo un círculo ROJO
- [ ] Con una X
- [ ] Dice error
- [ ] Un mensaje rojo en logs

**Ir a:** Sección "SOLUCIÓN DE PROBLEMAS" abajo

---

### Paso 6.4: Test de Funcionalidad (OPCIONAL)

Si está verde ✅:

**Prueba crear un registro:**
- [ ] Escribo un título (ej: "Test 1")
- [ ] Escribo una descripción (ej: "Mi primer prueba")
- [ ] Hago clic en "Guardar"
- [ ] Veo notificación verde "Registro creado"
- [ ] Formul se vacía automáticamente

**Prueba cargar datos:**
- [ ] Hago clic en "📋 Cargar datos"
- [ ] Aparece una tarjeta con mi registro
- [ ] Muestra el título y descripción
- [ ] Muestra la fecha de creación

✅ **¡FUNCIONALIDAD COMPLETA!**

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### ❌ Error: "No se puede alcanzar la API"

**Causas posibles:**
1. Servidor no está corriendo
2. Está en puerto diferente (no 3000)

**QUÉ HACER:**
- [ ] Miro la terminal (Fase 5)
- [ ] Veo si dice "Servidor ejecutándose"
- [ ] Si NO ves eso:
  - [ ] Abro terminal nueva
  - [ ] `cd backend`
  - [ ] `npm start`
  - [ ] Espero a que diga "connected"
- [ ] Recargo el navegador (F5)

---

### ❌ Error: "Configuración de Supabase incompleta"

**Causa:** El .env está vacío o mal

**QUÉ HACER:**
- [ ] Abro backend/.env
- [ ] Verifico:
  - [ ] SUPABASE_URL empieza con `https://`
  - [ ] SUPABASE_KEY empieza con `eyJ`
  - [ ] No hay espacios extra
  - [ ] Líneas no vacías
- [ ] Guardo (Ctrl+S)
- [ ] En terminal presiono Ctrl+C
- [ ] Escribo `npm start` nuevamente
- [ ] Espero a que diga "connected"

---

### ❌ Error: "relation \"información\" does not exist"

**Causa:** La tabla no existe en Supabase

**QUÉ HACER:**
- [ ] Ve a Supabase > SQL Editor
- [ ] Crea la tabla (Fase 3.3)
- [ ] En terminal presiono Ctrl+C
- [ ] Escribo `npm start` nuevamente

---

### ❌ Error: "listen EADDRINUSE: address already in use :::3000"

**Causa:** El puerto 3000 ya está siendo usado

**QUÉ HACER - Opción 1:**
- [ ] Presiono Ctrl+C en la terminal
- [ ] Espero 5 segundos
- [ ] `npm start`

**QUÉ HACER - Opción 2:**
- [ ] Edito `.env`
- [ ] Cambio `PORT=3000` a `PORT=3001`
- [ ] Guardo
- [ ] `npm start`
- [ ] En navigador: `http://localhost:3001`

---

## 📊 Resumen Rápido

```
FASE 1 ✅ CREDENCIALES
┌─────────────────────────────────────┐
│ Supabase: Copiar URL y KEY          │
│ Tiempo: 5 minutos                   │
└─────────────────────────────────────┘
        ↓
FASE 2 ✅ EDITAR .ENV
┌─────────────────────────────────────┐
│ VS Code: backend/.env               │
│ Pegar URL y KEY                     │
│ Guardar (Ctrl+S)                    │
│ Tiempo: 3 minutos                   │
└─────────────────────────────────────┘
        ↓
FASE 3 ✅ CREAR TABLA
┌─────────────────────────────────────┐
│ Supabase: SQL Editor                │
│ Ejecutar SQL (copiar-pegar)         │
│ Tiempo: 2 minutos                   │
└─────────────────────────────────────┘
        ↓
FASE 4 ✅ npm install
┌─────────────────────────────────────┐
│ Terminal: cd backend                │
│ Terminal: npm install               │
│ Tiempo: 2 minutos                   │
└─────────────────────────────────────┘
        ↓
FASE 5 ✅ npm start
┌─────────────────────────────────────┐
│ Terminal: npm start                 │
│ Buscar: "connected"                 │
│ Tiempo: 10 segundos                 │
└─────────────────────────────────────┘
        ↓
FASE 6 ✅ TEST NAVEGADOR
┌─────────────────────────────────────┐
│ Abrir: frontend/index.html          │
│ Ver: Verde ✅ Conexión Exitosa      │
│ Tiempo: 1 minuto                    │
└─────────────────────────────────────┘

TOTAL: ~15 minutos ⏱️
```

---

## 🎉 Felicidades

Si completaste TODO con ✅ verde al final:

- ✅ Tu API funciona
- ✅ Supabase está conectado
- ✅ Frontend se comunica con backend
- ✅ Base de datos recibe datos

**¡Ahora puedes aprender cómo funciona todo!** 📚

---

## 📝 Notas Finales

- Guarda este checklist
- Úsalo si en el futuro necesitas resetear todo
- El flujo es siempre igual
- Las 5 fases son: Credenciales → .env → SQL → npm install → npm start

¡Buen aprendizaje! 🚀
