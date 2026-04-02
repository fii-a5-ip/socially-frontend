import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

/**
 * Navbar — Componentă pentru navigarea principală.
 *
 * TODO (Elina + Mircea):
 * - Adăugați logo-ul aplicației
 * - Implementați meniul responsive (hamburger pe mobile)
 * - Adăugați starea de utilizator logat/nelogat
 * - Stilizați conform design-ului final
 */
function Navbar() {
  const location = useLocation()

  const isActive = (path) => location.pathname === path ? 'navbar__link--active' : ''

  return (
    <nav className="navbar">
      <div className="navbar__container container">
        <Link to="/" className="navbar__logo">
          🎉 Socially
        </Link>

        <div className="navbar__links">
          <Link to="/" className={`navbar__link ${isActive('/')}`}>
            Acasă
          </Link>
          <Link to="/mode" className={`navbar__link ${isActive('/mode')}`}>
            Explorează
          </Link>
        </div>

        <div className="navbar__actions">
          <Link to="/login" className="btn btn--secondary">
            Conectare
          </Link>
          <Link to="/register" className="btn btn--primary">
            Înregistrare
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
