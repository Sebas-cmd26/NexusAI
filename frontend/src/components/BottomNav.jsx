import React from 'react';
import { Home, Search, Users, Bell, Bookmark, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const BottomNav = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'feed', icon: Home, label: 'Inicio' },
    { id: 'chats', icon: MessageSquare, label: 'Chats' },
    { id: 'groups', icon: Users, label: 'Grupos' },
    { id: 'alerts', icon: Bell, label: 'Alertas' },
    { id: 'bookmarks', icon: Bookmark, label: 'Guardados' },
  ];

  return (
    <div className="glass rounded-full px-6 py-3 flex justify-between items-center shadow-2xl">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="relative p-2 transition-all duration-300"
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-accent-primary/20 rounded-xl"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <Icon
              className={`w-6 h-6 transition-colors duration-300 relative z-10 ${
                isActive ? 'text-accent-primary' : 'text-white/40'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;
