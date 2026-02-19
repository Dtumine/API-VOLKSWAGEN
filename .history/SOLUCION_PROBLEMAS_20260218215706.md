# 🐛 Solución de Problemas

## Problemas Comunes y Soluciones

---

## 🔴 Error: "Cannot find module 'express'"

### Síntoma
```
Error: Cannot find module 'express'
    at Function.Module._load (internal/modules/commonjs.js:359:18)
    at Module._load (internal/modules/commonjs.js:359:18)
```

### Causa
Las dependencias no están instaladas.

### Solución
1. Abre terminal en la carpeta `backend`
2. Ejecuta:
```bash
npm install
```

3. Espera a que termine (verás una carpeta `node_modules`)
4. Reinicia el servidor

---

## 🔴 Error: "listen EADDRINUSE: address already in use :::3000"

### Síntoma
```
Error: listen EADDRINUSE: address already in use :::3000
```

### Causa
El puerto 3000 ya está ocupado por otro proceso.

### Solución Opción 1: Cambiar el puerto
Edita el archivo `.env`:
```
PORT=3001
```

### Solución Opción 2: Liberar el puerto
En PowerShell (ejecuta como Administrador):
```powershell
# Ver qué proceso usa el puerto
Get-NetTCPConnection -LocalPort 3000

# Obtener el PID
$proc = Get-NetTCPConnection -LocalPort 3000 | Select-Object OwningProcess
$pid = $proc.OwningProcess

# Terminar el proceso
Stop-Process -Id $pid -Force
```

En CMD (ejecuta como Administrador):
```batch
netstat -ano | findstr :3000
taskkill /PID <numero> /F
```

---

## 🔴 Error: "CORS policy: No 'Access-Control-Allow-Origin' header"

### Síntoma
```
Access to XMLHttpRequest at 'http://localhost:3000/api/status' 
from origin 'file://...' has been blocked by CORS policy
```

### Causa
El navegador bloquea solicitudes de front a back por razones de seguridad.

### Solución
El código ya tiene CORS configurado. Pero si aún así falla:

1. Verifica que el servidor está corriendo
2. Usa una extensión "Live Server" en VS Code
3. O sirve el frontend desde un servidor HTTP local

**Usar Live Server (recomendado):**
```
1. Click derecho en index.html
2. Selecciona "Open with Live Server"
3. El navegador abrirá en http://localhost:5500
```

---

## 🔴 Error: "Configuración de Supabase incompleta"

### Síntoma
```
{
  "status": "error",
  "message": "Configuración de Supabase incompleta",
  "details": "Faltan variables de entorno"
}
```

### Causa
El archivo `.env` está vacío o las variables no coinciden.

### Solución
1. Abre `backend/.env`
2. Verifica que tenga:
```
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-clave-publica-aqui
PORT=3000
```

3. Si están vacías:
   - Ve a https://supabase.com
   - Abre tu proyecto
   - Settings > API
   - Copia Project URL y anon public key
   - Pega en `.env`

4. Guarda el archivo
5. Reinicia el servidor

---

## 🔴 Error: "relation \"información\" does not exist"

### Síntoma
```
{
  "status": "error",
  "message": "Error al conectar con Supabase",
  "details": "relation \"información\" does not exist"
}
```

### Causa
La tabla no existe en tu base de datos de Supabase.

### Solución
1. Ve a https://supabase.com
2. Abre tu proyecto
3. Ve a **SQL Editor**
4. Ejecuta este código:

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

5. Espera a que termine
6. Vuelve a verificar la conexión en el frontend

---

## 🔴 Error: "Cannot POST /api/data" o Formulario no funciona

### Síntoma
- El botón no responde
- No se crean registros
- Error 404 en consola

### Causa
Problema en la conexión o validación del servidor.

### Solución

1. **Verifica que escribes algo en el formulario:**
   - El título no debe estar vacío
   - La descripción no debe estar vacía

2. **Abre la consola de desarrollador (F12):**
   - Ve a "Console"
   - Busca mensajes de error rojo

3. **Comprueba los logs en la página:**
   - En la sección "Registro de Actividades"
   - Debe mostrar las peticiones

4. **Verifica la terminal del servidor:**
   - Debe mostrar la petición llegando
   - Si no aparece, el fronted no está conectando

5. **Prueba con cURL:**
   ```bash
   curl -X POST http://localhost:3000/api/data \
     -H "Content-Type: application/json" \
     -d '{"title":"Test","description":"Test"}'
   ```
   - Si funciona con curl pero no con el frontend → Problema CORS
   - Si no funciona → Problema del servidor

---

## 🔴 Error: "The table does not exist" en Supabase

### Síntoma
Cuando intentas crear un registro.

### Causa
- La tabla tiene otro nombre
- Hay un error en el SQL
- La tabla se borró accidentalmente

### Solución
1. Ve a Supabase > SQL Editor
2. Ejecuta:
```sql
SELECT * FROM information_schema.tables 
WHERE table_name = 'información';
```

3. Si no retorna nada, la tabla no existe
4. Crea la tabla nuevamente (ver solución anterior)

---

## 🔴 El formulario se vacía pero no se crea el registro

### Síntoma
- El campo se borra
- No aparece en la lista
- No hay error visible

### Causa
Probablemente la petición POST falla silenciosamente.

### Solución
1. Abre el navegador (F12)
2. Ve a "Network"
3. Crea un registro
4. Busca la petición "data"
5. Haz clic en ella
6. Ve a "Response"
7. Verás qué error retorna el servidor

---

## 🔴 "Unexpected token < in JSON at position 0"

### Síntoma
Error en la consola del navegador.

### Causa
El servidor está enviando HTML en lugar de JSON (probablemente un error 404 o 500).

### Solución
1. Comprueba que el servidor está corriendo
2. Comprueba que la URL es correcta (`http://localhost:3000`)
3. Verifica los errores del servidor en la terminal

---

## 🔴 Datos no se guardan o aparecen después de recargar

### Síntoma
- Creo un registro
- No aparece en la lista
- Si recargo la página, aparece

### Causa
Probablemente es solo un retraso en la red o la lista no se recargar automáticamente.

### Solución
1. Espera un segundo después de crear
2. O haz clic en "Cargar datos" manualmente
3. El código intenta recargar automáticamente, pero si falla silenciosamente no lo hace

---

## 🔴 El servidor corre pero el navegador dice "Cannot reach API"

### Síntoma
- Terminal muestra "Servidor ejecutándose..."
- Pero el frontend muestra error de conexión

### Causa
- La URL está incorrecta
- El puerto no coincide
- Firewall bloquea

### Solución
1. Verifica que el servidor dice `http://localhost:3000`
2. En el navegador, visita `http://localhost:3000/api/status`
3. Deberías ver un JSON
4. Si no funciona, el servidor no está realmente corriendo

---

## 🔴 "ERR_CONNECTION_REFUSED" en la consola

### Síntoma
El navegador no puede conectar con el servidor.

### Causa
- Servidor no está corriendo
- Puerto incorrecto
- Equipo no tiene localhost

### Solución
1. Abre terminal en `backend`
2. Ejecuta `npm start`
3. Comprueba que ves el mensaje "Servidor ejecutándose..."
4. Reconecta el navegador

---

## 🆘 Checklist de Solución de Problemas

Cuando algo falla, verifica esto en orden:

- [ ] ¿Node.js está instalado? (`node --version`)
- [ ] ¿npm install se ejecutó? (¿Existe carpeta `node_modules`?)
- [ ] ¿Se configuró `.env`? (¿No está vacío?)
- [ ] ¿El servidor está corriendo? (¿Ves el mensaje verde?)
- [ ] ¿El puerto no está ocupado? (Intenta puerto 3001)
- [ ] ¿La tabla existe en Supabase? (Verifica SQL Editor)
- [ ] ¿Las políticas RLS están creadas? (SELECT e INSERT)
- [ ] ¿El frontend se abre correctamente? (¿Carga HTML y CSS?)
- [ ] ¿Hay errores en consola? (F12 > Console)
- [ ] ¿El servidor recibe las peticiones? (Verifica terminal)
- [ ] ¿Respuesta del servidor es JSON? (No HTML)

---

## 📞 Si Nada Funciona

1. **Reinicia todo:**
   ```bash
   # Terminal 1: detén el servidor (Ctrl+C)
   # Luego reinicia:
   npm start
   ```

2. **Borra node_modules:**
   ```bash
   rm -r node_modules
   npm install
   npm start
   ```

3. **Crea la tabla nuevamente:**
   - Supabase > SQL Editor
   - Ejecuta el SQL de crear tabla

4. **Borra el caché del navegador:**
   - F12 > Application > Clear all

5. **Intenta en otra carpeta:**
   - Copia todo a una carpeta nueva
   - Comprueba con un proyecto limpio

---

## 💡 Tips Útiles

### Ver logs del servidor en tiempo real
```bash
cd backend
npm run dev
# O: node --watch server.js
```

### Probar API con curl
```bash
# Verificar conexión
curl http://localhost:3000/api/status

# Obtener datos
curl http://localhost:3000/api/data

# Crear registro
curl -X POST http://localhost:3000/api/data \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"Test desc"}'
```

### Usar Postman
1. Descarga [Postman](https://postman.com)
2. Crea peticiones GET y POST
3. Prueba sin necesidad del frontend

### Limpiar caché de navegador
- F12 > Application > Storage > Clear all
- O: Ctrl+Shift+Del en Chrome

### Ver variables de entorno
```bash
echo %SUPABASE_URL%
echo %SUPABASE_KEY%
```
