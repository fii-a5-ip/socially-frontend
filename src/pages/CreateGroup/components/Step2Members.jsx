import React, { useState, useEffect } from 'react';
/* eslint-disable-next-line no-unused-vars */
import { motion } from 'framer-motion';
import { Search, CheckCircle2, UserPlus, Loader2, XCircle } from 'lucide-react';
import { useTranslation } from '../../../hooks/useTranslation';
import { API_URL } from '../../../api/config';

export function Step2Members({ setValues }) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [friendsList, setFriendsList] = useState([]);
  const [selectedFriendsData, setSelectedFriendsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const fetchUsers = async () => {
      if (searchTerm.trim().length < 2) {
        setFriendsList([]);
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/users/search?query=${encodeURIComponent(searchTerm)}`);
        if (response.ok) {
          const data = await response.json();
          setFriendsList(data);
        }
      } catch (error) {
        console.error("Eroare la căutarea utilizatorilor:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Adauga un membru
  const addMember = (friend) => {
    // Verifică dacă e deja selectat
    const alreadySelected = selectedFriendsData.some(f => f.id === friend.id);
    if (alreadySelected) return;

    setSelectedFriendsData(prev => [...prev, friend]);
    setValues(prev => ({
      ...prev,
      members: [...(prev.members || []), friend.id]
    }));
  };

  // Scoate un membru (cu confirmare)
  const removeMember = (friendId) => {
    setSelectedFriendsData(prev => prev.filter(f => f.id !== friendId));
    setValues(prev => ({
      ...prev,
      members: (prev.members || []).filter(id => id !== friendId)
    }));
  };

  // IDs selectate pentru filtrare rapidă
  const selectedIds = new Set(selectedFriendsData.map(f => f.id));
  const selectedCount = selectedFriendsData.length;

  // Filtrează rezultatele: scoate cei deja selectați, max 4
  const filteredSearchResults = friendsList
    .filter(f => !selectedIds.has(f.id))
    .slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="cg-step-content"
    >
      <div className="cg-members-header">
        <h3 className="cg-section-title">{t('creategroup.invite_friends')}</h3>
        <span className="cg-selected-count">{selectedCount} {t('creategroup.selected')}</span>
      </div>

      <div className="cg-search-bar">
        <Search className="cg-search-icon" size={20} />
        <input
          type="text"
          placeholder={t('creategroup.search_placeholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="cg-search-input"
        />
      </div>

      <div className="cg-friends-list custom-scrollbar">
        {/* === SEARCH RESULTS (SUS) === */}
        {isLoading ? (
           <div className="cg-friends-empty">
             <Loader2 className="animate-spin" size={24} />
             <p>{t('creategroup.searching')}</p>
           </div>
        ) : filteredSearchResults.length > 0 ? (
          filteredSearchResults.map((friend) => (
            <div
              key={`search-${friend.id}`}
              onClick={() => addMember(friend)}
              className="cg-friend-item"
            >
              <div className="cg-friend-avatar">
                {friend.profileImgUrl ? (
                  <img src={friend.profileImgUrl} alt={friend.fullname || friend.username} />
                ) : (
                  <div style={{width:'100%', height:'100%', backgroundColor:'#ddd', borderRadius:'50%'}}></div>
                )}
              </div>
              <div className="cg-friend-info">
                <span className="cg-friend-name">{friend.fullname || friend.username}</span>
                <span className="cg-friend-username">@{friend.username}</span>
              </div>
              <div className="cg-friend-action">
                <UserPlus className="cg-action-icon default" size={24} />
              </div>
            </div>
          ))
        ) : (
          selectedCount === 0 && (
            <div className="cg-friends-empty">
              {searchTerm.length < 2 ? (
                <p>{t('creategroup.search_empty')}</p>
              ) : (
                <p>{t('creategroup.no_results')} "{searchTerm}"</p>
              )}
            </div>
          )
        )}

        {/* === SELECTED FRIENDS (JOS) === */}
        {selectedCount > 0 && (
          <>
            <div className="cg-selected-divider">
              <span>{selectedCount} {t('creategroup.selected')}</span>
            </div>
            {selectedFriendsData.map((friend) => (
              <div
                key={`selected-${friend.id}`}
                className="cg-friend-item selected"
              >
                <div className="cg-friend-avatar">
                  {friend.profileImgUrl ? (
                    <img src={friend.profileImgUrl} alt={friend.fullname || friend.username} />
                  ) : (
                    <div style={{width:'100%', height:'100%', backgroundColor:'#ddd', borderRadius:'50%'}}></div>
                  )}
                </div>
                <div className="cg-friend-info">
                  <span className="cg-friend-name">{friend.fullname || friend.username}</span>
                  <span className="cg-friend-username">@{friend.username}</span>
                </div>
                <div className="cg-friend-action">
                    <XCircle
                      className="cg-remove-icon"
                      size={22}
                      onClick={() => removeMember(friend.id)}
                    />
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </motion.div>
  );
}
