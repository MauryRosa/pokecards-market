import { useState, useEffect } from 'react'
import { fetchPokemons } from '../api/pokeapi'
import PokemonCard from '../components/PokemonCard'
import LoadingSpinner from '../components/LoadingSpinner'
import './Home.css'

// Tipos disponibles para filtrar
const ALL_TYPES = [
  'todos', 'fire', 'water', 'grass', 'electric',
  'psychic', 'dragon', 'ghost', 'dark', 'normal',
]

const Home = () => {
  const [pokemons, setPokemons]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [filter, setFilter]       = useState('todos')
  const [search, setSearch]       = useState('')

  // Carga los pokémon al montar el componente
  useEffect(() => {
    fetchPokemons(25)
      .then(setPokemons)
      .catch(() => setError('No se pudieron cargar las cartas. Intenta de nuevo.'))
      .finally(() => setLoading(false))
  }, [])

  // Filtra por tipo y por búsqueda de texto
  const filtered = pokemons.filter(p => {
    const matchType   = filter === 'todos' || p.type === filter
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    return matchType && matchSearch
  })

  if (loading) return <LoadingSpinner />
  if (error)   return <div className="error-msg">{error}</div>

  return (
    <main className="home-page">
      <div className="container">
        {/* Encabezado hero */}
        <section className="hero">
          <h1 className="hero-title">🎴 PokéCards Market</h1>
          <p className="hero-subtitle">
            Colecciona y desbloquea cartas únicas de tus pokémon favoritos
          </p>
        </section>

        {/* Barra de búsqueda y filtros */}
        <div className="filters">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Buscar pokémon..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          {/* Botones de filtro por tipo */}
          <div className="type-filters">
            {ALL_TYPES.map(type => (
              <button
                key={type}
                className={`filter-btn ${filter === type ? 'active' : ''}`}
                onClick={() => setFilter(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Contador de resultados */}
        <p className="results-count">
          {filtered.length} carta{filtered.length !== 1 ? 's' : ''} encontrada{filtered.length !== 1 ? 's' : ''}
        </p>

        {/* Grid de cartas */}
        {filtered.length > 0 ? (
          <div className="cards-grid">
            {filtered.map(pokemon => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>😕 No se encontraron cartas con ese filtro.</p>
          </div>
        )}
      </div>
    </main>
  )
}

export default Home