-- SQL Script for Supabase
-- Tables for AI Nexus MVP 1.0

-- 1. News Table
CREATE TABLE IF NOT EXISTS public.news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    source_url TEXT NOT NULL,
    summary TEXT,
    sector TEXT,
    impact_level TEXT,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    is_breaking BOOLEAN DEFAULT false
);

-- 2. Groups Table
CREATE TABLE IF NOT EXISTS public.groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Group Posts (Shared News)
CREATE TABLE IF NOT EXISTS public.group_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES public.groups(id),
    news_id UUID REFERENCES public.news(id),
    user_id UUID, -- Optional: Link to Auth.users
    shared_at TIMESTAMPTZ DEFAULT now()
);

-- Initial Groups Data
INSERT INTO public.groups (name, description, icon) VALUES
('AI in Medicine', 'Community for medical professionals and AI developers.', ''),
('Generative Art', 'Exploring the intersection of creativity and machine learning.', ''),
('LLM Engineering', 'Deep dive into RAG, prompt engineering and fine-tuning.', ''),
('AI Ethics & Law', 'Discussions on regulation and ethical implications of AI.', '');
