import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Users, Settings2, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from '../../hooks/useForm';
import { validateRequired } from '../../utils/validation';
import { useTranslation } from '../../hooks/useTranslation';

import { createGroup } from '../../api/groupsApi';
import { Step1Details } from './components/Step1Details';
import { Step2Members } from './components/Step2Members';
import './CreateGroup.css';

const initialValues = {
  name: '',
  description: '',
  imageUrl: '',
  members: [],
};

const validationRules = {
  name: (v) => validateRequired(v, 'Numele grupului'),
};

function CreateGroup() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [creationSuccess, setCreationSuccess] = useState(false);

  const { values, errors, touched, handleChange, handleBlur, setValues, setErrors } = useForm(
    initialValues,
    validationRules,
    async () => null
  );

  const handleNextStep = () => {
    if (!values.name.trim()) {
      setErrors(prev => ({ ...prev, name: 'Numele grupului este obligatoriu.' }));
      return;
    }

    setStep(2);
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const submitFinalGroup = async () => {
    try {
      if (!values.name.trim()) {
        setErrors(prev => ({ ...prev, name: 'Numele grupului este obligatoriu.' }));
        setStep(1);
        return;
      }

      const payload = {
        name: values.name.trim(),
        imgLink: values.imageUrl || null,
        desc: values.description?.trim() || null,
        members: (values.members || []).map((userId) => ({
          userId,
          role: 'MEMBER',
        })),
      };

      const createdGroup = await createGroup(payload);
      setCreationSuccess(true);

      setTimeout(() => {
        navigate(`/groups/${createdGroup.id}`);
      }, 2500);
    } catch (error) {
      console.error(error);
      alert(error.message || 'A aparut o eroare la salvarea grupului.');
    }
  };

  return (
    <div className="cg-page">
      <div className="cg-container">
        <div className="cg-header">
          <h1 className="cg-page-title">{t('creategroup.title')}</h1>
          <p className="cg-page-subtitle">{t('creategroup.subtitle')}</p>
        </div>

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

          {!creationSuccess && (
            <div className="cg-controls">
              {step === 2 ? (
                <button type="button" onClick={handlePrevStep} className="cg-btn cg-btn-secondary">
                  <ArrowLeft size={18} /> {t('creategroup.btn_back')}
                </button>
              ) : (
                <div></div>
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
