import os
import sys

# Add current directory to path so we can import app
sys.path.append(os.getcwd())
from app.core.config import settings

def check_embedding():
    print("Checking SentenceTransformer...")
    try:
        from sentence_transformers import SentenceTransformer
        print(f"Loading model: {settings.EMBEDDING_MODEL_NAME}")
        model = SentenceTransformer(settings.EMBEDDING_MODEL_NAME)
        print("SentenceTransformer Loaded Successfully")
    except Exception as e:
        print(f"SentenceTransformer Error: {e}")
        import traceback
        traceback.print_exc()

def check_pinecone():
    print("\nChecking Pinecone...")
    try:
        from pinecone import Pinecone
        print(f"Initializing Pinecone with key: {settings.PINECONE_API_KEY[:5]}...")
        pc = Pinecone(api_key=settings.PINECONE_API_KEY)
        index_name = settings.PINECONE_INDEX_NAME
        print(f"Connecting to index: {index_name}")
        index = pc.Index(index_name)
        print("Pinecone Index Connected")
        print(index.describe_index_stats())
    except Exception as e:
        print(f"Pinecone Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    check_embedding()
    check_pinecone()
