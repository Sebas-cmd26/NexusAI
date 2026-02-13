import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

def init_supabase():
    url = os.getenv('SUPABASE_URL')
    key = os.getenv('SUPABASE_ANON_KEY')
    
    if not url or not key:
        raise ValueError('SUPABASE_URL or SUPABASE_ANON_KEY not found')
    
    print(f'Connecting to Supabase: {url}')
    supabase = create_client(url, key)
    
    # Read SQL file
    with open('scripts/init_supabase.sql', 'r') as f:
        sql_content = f.read()
    
    print('Executing SQL schema...')
    
    # Note: Supabase Python client doesn't support raw SQL execution
    # You need to run this SQL in the Supabase SQL Editor
    print('Please run the following SQL in Supabase SQL Editor:')
    print('https://supabase.com/dashboard/project/ymixjpbhowspsnhbcdzp/sql/new')
    print('\nSQL file location: scripts/init_supabase.sql')
    
    # Test connection by querying groups
    try:
        result = supabase.table('groups').select('*').execute()
        print(f'Successfully connected! Found {len(result.data)} groups')
        for group in result.data:
            print(f'  - {group["name"]}')
    except Exception as e:
        print(f'Tables not yet created. Please run the SQL script first.')
        print(f'Error: {e}')

if __name__ == '__main__':
    try:
        init_supabase()
    except Exception as e:
        print(f'Error: {e}')
        raise
