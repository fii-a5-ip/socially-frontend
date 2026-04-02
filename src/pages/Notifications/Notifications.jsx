import './Notifications.css'

/**
 * Notifications — Pagina de notificări.
 *
 * Responsabil: Dinu
 *
 * TODO:
 * - Lista de notificări (invitații la grupuri, evenimente, mesaje)
 * - Marcare ca citit / necitit
 * - Filtrare după tip
 * - Empty state (când nu sunt notificări)
 * - Notificări real-time (WebSocket / polling)
 * - Design responsive
 */
function Notifications() {
  return (
    <div className="page-skeleton">
      <span className="page-skeleton__icon">🔔</span>
      <h1 className="page-skeleton__title">Notificări</h1>
      <p className="page-skeleton__subtitle">Pagina de notificări — în curs de dezvoltare</p>
      <span className="page-skeleton__assignee">👤 Responsabil: Dinu</span>
      <span className="page-skeleton__route">Ruta: /notifications</span>
    </div>
  )
}

export default Notifications
