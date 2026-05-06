import { Link } from 'react-router-dom'
import { useTranslation } from '../../hooks/useTranslation'
import './Groups.css'

const groups = [
  {
    id: 1,
    name: 'Grup 1',
    members: 12,
    activity: 'Activ acum',
    accent: 'pink',
  },
  {
    id: 2,
    name: 'Grup 2',
    members: 8,
    activity: 'Activ ieri',
    accent: 'orange',
  },
  {
    id: 3,
    name: 'Grup 3',
    members: 5,
    activity: 'active_3days', // We'll translate these inline or using t()
    accent: 'light-pink',
  },
]

function Groups() {
  const { t } = useTranslation()
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
          />
        </div>

        <Link to="/groups/create" className="groups-create-btn">
          {t('groups.create_btn')}
        </Link>

        <div className="groups-list">
          {groups.map((group) => (
            <Link to={`/groups/${group.id}`} className="group-card" key={group.id}>
              <div className={`group-card__icon group-card__icon--${group.accent}`}>
                <span className="group-card__emoji">👥</span>
              </div>

              <div className="group-card__content">
                <h2 className="group-card__title">{group.name}</h2>
                <p className="group-card__subtitle">
                  {group.members} {t('groups.members')} {/* Not fully translatable by ID here, but let's keep it simple */}
                </p>
              </div>

              <span className="group-card__arrow">›</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Groups