import type { NextApiRequest, NextApiResponse } from 'next';
import Anthropic from '@anthropic-ai/sdk';
import { BusinessProfile, CalendarEvent, BrandKit } from '@/lib/types';
import { generate30DayCalendarPresets } from '@/lib/mockData';
import { saveCalendarEvents } from '@/lib/supabase';

const anthropicApiKey = process.env.ANTHROPIC_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { profile, brandKit, userId } = req.body as {
    profile: BusinessProfile;
    brandKit?: BrandKit;
    userId?: string;
  };

  if (!profile || !profile.business_name) {
    return res.status(400).json({ error: 'Missing business profile' });
  }

  // If Anthropic Claude API Key is configured, use Claude 3.5 Sonnet
  if (anthropicApiKey && anthropicApiKey.trim() !== '' && anthropicApiKey !== 'your_anthropic_api_key_here') {
    try {
      const anthropic = new Anthropic({ apiKey: anthropicApiKey });

      const systemPrompt = `You are MarkAI's expert social media campaign strategist.
Your task is to generate a structured 30-day festival-aware social media marketing calendar for a small business for September 2026.
Include major seasonal events, cultural moments, and business growth hooks (e.g., Fall Season Kickoff, Labor Day Weekend, Sept 9 Pitch Demo Day, Autumn Equinox, International Coffee Day, Customer Spotlight, Pro Tips).

Output format MUST be strictly a valid JSON array without any markdown backticks (no \`\`\`json or \`\`\`), with 8-12 high-impact events distributed throughout the month:
[
  {
    "id": "cal_2026_09_02_0",
    "date": "2026-09-02",
    "title": "Autumn Seasonal Reveal",
    "festival_occasion": "Fall Season Kickoff",
    "format": "carousel",
    "content_hook": "5 Autumn secrets you need to know this season 🍂",
    "hashtags": ["#FallLaunch", "#SmallBizVibes"],
    "best_time": "9:00 AM",
    "visual_concept": "Warm gradient product flatlay with fallen autumn leaves",
    "status": "suggested"
  }
]
Formats must strictly be one of: "single_image", "carousel", or "reels_script".`;

      const userPrompt = `Generate a 30-day marketing calendar for:
- Business: ${profile.business_name} (${profile.industry})
- Description: ${profile.description}
- Target Audience: ${profile.target_audience}
- Desired Tone: ${profile.tone}
${brandKit?.brand_voice_guidelines ? `- Brand Guidelines: ${brandKit.brand_voice_guidelines}` : ''}
${brandKit?.dos_list?.length ? `- Do's: ${brandKit.dos_list.join(', ')}` : ''}
${brandKit?.donts_list?.length ? `- Don'ts: ${brandKit.donts_list.join(', ')}` : ''}

Generate structured JSON array matching the schema.`;

      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        temperature: 0.7,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      });

      const contentBlock = response.content[0];
      if (contentBlock.type === 'text') {
        let raw = contentBlock.text.trim();
        if (raw.startsWith('```')) {
          raw = raw.replace(/^```(json)?\n?/, '').replace(/\n?```$/, '');
        }

        const events = JSON.parse(raw) as CalendarEvent[];
        if (Array.isArray(events) && events.length > 0) {
          await saveCalendarEvents(events, userId || 'demo-user');
          return res.status(200).json({
            success: true,
            data: events,
            source: 'anthropic-claude'
          });
        }
      }
    } catch (err) {
      console.warn('Claude calendar generation error, using fallback:', err);
    }
  }

  // Graceful smart festival calendar preset
  const presets = generate30DayCalendarPresets(profile);
  await saveCalendarEvents(presets, userId || 'demo-user');

  return res.status(200).json({
    success: true,
    data: presets,
    source: 'demo-festival-engine'
  });
}
