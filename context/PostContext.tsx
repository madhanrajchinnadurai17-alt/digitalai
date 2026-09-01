import React, { createContext, useContext, useState, useEffect } from 'react';
import { BusinessProfile, GeneratedPost, GraphicTheme, SocialPostResponse, PostRecord } from '@/lib/types';
import { GRAPHIC_THEMES, DEMO_PRESET_PROFILES } from '@/lib/mockData';
import { savePostToDatabase, updatePostStatus, getUserProfile, saveUserProfile } from '@/lib/supabase';
import { useAuth } from './AuthContext';

interface PostContextType {
  currentProfile: BusinessProfile;
  setCurrentProfile: React.Dispatch<React.SetStateAction<BusinessProfile>>;
  generatedPost: GeneratedPost | null;
  setGeneratedPost: React.Dispatch<React.SetStateAction<GeneratedPost | null>>;
  currentTheme: GraphicTheme;
  setCurrentTheme: (theme: GraphicTheme) => void;
  isGenerating: boolean;
  isPosting: boolean;
  currentPostRecord: PostRecord | null;
  generatePost: (profile: BusinessProfile) => Promise<GeneratedPost>;
  publishToInstagram: (caption: string, imageData?: string) => Promise<SocialPostResponse>;
  saveAsDraft: (caption: string, imageData?: string) => Promise<PostRecord>;
}

const defaultProfile: BusinessProfile = DEMO_PRESET_PROFILES[0].profile;

const PostContext = createContext<PostContextType | undefined>(undefined);

export function PostProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [currentProfile, setCurrentProfile] = useState<BusinessProfile>(defaultProfile);
  const [generatedPost, setGeneratedPost] = useState<GeneratedPost | null>(null);
  const [currentTheme, setCurrentTheme] = useState<GraphicTheme>(GRAPHIC_THEMES[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [currentPostRecord, setCurrentPostRecord] = useState<PostRecord | null>(null);

  // Load user's saved profile if available
  useEffect(() => {
    async function loadProfile() {
      if (user?.uid) {
        const saved = await getUserProfile(user.uid);
        if (saved) {
          setCurrentProfile(saved);
        }
      }
    }
    loadProfile();
  }, [user?.uid]);

  const generatePost = async (profile: BusinessProfile): Promise<GeneratedPost> => {
    setIsGenerating(true);
    try {
      // Save profile to database
      if (user?.uid) {
        await saveUserProfile({ ...profile, user_id: user.uid });
      }

      const res = await fetch('/api/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      const data = await res.json();
      if (!res.ok || !data.data) {
        throw new Error(data.error || 'Failed to generate post');
      }

      const gen = data.data as GeneratedPost;
      setGeneratedPost(gen);

      // Create draft record in Supabase / Local storage
      const draftRecord = await savePostToDatabase({
        user_id: user?.uid || 'demo-user',
        business_name: profile.business_name,
        industry: profile.industry,
        caption: `${gen.caption}\n\n${gen.hashtags.join(' ')}`,
        hashtags: gen.hashtags,
        visual_idea: gen.visual_idea,
        best_time: gen.best_time,
        post_theme: gen.post_theme,
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
      caption,
      hashtags: generatedPost?.hashtags || [],
      visual_idea: generatedPost?.visual_idea || '',
      best_time: generatedPost?.best_time || '',
      post_theme: generatedPost?.post_theme || '',
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
        generatedPost,
        setGeneratedPost,
        currentTheme,
        setCurrentTheme,
        isGenerating,
        isPosting,
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
