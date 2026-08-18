# Evidencia de funcionamiento — microservicio-resenas

Pruebas ejecutadas localmente contra `http://localhost:3000` con `curl`, una petición exitosa (y casos de error relevantes) por cada endpoint.

## GET /health
**Request:** `curl http://localhost:3000/health`
**Response (200):**
```json
{"status":"ok","servicio":"microservicio-resenas"}
```

## POST /resenas — caso exitoso
**Request:**
```
POST /resenas
Content-Type: application/json

{"producto_id":101,"usuario_id":5,"calificacion":5,"comentario":"Excelente producto"}
```
**Response (201):**
```json
{"id":1,"producto_id":101,"usuario_id":5,"calificacion":5,"comentario":"Excelente producto","fecha":"2026-08-18T23:24:49.669Z"}
```

## POST /resenas — segundo registro exitoso
**Request:**
```json
{"producto_id":101,"usuario_id":7,"calificacion":3,"comentario":"Cumple lo esperado"}
```
**Response (201):**
```json
{"id":2,"producto_id":101,"usuario_id":7,"calificacion":3,"comentario":"Cumple lo esperado","fecha":"2026-08-18T23:24:49.678Z"}
```

## POST /resenas — validación: calificación fuera de rango
**Request:** `{"producto_id":101,"usuario_id":9,"calificacion":9}`
**Response (400):**
```json
{"error":"La calificación debe estar entre 1 y 5"}
```

## POST /resenas — validación: campos obligatorios faltantes
**Request:** `{"producto_id":101}`
**Response (400):**
```json
{"error":"Campos obligatorios faltantes: producto_id, usuario_id y calificacion son requeridos"}
```

## GET /resenas?producto_id=101
**Response (200):**
```json
[
  {"id":2,"producto_id":101,"usuario_id":7,"calificacion":3,"comentario":"Cumple lo esperado","fecha":"2026-08-18T23:24:49.678Z"},
  {"id":1,"producto_id":101,"usuario_id":5,"calificacion":5,"comentario":"Excelente producto","fecha":"2026-08-18T23:24:49.669Z"}
]
```

## GET /productos/101/promedio
**Response (200):**
```json
{"producto_id":101,"total_resenas":2,"promedio":4}
```

## GET /productos/999/promedio — sin reseñas
**Response (404):**
```json
{"error":"No hay reseñas registradas para el producto 999"}
```

## DELETE /resenas/1
**Response (200):**
```json
{"mensaje":"Reseña 1 eliminada correctamente"}
```

## DELETE /resenas/999 — id inexistente
**Response (404):**
```json
{"error":"No existe una reseña con id 999"}
```

> Nota: para la entrega, reemplaza este archivo (o complementa) con capturas de pantalla reales de Postman/Insomnia ejecutando estas mismas peticiones contra tu instancia local.
