import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Minimize2, Maximize2, Trash2, ChevronDown } from 'lucide-react';
import APIService from '../services/api';

const AIChatPanel = ({ article, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (article) {
      const chatHistory = JSON.parse(localStorage.getItem('ai_chat_history') || '{}');
      const articleChats = chatHistory[article.id] || [];
      
      if (articleChats.length === 0) {
        const greeting = {
          role: 'assistant',
          content: `¡Hola! Soy tu asistente de IA. I've analyzed this article about "${article.title}". ¿Qué te gustaría saber?`,
          timestamp: new Date().toISOString()
        };
        setMessages([greeting]);
        generateInitialSummary();
      } else {
        setMessages(articleChats);
      }
    }
  }, [article]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateInitialSummary = async () => {
    setLoading(true);
    try {
      const summary = await APIService.summarize(article.title + ' ' + (article.summary || ''));
      const aiMessage = {
        role: 'assistant',
        content: `Aquí está un resumen rápido:\n\n${summary}\n\n¡Pregúntame lo que quieras sobre este artículo!`,
        timestamp: new Date().toISOString()
      };
      const updatedMessages = [...messages, aiMessage];
      setMessages(updatedMessages);
      saveToHistory(updatedMessages);
    } catch (error) {
      console.error('Error generating summary:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Lo siento, tuve problemas generando el resumen. ¡Intenta preguntarme algo!',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
    setLoading(false);
  };

  const saveToHistory = (msgs) => {
    const chatHistory = JSON.parse(localStorage.getItem('ai_chat_history') || '{}');
    chatHistory[article.id] = msgs;
    localStorage.setItem('ai_chat_history', JSON.stringify(chatHistory));
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const context = article ? 
        `We are discussing an article titled: "${article.title}".\n\nSummary: ${article.summary || 'No summary available'}.\n\nPlease answer based on this context.` 
        : "";
      
      const history = newMessages
        .filter(msg => msg.role !== 'user' || msg.content !== input)
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));

      const response = await APIService.chat(history, input, context);
      
      const aiMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      };
      
      const updatedMessages = [...newMessages, aiMessage];
      setMessages(updatedMessages);
      saveToHistory(updatedMessages);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Lo siento, encontré un error. ¡Por favor intenta de nuevo!',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
    setLoading(false);
  };

  const clearHistory = () => {
    if (confirm('¿Limpiar esta conversación?')) {
      setMessages([]);
      const chatHistory = JSON.parse(localStorage.getItem('ai_chat_history') || '{}');
      delete chatHistory[article.id];
      localStorage.setItem('ai_chat_history', JSON.stringify(chatHistory));
    }
  };

  if (!article) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
      />

      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: isMinimized ? 'calc(100% - 80px)' : 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 max-h-[75vh] glass border-t-2 border-white/20 z-[9999] flex flex-col bg-nexus-dark/98 backdrop-blur-2xl rounded-t-[32px] shadow-2xl"
        style={{ boxShadow: '0 -10px 40px rgba(0,0,0,0.5)' }}
      >
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-white/30 rounded-full" />
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-accent-primary/20 rounded-2xl">
              <Sparkles className="w-5 h-5 text-accent-primary fill-current animate-pulse" />
            </div>
            <div>
              <h3 className="font-black text-sm uppercase tracking-widest">Asistente IA</h3>
              <p className="text-[10px] text-white/60">Impulsado por Gemini 1.5 Flash</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2.5 glass hover:bg-white/10 rounded-xl transition-colors"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <button
              onClick={clearHistory}
              className="p-2.5 glass hover:bg-white/10 rounded-xl transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 glass hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ maxHeight: 'calc(75vh - 180px)' }}>
              <AnimatePresence>
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${
                      msg.role === 'user' ? 'bg-accent-primary/20' : 'bg-accent-secondary/20'
                    }`}>
                      {msg.role === 'user' ? (
                        <span className="text-xs font-black">U</span>
                      ) : (
                        <Sparkles className="w-4 h-4 text-accent-secondary fill-current" />
                      )}
                    </div>

                    <div className={`flex-1 max-w-[85%] ${msg.role === 'user' ? 'items-end' : ''}`}>
                      <div className={`px-5 py-3.5 rounded-3xl ${
                        msg.role === 'user' 
                          ? 'bg-accent-primary/10 border border-accent-primary/20' 
                          : 'glass border border-white/10'
                      }`}>
                        <p className="text-white/90 leading-relaxed whitespace-pre-wrap text-sm">{msg.content}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center bg-accent-secondary/20">
                      <Sparkles className="w-4 h-4 text-accent-secondary fill-current animate-pulse" />
                    </div>
                    <div className="glass border border-white/10 px-5 py-3.5 rounded-3xl">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </AnimatePresence>
            </div>

            <div className="p-6 border-t border-white/10 bg-nexus-dark/80">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Pregúntame sobre este artículo..."
                  className="flex-1 px-5 py-4 glass rounded-3xl border border-white/10 bg-nexus-dark/50 text-white placeholder-white/30 focus:outline-none focus:border-accent-primary/50 transition-colors text-sm"
                  disabled={loading}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="px-7 py-4 bg-accent-primary hover:bg-accent-primary/90 disabled:bg-white/10 disabled:text-white/30 text-nexus-black font-black rounded-3xl transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-accent-primary/20"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </>
  );
};

export default AIChatPanel;

