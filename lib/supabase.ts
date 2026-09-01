import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
  BusinessProfile, 
  PostRecord, 
  BrandKit, 
  CalendarEvent,
  ConnectedPlatformAccount,
  ScheduledPostRecord,
  AnalyticsMetricSummary,
  VideoProject,
  WebsiteData,
  LeadInquiry,
  StrategyRecommendation,
  AutopilotCampaign,
  SocialPlatform
} from './types';
import { 
  DEFAULT_BRAND_KIT, 
  generate30DayCalendarPresets, 
  DEMO_PRESET_PROFILES,
  DEFAULT_CONNECTED_PLATFORMS,
  DEFAULT_ANALYTICS_DATA,
  DEFAULT_SCHEDULED_POSTS,
  DEFAULT_VIDEO_PROJECTS,
  DEFAULT_WEBSITE_DATA,
  DEFAULT_STRATEGY_RECOMMENDATIONS,
  DEFAULT_AUTOPILOT_CAMPAIGN
} from './mockData';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('http')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local storage keys
const LOCAL_STORAGE_POSTS_KEY = 'markai_demo_posts';
const LOCAL_STORAGE_PROFILE_KEY = 'markai_demo_profile';
const LOCAL_STORAGE_BRAND_KIT_KEY = 'markai_demo_brand_kit';
const LOCAL_STORAGE_CALENDAR_KEY = 'markai_demo_calendar_events';
const LOCAL_STORAGE_PLATFORMS_KEY = 'markai_demo_connected_platforms';
const LOCAL_STORAGE_SCHEDULED_KEY = 'markai_demo_scheduled_posts';
const LOCAL_STORAGE_VIDEOS_KEY = 'markai_demo_video_projects';
const LOCAL_STORAGE_WEBSITE_KEY = 'markai_demo_website_data';
const LOCAL_STORAGE_LEADS_KEY = 'markai_demo_leads';
const LOCAL_STORAGE_STRATEGY_KEY = 'markai_demo_strategy';
const LOCAL_STORAGE_AUTOPILOT_KEY = 'markai_demo_autopilot';

// ==========================================
// POSTS & PROFILE HELPERS
// ==========================================
export async function fetchPostHistory(userId: string = 'demo-user'): Promise<PostRecord[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) return data as PostRecord[];
    } catch (err) {
      console.warn('Supabase fetch error:', err);
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_POSTS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
  }
  return [];
}

export async function savePostToDatabase(post: Omit<PostRecord, 'id' | 'created_at'> & { id?: string }): Promise<PostRecord> {
  const newRecord: PostRecord = {
    id: post.id || `post_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    user_id: post.user_id || 'demo-user',
    business_name: post.business_name,
    industry: post.industry || '',
    format: post.format || 'single_image',
    caption: post.caption,
    hashtags: post.hashtags || [],
    visual_idea: post.visual_idea || '',
    best_time: post.best_time || '',
    post_theme: post.post_theme || '',
    image_data: post.image_data,
    image_url: post.image_url,
    carousel_slides: post.carousel_slides,
    reels_script: post.reels_script,
    status: post.status || 'Draft',
    instagram_media_id: post.instagram_media_id,
    published_platforms: post.published_platforms || ['instagram'],
    scheduled_for: post.scheduled_for,
    error_message: post.error_message,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .upsert(newRecord)
        .select()
        .single();
      if (!error && data) return data as PostRecord;
    } catch (err) {
      console.warn('Supabase save error:', err);
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const current = await fetchPostHistory(post.user_id);
      const existingIdx = current.findIndex(p => p.id === newRecord.id);
      let updated: PostRecord[];
      if (existingIdx >= 0) {
        updated = [...current];
        updated[existingIdx] = newRecord;
      } else {
        updated = [newRecord, ...current];
      }
      localStorage.setItem(LOCAL_STORAGE_POSTS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  }
  return newRecord;
}

export async function updatePostStatus(
  postId: string, 
  status: 'Draft' | 'Posted' | 'Scheduled' | 'Failed', 
  instagramMediaId?: string,
  errorMessage?: string
): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase
        .from('posts')
        .update({
          status,
          instagram_media_id: instagramMediaId,
          error_message: errorMessage,
          updated_at: new Date().toISOString(),
        })
        .eq('id', postId);

      if (!error) return true;
    } catch (err) {
      console.warn('Supabase update status exception:', err);
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_POSTS_KEY);
      if (stored) {
        const posts: PostRecord[] = JSON.parse(stored);
        const idx = posts.findIndex(p => p.id === postId);
        if (idx >= 0) {
          posts[idx].status = status;
          if (instagramMediaId) posts[idx].instagram_media_id = instagramMediaId;
          if (errorMessage) posts[idx].error_message = errorMessage;
          posts[idx].updated_at = new Date().toISOString();
          localStorage.setItem(LOCAL_STORAGE_POSTS_KEY, JSON.stringify(posts));
          return true;
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
  return false;
}

export async function saveUserProfile(profile: BusinessProfile): Promise<void> {
  if (supabase) {
    try {
      await supabase.from('business_profiles').upsert({
        ...profile,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Supabase profile save error:', err);
    }
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(profile));
  }
}

export async function getUserProfile(userId: string = 'demo-user'): Promise<BusinessProfile | null> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      if (!error && data) return data as BusinessProfile;
    } catch (err) {
      console.warn('Supabase profile get error:', err);
    }
  }

  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
    if (stored) return JSON.parse(stored);
  }
  return null;
}

// ==========================================
// BRAND KIT & CALENDAR HELPERS
// ==========================================
export async function getBrandKit(userId: string = 'demo-user'): Promise<BrandKit> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('brand_kits').select('*').eq('user_id', userId).single();
      if (!error && data) return data as BrandKit;
    } catch (err) {
      console.warn('Supabase brand kit get error:', err);
    }
  }

  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(LOCAL_STORAGE_BRAND_KIT_KEY);
    if (stored) return JSON.parse(stored);
  }
  return DEFAULT_BRAND_KIT;
}

export async function saveBrandKit(brandKit: BrandKit): Promise<BrandKit> {
  const record: BrandKit = {
    ...brandKit,
    user_id: brandKit.user_id || 'demo-user',
    updated_at: new Date().toISOString()
  };

  if (supabase) {
    try {
      await supabase.from('brand_kits').upsert(record);
    } catch (err) {
      console.warn('Supabase brand kit save error:', err);
    }
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_BRAND_KIT_KEY, JSON.stringify(record));
  }
  return record;
}

export async function getCalendarEvents(userId: string = 'demo-user', profile?: BusinessProfile): Promise<CalendarEvent[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('content_calendar').select('*').eq('user_id', userId).order('date', { ascending: true });
      if (!error && data && data.length > 0) return data as CalendarEvent[];
    } catch (err) {
      console.warn('Supabase calendar get error:', err);
    }
  }

  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(LOCAL_STORAGE_CALENDAR_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.length > 0) return parsed;
    }
  }

  const presets = generate30DayCalendarPresets(profile || DEMO_PRESET_PROFILES[0].profile);
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_CALENDAR_KEY, JSON.stringify(presets));
  }
  return presets;
}

export async function saveCalendarEvents(events: CalendarEvent[], userId: string = 'demo-user'): Promise<void> {
  if (supabase) {
    try {
      const payload = events.map(e => ({ ...e, user_id: userId }));
      await supabase.from('content_calendar').upsert(payload);
    } catch (err) {
      console.warn('Supabase calendar save error:', err);
    }
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_CALENDAR_KEY, JSON.stringify(events));
  }
}

// ==========================================
// PHASE 3: PLATFORMS & SCHEDULING HELPERS
// ==========================================
export async function getConnectedPlatforms(userId: string = 'demo-user'): Promise<ConnectedPlatformAccount[]> {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(LOCAL_STORAGE_PLATFORMS_KEY);
    if (stored) return JSON.parse(stored);
  }
  return DEFAULT_CONNECTED_PLATFORMS;
}

export async function togglePlatformConnection(platform: SocialPlatform, status: boolean): Promise<ConnectedPlatformAccount[]> {
  const current = await getConnectedPlatforms();
  const updated = current.map(p => p.platform === platform ? { ...p, connected: status, last_synced: 'Just now' } : p);
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_PLATFORMS_KEY, JSON.stringify(updated));
  }
  return updated;
}

export async function getScheduledPosts(userId: string = 'demo-user'): Promise<ScheduledPostRecord[]> {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(LOCAL_STORAGE_SCHEDULED_KEY);
    if (stored) return JSON.parse(stored);
  }
  return DEFAULT_SCHEDULED_POSTS;
}

export async function saveScheduledPost(post: Omit<ScheduledPostRecord, 'id' | 'created_at'>): Promise<ScheduledPostRecord> {
  const record: ScheduledPostRecord = {
    ...post,
    id: `sched_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    created_at: new Date().toISOString()
  };
  const current = await getScheduledPosts(post.user_id);
  const updated = [record, ...current];
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_SCHEDULED_KEY, JSON.stringify(updated));
  }
  return record;
}

export async function getAnalyticsSummary(): Promise<AnalyticsMetricSummary> {
  return DEFAULT_ANALYTICS_DATA;
}

// ==========================================
// PHASE 4: VIDEO STUDIO HELPERS
// ==========================================
export async function getVideoProjects(): Promise<VideoProject[]> {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(LOCAL_STORAGE_VIDEOS_KEY);
    if (stored) return JSON.parse(stored);
  }
  return DEFAULT_VIDEO_PROJECTS;
}

export async function saveVideoProject(project: VideoProject): Promise<VideoProject> {
  const current = await getVideoProjects();
  const existingIdx = current.findIndex(p => p.id === project.id);
  let updated: VideoProject[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = project;
  } else {
    updated = [project, ...current];
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_VIDEOS_KEY, JSON.stringify(updated));
  }
  return project;
}

// ==========================================
// PHASE 5: AI ONE-PAGE WEBSITE & LEADS HELPERS
// ==========================================
export async function getWebsiteData(slug: string = 'brew-and-bean'): Promise<WebsiteData> {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(`${LOCAL_STORAGE_WEBSITE_KEY}_${slug}`);
    if (stored) return JSON.parse(stored);
  }
  return DEFAULT_WEBSITE_DATA;
}

export async function saveWebsiteData(site: WebsiteData): Promise<WebsiteData> {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`${LOCAL_STORAGE_WEBSITE_KEY}_${site.slug}`, JSON.stringify(site));
  }
  return site;
}

export async function submitLeadInquiry(lead: Omit<LeadInquiry, 'id' | 'created_at'>): Promise<LeadInquiry> {
  const record: LeadInquiry = {
    ...lead,
    id: `lead_${Date.now()}`,
    created_at: new Date().toISOString()
  };
  let current: LeadInquiry[] = [];
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(LOCAL_STORAGE_LEADS_KEY);
    if (stored) current = JSON.parse(stored);
    current = [record, ...current];
    localStorage.setItem(LOCAL_STORAGE_LEADS_KEY, JSON.stringify(current));
  }
  return record;
}

export async function getLeadInquiries(): Promise<LeadInquiry[]> {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(LOCAL_STORAGE_LEADS_KEY);
    if (stored) return JSON.parse(stored);
  }
  return [];
}

// ==========================================
// PHASE 6: AUTONOMOUS CMO AGENT HELPERS
// ==========================================
export async function getStrategyRecommendations(): Promise<StrategyRecommendation[]> {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(LOCAL_STORAGE_STRATEGY_KEY);
    if (stored) return JSON.parse(stored);
  }
  return DEFAULT_STRATEGY_RECOMMENDATIONS;
}

export async function getAutopilotCampaign(): Promise<AutopilotCampaign> {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(LOCAL_STORAGE_AUTOPILOT_KEY);
    if (stored) return JSON.parse(stored);
  }
  return DEFAULT_AUTOPILOT_CAMPAIGN;
}

export async function triggerAutopilotLaunch(campaign: Partial<AutopilotCampaign>): Promise<AutopilotCampaign> {
  const updated: AutopilotCampaign = {
    ...DEFAULT_AUTOPILOT_CAMPAIGN,
    ...campaign,
    status: 'active',
    created_at: new Date().toISOString()
  };
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_AUTOPILOT_KEY, JSON.stringify(updated));
  }
  return updated;
}
