import { fetchAINews } from './newsService.js';
import { saveNewsToSupabase } from './supabaseService.js';

export const syncNews = async () => {
  console.log('Starting news synchronization...');
  try {
    const articles = await fetchAINews();
    if (articles.length > 0) {
      await saveNewsToSupabase(articles);
      console.log(`Successfully synced ${articles.length} articles.`);
    } else {
      console.log('No new articles to sync.');
    }
  } catch (error) {
    console.error('Error during news synchronization:', error);
  }
};

export const startNewsSync = () => {
  // Run immediately on start
  syncNews();

  // Schedule every 6 hours (6 * 60 * 60 * 1000 ms)
  const INTERVAL = 6 * 60 * 60 * 1000;
  setInterval(syncNews, INTERVAL);
  console.log(`News sync scheduled every 6 hours.`);
};
