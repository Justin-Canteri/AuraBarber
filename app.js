// app.js
const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas de API
app.get('/usuarios', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM aura');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error interno del servidor');
  }
});

// Rutas de páginas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/superUser', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'superUser.html'));
});

// Puerto
const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
