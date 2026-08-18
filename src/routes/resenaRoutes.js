const express = require('express');
const router = express.Router();
const resenaController = require('../controllers/resenaController');

// Recursos de reseñas
router.post('/resenas', resenaController.crearResena);
router.get('/resenas', resenaController.obtenerResenas);
router.delete('/resenas/:id', resenaController.eliminarResena);

// Recurso derivado: promedio de calificación de un producto
router.get('/productos/:id/promedio', resenaController.obtenerPromedio);

module.exports = router;
