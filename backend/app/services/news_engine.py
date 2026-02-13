from typing import List
from .newsapi_fetcher import NewsAPIFetcher
from .ingestion import IngestionService
from .ai_service import AIService
from .embedding_service import EmbeddingService
from .search_service import SearchService
from .supabase_service import SupabaseService
from ..models.news import News, NewsCreate
import uuid
from datetime import datetime

class NewsEngine:
    @staticmethod
    async def process_new_stories() -> List[News]:
        """Coordination layer for MVP 1.0 - Fetches, Processes, Saves and Indexes."""
        # 1. Fetch from multiple sources
        hn_stories = await IngestionService.fetch_hacker_news()
        print(f"DEBUG: HackerNews stories: {len(hn_stories)}")
        
        newsapi_stories = await NewsAPIFetcher.fetch_ai_news()
        print(f"DEBUG: NewsAPI stories: {len(newsapi_stories)}")
        
        arxiv_stories = await IngestionService.fetch_arxiv()
        print(f"DEBUG: ArXiv stories: {len(arxiv_stories)}")
        
        raw_stories = newsapi_stories[:10] + hn_stories[:3] + arxiv_stories[:2]
        
        processed = []
        for item in raw_stories:
            # 2. Gemini Classification, Summary & Impact
            if item.sector and item.sector not in ["General", None]:
                sector = item.sector
            else:
                sector = await AIService.classify_sector(item.title, item.summary)
            summary_3pts = await AIService.generate_executive_summary(item.summary or item.title)
            impact = await AIService.detect_impact(item.title, item.summary or "")
            is_breaking = (impact == "High")

            news_id = str(uuid.uuid4())
            news_obj = News(
                id=news_id,
                title=item.title,
                source_url=item.source_url,
                summary=summary_3pts,
                sector=sector,
                impact_level=impact,
                published_at=item.published_at,
                created_at=datetime.utcnow(),
                is_breaking=is_breaking
            )
            
            # Prepare data for Supabase
            db_data = news_obj.dict()
            db_data['published_at'] = db_data['published_at'].isoformat()
            db_data['created_at'] = db_data['created_at'].isoformat()

            # 3. Save to Supabase
            try:
                SupabaseService.save_news(db_data)
                
                # 4. Vectorize & Index in Pinecone
                SearchService.upsert_news(
                    news_id, 
                    f"{item.title} {summary_3pts}", 
                    {
                        "title": item.title, 
                        "sector": sector, 
                        "url": item.source_url,
                        "summary": summary_3pts[:200]
                    }
                )
            except Exception as e:
                print(f"Error saving story {news_id}: {e}")
            
            processed.append(news_obj)
            
        return processed




