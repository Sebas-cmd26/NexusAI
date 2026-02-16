import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Share2, Sparkles, Bookmark } from 'lucide-react';
import AIChatPanel from './AIChatPanel';
import APIService from '../services/api';

const NewsDrawer = ({ news, onClose }) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [groups, setGroups] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);

  useEffect(() => {
    if (!news) return;
    const bookmarks = JSON.parse(localStorage.getItem('bookmarked_news') || '[]');
    setIsBookmarked(bookmarks.includes(news.id));
  }, [news]);

  const handleShare = async () => {
    setLoadingGroups(true);
    setIsShareModalOpen(true);
    try {
      const groupsData = await APIService.getGroups();
      setGroups(groupsData || []);
    } catch (error) {
      console.error('Error fetching groups:', error);
      setGroups([]);
    }
    setLoadingGroups(false);
  };

  const handleShareToGroup = async (groupId) => {
    try {
      await APIService.shareToGroup(groupId, news.id, 'User');
      setIsShareModalOpen(false);
      const successMsg = document.createElement('div');
      successMsg.className = 'fixed top-4 right-4 z-[9999] px-6 py-4 bg-accent-primary text-nexus-black font-black rounded-2xl shadow-lg';
      successMsg.textContent = '¡Compartido exitosamente!';
      document.body.appendChild(successMsg);
      setTimeout(() => successMsg.remove(), 3000);
    } catch (error) {
      console.error('Error sharing:', error);
      alert('Error al compartir.');
    }
  };

  const handleSummarize = async (e) => {
    e?.stopPropagation();
    // Opens chat which will trigger the summary automatically
    setShowAIChat(true);
  };

  const handleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarked_news') || '[]');
    if (isBookmarked) {
      const updated = bookmarks.filter(id => id !== news.id);
      localStorage.setItem('bookmarked_news', JSON.stringify(updated));
      setIsBookmarked(false);
    } else {
      bookmarks.push(news.id);
      localStorage.setItem('bookmarked_news', JSON.stringify(bookmarks));
      setIsBookmarked(true);
    }
  };

  if (!news) return null;

  return (
    <>
      <Dialog.Root open={!!news} onOpenChange={onClose}>
        <AnimatePresence>
          {news && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[1000]"
                />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed top-0 right-0 bottom-0 w-full max-w-2xl bg-nexus-dark border-l border-white/10 z-[1001] overflow-y-auto no-scrollbar"
                >
                  <div className="relative h-[40vh] w-full">
                    <div className="absolute inset-0 bg-gradient-to-t from-nexus-dark via-transparent to-transparent z-10" />
                    <img 
                      src={news.image_url || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200'} 
                      alt={news.title}
                      className="w-full h-full object-cover"
                    />
                    <button 
                      onClick={onClose}
                      className="absolute top-6 right-6 z-20 p-3 glass rounded-full text-white/60 hover:text-white transition-all shadow-xl"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="px-8 pb-12 -mt-12 relative z-20">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full border border-white/10 mb-6">
                      <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{news.sector}</span>
                    </div>

                    <Dialog.Title className="text-4xl md:text-5xl font-display font-black leading-[1.1] tracking-tighter mb-8">
                      {news.title}
                    </Dialog.Title>

                    <div className="bg-accent-primary/5 border border-accent-primary/10 rounded-[32px] p-8 mb-12">
                      <div className="flex items-center gap-3 mb-6">
                        <Sparkles className="w-5 h-5 text-accent-primary" />
                        <h4 className="text-xs font-black uppercase">Extracción de Inteligencia</h4>
                      </div>
                      <p className="text-lg text-white/80">{news.summary || 'Loading...'}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                      <a 
                        href={news.source_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-3 bg-accent-primary hover:bg-accent-primary/90 text-nexus-black font-black uppercase tracking-widest text-xs py-5 rounded-[24px] shadow-lg shadow-accent-primary/20 transition-all active:scale-95"
                      >
                        Leer Artículo Completo <ExternalLink className="w-4 h-4" />
                      </a>
                      <button 
                        onClick={handleShare}
                        className="flex items-center justify-center gap-3 glass hover:bg-white/10 text-white font-black uppercase tracking-widest text-xs py-5 px-8 rounded-[24px] transition-all active:scale-95"
                      >
                        <Share2 className="w-4 h-4" /> Compartir
                      </button>
                      <button 
                        onClick={handleSummarize}
                        className="flex items-center justify-center gap-3 glass hover:bg-white/10 text-white font-black uppercase tracking-widest text-xs py-5 px-8 rounded-[24px] transition-all active:scale-95 cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4" /> Chat IA
                      </button>
                      <button 
                        onClick={handleBookmark}
                        className={'flex items-center justify-center gap-3 glass hover:bg-white/10 font-black uppercase tracking-widest text-xs py-5 px-8 rounded-[24px] transition-all active:scale-95 ' + (isBookmarked ? 'text-accent-primary' : 'text-white')}
                      >
                        <Bookmark className={'w-4 h-4 ' + (isBookmarked ? 'fill-current' : '')} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>

      <Dialog.Root open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1002]" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-nexus-dark border border-white/10 rounded-3xl p-8 z-[1003]">
            <Dialog.Title className="text-2xl font-bold mb-6">Share to Group</Dialog.Title>
            
            {loadingGroups ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : groups.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {groups.map(group => (
                  <button
                    key={group.id}
                    onClick={() => handleShareToGroup(group.id)}
                    className="w-full p-4 glass hover:bg-white/10 rounded-xl text-left transition-all"
                  >
                    <h4 className="font-bold">{group.name}</h4>
                    <p className="text-sm text-white/60">{group.description || 'No description'}</p>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-white/60 text-center py-8">No groups available. Create one first!</p>
            )}

            <button
              onClick={() => setIsShareModalOpen(false)}
              className="mt-6 w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
            >
              Cancel
            </button>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {showAIChat && (
        <AIChatPanel article={news} onClose={() => setShowAIChat(false)} />
      )}
    </>
  );
};

export default NewsDrawer;

