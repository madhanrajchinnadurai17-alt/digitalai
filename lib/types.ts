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
  // Multi-format extensions
  carousel_slides?: CarouselSlide[];
  reels_script?: ReelsScript;
}

export type PostStatus = 'Draft' | 'Posted' | 'Failed';

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
  image_data?: string; // base64 / data URL
  image_url?: string; // public URL if uploaded
  carousel_slides?: CarouselSlide[];
  reels_script?: ReelsScript;
  status: PostStatus;
  instagram_media_id?: string;
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
}

export interface CalendarEvent {
  id: string;
  user_id?: string;
  date: string; // YYYY-MM-DD
  title: string;
  festival_occasion?: string;
  format: PostFormat;
  content_hook: string;
  hashtags: string[];
  status: 'suggested' | 'scheduled' | 'published';
  best_time?: string;
  visual_concept?: string;
}
