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
      <section className="pt-8 pb-16 sm:pt-14 sm:pb-20 text-center relative">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-kanchipuram-light border border-kanchipuram-border text-xs font-medium text-kanchipuram mb-6">
          <Sparkles className="w-4 h-4 text-tumbler" />
          <span>Theervu&apos;athon Pitch Competition MVP · Demo Live</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight max-w-4xl mx-auto leading-[1.15] text-ink">
          Turn Your Local Business Into a{' '}
          <span className="text-kanchipuram">Social Media Powerhouse</span>{' '}
          with MarkAI
        </h1>

        <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto mt-5 leading-relaxed">
          Stop struggling with captions and graphic design. Speak naturally in Tamil or English — MarkAI crafts on-brand copy, generates branded graphics, and auto-posts to Instagram in 30 seconds.
        </p>

        {/* Dual CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-8">
          <Link
            href="/voice-onboarding"
            className="btn-primary w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-semibold shadow-md flex items-center justify-center gap-2"
          >
            <span>Start with Voice AI</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href="#demo"
            className="btn-secondary w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 text-tumbler fill-tumbler" />
            <span>See Interactive Demo</span>
          </a>

          <button
            onClick={handleLaunchDemo}
            className="px-5 py-3.5 rounded-xl bg-tumbler-light hover:bg-amber-100 text-tumbler border border-tumbler-border text-xs font-semibold transition flex items-center justify-center gap-1.5 w-full sm:w-auto"
          >
            <Zap className="w-4 h-4" />
            <span>Instant Pitch Demo Access</span>
          </button>
        </div>

        {/* Hero Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-14 text-left">
          <div className="card p-4 rounded-xl border border-border">
            <span className="text-2xl sm:text-3xl font-display font-bold text-ink">5 Sec</span>
            <p className="text-xs text-muted mt-0.5">Voice-to-Copy Speed</p>
          </div>
          <div className="card p-4 rounded-xl border border-border">
            <span className="text-2xl sm:text-3xl font-display font-bold text-kanchipuram">1-Click</span>
            <p className="text-xs text-muted mt-0.5">Meta Graph Auto-Post</p>
          </div>
          <div className="card p-4 rounded-xl border border-border">
            <span className="text-2xl sm:text-3xl font-display font-bold text-tumbler">1080px</span>
            <p className="text-xs text-muted mt-0.5">Branded Canvas Studio</p>
          </div>
          <div className="card p-4 rounded-xl border border-border">
            <span className="text-2xl sm:text-3xl font-display font-bold text-success">100%</span>
            <p className="text-xs text-muted mt-0.5">Pitch-Ready Fallbacks</p>
          </div>
        </div>
      </section>

      {/* 2. PROBLEM & SOLUTION SECTION */}
      <section className="py-14 border-t border-border" id="problem-solution">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-tumbler bg-tumbler-light px-3 py-1 rounded-full border border-tumbler-border">
            The Micro-Business Challenge
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink mt-3 tracking-tight">
            Why 80% of Home Businesses Struggle Online
          </h2>
          <p className="text-sm text-muted mt-2">
            Managing organic social presence without a dedicated marketing team is overwhelming. MarkAI fixes the 3 critical bottlenecks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Time */}
          <div className="card rounded-2xl p-6 flex flex-col justify-between border border-border">
            <div>
              <div className="w-10 h-10 rounded-xl bg-danger-light text-danger border border-danger-border flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-danger uppercase tracking-wider">Pain Point #1</span>
              <h3 className="text-lg font-display font-bold text-ink mt-1">Zero Time to Create</h3>
              <p className="text-xs text-muted mt-2 leading-relaxed">
                Founders spend 5-10 hours every week staring at a blank screen trying to brainstorm captions, research hashtags, and remember when to post.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-border">
              <span className="text-xs font-semibold text-success flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-4 h-4" /> MarkAI Solution:
              </span>
              <p className="text-xs text-ink-soft">
                Speak for 30 seconds — AI generates complete high-converting copy in <strong>&lt; 5 seconds</strong>.
              </p>
            </div>
          </div>

          {/* Card 2: Design */}
          <div className="card rounded-2xl p-6 flex flex-col justify-between border border-border">
            <div>
              <div className="w-10 h-10 rounded-xl bg-tumbler-light text-tumbler border border-tumbler-border flex items-center justify-center mb-4">
                <Palette className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-tumbler uppercase tracking-wider">Pain Point #2</span>
              <h3 className="text-lg font-display font-bold text-ink mt-1">No Design Experience</h3>
              <p className="text-xs text-muted mt-2 leading-relaxed">
                Canva and Photoshop require tedious manual layout tweaks. Templates often look inconsistent with local branding and festival aesthetics.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-border">
              <span className="text-xs font-semibold text-success flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-4 h-4" /> MarkAI Solution:
              </span>
              <p className="text-xs text-ink-soft">
                Built-in <strong>HTML5 Canvas Studio</strong> automatically renders branded text-overlay graphics with 5 curated regional palettes.
              </p>
            </div>
          </div>

          {/* Card 3: Budget */}
          <div className="card rounded-2xl p-6 flex flex-col justify-between border border-border">
            <div>
              <div className="w-10 h-10 rounded-xl bg-kanchipuram-light text-kanchipuram border border-kanchipuram-border flex items-center justify-center mb-4">
                <DollarSign className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-kanchipuram uppercase tracking-wider">Pain Point #3</span>
              <h3 className="text-lg font-display font-bold text-ink mt-1">No Agency Budget</h3>
              <p className="text-xs text-muted mt-2 leading-relaxed">
                Marketing agencies charge ₹25,000 to ₹50,000/month — far out of reach for home bakers, boutique saree stores, and local cafes.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-border">
              <span className="text-xs font-semibold text-success flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-4 h-4" /> MarkAI Solution:
              </span>
              <p className="text-xs text-ink-soft">
                Full AI content creation &amp; 1-click Instagram posting at zero overhead cost.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section className="py-14 border-t border-border" id="how-it-works">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-kanchipuram bg-kanchipuram-light px-3 py-1 rounded-full border border-kanchipuram-border">
            Frictionless 4-Step Engine
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink mt-3 tracking-tight">
            How MarkAI Works in 30 Seconds
          </h2>
          <p className="text-sm text-muted mt-2">
            No complex menus or confusing dashboards. Speak your mind and let AI do the rest.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Step 1 */}
          <div className="card rounded-2xl p-6 relative border border-border">
            <span className="absolute top-4 right-4 text-3xl font-display font-bold text-gray-200">01</span>
            <div className="w-10 h-10 rounded-xl bg-kanchipuram-light text-kanchipuram border border-kanchipuram-border flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="text-base font-display font-bold text-ink">Voice or Form</h4>
            <p className="text-xs text-muted mt-2 leading-relaxed">
              Speak about your shop or enter business name, offerings, audience, and preferred tone.
            </p>
          </div>

          {/* Step 2 */}
          <div className="card rounded-2xl p-6 relative border border-border">
            <span className="absolute top-4 right-4 text-3xl font-display font-bold text-gray-200">02</span>
            <div className="w-10 h-10 rounded-xl bg-tumbler-light text-tumbler border border-tumbler-border flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-base font-display font-bold text-ink">Claude AI Engine</h4>
            <p className="text-xs text-muted mt-2 leading-relaxed">
              Anthropic Claude crafts story hooks, tailored copy, high-reach hashtags, and post themes.
            </p>
          </div>

          {/* Step 3 */}
          <div className="card rounded-2xl p-6 relative border border-border">
            <span className="absolute top-4 right-4 text-3xl font-display font-bold text-gray-200">03</span>
            <div className="w-10 h-10 rounded-xl bg-marigold-light text-tumbler border border-tumbler-border flex items-center justify-center mb-4">
              <Palette className="w-5 h-5" />
            </div>
            <h4 className="text-base font-display font-bold text-ink">Branded Graphic</h4>
            <p className="text-xs text-muted mt-2 leading-relaxed">
              HTML5 Canvas renders instant 1080×1080 high-res visual banner with custom color theme.
            </p>
          </div>

          {/* Step 4 */}
          <div className="card rounded-2xl p-6 relative border border-border">
            <span className="absolute top-4 right-4 text-3xl font-display font-bold text-gray-200">04</span>
            <div className="w-10 h-10 rounded-xl bg-success-light text-success border border-success-border flex items-center justify-center mb-4">
              <Instagram className="w-5 h-5" />
            </div>
            <h4 className="text-base font-display font-bold text-ink">1-Click Publish</h4>
            <p className="text-xs text-muted mt-2 leading-relaxed">
              Push directly to your Instagram Business account via Meta Graph API with live logging.
            </p>
          </div>
        </div>
      </section>

      {/* 4. FEATURE HIGHLIGHTS */}
      <section className="py-14 border-t border-border" id="features">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-kanchipuram bg-kanchipuram-light px-3 py-1 rounded-full border border-kanchipuram-border">
            Engineered For Impact
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink mt-3 tracking-tight">
            Core Architecture Built for Theervu&apos;athon Pitch
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="card rounded-2xl p-6 flex items-start gap-4 border border-border">
            <div className="p-3 rounded-xl bg-kanchipuram-light text-kanchipuram border border-kanchipuram-border flex-shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-display font-bold text-ink">Anthropic Claude AI Backend</h3>
              <p className="text-xs text-muted mt-1.5 leading-relaxed">
                Powered by Claude 3.5 Sonnet via secure server-side API routes. Generates structured JSON with hook-driven captions, viral hashtags, visual concepts, and optimal posting windows.
              </p>
            </div>
          </div>

          <div className="card rounded-2xl p-6 flex items-start gap-4 border border-border">
            <div className="p-3 rounded-xl bg-tumbler-light text-tumbler border border-tumbler-border flex-shrink-0">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-display font-bold text-ink">HTML5 Canvas Graphic Generator</h3>
              <p className="text-xs text-muted mt-1.5 leading-relaxed">
                Fast, zero-latency creative generation. Automatically creates 1080×1080 branded text-overlay graphics with customizable color themes without paid render APIs.
              </p>
            </div>
          </div>

          <div className="card rounded-2xl p-6 flex items-start gap-4 border border-border">
            <div className="p-3 rounded-xl bg-danger-light text-danger border border-danger-border flex-shrink-0">
              <Instagram className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-display font-bold text-ink">Meta Graph API Social Posting</h3>
              <p className="text-xs text-muted mt-1.5 leading-relaxed">
                Direct integration with Instagram Business Content Publishing API. Supports both live production tokens and an automatic sandbox demo mode for pitch evaluations.
              </p>
            </div>
          </div>

          <div className="card rounded-2xl p-6 flex items-start gap-4 border border-border">
            <div className="p-3 rounded-xl bg-success-light text-success border border-success-border flex-shrink-0">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-display font-bold text-ink">Post History &amp; Memory</h3>
              <p className="text-xs text-muted mt-1.5 leading-relaxed">
                Persistent tracking of all draft, published, and scheduled posts with full timestamps, captions, thumbnail graphics, and Instagram Media IDs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. LIVE INTERACTIVE DEMO TEASER */}
      <section className="py-14 border-t border-border" id="demo">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tumbler-light text-tumbler text-xs font-semibold border border-tumbler-border mb-3">
            <Zap className="w-3.5 h-3.5" /> Interactive UI Preview
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink tracking-tight">
            See the MarkAI Cockpit in Action
          </h2>
          <p className="text-sm text-muted mt-2">
            Switch between business presets to inspect real-time copy and canvas creative generation.
          </p>

          {/* Preset Switcher Tabs */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setActiveDemoTab('coffee')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                activeDemoTab === 'coffee'
                  ? 'bg-kanchipuram text-white shadow-sm'
                  : 'bg-surface text-muted hover:text-ink border border-border'
              }`}
            >
              ☕ Brew &amp; Bean Co.
            </button>
            <button
              onClick={() => setActiveDemoTab('fitness')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                activeDemoTab === 'fitness'
                  ? 'bg-kanchipuram text-white shadow-sm'
                  : 'bg-surface text-muted hover:text-ink border border-border'
              }`}
            >
              🏃‍♂️ FitPulse Apparel
            </button>
            <button
              onClick={() => setActiveDemoTab('skincare')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                activeDemoTab === 'skincare'
                  ? 'bg-kanchipuram text-white shadow-sm'
                  : 'bg-surface text-muted hover:text-ink border border-border'
              }`}
            >
              🌿 GlowLab Skincare
            </button>
          </div>
        </div>

        {/* Mockup Preview Card */}
        <div className="card rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto shadow-card border border-border">
          <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-medium text-muted">markai.app/preview</span>
            </div>
            <button
              onClick={handleLaunchDemo}
              className="btn-primary px-4 py-1.5 rounded-lg text-xs font-semibold"
            >
              <Zap className="w-3.5 h-3.5 text-marigold" />
              <span>Launch Live Interactive App</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left: Generated Copy Preview */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-kanchipuram uppercase tracking-wider">
                  Generated Caption &amp; Hashtags
                </span>
                <span className="text-[11px] font-medium text-success bg-success-light px-2 py-0.5 rounded-full border border-success-border">
                  Optimal: {activeDemo.time}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-border space-y-2.5">
                <h4 className="text-sm font-semibold text-ink">{activeDemo.theme}</h4>
                <p className="text-xs text-muted leading-relaxed whitespace-pre-line">
                  {activeDemo.caption}
                </p>
                <div className="flex flex-wrap gap-1 pt-2 border-t border-border">
                  {activeDemo.hashtags.map((tag, i) => (
                    <span key={i} className="text-[11px] font-medium text-kanchipuram bg-kanchipuram-light px-2 py-0.5 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleLaunchDemo}
                  className="btn-instagram px-4 py-2.5 rounded-xl text-xs font-semibold flex-1"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Test Post to Instagram</span>
                </button>
                <button
                  onClick={handleLaunchDemo}
                  className="btn-secondary px-4 py-2.5 rounded-xl text-xs font-medium"
                >
                  Edit Caption
                </button>
              </div>
            </div>

            {/* Right: Creative Graphic Mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <div
                className="w-full max-w-[260px] aspect-square rounded-2xl p-5 shadow-md flex flex-col justify-between text-white relative overflow-hidden group"
                style={{ background: activeDemo.gradient }}
              >
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-md text-[10px] font-medium tracking-wider uppercase self-start">
                  <span>{activeDemo.name}</span>
                </div>
                <div>
                  <span className="text-2xl font-serif text-white/40 block leading-none">“</span>
                  <p className="text-sm font-bold leading-snug tracking-tight">
                    {activeDemo.theme}
                  </p>
                  <div className="w-10 h-1 bg-marigold mt-2 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between text-[9px] font-semibold text-white/90 uppercase pt-2 border-t border-white/20">
                  <span>TAP LINK IN BIO</span>
                  <span className="opacity-80">@markai</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION FOOTER BANNER */}
      <section className="py-14">
        <div className="card rounded-2xl p-8 sm:p-12 text-center max-w-4xl mx-auto border border-kanchipuram-border bg-gradient-to-b from-kanchipuram-light/50 to-surface">
          <div className="max-w-xl mx-auto space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-kanchipuram bg-kanchipuram-light px-3 py-1 rounded-full border border-kanchipuram-border">
              Theervu&apos;athon Pitch Ready
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-ink tracking-tight">
              Ready to Automate Your Business Marketing?
            </h2>
            <p className="text-sm text-muted">
              Join local merchants saving 10+ hours every week with MarkAI&apos;s voice-first content generation and Instagram publishing.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/voice-onboarding"
                className="btn-primary px-7 py-3.5 rounded-xl text-sm font-semibold w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <span>Try Voice Setup</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={handleLaunchDemo}
                className="btn-secondary px-6 py-3.5 rounded-xl text-xs font-semibold w-full sm:w-auto"
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
