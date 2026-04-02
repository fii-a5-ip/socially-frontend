import './FormInput.css'

/**
 * Componentă reutilizabilă de input pentru formulare.
 *
 * Props:
 *  - label: string — Eticheta câmpului
 *  - name: string — Numele câmpului (pentru name/id)
 *  - type: string — Tipul inputului (text, email, password, etc.)
 *  - value: string — Valoarea curentă
 *  - placeholder: string — Placeholder text
 *  - error: string|null — Mesajul de eroare (null = fără eroare)
 *  - touched: boolean — Dacă câmpul a fost atins
 *  - onChange: function — Handler pentru schimbare
 *  - onBlur: function — Handler pentru blur
 *  - required: boolean — Dacă câmpul e obligatoriu
 */
function FormInput({
  label,
  name,
  type = 'text',
  value,
  placeholder,
  error,
  touched,
  onChange,
  onBlur,
  required = false,
}) {
  const hasError = touched && error
  const isValid = touched && !error && value

  return (
    <div className={`form-input ${hasError ? 'form-input--error' : ''} ${isValid ? 'form-input--valid' : ''}`}>
      {label && (
        <label className="form-input__label" htmlFor={name}>
          {label}
          {required && <span className="form-input__required">*</span>}
        </label>
      )}
      <input
        className="form-input__field"
        type={type}
        id={name}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={!!hasError}
        aria-describedby={hasError ? `${name}-error` : undefined}
      />
      {hasError && (
        <p className="form-input__error" id={`${name}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export default FormInput
