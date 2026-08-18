const express = require('express');
const resenaRoutes = require('./routes/resenaRoutes');

const app = express();

app.use(express.json());

// Capa de API / controladores expuesta bajo la raíz del servicio
app.use('/', resenaRoutes);

// Ruta de salud del servicio
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', servicio: 'microservicio-resenas' });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejador de errores no controlados
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno inesperado del servidor' });
});

module.exports = app;
