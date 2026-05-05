import { useState, useEffect } from 'react'
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
    nume: '',
    email: '',
    bio: '',
    buget: '200',
    avatarUrl: null
  })

  const [groupsCount, setGroupsCount] = useState(0)
  const [activitatiComplete, setActivitatiComplete] = useState([])
  const [totalOutings, setTotalOutings] = useState(0)
  const [aiScore, setAiScore] = useState(0)

  useEffect(() => {
    fetch('http://localhost:8080/api/users/me')
      .then(res => res.json())
      .then(data => {
        let n = ''
        if (data.firstname) n += data.firstname
        if (data.lastname) n += ' ' + data.lastname

        setProfileData({
          nume: n,
          email: data.email,
          bio: data.bio,
          buget: data.buget || '200',
          avatarUrl: data.avatarUrl || null
        })

        if (data.aiScore) setAiScore(data.aiScore)
        if (data.totalOutings) setTotalOutings(data.totalOutings)
      })
      .catch(e => console.log(e))

    fetch('http://localhost:8080/api/groups')
      .then(res => res.json())
      .then(data => {
        if (data && data.length) {
          setGroupsCount(data.length)
        } else {
          setGroupsCount(0)
        }
      })
      .catch(e => console.log(e))

    fetch('http://localhost:8080/api/activities/history')
      .then(res => res.json())
      .then(data => {
        if (data && data.length) {
          setActivitatiComplete(data)
          setTotalOutings(data.length)
        } else {
          setActivitatiComplete([])
          setTotalOutings(0)
        }
      })
      .catch(e => console.log(e))
  }, [])



  const deAfisat = istoricExtins ? activitatiComplete : activitatiComplete.slice(0, 3)

  const handleSave = (newProfileData) => {
    let splitName = newProfileData.nume.split(' ')
    let bodyData = {
      firstname: splitName[0],
      lastname: splitName.slice(1).join(' '),
      bio: newProfileData.bio
    }

    fetch('http://localhost:8080/api/users/me', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyData)
    })
      .then(res => res.json())
      .then(data => {
        setProfileData(newProfileData)
        setIsEditing(false)
      })
      .catch(e => console.log(e))
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