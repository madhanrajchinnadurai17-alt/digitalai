import type { NextApiRequest, NextApiResponse } from 'next';
import Anthropic from '@anthropic-ai/sdk';
import { VideoProject, VideoTemplateArchetype, BusinessProfile } from '@/lib/types';
import { DEFAULT_VIDEO_PROJECTS } from '@/lib/mockData';
import { saveVideoProject } from '@/lib/supabase';

const anthropicApiKey = process.env.ANTHROPIC_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { profile, archetype = 'product_spotlight', promptText } = req.body as {
    profile: BusinessProfile;
    archetype: VideoTemplateArchetype;
    promptText?: string;
  };

  if (!profile || !profile.business_name) {
    return res.status(400).json({ error: 'Business profile is required' });
  }

  // If Anthropic Claude is available
  if (anthropicApiKey && anthropicApiKey.trim() !== '' && anthropicApiKey !== 'your_anthropic_api_key_here') {
    try {
      const anthropic = new Anthropic({ apiKey: anthropicApiKey });

      const systemPrompt = `You are MarkAI's vertical video creative director.
Generate a structured 12-second 3-scene vertical video project for format 9:16.
Archetype: ${archetype}.

Output format MUST be strictly a valid JSON object without markdown backticks:
{
  "title": "Punchy 4-word Video Title",
  "archetype": "${archetype}",
  "aspect_ratio": "9:16",
  "duration_total": 12,
  "audio_track": "Upbeat Lofi Kinetic Groove (120 BPM)",
  "scenes": [
    {
      "id": "s1",
      "duration_seconds": 4,
      "title_text": "ALL CAPS HOOK (3-4 words)",
      "subtitle_text": "Engaging benefit or context (6-8 words)",
      "bg_gradient": "linear-gradient(135deg, #7C3AED 0%, #D946EF 100%)",
      "badge_text": "${profile.business_name.toUpperCase().slice(0, 16)}",
      "zoom_effect": "in"
    },
    {
      "id": "s2",
      "duration_seconds": 4,
      "title_text": "KEY VALUE PROPOSITION",
      "subtitle_text": "Craft details or why customers love it",
      "bg_gradient": "linear-gradient(135deg, #F97316 0%, #EC4899 100%)",
      "badge_text": "PROVEN QUALITY",
      "zoom_effect": "out"
    },
    {
      "id": "s3",
      "duration_seconds": 4,
      "title_text": "TAP LINK IN BIO",
      "subtitle_text": "Order or explore today with fast delivery",
      "bg_gradient": "linear-gradient(135deg, #064E3B 0%, #10B981 100%)",
      "badge_text": "LIMITED BATCH",
      "zoom_effect": "pan"
    }
  ]
}`;

      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1500,
        temperature: 0.7,
        system: systemPrompt,
        messages: [{
          role: 'user',
          content: `Create a 9:16 vertical video storyboard for:
- Business: ${profile.business_name} (${profile.industry})
- Description: ${profile.description}
- Custom Focus: ${promptText || 'Flagship customer favorite'}
- Archetype: ${archetype}`
        }],
      });

      const contentBlock = response.content[0];
      if (contentBlock.type === 'text') {
        let raw = contentBlock.text.trim().replace(/^```(json)?\n?/, '').replace(/\n?```$/, '');
        const parsed = JSON.parse(raw);
        const project: VideoProject = {
          ...parsed,
          id: `vid_${Date.now()}`,
          created_at: new Date().toISOString()
        };
        await saveVideoProject(project);
        return res.status(200).json({ success: true, data: project });
      }
    } catch (e) {
      console.warn('Claude video generation fallback:', e);
    }
  }

  // Fallback preset
  const fallback = DEFAULT_VIDEO_PROJECTS[0];
  const newProj: VideoProject = {
    ...fallback,
    id: `vid_${Date.now()}`,
    title: `${profile.business_name} Video Reel`,
    archetype,
    created_at: new Date().toISOString()
  };
  await saveVideoProject(newProj);
  return res.status(200).json({ success: true, data: newProj });
}
