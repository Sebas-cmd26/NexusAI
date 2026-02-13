import httpx
import feedparser
from datetime import datetime
from typing import List
from ..models.news import NewsCreate

# Sector-specific fallback images from Unsplash
SECTOR_IMAGES = {
    "Health": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop",
    "Engineering": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop",
    "Finance": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop",
    "Education": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop",
    "Legal": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=600&fit=crop",
    "General": "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
    "Technical": "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&h=600&fit=crop"
}

class IngestionService:
    @staticmethod
    async def fetch_hacker_news() -> List[NewsCreate]:
        """Fetch AI-related stories from HackerNews (via Algolia Search API)."""
        url = "https://hn.algolia.com/api/v1/search?query=AI&tags=story&numericFilters=created_at_i>86400"
        async with httpx.AsyncClient() as client:
            response = await client.get(url, timeout=10.0)
            data = response.json()
            
            news_items = []
            for hit in data.get('hits', []):
                news_items.append(NewsCreate(
                    title=hit['title'],
                    source_url=hit['url'] if hit['url'] else f"https://news.ycombinator.com/item?id={hit['objectID']}",
                    sector="Engineering",
                    impact_level="Medium",
                    published_at=datetime.fromtimestamp(hit['created_at_i']),
                    image_url=SECTOR_IMAGES["Engineering"]
                ))
            return news_items

    @staticmethod
    async def fetch_arxiv() -> List[NewsCreate]:
        """Fetch latest AI papers from ArXiv API."""
        url = "http://export.arxiv.org/api/query?search_query=cat:cs.AI+OR+cat:cs.LG&sortBy=submittedDate&sortOrder=descending&max_results=10"
        async with httpx.AsyncClient() as client:
            response = await client.get(url, timeout=10.0)
            feed = feedparser.parse(response.text)
            
            news_items = []
            for entry in feed.entries:
                try:
                    pub_date = datetime.strptime(entry.published, '%Y-%m-%dT%H:%M:%SZ')
                except:
                    pub_date = datetime.now()
                
                news_items.append(NewsCreate(
                    title=entry.title,
                    source_url=entry.link,
                    sector="Technical",
                    impact_level="Medium",
                    published_at=pub_date,
                    summary=entry.summary,
                    image_url=SECTOR_IMAGES["Technical"]
                ))
            return news_items

