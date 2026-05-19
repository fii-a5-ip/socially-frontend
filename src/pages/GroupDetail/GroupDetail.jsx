import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
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
  Users,
  Search,
  LogOut,
  Plus
} from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

import { useTranslation } from "../../hooks/useTranslation";
import { API_URL } from "../../api/config";
import "./GroupDetail.css";

function EventDetailsModal({ event, onClose, isJoined, onToggleJoin }) {
  const { t } = useTranslation();
  if (!event) return null;

  const hasImage = event.imageUrl && event.imageUrl !== "PLACEHOLDER";

  return (
    <div className="gd-place-details fade-in-fast">
      <div
        className="gd-pd-header"
        style={hasImage ? { backgroundImage: `url(${event.imageUrl})` } : {}}
      >
        <button className="gd-pd-back-btn" onClick={onClose}>✕</button>
        <div className="gd-pd-header-overlay"></div>
        {!hasImage && (
          <div className="gd-pd-no-image-placeholder">
            <Trophy size={40} style={{ color: 'var(--color-primary)' }} />
          </div>
        )}
      </div>

      <div className="gd-pd-content">
        <h1 className="gd-pd-title">{event.title}</h1>

        <div className="gd-pd-top-meta">
          <span className="gd-pd-meta-badge category">{event.type}</span>
          <span className="gd-pd-meta-badge rating">
            <Trophy size={12} style={{ marginRight: '4px' }} />
            {event.score || 85}% Match
          </span>
        </div>

        <div className="gd-pd-info-clean">
          <div className="gd-pd-info-row">
            <div className="icon"><Clock size={16} /></div>
            <div>
              <strong>{t('solo.schedule', 'Program')}</strong>
              <p>{event.time}</p>
            </div>
          </div>

          <div
            className="gd-pd-info-row gd-clickable-address"
            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`, '_blank')}
          >
            <div className="icon"><MapPin size={16} /></div>
            <div>
              <strong>{t('solo.address', 'Adresa')}</strong>
              <p className="gd-address-link">{event.location}</p>
            </div>
          </div>
        </div>

        <div className="gd-pd-description">
          {event.description}
        </div>
      </div>

      <div className="gd-pd-footer-action">
        <button
          className="gd-pd-reserve-btn"
          onClick={onToggleJoin}
          style={{
            backgroundColor: isJoined ? '#ef4444' : 'var(--color-primary)',
            color: 'white'
          }}
        >
          {isJoined ? "Leave Event ✕" : "Join Event ✓"}
        </button>
      </div>
    </div>
  );
}


function GroupDetail() {
  const { t } = useTranslation();
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState([]);
  const [groupDetails, setGroupDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Event detail modal state
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleToggleJoin = async (id) => {
    const event = events.find(e => e.id === id);
    if (!event) return;

    const isJoining = !event.isJoined;
    const url = `${API_URL}/api/events/${id}/join`;
    const method = isJoining ? 'POST' : 'DELETE';
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        // Update local state for immediate feedback
        const updatedEvents = events.map(e =>
          e.id === id ? { ...e, isJoined: isJoining } : e
        );
        setEvents(updatedEvents);
        if (selectedEvent && selectedEvent.id === id) {
          setSelectedEvent({ ...selectedEvent, isJoined: isJoining });
        }
        // Refresh full data from backend
        fetchGroupDetails(debouncedSearch);
      }
    } catch (error) {
      console.error('Error toggling join status:', error);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchGroupDetails(debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId, debouncedSearch]);

  const groupName = groupDetails ? groupDetails.name : `Grup ${groupId || "1"}`;
  const totalMembers = members.length;

  const fetchGroupDetails = (query = "") => {
    const url = query
      ? `${API_URL}/api/groups/${groupId}/details?query=${encodeURIComponent(query)}`
      : `${API_URL}/api/groups/${groupId}/details`;
    const token = localStorage.getItem('token');

    fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
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
        console.warn('Backend indisponibil sau eroare la fetch:', err);
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
      const response = await fetch(`${API_URL}/api/events/${eventId}/vote?type=${vote}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        fetchGroupDetails(debouncedSearch);
      } else {
        console.error('Eroare la înregistrarea votului');
      }
    } catch (error) {
      console.error('Eroare rețea la vot:', error);
    }
  };

  const handleLeaveGroup = async () => {
    if (!window.confirm(t('groupdetail.leave_confirm', 'Sigur vrei să părăsești grupul?'))) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/groups/${groupId}/leave`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        navigate('/groups');
      } else {
        console.error('Eroare la părăsirea grupului');
      }
    } catch (error) {
      console.error('Eroare rețea la părăsirea grupului:', error);
    }
  };

  // Events come already filtered from backend
  const filteredEvents = events;

  // Loading state
  if (isLoading) {
    return <div className="gd-page"><div className="gd-container"><h2>Loading...</h2></div></div>;
  }

  // Event detail screen
  if (selectedEvent) {
    return (
      <EventDetailsModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        isJoined={selectedEvent.isJoined}
        onToggleJoin={() => handleToggleJoin(selectedEvent.id)}
      />
    );
  }

  // Main page
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
                      <img
                        src={member.avatar || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}
                        alt={member.name}
                      />
                    ) : (
                      <span>(poza)</span>
                    )}
                  </div>
                  <span className={`gd-member-name ${member.isReal ? 'real-text' : 'placeholder-text'}`}>
                    {member.name}
                  </span>
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
          <div className="gd-activities-header" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'stretch' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <h2>{t('groupdetail.proposed_activities', 'Evenimente Propuse')}</h2>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button
                  onClick={() => navigate(`/discover/create?groupId=${groupId}`)}
                  className="gd-ai-badge"
                  style={{ cursor: 'pointer', border: 'none', background: 'var(--color-primary)', color: 'white', borderRadius: '20px', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 600 }}
                >
                  <Plus className="icon-sm" />
                  {t('groupdetail.propose_event', 'Propune')}
                </button>
                <div className="gd-ai-badge">
                  <Sparkles className="icon-sm" />
                  AI Matched
                </div>
              </div>
            </div>

            <div className="gd-search-bar" style={{ position: 'relative', width: '100%' }}>
              <Search className="icon-sm gd-search-icon" />
              <input
                type="text"
                placeholder={t('groupdetail.search_event', 'Caută un eveniment')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="gd-search-input"
              />
            </div>
          </div>

          {/* Events List */}
          <div className="gd-activities-list">
            {filteredEvents.map((event, index) => {
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
                  onClick={() => setSelectedEvent(event)}
                  style={{ cursor: 'pointer' }}
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
                          onClick={(e) => { e.stopPropagation(); handleVote(event.id, "Da"); }}
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
                          onClick={(e) => { e.stopPropagation(); handleVote(event.id, "Poate"); }}
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
                          onClick={(e) => { e.stopPropagation(); handleVote(event.id, "Nu"); }}
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

          {/* Leave Group Button */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem', marginBottom: '2rem' }}>
            <button
              className="gd-leave-btn"
              onClick={handleLeaveGroup}
              style={{
                padding: '14px 32px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 59, 48, 0.3)',
                background: 'rgba(255, 59, 48, 0.1)',
                color: '#ff3b30',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255, 59, 48, 0.2)'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255, 59, 48, 0.1)'; }}
            >
              <LogOut size={20} />
              <span>{t('groupdetail.leave_group', 'Părăsește Grupul')}</span>
            </button>
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
                        <img
                          src={member.avatar || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}
                          alt={member.name}
                        />
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
