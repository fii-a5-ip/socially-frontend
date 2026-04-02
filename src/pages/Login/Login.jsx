import { Link } from 'react-router-dom'
import { useForm } from '../../hooks/useForm'
import { validateEmail, validatePassword } from '../../utils/validation'
import FormInput from '../../components/FormInput/FormInput'
import './Login.css'

/**
 * Login — Pagina de autentificare.
 *
 * Responsabili: Rluca + Teo
 *
 * TODO:
 * - Integrare cu backend API (endpoint de login)
 * - "Ține-mă minte" checkbox
 * - "Am uitat parola" flow
 * - Login cu Google / Social login
 * - Redirect după login reușit
 * - Loading state pe butonul de submit
 */
function Login() {
  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useForm(
    {
      email: '',
      password: '',
    },
    {
      email: (value) => validateEmail(value),
      password: (value) => validatePassword(value),
    },
    (formValues) => {
      // TODO: Trimite request către backend
      console.log('Login submit:', formValues)
      alert('Login reușit! (placeholder — conectează cu API-ul)')
    }
  )

  return (
    <div className="login">
      <div className="login__card card">
        <div className="login__header">
          <h1 className="login__title">Bine ai revenit! 👋</h1>
          <p className="login__subtitle">Conectează-te la contul tău Socially</p>
        </div>

        <form className="login__form" onSubmit={handleSubmit} noValidate>
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
            placeholder="Introdu parola"
            error={errors.password}
            touched={touched.password}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />

          <button type="submit" className="btn btn--primary btn--full btn--large">
            Conectare
          </button>
        </form>

        <p className="login__footer">
          Nu ai cont? <Link to="/register">Creează unul</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
