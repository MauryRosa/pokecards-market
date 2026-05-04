import { useState } from 'react'
import { usePurchase } from '../context/PurchaseContext'
import PurchaseModal from './PurchaseModal'
import './PokemonCard.css'

// Color de fondo según el tipo del pokémon
const TYPE_COLORS = {
  fire:     '#FF6B35', water:    '#4FC3F7', grass:    '#66BB6A',
  electric: '#FFD54F', psychic:  '#CE93D8', dragon:   '#7E57C2',
  ghost:    '#5C6BC0', dark:     '#546E7A', fighting: '#FF7043',
  normal:   '#BDBDBD', ice:      '#80DEEA', rock:     '#A1887F',
  poison:   '#AB47BC', ground:   '#D7CCC8', flying:   '#90CAF9',
  bug:      '#AED581', steel:    '#B0BEC5', fairy:    '#F48FB1',
}

const PokemonCard = ({ pokemon }) => {
  const { purchasedIds } = usePurchase()
  const [showModal, setShowModal] = useState(false)

  const isPurchased = purchasedIds.has(pokemon.id)
  const typeColor   = TYPE_COLORS[pokemon.type] || '#888'

  return (
    <>
      {/* La variable CSS --type-color se usa en el CSS de la carta */}
      <div
        className={`pokemon-card ${isPurchased ? 'purchased' : ''}`}
        style={{ '--type-color': typeColor }}
      >
        {/* Badge de adquirida (solo si fue comprada) */}
        {isPurchased && (
          <div className="card-badge">✅ Adquirida</div>
        )}

        {/* Contenedor de imagen con efecto blur si no fue comprada */}
        <div className="card-image-wrap">
          <img
            src={pokemon.image}
            alt={pokemon.name}
            className={`card-image ${!isPurchased ? 'locked' : ''}`}
          />
          {/* Candado encima de la imagen si no está comprada */}
          {!isPurchased && (
            <div className="lock-overlay">🔒</div>
          )}
        </div>

        {/* Información de la carta */}
        <div className="card-body">
          {/* Nombre del pokémon */}
          <h3 className="card-name">
            {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
          </h3>

          {/* Tipo con color dinámico */}
          <span className="card-type" style={{ background: typeColor }}>
            {pokemon.type}
          </span>

          {/* Stats: HP, ATK, DEF */}
          <div className="card-stats">
            <div className="stat">
              <span className="stat-label">HP</span>
              <span className="stat-value">{pokemon.hp}</span>
            </div>
            <div className="stat">
              <span className="stat-label">ATK</span>
              <span className="stat-value">{pokemon.attack}</span>
            </div>
            <div className="stat">
              <span className="stat-label">DEF</span>
              <span className="stat-value">{pokemon.defense}</span>
            </div>
          </div>

          {/* Precio */}
          <p className="card-price">${pokemon.price.toFixed(2)}</p>

          {/* Botón de comprar — oculto si ya fue adquirida */}
          {!isPurchased ? (
            <button className="btn-buy" onClick={() => setShowModal(true)}>
              🛒 Comprar
            </button>
          ) : (
            <div className="card-owned-label">En tu colección</div>
          )}
        </div>
      </div>

      {/* Modal de pago — se muestra cuando el usuario hace clic en Comprar */}
      {showModal && (
        <PurchaseModal
          pokemon={pokemon}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}

export default PokemonCard