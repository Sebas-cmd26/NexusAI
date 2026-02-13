from pinecone import Pinecone
from ..core.config import settings
from .embedding_service import EmbeddingService

class SearchService:
    @staticmethod
    def _get_index():
        pc = Pinecone(api_key=settings.PINECONE_API_KEY)
        return pc.Index("news-index") # User specified 384 dimensions

    @staticmethod
    def upsert_news(news_id: str, text: str, metadata: dict):
        """Upsert news embedding to Pinecone."""
        index = SearchService._get_index()
        vector = EmbeddingService.generate_embedding(text)
        index.upsert(vectors=[(news_id, vector, metadata)])

    @staticmethod
    def semantic_search(query: str, filters: dict = None, top_k: int = 5):
        """Perform semantic search on Pinecone with optional filters."""
        index = SearchService._get_index()
        query_vector = EmbeddingService.generate_embedding(query)
        
        # Prepare filter if provided
        query_filter = filters if filters else None

        results = index.query(
            vector=query_vector, 
            top_k=top_k, 
            include_metadata=True,
            filter=query_filter
        )
        return results
