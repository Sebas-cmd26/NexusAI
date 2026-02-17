import { fetchAINews } from './newsService.js';
import { saveNewsToSupabase } from './supabaseService.js';
import { translateToSpanish } from './geminiService.js';

export const syncNews = async () => {
  console.log('Starting news synchronization...');
  try {
    const articles = await fetchAINews();
    
    if (articles.length > 0) {
      console.log(`Translating ${articles.length} articles to Spanish...`);
      
      // Translate titles and summaries to Spanish
      const translatedArticles = await Promise.all(
        articles.map(async (article) => {
          try {
            const translatedTitle = await translateToSpanish(article.title);
            const translatedSummary = await translateToSpanish(article.summary);
            
            return {
              ...article,
              title: translatedTitle,
              summary: translatedSummary
            };
          } catch (error) {
            console.error(`Error translating article ${article.id}:`, error);
            // Return original article if translation fails
            return article;
          }
        })
      );
      
      await saveNewsToSupabase(translatedArticles);
      console.log(`Successfully synced ${translatedArticles.length} translated articles.`);
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
