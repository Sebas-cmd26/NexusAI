import React from 'react';
import { Search, Filter, History, Trash2 } from 'lucide-react';

const SearchView = () => {
  const history = [
    "Gemini 1.5 Pro updates",
    "OpenAI Sora release date",
    "Quantum entanglement in Silicon",
    "Neuralink clinical trials"
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h2 className="text-4xl md:text-6xl font-display font-black tracking-tighter mb-4 nexus-gradient-text">Deep Indexing.</h2>
        <p className="text-white/40 font-medium text-lg">Query the global neural intelligence index with semantic precision.</p>
      </header>

      <div className="max-w-3xl space-y-8">
        <div className="glass-card p-2 flex items-center pr-6">
          <div className="flex-1 flex items-center px-6 py-4">
             <Search className="w-6 h-6 text-accent-primary" />
             <input
               type="text"
               placeholder="What intelligence are you seeking?"
               className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-white/20 px-6 text-xl font-medium"
             />
          </div>
          <button className="glass p-3 rounded-xl text-white/40 hover:text-white transition-all">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 flex items-center gap-3">
              <History className="w-4 h-4" /> Recent Queries
            </h4>
            <button className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500/50 hover:text-red-500 flex items-center gap-2 transition-all">
              <Trash2 className="w-4 h-4" /> Clear All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {history.map((item, i) => (
              <button
                key={i}
                className="glass-card p-6 flex items-center gap-4 hover:border-accent-primary/30 group transition-all"
              >
                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-accent-primary/10 transition-colors">
                  <Search className="w-4 h-4 text-white/30 group-hover:text-accent-primary" />
                </div>
                <span className="font-medium text-white/60 group-hover:text-white transition-colors">{item}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchView;