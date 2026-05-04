import { usePurchase } from '../context/PurchaseContext'
import './Collection.css'

const Collection = () => {
  const { purchases } = usePurchase()

  if (purchases.length === 0) {
    return (
      <main className="collection-page">
        <div className="container">
          <div className="empty-collection">
            <p className="empty-icon">📦</p>
            <h2>Tu colección está vacía</h2>
            <p>Compra cartas en el mercado para verlas aquí.</p>
            <a href="/" className="btn-go-shop">Ir a explorar →</a>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="collection-page">
      <div className="container">
        <h1 className="collection-title">⭐ Mi Colección</h1>
        <p className="collection-count">{purchases.length} carta{purchases.length !== 1 ? 's' : ''} desbloqueada{purchases.length !== 1 ? 's' : ''}</p>

        {/* Grid de cartas adquiridas */}
        <div className="collection-grid">
          {purchases.map((p, i) => (
            <div key={p.paypal_order_id || i} className="collection-card">
              <div className="collection-img-wrap">
                {/* Imagen del pokémon (viene del objeto guardado en el contexto) */}
                <img src={p.image} alt={p.pokemon_name} className="collection-img" />
              </div>
              <div className="collection-info">
                <h3>{p.pokemon_name?.charAt(0).toUpperCase() + p.pokemon_name?.slice(1)}</h3>
                <span className="collection-type">{p.type}</span>
                <p className="collection-price">${Number(p.price).toFixed(2)}</p>
                <p className="collection-date">
                  🗓 {new Date(p.purchased_at).toLocaleDateString('es-SV', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </p>
              </div>
              <div className="collection-badge">✅ Adquirida</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export default Collection