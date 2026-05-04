// Punto de entrada del servidor
require('dotenv').config() // Carga las variables del archivo .env
const app = require('./src/app')

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`)
})