const axios  = require('axios')
const { query } = require('../config/db')

// ── Helper: obtiene el token de acceso de PayPal ──────────────
// PayPal Sandbox requiere autenticación OAuth2 para cada sesión
const getAccessToken = async () => {
  const response = await axios.post(
    `${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`,
    'grant_type=client_credentials',  // Body en formato URL-encoded
    {
      // Autenticación básica con Client ID y Secret
      auth: {
        username: process.env.PAYPAL_CLIENT_ID,
        password: process.env.PAYPAL_CLIENT_SECRET,
      },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }
  )
  return response.data.access_token
}

// ── Crea una orden de pago en PayPal ─────────────────────────
// El frontend llama esto cuando el usuario hace clic en "Comprar"
const createOrder = async (req, res, next) => {
  try {
    const { price, pokemonName } = req.body

    // Valida que vengan los datos necesarios
    if (!price || !pokemonName) {
      return res.status(400).json({ error: 'Faltan datos: price y pokemonName son requeridos' })
    }

    const accessToken = await getAccessToken()

    // Crea la orden en la API de PayPal Sandbox
    const response = await axios.post(
      `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`,
      {
        intent: 'CAPTURE', // La orden se capturará (cobrar) cuando el usuario apruebe
        purchase_units: [{
          description: `PokéCard: ${pokemonName}`,
          amount: {
            currency_code: 'USD',
            value: Number(price).toFixed(2), // PayPal requiere 2 decimales
          },
        }],
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )

    // Devuelve el ID de la orden al frontend
    res.json({ orderID: response.data.id })

  } catch (error) {
    next(error) // Pasa el error al errorHandler
  }
}

// ── Captura el pago (lo confirma y cobra) ─────────────────────
// Se llama después de que el usuario aprobó el pago en PayPal
const captureOrder = async (req, res, next) => {
  try {
    const { orderID, sessionId, pokemonId, pokemonName, price } = req.body

    // Valida todos los campos requeridos
    if (!orderID || !sessionId || !pokemonId || !pokemonName || !price) {
      return res.status(400).json({ error: 'Faltan datos para confirmar la compra' })
    }

    const accessToken = await getAccessToken()

    // Captura el pago: esto es cuando PayPal realmente cobra al usuario
    const response = await axios.post(
      `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${orderID}/capture`,
      {},
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )

    const status = response.data.status // 'COMPLETED' si todo salió bien

    // Solo guarda en la BD si el pago fue exitoso
    if (status === 'COMPLETED') {
      await query(
        `INSERT INTO purchases
           (session_id, pokemon_id, pokemon_name, price, paypal_order_id, paypal_status)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (paypal_order_id) DO NOTHING`,
        // ON CONFLICT evita duplicados si el webhook llega dos veces
        [sessionId, pokemonId, pokemonName, price, orderID, status]
      )
    }

    // Responde al frontend con el estado del pago
    res.json({ status, orderID })

  } catch (error) {
    next(error)
  }
}

module.exports = { createOrder, captureOrder }