import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { CloudSun } from 'lucide-react';
import { useTranslation } from '../../../hooks/useTranslation';

function getLocationLabel(location) {
  if (location.formattedAddress) {
    return location.formattedAddress;
  }

  const parts = [
    location.name,
    location.city,
    location.street,
    location.streetNumber
  ].filter(Boolean);

  return parts.length > 0
    ? parts.join(', ')
    : `Locația #${location.id}`;
}

export function Step2Logistics({
  values,
  errors,
  handleChange,
  handleBlur,
  locations,
  filters,
  handleToggleFilter
}) {
  const { t } = useTranslation();

  const handleCheckWeather = (e) => {
    e.preventDefault();
    alert('Aici se va afișa starea vremii!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="ce-form-section"
    >
      <div className="ce-form-group">
        <div className="ce-label-row">
          <label className="ce-label">
            {t('createevent.form.date')} <span className="ce-required">*</span>
          </label>

          <button
            type="button"
            className="ce-weather-btn"
            onClick={handleCheckWeather}
            title="Verifică vremea"
          >
            <CloudSun size={16} />
            <span>Vremea</span>
          </button>
        </div>

        <input
          className={`ce-input ${errors.date ? 'error' : ''}`}
          type="datetime-local"
          name="date"
          value={values.date}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        {errors.date && (
          <span className="ce-error-text">{errors.date}</span>
        )}
      </div>

      <div className="ce-form-group">
        <label className="ce-label">
          Locație <span className="ce-required">*</span>
        </label>

        <select
          className={`ce-input ${errors.locationId ? 'error' : ''}`}
          name="locationId"
          value={values.locationId}
          onChange={handleChange}
          onBlur={handleBlur}
        >
          <option value="">Alege locația</option>

          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {getLocationLabel(location)}
            </option>
          ))}
        </select>

        {errors.locationId && (
          <span className="ce-error-text">{errors.locationId}</span>
        )}
      </div>

      <div className="ce-form-group">
        <label className="ce-label">
          Filtre
        </label>

        {filters.length === 0 ? (
          <p className="ce-page-subtitle">
            Nu există filtre disponibile.
          </p>
        ) : (
          filters.map((filter) => {
            const checked = Array.isArray(values.filterIds)
              ? values.filterIds.includes(filter.id)
              : false;

            return (
              <label key={filter.id} className="ce-label">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleToggleFilter(filter.id)}
                />
                {' '}
                {filter.name}
              </label>
            );
          })
        )}
      </div>

      <div className="ce-map-placeholder">
        <span>📍 Locația se selectează din lista de mai sus</span>
      </div>
    </motion.div>
  );
}