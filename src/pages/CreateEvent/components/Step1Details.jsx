import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useTranslation } from '../../../hooks/useTranslation';

export function Step1Details({ values, errors, handleChange, handleBlur }) {
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
                {errors.name && <span className="ce-error-text">{errors.name}</span>}
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
                {errors.description && <span className="ce-error-text">{errors.description}</span>}
            </div>

        </motion.div>
    );
}
