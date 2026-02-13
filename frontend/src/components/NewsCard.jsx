import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowUpRight, Clock } from 'lucide-react';

const NewsCard = ({ news, onClick }) => {
  const sectorColors = {
    'Engineering': 'from-blue-500 to-indigo-600',
    'Health': 'from-emerald-500 to-teal-600',
    'Finance': 'from-amber-500 to-orange-600',
    'Society': 'from-purple-500 to-pink-600',
  };

  const colorClass = sectorColors[news.sector] || 'from-gray-500 to-gray-600';

  return (
    <motion.div
      whileHover={{ y: -8 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card group cursor-pointer overflow-hidden flex flex-col h-full"
      onClick={() => onClick(news)}
    >
      <div className="relative h-56 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-nexus-black via-transparent to-transparent z-10" />
        <img 
          src={news.image_url || `https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800`} 
          alt={news.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className={`absolute top-4 left-4 z-20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-gradient-to-r ${colorClass} shadow-lg shadow-black/20`}>
          {news.sector}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 text-white/40 text-[10px] uppercase tracking-widest font-black mb-3">
          <Clock className="w-3 h-3" />
          {new Date(news.published_at).toLocaleDateString()}
        </div>
        
        <h3 className="text-xl font-display font-bold leading-tight mb-4 group-hover:text-accent-primary transition-colors line-clamp-2">
          {news.title}
        </h3>

        <div className="mt-auto">
          <div className="bg-accent-primary/5 border border-accent-primary/10 rounded-2xl p-4 relative">
            <div className="absolute top-0 right-4 -translate-y-1/2 flex items-center gap-1 bg-nexus-dark px-2 py-1 rounded-full border border-accent-primary/20">
              <Sparkles className="w-3 h-3 text-accent-primary fill-current" />
              <span className="text-[8px] font-black uppercase tracking-tighter text-accent-primary">TL;DR by IA</span>
            </div>
            <p className="text-white/60 text-sm italic leading-relaxed line-clamp-2">
              {news.summary || "Gemini is distilling the core intelligence of this article..."}
            </p>
          </div>
          
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/5">
             <div className="flex items-center gap-2">
               <span className={`w-2 h-2 rounded-full ${news.impact_level === 'High' ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
               <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{news.impact_level} Impact</span>
             </div>
             <ArrowUpRight className="w-5 h-5 text-white/20 group-hover:text-accent-primary transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NewsCard;