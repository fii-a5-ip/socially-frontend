import './CreateGroup.css'

/**
 * CreateGroup — Pagina de creare a unui grup nou.
 *
 * Responsabil: Edi
 *
 * TODO:
 * - Formular: nume grup, descriere, imagine
 * - Adăugare membri (search + invite)
 * - Selectare categorie / tip de ieșire
 * - Validare formular (folosește useForm + validation.js)
 * - Preview grup
 * - Design responsive
 *
 * Notă: Poți folosi componentele existente:
 *   - FormInput din src/components/FormInput/FormInput.jsx
 *   - useForm din src/hooks/useForm.js
 *   - Funcții de validare din src/utils/validation.js
 */
function CreateGroup() {
  return (
    <div className="page-skeleton">
      <span className="page-skeleton__icon">➕</span>
      <h1 className="page-skeleton__title">Creează un Grup</h1>
      <p className="page-skeleton__subtitle">Formularul de creare grup — în curs de dezvoltare</p>
      <span className="page-skeleton__assignee">👤 Responsabil: Edi</span>
      <span className="page-skeleton__route">Ruta: /groups/create</span>
    </div>
  )
}

export default CreateGroup
