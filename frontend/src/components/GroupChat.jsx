import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, ExternalLink, Sparkles, User } from 'lucide-react';
import APIService from '../services/api';

const GroupChat = ({ group, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (group) {
      loadMessages();
    }
  }, [group]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const msgs = await APIService.getGroupMessages(group.id);
      setMessages(msgs.reverse()); // Reverse to show oldest first
    } catch (error) {
      console.error('Error loading messages:', error);
    }
    setLoading(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const message = await APIService.sendMessage(group.id, 'User', newMessage);
      setMessages([...messages, message]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
    setSending(false);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  if (!group) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="w-full max-w-4xl h-[80vh] glass rounded-[32px] overflow-hidden flex flex-col border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-nexus-dark/50 backdrop-blur-xl">
          <div>
            <h2 className="text-2xl font-black tracking-tight">{group.name}</h2>
            <p className="text-sm text-white/60 mt-1">{group.description || 'Group chat'}</p>
          </div>
          <button
            onClick={onClose}
            className="p-3 glass rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-white/40">
              <Sparkles className="w-12 h-12 mb-4" />
              <p className="text-lg font-medium">No messages yet</p>
              <p className="text-sm">Start the conversation!</p>
            </div>
          ) : (
            <AnimatePresence>
              {messages.map((msg, idx) => (
                <motion.div
                  key={msg.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`flex gap-3 ${msg.user_id === 'User' ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    msg.user_id === 'User' ? 'bg-accent-primary/20' : 'bg-white/10'
                  }`}>
                    <User className="w-5 h-5" />
                  </div>

                  {/* Message bubble */}
                  <div className={`flex-1 max-w-[70%] ${msg.user_id === 'User' ? 'items-end' : ''}`}>
                    <div className={`px-4 py-3 rounded-2xl ${
                      msg.user_id === 'User' 
                        ? 'bg-accent-primary/10 border border-accent-primary/20' 
                        : 'glass border border-white/10'
                    }`}>
                      <p className="text-sm font-medium mb-1 text-white/60">{msg.user_id}</p>
                      <p className="text-white/90 leading-relaxed">{msg.content}</p>
                      
                      {/* News link if shared */}
                      {msg.news_id && (
                        <div className="mt-3 p-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-2">
                          <ExternalLink className="w-4 h-4 text-accent-primary" />
                          <span className="text-xs text-white/60">Shared news article</span>
                        </div>
                      )}
                      
                      <p className="text-[10px] text-white/40 mt-2">{formatTime(msg.created_at)}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </AnimatePresence>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="p-6 border-t border-white/10 bg-nexus-dark/50 backdrop-blur-xl">
          <div className="flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-6 py-4 glass rounded-2xl border border-white/10 bg-nexus-dark/50 text-white placeholder-white/30 focus:outline-none focus:border-accent-primary/50 transition-colors"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="px-8 py-4 bg-accent-primary hover:bg-accent-primary/90 disabled:bg-white/10 disabled:text-white/30 text-nexus-black font-black rounded-2xl transition-all active:scale-95 flex items-center gap-2"
            >
              {sending ? (
                <div className="w-5 h-5 border-2 border-nexus-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span className="hidden sm:inline">Send</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default GroupChat;
