import React from 'react';
/* eslint-disable-next-line no-unused-vars */
import { motion } from 'motion/react';
import { MapPin, Image as ImageIcon, PartyPopper, Utensils, Coffee } from 'lucide-react';
import FormInput from '../../../components/FormInput/FormInput';
import { FormTextArea } from './FormTextArea';

export function Step1Details({ values, errors, touched, handleChange, handleBlur, setValues }) {
  const categories = [
    { id: 'mancare', label: 'Luăm Masa', icon: Utensils },
    { id: 'petrecere', label: 'Petrecere', icon: PartyPopper },
    { id: 'relaxare', label: 'Relaxare / Cafea', icon: Coffee },
    { id: 'city_break', label: 'Călătorie', icon: MapPin },
  ];

  const handleCategorySelect = (categoryId) => {
    setValues((prev) => ({ ...prev, category: categoryId }));
  };

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
        <label className="cg-field-label">Tematica Ieșirii <span className="required">*</span></label>
        <div className="cg-categories-grid">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = values.category === cat.id;
            return (
              <button
                type="button"
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`cg-category-btn ${isSelected ? 'selected' : ''}`}
              >
                <div className="cg-category-icon">
                  <Icon size={24} />
                </div>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
        {touched.category && errors.category && (
          <p className="cg-input-error">{errors.category}</p>
        )}
      </div>

      <div className="cg-form-row">
        <FormInput
          label="URL Imagine Copertă (opțional)"
          name="imageUrl"
          type="url"
          value={values.imageUrl}
          placeholder="https://..."
          error={errors.imageUrl}
          touched={touched.imageUrl}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {values.imageUrl && !errors.imageUrl && (
          <div className="cg-image-preview mt-2">
            <img src={values.imageUrl} alt="Preview" onError={(e) => e.target.style.display = 'none'} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
