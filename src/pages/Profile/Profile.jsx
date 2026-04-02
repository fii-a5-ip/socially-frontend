import './Profile.css'

/**
 * Profile — Pagina de profil a utilizatorului.
 *
 * Responsabili: Ștefan + Călin
 *
 * TODO:
 * - Avatar + informații de bază (nume, email, bio)
 * - Editare profil (formular cu validare)
 * - Statistici (grupuri, ieșiri, etc.)
 * - Istoric ieșiri
 * - Setări cont (schimbare parolă, notificări)
 * - Buton de deconectare
 * - Design responsive
 *
 * Notă: Poți folosi componentele existente:
 *   - FormInput din src/components/FormInput/FormInput.jsx
 *   - useForm din src/hooks/useForm.js
 *   - Funcții de validare din src/utils/validation.js
 */
function Profile() {
  return (
    <div className="page-skeleton">
      <span className="page-skeleton__icon">👤</span>
      <h1 className="page-skeleton__title">Profilul meu</h1>
      <p className="page-skeleton__subtitle">Pagina de profil — în curs de dezvoltare</p>
      <span className="page-skeleton__assignee">👤 Responsabili: Ștefan + Călin</span>
      <span className="page-skeleton__route">Ruta: /profile</span>
    </div>
  )
}

export default Profile
