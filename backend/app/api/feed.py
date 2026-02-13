from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from ..models.news import News
from ..services.news_engine import NewsEngine

router = APIRouter()

class SummarizeRequest(BaseModel):
    text: str

class ChatRequest(BaseModel):
    history: List[Dict[str, Any]]
    message: str
    context: Optional[str] = ""

@router.get("/feed", response_model=List[News])
async def get_feed(sector: Optional[str] = Query(None)):
    """Return latest news, optionally filtered by sector."""
    stories = await NewsEngine.process_new_stories()
    
    if sector and sector != "General":
        stories = [s for s in stories if s.sector.lower() == sector.lower()]
        
    return stories

@router.post("/ingest")
async def trigger_ingestion():
    """Trigger real-time news ingestion."""
    stories = await NewsEngine.process_new_stories()
    return {"status": "success", "count": len(stories)}

@router.post("/summarize")
async def summarize_news(request: SummarizeRequest):
    "Generate a summary for the given text."
    from ..services.ai_service import AIService
    summary = await AIService.summarize(request.text)
    return {"summary": summary}

@router.post("/chat")
async def chat_news(request: ChatRequest):
    "Chat with AI about news."
    from ..services.ai_service import AIService
    response = await AIService.chat(request.history, request.message, request.context)
    return {"response": response}
