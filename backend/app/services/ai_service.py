import google.generativeai as genai
from ..core.config import settings
from typing import Optional, List

class AIService:
    @staticmethod
    def _init_gemini():
        genai.configure(api_key=settings.GEMINI_API_KEY)
        return genai.GenerativeModel('gemini-1.5-flash')

    @staticmethod
    async def classify_sector(title: str, summary: Optional[str]) -> str:
        """Classify news into sectors using Gemini 1.5 Flash."""
        model = AIService._init_gemini()
        prompt = f"""
        Classify the following news into EXACTLY ONE of these sectors: 
        Health, Engineering, Finance, Education, Legal, General.
        
        Title: {title}
        Summary: {summary}
        
        Return only the sector name.
        """
        try:
            response = model.generate_content(prompt)
            return response.text.strip()
        except Exception:
            return "General"

    @staticmethod
    async def generate_executive_summary(text: str) -> str:
        """Generate a 3-point executive summary (TL;DR) using Gemini 1.5 Flash."""
        model = AIService._init_gemini()
        prompt = f"""
        Provide a concise executive summary (TL;DR) of the following text in exactly 3 bullet points:
        
        {text}
        """
        try:
            response = model.generate_content(prompt)
            return response.text.strip()
        except Exception:
            return "Summary generation unavailable."

    @staticmethod
    async def summarize(text: str) -> str:
        "Summarize text for AI chat conversations."
        model = AIService._init_gemini()
        prompt = f"""
        Provide a clear, concise summary of the following text in 2-3 sentences:
        
        {text}
        
        Be conversational and helpful.
        """
        try:
            response = model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            print(f"Error in summarize: {e}")
            return "Summary unavailable."

    @staticmethod
    async def chat(history: List[dict], message: str, context: str = "") -> str:
        "Chat with the AI using conversation history and context."
        try:
            model = AIService._init_gemini()
            
            # Construct a prompt with history
            system_prompt = f"You are an expert AI news assistant. {context} Keep answers concise and relevant to the article discussed."
            prompt_parts = [system_prompt]
            
            for msg in history:
                role = "user" if msg.get('role') == 'user' else "model"
                prompt_parts.append(f"{role}: {msg.get('content')}")
            
            prompt_parts.append(f"user: {message}")
            
            full_context = "\n".join(prompt_parts)
            response = model.generate_content(full_context)
            return response.text.strip()
        except Exception as e:
            print(f"Error in chat: {e}")
            return "I apologize, but I'm having trouble processing your request right now."

    @staticmethod
    async def detect_impact(title: str, summary: str) -> str:
        """Detect if news is 'Breaking News' or 'Normal'."""
        model = AIService._init_gemini()
        prompt = f"Detect if this news is 'Breaking News' or 'Normal'. Title: {title}. Return only the label."
        try:
            response = model.generate_content(prompt)
            return "High" if "Breaking" in response.text else "Medium"
        except Exception:
            return "Medium"
