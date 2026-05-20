import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../hooks/useTranslation';
import { ArrowRight, Check, Loader2, RotateCcw } from 'lucide-react';
import { API_URL } from '../../api/config';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

import './Onboarding.css';

const MIN_ANSWER_LENGTH = 30;
const RETRY_DELAYS = [1000, 2000, 4000];

const sleep = (delay) => new Promise(resolve => setTimeout(resolve, delay));

function Onboarding() {
  const { t, lang } = useTranslation();
  const [phase, setPhase] = useState('intro');
  const [userInfo, setUserInfo] = useState({
    nume: localStorage.getItem('current_fullname') || localStorage.getItem('current_username') || '',
    varsta: '',
    ocupatie: '',
    oras: '',
    is_remote: false,
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const { login } = useApp();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const callOnboarding = async (payload) => {
    for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
      const response = await fetch(`${API_URL}/api/onboardingProcess`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (response.status !== 429 || attempt === RETRY_DELAYS.length) {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          const message = data.error || (response.status === 429 ? t('onboarding.error_rate_limit') : t('onboarding.error_generic'));
          throw new Error(message);
        }
        return data;
      }

      setIsRetrying(true);
      await sleep(RETRY_DELAYS[attempt]);
    }
  };

  const updateUserFilters = async (filterIds) => {
    if (!token) {
      throw new Error(t('onboarding.error_auth'));
    }

    const response = await fetch(`${API_URL}/api/users/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ filterIds }),
    });

    if (!response.ok) {
      throw new Error(t('onboarding.error_save'));
    }
  };

  const handleInfoChange = (field, value) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleStart = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setIsRetrying(false);

    try {
      const data = await callOnboarding({
        step: 0,
        language: lang.toLowerCase(),
        user_info: {
          ...userInfo,
          varsta: Number(userInfo.varsta),
        },
      });

      setCurrentStep(data.next_step || 1);
      setCurrentQuestion(data.question_text || '');
      setPhase('chat');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setIsRetrying(false);
    }
  };

  const handleAnswer = async (e) => {
    e.preventDefault();
    setError('');

    if (answer.trim().length < MIN_ANSWER_LENGTH) {
      setError(t('onboarding.error_short_answer'));
      return;
    }

    setIsLoading(true);
    setIsRetrying(false);

    const nextHistory = [
      ...conversationHistory,
      { q: currentQuestion, a: answer.trim() },
    ];

    try {
      const data = await callOnboarding({
        step: currentStep,
        language: lang.toLowerCase(),
        conversation_history: nextHistory,
      });

      setConversationHistory(nextHistory);
      setAnswer('');

      if (data.status === 'complete') {
        await updateUserFilters((data.final_filters || []).map(Number).filter(Number.isFinite));
        login();
        navigate('/mode');
        return;
      }

      setCurrentStep(data.next_step || currentStep + 1);
      setCurrentQuestion(data.next_question_text || t('onboarding.fallback_question'));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setIsRetrying(false);
    }
  };

  const progress = phase === 'intro' ? 0 : Math.min(currentStep, 3);
  const occupationOptions = [
    { value: 'student', label: t('onboarding.occupation_student') },
    { value: 'angajat', label: t('onboarding.occupation_employee') },
    { value: 'antreprenor', label: t('onboarding.occupation_entrepreneur') },
    { value: 'altceva', label: t('onboarding.occupation_other') },
  ];

  const isStartDisabled = isLoading || !userInfo.varsta || !userInfo.ocupatie || !userInfo.oras.trim();
  const isAnswerDisabled = isLoading || answer.trim().length < MIN_ANSWER_LENGTH;
  const loadingText = isRetrying ? t('onboarding.btn_retrying') : t('onboarding.btn_loading');

  const resetFlow = () => {
    setPhase('intro');
    setCurrentStep(0);
    setCurrentQuestion('');
    setConversationHistory([]);
    setAnswer('');
    setError('');
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

        <div className="onboarding-progress" aria-label={t('onboarding.progress_label')}>
          {[0, 1, 2, 3].map(step => (
            <span key={step} className={progress >= step ? 'active' : ''}>
              {progress > step ? <Check size={14} /> : step}
            </span>
          ))}
        </div>

        {phase === 'intro' ? (
          <form onSubmit={handleStart} className="onboarding-form">
            <motion.div
              className="onboarding-fields"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <label>
                {t('onboarding.name')}
                <input
                  type="text"
                  value={userInfo.nume}
                  onChange={(e) => handleInfoChange('nume', e.target.value)}
                  className="onboarding-input"
                  placeholder={t('onboarding.name_placeholder')}
                />
              </label>

              <div className="onboarding-row">
                <label>
                  {t('onboarding.age')}
                  <input
                    type="number"
                    min="13"
                    max="120"
                    value={userInfo.varsta}
                    onChange={(e) => handleInfoChange('varsta', e.target.value)}
                    className="onboarding-input"
                    placeholder="21"
                    required
                  />
                </label>

                <label>
                  {t('onboarding.city')}
                  <input
                    type="text"
                    value={userInfo.oras}
                    onChange={(e) => handleInfoChange('oras', e.target.value)}
                    className="onboarding-input"
                    placeholder={t('onboarding.city_placeholder')}
                    required
                  />
                </label>
              </div>

              <label>
                {t('onboarding.occupation')}
                <select
                  value={userInfo.ocupatie}
                  onChange={(e) => handleInfoChange('ocupatie', e.target.value)}
                  className="onboarding-input"
                  required
                >
                  <option value="">{t('onboarding.occupation_placeholder')}</option>
                  {occupationOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>

              <label className="onboarding-checkbox">
                <input
                  type="checkbox"
                  checked={userInfo.is_remote}
                  onChange={(e) => handleInfoChange('is_remote', e.target.checked)}
                />
                <span>{t('onboarding.remote')}</span>
              </label>
            </motion.div>

            <div className="onboarding-footer">
              <button type="submit" className="btn-finish" disabled={isStartDisabled}>
                {isLoading ? loadingText : t('onboarding.btn_start')}
                {isLoading ? <Loader2 className="spin" size={20} /> : <ArrowRight size={20} />}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleAnswer} className="onboarding-form">
            <motion.div
              className="onboarding-question"
              key={currentQuestion}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <span>{t('onboarding.ai_label')}</span>
              <p>{currentQuestion}</p>
            </motion.div>

            <label className="onboarding-answer">
              {t('onboarding.answer_label')}
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="onboarding-input"
                placeholder={t('onboarding.answer_placeholder')}
                rows="5"
              />
            </label>

            <div className="onboarding-footer">
              <button type="submit" className="btn-finish" disabled={isAnswerDisabled}>
                {isLoading ? loadingText : currentStep >= 3 ? t('onboarding.btn_finish') : t('onboarding.btn_next')}
                {isLoading ? <Loader2 className="spin" size={20} /> : <ArrowRight size={20} />}
              </button>
              <button type="button" className="btn-reset" onClick={resetFlow} disabled={isLoading}>
                <RotateCcw size={16} />
                {t('onboarding.btn_restart')}
              </button>
              <span className="onboarding-hint">{t('onboarding.answer_hint')}</span>
            </div>
          </form>
        )}

        {error && <div className="onboarding-error" role="alert">{error}</div>}


      </div>
    </div>
  );
}

export default Onboarding;
