import type { NextApiRequest, NextApiResponse } from 'next';
import Anthropic from '@anthropic-ai/sdk';
import { BusinessProfile, GeneratedPost } from '@/lib/types';
import { generateFallbackPost } from '@/lib/mockData';

const anthropicApiKey = process.env.ANTHROPIC_API_KEY;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { business_name, industry, description, target_audience, tone } = req.body as BusinessProfile;

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

      const systemPrompt = `You are MarkAI, an expert social media strategist and copywriter for small businesses.
Your task is to generate high-converting, authentic, engaging Instagram content based on a small business profile.

Output format MUST be strictly a valid JSON object without any markdown wrapping (no \`\`\`json or \`\`\`), with exactly these fields:
{
  "post_theme": "A punchy 4-8 word headline or campaign hook for graphic overlay",
  "caption": "A compelling 3-4 paragraph Instagram caption with appropriate emojis, line breaks, story hook, value proposition, and a clear call to action",
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6", "#tag7"],
  "visual_idea": "A 1-sentence creative visual concept description for the photo/graphic",
  "best_time": "The recommended day and time window for maximum engagement (e.g. Tuesday at 11:30 AM & Thursday at 6:00 PM)"
}`;

      const userPrompt = `Generate a high-impact Instagram post for this small business:
- Business Name: ${profile.business_name}
- Industry: ${profile.industry}
- Product/Service Description: ${profile.description}
- Target Audience: ${profile.target_audience}
- Desired Tone: ${profile.tone} (e.g., casual, formal, playful, bold, inspiring)

Make sure the caption is tailored to this tone and audience. Return strictly JSON.`;

      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        temperature: 0.7,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      });

      const contentBlock = response.content[0];
      if (contentBlock.type === 'text') {
        let rawText = contentBlock.text.trim();
        // Remove markdown backticks if present
        if (rawText.startsWith('```')) {
          rawText = rawText.replace(/^```(json)?\n?/, '').replace(/\n?```$/, '');
        }

        try {
          const parsed = JSON.parse(rawText) as GeneratedPost;
          return res.status(200).json({
            success: true,
            data: parsed,
            source: 'anthropic-claude'
          });
        } catch (jsonErr) {
          console.error('Failed to parse Claude JSON response:', rawText, jsonErr);
        }
      }
    } catch (apiErr: any) {
      console.error('Anthropic API Error:', apiErr?.message || apiErr);
      // Fallback gracefully so demo doesn't crash during presentation
    }
  }

  // Graceful Mock Fallback (if no API key provided or API error)
  const fallback = generateFallbackPost(profile);
  return res.status(200).json({
    success: true,
    data: fallback,
    source: 'demo-smart-generator',
    note: 'Generated using local smart generator (add ANTHROPIC_API_KEY for live Claude 3.5 Sonnet responses).'
  });
}
