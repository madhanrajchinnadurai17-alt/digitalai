export type ToneType = 'casual' | 'formal' | 'playful' | 'bold' | 'inspiring';

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

export interface GeneratedPost {
  caption: string;
  hashtags: string[];
  visual_idea: string;
  best_time: string;
  post_theme: string;
}

export type PostStatus = 'Draft' | 'Posted' | 'Failed';

export interface PostRecord {
  id: string;
  user_id: string;
  business_name: string;
  industry?: string;
  caption: string;
  hashtags: string[];
  visual_idea: string;
  best_time: string;
  post_theme: string;
  image_data?: string; // base64 / data URL
  image_url?: string; // public URL if uploaded
  status: PostStatus;
  instagram_media_id?: string;
  error_message?: string;
  created_at: string;
  updated_at?: string;
}

export interface GraphicTheme {
  id: string;
  name: string;
  background: string; // CSS gradient or hex
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
