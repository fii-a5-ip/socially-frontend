import { useState, useEffect } from 'react'
import ProfileEditForm from './components/ProfileEditForm'
import ProfileView from './components/ProfileView'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { useTranslation } from '../../hooks/useTranslation'
import { API_URL } from '../../api/config'
import { getMyGroups } from '../../api/groupsApi'
import './Profile.css'

function Profile() {
  const { t } = useTranslation()
  const [istoricExtins, setIstoricExtins] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(() => Boolean(localStorage.getItem('token')))
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
  
  const [availableFilters, setAvailableFilters] = useState([
    { id: 192, name: 'Sports' },
    { id: 144, name: 'Music' },
    { id: 13, name: 'Art & Culture' },
    { id: 156, name: 'Outdoors' },
    { id: 95, name: 'Food' }
  ])
  const [interestSearch, setInterestSearch] = useState('')
  const [selectedFilters, setSelectedFilters] = useState([])

  useEffect(() => {
    if (!token) {
      return
    }

    const headers = { 'Authorization': `Bearer ${token}` }

    // Pasul 1: Luam profilul "me" pentru a afla ID-ul si datele de baza
    fetch(`${API_URL}/api/users/me`, { headers })
      .then(res => res.json())
      .then(userData => {
        setProfileData(prevProfileData => ({
          id: userData.id,
          nume: userData.fullname || `${userData.firstname || ''} ${userData.lastname || ''}`.trim() || prevProfileData.nume,
          email: userData.email || prevProfileData.email,
          bio: userData.bio || '',
          avatarUrl: userData.profileImgUrl || userData.avatarUrl || null
        }))

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
          getMyGroups(),
          fetch(`${API_URL}/api/users/me/history`, { headers }).then(res => res.json())
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

  const handleSave = async (newProfileData) => {
    if (!token) return

    let currentAvatarUrl = profileData.avatarUrl;

    if (newProfileData.avatarFile) {
      try {
        const formData = new FormData();
        formData.append('avatar', newProfileData.avatarFile);
        
        const uploadRes = await fetch(`${API_URL}/api/users/me/avatar`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
        
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          currentAvatarUrl = uploadData.profileImgUrl || uploadData.avatarUrl || uploadData.profilePictureUrl || currentAvatarUrl;
        } else {
          console.warn('Backend upload endpoint might not be ready.');
        }
      } catch (e) {
        console.error('Error uploading avatar:', e);
      }
    }

    const payload = {
      fullname: newProfileData.nume,
      email: newProfileData.email,
      bio: newProfileData.bio,
      profileImgUrl: currentAvatarUrl,
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
          nume: data.fullname || newProfileData.nume,
          avatarUrl: currentAvatarUrl
        })
        setIsEditing(false)
      })
      .catch(err => {
        console.log('Eroare salvare, se aplică local', err)
        setProfileData({ ...newProfileData, avatarUrl: currentAvatarUrl })
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
                  <div className="interests-search-bar" style={{ marginBottom: '15px' }}>
                    <input 
                      type="text" 
                      placeholder={t('common.search', 'Cauta interese...')}
                      value={interestSearch}
                      onChange={(e) => setInterestSearch(e.target.value)}
                      className="form-input"
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-primary)' }}
                    />
                  </div>
                  <div className="interests-grid" style={{ maxHeight: '280px', overflowY: 'auto', paddingRight: '5px' }}>
                    {availableFilters
                      .filter(f => getInterestLabel(f.name).toLowerCase().includes(interestSearch.toLowerCase()))
                      .map(filter => (
                      <button
                        key={filter.id}
                        className={`interest-tag ${selectedFilters.includes(filter.id) ? 'active' : ''}`}
                        onClick={() => toggleFilter(filter.id)}
                      >
                        {getInterestLabel(filter.name)}
                      </button>
                    ))}
                  </div>
                  <button className="btn-save-interests" onClick={() => handleSave(profileData)} style={{ marginTop: '15px' }}>
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
            </div>

                        <div className="profile-section">
              <h3 className="side-title">{t('profile.history.title')}</h3>
              <div className="timeline-container">
                {deAfisat.length > 0 ? (
                  deAfisat.map((event) => (
                    <div key={event.id} className="timeline-item">
                      <div className="timeline-marker"></div>
                      <div className="timeline-card">
                        {event.imageUrl && (
                          <div className="timeline-image-wrapper">
                            <img src={event.imageUrl} alt={event.name} className="timeline-image" />
                          </div>
                        )}
                        <div className="timeline-content">
                          <div className="timeline-header">
                            <span className={`timeline-role role-${event.role.toLowerCase()}`}>{event.role}</span>
                            <span className="timeline-datetime">{event.date} {event.time}</span>
                          </div>
                          <h4 className="timeline-event-name">{event.name}</h4>
                          {event.locationName && (
                            <p className="timeline-location">📍 {event.locationName}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="history-empty">{t('history.empty')}</p>
                )}
              </div>
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


