import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import { BusinessProfile, GuidedVideoTemplate, GuidedShot } from '@/lib/types';

const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
const anthropicApiKey = process.env.ANTHROPIC_API_KEY || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { profile, template = 'product_spotlight' } = req.body as {
    profile: BusinessProfile;
    template: GuidedVideoTemplate;
  };

  if (!profile || !profile.business_name) {
    return res.status(400).json({ error: 'Business profile is required' });
  }

  // 1. Attempt with Google Gemini API
  if (geminiApiKey && geminiApiKey.trim() !== '' && geminiApiKey !== 'your_gemini_api_key_here') {
    try {
      const genAI = new GoogleGenerativeAI(geminiApiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `You are MarkAI's expert Video Director.
Generate a structured 3-shot filming checklist for a small business owner to capture their own photos or video clips using their smartphone.

Business Name: ${profile.business_name}
Industry: ${profile.industry}
Description: ${profile.description}
Tone: ${profile.tone}
Template Archetype: ${template} (options: product_spotlight, before_after, bts_story)

Return STRICTLY a valid JSON array of 3 shots with no markdown ticks or text formatting:
[
  {
    "shot_number": 1,
    "title": "Short Punchy Title",
    "instruction": "Specific, practical instruction on what real object/action to film on their phone camera.",
    "camera_angle": "e.g. 45-degree close-up / Eye-level tripod / Slow pan",
    "lighting_tip": "e.g. Natural window light from the left side, avoid backlighting",
    "duration_seconds": 4,
    "voiceover_script": "One captivating, punchy sentence to overlay as caption/spoken script."
  },
  {
    "shot_number": 2,
    "title": "Action / Detail Shot",
    "instruction": "Next step or macro close-up showcasing craftsmanship, ingredients, or process.",
    "camera_angle": "e.g. Top-down overhead / Macro texture shot",
    "lighting_tip": "e.g. Soft diffused morning light",
    "duration_seconds": 4,
    "voiceover_script": "Highlighting the quality and why customers love it."
  },
  {
    "shot_number": 3,
    "title": "Hero Result & Call to Action",
    "instruction": "Final hero presentation of product/experience inviting the viewer to visit or order.",
    "camera_angle": "e.g. Wide hero angle with hands presenting the product",
    "lighting_tip": "e.g. Warm glow highlighting details",
    "duration_seconds": 4,
    "voiceover_script": "Tap the link in our bio or visit us today!"
  }
]`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim().replace(/^```(json)?\n?/, '').replace(/\n?```$/, '');
      const parsed = JSON.parse(text);

      const shots: GuidedShot[] = parsed.map((s: any, idx: number) => ({
        shot_number: idx + 1,
        title: s.title || `Shot 0${idx + 1}`,
        instruction: s.instruction || 'Capture your product in good lighting.',
        camera_angle: s.camera_angle || 'Eye-level close-up',
        lighting_tip: s.lighting_tip || 'Natural ambient lighting',
        duration_seconds: s.duration_seconds || 4,
        voiceover_script: s.voiceover_script || 'Crafted with passion at our workshop.',
        status: 'pending' as const
      }));

      return res.status(200).json({ success: true, data: shots, generated_via: 'gemini-1.5-flash' });
    } catch (e: any) {
      console.warn('Gemini shot generation fallback:', e?.message || e);
    }
  }

  // 2. Attempt with Anthropic Claude if Gemini key is unset
  if (anthropicApiKey && anthropicApiKey.trim() !== '' && anthropicApiKey !== 'your_anthropic_api_key_here') {
    try {
      const anthropic = new Anthropic({ apiKey: anthropicApiKey });
      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1200,
        temperature: 0.4,
        messages: [{
          role: 'user',
          content: `Generate a 3-shot smartphone filming checklist for:
Business: ${profile.business_name} (${profile.industry})
Template: ${template}
Output STRICT JSON array only with keys: shot_number, title, instruction, camera_angle, lighting_tip, duration_seconds, voiceover_script.`
        }],
      });

      const contentBlock = response.content[0];
      if (contentBlock.type === 'text') {
        const text = contentBlock.text.trim().replace(/^```(json)?\n?/, '').replace(/\n?```$/, '');
        const parsed = JSON.parse(text);
        const shots: GuidedShot[] = parsed.map((s: any, idx: number) => ({
          shot_number: idx + 1,
          title: s.title,
          instruction: s.instruction,
          camera_angle: s.camera_angle,
          lighting_tip: s.lighting_tip,
          duration_seconds: s.duration_seconds || 4,
          voiceover_script: s.voiceover_script,
          status: 'pending' as const
        }));
        return res.status(200).json({ success: true, data: shots, generated_via: 'claude-3-5-sonnet' });
      }
    } catch (e) {
      console.warn('Claude shot fallback:', e);
    }
  }

  // 3. Fallback Shot Guide Presets per Template
  const name = profile.business_name || 'Our Brand';
  let shots: GuidedShot[] = [];

  if (template === 'before_after') {
    shots = [
      {
        shot_number: 1,
        title: 'The "Before" Problem State',
        instruction: `Film the common frustration or raw starting materials before using ${name}.`,
        camera_angle: 'Medium flat lay or eye-level focus on problem area',
        lighting_tip: 'Subtle dimmer ambient lighting to accentuate the contrast',
        duration_seconds: 4,
        voiceover_script: `Tired of settling for generic, mass-produced ${profile.industry}?`,
        status: 'pending'
      },
      {
        shot_number: 2,
        title: 'The Active Crafting Transformation',
        instruction: `Capture hands at work applying your product or brewing / packaging the item.`,
        camera_angle: 'Close-up 45-degree angle with dynamic hand movement',
        lighting_tip: 'Bright directional side-lighting to highlight textures and steam',
        duration_seconds: 4,
        voiceover_script: `Here is how we handcraft every single batch with zero shortcuts.`,
        status: 'pending'
      },
      {
        shot_number: 3,
        title: 'The "After" Delight & Result',
        instruction: `Show the finished product being enjoyed with a genuine customer smile.`,
        camera_angle: 'Warm hero shot with natural soft focus background',
        lighting_tip: 'Golden hour or bright window light from the front',
        duration_seconds: 4,
        voiceover_script: `Upgrade your daily standard — tap the link in our bio!`,
        status: 'pending'
      }
    ];
  } else if (template === 'bts_story') {
    shots = [
      {
        shot_number: 1,
        title: 'Morning Setup & Workshop Open',
        instruction: `Capture unlocking doors, turning on equipment, or arranging fresh morning supplies.`,
        camera_angle: 'Wide establishing angle from entrance',
        lighting_tip: 'Morning natural sunlight coming through front windows',
        duration_seconds: 4,
        voiceover_script: `Ever wondered what 6:00 AM looks like at ${name}?`,
        status: 'pending'
      },
      {
        shot_number: 2,
        title: 'Behind the Curtain: Precision Detail',
        instruction: `Close-up macro of measuring ingredients, stitching fabric, or pouring perfection.`,
        camera_angle: 'Extreme close-up macro (2-3 inches away from product)',
        lighting_tip: 'Even, shadow-free soft lighting',
        duration_seconds: 4,
        voiceover_script: `Every single order gets this exact level of personal care.`,
        status: 'pending'
      },
      {
        shot_number: 3,
        title: 'Ready for You: Hero Showcase',
        instruction: `Display the final finished spread ready for pickup or shipping.`,
        camera_angle: 'Slow handheld pan across the counter',
        lighting_tip: 'Warm ambient glow with reflection highlight',
        duration_seconds: 4,
        voiceover_script: `Come say hello today or grab yours online before we sell out!`,
        status: 'pending'
      }
    ];
  } else {
    // Default: Product Spotlight
    shots = [
      {
        shot_number: 1,
        title: 'Hero Product Establishing Shot',
        instruction: `Place your signature item on a clean surface and capture a slow 3-second zoom-in.`,
        camera_angle: 'Eye-level 45-degree angle on clean wooden or minimal backdrop',
        lighting_tip: 'Position subject next to a large window, avoid harsh flash',
        duration_seconds: 4,
        voiceover_script: `If you appreciate authentic quality, you need to see this.`,
        status: 'pending'
      },
      {
        shot_number: 2,
        title: 'Macro Feature & Texture Detail',
        instruction: `Get up close to capture the organic texture, steam, crema, or stitching details.`,
        camera_angle: 'Overhead top-down or 2-inch macro focus',
        lighting_tip: 'Angled side lighting to create rich depth and texture contrast',
        duration_seconds: 4,
        voiceover_script: `Small-batch crafted with the purest ingredients and materials.`,
        status: 'pending'
      },
      {
        shot_number: 3,
        title: 'In-Hand Experience & Call to Action',
        instruction: `Hold the item naturally in your hands, presenting it to the camera.`,
        camera_angle: 'Eye-level portrait angle with subtle tilt',
        lighting_tip: 'Warm front-facing soft lighting',
        duration_seconds: 4,
        voiceover_script: `Experience ${name} for yourself — visit us or order online today!`,
        status: 'pending'
      }
    ];
  }

  return res.status(200).json({
    success: true,
    data: shots,
    generated_via: 'smart-template-engine'
  });
}
