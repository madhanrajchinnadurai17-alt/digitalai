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
    <Layout title="MarkAI — AI Social Media Content Generator & Instagram Auto-Poster">
      
      {/* 1. HERO SECTION */}
      <section className="pt-10 pb-20 sm:pt-16 sm:pb-28 text-center relative">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-amber-500/10 border border-violet-500/30 text-xs font-bold text-fuchsia-300 mb-8 shadow-lg shadow-violet-500/10 animate-float">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>College Pitch Competition MVP · Demo Live</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-[1.15]">
          Turn Your Small Business Into a{' '}
          <span className="text-gradient-brand">Social Media Powerhouse</span>{' '}
          with <span className="text-gradient-ai">MarkAI</span>
        </h1>

        <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto mt-6 leading-relaxed">
          Stop wasting 10 hours a week struggling with captions and graphic design. MarkAI uses Anthropic Claude to craft on-brand copy, generate branded graphics, and auto-post directly to Instagram in 30 seconds.
        </p>

        {/* Dual CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <Link
            href="/signup"
            className="btn-primary w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-bold shadow-xl shadow-fuchsia-600/30"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href="#demo"
            className="btn-secondary w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span>See Interactive Demo</span>
          </a>

          <button
            onClick={handleLaunchDemo}
            className="px-5 py-4 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition flex items-center justify-center gap-1.5 w-full sm:w-auto"
          >
            <Zap className="w-4 h-4" />
            <span>Instant Pitch Demo Access</span>
          </button>
        </div>

        {/* Hero Floating Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-16 text-left">
          <div className="card-glass p-4 rounded-2xl">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">5 Sec</span>
            <p className="text-xs text-slate-400 mt-0.5">AI Generation Speed</p>
          </div>
          <div className="card-glass p-4 rounded-2xl">
            <span className="text-2xl sm:text-3xl font-extrabold text-fuchsia-400">1-Click</span>
            <p className="text-xs text-slate-400 mt-0.5">Meta Graph Auto-Post</p>
          </div>
          <div className="card-glass p-4 rounded-2xl">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-300">1080px</span>
            <p className="text-xs text-slate-400 mt-0.5">Branded Canvas Studio</p>
          </div>
          <div className="card-glass p-4 rounded-2xl">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">100%</span>
            <p className="text-xs text-slate-400 mt-0.5">Hackathon Ready</p>
          </div>
        </div>
      </section>

      {/* 2. PROBLEM & SOLUTION SECTION */}
      <section className="py-16 border-t border-white/[0.06]" id="problem-solution">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-fuchsia-400 bg-fuchsia-500/10 px-3 py-1 rounded-full border border-fuchsia-500/20">
            The Small Business Struggle
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
            Why 80% of Local Businesses Fail at Social Media
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Managing organic social presence without a dedicated marketing department is painful. MarkAI fixes the 3 critical bottlenecks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Time */}
          <div className="card-glass card-glass-hover rounded-3xl p-7 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center justify-center mb-5">
                <Clock className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">Pain Point #1</span>
              <h3 className="text-xl font-bold text-white mt-1">Zero Time to Create</h3>
              <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                Founders spend 5-10 hours every week staring at a blank screen trying to brainstorm witty captions, research hashtags, and remember when to post.
              </p>
            </div>
            <div className="mt-6 pt-5 border-t border-white/[0.08] bg-violet-950/20 -mx-7 -mb-7 p-5 rounded-b-3xl">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-4 h-4" /> MarkAI Solution:
              </span>
              <p className="text-xs text-slate-300">
                Single-prompt AI generation creates complete high-converting copy in <strong>&lt; 5 seconds</strong>.
              </p>
            </div>
          </div>

          {/* Card 2: Design */}
          <div className="card-glass card-glass-hover rounded-3xl p-7 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center mb-5">
                <Palette className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Pain Point #2</span>
              <h3 className="text-xl font-bold text-white mt-1">No Design Skills</h3>
              <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                Amateur graphic templates look inconsistent and generic. Professional Adobe or Canva workflows require hours of tedious manual tweaking.
              </p>
            </div>
            <div className="mt-6 pt-5 border-t border-white/[0.08] bg-violet-950/20 -mx-7 -mb-7 p-5 rounded-b-3xl">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-4 h-4" /> MarkAI Solution:
              </span>
              <p className="text-xs text-slate-300">
                Client-side <strong>HTML5 Canvas Studio</strong> automatically renders branded text-overlay graphics with 5 curated studio palettes.
              </p>
            </div>
          </div>

          {/* Card 3: Budget */}
          <div className="card-glass card-glass-hover rounded-3xl p-7 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/15 text-fuchsia-400 border border-fuchsia-500/30 flex items-center justify-center mb-5">
                <DollarSign className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-fuchsia-400 uppercase tracking-wider">Pain Point #3</span>
              <h3 className="text-xl font-bold text-white mt-1">No Ad Budget for Agencies</h3>
              <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                Social media marketing agencies charge $2,000 to $5,000 per month — far out of reach for local cafes, gyms, and independent merchants.
              </p>
            </div>
            <div className="mt-6 pt-5 border-t border-white/[0.08] bg-violet-950/20 -mx-7 -mb-7 p-5 rounded-b-3xl">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-4 h-4" /> MarkAI Solution:
              </span>
              <p className="text-xs text-slate-300">
                Enterprise-grade AI content creation & 1-click Instagram posting at a fraction of the cost.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section className="py-16 border-t border-white/[0.06]" id="how-it-works">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            Streamlined 4-Step Pipeline
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
            How MarkAI Works in 30 Seconds
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            No complicated menus or bloated modules. Just one frictionless end-to-end flow.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="card-glass rounded-3xl p-6 relative">
            <span className="absolute top-5 right-5 text-4xl font-extrabold text-white/5 font-mono">01</span>
            <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30 flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Enter Profile</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Input business name, industry, product USP, target audience, and desired tone of voice.
            </p>
          </div>

          {/* Step 2 */}
          <div className="card-glass rounded-3xl p-6 relative">
            <span className="absolute top-5 right-5 text-4xl font-extrabold text-white/5 font-mono">02</span>
            <div className="w-10 h-10 rounded-xl bg-fuchsia-600/20 text-fuchsia-400 border border-fuchsia-500/30 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Claude AI Engine</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Anthropic Claude crafts story hooks, tailored copy, high-reach hashtags, and post themes.
            </p>
          </div>

          {/* Step 3 */}
          <div className="card-glass rounded-3xl p-6 relative">
            <span className="absolute top-5 right-5 text-4xl font-extrabold text-white/5 font-mono">03</span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mb-4">
              <Palette className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Branded Graphic</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              HTML5 Canvas renders instant 1080×1080 high-res visual banner with custom gradient theme.
            </p>
          </div>

          {/* Step 4 */}
          <div className="card-glass rounded-3xl p-6 relative">
            <span className="absolute top-5 right-5 text-4xl font-extrabold text-white/5 font-mono">04</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-4">
              <Instagram className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">1-Click Publish</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Push directly to your Instagram Business account via Meta Graph API and track in Supabase log.
            </p>
          </div>
        </div>
      </section>

      {/* 4. FEATURE HIGHLIGHTS */}
      <section className="py-16 border-t border-white/[0.06]" id="features">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">
            Engineered For Impact
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
            Core Features Built for College Pitch Demo
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card-glass card-glass-hover rounded-3xl p-8 flex items-start gap-5">
            <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white shadow-lg flex-shrink-0">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Anthropic Claude AI Backend</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Powered by Claude 3.5 Sonnet via secure server-side API routes. Generates structured JSON with hook-driven captions, viral hashtags, visual concepts, and optimal posting windows.
              </p>
            </div>
          </div>

          <div className="card-glass card-glass-hover rounded-3xl p-8 flex items-start gap-5">
            <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-fuchsia-600 to-rose-600 text-white shadow-lg flex-shrink-0">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">HTML5 Canvas Graphic Generator</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Fast, zero-latency creative generation. Automatically creates 1080×1080 branded text-overlay graphics with customizable color themes (Sunset, Neon Cyber, Emerald Luxe, Midnight Sleek).
              </p>
            </div>
          </div>

          <div className="card-glass card-glass-hover rounded-3xl p-8 flex items-start gap-5">
            <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white shadow-lg flex-shrink-0">
              <Instagram className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Meta Graph API Social Posting</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Direct integration with Instagram Business Content Publishing API. Supports both live production tokens and an automatic sandbox demo mode for pitch competitions.
              </p>
            </div>
          </div>

          <div className="card-glass card-glass-hover rounded-3xl p-8 flex items-start gap-5">
            <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-500 text-white shadow-lg flex-shrink-0">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Supabase Postgres Post History</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Real-time tracking of all draft, published, and failed posts with full timestamps, captions, thumbnail graphics, and Instagram Media IDs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. LIVE INTERACTIVE DEMO TEASER */}
      <section className="py-16 border-t border-white/[0.06]" id="demo">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-bold border border-amber-500/20 mb-3">
            <Zap className="w-3.5 h-3.5" /> Interactive UI Preview
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            See MarkAI Cockpit in Action
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Switch between business presets to inspect the real-time copy and canvas creative generation.
          </p>

          {/* Preset Switcher Tabs */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setActiveDemoTab('coffee')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeDemoTab === 'coffee'
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-fuchsia-600/25'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              ☕ Brew & Bean Co.
            </button>
            <button
              onClick={() => setActiveDemoTab('fitness')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeDemoTab === 'fitness'
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-fuchsia-600/25'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              🏃‍♂️ FitPulse Apparel
            </button>
            <button
              onClick={() => setActiveDemoTab('skincare')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeDemoTab === 'skincare'
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-fuchsia-600/25'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              🌿 GlowLab Skincare
            </button>
          </div>
        </div>

        {/* Mockup Preview Card */}
        <div className="card-glass rounded-3xl p-6 sm:p-8 max-w-5xl mx-auto shadow-2xl border border-white/10">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
              <span className="text-xs font-mono text-slate-400 ml-2">markai.app/preview</span>
            </div>
            <button
              onClick={handleLaunchDemo}
              className="btn-primary px-4 py-1.5 rounded-xl text-xs font-bold"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Launch Live Interactive App</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left: Generated Copy Preview */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-fuchsia-300 uppercase tracking-wider">
                  Generated Caption & Hashtags
                </span>
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Optimal: {activeDemo.time}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-space-950/80 border border-white/10 space-y-3">
                <h4 className="text-sm font-bold text-white">{activeDemo.theme}</h4>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                  {activeDemo.caption}
                </p>
                <div className="flex flex-wrap gap-1 pt-2 border-t border-white/10">
                  {activeDemo.hashtags.map((tag, i) => (
                    <span key={i} className="text-[11px] font-medium text-brand-violet bg-violet-500/10 px-2 py-0.5 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleLaunchDemo}
                  className="btn-instagram px-5 py-2.5 rounded-xl text-xs font-bold flex-1"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Test Post to Instagram</span>
                </button>
                <button
                  onClick={handleLaunchDemo}
                  className="btn-secondary px-4 py-2.5 rounded-xl text-xs font-bold"
                >
                  Edit Caption
                </button>
              </div>
            </div>

            {/* Right: Creative Graphic Mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <div
                className="w-full max-w-[280px] aspect-square rounded-2xl p-5 shadow-2xl flex flex-col justify-between text-white relative overflow-hidden group border border-white/20"
                style={{ background: activeDemo.gradient }}
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold tracking-wider uppercase self-start">
                  <span>{activeDemo.name}</span>
                </div>
                <div>
                  <span className="text-3xl font-serif text-white/30 block leading-none">“</span>
                  <p className="text-base font-extrabold leading-snug tracking-tight">
                    {activeDemo.theme}
                  </p>
                  <div className="w-12 h-1 bg-amber-300 mt-2 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between text-[9px] font-bold text-amber-200 uppercase pt-2 border-t border-white/20">
                  <span>✨ TAP LINK IN BIO</span>
                  <span className="opacity-70">@markai</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION FOOTER BANNER */}
      <section className="py-16">
        <div className="card-glass rounded-3xl p-8 sm:p-14 text-center max-w-5xl mx-auto relative overflow-hidden border border-fuchsia-500/30 shadow-2xl">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-fuchsia-600/20 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-violet-600/20 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-fuchsia-300 bg-fuchsia-500/10 px-3.5 py-1.5 rounded-full border border-fuchsia-500/30">
              Pitch Competition Special
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Ready to Automate Your Business Social Presence?
            </h2>
            <p className="text-xs sm:text-base text-slate-300">
              Join small business owners saving 10+ hours every week with MarkAI's end-to-end content generation and Instagram auto-posting.
            </p>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/signup"
                className="btn-primary px-8 py-4 rounded-2xl text-sm font-bold w-full sm:w-auto"
              >
                <span>Create Your Account</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={handleLaunchDemo}
                className="btn-secondary px-6 py-4 rounded-2xl text-xs font-bold w-full sm:w-auto"
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
