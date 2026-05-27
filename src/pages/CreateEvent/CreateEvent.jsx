import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Settings2,
  CheckCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

import { API_URL } from '../../api/config';
import { useForm } from '../../hooks/useForm';
import { validateRequired } from '../../utils/validation';
import { useTranslation } from '../../hooks/useTranslation';

import { Step1Details } from './components/Step1Details';
import { Step2Logistics } from './components/Step2Logistics';
import './CreateEvent.css';

const initialValues = {
  name: '',
  url: '',
  description: '',
  date: '',
  address: '',
  locationId: null,
  mapHtml: '',
  weatherData: null,
  filterIds: []
};

const validationRules = {
  name: (v) => validateRequired(v, 'Numele evenimentului')
};

function getAuthHeaders(withBody = false) {
  const token = localStorage.getItem('token');

  return {
    ...(withBody ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

function formatDateForInput(value) {
  if (!value) {
    return '';
  }

  return String(value).slice(0, 16);
}

async function parseResponse(response, fallbackMessage) {
  if (!response.ok) {
    let message = fallbackMessage;

    try {
      const body = await response.json();
      message = body?.message || body?.error || fallbackMessage;
    } catch {
      message = fallbackMessage;
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

function CreateEvent() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const groupId = searchParams.get('groupId');
  const isEditMode = Boolean(id);

  const [step, setStep] = useState(1);
  const [creationSuccess, setCreationSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [apiError, setApiError] = useState('');

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setValues,
    setErrors
  } = useForm(
    initialValues,
    validationRules,
    async () => {}
  );

  useEffect(() => {
    let cancelled = false;

    async function loadEvent() {
      if (!isEditMode) {
        return;
      }

      setIsLoading(true);
      setApiError('');

      try {
        const response = await fetch(`${API_URL}/api/events/${id}`, {
          method: 'GET',
          headers: getAuthHeaders()
        });

        const eventData = await parseResponse(
          response,
          'Nu s-au putut încărca datele evenimentului.'
        );

        if (cancelled) {
          return;
        }

        const locationId = eventData?.locationId ?? null;

        setValues({
          name: eventData?.name || '',
          url: eventData?.url || '',
          description: eventData?.desc || '',
          date: formatDateForInput(eventData?.scheduledDate),
          address: eventData?.address
            || eventData?.formattedAddress
            || (locationId ? `Locația #${locationId}` : ''),
          locationId,
          mapHtml: '',
          weatherData: null,
          filterIds: Array.isArray(eventData?.filterIds)
            ? eventData.filterIds
            : []
        });
      } catch (error) {
        console.error('Create/Edit event load failed:', error);
        setApiError(error.message || 'A apărut o eroare la încărcare.');
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadEvent();

    return () => {
      cancelled = true;
    };
  }, [id, isEditMode, setValues]);

  const handleNextStep = () => {
    const stepErrors = {};

    if (!values.name?.trim()) {
      stepErrors.name = t('createevent.validation.name');
    }

    if (!values.url?.trim()) {
      stepErrors.url = t('createevent.validation.image_url');
    }

    if (!values.description?.trim()) {
      stepErrors.description = t('createevent.validation.desc');
    }

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setErrors({});
    setStep(2);
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const submitFinalEvent = async () => {
    const stepErrors = {};

    if (!values.date) {
      stepErrors.date = t('createevent.validation.date');
    }

    if (!values.locationId) {
      stepErrors.address = t('createevent.validation.address');
    }

    if (Object.keys(stepErrors).length > 0) {
      setErrors((previousErrors) => ({
        ...previousErrors,
        ...stepErrors
      }));
      return;
    }

    const payload = {
      name: values.name.trim(),
      url: values.url.trim(),
      desc: values.description.trim(),
      locationId: Number(values.locationId),
      groupId: groupId ? Number(groupId) : null,
      scheduledDate: values.date,
      filterIds: Array.isArray(values.filterIds)
        ? values.filterIds
        : []
    };

    setIsSaving(true);
    setApiError('');

    try {
      const response = await fetch(
        isEditMode
          ? `${API_URL}/api/events/${id}`
          : `${API_URL}/api/events`,
        {
          method: isEditMode ? 'PUT' : 'POST',
          headers: getAuthHeaders(true),
          body: JSON.stringify(payload)
        }
      );

      await parseResponse(
        response,
        isEditMode
          ? 'Nu s-a putut actualiza evenimentul.'
          : 'Nu s-a putut crea evenimentul.'
      );

      setCreationSuccess(true);

      setTimeout(() => {
        navigate(groupId ? `/groups/${groupId}` : '/discover');
      }, 2500);
    } catch (error) {
      console.error('Create/Edit event save failed:', error);
      setApiError(error.message || 'A apărut o eroare la salvare.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="ce-page">
      <div className="ce-container">

        <div className="ce-header">
          <h1 className="ce-page-title">
            {isEditMode
              ? t('createevent.edit_title')
              : t('createevent.title')}
          </h1>

          <p className="ce-page-subtitle">
            {isEditMode
              ? t('createevent.edit_subtitle')
              : t('createevent.subtitle')}
          </p>
        </div>

        <div className="ce-stepper">
          <div className={`ce-step ${step >= 1 ? 'active' : ''}`}>
            <div className="ce-step-icon">
              <Settings2 size={18} />
            </div>
            <span>{t('createevent.step_details')}</span>
          </div>

          <div className={`ce-stepper-line ${step >= 2 ? 'active' : ''}`}></div>

          <div className={`ce-step ${step >= 2 ? 'active' : ''}`}>
            <div className="ce-step-icon">
              <MapPin size={18} />
            </div>
            <span>{t('createevent.step_logistics')}</span>
          </div>

          <div className={`ce-stepper-line ${creationSuccess ? 'active' : ''}`}></div>

          <div className={`ce-step ${creationSuccess ? 'active' : ''}`}>
            <div className="ce-step-icon">
              <CheckCircle size={18} />
            </div>
            <span>{t('createevent.step_complete')}</span>
          </div>
        </div>

        <div className="ce-card">
          {apiError && (
            <p className="ce-error-text">{apiError}</p>
          )}

          {isLoading ? (
            <div className="ce-success-wrapper">
              <div className="ce-loader"></div>
              <p>Se încarcă...</p>
            </div>
          ) : (
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
                      setValues={setValues}
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

                  <h2>
                    {isEditMode
                      ? t('createevent.edit_success_title')
                      : t('createevent.success_title')}
                  </h2>

                  <p>
                    {isEditMode
                      ? t('createevent.edit_success_desc')
                      : t('createevent.success_desc')}
                  </p>

                  <div className="ce-loader"></div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {!creationSuccess && !isLoading && (
            <div className="ce-controls">
              {step === 2 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="ce-btn ce-btn-secondary"
                  disabled={isSaving}
                >
                  <ArrowLeft size={18} />
                  {t('createevent.btn_back')}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate(groupId ? `/groups/${groupId}` : '/discover')}
                  className="ce-btn ce-btn-secondary"
                  disabled={isSaving}
                >
                  <ArrowLeft size={18} />
                  {t('createevent.btn_back')}
                </button>
              )}

              {step === 1 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="ce-btn ce-btn-primary"
                  disabled={isSaving}
                >
                  {t('createevent.btn_next')}
                  <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={submitFinalEvent}
                  className="ce-btn ce-btn-primary success-btn"
                  disabled={isSaving}
                >
                  {isSaving ? 'Se salvează...' : t('createevent.btn_finish')}
                  <CheckCircle size={18} />
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
