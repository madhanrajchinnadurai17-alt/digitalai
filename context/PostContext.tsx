import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  BusinessProfile, 
  GeneratedPost, 
  GraphicTheme, 
  SocialPostResponse, 
  PostRecord, 
  BrandKit, 
  CalendarEvent, 
  PostFormat 
} from '@/lib/types';
import { GRAPHIC_THEMES, DEMO_PRESET_PROFILES, DEFAULT_BRAND_KIT } from '@/lib/mockData';
import { 
  savePostToDatabase, 
  getUserProfile, 
  saveUserProfile, 
  getBrandKit, 
  saveBrandKit, 
  getCalendarEvents, 
  saveCalendarEvents 
} from '@/lib/supabase';
import { useAuth } from './AuthContext';

interface PostContextType {
  currentProfile: BusinessProfile;
  setCurrentProfile: React.Dispatch<React.SetStateAction<BusinessProfile>>;
  brandKit: BrandKit;
  setBrandKit: React.Dispatch<React.SetStateAction<BrandKit>>;
  saveCurrentBrandKit: (kit: BrandKit) => Promise<BrandKit>;
  calendarEvents: CalendarEvent[];
  refreshCalendar: () => Promise<CalendarEvent[]>;
  generateAICalendar: () => Promise<CalendarEvent[]>;
  selectedFormat: PostFormat;
  setSelectedFormat: (format: PostFormat) => void;
  generatedPost: GeneratedPost | null;
  setGeneratedPost: React.Dispatch<React.SetStateAction<GeneratedPost | null>>;
  currentTheme: GraphicTheme;
  setCurrentTheme: (theme: GraphicTheme) => void;
  isGenerating: boolean;
  isPosting: boolean;
  isGeneratingCalendar: boolean;
  currentPostRecord: PostRecord | null;
  generatePost: (profile: BusinessProfile, format?: PostFormat, campaignTopic?: string) => Promise<GeneratedPost>;
  publishToInstagram: (caption: string, imageData?: string) => Promise<SocialPostResponse>;
  saveAsDraft: (caption: string, imageData?: string) => Promise<PostRecord>;
}

const defaultProfile: BusinessProfile = DEMO_PRESET_PROFILES[0].profile;
const defaultKit: BrandKit = DEMO_PRESET_PROFILES[0].brandKit || DEFAULT_BRAND_KIT;

const PostContext = createContext<PostContextType | undefined>(undefined);

export function PostProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [currentProfile, setCurrentProfile] = useState<BusinessProfile>(defaultProfile);
  const [brandKit, setBrandKit] = useState<BrandKit>(defaultKit);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<PostFormat>('single_image');
  const [generatedPost, setGeneratedPost] = useState<GeneratedPost | null>(null);
  const [currentTheme, setCurrentTheme] = useState<GraphicTheme>(GRAPHIC_THEMES[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [isGeneratingCalendar, setIsGeneratingCalendar] = useState(false);
  const [currentPostRecord, setCurrentPostRecord] = useState<PostRecord | null>(null);

  // Load user's saved profile, brand kit & calendar
  useEffect(() => {
    async function loadData() {
      const uid = user?.uid || 'demo-user';
      try {
        const [savedProfile, savedKit, savedEvents] = await Promise.all([
          getUserProfile(uid),
          getBrandKit(uid),
          getCalendarEvents(uid, currentProfile)
        ]);

        if (savedProfile) setCurrentProfile(savedProfile);
        if (savedKit) setBrandKit(savedKit);
        if (savedEvents) setCalendarEvents(savedEvents);
      } catch (err) {
        console.warn('Initial data load error:', err);
      }
    }
    loadData();
  }, [user?.uid]);

  const saveCurrentBrandKit = async (kit: BrandKit): Promise<BrandKit> => {
    const saved = await saveBrandKit({ ...kit, user_id: user?.uid || 'demo-user' });
    setBrandKit(saved);
    return saved;
  };

  const refreshCalendar = async (): Promise<CalendarEvent[]> => {
    const events = await getCalendarEvents(user?.uid || 'demo-user', currentProfile);
    setCalendarEvents(events);
    return events;
  };

  const generateAICalendar = async (): Promise<CalendarEvent[]> => {
    setIsGeneratingCalendar(true);
    try {
      const res = await fetch('/api/generate-calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: currentProfile,
          brandKit,
          userId: user?.uid || 'demo-user',
        }),
      });

      const json = await res.json();
      if (json.data) {
        setCalendarEvents(json.data);
        return json.data;
      }
      return calendarEvents;
    } finally {
      setIsGeneratingCalendar(false);
    }
  };

  const generatePost = async (
    profile: BusinessProfile,
    format: PostFormat = selectedFormat,
    campaignTopic?: string
  ): Promise<GeneratedPost> => {
    setIsGenerating(true);
    try {
      if (user?.uid) {
        await saveUserProfile({ ...profile, user_id: user.uid });
      }

      const res = await fetch('/api/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profile,
          format,
          brandKit,
          campaign_topic: campaignTopic,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.data) {
        throw new Error(data.error || 'Failed to generate post');
      }

      const gen = data.data as GeneratedPost;
      setGeneratedPost(gen);
      setSelectedFormat(format);

      // Create draft record in Supabase / Local storage
      const draftRecord = await savePostToDatabase({
        user_id: user?.uid || 'demo-user',
        business_name: profile.business_name,
        industry: profile.industry,
        format,
        caption: `${gen.caption}\n\n${gen.hashtags.join(' ')}`,
        hashtags: gen.hashtags,
        visual_idea: gen.visual_idea,
        best_time: gen.best_time,
        post_theme: gen.post_theme,
        carousel_slides: gen.carousel_slides,
        reels_script: gen.reels_script,
        status: 'Draft',
      });
      setCurrentPostRecord(draftRecord);

      return gen;
    } finally {
      setIsGenerating(false);
    }
  };

  const publishToInstagram = async (caption: string, imageData?: string): Promise<SocialPostResponse> => {
    setIsPosting(true);
    try {
      const postId = currentPostRecord?.id;
      const res = await fetch('/api/post-instagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          caption,
          imageData,
          businessName: currentProfile.business_name,
        }),
      });

      const result: SocialPostResponse = await res.json();

      if (result.success && currentPostRecord) {
        setCurrentPostRecord({
          ...currentPostRecord,
          caption,
          image_data: imageData || currentPostRecord.image_data,
          status: 'Posted',
          instagram_media_id: result.media_id,
        });
      }

      return result;
    } finally {
      setIsPosting(false);
    }
  };

  const saveAsDraft = async (caption: string, imageData?: string): Promise<PostRecord> => {
    const postToSave = {
      id: currentPostRecord?.id,
      user_id: user?.uid || 'demo-user',
      business_name: currentProfile.business_name,
      industry: currentProfile.industry,
      format: selectedFormat,
      caption,
      hashtags: generatedPost?.hashtags || [],
      visual_idea: generatedPost?.visual_idea || '',
      best_time: generatedPost?.best_time || '',
      post_theme: generatedPost?.post_theme || '',
      carousel_slides: generatedPost?.carousel_slides,
      reels_script: generatedPost?.reels_script,
      image_data: imageData || currentPostRecord?.image_data,
      status: 'Draft' as const,
    };

    const saved = await savePostToDatabase(postToSave);
    setCurrentPostRecord(saved);
    return saved;
  };

  return (
    <PostContext.Provider
      value={{
        currentProfile,
        setCurrentProfile,
        brandKit,
        setBrandKit,
        saveCurrentBrandKit,
        calendarEvents,
        refreshCalendar,
        generateAICalendar,
        selectedFormat,
        setSelectedFormat,
        generatedPost,
        setGeneratedPost,
        currentTheme,
        setCurrentTheme,
        isGenerating,
        isPosting,
        isGeneratingCalendar,
        currentPostRecord,
        generatePost,
        publishToInstagram,
        saveAsDraft,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}

export function usePost() {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePost must be used within a PostProvider');
  }
  return context;
}
