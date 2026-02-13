import React, { useState, useEffect } from 'react';
import { Bookmark, Trash2, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import NewsCard from './NewsCard';
import NewsDrawer from './NewsDrawer';

const BookmarksView = () => {
  const [bookmarkedNews, setBookmarkedNews] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = () => {
    const bookmarkIds = JSON.parse(localStorage.getItem('bookmarked_news') || '[]');
    const newsCache = JSON.parse(localStorage.getItem('news_cache') || '[]');
    
    const bookmarks = newsCache.filter(news => bookmarkIds.includes(news.id));
    setBookmarkedNews(bookmarks);
  };

  const handleRemoveBookmark = (newsId) => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarked_news') || '[]');
    const updated = bookmarks.filter(id => id !== newsId);
    localStorage.setItem('bookmarked_news', JSON.stringify(updated));
    loadBookmarks();
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to remove all bookmarks?')) {
      localStorage.setItem('bookmarked_news', '[]');
      setBookmarkedNews([]);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-display font-black tracking-tighter mb-2">Bookmarked News</h2>
            <p className="text-white/60">Your saved articles for later reading</p>
          </div>
          {bookmarkedNews.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        {bookmarkedNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarkedNews.map((news) => (
              <div key={news.id} className="relative">
                <NewsCard 
                  news={news} 
                  onClick={() => setSelectedNews(news)} 
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveBookmark(news.id);
                  }}
                  className="absolute top-4 right-4 z-10 p-2 bg-red-500/20 hover:bg-red-500/30 rounded-full transition-colors"
                  title="Remove bookmark"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-glass-light rounded-2xl">
            <Bookmark className="w-20 h-20 text-white/20 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-2">No Bookmarks Yet</h3>
            <p className="text-white/60 mb-6">Start bookmarking articles you want to read later</p>
            <p className="text-sm text-white/40">Click the bookmark icon on any news article to save it here</p>
          </div>
        )}
      </div>

      {selectedNews && (
        <NewsDrawer news={selectedNews} onClose={() => setSelectedNews(null)} />
      )}
    </>
  );
};

export default BookmarksView;
