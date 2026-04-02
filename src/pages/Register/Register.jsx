import { Link } from 'react-router-dom'
import { useForm } from '../../hooks/useForm'
import {
  validateRequired,
  validateEmail,
  validatePassword,
  validatePasswordMatch,
} from '../../utils/validation'
import FormInput from '../../components/FormInput/FormInput'
import './Register.css'

/**
 * Register — Pagina de înregistrare (Sign Up).
 *
 * Responsabili: Rluca + Teo
 *
 * TODO:
 * - Integrare cu backend API (endpoint de register)
 * - Termeni și condiții checkbox
 * - Upload avatar
 * - Login cu Google / Social
 * - Redirect după înregistrare reușită
 * - Loading state pe buton
 */
function Register() {
  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useForm(
    {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    {
      name: (value) => validateRequired(value, 'Numele'),
      email: (value) => validateEmail(value),
      password: (value) => validatePassword(value),
      confirmPassword: (value, allValues) => validatePasswordMatch(allValues.password, value),
    },
    (formValues) => {
      // TODO: Trimite request către backend
      console.log('Register submit for:', formValues.email)
      alert('Înregistrare reușită! (placeholder — conectează cu API-ul)')
    }
  )

  return (
    <div className="register">
      <div className="register__card card">
        <div className="register__header">
          <h1 className="register__title">Creează un cont 🚀</h1>
          <p className="register__subtitle">Alătură-te comunității Socially</p>
        </div>

        <form className="register__form" onSubmit={handleSubmit} noValidate>
          <FormInput
            label="Nume complet"
            name="name"
            type="text"
            value={values.name}
            placeholder="Ion Popescu"
            error={errors.name}
            touched={touched.name}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />

          <FormInput
            label="Email"
            name="email"
            type="email"
            value={values.email}
            placeholder="exemplu@email.com"
            error={errors.email}
            touched={touched.email}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />

          <FormInput
            label="Parolă"
            name="password"
            type="password"
            value={values.password}
            placeholder="Minim 8 caractere"
            error={errors.password}
            touched={touched.password}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />

          <FormInput
            label="Confirmă parola"
            name="confirmPassword"
            type="password"
            value={values.confirmPassword}
            placeholder="Repetă parola"
            error={errors.confirmPassword}
            touched={touched.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />

          <button type="submit" className="btn btn--primary btn--full btn--large">
            Creează contul
          </button>
        </form>

        <p className="register__footer">
          Ai deja cont? <Link to="/login">Conectează-te</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
