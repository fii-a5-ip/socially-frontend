import { useParams, Link } from 'react-router-dom'
import './GroupDetail.css'

/**
 * GroupDetail — Pagina detaliată a unui grup.
 *
 * Responsabili: Daria + Sasha
 *
 * TODO:
 * - Header cu numele grupului, imagine, descriere
 * - Lista membrilor
 * - Feed de activitate / evenimente planificate
 * - Chat / discuții de grup
 * - Setări grup (pentru admin)
 * - Buton de părăsire grup
 * - Design responsive
 */
function GroupDetail() {
  const { groupId } = useParams()

  return (
    <div className="page-skeleton">
      <span className="page-skeleton__icon">📋</span>
      <h1 className="page-skeleton__title">Detalii Grup</h1>
      <p className="page-skeleton__subtitle">
        Pagina grupului cu ID: <code>{groupId}</code> — în curs de dezvoltare
      </p>
      <span className="page-skeleton__assignee">👤 Responsabili: Daria + Sasha</span>
      <span className="page-skeleton__route">Ruta: /groups/:groupId</span>
      <Link to="/groups" className="btn btn--secondary" style={{ marginTop: '1.5rem' }}>
        ← Înapoi la grupuri
      </Link>
    </div>
  )
}

export default GroupDetail
