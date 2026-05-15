import { useTranslation } from '../../../hooks/useTranslation'

function ProfileView({ data, onEdit }) {
  const { t } = useTranslation()
  return (
    <div className="profile-view">
      <div className="profile-view-header">
        <h2 className="section-title">{t('profile.view.title')}</h2>
        <button className="btn-edit" onClick={onEdit}>{t('profile.view.edit_btn')}</button>
      </div>

      <div className="avatar-box">
        <div className="avatar-display" style={{ overflow: 'hidden' }}>
          {data.avatar ? (
            <img src={data.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            '👤'
          )}
        </div>
      </div>

      <div className="view-data-list">
        <div className="view-data-item">
          <span className="view-label">{t('profile.view.fullname')}</span>
          <strong className="view-value">{data.nume}</strong>
        </div>

        <div className="view-data-item">
          <span className="view-label">{t('profile.view.email')}</span>
          <strong className="view-value">{data.email}</strong>
        </div>

        <div className="view-data-item">
          <span className="view-label">{t('profile.view.bio')}</span>
          <strong className={`view-value${!data.bio ? ' view-value--muted' : ''}`}>
            {data.bio || t('profile.view.bio_empty')}
          </strong>
        </div>

      </div>
    </div>
  )
}

export default ProfileView
