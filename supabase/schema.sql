-- ==============================================================================
-- MarkAI Complete Database Schema for Supabase Postgres (Phases 1 to 6)
-- Complete Digital Marketing Automation Suite
-- ==============================================================================

-- 1. Business Profiles Table (Phase 1)
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

-- 4. Scheduled Posts Queue Table (Phase 3)
CREATE TABLE IF NOT EXISTS public.scheduled_posts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    post_id TEXT,
    business_name TEXT NOT NULL,
    caption TEXT NOT NULL,
    platforms TEXT[] DEFAULT '{instagram}',
    scheduled_timestamp TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'publishing', 'published', 'failed')),
    image_data TEXT,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Programmatic Video Projects Table (Phase 4)
CREATE TABLE IF NOT EXISTS public.video_projects (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    archetype TEXT NOT NULL,
    aspect_ratio TEXT DEFAULT '9:16',
    duration_total INTEGER DEFAULT 12,
    audio_track TEXT,
    scenes JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Hosted Websites & Lead Capture Tables (Phase 5)
CREATE TABLE IF NOT EXISTS public.websites (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    user_id TEXT NOT NULL,
    business_name TEXT NOT NULL,
    industry TEXT NOT NULL,
    template_type TEXT NOT NULL DEFAULT 'cafe',
    primary_color TEXT DEFAULT '#7C3AED',
    secondary_color TEXT DEFAULT '#F59E0B',
    hero JSONB NOT NULL,
    about JSONB NOT NULL,
    offerings JSONB NOT NULL,
    testimonials JSONB NOT NULL,
    contact_email TEXT,
    contact_phone TEXT,
    address TEXT,
    hours TEXT,
    published BOOLEAN DEFAULT true,
    published_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.leads (
    id TEXT PRIMARY KEY,
    site_slug TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Autonomous Autopilot Campaigns Table (Phase 6)
CREATE TABLE IF NOT EXISTS public.autopilot_campaigns (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    month TEXT NOT NULL,
    total_posts_planned INTEGER DEFAULT 16,
    platforms_targeted TEXT[] DEFAULT '{instagram,facebook,twitter}',
    status TEXT NOT NULL DEFAULT 'active',
    generated_posts_count INTEGER DEFAULT 16,
    scheduled_posts_count INTEGER DEFAULT 16,
    weekly_digest_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Generated Posts History Table (Phase 1 & 2)
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
    status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Posted', 'Scheduled', 'Failed')),
    instagram_media_id TEXT,
    published_platforms TEXT[] DEFAULT '{instagram}',
    scheduled_for TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Permissions
ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_kits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.autopilot_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all" ON public.business_profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON public.brand_kits FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON public.content_calendar FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON public.scheduled_posts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON public.video_projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON public.websites FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON public.leads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON public.autopilot_campaigns FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON public.posts FOR ALL USING (true) WITH CHECK (true);
