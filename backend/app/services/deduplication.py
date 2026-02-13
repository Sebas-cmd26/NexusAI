from difflib import SequenceMatcher
from typing import List
from ..models.news import NewsCreate

class DeduplicationService:
    @staticmethod
    def is_similar(a: str, b: str, threshold: float = 0.8) -> bool:
        """Check if two strings are similar above a threshold."""
        return SequenceMatcher(None, a.lower(), b.lower()).ratio() > threshold

    @staticmethod
    def deduplicate(new_items: List[NewsCreate], existing_titles: List[str]) -> List[NewsCreate]:
        """Filter out items that are already in the existing list or similar to each other."""
        unique_items = []
        seen_titles = list(existing_titles)
        
        for item in new_items:
            is_duplicate = False
            for seen in seen_titles:
                if DeduplicationService.is_similar(item.title, seen):
                    is_duplicate = True
                    break
            
            if not is_duplicate:
                unique_items.append(item)
                seen_titles.append(item.title)
                
        return unique_items
