# AI Nexus MVP 1.0 - Production Readiness

## 1. Zero-Cost Infrastructure
- **Embeddings**: Generated locally using `sentence-transformers` (`all-MiniLM-L6-v2`). No API costs.
- **AI Logic**: Powered by **Gemini 1.5 Flash** (Free tier usage).
- **Database**: **Supabase** (PostgreSQL) capped at free tier.
- **Search**: **Pinecone Serverless** (us-east-1) in free tier mode.

## 2. Security
- API keys are handled via `.env`.
- Frontend refers to `localhost:8000` for development; update to production URL in `App.jsx` during deploy.

## 3. Social Features
- Groups are now dynamic, fetched from Supabase.
- Table schema in `supabase_schema.sql` must be applied in the Supabase SQL Editor.

## 4. Run Locally
```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```
