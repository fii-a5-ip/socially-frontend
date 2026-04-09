import { useState } from 'react'
import ProfileEditForm from './components/ProfileEditForm'
import ProfileView from './components/ProfileView'
import './Profile.css'

function Profile() {
  const [istoricExtins, setIstoricExtins] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const [profileData, setProfileData] = useState({
    nume: 'Ștefan XNS',
    email: 'stefan.xns@exemplu.com',
    bio: '',
    buget: '200',
    avatarUrl: null
  })

  const activitatiComplete = [
    '⚽ Fotbal Sintetic - 02 Apr',
    '🍔 Burger Van - 28 Mar',
    '🍿 Dune: Part Two - 20 Mar',
    '☕ Coffee Time - 15 Mar',
    '🎳 Bowling Night - 10 Mar',
    '🍕 Pizza Party - 05 Mar'
  ]

  const deAfisat = istoricExtins ? activitatiComplete : activitatiComplete.slice(0, 3)

  const handleSave = (newProfileData) => {
    setProfileData(newProfileData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  return (
    <div className="profile-wrapper">
      <header className="profile-header">
        <div className="profile-container">
          <h1 className="profile-title">Profilul <span className="profile-accent">Meu</span></h1>
          <p className="profile-subtitle-mobile">Gestioneaza-ti preferintele de oriunde</p>
        </div>
      </header>

      <main className="profile-main">
        <div className="profile-container profile-grid">
          <div className="profile-section">
            {isEditing ? (
              <ProfileEditForm
                initialData={profileData}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            ) : (
              <ProfileView
                data={profileData}
                onEdit={() => setIsEditing(true)}
              />
            )}
          </div>

          <aside className="profile-sidebar">
            <div className="profile-section">
              <h3 className="side-title">📊 Statistici</h3>
              <div className="stat-row"><span>Grupuri active</span> <strong>4</strong></div>
              <div className="stat-row"><span>Iesiri totale</span> <strong>12</strong></div>
              <div className="stat-row">
                <span>
                  Scor AI
                  <span className="ai-tooltip-trigger">
                    ❓
                    <span className="ai-tooltip-text">Acesta reflecta gradul de aliniere a recomandarilor algoritmice cu preferintele tale individuale</span>
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