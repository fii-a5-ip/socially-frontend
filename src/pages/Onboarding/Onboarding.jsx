import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../hooks/useTranslation';
import { Coffee, MapPin, Music, Utensils, Beer, Gamepad2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import './Onboarding.css';

const PREDEFINED_CATEGORIES = [
  { id: 'coffee', label: 'Cafenele & Relaxare', icon: Coffee },
  { id: 'food', label: 'Restaurante', icon: Utensils },
  { id: 'party', label: 'Cluburi & Party', icon: Music },
  { id: 'drinks', label: 'Pub-uri & Berării', icon: Beer },
  { id: 'gaming', label: 'Boardgames', icon: Gamepad2 },
  { id: 'explore', label: 'Explorare Urbană', icon: MapPin },
];

function Onboarding() {
  const { t } = useTranslation();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [customInterest, setCustomInterest] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useApp();
  const navigate = useNavigate();

  const toggleCategory = (id) => {
    setSelectedCategories(prev =>
      prev.includes(id)
        ? prev.filter(c => c !== id)
        : [...prev, id]
    );
  };

  const handleFinish = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      login();
      navigate('/mode');
    }, 1500);
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding-container">

        <motion.div
          className="onboarding-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>{t('onboarding.title')}</h1>
          <p>{t('onboarding.desc')}</p>
        </motion.div>

        <form onSubmit={handleFinish} className="onboarding-form">
          <motion.div
            className="onboarding-categories"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {PREDEFINED_CATEGORIES.map((cat, idx) => {
              const Icon = cat.icon;
              const isSelected = selectedCategories.includes(cat.id);

              return (
                <motion.button
                  type="button"
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`category-chip ${isSelected ? 'selected' : ''}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + (idx * 0.05) }}
                >
                  <Icon size={18} />
                  <span>{cat.label}</span>
                </motion.button>
              );
            })}
          </motion.div>

          <motion.div
            className="onboarding-custom"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <label>{t('onboarding.other_passions')}</label>
            <input
              type="text"
              placeholder={t('onboarding.placeholder')}
              value={customInterest}
              onChange={(e) => setCustomInterest(e.target.value)}
              className="onboarding-input"
            />
          </motion.div>

          <motion.div
            className="onboarding-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <button
              type="submit"
              className="btn-finish"
              disabled={isLoading || selectedCategories.length === 0}
            >
              {isLoading ? t('onboarding.btn_loading') : t('onboarding.btn_finish')}
              {!isLoading && <ArrowRight size={20} />}
            </button>
            {selectedCategories.length === 0 && (
              <span className="onboarding-hint">{t('onboarding.hint')}</span>
            )}
          </motion.div>

        </form>

      </div>
    </div>
  );
}

export default Onboarding;
