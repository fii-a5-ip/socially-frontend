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

import './Notifications.css'
import { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';

const test_Date= new Date();
var check  = false;
const test_Time= test_Date.getHours() + ':' + test_Date.getMinutes();

function Notifications() {
  const { t } = useTranslation();

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'user',
      isRead: true,
      text: 'Bairam',
      time: test_Time,
      hasActions: false,
    },
    {
      id: 2,
      type: 'system',
      isRead: false,
      text: 'Try 30 days of FREE premium Socially',
      time: 'acum 10 minute',
      hasActions: false,
    },
    {
      id: 3,
      type: 'user',
      isRead: false,
      text: 'hai la gratar sau cv',
      time: 'ieri',
      hasActions: true,
    },
    {
      id: 4,
      type: 'system',
      isRead: true,
      text: 'Profilul tău a fost actualizat',
      time: 'acum 2 minute',
      hasActions: false,
    },
    {
      id: 666,
      type: 'system',
      isRead: false,
      text: 'Profilul tău a fost actualizat',
      time: 'acum 2 zile',
      hasActions: false,
    }
  ]);

  const [showArchived, setShowArchived] = useState(false);
  const [showUnarchived, setUnarchived] = useState(true);

  const handleAccept = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id == id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const newNotifications = notifications.filter(notif => !notif.isRead);
  const archivedNotifications = notifications.filter(notif => notif.isRead);

  const renderNotifications = (list, type) => {
    var filtered = list.filter(notif => notif.type == type);

    if (filtered.length !== 0 && check == false)
      return (
        <>
          <h3 className="notifications_group-title">
            {type == 'user'
              ? t('notifications.group_users')
              : t('notifications.group_system')}
          </h3>

          <div className="notifications_list">
            {filtered.map(notif => (
              <div     key={notif.id}      className={` card notification 
                  ${notif.isRead ? '' : 'notification-unread'} 
                  ${notif.type == 'user' ? 'notification--user' : 'notification--system'}  `} >

                
                <div className="notification_avatar">
                  { notif.type === 'system' ? ( <span> ⚙️ </span>) : ( <div className="notification_avatar"> </div>)/* <img src= {notif.avatar}/> */  }
                </div>

                <div className="notification_content">
                    <div className="notification_top">
                      <class className="notification_username">                  
                      { notif.type === 'system' ? "[system notif type]"  :   "[username]"/* <img src= {notif.avatar}/> */    } 
                  </class>
                    <span className="notification_time">{notif.time} </span>
                  </div>
                  <p className="notification_text">{notif.text}</p>
                 
                </div>

                {/* BUTON ACCEPT/DECLINE */}
                {(notif.hasActions && notif.isRead == false) && (
                  <div className="notification_actions">
                    <button
                      className="btn btn--primary"
                      onClick={() => handleAccept(notif.id)}
                    >
                      {t('notifications.accept')}
                    </button>
                    <button className="btn btn--secondary">
                      {t('notifications.decline')}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      );
  };

  return (
    <div className="container">
      <header className="notifications_header">
        <h1 className="notifications_title">{t('notifications.title')} <span className="notifications_accent">🔔</span></h1>
      </header>

      <section className="notifications_section">
        {newNotifications.length === 0 ? (
          <p className="notifications_empty">
            {t('notifications.empty')}
          </p>
        ) : ( 
          <>
            <h2 className="notifications_section-title notifications_section_electricboogaloo">{t('notifications.new')}
          <button className="btn btn--secondary toggle" onClick={() => setUnarchived(prev => !prev)}>
          {showArchived ? t('notifications.toggle_hide') : t('notifications.toggle_show')}
          </button>
            </h2>
            {showUnarchived && ( 
           <>
            {renderNotifications(newNotifications, 'user')}
            {renderNotifications(newNotifications, 'system')}
           </> ) }
       </> )  }
      </section>

      <section className="notifications_section">
        <h2 className="notifications_section-title   notifications_section_electricboogaloo"> {t('notifications.archived')}
          <button className="btn btn--secondary toggle" onClick={() => setShowArchived(prev => !prev)}>
          {showArchived ? t('notifications.toggle_hide') : t('notifications.toggle_show')}
          </button>
        </h2>

        {showArchived && (
          <>
            {renderNotifications(archivedNotifications, 'user')}
            {renderNotifications(archivedNotifications, 'system')}
          </>
        )  }
      </section>
    </div>
  );
}

export default Notifications;
