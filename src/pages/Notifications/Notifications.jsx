/**
 * Notifications — Pagina de notificări.
 *
 * Responsabil: Dinu
 *
 * Funcționalități:
 * - Lista de notificări (invitații la grupuri, evenimente, mesaje)
 * - Marcare ca citit / necitit
 * - Filtrare după tip (user vs system)
 * - Empty state (când nu sunt notificări)
 * - Design responsive
 */

import { useState, useEffect } from "react";
import { API_URL } from "../../api/config";
import './Notifications.css';
import { useTranslation } from '../../hooks/useTranslation';

function Notifications() {
  const { t } = useTranslation();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const [showUnarchived, setUnarchived] = useState(true);
  const [actionError, setActionError] = useState(null);
  const [pendingActionId, setPendingActionId] = useState(null);

  const userTypes = ["GROUP_INVITE","USER_MESSAGE"];
  const systemTypes = ["OUTGOING_UPDATE", "REMINDER", "SYSTEM_UPDATE", "SYSTEM_MESSAGE"];

  const isSystemType = (type) => systemTypes.includes(type);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Nu ești autentificat");
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/api/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Eroare la încărcare notificări");
        return res.json();
      })
      .then((data) => {
        const mapped = data.map((n) => ({
          id: n.id,
          actorUserId: n.actorUserId,
          username: n.username,
          avatar: n.profileImageUrl,
          type: n.type,
          text: n.message,
          time: new Date(n.createdAt),
          isRead: n.read,
          referenceId: n.referenceId,
          referenceType: n.referenceType,
          hasActions: n.type === "GROUP_INVITE",
        }));
        setNotifications(mapped);
      })
      .catch((err) => {
        console.error("Error loading notifications:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleInviteAction = async (id, action) => {

    const token = localStorage.getItem("token");
    setPendingActionId(id);
    setActionError(null);

    const currentNotif = notifications.find(n => n.id === id);
    const isInvite = currentNotif?.hasActions;

    try {
  if (isInvite && (action === "accept" || action === "decline")) {
    const responseModificareTabel_Edi = await fetch(`${API_URL}/api/notifications/${id}/${action}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
           if (!responseModificareTabel_Edi.ok) {
        throw new Error(action === "accept"
          ? "Nu s-a putut accepta invitația"
          : "Nu s-a putut refuza invitația");
        }
      }

      
    const responseModificareContor_Dinu = await fetch(`${API_URL}/api/notifications/${id}/read`,{
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });
      if (!responseModificareContor_Dinu.ok) {throw new Error("Eroare la procesarea notificării"); }

    // Mută notificarea în Archived ( teoretic functional )
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true }: notif
      )
    );
    
    window.dispatchEvent(new Event("notificationChanged")); //posibil sa mearga si fara window.

  } catch (error) {
    console.error("Eroare la apelul API:", error);
    setActionError(error.message);
  } finally {
    setPendingActionId(null);
  }
  };

  const newNotifications = notifications.filter((notif) => !notif.isRead);
  const archivedNotifications = notifications.filter((notif) => notif.isRead);

  const renderNotifications = (list, typeFilter) => {
    const filtered = list.filter((notif) => typeFilter.includes(notif.type));

    if (filtered.length === 0) return null;
    return (
      <>
        <h3 className="notifications_group-title">
          {typeFilter === userTypes
            ? t('notifications.group_users')
            : t('notifications.group_system')}
        </h3>

        <div className="notifications_list">
          {filtered.map((notif) => (
            <div
              key={notif.id}
              className={`card notification 
                ${notif.isRead ? '' : 'notification-unread'} 
                ${!isSystemType(notif.type) ? 'notification--user' : 'notification--system'}`}
            >
              <div className="notification_avatar">
                {notif.avatar ? (
                  <img src={notif.avatar} alt={notif.username || "avatar"} />
                ) : isSystemType(notif.type) ? (
                  <span>⚙️</span>
                ) : (
                  <span>👤</span>
                )}
              </div>

              <div className="notification_content">
                <div className="notification_top">
                  <div className="notification_username">
                    {isSystemType(notif.type)
                      ? `[${notif.type}] - `
                      : `${notif.username || notif.actorUserId || "?"} - `}
                    <span className="notification_time">
                      {notif.time.toLocaleString()}
                    </span>
                  </div>
                  {notif.hasActions && !notif.isRead && (
                    <div className="notification_actions">


                      <button
                        className="btn btn--primary"
                        disabled={pendingActionId === notif.id}
                        onClick={() => handleInviteAction(notif.id, "accept")}
                      >
                        {t('notifications.accept')}
                      </button>

                      <button
                        className="btn btn--secondary"
                        disabled={pendingActionId === notif.id}
                        onClick={() => handleInviteAction(notif.id, "decline")}
                      >
                        {t('notifications.decline')}
                      </button>
                    </div>
                  )}

                   {!notif.hasActions && !notif.isRead && (
                      <button  
                        className="notification_X_button"
                        disabled={pendingActionId === notif.id}
                        onClick={() => handleInviteAction(notif.id, "remove")}
                        > x </button> )}



                </div>
                <p className="notification_text">{notif.text}</p>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  if (loading) {
    return (
      <div className="container">
        <header className="notifications_header">
          <h1 className="notifications_title">
            {t('notifications.title')} <span className="notifications_accent">🔔</span>
          </h1>
        </header>
        <p style={{ textAlign: 'center', padding: '2rem', opacity: 0.7 }}>
          {t('notifications.loading', 'Se încarcă...')}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <header className="notifications_header">
          <h1 className="notifications_title">
            {t('notifications.title')} <span className="notifications_accent">🔔</span>
          </h1>
        </header>
        <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-error, #ef4444)' }}>
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="notifications_header">
        <h1 className="notifications_title">
          {t('notifications.title')} <span className="notifications_accent">🔔</span>
        </h1>
      </header>

      <section className="notifications_section">
        {actionError && (
          <p className="notifications_action-error">{actionError}</p>
        )}

        {newNotifications.length === 0 ? (
          <p className="notifications_empty">
            {t('notifications.empty')}
          </p>
        ) : (
          <>
            <h2 className="notifications_section-title notifications_section_electricboogaloo">
              {t('notifications.new')}
              <button
                className="btn btn--secondary toggle"
                onClick={() => setUnarchived((prev) => !prev)}
              >
                {showUnarchived ? t('notifications.toggle_hide') : t('notifications.toggle_show')}
              </button>
            </h2>
            {showUnarchived && (
              <>
                {renderNotifications(newNotifications, userTypes)}
                {renderNotifications(newNotifications, systemTypes)}
              </>
            )}
          </>
        )}
      </section>

      <section className="notifications_section">
        <h2 className="notifications_section-title notifications_section_electricboogaloo">
          {t('notifications.archived')}
          <button
            className="btn btn--secondary toggle"
            onClick={() => setShowArchived((prev) => !prev)}
          >
            {showArchived ? t('notifications.toggle_hide') : t('notifications.toggle_show')}
          </button>
        </h2>

        {showArchived && (
          <>
            {renderNotifications(archivedNotifications, userTypes)}
            {renderNotifications(archivedNotifications, systemTypes)}
          </>
        )}
      </section>
    </div>
  );
}

export default Notifications;
