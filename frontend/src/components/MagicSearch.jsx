import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, X, Clock, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MagicSearch = ({ onSearch }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeout = useRef(null);

  useEffect(() => {
    // Load search history from localStorage
    const history = JSON.parse(localStorage.getItem('search_history') || '[]');
    setSearchHistory(history.slice(0, 5)); // Keep last 5 searches
  }, []);

  const trendingSuggestions = [
    "Latest in Generative AI",
    "Quantum Computing breakthroughs",
    "AI Regulation in EU",
    "NVIDIA market updates",
    "Machine Learning healthcare"
  ];

  const handleQueryChange = (value) => {
    setQuery(value);
    
    // Debounce search - wait 300ms after user stops typing
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (value.trim().length > 0) {
      setIsSearching(true);
      searchTimeout.current = setTimeout(() => {
        performSearch(value);
      }, 300);
    }
  };

  const performSearch = (searchQuery) => {
    if (onSearch) {
      onSearch(searchQuery);
    }
    
    // Save to search history
    const history = JSON.parse(localStorage.getItem('search_history') || '[]');
    const newHistory = [searchQuery, ...history.filter(h => h !== searchQuery)].slice(0, 5);
    localStorage.setItem('search_history', JSON.stringify(newHistory));
    setSearchHistory(newHistory);
    setIsSearching(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    performSearch(suggestion);
    setIsFocused(false);
  };

  const clearSearch = () => {
    setQuery('');
    if (onSearch) {
      onSearch('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      performSearch(query);
      setIsFocused(false);
    }
    if (e.key === 'Escape') {
      setIsFocused(false);
    }
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <motion.div
        animate={{ 
          scale: isFocused ? 1.02 : 1,
          boxShadow: isFocused ? "0 0 40px rgba(0, 209, 255, 0.3)" : "0 0 0px rgba(0, 0, 0, 0)"
        }}
        className="glass rounded-3xl p-1 relative overflow-hidden border border-white/10"
      >
        {/* Animated gradient border on focus */}
        {isFocused && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary opacity-20 blur-xl"
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        )}

        <div className="relative flex items-center px-6 py-4 bg-nexus-dark/50 rounded-3xl backdrop-blur-xl">
          <Search className={`w-6 h-6 ${isFocused ? 'text-accent-primary' : 'text-white/30'} transition-colors duration-300`} />
          
          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            onKeyDown={handleKeyDown}
            placeholder="Search the neural frontier..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-white/30 px-4 text-lg font-medium outline-none"
          />

          {/* Loading indicator */}
          {isSearching && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mr-2"
            >
              <div className="w-5 h-5 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
            </motion.div>
          )}

          {/* Clear button */}
          {query && !isSearching && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={clearSearch}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors mr-2"
            >
              <X className="w-5 h-5 text-white/60" />
            </motion.button>
          )}

          <div className="h-8 w-[1px] bg-white/10 mx-2" />
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => query && performSearch(query)}
            className="p-2 bg-accent-primary/10 rounded-xl text-accent-primary group relative"
          >
            <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
            <div className="absolute inset-0 bg-accent-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>
        </div>
      </motion.div>

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-4 glass rounded-3xl overflow-hidden z-[90] border border-white/10 backdrop-blur-xl"
          >
            {/* Search History */}
            {searchHistory.length > 0 && (
              <div className="p-4 border-b border-white/5">
                <div className="flex items-center gap-2 px-4 mb-3">
                  <Clock className="w-4 h-4 text-white/40" />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Recent Searches</p>
                </div>
                <div className="space-y-1">
                  {searchHistory.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(item)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/5 text-white/80 hover:text-accent-primary transition-all text-left group"
                    >
                      <Search className="w-4 h-4 opacity-40 group-hover:opacity-100" />
                      <span className="font-medium">{item}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Suggestions */}
            <div className="p-4">
              <div className="flex items-center gap-2 px-4 mb-3">
                <TrendingUp className="w-4 h-4 text-accent-primary" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Trending Searches</p>
              </div>
              <div className="space-y-1">
                {trendingSuggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(s)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/5 text-white/60 hover:text-accent-primary transition-all text-left group"
                  >
                    <Sparkles className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:fill-current" />
                    <span className="font-medium">{s}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MagicSearch;
