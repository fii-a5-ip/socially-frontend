import { useState } from 'react'
import { useForm } from '../../hooks/useForm'
import { validateRequired, validateEmail } from '../../utils/validation'
import FormInput from '../../components/FormInput/FormInput'
import './Profile.css'

function Profile() {
  const [istoricExtins, setIstoricExtins] = useState(false)

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useForm(
    {
      nume: 'Ștefan XNS',
      email: 'stefan.xns@exemplu.com',
      bio: '',
      buget: '200'
    },
    {
      nume: (v) => validateRequired(v, 'Numele'),
      email: (v) => validateEmail(v),
    },
    (values) => {
      alert('Profil salvat cu succes!')
    }
  )

  const handleBioKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
  }

  const activitatiComplete = [
    '⚽ Fotbal Sintetic - 02 Apr',
    '🍔 Burger Van - 28 Mar',
    '🍿 Dune: Part Two - 20 Mar',
    '☕ Coffee Time - 15 Mar',
    '🎳 Bowling Night - 10 Mar',
    '🍕 Pizza Party - 05 Mar'
  ]

  const deAfisat = istoricExtins ? activitatiComplete : activitatiComplete.slice(0, 3)

  return (
    <div className="profile-wrapper">
      <header className="profile-header">
        <div className="profile-container">
          <h1 className="profile-title">Profilul <span className="profile-accent">Meu</span></h1>
          <p className="profile-subtitle-mobile">Gestionează-ți preferințele de oriunde.</p>
        </div>
      </header>

      <main className="profile-main">
        <div className="profile-container profile-grid">
          <div className="profile-section">
            <h2 className="section-title">Editează Profil</h2>

            <div className="avatar-box">
              <div className="avatar-display">👤</div>
              <button type="button" className="btn-upload">Schimbă Poza</button>
            </div>

            <form onSubmit={handleSubmit}>
              <FormInput label="Nume Complet" name="nume" value={values.nume} error={errors.nume} touched={touched.nume} onChange={handleChange} onBlur={handleBlur} />
              <FormInput label="Email" name="email" value={values.email} error={errors.email} touched={touched.email} onChange={handleChange} onBlur={handleBlur} />

              <div className="form-group">
                <label className="input-label">Bio (max 50 caractere)</label>
                <div className="bio-container">
                  <textarea
                    name="bio"
                    className="profile-text"
                    value={values.bio}
                    onChange={handleChange}
                    onKeyDown={handleBioKeyDown}
                    maxLength="50"
                  />
                  <span className="bio-counter">{values.bio.length}/50</span>
                </div>
              </div>

              <div className="form-group">
                <label className="input-label">
                  Buget: {values.buget === '1000' ? 'Fără limită' : values.buget + ' RON'}
                </label>
                <input
                  type="range"
                  name="buget"
                  min="0" max="1000" step="50"
                  list="budget-steps"
                  className="profile-slider"
                  value={values.buget}
                  onChange={handleChange}
                />
                <datalist id="budget-steps">
                  <option value="0"></option>
                  <option value="250"></option>
                  <option value="500"></option>
                  <option value="750"></option>
                  <option value="1000"></option>
                </datalist>
              </div>

              <button type="submit" className="btn-save">Salvează Modificările</button>
            </form>
          </div>

          <aside className="profile-sidebar">
            <div className="profile-section">
              <h3 className="side-title">📊 Statistici</h3>
              <div className="stat-row"><span>Grupuri active</span> <strong>4</strong></div>
              <div className="stat-row"><span>Ieșiri totale</span> <strong>12</strong></div>
              <div className="stat-row">
                <span>
                  Scor AI
                  <span className="ai-tooltip-trigger">
                    ❓
                    <span className="ai-tooltip-text">Acesta reflectă gradul de aliniere a recomandărilor algoritmice cu preferințele tale individuale.</span>
                  </span>
                </span>
                <strong>98%</strong>
              </div>
            </div>

            <div className="profile-section">
              <h3 className="side-title">🕒 Istoric</h3>
              <ul className="history-list">
                {deAfisat.map((act, i) => <li key={i}>{act}</li>)}
              </ul>
              <button type="button" className="btn-history-more" onClick={() => setIstoricExtins(!istoricExtins)}>
                {istoricExtins ? 'Vezi mai puțin' : 'Vezi istoricul întreg'}
              </button>
            </div>

            <div className="profile-section">
              <h3 className="side-title">⚙️ Cont</h3>
              <div className="admin-actions">
                <button type="button" className="btn-secondary-profile">Schimbă parola</button>
                <button type="button" className="btn-danger-outline">Dezactivează contul</button>
                <button type="button" className="btn-logout">Deconectare</button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}

export default Profile