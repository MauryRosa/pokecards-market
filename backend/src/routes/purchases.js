const express  = require('express')
const router   = express.Router()
const { getPurchasesBySession } = require('../controllers/purchaseController')

// GET /api/purchases/:sessionId → Cartas compradas de un usuario
router.get('/:sessionId', getPurchasesBySession)

module.exports = router