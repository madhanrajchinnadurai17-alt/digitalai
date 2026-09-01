import type { NextApiRequest, NextApiResponse } from 'next';
import Anthropic from '@anthropic-ai/sdk';
import { WebsiteData, BusinessProfile, WebsiteTemplateType } from '@/lib/types';
import { DEFAULT_WEBSITE_DATA } from '@/lib/mockData';
import { saveWebsiteData } from '@/lib/supabase';

const anthropicApiKey = process.env.ANTHROPIC_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { profile, template_type = 'cafe' } = req.body as {
    profile: BusinessProfile;
    template_type: WebsiteTemplateType;
  };

  if (!profile || !profile.business_name) {
    return res.status(400).json({ error: 'Business profile is required' });
  }

  const slug = profile.business_name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

  // If Anthropic Claude API Key is available
  if (anthropicApiKey && anthropicApiKey.trim() !== '' && anthropicApiKey !== 'your_anthropic_api_key_here') {
    try {
      const anthropic = new Anthropic({ apiKey: anthropicApiKey });

      const systemPrompt = `You are MarkAI's AI Web Architect.
Generate a structured, high-converting one-page website data object for a small business.

Output format MUST be strictly a valid JSON object without markdown backticks:
{
  "slug": "${slug}",
  "business_name": "${profile.business_name}",
  "industry": "${profile.industry}",
  "template_type": "${template_type}",
  "primary_color": "#7C3AED",
  "secondary_color": "#F59E0B",
  "hero": {
    "headline": "Compelling 6-8 word hero headline",
    "tagline": "2-sentence inspiring value proposition",
    "cta_button_text": "Explore Offerings"
  },
  "about": {
    "title": "About Our Story & Craft",
    "story": "A warm, compelling 3-4 sentence founder story explaining origin, ethical standards, and community dedication.",
    "bullet_points": [
      "Key differentiator 1",
      "Key differentiator 2",
      "Key differentiator 3",
      "Key differentiator 4"
    ]
  },
  "offerings": [
    { "id": "1", "name": "Flagship Offering 1", "price": "$12.00", "description": "Crisp benefit-driven item description.", "badge": "Bestseller" },
    { "id": "2", "name": "Popular Offering 2", "price": "$18.00", "description": "Customer favorite offering description.", "badge": "Popular" },
    { "id": "3", "name": "Specialty Item 3", "price": "$24.00", "description": "Unique selling proposition item." },
    { "id": "4", "name": "Signature Item 4", "price": "$30.00", "description": "Premium tier item description." }
  ],
  "testimonials": [
    { "name": "Customer Name", "role": "Loyal Customer", "comment": "Genuinely transformed my daily routine!", "rating": 5 },
    { "name": "Local Resident", "role": "Verified Buyer", "comment": "The quality and care here are unmatched anywhere else.", "rating": 5 }
  ],
  "contact_email": "contact@${slug}.com",
  "contact_phone": "+1 (555) 349-2810",
  "address": "124 Main Street, Downtown Arts District",
  "hours": "Mon - Fri: 8:00 AM - 6:00 PM | Sat - Sun: 9:00 AM - 5:00 PM"
}`;

      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        temperature: 0.7,
        system: systemPrompt,
        messages: [{
          role: 'user',
          content: `Generate one-page website data for:
- Business: ${profile.business_name} (${profile.industry})
- Description: ${profile.description}
- Target Audience: ${profile.target_audience}
- Tone: ${profile.tone}
- Template: ${template_type}`
        }],
      });

      const contentBlock = response.content[0];
      if (contentBlock.type === 'text') {
        let raw = contentBlock.text.trim().replace(/^```(json)?\n?/, '').replace(/\n?```$/, '');
        const parsed = JSON.parse(raw);
        const siteData: WebsiteData = {
          ...parsed,
          id: `site_${slug}`,
          published: true,
          published_url: `https://${slug}.markai.site`,
          created_at: new Date().toISOString()
        };
        await saveWebsiteData(siteData);
        return res.status(200).json({ success: true, data: siteData });
      }
    } catch (e) {
      console.warn('Claude website generation fallback:', e);
    }
  }

  // Fallback
  const siteData: WebsiteData = {
    ...DEFAULT_WEBSITE_DATA,
    slug,
    business_name: profile.business_name,
    industry: profile.industry,
    template_type,
    published: true,
    published_url: `https://${slug}.markai.site`,
    created_at: new Date().toISOString()
  };
  await saveWebsiteData(siteData);
  return res.status(200).json({ success: true, data: siteData });
}
