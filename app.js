// app.js
const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas de API
/*--------------------------------------------------------------------------------------*/

//Obtengo todos los datos de la db "aura"
app.get('/usuarios', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM aura');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error interno del servidor');
  }
});

app.get('/reservas/:day/:month', async (req, res) => {
  const { day, month } = req.params;  
  try {
    const result = await db.query('SELECT hours FROM aura WHERE day = $1 AND month = $2', [day, month]);
    res.json(result.rows.map(obj => obj.hours));
  } catch (err) {
    console.error(err);
    res.status(500).send('Error interno del servidor');
  }
});


// Subo dato a la base de datos (al clikear en reservar)
app.post('/usuarios/upload', async (req, res) => {
   const { name, number, day, month, hours} = req.body;
   try {
     await db.query('INSERT INTO aura (name, phone, day, month, hours) VALUES ($1, $2, $3, $4, $5)', [name, number, day, month, hours]);
     res.json({ message: 'Datos guardados en la base de datos' });
   } catch (err) {
     console.error(err);
     res.status(500).send('Error al guardar en la base de datos');
   }
});
/*--------------------------------------------------------------------------------------*/



// Rutas de páginas
/*--------------------------------------------------------------------------------------*/
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/superUser', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'superUser.html'));
});

// Puerto
const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
/*--------------------------------------------------------------------------------------*/
