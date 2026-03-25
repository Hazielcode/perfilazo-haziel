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

// Función para inicializar la base de datos (CREATE TABLE si no existe)
const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                rol VARCHAR(50) DEFAULT 'Developer',
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Base de datos verificada/creada');
    } catch (err) {
        console.error('❌ Error inicializando DB:', err);
    }
};

initDB();

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
