# SQL: Crear Tabla "clientes"

Copia este código y ejecútalo en **Supabase > SQL Editor**:

```sql
CREATE TABLE clientes (
  id_cliente BIGSERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  dni VARCHAR(20) UNIQUE NOT NULL,
  telefono VARCHAR(20),
  email VARCHAR(100) NOT NULL UNIQUE,
  fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Habilitar RLS
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso
CREATE POLICY "Allow public read" ON clientes
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert" ON clientes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update" ON clientes
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete" ON clientes
  FOR DELETE USING (true);

-- Crear índices para búsquedas rápidas
CREATE INDEX idx_clientes_dni ON clientes(dni);
CREATE INDEX idx_clientes_email ON clientes(email);
```

---

## Pasos:

1. Ve a **Supabase Dashboard**
2. Tu proyecto → **SQL Editor**
3. **+ New Query**
4. Pega el código anterior
5. Click en **Run**
6. Espera "Success"

¡Listo! La tabla está creada.
