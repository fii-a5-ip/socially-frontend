import React from 'react';
import '../../../components/FormInput/FormInput.css';

export function FormTextArea({
  label,
  name,
  value,
  placeholder,
  error,
  touched,
  onChange,
  onBlur,
  required = false,
  rows = 4
}) {
  const hasError = touched && error;
  const isValid = touched && !error && value;

  return (
    <div className={`form-input ${hasError ? 'form-input--error' : ''} ${isValid ? 'form-input--valid' : ''}`}>
      {label && (
        <label className="form-input__label" htmlFor={name}>
          {label}
          {required && <span className="form-input__required">*</span>}
        </label>
      )}
      <textarea
        className="form-input__field"
        id={name}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        rows={rows}
        style={{ resize: 'vertical', minHeight: '80px' }}
        aria-invalid={!!hasError}
        aria-describedby={hasError ? `${name}-error` : undefined}
      />
      {hasError && (
        <p className="form-input__error" id={`${name}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
