//Not final

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
/*import 'java.time.LocalDate'*/
import { useState } from 'react';
/* List<notification> = new Array<>();*/

const test_Date= new Date();

var check  = false;

const test_Time= test_Date.getHours() + ':' + test_Date.getMinutes();

function Notifications() {


  const [notifications, setNotifications] = useState( [
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

  const handleAccept = (id) => { setNotifications(prev => prev.map
    (notif => notif.id == id ?
     { ...notif, isRead: true }  : notif ) ); }; // "...notif" = copie tot ce este in notif cu exceptia a ce urmeaza dupa virgula


// probabil nu va mai fii necesar fiindca probabil listele vor fii deja sortate
  const newNotifications = notifications.filter(notif => !notif.isRead)
  const archivedNotifications = notifications.filter(notif => notif.isRead)


  // 🔹 Reusable renderer
  const renderNotifications = (list, type) => {
    var filtered = list.filter(notif  => notif.type == type) //dc nu mere sa schimb numele la var???

    if (filtered.length !== 0 && check == false) 

    return (
      <>
        <h3 className="notifications_group-title">
          {type == 'user'    ? '👥 De la utilizatori / grupuri' :  '⚙️ Sistem'}
        </h3>

        <div className="notifications_list">
          {filtered.map(notif => (
            //pfp, o portiune de mesaj, username, 
            <div
              key={notif.id}
              className={`card notification 
                ${notif.isRead ? '' : 'notification-unread'} 
                ${notif.type == 'user' ? 'notification--user' : 'notification--system'} 
              `}
              //nu exista                      ^^^^                      ^^^
            >
              <div className="notification_content">
                <p className="notification_text">{notif.text}</p>
                <span className="notification_time">{notif.time}</span>
              </div>


              {( notif.hasActions && notif.isRead == false) && ( //   "CONDITIE" && "executa daca CONDITIE este adevarat, sau nu exec daca fals/null"
                <div className="notification_actions">
                  <button className="btn btn--primary" onClick={() => handleAccept(notif.id)}>Acceptă</button>
                  <button className="btn btn--secondary">Refuză</button>
                </div> )
                } 
            </div>
            )
          
          )}
        </div>
      </>
    )
  }

  return (
    <div className="container">
      <h1   font-size= "var(--font-size-3xl)" margin-bottom= "var(--space-xl)">Notificări</h1>

      <section className="notifications_section">
          {newNotifications && newNotifications.length === 0 ? ( <p className="notifications_empty"> Nu ai notificări noi.</p>) : (
      <>
    <h2 className="notifications_section-title"> Noi</h2>
      {renderNotifications(newNotifications, 'user')}
      {renderNotifications(newNotifications, 'system')}
      </>
    
  )}
      </section>


      <section className="notifications_section">
        <h2 className="notifications_section-title">Arhivate</h2>
        {renderNotifications(archivedNotifications, 'user')}
        {renderNotifications(archivedNotifications, 'system')}
      </section>
    </div>


  )
}

export default Notifications
