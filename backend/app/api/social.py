from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from ..services.search_service import SearchService
from ..services.supabase_service import SupabaseService

router = APIRouter()

class ShareRequest(BaseModel):
    group_id: str
    news_id: str
    user_id: str = "anonymous"

class GroupCreate(BaseModel):
    name: str
    description: str
    type: str

class MessageCreate(BaseModel):
    group_id: str
    user_id: str
    content: str
    news_id: Optional[str] = None

@router.get("/search")
async def search(q: str):
    results = SearchService.search(q)
    return results

@router.get("/groups")
async def get_groups():
    try:
        groups = SupabaseService.get_groups()
        return groups if groups else []
    except Exception as e:
        print(f"Error getting groups: {e}")
        return []

@router.post("/groups/share")
async def share_to_group(request: ShareRequest):
    result = SupabaseService.share_to_group(request.group_id, request.news_id, request.user_id)
    return {"status": "success", "data": result}

@router.post("/groups/create")
async def create_group(group: GroupCreate):
    result = SupabaseService.create_group(group.name, group.description, group.type)
    return {"status": "success", "data": result}

@router.get("/groups/{group_id}/messages")
async def get_group_messages(group_id: str, limit: int = 50):
    messages = SupabaseService.get_group_messages(group_id, limit)
    return messages

@router.post("/groups/messages")
async def send_message(message: MessageCreate):
    result = SupabaseService.send_message(
        message.group_id,
        message.user_id,
        message.content,
        message.news_id
    )
    return {"status": "success", "data": result}
