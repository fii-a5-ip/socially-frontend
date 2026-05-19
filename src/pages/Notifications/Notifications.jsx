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


/**
 * Notifications — Pagina de notificări.
 *
 * Responsabil: Dinu
 */

import "./Notifications.css";
import { useEffect, useState } from "react";
import { useTranslation } from "../../hooks/useTranslation";

const API = import.meta.env.VITE_API_URL;

function Notifications() {
  const { t } = useTranslation();
 
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showArchived, setShowArchived] = useState(false);
  const [showUnarchived, setShowUnarchived] = useState(true);

  const userTypes = ["GROUP_INVITE", "MESSAGE", "OUTGOING_UPDATE"]; 
  const systemTypes = ["SYSTEM_UPDATE", "REMINDER"];

  const isSystemType = (type) => systemTypes.includes(type);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/api/notifications`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
        } else {
          console.error("Eroare la preluarea notificărilor");
        }
      } catch (error) {
        console.error("Eroare de rețea:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleAccept = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/notifications/${id}/read`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === id ? { ...notif, read: true } : notif
          )
        );
      }
    } catch (error) {
      console.error("Eroare la actualizarea stării:", error);
    }
  };

  const newNotifications = notifications.filter((n) => !n.read);
  const archivedNotifications = notifications.filter((n) => n.read);

  const renderNotifications = (list, types) => {
    return list
      .filter((notif) => types.includes(notif.type))
      .map((notif) => (
        <div
          key={notif.id}
          className={`notification ${notif.read ? "" : "notification-unread"} ${
            isSystemType(notif.type) ? "notification--system" : "notification--user"
          }`}
        >
          <div className="notification_avatar">
            {isSystemType(notif.type) ? (
              "⚙️"
            ) : notif.profileImageUrl ? (
              <img src={notif.profileImageUrl} alt="pfp" />
            ) : (
              "👤"
            )}
          </div>

          <div className="notification_content">
            <div className="notification_top">
              <div className="notification_username">
                {isSystemType(notif.type)
                  ? "[SYSTEM] - "
                  : `${notif.username || (notif.actorUserId ? `User ${notif.actorUserId}` : "User")} - `}
                
                
                <span className="notification_time">
                  {notif.createdAt ? new Date(notif.createdAt).toLocaleString() : ""}
                </span>
              </div>

              
              {!isSystemType(notif.type) && !notif.read && (
                <div className="notification_actions">
                  <button
                    className="btn btn--primary"
                    onClick={() => handleAccept(notif.id)}
                  >
                    {t('notifications.accept') || "Accept"}
                  </button>
                  <button
                    className="btn btn--secondary"
                    onClick={() => handleAccept(notif.id)}
                  >
                    {t('notifications.decline') || "Decline"}
                  </button>
                </div>
              )}
            </div>

            {/* Mesajul este dedesubt și se extinde independent */}
            <p className="notification_text">{notif.message}</p>
          </div>
        </div>
      ));
  };

  if (loading) {
    return <div className="notifications_empty">Se încarcă notificările...</div>;
  }

  return (
    <div className="page-layout-container" style={{ maxWidth: "900px", margin: "0 auto", width: "100%" }}>
      <div className="notifications_container">
        <header className="notifications_header">
          <h1 className="notifications_title">
            {t("notifications.title")} <span className="notifications_accent">🔔</span>
          </h1>
        </header>

        <section className="notifications_section">
          {newNotifications.length === 0 ? (
            <p className="notifications_empty">{t("notifications.empty")}</p>
          ) : (
            <>
              <h2 className="notifications_section-title notifications_section_electricboogaloo">
                {t("notifications.new")}
                <button
                  className="btn btn--secondary toggle"
                  onClick={() => setShowUnarchived((prev) => !prev)}
                >
                  {showUnarchived ? t("notifications.toggle_hide") : t("notifications.toggle_show")}
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
            {t("notifications.archived")}
            <button
              className="btn btn--secondary toggle"
              onClick={() => setShowArchived((prev) => !prev)}
            >
              {showArchived ? t("notifications.toggle_hide") : t("notifications.toggle_show")}
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
    </div>
  );
}

export default Notifications;
