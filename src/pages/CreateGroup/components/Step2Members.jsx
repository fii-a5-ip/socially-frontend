import React, { useState } from 'react';
/* eslint-disable-next-line no-unused-vars */
import { motion } from 'motion/react';
import { Search, CheckCircle2, UserPlus } from 'lucide-react';

const mockFriends = [
  { id: '1', name: 'Andrei Diaconu', username: '@andrei.d', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150' },
  { id: '2', name: 'Maria Popescu', username: '@maria_pop', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150' },
  { id: '3', name: 'Alexandru Ivan', username: '@alex_ivan', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150' },
  { id: '4', name: 'Elena Vlad', username: '@elena_v', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150' },
  { id: '5', name: 'Mihai Stan', username: '@stan_mihai', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' },
];

export function Step2Members({ values, setValues }) {
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredFriends = mockFriends.filter(
    (friend) =>
      friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      friend.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          placeholder="Caută după nume sau @username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="cg-search-input"
        />
      </div>

      <div className="cg-friends-list custom-scrollbar">
        {filteredFriends.length > 0 ? (
          filteredFriends.map((friend) => {
            const isSelected = values.members?.includes(friend.id);
            return (
              <div 
                key={friend.id} 
                onClick={() => toggleMember(friend.id)}
                className={`cg-friend-item ${isSelected ? 'selected' : ''}`}
              >
                <div className="cg-friend-avatar">
                  <img src={friend.avatar} alt={friend.name} />
                </div>
                <div className="cg-friend-info">
                  <span className="cg-friend-name">{friend.name}</span>
                  <span className="cg-friend-username">{friend.username}</span>
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
            <p>Nu s-au găsit rezultate după "{searchTerm}"</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
