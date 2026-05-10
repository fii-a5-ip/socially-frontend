import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Info, Settings2, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useForm } from '../../hooks/useForm';
import { validateRequired } from '../../utils/validation';
import { useTranslation } from '../../hooks/useTranslation';

import { Step1Details } from './components/Step1Details';
import { Step2Logistics } from './components/Step2Logistics';
import './CreateEvent.css';

const initialValues = {
  name: '',
  description: '',
  date: '',
  address: '',
};

const validationRules = {
  name: (v) => validateRequired(v, 'Numele evenimentului'),
};

function CreateEvent() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  
  const [step, setStep] = useState(1);
  const [creationSuccess, setCreationSuccess] = useState(false);

  const { values, errors, touched, handleChange, handleBlur, setValues, setErrors } = useForm(
    initialValues,
    validationRules,
    async () => {
      return new Promise((resolve) => setTimeout(resolve, 1500));
    }
  );

  // Load data for edit mode
  useEffect(() => {
    if (isEditMode) {
      const existing = JSON.parse(localStorage.getItem('socially_myEvents') || '[]');
      const targetEvent = existing.find(e => e.id === Number(id));
      if (targetEvent) {
        setValues({
          name: targetEvent.title || '',
          description: targetEvent.longDescription || '',
          date: targetEvent.rawDate || '',
          address: targetEvent.address !== 'Locație flexibilă' ? targetEvent.address : ''
        });
      }
    }
  }, [id, isEditMode, setValues]);

    const handleNextStep = () => {
        const stepErrors = {};
        if (!values.name) { stepErrors.name = 'Numele evenimentului este obligatoriu.'; }
        if (!values.description) { stepErrors.description = 'Descrierea este obligatorie.'; }

        if (Object.keys(stepErrors).length > 0) {
            setErrors(stepErrors);
            return;
        }

        setErrors({});
        setStep(2);
    };
  /*const handleNextStep = () => {
    const stepErrors = {};
    if (!values.name) { stepErrors.name = 'Numele evenimentului este obligatoriu.'; }
    if (!values.description) { stepErrors.description = 'Descrierea este obligatorie.'; }
    if (Object.keys(stepErrors).length > 0) {
          setErrors(prev => ({ ...prev, ...stepErrors }));
          return; 
      }
    setErrors({});
    //setErrors(prev => ({ ...prev, ...stepErrors }));
    setStep(2);
  };*/

  const handlePrevStep = () => {
    setStep(1);
  };

  const submitFinalEvent = async () => {
      const stepErrors = {};
      if (!values.date) { stepErrors.date = 'Data este obligatorie.'; }
      if (!values.address) { stepErrors.address = 'Adresa este obligatorie.'; }

      if (Object.keys(stepErrors).length > 0) {
          setErrors(prev => ({ ...prev, ...stepErrors }));
          return; 
      }

    try {
      const existing = JSON.parse(localStorage.getItem('socially_myEvents') || '[]');
      const newEvent = {
          id: isEditMode ? Number(id) : Date.now(),
          title: values.name,
          category: 'Toate',
          rating: 5.0,
          distance: isEditMode ? 'Updated' : 'New',
          schedule: values.date ? new Date(values.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Vezi descrierea',
          address: values.address || 'Locație flexibilă',
          image: 'https://images.unsplash.com/photo-1540553016722-983e48a2cd10?auto=format&fit=crop&q=80&w=800',
          description: values.description.substring(0, 60) + (values.description.length > 60 ? '...' : ''),
          longDescription: values.description,
          rawDate: values.date,
          isMine: true
      };
      
      if (isEditMode) {
        const targetIndex = existing.findIndex(e => e.id === Number(id));
        if (targetIndex !== -1) {
          newEvent.image = existing[targetIndex].image;
          existing[targetIndex] = newEvent;
          localStorage.setItem('socially_myEvents', JSON.stringify(existing));
        }
      } else {
        localStorage.setItem('socially_myEvents', JSON.stringify([newEvent, ...existing]));
      }
    } catch (e) {
      console.error("Failed to save event locally", e);
    }

    setCreationSuccess(true);
    setTimeout(() => {
      navigate('/discover');
    }, 2500);
  };



  return (
    <div className="ce-page">
      <div className="ce-container">
        
        {/* Header simplu */}
        <div className="ce-header">
          <h1 className="ce-page-title">{isEditMode ? t('createevent.edit_title') : t('createevent.title')}</h1>
          <p className="ce-page-subtitle">{isEditMode ? t('createevent.edit_subtitle') : t('createevent.subtitle')}</p>
        </div>

        {/* Stepper Visualizer */}
        <div className="ce-stepper">
          <div className={`ce-step ${step >= 1 ? 'active' : ''}`}>
            <div className="ce-step-icon"><Settings2 size={18} /></div>
            <span>{t('createevent.step_details')}</span>
          </div>
          <div className={`ce-stepper-line ${step >= 2 ? 'active' : ''}`}></div>
          <div className={`ce-step ${step >= 2 ? 'active' : ''}`}>
            <div className="ce-step-icon"><MapPin size={18} /></div>
            <span>{t('createevent.step_logistics')}</span>
          </div>
          <div className={`ce-stepper-line ${creationSuccess ? 'active' : ''}`}></div>
          <div className={`ce-step ${creationSuccess ? 'active' : ''}`}>
            <div className="ce-step-icon"><CheckCircle size={18} /></div>
            <span>{t('createevent.step_complete')}</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="ce-card">
          <AnimatePresence mode="wait">
            {!creationSuccess ? (
              <motion.div 
                key={`step-${step}`} 
                className="ce-step-wrapper"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >

                {step === 1 && (
                  <Step1Details 
                    values={values} 
                    errors={errors} 
                    touched={touched} 
                    handleChange={handleChange} 
                    handleBlur={handleBlur}
                  />
                )}
                {step === 2 && (
                  <Step2Logistics 
                    values={values} 
                    errors={errors} 
                    touched={touched} 
                    handleChange={handleChange} 
                    handleBlur={handleBlur}
                  />
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="success"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="ce-success-wrapper"
              >
                <div className="ce-success-icon-wrap">
                  <CheckCircle className="ce-success-icon" size={64} />
                </div>
                <h2>{isEditMode ? t('createevent.edit_success_title') : t('createevent.success_title')}</h2>
                <p>{isEditMode ? t('createevent.edit_success_desc') : t('createevent.success_desc')}</p>
                <div className="ce-loader"></div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls */}
          {!creationSuccess && (
            <div className="ce-controls">
              {step === 2 ? (
                <button type="button" onClick={handlePrevStep} className="ce-btn ce-btn-secondary">
                  <ArrowLeft size={18} /> {t('createevent.btn_back')}
                </button>
              ) : (
                <button type="button" onClick={() => navigate('/discover')} className="ce-btn ce-btn-secondary">
                    <ArrowLeft size={18} /> {t('createevent.btn_back')}
                </button>
              )}
              
              {step === 1 ? (
                <button type="button" onClick={handleNextStep} className="ce-btn ce-btn-primary">
                  {t('createevent.btn_next')} <ArrowRight size={18} />
                </button>
              ) : (
                <button type="button" onClick={submitFinalEvent} className="ce-btn ce-btn-primary success-btn">
                  {t('createevent.btn_finish')} <CheckCircle size={18} />
                </button>
              )}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}

export default CreateEvent;
