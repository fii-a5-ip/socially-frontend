import { useState, useCallback } from 'react'
import { validateForm } from '../utils/validation'

/**
 * Hook reutilizabil pentru gestionarea formularelor cu validare.
 *
 * Exemplu de utilizare:
 *   const { values, errors, touched, handleChange, handleBlur, handleSubmit, isValid } = useForm(
 *     { email: '', password: '' },
 *     {
 *       email: (v) => validateEmail(v),
 *       password: (v) => validatePassword(v),
 *     },
 *     (values) => { console.log('Submit:', values) }
 *   )
 *
 * @param {Object} initialValues - Valorile inițiale ale formularului
 * @param {Object} validationRules - Regulile de validare { field: (value, allValues) => error | null }
 * @param {Function} onSubmit - Callback apelat la submit valid
 */
export function useForm(initialValues, validationRules, onSubmit) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Actualizează valoarea unui câmp
  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))

    // Dacă câmpul a fost atins, revalidează pe change
    if (touched[name]) {
      const fieldError = validationRules[name]
        ? validationRules[name](value, { ...values, [name]: value })
        : null
      setErrors((prev) => ({ ...prev, [name]: fieldError }))
    }
  }, [touched, validationRules, values])

  // Marchează câmpul ca "atins" și validează
  const handleBlur = useCallback((e) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))

    if (validationRules[name]) {
      const fieldError = validationRules[name](value, values)
      setErrors((prev) => ({ ...prev, [name]: fieldError }))
    }
  }, [validationRules, values])

  // Submit cu validare completă
  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault()

    // Marchează toate câmpurile ca touched
    const allTouched = {}
    for (const key in initialValues) {
      allTouched[key] = true
    }
    setTouched(allTouched)

    // Validare completă
    const formErrors = validateForm(values, validationRules)
    setErrors(formErrors)

    const hasErrors = Object.values(formErrors).some((error) => error !== null)
    if (!hasErrors) {
      setIsSubmitting(true)
      try {
        await Promise.resolve(onSubmit(values))
      } finally {
        setIsSubmitting(false)
      }
    }
  }, [values, validationRules, onSubmit, initialValues])

  // Resetează formularul
  const resetForm = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialValues])

  // Verifică dacă formularul e valid (fără erori)
  const isValid = Object.values(errors).every((error) => error === null || error === undefined)
    && Object.keys(touched).length > 0

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues,
    setErrors,
  }
}
