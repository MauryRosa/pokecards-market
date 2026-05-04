const { query } = require('../config/db')

// GET /api/purchases/:sessionId
// Devuelve todas las cartas compradas por un usuario
const getPurchasesBySession = async (req, res, next) => {
  try {
    const { sessionId } = req.params

    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId es requerido' })
    }

    // Trae todas las compras de este usuario ordenadas por fecha descendente
    const result = await query(
      `SELECT
         id, pokemon_id, pokemon_name, price,
         paypal_order_id, paypal_status, purchased_at
       FROM purchases
       WHERE session_id = $1
       ORDER BY purchased_at DESC`,
      [sessionId]
    )

    res.json(result.rows)

  } catch (error) {
    next(error)
  }
}

module.exports = { getPurchasesBySession }