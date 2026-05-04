import axios from 'axios'

const BASE = 'https://pokeapi.co/api/v2'

// Precio asignado según el tipo del pokémon
const PRICE_BY_TYPE = {
  dragon: 9.99, psychic: 7.99, ghost: 6.99,
  fire: 5.99,  electric: 5.49, ice: 4.99,
  dark: 4.49,  water: 3.99,   grass: 3.49,
  fighting: 3.49, rock: 2.99, normal: 1.99,
}

// Obtiene los detalles completos de un pokémon
const fetchDetail = async (url) => {
  const { data } = await axios.get(url)
  const type = data.types[0].type.name
  return {
    id: data.id,
    name: data.name,
    type,
    // Imagen oficial de alta calidad
    image: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
    price: PRICE_BY_TYPE[type] ?? 2.99,
    hp:     data.stats.find(s => s.stat.name === 'hp')?.base_stat     ?? 50,
    attack: data.stats.find(s => s.stat.name === 'attack')?.base_stat ?? 50,
    defense:data.stats.find(s => s.stat.name === 'defense')?.base_stat?? 50,
  }
}

// Trae 25 pokémon de la API en paralelo (Promise.all = más rápido)
export const fetchPokemons = async (limit = 25) => {
  const { data } = await axios.get(`${BASE}/pokemon?limit=${limit}&offset=0`)
  return Promise.all(data.results.map(p => fetchDetail(p.url)))
}