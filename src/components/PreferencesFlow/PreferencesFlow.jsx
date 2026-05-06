import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './PreferencesFlow.css';

// Reusable child component for individual question UI
const PreferenceStep = ({ stepNumber, question, value, onChange, onNext, isLastStep }) => {
  return (
    <motion.div
      className="preference-step"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <h2 className="step-question">{question}</h2>

      <input
        type="text"
        className="step-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Your answer for step ${stepNumber}...`}
        autoFocus
        onKeyDown={(e) => {
          if (e.key === 'Enter' && value.trim()) {
            onNext();
          }
        }}
      />

      <button
        className="btn btn--primary step-next-btn"
        onClick={onNext}
        disabled={!value.trim()}
      >
        {isLastStep ? 'Finish' : 'Next'}
        {isLastStep ? <CheckCircle size={18} /> : <ArrowRight size={18} />}
      </button>
    </motion.div>
  );
};

const PreferencesFlow = () => {
  const { login } = useApp();

  React.useEffect(() => {
    // Logăm utilizatorul automat când intră pe acest ecran pentru a simula 
    // faptul că a trecut deja de pașii de la Register.
    login();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState({
    step1: '',
    step2: '',
    step3: '',
    step4: '',
    step5: ''
  });

  const navigate = useNavigate();

  // 5 sequential placeholder questions
  const questions = [
    { id: 1, key: 'step1', text: 'Placeholder Question 1' },
    { id: 2, key: 'step2', text: 'Placeholder Question 2' },
    { id: 3, key: 'step3', text: 'Placeholder Question 3' },
    { id: 4, key: 'step4', text: 'Placeholder Question 4' },
    { id: 5, key: 'step5', text: 'Placeholder Question 5' }
  ];

  const handleAnswerChange = (stepKey, value) => {
    setAnswers(prev => ({
      ...prev,
      [stepKey]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    // Mock API submission
    console.log('User Preferences Collected:', answers);
    // Redirect to profile
    navigate('/profile');
  };

  const currentQuestion = questions[currentStep - 1];

  return (
    <div className="preferences-flow-container">
      <div className="preferences-card card">

        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>

        <div className="step-counter">
          Step {currentStep} of 5
        </div>

        <div className="step-content">
          <AnimatePresence mode="wait">
            <PreferenceStep
              key={currentQuestion.id}
              stepNumber={currentQuestion.id}
              question={currentQuestion.text}
              value={answers[currentQuestion.key]}
              onChange={(value) => handleAnswerChange(currentQuestion.key, value)}
              onNext={handleNext}
              isLastStep={currentStep === 5}
            />
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default PreferencesFlow;
