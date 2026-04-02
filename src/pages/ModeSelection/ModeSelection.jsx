import { Link } from 'react-router-dom'
import './ModeSelection.css'

/**
 * ModeSelection — Pagina de selecție mod: Groups vs Solo Discovering.
 *
 * Responsabil: Criss
 *
 * TODO:
 * - Design cu 2 carduri mari (Groups / Solo Discovering)
 * - Animații la hover
 * - Descriere scurtă pentru fiecare mod
 * - Iconuri / ilustrații relevante
 * - Design responsive
 */
function ModeSelection() {
  return (
    <div className="mode-selection">
      <div className="container">
        <h1 className="mode-selection__title">Cum vrei să explorezi?</h1>
        <p className="mode-selection__subtitle">Alege modul tău preferat</p>

        <div className="mode-selection__grid">
          <Link to="/groups" className="mode-selection__card card">
            <span className="mode-selection__icon">👥</span>
            <h2>Grupuri</h2>
            <p>Organizează ieșiri cu prietenii tăi în grupuri.</p>
          </Link>

          <Link to="/discover" className="mode-selection__card card">
            <span className="mode-selection__icon">🧭</span>
            <h2>Solo Discovering</h2>
            <p>Explorează locuri noi pe cont propriu.</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ModeSelection
