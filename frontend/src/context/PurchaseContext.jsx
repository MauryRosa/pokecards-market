import { createContext, useContext, useState, useEffect } from 'react'
import { getPurchases } from '../api/backend'

const PurchaseContext = createContext()

// Genera o recupera el ID único de sesión del usuario
const getSessionId = () => {
  let id = localStorage.getItem('pokecards_session')
  if (!id) {
    // Crea un ID único basado en tiempo y número aleatorio
    id = `session_${Date.now()}_${Math.random().toString(36).slice(2)}`
    localStorage.setItem('pokecards_session', id)
  }
  return id
}

export const PurchaseProvider = ({ children }) => {
  const [sessionId] = useState(getSessionId)

  // Set con los IDs de pokémon ya comprados
  const [purchasedIds, setPurchasedIds] = useState(new Set())

  // Lista completa de compras (para la página "Mi Colección")
  const [purchases, setPurchases] = useState([])

  // Al cargar la app, trae las compras guardadas en la BD
  useEffect(() => {
    getPurchases(sessionId)
      .then(data => {
        setPurchases(data)
        // Convierte la lista en un Set de IDs para búsqueda rápida
        setPurchasedIds(new Set(data.map(p => p.pokemon_id)))
      })
      .catch(err => console.error('Error cargando compras:', err))
  }, [sessionId])

  // Agrega una nueva compra al estado local (sin recargar de la BD)
  const markAsPurchased = (pokemonId, purchaseData) => {
    setPurchasedIds(prev => new Set([...prev, pokemonId]))
    setPurchases(prev => [purchaseData, ...prev])
  }

  return (
    <PurchaseContext.Provider value={{ sessionId, purchasedIds, purchases, markAsPurchased }}>
      {children}
    </PurchaseContext.Provider>
  )
}

// Hook personalizado para acceder fácilmente al contexto
export const usePurchase = () => useContext(PurchaseContext)