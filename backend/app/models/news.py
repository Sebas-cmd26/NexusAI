from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class NewsBase(BaseModel):
    title: str
    source_url: str
    summary: Optional[str] = None
    image_url: Optional[str] = None
    sector: str
    impact_level: str  # e.g., 'High', 'Medium', 'Low'
    published_at: datetime
    is_breaking: bool = False

class NewsCreate(NewsBase):
    pass

class News(NewsBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True
