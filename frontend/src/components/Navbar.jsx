import { Link, useLocation } from 'react-router-dom'
import { usePurchase } from '../context/PurchaseContext'
import './Navbar.css'

const Navbar = () => {
  const { purchases } = usePurchase()
  const { pathname } = useLocation()

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo / Marca */}
        <Link to="/" className="navbar-logo">
          🎴 PokéCards <span>Market</span>
        </Link>

        {/* Links de navegación */}
        <div className="navbar-links">
          <Link to="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>
            Explorar
          </Link>
          <Link to="/collection" className={`nav-link ${pathname === '/collection' ? 'active' : ''}`}>
            Mi Colección
            {/* Badge con cantidad de cartas compradas */}
            {purchases.length > 0 && (
              <span className="badge">{purchases.length}</span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar