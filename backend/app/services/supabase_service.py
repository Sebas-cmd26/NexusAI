from supabase import create_client
import os
from typing import List, Dict, Any

class SupabaseService:
    client = None

    @classmethod
    def get_client(cls):
        if cls.client is None:
            url = os.getenv('SUPABASE_URL')
            key = os.getenv('SUPABASE_ANON_KEY')
            cls.client = create_client(url, key)
        return cls.client

    @staticmethod
    def get_groups() -> List[Dict[str, Any]]:
        client = SupabaseService.get_client()
        response = client.table('groups').select('*').execute()
        return response.data

    @staticmethod
    def share_to_group(group_id: str, news_id: str, user_id: str = "anonymous") -> Dict[str, Any]:
        """Share news to a group by creating a message"""
        client = SupabaseService.get_client()
        message_data = {
            'group_id': group_id,
            'user_id': user_id,
            'content': f'Shared news article',
            'news_id': news_id
        }
        response = client.table('messages').insert(message_data).execute()
        return response.data

    @staticmethod
    def create_group(name: str, description: str, group_type: str) -> Dict[str, Any]:
        client = SupabaseService.get_client()
        group_data = {'name': name, 'description': description, 'type': group_type}
        response = client.table('groups').insert(group_data).execute()
        return response.data
    
    @staticmethod
    def get_group_messages(group_id: str, limit: int = 50) -> List[Dict[str, Any]]:
        """Get messages for a specific group"""
        client = SupabaseService.get_client()
        response = client.table('messages').select('*').eq('group_id', group_id).order('created_at', desc=True).limit(limit).execute()
        return response.data
    
    @staticmethod
    def send_message(group_id: str, user_id: str, content: str, news_id: str = None) -> Dict[str, Any]:
        """Send a message to a group"""
        client = SupabaseService.get_client()
        message_data = {
            'group_id': group_id,
            'user_id': user_id,
            'content': content
        }
        if news_id:
            message_data['news_id'] = news_id
        response = client.table('messages').insert(message_data).execute()
        return response.data
