import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Calendar, ChevronRight, Trash2, ArrowLeft } from 'lucide-react';
import AIChatPanel from './AIChatPanel';

const AIChatHistoryView = ({ onBack }) => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = () => {
    try {
      const history = JSON.parse(localStorage.getItem('ai_chat_history') || '{}');
      const chatList = Object.entries(history).map(([articleId, messages]) => {
        const lastMessage = messages[messages.length - 1];
        const date = lastMessage ? new Date(lastMessage.timestamp) : new Date();
        
        let title = `Discusión de Artículo`;
        if (messages.length > 0 && messages[0].content.includes('about "')) {
            const match = messages[0].content.match(/about "(.*?)"/);
            if (match) title = match[1];
        }

        return {
          id: articleId,
          messages,
          lastMessage: lastMessage?.content || 'Sin mensajes',
          date: date,
          title: title
        };
      });
      
      setChats(chatList.sort((a, b) => b.date - a.date));
    } catch (err) {
      console.error('Error loading chats:', err);
    }
  };

  const deleteChat = (e, id) => {
    e.stopPropagation();
    if (confirm('¿Eliminar esta conversación?')) {
      const history = JSON.parse(localStorage.getItem('ai_chat_history') || '{}');
      delete history[id];
      localStorage.setItem('ai_chat_history', JSON.stringify(history));
      loadChats();
    }
  };

  return (
    <div className="min-h-screen bg-nexus-dark text-white p-6 pb-24 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-3 glass rounded-full hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Conversaciones IA</h1>
            <p className="text-white/50 text-sm">Tu historial con Nexus IA</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {chats.length === 0 ? (
          <div className="text-center py-20 opacity-50">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-white/20" />
            <p className="text-xl font-bold">Aún No Hay Conversaciones</p>
            <p className="text-sm">¡Comienza a chatear con IA en cualquier artículo!</p>
          </div>
        ) : (
          chats.map((chat) => (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelectedChat(chat)}
              className="glass p-6 rounded-3xl cursor-pointer hover:bg-white/5 transition-all group relative border border-white/5 hover:border-accent-primary/30"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg line-clamp-1 pr-8 text-white/90">{chat.title}</h3>
                <span className="text-xs text-white/40 flex items-center gap-1 font-mono">
                  <Calendar className="w-3 h-3" />
                  {chat.date.toLocaleDateString()}
                </span>
              </div>
              
              <p className="text-white/60 text-sm line-clamp-2 pr-8 font-light">
                {chat.lastMessage}
              </p>

              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-5 h-5 text-white/30" />
              </div>

              <button
                onClick={(e) => deleteChat(e, chat.id)}
                className="absolute bottom-6 right-6 p-2 rounded-full hover:bg-red-500/20 text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))
        )}
      </div>

      {selectedChat && (
        <AIChatPanel 
          article={selectedChat} 
          onClose={() => setSelectedChat(null)} 
        />
      )}
    </div>
  );
};

export default AIChatHistoryView;


