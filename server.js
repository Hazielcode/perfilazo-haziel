const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Para servir el index.html

// Configuración de PostgreSQL (Usa la URL de Render)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// RUTAS DEL CRUD
// 1. Obtener todos los usuarios
app.get('/usuarios', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM usuarios ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

// 2. Crear un nuevo usuario (Prueba rápida)
app.post('/usuarios', async (req, res) => {
    const { nombre, email, rol } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO usuarios (nombre, email, rol) VALUES ($1, $2, $3) RETURNING *',
            [nombre, email, rol]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al crear usuario' });
    }
});

app.listen(port, () => {
    console.log(`Servidor Cyber-DevOps corriendo en puerto ${port}`);
});
