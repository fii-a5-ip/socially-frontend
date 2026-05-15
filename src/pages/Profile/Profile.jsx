import { useState, useEffect } from 'react'
import ProfileEditForm from './components/ProfileEditForm'
import ProfileView from './components/ProfileView'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { useTranslation } from '../../hooks/useTranslation'
import { API_URL } from '../../api/config'
import './Profile.css'

function Profile() {
  const { t, lang } = useTranslation()
  const [istoricExtins, setIstoricExtins] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { logout } = useApp()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const [profileData, setProfileData] = useState({
    id: null,
    nume: localStorage.getItem("current_fullname") || 'Utilizator',
    email: localStorage.getItem("current_email") || '',
    bio: '',
    avatarUrl: null
  })

  const [groupsCount, setGroupsCount] = useState(0)
  const [activitatiComplete, setActivitatiComplete] = useState([])
  const [totalOutings, setTotalOutings] = useState(0)
  const [aiScore, setAiScore] = useState(98)
  
  const [availableFilters, setAvailableFilters] = useState([
    { id: 1, name: 'sport' },
    { id: 2, name: 'muzica' },
    { id: 3, name: 'tech' },
    { id: 4, name: 'travel' },
    { id: 5, name: 'art' }
  ])
  const [selectedFilters, setSelectedFilters] = useState([])

  useEffect(() => {
    if (!token) {
      setIsLoading(false)
      return
    }

    const headers = { 'Authorization': `Bearer ${token}` }

    // Pasul 1: Luam profilul "me" pentru a afla ID-ul si datele de baza
    fetch(`${API_URL}/api/users/me`, { headers })
      .then(res => res.json())
      .then(userData => {
        setProfileData({
          id: userData.id,
          nume: userData.fullname || `${userData.firstname || ''} ${userData.lastname || ''}`.trim() || profileData.nume,
          email: userData.email || profileData.email,
          bio: userData.bio || '',
          avatarUrl: userData.avatarUrl || null
        })
        if (userData.aiScore) setAiScore(userData.aiScore)

        // Pasul 2: Acum ca avem ID-ul, luam filtrele specifice ale userului (cerinta Cris/SM)
        return fetch(`${API_URL}/api/users/${userData.id}/filters`, { headers })
          .then(res => res.json())
          .then(userFilters => {
            if (Array.isArray(userFilters)) {
              setSelectedFilters(userFilters.map(f => f.id))
            }
          })
          .catch(err => console.log('Eroare fetch user filters:', err))
      })
      .catch(err => console.log('Eroare fetch me:', err))
      .finally(() => {
        // Pasul 3: Luam lista globala de filtre pentru selector
        Promise.allSettled([
          fetch(`${API_URL}/api/filters`, { headers }).then(res => res.json()),
          fetch(`${API_URL}/api/groups`, { headers }).then(res => res.json()),
          fetch(`${API_URL}/api/activities/history`, { headers }).then(res => res.json())
        ]).then((results) => {
          const [filtersRes, groupsRes, historyRes] = results

          if (filtersRes.status === 'fulfilled' && Array.isArray(filtersRes.value) && filtersRes.value.length > 0) {
            setAvailableFilters(filtersRes.value)
          }
          if (groupsRes.status === 'fulfilled' && Array.isArray(groupsRes.value)) {
            setGroupsCount(groupsRes.value.length)
          }
          if (historyRes.status === 'fulfilled' && Array.isArray(historyRes.value)) {
            setActivitatiComplete(historyRes.value)
            setTotalOutings(historyRes.value.length)
          }
        }).finally(() => {
          setIsLoading(false)
        })
      })
  }, [token])

  const deAfisat = istoricExtins ? activitatiComplete : activitatiComplete.slice(0, 3)

  const handleSave = (newProfileData) => {
    if (!token) return

    const payload = {
      email: newProfileData.email,
      bio: newProfileData.bio,
      profilePictureUrl: profileData.avatarUrl,
      filterIds: selectedFilters
    }

    fetch(`${API_URL}/api/users/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) throw new Error('Update failed')
        return res.json()
      })
      .then(data => {
        setProfileData({
          ...newProfileData,
          nume: data.fullname || newProfileData.nume
        })
        setIsEditing(false)
      })
      .catch(err => {
        console.log('Eroare salvare, se aplică local', err)
        setProfileData(newProfileData)
        setIsEditing(false)
      })
  }

  const toggleFilter = (id) => {
    if (selectedFilters.includes(id)) {
      setSelectedFilters(selectedFilters.filter(fid => fid !== id))
    } else {
      setSelectedFilters([...selectedFilters, id])
    }
  }

  const handleLogout = () => {
    logout()
    window.scrollTo(0, 0)
    navigate('/')
  }

  const getInterestLabel = (name) => {
    if (!name) return '';
    const normalized = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '');
    const translation = t(`interest.${normalized}`);
    return translation === `interest.${normalized}` ? name : translation;
  }

  if (isLoading) {
    return <div className="loading-profile">{t('profile.interests.loading')}</div>
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
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <>
                <ProfileView
                  data={profileData}
                  onEdit={() => setIsEditing(true)}
                />
                
                <div className="profile-interests-section">
                  <h3 className="section-subtitle">{t('profile.interests.title')}</h3>
                  <div className="interests-grid">
                    {availableFilters.map(filter => (
                      <button
                        key={filter.id}
                        className={`interest-tag ${selectedFilters.includes(filter.id) ? 'active' : ''}`}
                        onClick={() => toggleFilter(filter.id)}
                      >
                        {getInterestLabel(filter.name)}
                      </button>
                    ))}
                  </div>
                  <button className="btn-save-interests" onClick={() => handleSave(profileData)}>
                    {t('profile.interests.save')}
                  </button>
                </div>
              </>
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
                  <li className="history-empty">{t('history.empty')}</li>
                )}
              </ul>
              {activitatiComplete.length > 3 && (
                <button type="button" className="btn-history-more" onClick={() => setIstoricExtins(!istoricExtins)}>
                  {istoricExtins ? t('profile.history.less') : t('profile.history.more')}
                </button>
              )}
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