import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'motion/react';
import { useTranslation } from '../../../hooks/useTranslation';

export function Step2Logistics({ values, errors, touched, handleChange, handleBlur }) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="ce-form-section"
    >
      <div className="ce-form-group">
        <label className="ce-label">{t('createevent.form.date')}</label>
        <input
          className={`ce-input ${touched.date && errors.date ? 'error' : ''}`}
          type="datetime-local"
          name="date"
          value={values.date}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.date && errors.date && <span className="ce-error-text">{errors.date}</span>}
      </div>

      <div className="ce-form-group">
        <label className="ce-label">{t('createevent.form.address')}</label>
        <input
          className={`ce-input ${touched.address && errors.address ? 'error' : ''}`}
          type="text"
          name="address"
          placeholder={t('createevent.form.address_ph')}
          value={values.address}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.address && errors.address && <span className="ce-error-text">{errors.address}</span>}
      </div>
      
      {/* Mini-map placeholder for visual appeal */}
      <div className="ce-map-placeholder">
        <span>📍 Harta va apărea aici</span>
      </div>
    </motion.div>
  );
}
