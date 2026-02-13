from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )
    
    PROJECT_NAME: str = "AI Nexus App (MVP 1.0)"
    
    # API Keys
    GEMINI_API_KEY: str = "AIzaSyCUxx-f82eb48n9Ye4Da4OV-zuId0N8sY4"
    NEWS_API_KEY: str = "a896f01c4ea84f33af88724cad145d61"
    
    # Supabase
    SUPABASE_URL: str = "https://ymixjpbhowspsnhbcdzp.supabase.co"
    SUPABASE_ANON_KEY: str = "sb_publishable_PB8GOI2Xn5ircngx4Fb86w_IXOJXIfp"
    
    # Pinecone
    PINECONE_API_KEY: str = "pcsk_7L8q8H_2VYa5iHhwd8mXxS5tqSgKmAC3o9f9qrywY39iPnSyMwgfbDZJyC7HiqUicF5EYB"
    PINECONE_ENV: str = "us-east-1"
    
    # Embedding Settings
    EMBEDDING_MODEL_NAME: str = "all-MiniLM-L6-v2"
    PINECONE_INDEX_NAME: str = "news-index"

settings = Settings()
