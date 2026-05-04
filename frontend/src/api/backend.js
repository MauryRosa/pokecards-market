import axios from 'axios'

// URL del backend (definida en .env)
const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'

// Crea una orden de pago en PayPal a través del backend
export const createPayPalOrder = async (price, pokemonName) => {
  const { data } = await axios.post(`${API}/api/paypal/create-order`, { price, pokemonName })
  return data.orderID
}

// Confirma el pago y registra la compra en la base de datos
export const capturePayPalOrder = async ({ orderID, sessionId, pokemon, price }) => {
  const { data } = await axios.post(`${API}/api/paypal/capture-order`, {
    orderID,
    sessionId,
    pokemonId:   pokemon.id,
    pokemonName: pokemon.name,
    price,
  })
  return data
}

// Trae las cartas compradas de un usuario por su sessionId
export const getPurchases = async (sessionId) => {
  const { data } = await axios.get(`${API}/api/purchases/${sessionId}`)
  return data
}