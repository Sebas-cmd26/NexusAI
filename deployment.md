# AI Nexus Deployment Guide

## Backend (FastAPI)
1. **Docker**:
   ```bash
   cd backend
   docker build -t ai-nexus-backend .
   docker run -p 8000:8000 ai-nexus-backend
   ```
2. **Platform Specific**:
   - **Render/Railway**: Connect GitHub, use `backend` as root, and set `uvicorn app.main:app --host 0.0.0.0 --port 8000`.

## Frontend (React)
1. **Build**:
   ```bash
   cd frontend
   npm run build
   ```
2. **Platform Specific**:
   - **Vercel/Netlify**: Connect GitHub, use `frontend` as root, build command `npm run build`, output directory `dist`.

## Environment Variables
Ensure you set the following in your cloud provider:
- `OPENAI_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_KEY`
- `NEWS_API_KEY`
