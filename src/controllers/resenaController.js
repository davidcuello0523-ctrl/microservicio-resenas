const resenaModel = require('../models/resenaModel');

/**
 * Capa de lógica de negocio: valida entradas, aplica reglas mínimas
 * y traduce resultados/errores a respuestas HTTP correctas.
 */

// POST /resenas
async function crearResena(req, res) {
  try {
    const { producto_id, usuario_id, calificacion, comentario } = req.body;

    // Validación de campos obligatorios
    if (producto_id === undefined || usuario_id === undefined || calificacion === undefined) {
      return res.status(400).json({
        error: 'Campos obligatorios faltantes: producto_id, usuario_id y calificacion son requeridos',
      });
    }

    // Validación de tipos
    if (
      !Number.isInteger(producto_id) ||
      !Number.isInteger(usuario_id) ||
      !Number.isInteger(calificacion)
    ) {
      return res.status(400).json({
        error: 'producto_id, usuario_id y calificacion deben ser números enteros',
      });
    }

    // Regla de negocio: calificación entre 1 y 5
    if (calificacion < 1 || calificacion > 5) {
      return res.status(400).json({ error: 'La calificación debe estar entre 1 y 5' });
    }

    // Validación de tipo para comentario (opcional)
    if (comentario !== undefined && typeof comentario !== 'string') {
      return res.status(400).json({ error: 'El comentario debe ser un texto' });
    }

    const nuevaResena = await resenaModel.crearResena({
      producto_id,
      usuario_id,
      calificacion,
      comentario,
    });

    return res.status(201).json(nuevaResena);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error interno del servidor al crear la reseña' });
  }
}

// GET /resenas?producto_id=X
async function obtenerResenas(req, res) {
  try {
    const { producto_id } = req.query;

    if (!producto_id) {
      return res.status(400).json({ error: 'El parámetro producto_id es obligatorio' });
    }

    if (!Number.isInteger(Number(producto_id))) {
      return res.status(400).json({ error: 'producto_id debe ser un número entero' });
    }

    const resenas = await resenaModel.obtenerResenasPorProducto(Number(producto_id));
    return res.status(200).json(resenas);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error interno del servidor al obtener las reseñas' });
  }
}

// DELETE /resenas/{id}
async function eliminarResena(req, res) {
  try {
    const { id } = req.params;

    if (!Number.isInteger(Number(id))) {
      return res.status(400).json({ error: 'El id debe ser un número entero' });
    }

    const existente = await resenaModel.obtenerResenaPorId(Number(id));
    if (!existente) {
      return res.status(404).json({ error: `No existe una reseña con id ${id}` });
    }

    await resenaModel.eliminarResena(Number(id));
    return res.status(200).json({ mensaje: `Reseña ${id} eliminada correctamente` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error interno del servidor al eliminar la reseña' });
  }
}

// GET /productos/{id}/promedio
async function obtenerPromedio(req, res) {
  try {
    const { id } = req.params;

    if (!Number.isInteger(Number(id))) {
      return res.status(400).json({ error: 'El id del producto debe ser un número entero' });
    }

    const resultado = await resenaModel.obtenerPromedioPorProducto(Number(id));

    if (!resultado || resultado.total_resenas === 0) {
      return res.status(404).json({ error: `No hay reseñas registradas para el producto ${id}` });
    }

    return res.status(200).json({
      producto_id: Number(id),
      total_resenas: resultado.total_resenas,
      promedio: Number(resultado.promedio.toFixed(2)),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error interno del servidor al calcular el promedio' });
  }
}

module.exports = {
  crearResena,
  obtenerResenas,
  eliminarResena,
  obtenerPromedio,
};
