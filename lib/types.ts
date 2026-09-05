export type ToneType = 'casual' | 'formal' | 'playful' | 'bold' | 'inspiring';

export type PostFormat = 'single_image' | 'carousel' | 'reels_script';

export interface BusinessProfile {
  id?: string;
  user_id?: string;
  business_name: string;
  industry: string;
  description: string;
  target_audience: string;
  tone: ToneType;
  created_at?: string;
  updated_at?: string;
}

export interface BrandKit {
  id?: string;
  user_id?: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  font_heading: string;
  font_body: string;
  logo_badge_text: string;
  brand_voice_guidelines: string;
  dos_list: string[];
  donts_list: string[];
  updated_at?: string;
}

export interface CarouselSlide {
  slide_number: number;
  headline: string;
  body: string;
  visual_cue: string;
}

export interface ReelsScene {
  timestamp: string;
  visual_action: string;
  spoken_audio: string;
  on_screen_text: string;
}

export interface ReelsScript {
  hook: string;
  duration: string;
  scenes: ReelsScene[];
  music_suggestion: string;
}

export interface GeneratedPost {
  format?: PostFormat;
  caption: string;
  hashtags: string[];
  visual_idea: string;
  best_time: string;
  post_theme: string;
  carousel_slides?: CarouselSlide[];
  reels_script?: ReelsScript;
}

export type PostStatus = 'Draft' | 'Posted' | 'Scheduled' | 'Failed';

export interface PostRecord {
  id: string;
  user_id: string;
  business_name: string;
  industry?: string;
  format?: PostFormat;
  caption: string;
  hashtags: string[];
  visual_idea: string;
  best_time: string;
  post_theme: string;
  image_data?: string;
  image_url?: string;
  carousel_slides?: CarouselSlide[];
  reels_script?: ReelsScript;
  status: PostStatus;
  instagram_media_id?: string;
  published_platforms?: SocialPlatform[];
  scheduled_for?: string;
  error_message?: string;
  created_at: string;
  updated_at?: string;
}

export interface GraphicTheme {
  id: string;
  name: string;
  background: string;
  gradientStart: string;
  gradientEnd: string;
  textColor: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
}

export interface SocialPostResponse {
  success: boolean;
  media_id?: string;
  error?: string;
  simulated?: boolean;
  published_at?: string;
  platforms?: { [key in SocialPlatform]?: { success: boolean; id?: string; error?: string } };
}

export interface CalendarEvent {
  id: string;
  user_id?: string;
  date: string;
  title: string;
  festival_occasion?: string;
  format: PostFormat;
  content_hook: string;
  hashtags: string[];
  status: 'suggested' | 'scheduled' | 'published';
  best_time?: string;
  visual_concept?: string;
}

// ==========================================
// PHASE 3: MULTI-PLATFORM & SCHEDULING TYPES
// ==========================================
export type SocialPlatform = 'instagram' | 'facebook' | 'linkedin' | 'twitter';

export interface ConnectedPlatformAccount {
  platform: SocialPlatform;
  connected: boolean;
  account_name: string;
  account_handle: string;
  avatar_url?: string;
  permissions: string[];
  last_synced?: string;
}

export interface ScheduledPostRecord {
  id: string;
  user_id: string;
  post_id?: string;
  business_name: string;
  caption: string;
  platforms: SocialPlatform[];
  scheduled_timestamp: string; // ISO string
  status: 'pending' | 'publishing' | 'published' | 'failed';
  image_data?: string;
  created_at: string;
  error_message?: string;
}

export interface AnalyticsMetricSummary {
  total_reach: number;
  total_impressions: number;
  avg_engagement_rate: number;
  total_likes: number;
  total_comments: number;
  total_shares: number;
  follower_growth: number;
  platform_breakdown: {
    instagram: { reach: number; engagement: number; posts: number };
    facebook: { reach: number; engagement: number; posts: number };
    linkedin: { reach: number; engagement: number; posts: number };
    twitter: { reach: number; engagement: number; posts: number };
  };
  top_performing_posts: {
    title: string;
    format: PostFormat;
    platform: SocialPlatform;
    reach: number;
    engagement: number;
  }[];
}

// ==========================================
// PHASE 4: PROGRAMMATIC VIDEO STUDIO TYPES
// ==========================================
export type VideoTemplateArchetype = 
  | 'product_spotlight' 
  | 'customer_testimonial' 
  | 'quick_tips' 
  | 'flash_sale';

export interface VideoSlideScene {
  id: string;
  duration_seconds: number;
  title_text: string;
  subtitle_text: string;
  bg_gradient: string;
  badge_text: string;
  zoom_effect: 'in' | 'out' | 'pan';
}

export interface VideoProject {
  id: string;
  user_id?: string;
  title: string;
  archetype: VideoTemplateArchetype;
  aspect_ratio: '9:16' | '1:1';
  duration_total: number;
  audio_track: string;
  scenes: VideoSlideScene[];
  created_at: string;
}

// ==========================================
// GUIDED VIDEO CREATOR TYPES (GEMINI MULTIMODAL)
// ==========================================
export type GuidedVideoTemplate = 'product_spotlight' | 'before_after' | 'bts_story';

export interface ShotFeedback {
  matches: boolean;
  score: number; // 1-100
  feedback: string;
  tip: string;
}

export interface GuidedShot {
  shot_number: number;
  title: string;
  instruction: string;
  camera_angle: string;
  lighting_tip: string;
  duration_seconds: number;
  voiceover_script: string;
  uploaded_image?: string;
  ai_feedback?: ShotFeedback;
  status: 'pending' | 'uploading' | 'analyzing' | 'approved';
}

export interface GuidedVideoProject {
  id: string;
  user_id?: string;
  title: string;
  template: GuidedVideoTemplate;
  music_track: string;
  shots: GuidedShot[];
  assembled_at?: string;
  created_at: string;
}

// ==========================================
// PHASE 5: AI ONE-PAGE WEBSITE BUILDER TYPES
// ==========================================
export type WebsiteTemplateType = 'cafe' | 'retail' | 'services' | 'fitness';

export interface WebsiteSectionHero {
  headline: string;
  tagline: string;
  cta_button_text: string;
  hero_image_url?: string;
}

export interface WebsiteSectionAbout {
  title: string;
  story: string;
  bullet_points: string[];
}

export interface WebsiteProductItem {
  id: string;
  name: string;
  price: string;
  description: string;
  badge?: string;
}

export interface WebsiteTestimonial {
  name: string;
  role: string;
  comment: string;
  rating: number;
}

export interface WebsiteData {
  id: string;
  slug: string;
  business_name: string;
  industry: string;
  template_type: WebsiteTemplateType;
  primary_color: string;
  secondary_color: string;
  hero: WebsiteSectionHero;
  about: WebsiteSectionAbout;
  offerings: WebsiteProductItem[];
  testimonials: WebsiteTestimonial[];
  contact_email: string;
  contact_phone: string;
  address: string;
  hours: string;
  published: boolean;
  published_url: string;
  created_at: string;
}

export interface LeadInquiry {
  id: string;
  site_slug: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  created_at: string;
}

// ==========================================
// PHASE 6: AUTONOMOUS MARKETING AGENT TYPES
// ==========================================
export interface StrategyRecommendation {
  id: string;
  category: 'format' | 'timing' | 'topic' | 'growth';
  title: string;
  insight: string;
  action_item: string;
  expected_impact: string;
  impact_score: number; // 1-100
}

export interface AutopilotCampaign {
  id: string;
  name: string;
  month: string;
  total_posts_planned: number;
  platforms_targeted: SocialPlatform[];
  status: 'active' | 'generating' | 'completed';
  generated_posts_count: number;
  scheduled_posts_count: number;
  weekly_digest_summary?: string;
  created_at: string;
}
