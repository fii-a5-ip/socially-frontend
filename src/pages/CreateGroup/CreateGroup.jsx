import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Users, Info, Settings2, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from '../../hooks/useForm';
import { validateRequired } from '../../utils/validation';
import { useTranslation } from '../../hooks/useTranslation';

import { API_URL } from '../../api/config';
import { Step1Details } from './components/Step1Details';
import { Step2Members } from './components/Step2Members';
import './CreateGroup.css';

const initialValues = {
  name: '',
  description: '',
  imageUrl: '',
  members: [],
};

function CreateGroup() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [creationSuccess, setCreationSuccess] = useState(false);

  const validationRules = {
    name: (v) => v ? null : t('creategroup.error_name_required'),
  };

  const { values, errors, touched, handleChange, handleBlur, setValues, setErrors } = useForm(
    initialValues,
    validationRules,
    /* eslint-disable-next-line no-unused-vars */
    async (formData) => {
      // API call simulare
      return new Promise((resolve) => setTimeout(resolve, 1500));
    }
  );

  const handleNextStep = () => {
    const stepErrors = {};

    if (!values.name) { stepErrors.name = t('creategroup.error_name_required'); }

    setErrors(prev => ({ ...prev, ...stepErrors }));

    // Permitem trecerea la nivel vizual pentru testare chiar dacă sunt erori
    setStep(2);
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const submitFinalGroup = async () => {
    try {
      const payload = {
        name: values.name,
        description: values.description,
        imgLink: values.imageUrl, // Trimitem imaginea Base64
        creatorUserId: 1, // HARDCODED: Trebuie înlocuit cu ID-ul user-ului logat când adăugați Auth
        memberIds: values.members || []
      };

      const response = await fetch(`${API_URL}/api/groups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(t('creategroup.error_save'));
      }

      const createdGroup = await response.json();
      setCreationSuccess(true);

      setTimeout(() => {
        navigate(`/groups/${createdGroup.id}`);
      }, 2500);

    } catch (error) {
      console.error(error);
      alert(t('creategroup.error_save'));
    }
  };

  return (
    <div className="cg-page">
      <div className="cg-container">

        {/* Header simplu */}
        <div className="cg-header">
          <h1 className="cg-page-title">{t('creategroup.title')}</h1>
          <p className="cg-page-subtitle">{t('creategroup.subtitle')}</p>
        </div>

        {/* Stepper Visualizer */}
        <div className="cg-stepper">
          <div className={`cg-step ${step >= 1 ? 'active' : ''}`}>
            <div className="cg-step-icon"><Settings2 size={18} /></div>
            <span>{t('creategroup.step_details')}</span>
          </div>
          <div className={`cg-stepper-line ${step >= 2 ? 'active' : ''}`}></div>
          <div className={`cg-step ${step >= 2 ? 'active' : ''}`}>
            <div className="cg-step-icon"><Users size={18} /></div>
            <span>{t('creategroup.step_members')}</span>
          </div>
          <div className={`cg-stepper-line ${creationSuccess ? 'active' : ''}`}></div>
          <div className={`cg-step ${creationSuccess ? 'active' : ''}`}>
            <div className="cg-step-icon"><CheckCircle size={18} /></div>
            <span>{t('creategroup.step_complete')}</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="cg-card">
          <AnimatePresence mode="wait">
            {!creationSuccess ? (
              <motion.div key={`step-${step}`} className="cg-step-wrapper">
                {step === 1 && (
                  <Step1Details
                    values={values}
                    errors={errors}
                    touched={touched}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    setValues={setValues}
                  />
                )}
                {step === 2 && (
                  <Step2Members
                    setValues={setValues}
                  />
                )}
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="cg-success-wrapper"
              >
                <div className="cg-success-icon-wrap">
                  <CheckCircle className="cg-success-icon" size={64} />
                </div>
                <h2>{t('creategroup.success_title')}</h2>
                <p>{t('creategroup.success_desc')}</p>
                <div className="cg-loader"></div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls */}
          {!creationSuccess && (
            <div className="cg-controls">
              {step === 2 ? (
                <button type="button" onClick={handlePrevStep} className="cg-btn cg-btn-secondary">
                  <ArrowLeft size={18} /> {t('creategroup.btn_back')}
                </button>
              ) : (
                <div></div> // vizual gol
              )}

              {step === 1 ? (
                <button type="button" onClick={handleNextStep} className="cg-btn cg-btn-primary">
                  {t('creategroup.btn_next')} <ArrowRight size={18} />
                </button>
              ) : (
                <button type="button" onClick={submitFinalGroup} className="cg-btn cg-btn-primary success-btn">
                  {t('creategroup.btn_finish')} <CheckCircle size={18} />
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default CreateGroup;
