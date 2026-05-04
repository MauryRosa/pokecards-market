const express  = require('express')
const router   = express.Router()
const { createOrder, captureOrder } = require('../controllers/paypalController')

// POST /api/paypal/create-order  → Crea la orden en PayPal Sandbox
router.post('/create-order',  createOrder)

// POST /api/paypal/capture-order → Captura el pago y lo guarda en la BD
router.post('/capture-order', captureOrder)

module.exports = router