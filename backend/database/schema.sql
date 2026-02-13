-- Schema for NexusAI

-- News Articles Table
CREATE TABLE IF NOT EXISTS news_articles (
    id TEXT PRIMARY KEY,
    title TEXT,
    summary TEXT,
    content TEXT,
    source_url TEXT,
    image_url TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    sector TEXT,
    impact_level TEXT,
    source_name TEXT,
    author TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Groups Table
CREATE TABLE IF NOT EXISTS groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    created_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Group Messages Table
CREATE TABLE IF NOT EXISTS group_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    content TEXT,
    news_id TEXT REFERENCES news_articles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Bookmarks Table
CREATE TABLE IF NOT EXISTS user_bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    news_id TEXT REFERENCES news_articles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_news_published ON news_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_sector ON news_articles(sector);
CREATE INDEX IF NOT EXISTS idx_news_impact ON news_articles(impact_level);

-- Full text search (PostgreSQL specific)
-- Note: Supabase exposes this via their API, but index helps
CREATE INDEX IF NOT EXISTS idx_news_fts ON news_articles USING GIN (to_tsvector('english', title || ' ' || summary));

-- Row Level Security (RLS)
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_bookmarks ENABLE ROW LEVEL SECURITY;

-- Public access policies (adjust for production)
CREATE POLICY "Allow public read news" ON news_articles FOR SELECT USING (true);
CREATE POLICY "Allow public read groups" ON groups FOR SELECT USING (true);
CREATE POLICY "Allow public read messages" ON group_messages FOR SELECT USING (true);
CREATE POLICY "Allow insert messages" ON group_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert groups" ON groups FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert news" ON news_articles FOR INSERT WITH CHECK (true); -- For ingestion script
