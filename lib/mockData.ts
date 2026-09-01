import { BusinessProfile, GeneratedPost, GraphicTheme, BrandKit, CalendarEvent, PostFormat } from './types';

export const DEFAULT_BRAND_KIT: BrandKit = {
  primary_color: '#8B5CF6',
  secondary_color: '#D946EF',
  accent_color: '#F59E0B',
  font_heading: 'Plus Jakarta Sans',
  font_body: 'Inter',
  logo_badge_text: 'BREW & BEAN CO.',
  brand_voice_guidelines: 'Warm, approachable, passion-driven, and focused on artisanal craft quality and sustainability.',
  dos_list: [
    'Always mention small-batch single origin sourcing',
    'Use warm and cozy cafe emojis (☕, 🥐, ✨)',
    'Highlight community vibe and friendly barista culture'
  ],
  donts_list: [
    'Never use corporate or sterile jargon',
    'Do not sound elitist or condescending about coffee drinks',
    'Avoid generic salesy urgency ("BUY NOW!")'
  ]
};

export const DEMO_PRESET_PROFILES: { label: string; profile: BusinessProfile; brandKit: BrandKit }[] = [
  {
    label: '☕ Brew & Bean Co. (Specialty Coffee)',
    profile: {
      business_name: 'Brew & Bean Specialty Coffee',
      industry: 'Food & Beverage / Cafe',
      description: 'Artisanal micro-roastery serving single-origin pour-overs, organic matcha, and fresh flaky croissants in a cozy neighborhood setting.',
      target_audience: 'Coffee enthusiasts, remote workers, students, and urban brunch lovers aged 20-38',
      tone: 'playful',
    },
    brandKit: {
      primary_color: '#7C3AED',
      secondary_color: '#D946EF',
      accent_color: '#F59E0B',
      font_heading: 'Plus Jakarta Sans',
      font_body: 'Inter',
      logo_badge_text: 'BREW & BEAN',
      brand_voice_guidelines: 'Warm, artisanal, conversational, highlighting fresh micro-roasting and neighborhood cafe community.',
      dos_list: ['Highlight bean origins', 'Use cozy emojis ☕🥐✨', 'Invite community conversation'],
      donts_list: ['No corporate jargon', 'No snobbish tone about milk drinks', 'No aggressive all-caps promo text']
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
    },
    brandKit: {
      primary_color: '#06B6D4',
      secondary_color: '#3B82F6',
      accent_color: '#F43F5E',
      font_heading: 'Plus Jakarta Sans',
      font_body: 'Inter',
      logo_badge_text: 'FITPULSE',
      brand_voice_guidelines: 'High-energy, relentless, athletic, and focused on sustainable performance innovation.',
      dos_list: ['Use empowering action verbs', 'Highlight eco-friendly recycled ocean fabrics', 'Encourage workout consistency'],
      donts_list: ['No lazy or passive phrasing', 'Do not make unrealistic body claims', 'Avoid cluttered sentences']
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
    },
    brandKit: {
      primary_color: '#10B981',
      secondary_color: '#059669',
      accent_color: '#A7F3D0',
      font_heading: 'Plus Jakarta Sans',
      font_body: 'Inter',
      logo_badge_text: 'GLOWLAB BOTANICALS',
      brand_voice_guidelines: 'Calm, scientifically transparent, gentle, and empowering users to love their natural skin barrier.',
      dos_list: ['Explain active ingredients clearly', 'Highlight cruelty-free & vegan certifications', 'Keep visuals serene and clean'],
      donts_list: ['No fear-mongering about aging', 'Do not promise overnight miracles', 'Avoid harsh promotional language']
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
    },
    brandKit: {
      primary_color: '#6366F1',
      secondary_color: '#4F46E5',
      accent_color: '#38BDF8',
      font_heading: 'Plus Jakarta Sans',
      font_body: 'Inter',
      logo_badge_text: 'APEX CLOUD',
      brand_voice_guidelines: 'Authoritative, engineer-first, precise, emphasizing uptime reliability and cloud efficiency.',
      dos_list: ['Cite latency and uptime statistics (99.99%)', 'Focus on developer productivity', 'Use clear technical architecture terminology'],
      donts_list: ['No vague buzzwords without substance', 'No informal slang', 'Do not oversimplify complex DevOps workflows']
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

// Fallback multi-format content generator
export function generateFallbackPost(
  profile: BusinessProfile,
  format: PostFormat = 'single_image',
  brandKit?: BrandKit
): GeneratedPost {
  const name = profile.business_name || 'Our Brand';

  if (format === 'carousel') {
    return {
      format: 'carousel',
      post_theme: `5 Secrets to Elevating Your ${profile.industry || 'Daily Routine'}`,
      caption: `Swipe through to discover the 5 rules we live by at ${name}. 👉\n\nMost people overlook #3, but it makes all the difference in long-term results.\n\nSave this carousel for your next review, and let us know which step surprised you most!`,
      hashtags: ['#CarouselPost', '#SwipeLeft', '#ProTips', '#IndustrySecrets', '#SmallBusinessGuide', `#${name.replace(/\s+/g, '')}`],
      visual_idea: 'Clean multi-slide aesthetic layout with sequential numbered tip cards and prominent swipe arrows',
      best_time: 'Tuesday & Thursday at 6:30 PM',
      carousel_slides: [
        {
          slide_number: 1,
          headline: `5 Things Nobody Tells You About ${profile.industry || 'Quality'}`,
          body: `Swipe left to avoid the top mistakes 90% of beginners make.`,
          visual_cue: 'Bold contrast title card with curiosity hook badge'
        },
        {
          slide_number: 2,
          headline: `01 / Consistency Outweighs Intensity`,
          body: `Small daily habits build sustainable momentum far better than random bursts of effort.`,
          visual_cue: 'Minimal icon with highlighted key statistic callout'
        },
        {
          slide_number: 3,
          headline: `02 / Source Quality Over Price`,
          body: `At ${name}, every ingredient and material is tested to ensure peak durability and performance.`,
          visual_cue: 'Split screen comparing raw material purity vs generic alternatives'
        },
        {
          slide_number: 4,
          headline: `03 / The Power of Craftsmanship`,
          body: `Cut no corners. Attention to micro-details is what creates remarkable customer experiences.`,
          visual_cue: 'Close-up texture macro shot with branded gradient highlight'
        },
        {
          slide_number: 5,
          headline: `Save This Post & Tag a Friend!`,
          body: `Ready to upgrade your standard? Tap the link in bio to explore our latest release.`,
          visual_cue: 'Call to action card with animated save bookmark and share icons'
        }
      ]
    };
  }

  if (format === 'reels_script') {
    return {
      format: 'reels_script',
      post_theme: `Behind The Scenes: How We Build ${name}`,
      caption: `Ever wondered what happens before we open our doors? 👀🎥\n\nHere is a raw, unedited look at how we craft our signature offerings at ${name}.\n\nDouble tap if you love seeing behind the curtain! Drop questions in the comments below. 👇`,
      hashtags: ['#ReelsVideo', '#BehindTheScenes', '#SmallBusinessLife', '#MakerMovement', '#ShortsContent', '#ViralHook'],
      visual_idea: 'Fast-paced vertical reel shot with 3-second rapid cuts, upbeat lofi beats, and dynamic auto-captions',
      best_time: 'Wednesday & Sunday at 7:00 PM',
      reels_script: {
        hook: `Stop scrolling if you've been doing ${profile.industry || 'this'} the hard way!`,
        duration: '22 seconds',
        music_suggestion: 'Upbeat Lofi Chillhop / Modern Kinetic Beat (120 BPM)',
        scenes: [
          {
            timestamp: '0:00 - 0:03',
            visual_action: 'Fast zoom-in on product in action with bold eye contact and quick gesture',
            spoken_audio: `"If you think all ${profile.industry || 'products'} are the same, watch this."`,
            on_screen_text: 'STOP SCROLLING ⚠️'
          },
          {
            timestamp: '0:04 - 0:09',
            visual_action: 'B-roll macro cut showing precision craft process / steam / fabric / raw ingredients',
            spoken_audio: `"Here is what most brands skip to cut costs — and why we never compromise."`,
            on_screen_text: 'The #1 step others skip ❌'
          },
          {
            timestamp: '0:10 - 0:16',
            visual_action: 'Founder smiles, showing the finished product in hands with natural sunlight',
            spoken_audio: `"Every batch at ${name} is crafted for people who care about real quality."`,
            on_screen_text: `Crafted with intention ✨`
          },
          {
            timestamp: '0:17 - 0:22',
            visual_action: 'Point finger towards link in bio with seamless smooth loop transition',
            spoken_audio: `"Tap the link in our bio to grab yours before this batch sells out!"`,
            on_screen_text: 'TAP LINK IN BIO 🚀'
          }
        ]
      }
    };
  }

  // Default: Single Image Post
  if (profile.industry.toLowerCase().includes('coffee') || name.toLowerCase().includes('brew')) {
    return {
      format: 'single_image',
      post_theme: 'Morning Ritual: Single-Origin Pour Over Spotlight',
      caption: `Your morning deserves better than burnt drip coffee. ☕✨\n\nEvery single bean at ${name} is hand-roasted in small batches to preserve sweet caramel notes and subtle berry brightness. Stop by today or grab a fresh bag for home brew happiness.\n\nDrop a ☕ if you haven't had your first cup yet!`,
      hashtags: ['#SpecialtyCoffee', '#CoffeeLovers', '#LocalRoastery', '#PourOverCoffee', '#MorningRitual', '#CoffeeShopVibes', '#ThirdWaveCoffee'],
      visual_idea: 'Close-up slow pour-over with warm ambient morning light and coffee steam rising against a rustic wood background',
      best_time: 'Tuesday & Thursday at 8:15 AM (Morning commute peak)'
    };
  }

  return {
    format: 'single_image',
    post_theme: `Transforming ${profile.industry || 'Your Routine'} with ${name}`,
    caption: `Looking for a smarter, more reliable way to elevate your day? 🚀\n\nAt ${name}, we built our solutions with one goal in mind: helping ${profile.target_audience || 'you'} achieve better results with zero fluff.\n\nSave this post for later, and comment "READY" to get our exclusive starter guide! 👇`,
    hashtags: ['#SmallBusinessGrowth', '#Innovation', '#CustomerFirst', '#QualityMatters', '#ShopLocal', '#BehindTheScenes'],
    visual_idea: 'Clean bold typography card with modern gradient border and product spotlight mockup',
    best_time: 'Wednesday at 11:30 AM & Friday at 2:00 PM'
  };
}

// 30-Day Festival-Aware Calendar Events Generator
export function generate30DayCalendarPresets(profile: BusinessProfile): CalendarEvent[] {
  const name = profile.business_name || 'Our Brand';
  const year = 2026;
  const month = 8; // September (0-indexed = 8)

  const occasions: { day: number; occasion: string; title: string; hook: string; format: PostFormat }[] = [
    {
      day: 2,
      occasion: 'Fall Season Kickoff',
      title: 'Autumn Seasonal Menu & Product Reveal',
      hook: 'Fall flavors & autumn gear are officially here! 🍂',
      format: 'carousel'
    },
    {
      day: 5,
      occasion: 'Labor Day Weekend',
      title: 'Long Weekend Holiday Special Spotlight',
      hook: 'Your long weekend essentials checklist is here 🎒',
      format: 'single_image'
    },
    {
      day: 7,
      occasion: 'Labor Day',
      title: 'Celebrating Hard Work & Community Dedication',
      hook: 'To the creators, makers, and dreamers who never stop 🛠️',
      format: 'single_image'
    },
    {
      day: 9,
      occasion: '🏆 MarkAI College Pitch Day (Sept 9)',
      title: 'Behind the Scenes: Innovation & Small Business Pitch',
      hook: 'Big milestone today! Pitching our vision on stage 🚀',
      format: 'reels_script'
    },
    {
      day: 12,
      occasion: 'Customer Appreciation Saturday',
      title: 'Community Spotlight & VIP Review Feature',
      hook: 'Why our regulars keep coming back week after week 💬',
      format: 'carousel'
    },
    {
      day: 15,
      occasion: 'National Online Learning Day',
      title: '3 Pro Tips: Master Your Daily Workflow',
      hook: 'The 3 mistakes you might be making right now 💡',
      format: 'carousel'
    },
    {
      day: 18,
      occasion: 'Friday Flash Feature',
      title: 'Quick 15-Second Product Speedrun',
      hook: 'Watch how fast this transforms your morning routine ⚡',
      format: 'reels_script'
    },
    {
      day: 21,
      occasion: 'World Gratitude Day',
      title: 'Giving Thanks: Exclusive VIP Promo Code',
      hook: 'A heartfelt thank you to our first 1,000 supporters ❤️',
      format: 'single_image'
    },
    {
      day: 22,
      occasion: 'Autumn Equinox (First Day of Fall)',
      title: 'Embrace The Cozy Shift: Limited Edition Release',
      hook: 'Welcome to crisp air, warm drinks, and fresh momentum 🍁',
      format: 'single_image'
    },
    {
      day: 25,
      occasion: 'Maker Friday BTS',
      title: 'Raw Behind the Scenes Studio Tour',
      hook: 'Everything that happens before we ship an order 📦',
      format: 'reels_script'
    },
    {
      day: 29,
      occasion: '☕ International Coffee Day Eve',
      title: 'The Science of Perfect Single-Origin Roasting',
      hook: 'How to brew cafe-quality pour-over at home like a pro ☕',
      format: 'carousel'
    },
    {
      day: 30,
      occasion: 'Q3 Wrap-Up & Milestone Recap',
      title: 'What We Accomplished Together This Month',
      hook: 'September wrap-up: New launches, reviews, and what is next 📈',
      format: 'single_image'
    }
  ];

  return occasions.map((item, idx) => {
    const dayStr = item.day < 10 ? `0${item.day}` : `${item.day}`;
    return {
      id: `cal_${year}_09_${dayStr}_${idx}`,
      date: `2026-09-${dayStr}`,
      title: item.title,
      festival_occasion: item.occasion,
      format: item.format,
      content_hook: item.hook,
      hashtags: [`#${name.replace(/\s+/g, '')}`, '#SeptemberMarketing', `#${item.format === 'carousel' ? 'CarouselTips' : item.format === 'reels_script' ? 'ReelsViral' : 'InstagramSpotlight'}`],
      status: item.day <= 9 ? 'published' : 'suggested',
      best_time: '10:30 AM & 6:15 PM',
      visual_concept: `High contrast ${item.format} concept with brand palette overlay`
    };
  });
}
