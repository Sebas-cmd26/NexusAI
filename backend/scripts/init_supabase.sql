-- AI Nexus App - Supabase Schema
-- Tables for groups and shared news functionality

-- Groups table
CREATE TABLE IF NOT EXISTS groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    type TEXT DEFAULT 'private' CHECK (type IN ('private', 'public')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Group members table
CREATE TABLE IF NOT EXISTS group_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id, user_id)
);

-- Shared news table
CREATE TABLE IF NOT EXISTS shared_news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
    news_id TEXT NOT NULL,
    shared_by UUID NOT NULL,
    shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id, news_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_shared_news_group_id ON shared_news(group_id);
CREATE INDEX IF NOT EXISTS idx_shared_news_news_id ON shared_news(news_id);

-- Insert sample data
INSERT INTO groups (name, description, type) VALUES
    ('AI Researchers', 'Group for AI research discussions', 'public'),
    ('Healthcare Tech', 'Healthcare technology innovations', 'private'),
    ('Finance AI', 'AI applications in finance', 'public')
ON CONFLICT DO NOTHING;

-- Comments for documentation
COMMENT ON TABLE groups IS 'User collaboration groups for sharing news';
COMMENT ON TABLE group_members IS 'Group membership and roles';
COMMENT ON TABLE shared_news IS 'News articles shared within groups';
