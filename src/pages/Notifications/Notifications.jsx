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


/*De la Backend*/
//import { definetelyRealNotifs } from './DateFalselol.js';
/**
 * Notifications — Pagina de notificări.
 *
 * Responsabil: Dinu
 */
const API = import.meta.env.VITE_API_URL;

import "./Notifications.css";
import { useEffect, useState } from "react";
import { useTranslation } from "../../hooks/useTranslation";

// TEMPORARY
// import { getNotifications } from "../../api/notificationsApis/notificationsApi";

function Notifications() {
  const { t } = useTranslation();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showArchived, setShowArchived] = useState(false);
  const [showUnarchived, setShowUnarchived] = useState(true);

  const userTypes = ["GROUP_INVITE"];
  const systemTypes = ["OUTGOING_UPDATE", "REMINDER"];

  const isSystemType = (type) => systemTypes.includes(type);

const normalizeNotification = (notif) => {
  return {
    id: notif.id,
    userId: notif.actorUserId,
    username: notif.username,
    avatar: notif.profileImageUrl,
    type: notif.type,
    text: notif.message,
    isRead: notif.read,
    time: notif.createdAt,
    referenceId: notif.referenceId,
    referenceType: notif.referenceType,
    hasActions: notif.type === "GROUP_INVITE",
  };
};



useEffect(() => {
  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${API}/api/notifications`, {
        credentials: "include",
      });

      const data = await res.json();
      console.log(data);
      const mapped = data.map(normalizeNotification);

      setNotifications(mapped);
    } catch (error) {
      console.error("Ciuciu notificari:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchNotifications();
}, []);


  const handleAccept = (id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const newNotifications = notifications.filter((notif) => !notif.isRead);

  const archivedNotifications = notifications.filter(
    (notif) => notif.isRead
  );

  const renderNotifications = (list, typeList) => {
  const filtered = list.filter((notif) =>
    typeList.includes(notif.type)
  );

  if (filtered.length === 0) return null;

  return (
    <div className="notifications_list">
      {filtered.map((notif) => (
        <div
          key={notif.id}
          className={`card notification
            ${notif.isRead ? "" : "notification-unread"}
            ${
              isSystemType(notif.type)
                ? "notification--system"
                : "notification--user"
            }`}
        >
          <div className="notification_avatar">
            {isSystemType(notif.type) ? (
              <span>⚙️</span>
            ) : (
              <span>👤</span>
            )}
          </div>

          <div className="notification_content">
            <div className="notification_top">
              <div className="notification_username">
                {isSystemType(notif.type)
                  ? "[SYSTEM]"
                  : `User ${notif.userId}`}

                <span className="notification_time">
                 {" "}
                  {new Date(notif.time).toLocaleString()}
                </span>
              </div>

              {!notif.isRead && (
                <div className="notification_actions">
                  <button
                    className="btn btn--primary"
                    onClick={() => handleAccept(notif.id)}
                  >
                    {t("notifications.accept")}
                  </button>
                </div>
              )}
            </div>

            <p className="notification_text">
              {notif.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container">
      <header className="notifications_header">
        <h1 className="notifications_title">
          {t("notifications.title")}
          <span className="notifications_accent">🔔</span>
        </h1>
      </header>

      <section className="notifications_section">
        {newNotifications.length === 0 ? (
          <p className="notifications_empty">
            {t("notifications.empty")}
          </p>
        ) : (
          <>
            <h2 className="notifications_section-title">
              {t("notifications.new")}

              <button
                className="btn btn--secondary toggle"
                onClick={() =>
                  setShowUnarchived((prev) => !prev)
                }
              >
                {showUnarchived
                  ? t("notifications.toggle_hide")
                  : t("notifications.toggle_show")}
              </button>
            </h2>

            {showUnarchived && (
              <>
                {renderNotifications(
                  newNotifications,
                  userTypes
                )}

                {renderNotifications(
                  newNotifications,
                  systemTypes
                )}
              </>
            )}
          </>
        )}
      </section>

      <section className="notifications_section">
        <h2 className="notifications_section-title">
          {t("notifications.archived")}

          <button
            className="btn btn--secondary toggle"
            onClick={() =>
              setShowArchived((prev) => !prev)
            }
          >
            {showArchived
              ? t("notifications.toggle_hide")
              : t("notifications.toggle_show")}
          </button>
        </h2>

        {showArchived && (
          <>
            {renderNotifications(
              archivedNotifications,
              userTypes
            )}

            {renderNotifications(
              archivedNotifications,
              systemTypes
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default Notifications;
