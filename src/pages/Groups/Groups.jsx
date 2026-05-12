import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from '../../hooks/useTranslation'
import { getMyGroups } from '../../api/groupsApi'
import './Groups.css'

function Groups() {
  const { t } = useTranslation()
  const [groups, setGroups] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await getMyGroups()
        setGroups(data)
      } catch (err) {
        setError(err.message || 'Nu s-au putut încărca grupurile')
        console.error('Error loading groups:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchGroups()
  }, [])

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getAccentColor = (index) => {
    const colors = ['pink', 'orange', 'light-pink', 'blue', 'green']
    return colors[index % colors.length]
  }

  return (
    <div className="groups-page">
      <div className="groups-container">
        <h1 className="groups-title">Grupurile mele</h1>

        <div className="groups-search">
          <span className="groups-search__icon">⌕</span>
          <input
            type="text"
            placeholder="Cauta grupuri..."
            className="groups-search__input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Link to="/groups/create" className="groups-create-btn">
          + Creeaza un grup
        </Link>

        {isLoading && (
          <div className="groups-loading">
            <p>{t('common.loading') || 'Se încarcă...'}</p>
          </div>
        )}

        {error && (
          <div className="groups-error">
            <p>{error}</p>
          </div>
        )}

        {!isLoading && !error && filteredGroups.length === 0 && (
          <div className="groups-empty">
            <p>{searchQuery ? 'Nu s-au găsit grupuri' : 'Nu ai niciun grup'}</p>
          </div>
        )}

        {!isLoading && !error && filteredGroups.length > 0 && (
          <div className="groups-list">
            {filteredGroups.map((group, index) => (
              <Link to={`/groups/${group.id}`} className="group-card" key={group.id}>
                <div className={`group-card__icon group-card__icon--${getAccentColor(index)}`}>
                  {group.imgLink ? (
                    <img src={group.imgLink} alt={group.name} className="group-card__image" />
                  ) : (
                    <span className="group-card__emoji">👥</span>
                  )}
                </div>

                <div className="group-card__content">
                  <h2 className="group-card__title">{group.name}</h2>
                  <p className="group-card__subtitle">
                    {group.memberIds.length} {t('groups.members')}
                  </p>
                  {group.desc && (
                    <p className="group-card__description">{group.desc}</p>
                  )}
                </div>

                <span className="group-card__arrow">›</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Groups