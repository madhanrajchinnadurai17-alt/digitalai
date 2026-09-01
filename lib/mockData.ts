import { 
  BusinessProfile, 
  GeneratedPost, 
  GraphicTheme, 
  BrandKit, 
  CalendarEvent, 
  PostFormat,
  ConnectedPlatformAccount,
  AnalyticsMetricSummary,
  ScheduledPostRecord,
  VideoProject,
  VideoTemplateArchetype,
  WebsiteData,
  StrategyRecommendation,
  AutopilotCampaign
} from './types';

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

// Multi-Format Content Generator Fallback
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

  const occasions = [
    { day: 2, occasion: 'Fall Season Kickoff', title: 'Autumn Seasonal Menu & Product Reveal', hook: 'Fall flavors & autumn gear are officially here! 🍂', format: 'carousel' as PostFormat },
    { day: 5, occasion: 'Labor Day Weekend', title: 'Long Weekend Holiday Special Spotlight', hook: 'Your long weekend essentials checklist is here 🎒', format: 'single_image' as PostFormat },
    { day: 7, occasion: 'Labor Day', title: 'Celebrating Hard Work & Community Dedication', hook: 'To the creators, makers, and dreamers who never stop 🛠️', format: 'single_image' as PostFormat },
    { day: 9, occasion: '🏆 MarkAI College Pitch Day (Sept 9)', title: 'Behind the Scenes: Innovation & Small Business Pitch', hook: 'Big milestone today! Pitching our vision on stage 🚀', format: 'reels_script' as PostFormat },
    { day: 12, occasion: 'Customer Appreciation Saturday', title: 'Community Spotlight & VIP Review Feature', hook: 'Why our regulars keep coming back week after week 💬', format: 'carousel' as PostFormat },
    { day: 15, occasion: 'National Online Learning Day', title: '3 Pro Tips: Master Your Daily Workflow', hook: 'The 3 mistakes you might be making right now 💡', format: 'carousel' as PostFormat },
    { day: 18, occasion: 'Friday Flash Feature', title: 'Quick 15-Second Product Speedrun', hook: 'Watch how fast this transforms your morning routine ⚡', format: 'reels_script' as PostFormat },
    { day: 21, occasion: 'World Gratitude Day', title: 'Giving Thanks: Exclusive VIP Promo Code', hook: 'A heartfelt thank you to our first 1,000 supporters ❤️', format: 'single_image' as PostFormat },
    { day: 22, occasion: 'Autumn Equinox (First Day of Fall)', title: 'Embrace The Cozy Shift: Limited Edition Release', hook: 'Welcome to crisp air, warm drinks, and fresh momentum 🍁', format: 'single_image' as PostFormat },
    { day: 25, occasion: 'Maker Friday BTS', title: 'Raw Behind the Scenes Studio Tour', hook: 'Everything that happens before we ship an order 📦', format: 'reels_script' as PostFormat },
    { day: 29, occasion: '☕ International Coffee Day Eve', title: 'The Science of Perfect Single-Origin Roasting', hook: 'How to brew cafe-quality pour-over at home like a pro ☕', format: 'carousel' as PostFormat },
    { day: 30, occasion: 'Q3 Wrap-Up & Milestone Recap', title: 'What We Accomplished Together This Month', hook: 'September wrap-up: New launches, reviews, and what is next 📈', format: 'single_image' as PostFormat }
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

// ==========================================
// PHASE 3: MULTI-PLATFORM & ANALYTICS PRESETS
// ==========================================
export const DEFAULT_CONNECTED_PLATFORMS: ConnectedPlatformAccount[] = [
  {
    platform: 'instagram',
    connected: true,
    account_name: 'Brew & Bean Specialty Coffee',
    account_handle: '@brewandbeancoffee',
    permissions: ['pages_show_list', 'instagram_basic', 'instagram_content_publish'],
    last_synced: 'Just now'
  },
  {
    platform: 'facebook',
    connected: true,
    account_name: 'Brew & Bean Cafe & Roastery',
    account_handle: 'fb.com/brewandbeancafe',
    permissions: ['pages_manage_posts', 'pages_read_engagement'],
    last_synced: '5 mins ago'
  },
  {
    platform: 'linkedin',
    connected: false,
    account_name: 'Brew & Bean Coffee Co.',
    account_handle: 'linkedin.com/company/brew-and-bean',
    permissions: ['w_member_social', 'w_organization_social'],
    last_synced: 'Not connected'
  },
  {
    platform: 'twitter',
    connected: true,
    account_name: 'Brew & Bean Co.',
    account_handle: '@brewandbean',
    permissions: ['tweet.read', 'tweet.write', 'users.read'],
    last_synced: '1 hour ago'
  }
];

export const DEFAULT_ANALYTICS_DATA: AnalyticsMetricSummary = {
  total_reach: 48920,
  total_impressions: 114500,
  avg_engagement_rate: 6.4,
  total_likes: 3840,
  total_comments: 542,
  total_shares: 890,
  follower_growth: 18.5,
  platform_breakdown: {
    instagram: { reach: 24500, engagement: 7.8, posts: 14 },
    facebook: { reach: 14200, engagement: 4.6, posts: 11 },
    linkedin: { reach: 3800, engagement: 5.2, posts: 4 },
    twitter: { reach: 6420, engagement: 4.1, posts: 18 }
  },
  top_performing_posts: [
    { title: 'Morning Ritual: Single-Origin Pour Over Spotlight', format: 'single_image', platform: 'instagram', reach: 8400, engagement: 8.9 },
    { title: '5 Secrets to Elevating Your Specialty Coffee Experience', format: 'carousel', platform: 'instagram', reach: 6900, engagement: 9.4 },
    { title: 'Behind the Scenes: Roasting First Batch at Sunrise', format: 'reels_script', platform: 'facebook', reach: 5200, engagement: 7.1 },
    { title: 'Autumn Seasonal Drink Announcement & Recipe Hook', format: 'single_image', platform: 'twitter', reach: 4100, engagement: 5.8 }
  ]
};

export const DEFAULT_SCHEDULED_POSTS: ScheduledPostRecord[] = [
  {
    id: 'sched_1',
    user_id: 'demo-user',
    business_name: 'Brew & Bean Specialty Coffee',
    caption: 'Weekend mornings call for single-origin pour overs and fresh croissants. ☕🥐 Stop by this Saturday for live barista tasting sessions!',
    platforms: ['instagram', 'facebook'],
    scheduled_timestamp: new Date(Date.now() + 86400000 * 2).toISOString(),
    status: 'pending',
    created_at: new Date().toISOString()
  },
  {
    id: 'sched_2',
    user_id: 'demo-user',
    business_name: 'Brew & Bean Specialty Coffee',
    caption: 'Big announcement dropping this Tuesday at 9 AM. Here is a sneak peek at our Autumn limited release beans. 🍂🔥',
    platforms: ['instagram', 'twitter'],
    scheduled_timestamp: new Date(Date.now() + 86400000 * 4).toISOString(),
    status: 'pending',
    created_at: new Date().toISOString()
  }
];

// ==========================================
// PHASE 4: VIDEO STUDIO PRESETS
// ==========================================
export const DEFAULT_VIDEO_PROJECTS: VideoProject[] = [
  {
    id: 'vid_spotlight_1',
    title: 'Flagship Single-Origin Roast Spotlight',
    archetype: 'product_spotlight',
    aspect_ratio: '9:16',
    duration_total: 12,
    audio_track: 'Upbeat Lofi Kinetic Groove (120 BPM)',
    created_at: new Date().toISOString(),
    scenes: [
      {
        id: 's1',
        duration_seconds: 4,
        title_text: 'YOUR MORNING UPGRADE',
        subtitle_text: 'Small-batch single origin micro-roast',
        bg_gradient: 'linear-gradient(135deg, #7C3AED 0%, #D946EF 100%)',
        badge_text: 'BREW & BEAN',
        zoom_effect: 'in'
      },
      {
        id: 's2',
        duration_seconds: 4,
        title_text: 'HAND-ROASTED PERFECTION',
        subtitle_text: 'Sweet caramel notes & silky brightness',
        bg_gradient: 'linear-gradient(135deg, #F97316 0%, #EC4899 100%)',
        badge_text: '100% ARABICA',
        zoom_effect: 'out'
      },
      {
        id: 's3',
        duration_seconds: 4,
        title_text: 'TAP LINK IN BIO',
        subtitle_text: 'Fresh roast bags shipping daily nationwide',
        bg_gradient: 'linear-gradient(135deg, #064E3B 0%, #10B981 100%)',
        badge_text: 'ORDER TODAY',
        zoom_effect: 'pan'
      }
    ]
  },
  {
    id: 'vid_tips_1',
    title: '3 Pour-Over Mistakes You Are Making',
    archetype: 'quick_tips',
    aspect_ratio: '9:16',
    duration_total: 12,
    audio_track: 'Chillhop Modern Beat (115 BPM)',
    created_at: new Date().toISOString(),
    scenes: [
      {
        id: 's1',
        duration_seconds: 4,
        title_text: 'STOP BURNING YOUR COFFEE',
        subtitle_text: '3 brewing rules you need right now',
        bg_gradient: 'linear-gradient(135deg, #1E1B4B 0%, #4338CA 100%)',
        badge_text: 'PRO BARISTA TIP',
        zoom_effect: 'in'
      },
      {
        id: 's2',
        duration_seconds: 4,
        title_text: 'RULE 1: WATER AT 200°F',
        subtitle_text: 'Boiling water destroys delicate aromatics',
        bg_gradient: 'linear-gradient(135deg, #2E1065 0%, #7C3AED 100%)',
        badge_text: 'STEP 01',
        zoom_effect: 'out'
      },
      {
        id: 's3',
        duration_seconds: 4,
        title_text: 'FOLLOW FOR MORE TIPS',
        subtitle_text: 'Grab fresh beans via link in bio',
        bg_gradient: 'linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)',
        badge_text: '@BREWANDBEAN',
        zoom_effect: 'pan'
      }
    ]
  }
];

// ==========================================
// PHASE 5: AI ONE-PAGE WEBSITE PRESETS
// ==========================================
export const DEFAULT_WEBSITE_DATA: WebsiteData = {
  id: 'site_brew_bean',
  slug: 'brew-and-bean',
  business_name: 'Brew & Bean Specialty Coffee',
  industry: 'Specialty Cafe & Micro-Roastery',
  template_type: 'cafe',
  primary_color: '#7C3AED',
  secondary_color: '#F59E0B',
  hero: {
    headline: 'Artisanal Coffee Roasted With Uncompromising Passion',
    tagline: 'Experience single-origin pour overs, velvety organic matcha, and house-made pastries in the heart of the city.',
    cta_button_text: 'Explore Cafe Menu',
    hero_image_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&auto=format&fit=crop&q=80'
  },
  about: {
    title: 'Crafted in Small Batches, Served With Warmth',
    story: 'Founded in 2024, Brew & Bean started with a simple belief: morning routines deserve extraordinary quality. Every batch of single-origin green coffee is ethically sourced from family-run farms in Colombia, Ethiopia, and Guatemala, then micro-roasted in-house to preserve peak floral and chocolate tasting notes.',
    bullet_points: [
      '100% Ethically Sourced Single-Origin Beans',
      'Fresh Roasted Weekly In Small 10kg Batches',
      'Plant-Based Oat, Almond, and Organic Dairy Options',
      'Complimentary Ultra-Fast Fiber Wi-Fi for Remote Workers'
    ]
  },
  offerings: [
    { id: '1', name: 'Ethiopian Yirgacheffe Pour Over', price: '$5.50', description: 'Floral jasmine aromatics, sweet bergamot, crisp peach finish.', badge: 'Bestseller' },
    { id: '2', name: 'Ceremonial Uji Matcha Latte', price: '$6.00', description: 'First-harvest Kyoto matcha whisked with velvety steamed oat milk.', badge: 'Popular' },
    { id: '3', name: 'House Vanilla Cold Foam Cold Brew', price: '$5.75', description: '18-hour slow steeped cold brew topped with Madagascar vanilla cream.' },
    { id: '4', name: 'Fresh Flaky Butter Croissant', price: '$4.25', description: 'Baked daily at 6 AM using imported French cultured butter.' }
  ],
  testimonials: [
    { name: 'Elena Rostova', role: 'Daily Regular', comment: 'The pour over here ruined all other coffee for me. Hands down the smoothest roast in town!', rating: 5 },
    { name: 'Marcus Chen', role: 'Remote Software Engineer', comment: 'Cozy seating, fast Wi-Fi, and baristas who genuinely care about the craft. My go-to workspace.', rating: 5 },
    { name: 'Sarah Jenkins', role: 'Food Critic', comment: 'Brew & Bean is elevating third-wave coffee culture without the pretension. Truly exceptional.', rating: 5 }
  ],
  contact_email: 'hello@brewandbean.demo',
  contact_phone: '+1 (555) 234-5678',
  address: '142 Market Street, Downtown Arts District',
  hours: 'Mon - Fri: 7:00 AM - 6:00 PM | Sat - Sun: 8:00 AM - 7:00 PM',
  published: true,
  published_url: 'https://brew-and-bean.markai.site',
  created_at: new Date().toISOString()
};

// ==========================================
// PHASE 6: AUTONOMOUS CMO AGENT PRESETS
// ==========================================
export const DEFAULT_STRATEGY_RECOMMENDATIONS: StrategyRecommendation[] = [
  {
    id: 'strat_1',
    category: 'format',
    title: 'Increase Carousel Educational Content (+20%)',
    insight: 'Your 5-slide educational carousels generated 3.4x more saves and 85% higher profile visits compared to single-image promos.',
    action_item: 'Schedule 2 educational carousel breakdowns per week on Tuesdays & Thursdays.',
    expected_impact: '+45% Increase in Bookmark Saves',
    impact_score: 92
  },
  {
    id: 'strat_2',
    category: 'timing',
    title: 'Shift Morning Publishing to 8:15 AM Window',
    insight: 'Commute-hour engagement peaks sharply between 8:00 AM and 8:30 AM for your local cafe demographic.',
    action_item: 'Auto-schedule morning announcements to 8:15 AM instead of 10:00 AM.',
    expected_impact: '+28% Higher First-Hour Impressions',
    impact_score: 86
  },
  {
    id: 'strat_3',
    category: 'growth',
    title: 'Launch Autumn Seasonal Hashtag Cluster',
    insight: 'Hashtags like #FallCoffeeLaunch and #AutumnVibes are surging with 240% week-over-week discovery volume.',
    action_item: 'Deploy targeted Autumn hashtag cluster across upcoming September posts.',
    expected_impact: '+1,200 New Non-Follower Reach',
    impact_score: 79
  }
];

export const DEFAULT_AUTOPILOT_CAMPAIGN: AutopilotCampaign = {
  id: 'auto_sept_2026',
  name: 'September 2026 Omnichannel Autopilot',
  month: 'September 2026',
  total_posts_planned: 16,
  platforms_targeted: ['instagram', 'facebook', 'twitter'],
  status: 'active',
  generated_posts_count: 16,
  scheduled_posts_count: 12,
  weekly_digest_summary: 'MarkAI Autonomous CMO has generated and distributed 16 campaigns across Instagram, Facebook, and Twitter. Projected monthly reach: 55,000+ targeted impressions.',
  created_at: new Date().toISOString()
};
