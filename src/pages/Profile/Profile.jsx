import { useState } from 'react'
import ProfileEditForm from './components/ProfileEditForm'
import ProfileView from './components/ProfileView'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { useTranslation } from '../../hooks/useTranslation'
import './Profile.css'

function Profile() {
  const { t } = useTranslation()
  const [istoricExtins, setIstoricExtins] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const { logout } = useApp()
  const navigate = useNavigate()

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

  const handleLogout = () => {
    logout()
    window.scrollTo(0, 0)
    navigate('/')
  }

  return (
    <div className="profile-wrapper">
      <header className="profile-header">
        <div className="profile-container">
          <h1 className="profile-title">{t('profile.title1')}<span className="profile-accent">{t('profile.title2')}</span></h1>
          <p className="profile-subtitle-mobile">{t('profile.subtitle')}</p>
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
              <h3 className="side-title">{t('profile.stats.title')}</h3>
              <div className="stat-row"><span>{t('profile.stats.active_groups')}</span> <strong>4</strong></div>
              <div className="stat-row"><span>{t('profile.stats.total_outings')}</span> <strong>12</strong></div>
              <div className="stat-row">
                <span>
                  {t('profile.stats.ai_score')}
                  <span className="ai-tooltip-trigger">
                    ❓
                    <span className="ai-tooltip-text">{t('profile.stats.ai_tooltip')}</span>
                  </span>
                </span>
                <strong>98%</strong>
              </div>
            </div>

            <div className="profile-section">
              <h3 className="side-title">{t('profile.history.title')}</h3>
              <ul className="history-list">
                {deAfisat.map((act, i) => <li key={i}>{act}</li>)}
              </ul>
              <button type="button" className="btn-history-more" onClick={() => setIstoricExtins(!istoricExtins)}>
                {istoricExtins ? t('profile.history.less') : t('profile.history.more')}
              </button>
            </div>

            <div className="profile-section">
              <h3 className="side-title">{t('profile.account.title')}</h3>
              <div className="admin-actions">
                <button type="button" className="btn-secondary-profile">{t('profile.account.change_pass')}</button>
                <button type="button" className="btn-logout" onClick={handleLogout}>{t('profile.account.logout')}</button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}

export default Profile