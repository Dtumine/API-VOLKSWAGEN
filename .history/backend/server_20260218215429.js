const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de Supabase
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
    const { data, error } = await supabase.from('información').select('*').limit(1);
    
    if (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Error al conectar con Supabase',
        details: error.message
      });
    }

    res.json({
      status: 'success',
      message: 'Conexión exitosa con Supabase',
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

// 2. Ruta para obtener datos de ejemplo
app.get('/api/data', async (req, res) => {
  try {
    if (connectionStatus === 'error-config') {
      return res.status(500).json({
        status: 'error',
        message: 'Configuración incompleta'
      });
    }

    const { data, error } = await supabase.from('información').select('*');
    
    if (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Error al obtener datos',
        details: error.message
      });
    }

    res.json({
      status: 'success',
      data: data || []
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error en el servidor',
      details: error.message
    });
  }
});

// 3. Ruta para crear un registro
app.post('/api/data', async (req, res) => {
  try {
    if (connectionStatus === 'error-config') {
      return res.status(500).json({
        status: 'error',
        message: 'Configuración incompleta'
      });
    }

    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        status: 'error',
        message: 'Los campos title y description son requeridos'
      });
    }

    const { data, error } = await supabase.from('información').insert([
      {
        title: title,
        description: description,
        created_at: new Date().toISOString()
      }
    ]).select();

    if (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Error al crear registro',
        details: error.message
      });
    }

    res.status(201).json({
      status: 'success',
      message: 'Registro creado exitosamente',
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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`Estado de conexión: ${connectionStatus}`);
});
