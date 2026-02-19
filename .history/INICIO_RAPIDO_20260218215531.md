# 🚀 Guía Rápida de Inicio

## 1️⃣ Preparar Supabase

1. Ve a https://supabase.com
2. Crea una cuenta y un nuevo proyecto
3. Ve a **SQL Editor** y ejecuta esto:

```sql
CREATE TABLE información (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE información ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON información FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON información FOR INSERT WITH CHECK (true);
```

4. Ve a **Settings** > **API** y copia:
   - Project URL
   - anon public key

---

## 2️⃣ Configurar Backend

```bash
cd backend
npm install
```

Edita `.env`:
```
SUPABASE_URL=tu-url-aqui
SUPABASE_KEY=tu-clave-aqui
PORT=3000
```

---

## 3️⃣ Iniciar Servidor

```bash
# Terminal 1 - Desde carpeta backend
npm start
```

Deberías ver: ✅ Servidor ejecutándose en http://localhost:3000

---

## 4️⃣ Abrir Frontend

1. En VS Code, haz clic derecho en `frontend/index.html`
2. Selecciona "Open with Live Server"
3. O navega a: `file:///ruta/al/frontend/index.html`

---

## ✅ Resultado Esperado

- El frontend muestra "✅ Conexión Exitosa"
- Puedes crear registros con el formulario
- Los datos se guardan en Supabase
- Los logs muestran todas las acciones

¡Listo para aprender! 🎓
