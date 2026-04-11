import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
/* eslint-disable-next-line no-unused-vars */
import { motion, AnimatePresence } from 'motion/react';
import { Users, Info, Settings2, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useForm } from '../../hooks/useForm';
import { validateRequired } from '../../utils/validation';

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
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [creationSuccess, setCreationSuccess] = useState(false);

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
    
    if (!values.name) { stepErrors.name = 'Numele grupului este obligatoriu.'; }
    
    setErrors(prev => ({ ...prev, ...stepErrors }));

    // Permitem trecerea la nivel vizual pentru testare chiar dacă sunt erori
    setStep(2);
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const submitFinalGroup = async () => {
    setCreationSuccess(true);
    // Simuleaza redirectionarea catre noul grup dupa putin timp
    setTimeout(() => {
      navigate('/groups/1');
    }, 2500);
  };

  return (
    <div className="cg-page">
      <div className="cg-container">
        
        {/* Header simplu */}
        <div className="cg-header">
          <h1 className="cg-page-title">Creează Grup</h1>
          <p className="cg-page-subtitle">Configurează un spațiu nou pentru tine și prietenii tăi.</p>
        </div>

        {/* Stepper Visualizer */}
        <div className="cg-stepper">
          <div className={`cg-step ${step >= 1 ? 'active' : ''}`}>
            <div className="cg-step-icon"><Settings2 size={18} /></div>
            <span>Detalii</span>
          </div>
          <div className={`cg-stepper-line ${step >= 2 ? 'active' : ''}`}></div>
          <div className={`cg-step ${step >= 2 ? 'active' : ''}`}>
            <div className="cg-step-icon"><Users size={18} /></div>
            <span>Membri</span>
          </div>
          <div className={`cg-stepper-line ${creationSuccess ? 'active' : ''}`}></div>
          <div className={`cg-step ${creationSuccess ? 'active' : ''}`}>
            <div className="cg-step-icon"><CheckCircle size={18} /></div>
            <span>Complet</span>
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
                    values={values} 
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
                <h2>Grup Creat cu Succes!</h2>
                <p>Noul tău grup este pregătit. Redirecționare...</p>
                <div className="cg-loader"></div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls */}
          {!creationSuccess && (
            <div className="cg-controls">
              {step === 2 ? (
                <button type="button" onClick={handlePrevStep} className="cg-btn cg-btn-secondary">
                  <ArrowLeft size={18} /> Înapoi
                </button>
              ) : (
                <div></div> // vizual gol
              )}
              
              {step === 1 ? (
                <button type="button" onClick={handleNextStep} className="cg-btn cg-btn-primary">
                  Continuă <ArrowRight size={18} />
                </button>
              ) : (
                <button type="button" onClick={submitFinalGroup} className="cg-btn cg-btn-primary success-btn">
                  Finalizează Grup <CheckCircle size={18} />
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
