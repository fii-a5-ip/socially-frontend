import React, { useState, useEffect } from 'react';
/* eslint-disable-next-line no-unused-vars */
import { motion } from 'motion/react';
import { Search, CheckCircle2, UserPlus, Loader2 } from 'lucide-react';

export function Step2Members({ values, setValues }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [friendsList, setFriendsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      if (searchTerm.trim().length < 2) {
        setFriendsList([]);
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/api/users/search?query=${encodeURIComponent(searchTerm)}`);
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

  const toggleMember = (memberId) => {
    setValues((prev) => {
      const currentMembers = prev.members || [];
      if (currentMembers.includes(memberId)) {
        return { ...prev, members: currentMembers.filter(id => id !== memberId) };
      } else {
        return { ...prev, members: [...currentMembers, memberId] };
      }
    });
  };

  const selectedCount = values.members ? values.members.length : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="cg-step-content"
    >
      <div className="cg-members-header">
        <h3 className="cg-section-title">Invită-ți prietenii</h3>
        <span className="cg-selected-count">{selectedCount} selectați</span>
      </div>

      <div className="cg-search-bar">
        <Search className="cg-search-icon" size={20} />
        <input
          type="text"
          placeholder="Caută după nume,  @username, sau email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="cg-search-input"
        />
      </div>

      <div className="cg-friends-list custom-scrollbar">
        {isLoading ? (
           <div className="cg-friends-empty">
             <Loader2 className="animate-spin" size={24} />
             <p>Se caută...</p>
           </div>
        ) : friendsList.length > 0 ? (
          friendsList.map((friend) => {
            const isSelected = values.members?.includes(friend.id);
            return (
              <div
                key={friend.id}
                onClick={() => toggleMember(friend.id)}
                className={`cg-friend-item ${isSelected ? 'selected' : ''}`}
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
                  {isSelected ? (
                    <CheckCircle2 className="cg-action-icon success" size={24} />
                  ) : (
                    <UserPlus className="cg-action-icon default" size={24} />
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="cg-friends-empty">
            {searchTerm.length < 2 ? (
              <p>Caută prieteni pentru a-i adăuga în grup</p>
            ) : (
              <p>Nu s-au găsit rezultate după "{searchTerm}"</p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
