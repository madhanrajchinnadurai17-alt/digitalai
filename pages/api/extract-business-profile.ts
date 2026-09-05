import type { NextApiRequest, NextApiResponse } from 'next';
import Anthropic from '@anthropic-ai/sdk';
import { BusinessProfile, ToneType } from '@/lib/types';

const anthropicApiKey = process.env.ANTHROPIC_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { transcript } = req.body;

  if (!transcript || typeof transcript !== 'string' || transcript.trim() === '') {
    return res.status(400).json({ error: 'Transcript is required' });
  }

  // If Anthropic Claude API Key is configured
  if (anthropicApiKey && anthropicApiKey.trim() !== '' && anthropicApiKey !== 'your_anthropic_api_key_here') {
    try {
      const anthropic = new Anthropic({ apiKey: anthropicApiKey });

      const systemPrompt = `You are MarkAI's intelligent Voice-to-Business Profile extraction engine.
You receive a raw, spoken audio transcript from a small business owner.
The transcript may be conversational, messy, accented, or code-mixed in English, Tamil, or Tanglish (e.g. "Namma cafe-la fresh filter coffee and organic snacks kudukrom...", "Ennoda boutique-la organic handloom sarees sell panrom...", "Chennai-la cloud kitchen run panrom for briyani & meals...").

Your task is to analyze the transcript and extract a clean, structured Business Profile object in professional English.

Rules:
1. "business_name": Extract the brand/business name. If not explicitly stated, generate a creative, fitting brand name based on what they do.
2. "industry": Determine the industry/category (e.g., "Food & Beverage / Specialty Cafe", "Fashion & Handloom Apparel", "Beauty & Personal Care", "Fitness & Wellness", "Software & Technology").
3. "description": Write a clean, 2-3 sentence product/service description in polished English that captures all the key features, unique value, and specialties mentioned.
4. "target_audience": Identify or infer the target demographic (e.g., "Coffee lovers, college students, and remote workers").
5. "tone": Pick the most fitting brand tone from: "casual", "formal", "playful", "bold", "inspiring".

Output format MUST be strictly a valid JSON object without any markdown code blocks or backticks:
{
  "business_name": "Extracted or Inferred Name",
  "industry": "Industry Category",
  "description": "Clean English description of products, services, and special offerings.",
  "target_audience": "Specific target audience description.",
  "tone": "playful"
}`;

      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        temperature: 0.3,
        system: systemPrompt,
        messages: [{
          role: 'user',
          content: `Here is the spoken voice transcript from the business owner:\n\n"${transcript.trim()}"\n\nExtract the structured BusinessProfile JSON.`
        }],
      });

      const contentBlock = response.content[0];
      if (contentBlock.type === 'text') {
        let raw = contentBlock.text.trim().replace(/^```(json)?\n?/, '').replace(/\n?```$/, '');
        const parsed = JSON.parse(raw);
        
        const validTones: ToneType[] = ['casual', 'formal', 'playful', 'bold', 'inspiring'];
        const tone: ToneType = validTones.includes(parsed.tone) ? parsed.tone : 'casual';

        const profile: BusinessProfile = {
          business_name: parsed.business_name || 'My Local Business',
          industry: parsed.industry || 'Retail & Local Services',
          description: parsed.description || transcript,
          target_audience: parsed.target_audience || 'Local customers and community members',
          tone: tone,
        };

        return res.status(200).json({
          success: true,
          data: profile,
          extracted_via: 'claude-3-5-sonnet'
        });
      }
    } catch (e: any) {
      console.warn('Claude profile extraction fallback triggered:', e?.message || e);
    }
  }

  // Intelligent Fallback Parser for Offline / Sandbox Demo
  const text = transcript.toLowerCase();
  let business_name = 'Kaapi & Crumb Co.';
  let industry = 'Food & Beverage / Specialty Cafe';
  let description = 'Authentic Kumbakonam-style degree filter coffee roasted with chicory, paired with European butter croissants and fresh baked snacks.';
  let target_audience = 'Coffee lovers, college students, and remote working professionals';
  let tone: ToneType = 'casual';

  if (text.includes('saree') || text.includes('boutique') || text.includes('handloom') || text.includes('silk') || text.includes('kurti') || text.includes('textile')) {
    business_name = 'Nila Handloom & Silks';
    industry = 'Fashion & Handloom Apparel';
    description = 'Hand-woven organic cotton and pure Kanchipuram silk sarees crafted directly by traditional master weavers in Tamil Nadu.';
    target_audience = 'Festive shoppers, bridal parties, and traditional handloom enthusiasts';
    tone = 'inspiring';
  } else if (text.includes('briyani') || text.includes('biryani') || text.includes('meals') || text.includes('kitchen') || text.includes('hotel') || text.includes('restaurant')) {
    business_name = 'Anjappar Heritage Kitchen';
    industry = 'Food & Beverage / Regional Cuisine';
    description = 'Authentic firewood dum biryani and Chettinad specialties made with heirloom hand-pounded masalas and zero artificial additives.';
    target_audience = 'Foodies, families, and authentic regional cuisine lovers';
    tone = 'bold';
  } else if (text.includes('fit') || text.includes('gym') || text.includes('wear') || text.includes('apparel') || text.includes('athleisure')) {
    business_name = 'FitPulse Activewear';
    industry = 'Fitness Apparel & Lifestyle';
    description = 'High-performance sweat-wicking activewear and gym hoodies crafted from sustainable recycled ocean fabrics.';
    target_audience = 'Fitness enthusiasts, runners, and athletes aged 18-35';
    tone = 'bold';
  } else if (text.includes('skin') || text.includes('beauty') || text.includes('organic') || text.includes('soap') || text.includes('oil')) {
    business_name = 'GlowLab Botanical Skincare';
    industry = 'Clean Beauty & Wellness';
    description = 'Clean, dermatologist-tested vegan botanical serums, barrier-repair moisturizers, and cold-pressed herbal face oils.';
    target_audience = 'Wellness advocates and eco-conscious skincare lovers';
    tone = 'inspiring';
  } else if (text.includes('tech') || text.includes('software') || text.includes('agency') || text.includes('app') || text.includes('cloud')) {
    business_name = 'Apex Cloud Solutions';
    industry = 'Software & Technology Services';
    description = 'Modern cloud infrastructure, custom full-stack web applications, and AI workflow automation for scaling businesses.';
    target_audience = 'Founders, CTOs, and growing startups looking to scale';
    tone = 'formal';
  } else if (text.includes('cafe') || text.includes('coffee') || text.includes('tea') || text.includes('kaapi') || text.includes('kadai') || text.includes('bakes')) {
    business_name = 'Kaapi & Crumb Co.';
    industry = 'Food & Beverage / Specialty Cafe';
    description = 'Traditional Kumbakonam-style filter coffee brewed fresh with chicory beans, accompanied by artisanal pastries and bun butter jam.';
    target_audience = 'Filter coffee enthusiasts, students, and neighborhood families';
    tone = 'playful';
  } else {
    // General extraction
    const firstWords = transcript.split(' ').filter(w => w.length > 2).slice(0, 3).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    business_name = firstWords ? `${firstWords} Co.` : 'My Local Business';
    description = `Premium local business delivering specialty offerings: ${transcript.slice(0, 140)}...`;
  }

  return res.status(200).json({
    success: true,
    data: {
      business_name,
      industry,
      description,
      target_audience,
      tone,
    },
    extracted_via: 'local-intelligence-engine'
  });
}
