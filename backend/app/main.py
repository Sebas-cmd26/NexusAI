from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import feed, social

app = FastAPI(title="AI Nexus App (MVP 1.0)")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(feed.router, prefix="/api", tags=["News Feed"])
app.include_router(social.router, prefix="/api", tags=["Social"])

@app.get("/")
def root():
    return {"message": "AI Nexus App (MVP 1.0) is online"}
