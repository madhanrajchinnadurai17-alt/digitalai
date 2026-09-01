import { BusinessProfile, GeneratedPost, GraphicTheme } from './types';

export const DEMO_PRESET_PROFILES: { label: string; profile: BusinessProfile }[] = [
  {
    label: '☕ Brew & Bean Co. (Specialty Coffee)',
    profile: {
      business_name: 'Brew & Bean Specialty Coffee',
      industry: 'Food & Beverage / Cafe',
      description: 'Artisanal micro-roastery serving single-origin pour-overs, organic matcha, and fresh flaky croissants in a cozy neighborhood setting.',
      target_audience: 'Coffee enthusiasts, remote workers, students, and urban brunch lovers aged 20-38',
      tone: 'playful',
    }
  },
  {
    label: '🏃‍♂️ FitPulse Apparel (Activewear)',
    profile: {
      business_name: 'FitPulse Activewear',
      industry: 'Fitness & Fashion',
      description: 'Eco-friendly, sweat-wicking performance athletic wear made from recycled ocean plastics, designed for high-intensity training and everyday lifestyle.',
      target_audience: 'Gym-goers, runners, yoga practitioners, and fitness enthusiasts aged 18-40',
      tone: 'bold',
    }
  },
  {
    label: '🌿 GlowLab Skincare (Clean Beauty)',
    profile: {
      business_name: 'GlowLab Botanical Skincare',
      industry: 'Beauty & Wellness',
      description: 'Clean, dermatologist-tested botanical serums and barrier-repair moisturizers crafted with vegan hyaluronic acid and niacinamide.',
      target_audience: 'Skincare enthusiasts seeking clean, gentle, and cruelty-free daily routines aged 22-45',
      tone: 'inspiring',
    }
  },
  {
    label: '💻 Apex Cloud Solutions (B2B Tech)',
    profile: {
      business_name: 'Apex Cloud Solutions',
      industry: 'Software & Technology',
      description: 'Zero-downtime cloud migration, Kubernetes orchestration, and 24/7 DevOps management for fast-growing mid-market startups.',
      target_audience: 'CTOs, Engineering Directors, and technical founders scaling their infrastructure',
      tone: 'formal',
    }
  }
];

export const GRAPHIC_THEMES: GraphicTheme[] = [
  {
    id: 'sunset-glow',
    name: 'Sunset Gradient',
    background: 'linear-gradient(135deg, #f97316 0%, #ec4899 50%, #8b5cf6 100%)',
    gradientStart: '#f97316',
    gradientEnd: '#8b5cf6',
    textColor: '#ffffff',
    accentColor: '#fef08a',
    badgeBg: 'rgba(255, 255, 255, 0.25)',
    badgeText: '#ffffff',
  },
  {
    id: 'neon-cyber',
    name: 'Neon Cyber',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%)',
    gradientStart: '#06b6d4',
    gradientEnd: '#ec4899',
    textColor: '#ffffff',
    accentColor: '#38bdf8',
    badgeBg: 'rgba(6, 182, 212, 0.2)',
    badgeText: '#38bdf8',
  },
  {
    id: 'emerald-luxury',
    name: 'Emerald Luxe',
    background: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #10b981 100%)',
    gradientStart: '#064e3b',
    gradientEnd: '#10b981',
    textColor: '#ffffff',
    accentColor: '#a7f3d0',
    badgeBg: 'rgba(255, 255, 255, 0.2)',
    badgeText: '#ffffff',
  },
  {
    id: 'royal-purple',
    name: 'Royal Violet',
    background: 'linear-gradient(135deg, #2e1065 0%, #581c87 50%, #7c3aed 100%)',
    gradientStart: '#2e1065',
    gradientEnd: '#7c3aed',
    textColor: '#ffffff',
    accentColor: '#f472b6',
    badgeBg: 'rgba(244, 114, 182, 0.25)',
    badgeText: '#fbcfe8',
  },
  {
    id: 'minimal-dark',
    name: 'Midnight Sleek',
    background: 'linear-gradient(135deg, #090d16 0%, #171d2d 50%, #1e293b 100%)',
    gradientStart: '#0f172a',
    gradientEnd: '#334155',
    textColor: '#ffffff',
    accentColor: '#fbbf24',
    badgeBg: 'rgba(251, 191, 36, 0.2)',
    badgeText: '#fbbf24',
  },
];

export function generateFallbackPost(profile: BusinessProfile): GeneratedPost {
  const name = profile.business_name || 'Our Brand';
  const tone = profile.tone || 'playful';

  if (profile.industry.toLowerCase().includes('coffee') || name.toLowerCase().includes('brew')) {
    return {
      post_theme: 'Morning Ritual: Single-Origin Pour Over Spotlight',
      caption: `Your morning deserves better than burnt drip coffee. ☕✨\n\nEvery single bean at ${name} is hand-roasted in small batches to preserve sweet caramel notes and subtle berry brightness. Stop by today or grab a fresh bag for home brew happiness.\n\nDrop a ☕ if you haven't had your first cup yet!`,
      hashtags: ['#SpecialtyCoffee', '#CoffeeLovers', '#LocalRoastery', '#PourOverCoffee', '#MorningRitual', '#CoffeeShopVibes', '#ThirdWaveCoffee'],
      visual_idea: 'Close-up slow pour-over with warm ambient morning light and coffee steam rising against a rustic wood background',
      best_time: 'Tuesday & Thursday at 8:15 AM (Morning commute peak)'
    };
  }

  if (profile.industry.toLowerCase().includes('fitness') || profile.industry.toLowerCase().includes('fashion')) {
    return {
      post_theme: 'Engineered for Performance. Crafted for the Planet.',
      caption: `Zero excuses. 100% recycled high-performance gear. 🔥\n\nMeet our flagship athletic wear by ${name} — ultra-breathable, squat-proof, and designed to move with you through your heaviest lifts and longest runs.\n\nReady to elevate your training? Tap the link in bio to gear up.`,
      hashtags: ['#FitPulse', '#Activewear', '#GymAesthetics', '#EcoFitness', '#WorkoutMotivation', '#SustainableFashion', '#AthleteMindset'],
      visual_idea: 'High-contrast athletic movement shot outdoors at sunrise showcasing sleek breathable fabric texture',
      best_time: 'Monday & Wednesday at 6:30 PM (Post-workout browsing)'
    };
  }

  return {
    post_theme: `Transforming ${profile.industry || 'Your Routine'} with ${name}`,
    caption: `Looking for a smarter, more reliable way to elevate your day? 🚀\n\nAt ${name}, we built our solutions with one goal in mind: helping ${profile.target_audience || 'you'} achieve better results with zero fluff.\n\nSave this post for later, and comment "READY" to get our exclusive starter guide! 👇`,
    hashtags: ['#SmallBusinessGrowth', '#Innovation', '#CustomerFirst', '#QualityMatters', '#ShopLocal', '#BehindTheScenes'],
    visual_idea: 'Clean bold typography card with modern gradient border and product spotlight mockup',
    best_time: 'Wednesday at 11:30 AM & Friday at 2:00 PM'
  };
}
