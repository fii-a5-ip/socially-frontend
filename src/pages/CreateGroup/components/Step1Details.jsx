import React from 'react';
/* eslint-disable-next-line no-unused-vars */
import { motion } from 'motion/react';
import { MapPin, Image as ImageIcon, PartyPopper, Utensils, Coffee } from 'lucide-react';
import FormInput from '../../../components/FormInput/FormInput';
import { FormTextArea } from './FormTextArea';

export function Step1Details({ values, errors, touched, handleChange, handleBlur, setValues }) {

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="cg-step-content"
    >
      <div className="cg-form-row">
        <FormInput
          label="Numele Grupului / Ieșirii"
          name="name"
          value={values.name}
          placeholder="ex: Ieșire la Burgeri vineri..."
          error={errors.name}
          touched={touched.name}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />
      </div>

      <div className="cg-form-row">
        <FormTextArea
          label="Scurtă descriere (opțional)"
          name="description"
          value={values.description}
          placeholder="Unde, cum, cine aduce sucul..."
          error={errors.description}
          touched={touched.description}
          onChange={handleChange}
          onBlur={handleBlur}
          rows={3}
        />
      </div>



      <div className="cg-form-row">
        <label className="cg-field-label">Imagine Copertă Grup (opțional)</label>
        <div className="cg-file-upload-container">
          <input 
            type="file" 
            accept="image/*" 
            id="groupImage" 
            className="cg-file-input"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                const previewUrl = URL.createObjectURL(file);
                setValues(prev => ({ ...prev, imageUrl: previewUrl }));
              }
            }}
          />
          <label htmlFor="groupImage" className="cg-file-upload-label">
            {values.imageUrl ? (
              <img src={values.imageUrl} alt="Preview" className="cg-image-preview-upload" />
            ) : (
              <div className="cg-file-placeholder">
                <ImageIcon size={32} />
                <span>Click pentru a încărca o imagine</span>
              </div>
            )}
          </label>
        </div>
      </div>
    </motion.div>
  );
}
