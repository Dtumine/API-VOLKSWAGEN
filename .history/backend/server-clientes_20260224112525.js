const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de Supabase (misma que la otra API)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

let supabase;
let connectionStatus = 'not-initialized';

// Inicializar Supabase
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
  connectionStatus = 'connected';
} else {
  connectionStatus = 'error-config';
}

// Rutas

// 1. Ruta de estado de conexión
app.get('/api/status', async (req, res) => {
  try {
    if (connectionStatus === 'error-config') {
      return res.status(500).json({
        status: 'error',
        message: 'Configuración de Supabase incompleta',
        details: 'Faltan variables de entorno: SUPABASE_URL y/o SUPABASE_KEY'
      });
    }

    // Intentar una consulta simple para verificar la conexión
    const { data, error } = await supabase.from('clientes').select('*').limit(1);
    
    if (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Error al conectar con Supabase',
        details: error.message
      });
    }

    res.json({
      status: 'success',
      message: 'Conexión exitosa con Supabase (Tabla clientes)',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error en el servidor',
      details: error.message
    });
  }
});

// 2. Ruta para obtener todos los clientes
app.get('/api/clientes', async (req, res) => {
  try {
    if (connectionStatus === 'error-config') {
      return res.status(500).json({
        status: 'error',
        message: 'Configuración incompleta'
      });
    }

    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('id_cliente', { ascending: true });
    
    if (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Error al obtener clientes',
        details: error.message
      });
    }

    
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error en el servidor',
      details: error.message
    });
  }
});

// 3. Ruta para obtener un cliente por ID
app.get('/api/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: 'error',
        message: 'El parámetro id es requerido'
      });
    }

    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id_cliente', id)
      .single();
    
    if (error) {
      return res.status(404).json({
        status: 'error',
        message: 'Cliente no encontrado',
        details: error.message
      });
    }

    res.json({
      status: 'success',
      data: data
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error en el servidor',
      details: error.message
    });
  }
});

// 4. Ruta para crear un cliente
app.post('/api/clientes', async (req, res) => {
  try {
    const { nombre, apellido, dni, telefono, email, fecha_alta } = req.body;

    // Validación
    if (!nombre || !apellido || !dni || !email) {
      return res.status(400).json({
        status: 'error',
        message: 'Los campos nombre, apellido, dni y email son obligatorios'
      });
    }

    const { data, error } = await supabase
      .from('clientes')
      .insert([
     {
    nombre,
    apellido,
    dni,
    telefono: telefono || null,
    mail: email, // 👈 mapeo correcto
    fecha_alta: fecha_alta || new Date().toISOString()
   }
   ])
      
      .select();

    if (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Error al crear cliente',
        details: error.message
      });
    }

    res.status(201).json({
      status: 'success',
      message: 'Cliente creado exitosamente',
      data: data[0]
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error en el servidor',
      details: error.message
    });
  }
});

// 5. Ruta para actualizar un cliente
app.put('/api/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, dni, telefono, email } = req.body;

    if (!id) {
      return res.status(400).json({
        status: 'error',
        message: 'El parámetro id es requerido'
      });
    }

    const { data, error } = await supabase
      .from('clientes')
      .update({
       nombre,
       apellido,
       dni,
       telefono,
       mail: email // 👈 mapeo correcto
       })
      .eq('id_cliente', id)
      .select();

    if (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Error al actualizar cliente',
        details: error.message
      });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Cliente no encontrado'
      });
    }

    res.json({
      status: 'success',
      message: 'Cliente actualizado exitosamente',
      data: data[0]
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error en el servidor',
      details: error.message
    });
  }
});

// 6. Ruta para eliminar un cliente
app.delete('/api/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: 'error',
        message: 'El parámetro id es requerido'
      });
    }

    const { data, error } = await supabase
      .from('clientes')
      .delete()
      .eq('id_cliente', id)
      .select();

    if (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Error al eliminar cliente',
        details: error.message
      });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Cliente no encontrado'
      });
    }

    res.json({
      status: 'success',
      message: 'Cliente eliminado exitosamente',
      data: data[0]
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error en el servidor',
      details: error.message
    });
  }
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Error interno del servidor',
    details: err.message
  });
});

// Puerto
const PORT = process.env.PORT_CLIENTES || 3030;
app.listen(PORT, () => {
  console.log(`✅ API Clientes ejecutándose en http://localhost:${PORT}`);
  console.log(`Estado de conexión: ${connectionStatus}`);
});
