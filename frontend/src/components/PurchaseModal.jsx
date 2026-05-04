import { useState, useEffect } from 'react'
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import { capturePayPalOrder } from '../api/backend'
import { usePurchase } from '../context/PurchaseContext'
import './PurchaseModal.css'

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID

const PurchaseModal = ({ pokemon, onClose }) => {
  const { sessionId, markAsPurchased } = usePurchase()

  // Estado del proceso de pago: null | 'processing' | 'success' | 'error'
  const [status, setStatus] = useState(null)

  // Cierra el modal al presionar Escape
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // PayPal llama esta función para crear la orden — devuelve el orderID
  const handleCreateOrder = async () => {
    const { data } = await fetch
    // Usamos el SDK de PayPal directamente aquí para crear la orden
    return new Promise((resolve) => {
      // El orderID se crea en el backend via /api/paypal/create-order
      fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/paypal/create-order`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ price: pokemon.price, pokemonName: pokemon.name }),
      })
        .then(r => r.json())
        .then(d => resolve(d.orderID))
    })
  }

  // PayPal llama esta función cuando el usuario aprobó el pago
  const handleApprove = async (data) => {
    setStatus('processing')
    try {
      const result = await capturePayPalOrder({
        orderID:  data.orderID,
        sessionId,
        pokemon,
        price: pokemon.price,
      })

      if (result.status === 'COMPLETED') {
        // Actualiza el contexto global para que la carta aparezca desbloqueada
        markAsPurchased(pokemon.id, {
          pokemon_id:   pokemon.id,
          pokemon_name: pokemon.name,
          price:        pokemon.price,
          image:        pokemon.image,
          type:         pokemon.type,
          purchased_at: new Date().toISOString(),
        })
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    /* Fondo oscuro detrás del modal */
    <div className="modal-overlay" onClick={onClose}>
      {/* Caja del modal — stopPropagation evita que el clic lo cierre */}
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        {/* Botón cerrar */}
        <button className="modal-close" onClick={onClose}>✕</button>

        {/* Encabezado con imagen */}
        <div className="modal-header">
          <img src={pokemon.image} alt={pokemon.name} className="modal-pokemon-img" />
        </div>

        <div className="modal-content">
          <h2 className="modal-title">
            {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
          </h2>
          <p className="modal-subtitle">Carta coleccionable</p>
          <p className="modal-price">${pokemon.price.toFixed(2)} <span>USD</span></p>

          {/* ---- Estado: Éxito ---- */}
          {status === 'success' && (
            <div className="modal-status success">
              <span className="status-icon">🎉</span>
              <p>¡Pago exitoso! La carta fue desbloqueada y agregada a tu colección.</p>
              <button className="btn-close-modal" onClick={onClose}>
                Ver mi colección
              </button>
            </div>
          )}

          {/* ---- Estado: Error ---- */}
          {status === 'error' && (
            <div className="modal-status error">
              <span className="status-icon">❌</span>
              <p>El pago no se completó. La carta permanece bloqueada.</p>
              <button className="btn-close-modal error" onClick={() => setStatus(null)}>
                Intentar de nuevo
              </button>
            </div>
          )}

          {/* ---- Estado: Procesando ---- */}
          {status === 'processing' && (
            <div className="modal-status processing">
              <div className="mini-spinner" />
              <p>Verificando tu pago...</p>
            </div>
          )}

          {/* ---- Botón de PayPal (solo si no hay resultado aún) ---- */}
          {!status && (
            <div className="paypal-wrap">
              <PayPalScriptProvider
                options={{
                  clientId: PAYPAL_CLIENT_ID,
                  currency: 'USD',
                }}
              >
                <PayPalButtons
                  style={{ layout: 'vertical', color: 'gold', shape: 'pill', label: 'pay' }}
                  createOrder={handleCreateOrder}
                  onApprove={handleApprove}
                  onError={() => setStatus('error')}
                  onCancel={() => {}} // El usuario canceló, no hacemos nada
                />
              </PayPalScriptProvider>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PurchaseModal