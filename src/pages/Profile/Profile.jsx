import { useState, useEffect } from 'react'
import ProfileEditForm from './components/ProfileEditForm'
import ProfileView from './components/ProfileView'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { useTranslation } from '../../hooks/useTranslation'
import { API_URL } from '../../api/config'
import './Profile.css'
import flagRO from '../../assets/flag-ro.png'
import flagEN from '../../assets/flag-en.png'

function Profile() {
  const { t } = useTranslation()
  const [istoricExtins, setIstoricExtins] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const { logout, lang, setLang } = useApp()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const [profileData, setProfileData] = useState({
    nume: localStorage.getItem("current_fullname") || localStorage.getItem("current_username") || '',
    email: localStorage.getItem("current_email") || '',
    bio: '',
    buget: '200',
    avatarUrl: null
  })

  const [groupsCount, setGroupsCount] = useState(0)
  const [activitatiComplete, setActivitatiComplete] = useState([])
  const [totalOutings, setTotalOutings] = useState(0)
  const [aiScore, setAiScore] = useState(0)

  useEffect(() => {
    if (!token) return

    // Fetch user info
    fetch(`${API_URL}/api/users/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        let n = data.fullname || ''
        if (!n && (data.firstname || data.lastname)) {
          n = `${data.firstname || ''} ${data.lastname || ''}`.trim()
        }

        setProfileData(prev => ({
          ...prev,
          nume: n || prev.nume,
          email: data.email || prev.email,
          bio: data.bio || prev.bio,
          buget: data.buget || prev.buget,
          avatarUrl: data.avatarUrl || prev.avatarUrl
        }))

        if (data.aiScore) setAiScore(data.aiScore)
        if (data.totalOutings) setTotalOutings(data.totalOutings)
      })
      .catch(e => {
        console.error('Error fetching user (endpoint might not exist):', e)
        // Daca pica, pastram datele din localStorage care sunt deja in state
      })

    // Fetch groups count
    fetch(`${API_URL}/api/groups`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setGroupsCount(data.length)
        }
      })
      .catch(e => console.error('Error fetching groups:', e))

    // Fetch history
    fetch(`${API_URL}/api/activities/history`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setActivitatiComplete(data)
          setTotalOutings(data.length)
        }
      })
      .catch(e => console.error('Error fetching history:', e))
  }, [token])



  const deAfisat = istoricExtins ? activitatiComplete : activitatiComplete.slice(0, 3)

  const handleSave = (newProfileData) => {
    if (!token) return

    let splitName = newProfileData.nume.split(' ')
    let bodyData = {
      firstname: splitName[0],
      lastname: splitName.slice(1).join(' '),
      bio: newProfileData.bio,
      buget: newProfileData.buget
    }

    fetch(`${API_URL}/api/users/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(bodyData)
    })
      .then(res => {
        if (!res.ok) throw new Error('Save failed')
        return res.json()
      })
      .then(() => {
        setProfileData(newProfileData)
        setIsEditing(false)
      })
      .catch(e => console.error('Error saving profile:', e))
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
              <div className="stat-row"><span>{t('profile.stats.active_groups')}</span> <strong>{groupsCount}</strong></div>
              <div className="stat-row"><span>{t('profile.stats.total_outings')}</span> <strong>{totalOutings}</strong></div>
              <div className="stat-row">
                <span>
                  {t('profile.stats.ai_score')}
                  <span className="ai-tooltip-trigger">
                    ❓
                    <span className="ai-tooltip-text">{t('profile.stats.ai_tooltip')}</span>
                  </span>
                </span>
                <strong>{aiScore}%</strong>
              </div>
            </div>

            <div className="profile-section">
              <h3 className="side-title">{t('profile.history.title')}</h3>
              <ul className="history-list">
                {deAfisat.length > 0 ? (
                  deAfisat.map((act, i) => <li key={i}>{act}</li>)
                ) : (
                  <li className="history-empty">Nu există activități recente.</li>
                )}
              </ul>
              {activitatiComplete.length > 3 && (
                <button type="button" className="btn-history-more" onClick={() => setIstoricExtins(!istoricExtins)}>
                  {istoricExtins ? t('profile.history.less') : t('profile.history.more')}
                </button>
              )}
            </div>

            <div className="profile-section">
              <h3 className="side-title">🌐 {lang === 'RO' ? 'Limbă' : 'Language'}</h3>
              <div className="lang-selector-profile">
                <button 
                  className={`lang-option ${lang === 'RO' ? 'active' : ''}`} 
                  onClick={() => setLang('RO')}
                >
                  <img src={flagRO} alt="RO" />
                  <span>Română</span>
                </button>
                <button 
                  className={`lang-option ${lang === 'EN' ? 'active' : ''}`} 
                  onClick={() => setLang('EN')}
                >
                  <img src={flagEN} alt="EN" />
                  <span>English</span>
                </button>
              </div>
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