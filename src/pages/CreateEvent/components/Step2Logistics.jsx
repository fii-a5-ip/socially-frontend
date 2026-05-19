import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { CloudSun } from 'lucide-react';
import { useTranslation } from '../../../hooks/useTranslation';

export function Step2Logistics({ values, errors, handleChange, handleBlur }) {
    const { t } = useTranslation();

    const handleCheckWeather = (e) => {
        e.preventDefault();
        alert("Aici se va afișa starea vremii!");
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
                {errors.date && <span className="ce-error-text">{errors.date}</span>}
            </div>

            <div className="ce-form-group">
                <label className="ce-label">
                    {t('createevent.form.address')} <span className="ce-required">*</span>
                </label>
                <input
                    className={`ce-input ${errors.address ? 'error' : ''}`}
                    type="text"
                    name="address"
                    placeholder={t('createevent.form.address_ph')}
                    value={values.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                {errors.address && <span className="ce-error-text">{errors.address}</span>}
            </div>

            <div className="ce-map-placeholder">
                <span>📍 Harta va apărea aici</span>
            </div>
        </motion.div>
    );
}