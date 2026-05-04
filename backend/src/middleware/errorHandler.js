// Middleware global de errores
// Express lo reconoce por tener 4 parámetros: (err, req, res, next)
const errorHandler = (err, req, res, next) => {
  // Muestra el error en la terminal para debugging
  console.error('❌ Error:', err.message)

  // Si el error viene de PayPal, puede traer info extra
  const statusCode = err.status || err.response?.status || 500
  const message    = err.message || 'Error interno del servidor'

  res.status(statusCode).json({ error: message })
}

module.exports = errorHandler