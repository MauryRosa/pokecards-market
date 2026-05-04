const express = require('express')
const cors    = require('cors')

// Importa las rutas
const paypalRoutes    = require('./routes/paypal')
const purchaseRoutes  = require('./routes/purchases')
const errorHandler    = require('./middleware/errorHandler')

const app = express()

// ── Middlewares globales ──────────────────────────────────────
// Permite peticiones solo desde el frontend
app.use(cors({ origin: process.env.FRONTEND_URL }))

// Parsea el body de las peticiones como JSON
app.use(express.json())

// ── Rutas ─────────────────────────────────────────────────────
app.use('/api/paypal',    paypalRoutes)
app.use('/api/purchases', purchaseRoutes)

// Ruta de salud para verificar que el server está activo
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// ── Manejador de errores (siempre al final) ───────────────────
app.use(errorHandler)

module.exports = app