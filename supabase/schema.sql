-- ==============================================================================
-- MarkAI MVP Database Schema for Supabase Postgres
-- College Pitch Competition (Sept 9, 2026)
-- ==============================================================================

-- 1. Create Business Profiles Table
CREATE TABLE IF NOT EXISTS public.business_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL UNIQUE,
    business_name TEXT NOT NULL,
    industry TEXT NOT NULL,
    description TEXT NOT NULL,
    target_audience TEXT NOT NULL,
    tone TEXT NOT NULL CHECK (tone IN ('casual', 'formal', 'playful', 'bold', 'inspiring')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Generated Posts History Table
CREATE TABLE IF NOT EXISTS public.posts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    business_name TEXT NOT NULL,
    industry TEXT,
    caption TEXT NOT NULL,
    hashtags TEXT[] DEFAULT '{}',
    visual_idea TEXT,
    best_time TEXT,
    post_theme TEXT,
    image_data TEXT,
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Posted', 'Failed')),
    instagram_media_id TEXT,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Indexes for fast retrieval
CREATE INDEX IF NOT EXISTS idx_posts_user_created ON public.posts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_status ON public.posts(status);

-- 4. Enable Row Level Security (RLS) - Set public permissive for hackathon demo
ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read-write for hackathon demo" ON public.business_profiles
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read-write for posts demo" ON public.posts
    FOR ALL USING (true) WITH CHECK (true);
