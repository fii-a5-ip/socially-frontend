import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from '../../hooks/useTranslation'
import { getMyGroups, searchGroups } from '../../api/groupsApi'
import './Groups.css'

function Groups() {
  const { t } = useTranslation()
  const [groups, setGroups] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const normalizedQuery = searchQuery.trim()

    const fetchGroups = async () => {
      try {
        if (normalizedQuery) {
          setIsSearching(true)
        } else {
          setIsLoading(true)
        }

        setError(null)
        const data = normalizedQuery
          ? await searchGroups(normalizedQuery)
          : await getMyGroups()

        setGroups(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err.message || (normalizedQuery ? 'Nu s-au putut cauta grupurile' : 'Nu s-au putut incarca grupurile'))
        console.error(normalizedQuery ? 'Error searching groups:' : 'Error loading groups:', err)
      } finally {
        setIsLoading(false)
        setIsSearching(false)
      }
    }

    const timeoutId = setTimeout(fetchGroups, normalizedQuery ? 300 : 0)
    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const getAccentColor = (index) => {
    const colors = ['pink', 'orange', 'light-pink', 'blue', 'green']
    return colors[index % colors.length]
  }

  return (
    <div className="groups-page">
      <div className="groups-container">
        <h1 className="groups-title">{t('groups.title')}</h1>

        <div className="groups-search">
          <span className="groups-search__icon">⌕</span>
          <input
            type="text"
            placeholder={t('groups.search')}
            className="groups-search__input"
            value={searchQuery}
            maxLength={150}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Link to="/groups/create" className="groups-create-btn">
          {t('groups.create_btn')}
        </Link>

        {(isLoading || isSearching) && (
          <div className="groups-loading">
            <p>{t('common.loading') || 'Se incarca...'}</p>
          </div>
        )}

        {!isLoading && !isSearching && error && (
          <div className="groups-error">
            <p>{error}</p>
          </div>
        )}

        {!isLoading && !isSearching && !error && groups.length === 0 && (
          <div className="groups-empty">
            <p>{searchQuery ? 'Nu s-au gasit grupuri' : 'Nu ai niciun grup'}</p>
          </div>
        )}

        {!isLoading && !isSearching && !error && groups.length > 0 && (
          <div className="groups-list">
            {groups.map((group, index) => {
              const membersCount = Array.isArray(group.members) ? group.members.length : 0

              return (
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
                      {membersCount} {t('groups.members')}
                    </p>
                    {group.desc && (
                      <p className="group-card__description">{group.desc}</p>
                    )}
                  </div>

                  <span className="group-card__arrow">›</span>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Groups
