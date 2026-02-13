import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import SectorBar from './components/SectorBar';
import NewsCard from './components/NewsCard';
import GroupsView from './components/GroupsView';
import MagicSearch from './components/MagicSearch';
import NewsDrawer from './components/NewsDrawer';
import SkeletonLoader from './components/SkeletonLoader';
import AlertsView from './components/AlertsView';
import BookmarksView from './components/BookmarksView';
import HeroSection from './components/HeroSection';
import AIChatHistoryView from './components/AIChatHistoryView';
import APIService from './services/api';

const FALLBACK_NEWS = [
  { id: '1', title: 'OpenAI announces GPT-5 development phase', sector: 'Engineering', impact_level: 'High', published_at: new Date().toISOString(), summary: 'Details about the next generation of large language models...', source_url: 'https://openai.com/blog' },
  { id: '2', title: 'AI in Radiology: Breakthrough in early cancer detection', sector: 'Health', impact_level: 'High', published_at: new Date().toISOString(), summary: 'New neural network designs show 99% accuracy in lung scans...', source_url: 'https://www.nature.com' },
  { id: '3', title: 'NVIDIA H200 chips start shipping to data centers', sector: 'Engineering', impact_level: 'Medium', published_at: new Date().toISOString(), summary: 'The latest AI hardware is being deployed globally...', source_url: 'https://nvidianews.nvidia.com' }
];

const App = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const [news, setNews] = useState([]);
  const [activeSector, setActiveSector] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (activeTab === 'feed') fetchFeed();
  }, [activeSector, activeTab]);

  const fetchFeed = async () => {
    setLoading(true);
    try {
      const data = await APIService.getFeed(activeSector);
      localStorage.setItem('news_cache', JSON.stringify(data));
      setNews(data.length > 0 ? data : FALLBACK_NEWS);
    } catch (error) {
      console.error('Error fetching feed:', error);
      setNews(FALLBACK_NEWS);
    }
    setLoading(false);
  };

  const handleSearch = async (query) => {
    if (!query || query.trim() === '') {
      fetchFeed();
      setActiveTab('feed');
      return;
    }
    
    setLoading(true);
    setActiveTab('feed');
    setSearchQuery(query);
    try {
      const results = await APIService.search(query);
      setNews(results);
    } catch (error) {
      console.error('Error searching:', error);
      setNews([]);
    }
    setLoading(false);
  };

  const resetFeed = () => {
    setSearchQuery('');
    setActiveSector(null);
    fetchFeed();
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-secondary/5 blur-[120px] rounded-full pointer-events-none"></div>

      {activeTab === 'feed' && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <HeroSection />

          <section className="relative">
            <MagicSearch onSearch={handleSearch} />
          </section>

          <section>
            <SectorBar activeSector={activeSector} setActiveSector={setActiveSector} />
          </section>

          {searchQuery && (
            <div className="flex items-center justify-between px-4 py-2 bg-glass-light rounded-lg border border-white/5">
              <p className="text-sm text-white/60">
                Search results for: <span className="text-accent-primary font-medium">{searchQuery}</span>
              </p>
              <button 
                onClick={resetFeed}
                className="text-xs text-accent-primary hover:text-accent-primary/80 transition-colors"
              >
                Clear search
              </button>
            </div>
          )}

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <SkeletonLoader key={i} />)
            ) : news.length > 0 ? (
              news.map((item) => (
                <NewsCard 
                  key={item.id} 
                  news={item} 
                  onClick={() => setSelectedNews(item)} 
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-white/40 text-lg">No news found</p>
                {searchQuery && (
                  <button 
                    onClick={resetFeed}
                    className="mt-4 px-6 py-2 bg-accent-primary/10 hover:bg-accent-primary/20 text-accent-primary rounded-lg transition-colors"
                  >
                    Reset Feed
                  </button>
                )}
              </div>
            )}
          </section>
        </div>
      )}

      {activeTab === 'chats' && <AIChatHistoryView onBack={() => setActiveTab('feed')} />}
      {activeTab === 'groups' && <GroupsView />}
      {activeTab === 'search' && <SearchView onSearch={handleSearch} />}
      {activeTab === 'alerts' && <AlertsView />}
      {activeTab === 'bookmarks' && <BookmarksView />}

      {selectedNews && (
        <NewsDrawer news={selectedNews} onClose={() => setSelectedNews(null)} />
      )}
    </Layout>
  );
};

export default App;
