import React, { useState, useEffect } from 'react';
import { Users, Lock, Globe, MessageCircle, FolderOpen, X, Plus, Sparkles, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import GroupChat from './GroupChat';
import APIService from '../services/api';

const GroupsView = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [vaultContent, setVaultContent] = useState([]);
  const [loadingVault, setLoadingVault] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newGroupData, setNewGroupData] = useState({ name: '', description: '', type: 'private' });
  const [creating, setCreating] = useState(false);
  const [chatGroup, setChatGroup] = useState(null);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    setLoading(true);
    try {
      const data = await APIService.getGroups();
      setGroups(data || []);
    } catch (error) {
      console.error('Error loading groups:', error);
      setGroups([]);
    }
    setLoading(false);
  };

  const handleCreateGroup = async () => {
    if (!newGroupData.name.trim()) {
      alert('Please enter a group name');
      return;
    }

    setCreating(true);
    try {
      await APIService.createGroup(newGroupData);
      setIsCreateModalOpen(false);
      setNewGroupData({ name: '', description: '', type: 'private' });
      await loadGroups();
      // Show success notification
      const successMsg = document.createElement('div');
      successMsg.className = 'fixed top-4 right-4 z-[9999] px-6 py-4 bg-accent-primary text-nexus-black font-black rounded-2xl shadow-lg animate-in slide-in-from-top-4';
      successMsg.textContent = ' Group created successfully!';
      document.body.appendChild(successMsg);
      setTimeout(() => successMsg.remove(), 3000);
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Failed to create group. Please try again.');
    }
    setCreating(false);
  };

  const handleOpenVault = async (group) => {
    setSelectedGroup(group);
    setLoadingVault(true);
    
    try {
      const results = await APIService.search(group.name);
      setVaultContent(results);
    } catch (error) {
      console.error('Error accessing vault:', error);
      setVaultContent([]);
    }
    
    setLoadingVault(false);
  };

  const closeVault = () => {
    setSelectedGroup(null);
    setVaultContent([]);
  };

  const getGroupGradient = (index) => {
    const gradients = [
      'from-cyan-500 to-blue-600',
      'from-purple-500 to-pink-600',
      'from-green-500 to-emerald-600',
      'from-orange-500 to-red-600',
      'from-yellow-500 to-amber-600',
      'from-indigo-500 to-violet-600',
    ];
    return gradients[index % gradients.length];
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-48 bg-glass-light rounded-3xl"></div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        {/* Header with gradient */}
        <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-accent-primary/10 via-accent-secondary/10 to-accent-tertiary/10 border border-white/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/10 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-secondary/10 blur-[100px] rounded-full" />
          
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-4xl font-black tracking-tight mb-2 nexus-gradient-text">Your Groups</h2>
              <p className="text-white/60">Collaborate and share intelligence with your network</p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-6 py-4 bg-accent-primary hover:bg-accent-primary/90 text-nexus-black font-black uppercase tracking-widest text-xs rounded-2xl transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-accent-primary/20"
            >
              <Plus className="w-5 h-5" />
              Create Group
            </button>
          </div>
        </div>

        {/* Groups grid */}
        {groups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group, idx) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative glass rounded-3xl overflow-hidden border border-white/10 hover:border-white/20 transition-all"
              >
                {/* Gradient header */}
                <div className={`h-32 bg-gradient-to-br ${getGroupGradient(idx)} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute top-4 right-4 px-3 py-1.5 glass rounded-full flex items-center gap-2">
                    {group.type === 'private' ? (
                      <Lock className="w-3 h-3" />
                    ) : (
                      <Globe className="w-3 h-3" />
                    )}
                    <span className="text-[10px] font-black uppercase tracking-widest">{group.type}</span>
                  </div>
                  
                  {/* Animated sparkles */}
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ duration: 20, repeat: Infinity }}
                    className="absolute bottom-4 left-4 opacity-20"
                  >
                    <Sparkles className="w-16 h-16" />
                  </motion.div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-black tracking-tight mb-2 group-hover:text-accent-primary transition-colors">
                    {group.name}
                  </h3>
                  <p className="text-white/60 text-sm mb-4 line-clamp-2">
                    {group.description || 'No description provided'}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 text-xs text-white/40">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{group.members || 0} members</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      <span>Active</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setChatGroup(group)}
                      className="flex-1 flex items-center justify-center gap-2 bg-accent-primary hover:bg-accent-primary/90 text-nexus-black font-black uppercase tracking-widest text-xs py-3 rounded-2xl transition-all active:scale-95"
                    >
                      <MessageCircle className="w-4 h-4" /> Chat
                    </button>
                    <button
                      onClick={() => handleOpenVault(group)}
                      className="flex-1 flex items-center justify-center gap-2 glass hover:bg-white/10 text-white font-black uppercase tracking-widest text-xs py-3 rounded-2xl transition-all active:scale-95"
                    >
                      <FolderOpen className="w-4 h-4" /> Vault
                    </button>
                  </div>
                </div>

                {/* Hover glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${getGroupGradient(idx)} opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none`} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 glass rounded-3xl border border-white/10"
          >
            <div className="p-6 bg-accent-primary/10 rounded-full mb-6">
              <Users className="w-16 h-16 text-accent-primary" />
            </div>
            <h3 className="text-2xl font-black mb-2">No Groups Yet</h3>
            <p className="text-white/60 mb-6">Create your first group to start collaborating</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-8 py-4 bg-accent-primary hover:bg-accent-primary/90 text-nexus-black font-black uppercase tracking-widest text-xs rounded-2xl transition-all active:scale-95 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Your First Group
            </button>
          </motion.div>
        )}
      </div>

      {/* Create Group Modal */}
      <Dialog.Root open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <AnimatePresence>
          {isCreateModalOpen && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md glass rounded-3xl p-8 z-[101] border border-white/10"
                >
                  <div className="flex items-center justify-between mb-6">
                    <Dialog.Title className="text-2xl font-black">Create New Group</Dialog.Title>
                    <Dialog.Close asChild>
                      <button className="p-2 glass hover:bg-white/10 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                      </button>
                    </Dialog.Close>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-black uppercase tracking-widest text-white/60 mb-2">
                        Group Name *
                      </label>
                      <input
                        type="text"
                        value={newGroupData.name}
                        onChange={(e) => setNewGroupData({ ...newGroupData, name: e.target.value })}
                        placeholder="Enter group name..."
                        className="w-full px-4 py-3 glass rounded-2xl border border-white/10 bg-nexus-dark/50 text-white placeholder-white/30 focus:outline-none focus:border-accent-primary/50 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-black uppercase tracking-widest text-white/60 mb-2">
                        Description
                      </label>
                      <textarea
                        value={newGroupData.description}
                        onChange={(e) => setNewGroupData({ ...newGroupData, description: e.target.value })}
                        placeholder="What's this group about?"
                        rows={3}
                        className="w-full px-4 py-3 glass rounded-2xl border border-white/10 bg-nexus-dark/50 text-white placeholder-white/30 focus:outline-none focus:border-accent-primary/50 transition-colors resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-black uppercase tracking-widest text-white/60 mb-2">
                        Privacy
                      </label>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setNewGroupData({ ...newGroupData, type: 'private' })}
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${
                            newGroupData.type === 'private'
                              ? 'bg-accent-primary text-nexus-black'
                              : 'glass hover:bg-white/10 text-white/60'
                          }`}
                        >
                          <Lock className="w-4 h-4" /> Private
                        </button>
                        <button
                          onClick={() => setNewGroupData({ ...newGroupData, type: 'public' })}
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${
                            newGroupData.type === 'public'
                              ? 'bg-accent-primary text-nexus-black'
                              : 'glass hover:bg-white/10 text-white/60'
                          }`}
                        >
                          <Globe className="w-4 h-4" /> Public
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleCreateGroup}
                      disabled={creating || !newGroupData.name.trim()}
                      className="w-full px-6 py-4 bg-accent-primary hover:bg-accent-primary/90 disabled:bg-white/10 disabled:text-white/30 text-nexus-black font-black uppercase tracking-widest text-xs rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      {creating ? (
                        <>
                          <div className="w-5 h-5 border-2 border-nexus-black border-t-transparent rounded-full animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Plus className="w-5 h-5" />
                          Create Group
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>

      {/* Vault Modal */}
      <Dialog.Root open={!!selectedGroup} onOpenChange={closeVault}>
        <AnimatePresence>
          {selectedGroup && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[80vh] glass rounded-3xl overflow-hidden z-[101] border border-white/10"
                >
                  <div className="flex items-center justify-between p-6 border-b border-white/10 bg-nexus-dark/50">
                    <div>
                      <Dialog.Title className="text-2xl font-black">{selectedGroup.name} Vault</Dialog.Title>
                      <p className="text-sm text-white/60 mt-1">Shared intelligence archive</p>
                    </div>
                    <Dialog.Close asChild>
                      <button className="p-3 glass hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                      </button>
                    </Dialog.Close>
                  </div>

                  <div className="p-6 overflow-y-auto max-h-[60vh]">
                    {loadingVault ? (
                      <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : vaultContent.length > 0 ? (
                      <div className="space-y-4">
                        {vaultContent.map((item, idx) => (
                          <div key={idx} className="glass rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all">
                            <h4 className="font-black mb-2">{item.title}</h4>
                            <p className="text-sm text-white/60 line-clamp-2">{item.summary}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-20 text-white/40">
                        <FolderOpen className="w-16 h-16 mb-4" />
                        <p className="text-lg font-medium">Vault is empty</p>
                        <p className="text-sm">Share articles to this group to fill the vault</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>

      {/* Group Chat Modal */}
      <AnimatePresence>
        {chatGroup && (
          <GroupChat group={chatGroup} onClose={() => setChatGroup(null)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default GroupsView;
