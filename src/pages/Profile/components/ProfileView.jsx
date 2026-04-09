function ProfileView({ data, onEdit }) {
  return (
    <div className="profile-view">
      <div className="profile-view-header">
        <h2 className="section-title">Date Personale</h2>
        <button className="btn-edit" onClick={onEdit}>✏️ Editează</button>
      </div>

      <div className="avatar-box">
        <div className="avatar-display" style={{ overflow: 'hidden' }}>
          {data.avatarUrl ? (
            <img src={data.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            '👤'
          )}
        </div>
      </div>

      <div className="view-data-list">
        <div className="view-data-item">
          <span className="view-label">Nume Complet</span>
          <strong className="view-value">{data.nume}</strong>
        </div>

        <div className="view-data-item">
          <span className="view-label">Email</span>
          <strong className="view-value">{data.email}</strong>
        </div>

        <div className="view-data-item">
          <span className="view-label">Bio</span>
          <strong className={`view-value${!data.bio ? ' view-value--muted' : ''}`}>
            {data.bio || 'Adaugă o scurtă descriere apăsând editează...'}
          </strong>
        </div>

        <div className="view-data-item">
          <span className="view-label">Buget Per Ieșire</span>
          <strong className="view-value view-value--accent">
            {data.buget === '1000' ? 'Fără limită' : `${data.buget} RON`}
          </strong>
        </div>
      </div>
    </div>
  )
}

export default ProfileView
