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
import { definetelyRealNotifs } from './DateFalselol.js';
import { useEffect, useState } from "react";
import axios from "axios";
const API = import.meta.env.VITE_API_URL;
console.log("API:", API);
console.log(typeof t);

import './Notifications.css'
import { useTranslation } from '../../hooks/useTranslation';

const test_Date= new Date();
var check  = false;
const test_Time= test_Date.getHours() + ':' + test_Date.getMinutes();

/*Asta Ramane aici temporar*/
function Notifications() {

  const { t } = useTranslation();
 
  const [notifications, setNotifications] = useState([]);

  const userTypes = ["GROUP_INVITE"]; const systemTypes = ["OUTGOING_UPDATE", "REMINDER"];

  const isSystemType = (type) => systemTypes.includes(type)// GROUPD_INVITE va fi system type

  useEffect(() => { setNotifications(definetelyRealNotifs);}, []);

  /*colectez datele "reale" aici:


  useEffect(() => {
  axios.get('/api/notifications')
    .then(res => {

      console.log("RAW RESPONSE:", res.data); //temporar

      const mapped = res.data.map(n => ({
        id: n.id,
        actorUserId: n.actorUserId,
        type: n.type,// GROUP_INVITE ; OUTGOING_UPDATE ; REMINDER
        text: n.message, //fostul content
        time: new Date(n.createdAt),
        isRead: n.read,
        referenceId: n.referenceId, //
        referenceType: n.referenceType, //
        hasActions: n.type === "GROUP_INVITE"
      }));

      setNotifications(mapped);
    })
    .catch(err => console.error(err));
}, []);

*/

  const [showArchived, setShowArchived] = useState(false);
  const [showUnarchived, setUnarchived] = useState(true);

  const handleAccept = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id == id ? { ...notif, isRead: true } : notif
      )
    );
  };//

  const newNotifications = notifications.filter(notif => !notif.isRead);
  const archivedNotifications = notifications.filter(notif => notif.isRead);

  const renderNotifications = (list, type_de_verificat) => {
  const filtered = list.filter(notif =>
    type_de_verificat.includes(notif.type)
);

    if (filtered.length === 0 ) return null; //poate introduc un mesaj de bun venit
      return (
        <>
          <h3 className="notifications_group-title">
            {type_de_verificat == 'user'
              ? t('notifications.group_users')
              : t('notifications.group_system')}
          </h3>

          <div className="notifications_list">
            {filtered.map(notif => (
              <div     key={notif.id}      className={` card notification 
                  ${notif.isRead ? '' : 'notification-unread'} 
                  ${!isSystemType(notif.type) ? 'notification--user' : 'notification--system'}  `} >

                
                <div className="notification_avatar">
                    {notif.id === 1 && (<img src="https://people.com/thmb/rqeA7q27K9xxwiOB3IryaCl2hUE=/1080x720/filters:no_upscale():max_bytes(150000):strip_icc():focal(734x309:736x311)/keanu-reeves-110325-248bc604f7ed4bc0b7ff4159c7ced811.jpg"/>)}
                  {notif.id !=1 && (isSystemType(notif.type) ? ( <span> ⚙️ </span>) : ( <span> 👤 </span>) )
                  /* (<img src= "https://tse2.mm.bing.net/th/id/OIP.ivROJMldRz-4M_M5rOWKgAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3/"> ) */  }
                </div>

                <div className="notification_content">
                    <div className="notification_top">
                      <div className="notification_username">                  
                      { isSystemType(notif.type) ? "[system notif type] - "  :   notif.userId  + " - " /* <img src= {notif.avatar}/> */    } 
                      <span className="notification_time"> {notif.time.toLocaleString()} </span>
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
                  <p className="notification_text">{notif.text}</p>
                 
                </div>


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
          {showUnarchived ? t('notifications.toggle_hide') : t('notifications.toggle_show')}
          </button>
            </h2>
            {showUnarchived && ( 
           <>
            {renderNotifications(newNotifications, userTypes)}
            {renderNotifications(newNotifications, systemTypes)}
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
            {renderNotifications(archivedNotifications, userTypes)}
            {renderNotifications(archivedNotifications, systemTypes)}
          </>
        )  }
      </section>
    </div>
  );
}

export default Notifications;
