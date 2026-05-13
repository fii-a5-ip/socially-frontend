import { useState } from "react";
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

const initialActivities = [
  {
    id: "a1",
    title: "[TITLU: ACTIVITATE 1]",
    type: "[Tip Activitate]",
    location: "[Locația, orașul strada]",
    time: "[dată, ziua, ora]",
    score: 95,
    imageUrl: "PLACEHOLDER",
    votes: { da: 4, nu: 0, poate: 1 },
    myVote: null,
    isWinning: true,
    attributes: [
      {
        name: "[Nume Preferință 1]",
        percentage: 85,
        color: "var(--color-primary-dark)",
      },
      {
        name: "[Nume Preferință 2]",
        percentage: 95,
        color: "var(--color-primary)",
      },
      {
        name: "[Nume Preferință 3]",
        percentage: 35,
        color: "var(--color-accent)",
      },
    ],
  },
  {
    id: "a2",
    title: "Cină la Trattoria Il Forno",
    type: "Mâncare / Relaxare",
    location: "Piața Unirii, nr. 12",
    time: "Sâmbătă, 20:00",
    score: 88,
    imageUrl:
      "https://images.unsplash.com/photo-1634672192240-ed8e1e8c1cf7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpdGFsaWFuJTIwcmVzdGF1cmFudCUyMHBpenphJTIwcGFzdGF8ZW58MXx8fHwxNzc0OTYxMjA3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    votes: { da: 3, nu: 1, poate: 1 },
    myVote: null,
    attributes: [
      {
        name: "Gastronomie",
        percentage: 100,
        color: "var(--color-primary-light)",
      },
      { name: "Relaxare", percentage: 85, color: "var(--color-primary)" },
      { name: "Socializare", percentage: 90, color: "var(--color-accent)" },
    ],
  },
];

const mockMembers = [
  {
    id: 1,
    name: "Andrei",
    avatar:
      "https://images.unsplash.com/photo-1615327388641-203faee20165?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbiUyMGZhY2UlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzU0OTMxOTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    isReal: true,
  },
  {
    id: 2,
    name: "nume",
    avatar: null,
    isReal: false,
  },
  {
    id: 3,
    name: "nume",
    avatar: null,
    isReal: false,
  },
  {
    id: 4,
    name: "nume",
    avatar: null,
    isReal: false,
  },
];

function GroupDetail() {
  const { t } = useTranslation();
  const { groupId } = useParams();
  const [activities, setActivities] = useState(initialActivities);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const groupName = `Grup ${groupId || "1"}`;
  const totalMembers = mockMembers.length;

  const handleVote = (activityId, vote) => {
    setActivities((prev) =>
      prev
        .map((act) => {
          if (act.id === activityId) {
            let noileVoturi = { ...act.votes };
            if (act.myVote) {
              if (act.myVote === "Da") noileVoturi.da -= 1;
              if (act.myVote === "Nu") noileVoturi.nu -= 1;
              if (act.myVote === "Poate") noileVoturi.poate -= 1;
            }

            if (vote === "Da") noileVoturi.da += 1;
            if (vote === "Nu") noileVoturi.nu += 1;
            if (vote === "Poate") noileVoturi.poate += 1;

            return { ...act, myVote: vote, votes: noileVoturi };
          }
          return act;
        })
        .sort((a, b) => {
          const aScore = a.votes.da - a.votes.nu;
          const bScore = b.votes.da - b.votes.nu;
          return bScore - aScore;
        })
        .map((act, index) => ({
          ...act,
          isWinning: index === 0 && act.votes.da > 0,
        }))
    );
  };

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
              {mockMembers.map((member) => (
                <div key={member.id} className="gd-member-item">
                  <div className={`gd-member-avatar ${member.isReal ? 'real' : 'placeholder'}`}>
                    {member.isReal ? (
                      <img src={member.avatar} alt={member.name} />
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

          {/* Activities Header */}
          <div className="gd-activities-header">
            <h2>{t('groupdetail.proposed_activities')}</h2>
            <div className="gd-ai-badge">
              <Sparkles className="icon-sm" />
              AI Matched
            </div>
          </div>

          {/* Activities List */}
          <div className="gd-activities-list">
            {activities.map((activity, index) => {
              const totalVotes = activity.votes.da + activity.votes.nu + activity.votes.poate;
              const daPercent = totalVotes ? (activity.votes.da / totalVotes) * 100 : 0;
              const poatePercent = totalVotes ? (activity.votes.poate / totalVotes) * 100 : 0;
              const nuPercent = totalVotes ? (activity.votes.nu / totalVotes) * 100 : 0;

              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`gd-activity-card ${activity.isWinning ? 'winning' : ''}`}
                >
                  {/* Image Area */}
                  <div className="gd-activity-image-area">
                    {activity.imageUrl === "PLACEHOLDER" ? (
                      <div className="gd-image-placeholder">
                        <div className="gd-placeholder-badge">
                          <span>[POZA EVENIMENT]</span>
                        </div>
                      </div>
                    ) : (
                      <img src={activity.imageUrl} alt={activity.title} className="gd-activity-img" />
                    )}
                    {activity.isWinning && (
                      <div className="gd-winning-badge">
                        <Trophy className="icon-sm" />
                        {t('groupdetail.winning_activity')}
                      </div>
                    )}

                    <div className="gd-score-badge">
                      <Sparkles className="icon-xs" />
                      {t('groupdetail.ai_score')} {activity.score}%
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="gd-activity-content">
                    <div className="gd-activity-titles">
                      <h3>{activity.title}</h3>
                      <p>{activity.type}</p>
                    </div>

                    <div className="gd-activity-meta">
                      <div className="meta-item">
                        <MapPin className="icon" />
                        {activity.location}
                      </div>
                      <div className="meta-item">
                        <Clock className="icon" />
                        {activity.time}
                      </div>
                    </div>

                    {/* Profilul Evenimentului */}
                    <div className="gd-event-profile">
                      <div className="gd-event-profile-header">
                        <ActivityIcon className="icon-sm" />
                        <span>{t('groupdetail.profile_prefs')}</span>
                      </div>
                      <div className="gd-attributes-list">
                        {activity.attributes.map((attr, idx) => (
                          <div key={idx} className="gd-attribute-item">
                            <div className="gd-attribute-labels">
                              <span>{attr.name}</span>
                              <span>{attr.percentage}% {t('groupdetail.match')}</span>
                            </div>
                            <div className="gd-attribute-bar-bg">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${attr.percentage}%` }}
                                transition={{ duration: 1, delay: 0.2 + idx * 0.1 }}
                                className="gd-attribute-fill"
                                style={{ backgroundColor: attr.color }}
                              />
                            </div>
                          </div>
                        ))}
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
                          onClick={() => handleVote(activity.id, "Da")}
                          className={`gd-vote-btn da ${activity.myVote === "Da" ? "active" : activity.myVote !== null ? "inactive" : ""}`}
                        >
                          {activity.myVote === "Da" && (
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
                            <Check className={`icon ${activity.myVote === "Da" ? "glowing" : ""}`} strokeWidth={3} /> Da
                          </span>
                        </button>
                        
                        <button
                          onClick={() => handleVote(activity.id, "Poate")}
                          className={`gd-vote-btn poate ${activity.myVote === "Poate" ? "active" : activity.myVote !== null ? "inactive" : ""}`}
                        >
                          {activity.myVote === "Poate" && (
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
                            <HelpCircle className={`icon ${activity.myVote === "Poate" ? "glowing" : ""}`} strokeWidth={3} /> Poate
                          </span>
                        </button>
                        
                        <button
                          onClick={() => handleVote(activity.id, "Nu")}
                          className={`gd-vote-btn nu ${activity.myVote === "Nu" ? "active" : activity.myVote !== null ? "inactive" : ""}`}
                        >
                          {activity.myVote === "Nu" && (
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
                            <X className={`icon ${activity.myVote === "Nu" ? "glowing" : ""}`} strokeWidth={3} /> Nu
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
                {mockMembers.map((member) => (
                  <div key={member.id} className="gd-modal-member-row">
                    <div className={`gd-modal-avatar ${member.isReal ? 'real' : 'placeholder'}`}>
                      {member.isReal ? (
                        <img src={member.avatar} alt={member.name} />
                      ) : (
                        <span>(poza)</span>
                      )}
                    </div>
                    <div className="gd-modal-member-info">
                      <h4 className={member.isReal ? 'real' : 'placeholder'}>
                        {member.name}
                      </h4>
                      <span>{t('groupdetail.modal_member_label')} {member.id}</span>
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
