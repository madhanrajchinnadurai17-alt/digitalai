import type { NextApiRequest, NextApiResponse } from 'next';
import Anthropic from '@anthropic-ai/sdk';
import { BusinessProfile, GeneratedPost, PostFormat, BrandKit } from '@/lib/types';
import { generateFallbackPost } from '@/lib/mockData';

const anthropicApiKey = process.env.ANTHROPIC_API_KEY;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { 
    business_name, 
    industry, 
    description, 
    target_audience, 
    tone,
    format = 'single_image',
    brandKit,
    campaign_topic
  } = req.body as BusinessProfile & {
    format?: PostFormat;
    brandKit?: BrandKit;
    campaign_topic?: string;
  };

  if (!business_name || !industry || !description) {
    return res.status(400).json({ error: 'Missing required business profile fields' });
  }

  const profile: BusinessProfile = {
    business_name,
    industry,
    description,
    target_audience: target_audience || 'General audience',
    tone: tone || 'playful'
  };

  // If Anthropic API key is available, call Claude
  if (anthropicApiKey && anthropicApiKey.trim() !== '' && anthropicApiKey !== 'your_anthropic_api_key_here') {
    try {
      const anthropic = new Anthropic({
        apiKey: anthropicApiKey,
      });

      let formatSpecificSchema = '';
      if (format === 'carousel') {
        formatSpecificSchema = `,
  "carousel_slides": [
    {
      "slide_number": 1,
      "headline": "Slide 1 Hook / Headline",
      "body": "Curiosity hook text to encourage swiping",
      "visual_cue": "Description of layout and imagery for slide 1"
    },
    {
      "slide_number": 2,
      "headline": "01 / Step or Tip 1",
      "body": "Actionable explanation or benefit",
      "visual_cue": "Diagram, icon, or macro product detail"
    },
    {
      "slide_number": 3,
      "headline": "02 / Step or Tip 2",
      "body": "Insight or behind-the-scenes detail",
      "visual_cue": "Comparison or illustration"
    },
    {
      "slide_number": 4,
      "headline": "03 / Step or Tip 3",
      "body": "Core takeaway or solution",
      "visual_cue": "Key metric or customer transformation"
    },
    {
      "slide_number": 5,
      "headline": "Save This Post & Follow for More",
      "body": "Clear call to action with bio link instruction",
      "visual_cue": "Branded bookmark and share icons"
    }
  ]`;
      } else if (format === 'reels_script') {
        formatSpecificSchema = `,
  "reels_script": {
    "hook": "Spoken 3-second hook that stops viewers from scrolling",
    "duration": "15-30 seconds",
    "music_suggestion": "Suggested trending audio genre and tempo (e.g. Upbeat Lofi 120 BPM)",
    "scenes": [
      {
        "timestamp": "0:00 - 0:03",
        "visual_action": "Action taking place on camera (e.g. rapid zoom on product)",
        "spoken_audio": "Exact words spoken by creator/founder",
        "on_screen_text": "Bold text overlay in center"
      },
      {
        "timestamp": "0:04 - 0:10",
        "visual_action": "B-roll demonstration showing key benefit",
        "spoken_audio": "Voiceover explaining why this solves the problem",
        "on_screen_text": "Key takeaway keyword"
      },
      {
        "timestamp": "0:11 - 0:18",
        "visual_action": "Founder presenting finished product with natural smile",
        "spoken_audio": "Value proposition and why customers love it",
        "on_screen_text": "Crafted with passion ✨"
      },
      {
        "timestamp": "0:19 - 0:25",
        "visual_action": "Pointer gesture to bio link with seamless loop",
        "spoken_audio": "Call to action instruction",
        "on_screen_text": "LINK IN BIO 🚀"
      }
    ]
  }`;
      }

      const systemPrompt = `You are MarkAI, an expert social media strategist, copywriter, and creative director for small businesses.
Your task is to generate high-converting, authentic, engaging content tailored to the requested format: ${format}.

${brandKit?.brand_voice_guidelines ? `Brand Voice Guidelines: "${brandKit.brand_voice_guidelines}"` : ''}
${brandKit?.dos_list?.length ? `Mandatory Brand Do's: ${brandKit.dos_list.join(', ')}` : ''}
${brandKit?.donts_list?.length ? `Strict Brand Don'ts (Never do these): ${brandKit.donts_list.join(', ')}` : ''}

Output format MUST be strictly a valid JSON object without any markdown wrapping (no \`\`\`json or \`\`\`), matching this schema:
{
  "format": "${format}",
  "post_theme": "A punchy 4-8 word headline or campaign hook",
  "caption": "Compelling Instagram caption with emojis, line breaks, story value, and call to action",
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6", "#tag7"],
  "visual_idea": "Creative visual concept description",
  "best_time": "Optimal day and time window for engagement"${formatSpecificSchema}
}`;

      const userPrompt = `Generate a high-impact Instagram ${format.replace('_', ' ')} for:
- Business: ${profile.business_name}
- Industry: ${profile.industry}
- Description: ${profile.description}
- Target Audience: ${profile.target_audience}
- Tone: ${profile.tone}
${campaign_topic ? `- Campaign Occasion / Focus: ${campaign_topic}` : ''}

Strictly return JSON matching the schema.`;

      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1500,
        temperature: 0.7,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      });

      const contentBlock = response.content[0];
      if (contentBlock.type === 'text') {
        let rawText = contentBlock.text.trim();
        if (rawText.startsWith('```')) {
          rawText = rawText.replace(/^```(json)?\n?/, '').replace(/\n?```$/, '');
        }

        try {
          const parsed = JSON.parse(rawText) as GeneratedPost;
          return res.status(200).json({
            success: true,
            data: { ...parsed, format },
            source: 'anthropic-claude'
          });
        } catch (jsonErr) {
          console.error('Failed to parse Claude JSON response:', rawText, jsonErr);
        }
      }
    } catch (apiErr: any) {
      console.error('Anthropic API Error:', apiErr?.message || apiErr);
    }
  }

  // Smart Mock Fallback
  const fallback = generateFallbackPost(profile, format, brandKit);
  return res.status(200).json({
    success: true,
    data: fallback,
    source: 'demo-smart-generator'
  });
}
