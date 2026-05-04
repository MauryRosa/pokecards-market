import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PurchaseProvider } from './context/PurchaseContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Collection from './pages/Collection'

function App() {
  return (
    // BrowserRouter habilita la navegación entre páginas
    <BrowserRouter>
      {/* PurchaseProvider comparte el estado de compras en toda la app */}
      <PurchaseProvider>
        {/* Navbar siempre visible en todas las páginas */}
        <Navbar />

        {/* Rutas de la aplicación */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
        </Routes>
      </PurchaseProvider>
    </BrowserRouter>
  )
}

export default App