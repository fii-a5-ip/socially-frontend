import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Clock,
  MapPin,
  Check,
  X,
  HelpCircle,
  Trophy,
  Sparkles,
  ChevronLeft,
  Activity as ActivityIcon,
  Users
} from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

import { useTranslation } from "../../hooks/useTranslation";
import "./GroupDetail.css";

function GroupDetail() {
  const { t } = useTranslation();
  const { groupId } = useParams();
  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState([]);
  const [groupDetails, setGroupDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGroupDetails();
  }, [groupId]);

  const groupName = groupDetails ? groupDetails.name : `Grup ${groupId || "1"}`;
  const totalMembers = members.length;

  const fetchGroupDetails = () => {
    fetch(`/api/groups/${groupId}/details`)
      .then(res => {
        if (!res.ok) throw new Error('Backend offline');
        return res.json();
      })
      .then(data => {
        setGroupDetails(data);
        setEvents(data.events || []);
        setMembers(data.members || []);
        setIsLoading(false);
      })
      .catch(err => {
        console.warn('Backend indisponibil, se folosesc date de test (Mock):', err);
        const mockData = {
          name: "Grup Test (Mod Offline)",
          members: [
            { id: 1, name: "Daria", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", isReal: true, role: "Admin" },
            { id: 2, name: "Ionut", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150", isReal: true }
          ],
          events: [
            {
              id: "e1",
              title: "Ieșire la Cafea",
              type: "Relaxare",
              location: "Centrul Vechi",
              time: "Vineri, 18:00",
              score: 95,
              imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800",
              votes: { da: 2, nu: 0, poate: 1 },
              myVote: null,
              isWinning: true,
              attributes: [{ name: "Socializare", percentage: 95 }]
            }
          ]
        };
        setGroupDetails(mockData);
        setEvents(mockData.events);
        setMembers(mockData.members);
        setIsLoading(false);
      });
  };

  const calculateAverageMatch = (attributes) => {
    if (!attributes || attributes.length === 0) return 0;
    const sum = attributes.reduce((acc, attr) => acc + attr.percentage, 0);
    return Math.round(sum / attributes.length);
  };

  const handleVote = async (eventId, vote) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`/api/events/${eventId}/vote?type=${vote}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchGroupDetails();
      } else {
        console.error('Eroare la înregistrarea votului');
      }
    } catch (error) {
      console.error('Eroare rețea la vot:', error);
    }
  };

  if (isLoading) {
    return <div className="gd-page"><div className="gd-container"><h2>Loading...</h2></div></div>;
  }

  return (
    <>
      <div className="gd-page">
        <div className="gd-container">
          {/* Header */}
          <div className="gd-header">
            <Link to="/groups" className="gd-back-btn">
              <ChevronLeft className="icon" />
            </Link>
            <h1 className="gd-title">{groupName}</h1>
          </div>

          {/* Participants Section */}
          <div className="gd-card gd-members-section">
            <div className="gd-members-header">
              <h2>{t('groupdetail.members_title')}</h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="gd-members-view-all"
              >
                <Users className="icon-sm" />
                {t('groupdetail.view_all')}
              </button>
            </div>

            <div className="gd-members-list custom-scrollbar">
              {members.map((member) => (
                <div key={member.id} className="gd-member-item">
                  <div className={`gd-member-avatar ${member.isReal ? 'real' : 'placeholder'}`}>
                    {member.isReal ? (
                      <img src={member.avatar || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} alt={member.name} />
                    ) : (
                      <span>(poza)</span>
                    )}
                  </div>
                  <span className={`gd-member-name ${member.isReal ? 'real-text' : 'placeholder-text'}`}>
                    {member.name}
                  </span>
                  {member.role && (
                    <span className="gd-member-role badge">{member.role}</span>
                  )}
                </div>
              ))}
              <button className="gd-member-item gd-invite-btn group">
                <div className="gd-member-avatar invite">
                  <span>+</span>
                </div>
                <span className="gd-member-name text-invite">{t('groupdetail.invite')}</span>
              </button>
            </div>
          </div>

          {/* Events Header */}
          <div className="gd-activities-header">
            <h2>{t('groupdetail.proposed_activities', 'Evenimente Propuse')}</h2>
            <div className="gd-ai-badge">
              <Sparkles className="icon-sm" />
              AI Matched
            </div>
          </div>

          {/* Events List */}
          <div className="gd-activities-list">
            {events.map((event, index) => {
              const totalVotes = event.votes.da + event.votes.nu + event.votes.poate;
              const daPercent = totalVotes ? (event.votes.da / totalVotes) * 100 : 0;
              const poatePercent = totalVotes ? (event.votes.poate / totalVotes) * 100 : 0;
              const nuPercent = totalVotes ? (event.votes.nu / totalVotes) * 100 : 0;
              const averageMatch = calculateAverageMatch(event.attributes) || event.score;

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`gd-activity-card ${event.isWinning ? 'winning' : ''}`}
                >
                  {/* Image Area */}
                  <div className="gd-activity-image-area">
                    {!event.imageUrl || event.imageUrl === "PLACEHOLDER" ? (
                      <div className="gd-image-placeholder">
                        <div className="gd-placeholder-badge">
                          <span>[POZA EVENIMENT]</span>
                        </div>
                      </div>
                    ) : (
                      <img src={event.imageUrl} alt={event.title} className="gd-activity-img" />
                    )}
                    {event.isWinning && (
                      <div className="gd-winning-badge">
                        <Trophy className="icon-sm" />
                        {t('groupdetail.winning_activity', 'Eveniment Câștigător')}
                      </div>
                    )}

                    <div className="gd-score-badge">
                      <Sparkles className="icon-xs" />
                      {t('groupdetail.ai_score')} {averageMatch}%
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="gd-activity-content">
                    <div className="gd-activity-titles">
                      <h3>{event.title}</h3>
                      <p>{event.type}</p>
                    </div>

                    <div className="gd-activity-meta">
                      <div className="meta-item">
                        <MapPin className="icon" />
                        {event.location}
                      </div>
                      <div className="meta-item">
                        <Clock className="icon" />
                        {event.time}
                      </div>
                    </div>

                    {/* Profilul Evenimentului */}
                    <div className="gd-event-profile">
                      <div className="gd-event-profile-header">
                        <ActivityIcon className="icon-sm" />
                        <span>{t('groupdetail.profile_prefs', 'Compatibilitate')}</span>
                      </div>
                      <div className="gd-attributes-list">
                        <div className="gd-attribute-item">
                          <div className="gd-attribute-labels">
                            <span>Compatibilitate Medie</span>
                            <span>{averageMatch}% {t('groupdetail.match')}</span>
                          </div>
                          <div className="gd-attribute-bar-bg">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${averageMatch}%` }}
                              transition={{ duration: 1, delay: 0.2 }}
                              className="gd-attribute-fill"
                              style={{ backgroundColor: "var(--color-primary)" }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Voting System */}
                    <div className="gd-voting-system">
                      {/* Dynamic Progress Bar */}
                      <div className="gd-vote-progress-area">
                        <div className="gd-vote-progress-header">
                          <span className="label">{t('groupdetail.vote_results')}</span>
                          <span className="count">{totalVotes} {t('groupdetail.votes')}</span>
                        </div>

                        <div className="gd-vote-bar-container">
                          <div className="gd-vote-bar">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${daPercent}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className="gd-vote-fill success"
                            >
                              <div className="gd-shimmer"></div>
                            </motion.div>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${poatePercent}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className="gd-vote-fill warning"
                            >
                              <div className="gd-shimmer"></div>
                            </motion.div>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${nuPercent}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className="gd-vote-fill error"
                            >
                              <div className="gd-shimmer"></div>
                            </motion.div>
                          </div>
                        </div>
                      </div>

                      {/* Modern Voting Buttons */}
                      <div className="gd-vote-buttons">
                        <button
                          onClick={() => handleVote(event.id, "Da")}
                          className={`gd-vote-btn da ${event.myVote === "Da" ? "active" : event.myVote !== null ? "inactive" : ""}`}
                        >
                          {event.myVote === "Da" && (
                            <>
                              <div className="gd-fluid-fill success">
                                <div className="gd-wave-smooth"></div>
                              </div>
                              <div className="gd-inner-pulse success"></div>
                              <div className="gd-particles">
                                <Check className="particle p1 success" />
                                <Sparkles className="particle p2 success" />
                                <Check className="particle p3 success" />
                              </div>
                            </>
                          )}
                          <span className="gd-btn-content">
                            <Check className={`icon ${event.myVote === "Da" ? "glowing" : ""}`} strokeWidth={3} /> Da
                          </span>
                        </button>

                        <button
                          onClick={() => handleVote(event.id, "Poate")}
                          className={`gd-vote-btn poate ${event.myVote === "Poate" ? "active" : event.myVote !== null ? "inactive" : ""}`}
                        >
                          {event.myVote === "Poate" && (
                            <>
                              <div className="gd-fluid-fill warning">
                                <div className="gd-wave-slow"></div>
                              </div>
                              <div className="gd-inner-pulse warning"></div>
                              <div className="gd-particles">
                                <span className="particle text p1 warning">.</span>
                                <span className="particle text p2 warning">.</span>
                                <span className="particle text p3 warning">.</span>
                              </div>
                            </>
                          )}
                          <span className="gd-btn-content">
                            <HelpCircle className={`icon ${event.myVote === "Poate" ? "glowing" : ""}`} strokeWidth={3} /> Poate
                          </span>
                        </button>

                        <button
                          onClick={() => handleVote(event.id, "Nu")}
                          className={`gd-vote-btn nu ${event.myVote === "Nu" ? "active" : event.myVote !== null ? "inactive" : ""}`}
                        >
                          {event.myVote === "Nu" && (
                            <>
                              <div className="gd-fluid-fill error">
                                <div className="gd-wave-jagged"></div>
                              </div>
                              <div className="gd-inner-pulse error"></div>
                              <div className="gd-particles">
                                <X className="particle p1 error" />
                                <X className="particle p2 error" />
                              </div>
                            </>
                          )}
                          <span className="gd-btn-content">
                            <X className={`icon ${event.myVote === "Nu" ? "glowing" : ""}`} strokeWidth={3} /> Nu
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Glassmorphism Members Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="gd-modal-overlay"
          >
            <div
              className="gd-modal-backdrop"
              onClick={() => setIsModalOpen(false)}
            />

            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="gd-modal-content"
            >
              <div className="gd-modal-header">
                <div>
                  <h2>{t('groupdetail.modal_title')}</h2>
                  <p>{totalMembers} {t('groupdetail.modal_members')}</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="gd-close-btn">
                  <X className="icon" />
                </button>
              </div>

              <div className="gd-modal-body custom-scrollbar">
                {members.map((member) => (
                  <div key={member.id} className="gd-modal-member-row">
                    <div className={`gd-modal-avatar ${member.isReal ? 'real' : 'placeholder'}`}>
                      {member.isReal ? (
                        <img src={member.avatar || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} alt={member.name} />
                      ) : (
                        <span>(poza)</span>
                      )}
                    </div>
                    <div className="gd-modal-member-info">
                      <h4 className={member.isReal ? 'real' : 'placeholder'}>
                        {member.name}
                      </h4>
                      <span>
                        {t('groupdetail.modal_member_label')} {member.id}
                        {member.role && (
                          <span className="gd-member-role badge" style={{ marginLeft: '8px' }}>
                            {member.role}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                ))}

                <button className="gd-modal-invite-btn">
                  <div className="gd-modal-invite-icon">
                    <span>+</span>
                  </div>
                  <span className="gd-modal-invite-text">{t('groupdetail.invite_new')}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default GroupDetail;
