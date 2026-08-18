const db = require('../config/database');

/**
 * Capa de acceso a datos (Data Access Layer) para la entidad "resena".
 * Toda interacción directa con SQLite vive aquí.
 */

function crearResena({ producto_id, usuario_id, calificacion, comentario }) {
  return new Promise((resolve, reject) => {
    const fecha = new Date().toISOString();
    const sql = `
      INSERT INTO resenas (producto_id, usuario_id, calificacion, comentario, fecha)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.run(sql, [producto_id, usuario_id, calificacion, comentario || null, fecha], function (err) {
      if (err) return reject(err);
      resolve({ id: this.lastID, producto_id, usuario_id, calificacion, comentario: comentario || null, fecha });
    });
  });
}

function obtenerResenasPorProducto(producto_id) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM resenas WHERE producto_id = ? ORDER BY fecha DESC`;
    db.all(sql, [producto_id], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function obtenerResenaPorId(id) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM resenas WHERE id = ?`, [id], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function eliminarResena(id) {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM resenas WHERE id = ?`, [id], function (err) {
      if (err) return reject(err);
      resolve(this.changes); // número de filas eliminadas
    });
  });
}

function obtenerPromedioPorProducto(producto_id) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT
        COUNT(*) AS total_resenas,
        AVG(calificacion) AS promedio
      FROM resenas
      WHERE producto_id = ?
    `;
    db.get(sql, [producto_id], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

module.exports = {
  crearResena,
  obtenerResenasPorProducto,
  obtenerResenaPorId,
  eliminarResena,
  obtenerPromedioPorProducto,
};
