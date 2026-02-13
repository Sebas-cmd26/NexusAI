import React, { useState } from 'react';
import { Home, Search, Users, Bell, Bookmark, ChevronLeft, ChevronRight, Zap, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const tabs = [
    { id: 'feed', icon: Home, label: 'Feed' },
    { id: 'chats', icon: MessageSquare, label: 'AI Chats' },
    { id: 'groups', icon: Users, label: 'Groups' },
    { id: 'alerts', icon: Bell, label: 'Alerts' },
    { id: 'bookmarks', icon: Bookmark, label: 'Bookmarks' },
  ];

  return (
    <div 
      className={`hidden md:flex flex-col h-screen sticky top-0 border-r border-white/5 bg-nexus-dark transition-all duration-500 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="p-6 flex items-center justify-between">
        {!isCollapsed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-accent-primary rounded-lg flex items-center justify-center shadow-lg shadow-accent-primary/20">
              <Zap className="text-nexus-black w-5 h-5 fill-current" />
            </div>
            <span className="font-display font-black text-xl tracking-tighter uppercase italic nexus-gradient-text">Nexus</span>
          </motion.div>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 bg-accent-primary rounded-lg flex items-center justify-center mx-auto shadow-lg shadow-accent-primary/20">
            <Zap className="text-nexus-black w-5 h-5 fill-current" />
          </div>
        )}
      </div>

      <nav className="flex-1 mt-8 px-4 space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-accent-primary/10 text-accent-primary' 
                  : 'hover:bg-white/5 text-white/40 hover:text-white'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'animate-pulse' : ''}`} />
              {!isCollapsed && <span className="font-medium tracking-wide">{tab.label}</span>}
              {isActive && !isCollapsed && (
                <motion.div 
                  layoutId="sidebarLine"
                  className="ml-auto w-1 h-4 bg-accent-primary rounded-full"
                />
              )}
            </button>
          );
        })}
      </nav>

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="p-4 mt-auto mb-6 mx-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all flex items-center justify-center"
      >
        {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
      </button>
    </div>
  );
};

export default Sidebar;
