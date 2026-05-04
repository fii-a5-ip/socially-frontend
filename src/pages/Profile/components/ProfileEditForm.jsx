import { useRef } from 'react'
import { useForm } from '../../../hooks/useForm'
import { useTranslation } from '../../../hooks/useTranslation'
import { validateRequired, validateEmail } from '../../../utils/validation'
import FormInput from '../../../components/FormInput/FormInput'

function ProfileEditForm({ initialData, onSave, onCancel }) {
  const fileInputRef = useRef(null)
  const { t } = useTranslation()

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setValues } = useForm(
    initialData,
    {
      nume: (v) => validateRequired(v, 'Numele'),
      email: (v) => validateEmail(v),
    },
    (validValues) => {
      onSave(validValues)
    }
  )

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setValues((prev) => ({ ...prev, avatarUrl: url }))
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleBioKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
  }

  return (
    <div className="profile-edit-form">
      <h2 className="section-title">{t('profile.edit.title')}</h2>

      <div className="avatar-box">
        <div className="avatar-display" style={{ overflow: 'hidden' }}>
          {values.avatarUrl ? (
            <img src={values.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            '👤'
          )}
        </div>
        <button type="button" className="btn-upload" onClick={handleUploadClick}>{t('profile.edit.change_photo')}</button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
      </div>

      <form onSubmit={handleSubmit}>
        <FormInput
          label={t('profile.edit.fullname')}
          name="nume"
          value={values.nume}
          error={errors.nume}
          touched={touched.nume}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <FormInput
          label={t('profile.edit.email')}
          name="email"
          value={values.email}
          error={errors.email}
          touched={touched.email}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label className="input-label">
            {t('profile.edit.bio_label')}
          </label>
          <div className="bio-container">
            <textarea
              name="bio"
              className="profile-text"
              value={values.bio}
              onChange={handleChange}
              onKeyDown={handleBioKeyDown}
              maxLength="50"
              placeholder={t('profile.edit.bio_placeholder')}
            />
            <span className="bio-counter">{values.bio.length}/50</span>
          </div>
        </div>

        <div className="form-group">
          <label className="input-label">
            {t('profile.edit.budget_label')} <span style={{ fontWeight: 'bold' }}>{values.buget === '1000' ? t('profile.edit.budget_nolimit') : values.buget + ' RON'}</span>
          </label>
          <input
            type="range"
            name="buget"
            min="0" max="1000" step="50"
            list="budget-steps"
            className="profile-slider"
            value={values.buget}
            onChange={handleChange}
          />
          <datalist id="budget-steps">
            <option value="0"></option>
            <option value="250"></option>
            <option value="500"></option>
            <option value="750"></option>
            <option value="1000"></option>
          </datalist>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-save">{t('profile.edit.save')}</button>
          <button type="button" className="btn-cancel" onClick={onCancel}>{t('profile.edit.cancel')}</button>
        </div>
      </form>
    </div>
  )
}

export default ProfileEditForm
