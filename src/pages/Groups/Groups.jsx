import { Link } from 'react-router-dom'
import './Groups.css'

/**
 * Groups — Pagina cu lista de grupuri.
 *
 * Responsabil: Denisa
 *
 * TODO:
 * - Lista de grupuri ale utilizatorului
 * - Card per grup (nume, membri, ultima activitate)
 * - Buton "Creează grup nou" → /groups/create
 * - Căutare / filtrare grupuri
 * - Empty state (când nu ești în niciun grup)
 * - Design responsive
 */
function Groups() {
  return (
    <div className="page-skeleton">
      <span className="page-skeleton__icon">👥</span>
      <h1 className="page-skeleton__title">Grupurile mele</h1>
      <p className="page-skeleton__subtitle">Lista grupurilor tale — în curs de dezvoltare</p>
      <span className="page-skeleton__assignee">👤 Responsabil: Denisa</span>
      <span className="page-skeleton__route">Ruta: /groups</span>
      <Link to="/groups/create" className="btn btn--primary" style={{ marginTop: '1.5rem' }}>
        + Creează un grup nou
      </Link>
    </div>
  )
}

export default Groups
