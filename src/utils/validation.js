/**
 * Socially — Validation Utilities
 *
 * Funcții pure de validare reutilizabile pentru formulare.
 * Fiecare funcție returnează un string cu mesajul de eroare sau null dacă e valid.
 *
 * Exemplu de utilizare:
 *   const error = validateEmail('test@example.com') // null (valid)
 *   const error = validateEmail('invalid')           // 'Adresa de email nu este validă.'
 */

// ---- Regex patterns ----
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const PHONE_REGEX = /^(\+40|0)[0-9]{9}$/

/**
 * Verifică dacă un câmp este completat.
 * @param {string} value - Valoarea câmpului
 * @param {string} fieldName - Numele câmpului (pentru mesajul de eroare)
 * @returns {string|null} Mesaj de eroare sau null
 */
export function validateRequired(value, fieldName = 'Câmpul') {
  if (!value || value.toString().trim() === '') {
    return `${fieldName} este obligatoriu.`
  }
  return null
}

/**
 * Verifică formatul adresei de email.
 * @param {string} email
 * @returns {string|null}
 */
export function validateEmail(email) {
  if (!email || email.trim() === '') {
    return 'Email-ul este obligatoriu.'
  }
  if (!EMAIL_REGEX.test(email.trim())) {
    return 'Adresa de email nu este validă.'
  }
  return null
}

/**
 * Verifică lungimea minimă a unui câmp.
 * @param {string} value
 * @param {number} min - Lungimea minimă
 * @param {string} fieldName
 * @returns {string|null}
 */
export function validateMinLength(value, min, fieldName = 'Câmpul') {
  if (value && value.length < min) {
    return `${fieldName} trebuie să aibă minim ${min} caractere.`
  }
  return null
}

/**
 * Verifică lungimea maximă a unui câmp.
 * @param {string} value
 * @param {number} max
 * @param {string} fieldName
 * @returns {string|null}
 */
export function validateMaxLength(value, max, fieldName = 'Câmpul') {
  if (value && value.length > max) {
    return `${fieldName} nu poate depăși ${max} caractere.`
  }
  return null
}

/**
 * Verifică complexitatea parolei.
 * Cerințe: minim 8 caractere, cel puțin o literă mare, cel puțin o cifră.
 * @param {string} password
 * @returns {string|null}
 */
export function validatePassword(password) {
  if (!password) {
    return 'Parola este obligatorie.'
  }
  if (password.length < 8) {
    return 'Parola trebuie să aibă minim 8 caractere.'
  }
  if (!/[A-Z]/.test(password)) {
    return 'Parola trebuie să conțină cel puțin o literă mare.'
  }
  if (!/[0-9]/.test(password)) {
    return 'Parola trebuie să conțină cel puțin o cifră.'
  }
  return null
}

/**
 * Verifică dacă cele două parole coincid.
 * @param {string} password
 * @param {string} confirmPassword
 * @returns {string|null}
 */
export function validatePasswordMatch(password, confirmPassword) {
  if (!confirmPassword) {
    return 'Confirmarea parolei este obligatorie.'
  }
  if (password !== confirmPassword) {
    return 'Parolele nu coincid.'
  }
  return null
}

/**
 * Verifică formatul numărului de telefon (format RO).
 * @param {string} phone
 * @returns {string|null}
 */
export function validatePhone(phone) {
  if (!phone || phone.trim() === '') {
    return null // telefonul poate fi opțional
  }
  if (!PHONE_REGEX.test(phone.trim())) {
    return 'Numărul de telefon nu este valid. Folosește formatul: 07XXXXXXXX'
  }
  return null
}

/**
 * Validare completă a unui formular.
 * Primește un obiect cu valorile și un obiect cu regulile de validare.
 *
 * Exemplu:
 *   const errors = validateForm(
 *     { email: 'test', password: '123' },
 *     {
 *       email: (v) => validateEmail(v),
 *       password: (v) => validatePassword(v),
 *     }
 *   )
 *   // errors = { email: 'Adresa de email nu este validă.', password: 'Parola trebuie...' }
 *
 * @param {Object} values - Valorile formularului { fieldName: value }
 * @param {Object} rules - Regulile de validare { fieldName: (value) => errorMsg | null }
 * @returns {Object} Obiect cu erorile { fieldName: errorMsg } (gol dacă totul e valid)
 */
export function validateForm(values, rules) {
  const errors = {}
  for (const field in rules) {
    const error = rules[field](values[field], values)
    if (error) {
      errors[field] = error
    }
  }
  return errors
}
