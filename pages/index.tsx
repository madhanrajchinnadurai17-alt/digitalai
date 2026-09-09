import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { 
  Sparkles, 
  ArrowRight, 
  Play, 
  Clock, 
  Palette, 
  DollarSign, 
  Send, 
  CheckCircle2, 
  Instagram, 
  Zap, 
  ShieldCheck, 
  Layers, 
  BarChart3, 
  Cpu, 
  ChevronRight,
  Eye
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const { loginAsDemoUser } = useAuth();
  const [activeDemoTab, setActiveDemoTab] = useState<'coffee' | 'fitness' | 'skincare'>('coffee');

  const handleLaunchDemo = () => {
    loginAsDemoUser();
    router.push('/dashboard');
  };

  const sampleDemos = {
    coffee: {
      name: 'Brew & Bean Specialty Coffee',
      theme: 'Morning Ritual: Single-Origin Pour Over Spotlight',
      caption: 'Your morning deserves better than burnt drip coffee. ☕✨ Every single bean at Brew & Bean is hand-roasted in small batches to preserve sweet caramel notes.',
      hashtags: ['#SpecialtyCoffee', '#CoffeeLovers', '#LocalRoastery', '#PourOverCoffee'],
      time: 'Tue & Thu at 8:15 AM',
      gradient: 'linear-gradient(135deg, #f97316 0%, #ec4899 50%, #8b5cf6 100%)',
    },
    fitness: {
      name: 'FitPulse Activewear',
      theme: 'Engineered for Performance. Crafted for the Planet.',
      caption: 'Zero excuses. 100% recycled high-performance gear. 🔥 Meet our flagship athletic wear — ultra-breathable, squat-proof, and designed to move with you.',
      hashtags: ['#FitPulse', '#Activewear', '#GymAesthetics', '#EcoFitness'],
      time: 'Mon & Wed at 6:30 PM',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #ec4899 100%)',
    },
    skincare: {
      name: 'GlowLab Botanical Skincare',
      theme: 'Clean Ingredients. Radiant Skin Barrier Protection.',
      caption: 'Feed your skin with what it truly craves. 🌿 Dermatologist-tested serums crafted with vegan hyaluronic acid and soothing chamomile extract.',
      hashtags: ['#CleanBeauty', '#GlowLab', '#BarrierRepair', '#VeganSkincare'],
      time: 'Sun & Wed at 11:00 AM',
      gradient: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #10b981 100%)',
    }
  };

  const activeDemo = sampleDemos[activeDemoTab];

  return (
    <Layout title="MarkAI — Voice-First AI Social Media Engine for Local Business">
      
      {/* 1. HERO SECTION */}
      <section className="pt-10 pb-16 sm:pt-16 sm:pb-24 border-b border-grey-hairline text-left">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-primary font-semibold px-2.5 py-1 rounded bg-primary-light border border-primary-border mb-4">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Autonomous Social Marketing for Micro-Enterprises</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif font-bold tracking-tight leading-[1.1] text-ink">
            Speak your business.<br />
            <span className="text-primary">Publish on-brand social copy</span> in thirty seconds.
          </h1>

          <p className="text-base sm:text-lg text-grey max-w-2xl mt-6 leading-relaxed">
            Stop struggling with caption blocks and manual graphics. Speak naturally in Tamil, English, or Tanglish — MarkAI extracts your business profile, generates branded copy and canvas creative, and publishes directly to Instagram.
          </p>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-8">
            <Link
              href="/voice-onboarding"
              className="btn-primary w-full sm:w-auto px-7 py-3 rounded-md text-xs sm:text-sm font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-indigo-500/25"
            >
              <span>Begin Voice Setup</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLaunchDemo}
              className="btn-secondary w-full sm:w-auto px-6 py-3 rounded-md text-xs sm:text-sm font-medium"
            >
              Launch Pitch Demo
            </button>
          </div>
        </div>

        {/* Hero Ledger Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mt-14 pt-8 border-t border-grey-hairline">
          <div className="p-4 rounded-md bg-white border border-grey-hairline shadow-sm">
            <span className="text-3xl font-serif font-bold text-primary">5s</span>
            <p className="text-xs font-mono text-grey mt-1">Voice Extraction Latency</p>
          </div>
          <div className="p-4 rounded-md bg-white border border-grey-hairline shadow-sm">
            <span className="text-3xl font-serif font-bold text-success">1-Click</span>
            <p className="text-xs font-mono text-grey mt-1">Meta Graph Publishing</p>
          </div>
          <div className="p-4 rounded-md bg-white border border-grey-hairline shadow-sm">
            <span className="text-3xl font-serif font-bold text-ink">1080px</span>
            <p className="text-xs font-mono text-grey mt-1">Canvas Graphics Engine</p>
          </div>
          <div className="p-4 rounded-md bg-white border border-grey-hairline shadow-sm">
            <span className="text-3xl font-serif font-bold text-pending">0 cost</span>
            <p className="text-xs font-mono text-grey mt-1">Agency Retainer Alternative</p>
          </div>
        </div>
      </section>

      {/* 2. PROBLEM & SOLUTION SECTION */}
      <section className="py-16 border-b border-grey/30" id="problem-solution">
        <div className="mb-12">
          <span className="text-xs font-mono text-grey">
            [The Micro-Enterprise Bottleneck]
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ink mt-2 tracking-tight">
            Why 80% of Home Businesses Struggle Online
          </h2>
          <p className="text-sm text-grey mt-2 max-w-xl">
            Managing organic social media without a dedicated marketing team is overwhelming. MarkAI addresses the three primary obstacles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Time */}
          <div className="card rounded-sm p-6 flex flex-col justify-between border border-grey/30 bg-white">
            <div>
              <span className="text-xs font-mono text-grey">01 / TIME</span>
              <h3 className="text-lg font-serif font-bold text-ink mt-2">Zero Time to Create</h3>
              <p className="text-xs text-grey mt-2 leading-relaxed">
                Founders spend 5 to 10 hours each week staring at a blank screen trying to brainstorm captions, research hashtags, and remember when to post.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-grey/20">
              <span className="text-xs font-mono text-ink block mb-1">
                MarkAI Remedy:
              </span>
              <p className="text-xs text-grey">
                Speak for 30 seconds. Claude AI extracts and generates on-brand copy in seconds.
              </p>
            </div>
          </div>

          {/* Card 2: Design */}
          <div className="card rounded-sm p-6 flex flex-col justify-between border border-grey/30 bg-white">
            <div>
              <span className="text-xs font-mono text-grey">02 / DESIGN</span>
              <h3 className="text-lg font-serif font-bold text-ink mt-2">No Design Experience</h3>
              <p className="text-xs text-grey mt-2 leading-relaxed">
                Design tools require tedious manual layout tweaks. Templates often look inconsistent with local branding and festival aesthetics.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-grey/20">
              <span className="text-xs font-mono text-ink block mb-1">
                MarkAI Remedy:
              </span>
              <p className="text-xs text-grey">
                Built-in HTML5 Canvas Studio renders crisp 1080x1080 text-overlay graphics instantly.
              </p>
            </div>
          </div>

          {/* Card 3: Budget */}
          <div className="card rounded-sm p-6 flex flex-col justify-between border border-grey/30 bg-white">
            <div>
              <span className="text-xs font-mono text-grey">03 / CAPITAL</span>
              <h3 className="text-lg font-serif font-bold text-ink mt-2">No Agency Budget</h3>
              <p className="text-xs text-grey mt-2 leading-relaxed">
                Marketing agencies charge ₹25,000 to ₹50,000 per month — far out of reach for home bakers, boutique saree stores, and local cafes.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-grey/20">
              <span className="text-xs font-mono text-ink block mb-1">
                MarkAI Remedy:
              </span>
              <p className="text-xs text-grey">
                Full AI content creation and direct Instagram posting at zero overhead.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section className="py-16 border-b border-grey/30" id="how-it-works">
        <div className="mb-12">
          <span className="text-xs font-mono text-grey">
            [Workflow Architecture]
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ink mt-2 tracking-tight">
            How MarkAI Operates
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card rounded-sm p-6 border border-grey/30 bg-white">
            <span className="text-xs font-mono text-grey">STAGE 01</span>
            <h4 className="text-base font-serif font-bold text-ink mt-2">Voice Input</h4>
            <p className="text-xs text-grey mt-2 leading-relaxed">
              Speak about your shop in English, Tamil, or Tanglish. Web Speech API captures audio client-side.
            </p>
          </div>

          <div className="card rounded-sm p-6 border border-grey/30 bg-white">
            <span className="text-xs font-mono text-grey">STAGE 02</span>
            <h4 className="text-base font-serif font-bold text-ink mt-2">Claude Engine</h4>
            <p className="text-xs text-grey mt-2 leading-relaxed">
              Anthropic Claude 3.5 Sonnet extracts structured profile data, hooks, and formatted copy.
            </p>
          </div>

          <div className="card rounded-sm p-6 border border-grey/30 bg-white">
            <span className="text-xs font-mono text-grey">STAGE 03</span>
            <h4 className="text-base font-serif font-bold text-ink mt-2">Canvas Creative</h4>
            <p className="text-xs text-grey mt-2 leading-relaxed">
              HTML5 Canvas renders instant 1080×1080 high-resolution visual post without server lag.
            </p>
          </div>

          <div className="card rounded-sm p-6 border border-grey/30 bg-white">
            <span className="text-xs font-mono text-grey">STAGE 04</span>
            <h4 className="text-base font-serif font-bold text-ink mt-2">Publish / Sandbox</h4>
            <p className="text-xs text-grey mt-2 leading-relaxed">
              Dispatches directly to Instagram Business account via Meta Graph API with live verification.
            </p>
          </div>
        </div>
      </section>

      {/* 4. LIVE INTERACTIVE DEMO TEASER */}
      <section className="py-16 border-b border-grey/30" id="demo">
        <div className="mb-8">
          <span className="text-xs font-mono text-grey">
            [Interactive Studio Sandbox]
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ink mt-2 tracking-tight">
            Preview the Studio Output
          </h2>
          <p className="text-sm text-grey mt-2">
            Switch between business presets to inspect generated captions and canvas layouts.
          </p>

          {/* Preset Switcher Tabs */}
          <div className="flex items-center gap-2 mt-6">
            <button
              onClick={() => setActiveDemoTab('coffee')}
              className={`px-3 py-1.5 rounded-sm text-xs font-mono transition ${
                activeDemoTab === 'coffee'
                  ? 'bg-ink text-white'
                  : 'bg-white text-grey hover:text-ink border border-grey/30'
              }`}
            >
              [Brew &amp; Bean Co.]
            </button>
            <button
              onClick={() => setActiveDemoTab('fitness')}
              className={`px-3 py-1.5 rounded-sm text-xs font-mono transition ${
                activeDemoTab === 'fitness'
                  ? 'bg-ink text-white'
                  : 'bg-white text-grey hover:text-ink border border-grey/30'
              }`}
            >
              [FitPulse Apparel]
            </button>
            <button
              onClick={() => setActiveDemoTab('skincare')}
              className={`px-3 py-1.5 rounded-sm text-xs font-mono transition ${
                activeDemoTab === 'skincare'
                  ? 'bg-ink text-white'
                  : 'bg-white text-grey hover:text-ink border border-grey/30'
              }`}
            >
              [GlowLab Botanicals]
            </button>
          </div>
        </div>

        {/* Mockup Preview Card */}
        <div className="card rounded-sm p-6 border border-grey/30 bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left: Generated Copy Preview */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-grey">
                  [Generated Caption &amp; Hashtags]
                </span>
                <span className="text-xs font-mono text-ink">
                  Window: {activeDemo.time}
                </span>
              </div>

              <div className="p-4 rounded-sm bg-white border border-grey/30 space-y-2.5">
                <h4 className="text-sm font-serif font-bold text-ink">{activeDemo.theme}</h4>
                <p className="text-xs text-grey leading-relaxed whitespace-pre-line font-sans">
                  {activeDemo.caption}
                </p>
                <div className="flex flex-wrap gap-1 pt-2 border-t border-grey/20">
                  {activeDemo.hashtags.map((tag, i) => (
                    <span key={i} className="text-[11px] font-mono text-ink">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleLaunchDemo}
                  className="btn-primary px-4 py-2 rounded-sm text-xs font-medium"
                >
                  Open in Cockpit
                </button>
              </div>
            </div>

            {/* Right: Creative Graphic Mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-[260px] aspect-square rounded-sm p-5 border border-ink bg-white flex flex-col justify-between text-ink">
                <div className="text-[10px] font-mono uppercase tracking-wider text-grey">
                  [{activeDemo.name}]
                </div>
                <div>
                  <p className="text-sm font-serif font-bold leading-snug">
                    {activeDemo.theme}
                  </p>
                </div>
                <div className="flex items-center justify-between text-[9px] font-mono text-grey uppercase pt-2 border-t border-grey/20">
                  <span>TAP LINK IN BIO</span>
                  <span>@MARKAI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION FOOTER BANNER */}
      <section className="py-16 text-left">
        <div className="card rounded-sm p-8 sm:p-12 border border-grey/30 bg-white max-w-4xl">
          <div className="space-y-4">
            <span className="text-xs font-mono text-grey">
              [Autonomous Social Marketing Platform]
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ink tracking-tight">
              Ready to automate your social marketing?
            </h2>
            <p className="text-sm text-grey max-w-xl leading-relaxed">
              Eliminate hours of manual social posting every week with voice-first extraction and direct Instagram publishing.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/voice-onboarding"
                className="btn-primary px-7 py-2.5 rounded-sm text-xs font-medium w-full sm:w-auto"
              >
                Start with Voice AI
              </Link>
              <button
                onClick={handleLaunchDemo}
                className="btn-secondary px-6 py-2.5 rounded-sm text-xs font-medium w-full sm:w-auto"
              >
                Instant Pitch Demo Login
              </button>
            </div>
          </div>
        </div>
      </section>

    </Layout>
  );
}
