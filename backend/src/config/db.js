const { Pool } = require('pg')

// Pool de conexiones reutilizables a PostgreSQL en Neon.tech
// Un pool es más eficiente que abrir/cerrar conexión en cada query
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Requerido por Neon.tech (conexión segura)
  max: 10,                            // Máximo 10 conexiones simultáneas
  idleTimeoutMillis: 30000,           // Cierra conexiones inactivas a los 30s
})

// Prueba la conexión al iniciar
pool.connect()
  .then(client => {
    console.log('✅ Conectado a PostgreSQL (Neon.tech)')
    client.release() // Devuelve la conexión al pool
  })
  .catch(err => console.error('❌ Error conectando a la BD:', err.message))

// Función helper: ejecuta un query y devuelve las filas
const query = (text, params) => pool.query(text, params)

module.exports = { query }