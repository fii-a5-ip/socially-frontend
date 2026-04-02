import { Link } from 'react-router-dom'
import './Landing.css'

/**
 * Landing — Pagina de landing când utilizatorul nu este logat.
 *
 * Responsabili: Ruxi + Ioana
 *
 * TODO:
 * - Hero section cu titlu și descriere atractivă
 * - CTA-uri (Call to Action) pentru înregistrare/conectare
 * - Secțiuni cu features ale aplicației
 * - Testimoniale / Social proof
 * - Design responsive
 */
function Landing() {
  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="landing__hero">
        <div className="container">
          <h1 className="landing__title">
            Descoperă ieșiri inteligente
            <span className="landing__title-accent"> cu prietenii tăi</span>
          </h1>
          <p className="landing__subtitle">
            Socially te ajută să organizezi și să descoperi cele mai tari ieșiri,
            fie că ești cu grupul, fie că explorezi singur.
          </p>
          <div className="landing__cta">
            <Link to="/register" className="btn btn--primary btn--large">
              Începe acum
            </Link>
            <Link to="/login" className="btn btn--secondary btn--large">
              Am deja cont
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section — TODO: Ruxi + Ioana */}
      <section className="landing__features">
        <div className="container">
          <h2 className="landing__section-title">De ce Socially?</h2>
          <div className="landing__features-grid">
            <div className="card">
              <span className="landing__feature-icon">👥</span>
              <h3>Grupuri</h3>
              <p>Creează grupuri și planifică ieșiri împreună cu prietenii.</p>
            </div>
            <div className="card">
              <span className="landing__feature-icon">🧭</span>
              <h3>Solo Discovering</h3>
              <p>Explorează locuri noi pe cont propriu, cu recomandări inteligente.</p>
            </div>
            <div className="card">
              <span className="landing__feature-icon">🔔</span>
              <h3>Notificări</h3>
              <p>Fii la curent cu toate evenimentele și invitațiile.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Landing
