import os
from pinecone import Pinecone, ServerlessSpec
from dotenv import load_dotenv

load_dotenv()

def init_pinecone():
    api_key = os.getenv('PINECONE_API_KEY')
    environment = os.getenv('PINECONE_ENV', 'us-east-1')
    
    if not api_key:
        raise ValueError('PINECONE_API_KEY not found')
    
    print(f'Initializing Pinecone in {environment}')
    pc = Pinecone(api_key=api_key)
    
    index_name = 'news-index'
    existing_indexes = pc.list_indexes()
    index_names = [idx['name'] for idx in existing_indexes]
    
    if index_name in index_names:
        print(f'Index {index_name} already exists')
        index = pc.Index(index_name)
        stats = index.describe_index_stats()
        print(f'Index stats: {stats}')
        return
    
    print(f'Creating index {index_name}...')
    pc.create_index(
        name=index_name,
        dimension=768,
        metric='cosine',
        spec=ServerlessSpec(cloud='aws', region=environment)
    )
    
    print(f'Index {index_name} created successfully!')
    import time
    time.sleep(5)
    
    index = pc.Index(index_name)
    stats = index.describe_index_stats()
    print(f'Index ready! Stats: {stats}')

if __name__ == '__main__':
    try:
        init_pinecone()
        print('Pinecone initialization complete!')
    except Exception as e:
        print(f'Error: {e}')
        raise
