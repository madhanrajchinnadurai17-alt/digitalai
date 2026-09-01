-- ==============================================================================
-- MarkAI Database Schema for Supabase Postgres
-- Phase 1 & Phase 2 (Brand Kit & Content Calendar)
-- College Pitch Competition (Sept 9, 2026)
-- ==============================================================================

-- 1. Business Profiles Table
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

-- 2. Brand Kit & Voice Memory Table (Phase 2)
CREATE TABLE IF NOT EXISTS public.brand_kits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL UNIQUE,
    primary_color TEXT DEFAULT '#8B5CF6',
    secondary_color TEXT DEFAULT '#D946EF',
    accent_color TEXT DEFAULT '#F59E0B',
    font_heading TEXT DEFAULT 'Plus Jakarta Sans',
    font_body TEXT DEFAULT 'Inter',
    logo_badge_text TEXT DEFAULT '',
    brand_voice_guidelines TEXT DEFAULT '',
    dos_list TEXT[] DEFAULT '{}',
    donts_list TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Content Calendar Table (Phase 2)
CREATE TABLE IF NOT EXISTS public.content_calendar (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    date DATE NOT NULL,
    title TEXT NOT NULL,
    festival_occasion TEXT,
    format TEXT DEFAULT 'single_image' CHECK (format IN ('single_image', 'carousel', 'reels_script')),
    content_hook TEXT NOT NULL,
    hashtags TEXT[] DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'suggested' CHECK (status IN ('suggested', 'scheduled', 'published')),
    best_time TEXT,
    visual_concept TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Generated Posts History Table
CREATE TABLE IF NOT EXISTS public.posts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    business_name TEXT NOT NULL,
    industry TEXT,
    format TEXT DEFAULT 'single_image' CHECK (format IN ('single_image', 'carousel', 'reels_script')),
    caption TEXT NOT NULL,
    hashtags TEXT[] DEFAULT '{}',
    visual_idea TEXT,
    best_time TEXT,
    post_theme TEXT,
    image_data TEXT,
    image_url TEXT,
    carousel_slides JSONB,
    reels_script JSONB,
    status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Posted', 'Failed')),
    instagram_media_id TEXT,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Indexes
CREATE INDEX IF NOT EXISTS idx_posts_user_created ON public.posts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_calendar_user_date ON public.content_calendar(user_id, date ASC);

-- 6. RLS Permissions
ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_kits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for demo" ON public.business_profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for demo brand kit" ON public.brand_kits FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for demo calendar" ON public.content_calendar FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for demo posts" ON public.posts FOR ALL USING (true) WITH CHECK (true);
