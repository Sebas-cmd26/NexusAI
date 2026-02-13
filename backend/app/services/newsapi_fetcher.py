import httpx
import os
from datetime import datetime, timedelta
from typing import List
from ..models.news import NewsCreate

# Sector-specific fallback images
SECTOR_IMAGES = {
    "Health": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop",
    "Engineering": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop",
    "Finance": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop",
    "Education": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop",
    "Legal": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=600&fit=crop",
    "General": "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
    "Technical": "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&h=600&fit=crop"
}

class NewsAPIFetcher:
    @staticmethod
    async def fetch_ai_news() -> List[NewsCreate]:
        """Fetch AI-related news from NewsAPI."""
        api_key = os.getenv('NEWS_API_KEY')
        if not api_key:
            print('NEWS_API_KEY not found, skipping NewsAPI')
            return []
        
        # Get news from last 48 hours to ensure coverage - REAL TIME FIX
        from_date = (datetime.now() - timedelta(days=2)).strftime('%Y-%m-%d')
        # Broader query to ensure results
        url = f'https://newsapi.org/v2/everything?q=("artificial intelligence" OR "AI" OR "machine learning")&from={from_date}&sortBy=publishedAt&language=en&apiKey={api_key}'
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(url, timeout=10.0)
                data = response.json()
                
                news_items = []
                for article in data.get('articles', [])[:10]:
                    if not article.get('title') or article['title'] == '[Removed]':
                        continue
                    
                    # Use article image or fallback to General sector image
                    image_url = article.get('urlToImage') or SECTOR_IMAGES["General"]
                    
                    news_items.append(NewsCreate(
                        title=article['title'],
                        source_url=article['url'],
                        sector='General',
                        impact_level='Medium',
                        published_at=datetime.fromisoformat(article['publishedAt'].replace('Z', '+00:00')),
                        summary=article.get('description', ''),
                        image_url=image_url
                    ))
                
                return news_items
            except Exception as e:
                print(f'Error fetching from NewsAPI: {e}')
                return []

