import React from 'react';
/* eslint-disable-next-line no-unused-vars */
import { motion } from 'framer-motion';
import { MapPin, Image as ImageIcon, PartyPopper, Utensils, Coffee } from 'lucide-react';
import FormInput from '../../../components/FormInput/FormInput';
import { FormTextArea } from './FormTextArea';
import { useTranslation } from '../../../hooks/useTranslation';

export function Step1Details({ values, errors, touched, handleChange, handleBlur, setValues }) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="cg-step-content"
    >
      <div className="cg-form-row">
        <FormInput
          label={t('creategroup.group_name_label')}
          name="name"
          value={values.name}
          placeholder={t('creategroup.group_name_placeholder')}
          error={errors.name}
          touched={touched.name}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />
      </div>

      <div className="cg-form-row">
        <FormTextArea
          label={t('creategroup.group_desc_label')}
          name="description"
          value={values.description}
          placeholder={t('creategroup.group_desc_placeholder')}
          error={errors.description}
          touched={touched.description}
          onChange={handleChange}
          onBlur={handleBlur}
          rows={3}
        />
      </div>



      <div className="cg-form-row">
        <label className="cg-field-label">{t('creategroup.group_image_label', 'Imagine Copertă Grup (opțional)')}</label>
        <div className="cg-file-upload-container">
          <input 
            type="file" 
            accept="image/*" 
            id="groupImage" 
            className="cg-file-input"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onloadend = () => {
                  setValues(prev => ({ ...prev, imageUrl: reader.result }));
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          <label htmlFor="groupImage" className="cg-file-upload-label">
            {values.imageUrl ? (
              <img src={values.imageUrl} alt="Preview" className="cg-image-preview-upload" />
            ) : (
              <div className="cg-file-placeholder">
                <ImageIcon size={32} />
                <span>{t('creategroup.group_image_placeholder', 'Click pentru a încărca o imagine')}</span>
              </div>
            )}
          </label>
        </div>
      </div>
    </motion.div>
  );
}
