import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Image as ImageIcon } from 'lucide-react';
import { useTranslation } from '../../../hooks/useTranslation';

export function Step1Details({
  values,
  errors,
  handleChange,
  handleBlur,
  setValues
}) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="ce-form-section"
    >
      <div className="ce-form-group">
        <label className="ce-label">
          {t('createevent.form.name')} <span className="ce-required">*</span>
        </label>

        <input
          className={`ce-input ${errors.name ? 'error' : ''}`}
          type="text"
          name="name"
          placeholder={t('createevent.form.name_ph')}
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        {errors.name && (
          <span className="ce-error-text">{errors.name}</span>
        )}
      </div>

      <div className="ce-form-group">
        <label className="ce-label">
          {t('createevent.form.image')} <span className="ce-required">*</span>
        </label>

        <div className="ce-file-upload-container" style={{ marginBottom: '8px' }}>
          <input 
            type="file" 
            accept="image/*" 
            id="eventImage" 
            className="ce-file-input"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onloadend = () => {
                  setValues(prev => ({ ...prev, url: reader.result }));
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          <label htmlFor="eventImage" className="ce-file-upload-label">
            {values.url && values.url.startsWith('data:') ? (
              <img src={values.url} alt="Preview" className="ce-image-preview-upload" />
            ) : (
              <div className="ce-file-placeholder">
                <ImageIcon size={32} style={{ color: 'var(--color-primary)' }} />
                <span>{t('createevent.form.click_to_upload')}</span>
              </div>
            )}
          </label>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {t('createevent.form.or_enter_url')}
          </span>
          <input
            className={`ce-input ${errors.url ? 'error' : ''}`}
            type="url"
            name="url"
            placeholder={t('createevent.form.image_url_ph')}
            value={values.url && !values.url.startsWith('data:') ? values.url : ''}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>

        {errors.url && (
          <span className="ce-error-text">{errors.url}</span>
        )}
      </div>

      <div className="ce-form-group">
        <label className="ce-label">
          {t('createevent.form.desc')} <span className="ce-required">*</span>
        </label>

        <textarea
          className={`ce-textarea ${errors.description ? 'error' : ''}`}
          name="description"
          placeholder={t('createevent.form.desc_ph')}
          value={values.description}
          onChange={handleChange}
          onBlur={handleBlur}
          rows={5}
        />

        {errors.description && (
          <span className="ce-error-text">{errors.description}</span>
        )}
      </div>
    </motion.div>
  );
}