import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Layout } from '@/components/Layout';
import { usePost } from '@/context/PostContext';
import { useAuth } from '@/context/AuthContext';
import { BusinessProfile, ToneType, PostFormat } from '@/lib/types';
import { DEMO_PRESET_PROFILES } from '@/lib/mockData';
import { 
  Sparkles, 
  Building2, 
  Tag, 
  Users, 
  ArrowRight, 
  Zap, 
  CheckCircle2, 
  Lightbulb,
  Cpu,
  Layers,
  Film,
  Image as ImageIcon,
  Palette
} from 'lucide-react';

const TONE_OPTIONS: { value: ToneType; label: string; description: string; emoji: string }[] = [
  { value: 'playful', label: 'Playful & Witty', description: 'Fun, engaging, and lighthearted with catchy emojis', emoji: '🎉' },
  { value: 'casual', label: 'Casual & Friendly', description: 'Approachable, warm, conversational peer-to-peer tone', emoji: '☕' },
  { value: 'bold', label: 'Bold & High-Energy', description: 'Confident, urgent, punchy, and direct', emoji: '🔥' },
  { value: 'inspiring', label: 'Inspiring & Story-driven', description: 'Uplifting, emotional, mission-focused, authentic', emoji: '✨' },
  { value: 'formal', label: 'Formal & Professional', description: 'Polished, authoritative, industry-standard B2B style', emoji: '💼' },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { 
    currentProfile, 
    setCurrentProfile, 
    brandKit, 
    setBrandKit, 
    generatePost, 
    isGenerating,
    selectedFormat,
    setSelectedFormat 
  } = usePost();

  const [formData, setFormData] = useState<BusinessProfile>(currentProfile);
  const [error, setError] = useState<string | null>(null);

  const handlePresetSelect = (preset: typeof DEMO_PRESET_PROFILES[0]) => {
    setFormData(preset.profile);
    setCurrentProfile(preset.profile);
    if (preset.brandKit) {
      setBrandKit(preset.brandKit);
    }
  };

  const handleChange = (field: keyof BusinessProfile, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.business_name.trim() || !formData.industry.trim() || !formData.description.trim()) {
      setError('Please fill in Business Name, Industry, and Product Description.');
      return;
    }
    setError(null);

    try {
      setCurrentProfile(formData);
      await generatePost(formData, selectedFormat);
      router.push('/preview');
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to generate post. Please try again.');
    }
  };

  return (
    <Layout title="Dashboard — Business Profile & AI Post Generator">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Header Card */}
        <div className="card-glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/30">
                  Step 1 of 2 · Content Engine
                </span>
                <Link
                  href="/voice-onboarding"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30 hover:bg-fuchsia-500/30 transition shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>🎙️ Speak via Voice AI</span>
                </Link>
                <Link
                  href="/brand-kit"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-violet-500/15 text-violet-300 border border-violet-500/30 hover:bg-violet-500/25 transition"
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Brand Kit Active</span>
                </Link>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white mt-2 tracking-tight">
                Business Profile & Multi-Format AI
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Define your profile and select your format. MarkAI uses Anthropic Claude to craft on-brand copy, carousel slide outlines, and viral Reels scripts.
              </p>
            </div>

            {/* Quick Demo Presets */}
            <div className="flex flex-col items-start lg:items-end gap-2">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                Pitch Competition Presets:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {DEMO_PRESET_PROFILES.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePresetSelect(p)}
                    className="px-3 py-1.5 text-xs font-bold rounded-xl bg-white/[0.05] hover:bg-white/10 text-slate-200 border border-white/10 hover:border-fuchsia-500/40 transition"
                  >
                    {p.label.split(' ')[0]} {p.profile.business_name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Format Selector Bar */}
        <div className="card-glass rounded-2xl p-3 sm:p-4 border border-white/10 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-fuchsia-400" />
            <span>Select Target Post Format:</span>
          </span>

          <div className="grid grid-cols-3 gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setSelectedFormat('single_image')}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                selectedFormat === 'single_image'
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Single Post</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedFormat('carousel')}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                selectedFormat === 'carousel'
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Carousel Outline</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedFormat('reels_script')}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                selectedFormat === 'reels_script'
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              <Film className="w-4 h-4" />
              <span>Reels Script</span>
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Form Controls */}
          <div className="lg:col-span-7">
            <div className="card-glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10">
              <form onSubmit={handleGenerate} className="space-y-5">
                
                {error && (
                  <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300">
                    {error}
                  </div>
                )}

                {/* 1. Business Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">
                    1. Business Name <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={formData.business_name}
                      onChange={(e) => handleChange('business_name', e.target.value)}
                      placeholder="e.g. Brew & Bean Specialty Coffee"
                      className="w-full bg-space-950/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-fuchsia focus:ring-1 focus:ring-brand-fuchsia transition"
                      required
                    />
                  </div>
                </div>

                {/* 2. Industry */}
                <div>
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">
                    2. Industry / Category <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Tag className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={formData.industry}
                      onChange={(e) => handleChange('industry', e.target.value)}
                      placeholder="e.g. Specialty Coffee, Fitness Apparel, Clean Skincare"
                      className="w-full bg-space-950/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-fuchsia focus:ring-1 focus:ring-brand-fuchsia transition"
                      required
                    />
                  </div>
                </div>

                {/* 3. Product / Service Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">
                    3. Product or Service Description <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      placeholder="What makes your product special? Mention key benefits, unique selling points, or offers..."
                      className="w-full bg-space-950/80 border border-white/10 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-fuchsia focus:ring-1 focus:ring-brand-fuchsia transition resize-none"
                      required
                    />
                  </div>
                </div>

                {/* 4. Target Audience */}
                <div>
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">
                    4. Target Audience
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={formData.target_audience}
                      onChange={(e) => handleChange('target_audience', e.target.value)}
                      placeholder="e.g. Coffee lovers, remote workers, athletes aged 20-38"
                      className="w-full bg-space-950/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-fuchsia focus:ring-1 focus:ring-brand-fuchsia transition"
                    />
                  </div>
                </div>

                {/* 5. Tone of Voice */}
                <div>
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">
                    5. Brand Tone of Voice
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {TONE_OPTIONS.map((t) => {
                      const isSelected = formData.tone === t.value;
                      return (
                        <button
                          key={t.value}
                          type="button"
                          onClick={() => handleChange('tone', t.value)}
                          className={`flex items-start gap-2.5 p-3 rounded-2xl border text-left transition ${
                            isSelected
                              ? 'bg-fuchsia-500/15 border-fuchsia-400 text-white ring-1 ring-fuchsia-400/40 shadow-lg'
                              : 'bg-space-950/50 border-white/[0.06] text-slate-400 hover:border-white/20'
                          }`}
                        >
                          <span className="text-xl flex-shrink-0">{t.emoji}</span>
                          <div>
                            <p className="text-xs font-bold text-slate-200">{t.label}</p>
                            <p className="text-[11px] text-slate-400 leading-tight mt-0.5">{t.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="btn-primary w-full py-4 px-6 rounded-2xl text-sm sm:text-base font-extrabold shadow-xl"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Claude AI is Crafting {selectedFormat.replace('_', ' ')}...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 text-amber-300" />
                        <span>Generate AI {selectedFormat === 'carousel' ? 'Carousel Outline' : selectedFormat === 'reels_script' ? 'Reels Script' : 'Post & Graphic'}</span>
                        <ArrowRight className="w-5 h-5 ml-1" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right: Live Prompt Preview & Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="card-glass rounded-3xl p-6 shadow-2xl border border-white/10">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-300" />
                  <span>Prompt Context Memory</span>
                </span>
                <Link href="/brand-kit" className="text-[11px] font-semibold text-fuchsia-400 hover:text-fuchsia-300">
                  Edit Brand Kit →
                </Link>
              </div>

              <div className="mt-4 space-y-3 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px] font-medium">Brand Name:</span>
                  <span className="text-slate-100 font-bold">{formData.business_name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px] font-medium">Format:</span>
                  <span className="text-fuchsia-400 font-bold uppercase">{selectedFormat.replace('_', ' ')}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px] font-medium">Brand Guidelines Injected:</span>
                  <span className="text-slate-300 font-normal line-clamp-2">
                    {brandKit.brand_voice_guidelines || 'Active'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px] font-medium">Active Brand Rules:</span>
                  <span className="text-emerald-400 font-medium">
                    {brandKit.dos_list.length} Do's · {brandKit.donts_list.length} Don'ts
                  </span>
                </div>
              </div>
            </div>

            {/* Link to Calendar CTA */}
            <div className="card-glass rounded-3xl p-6 shadow-2xl border border-white/10 bg-gradient-to-br from-space-900/90 to-amber-950/30">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Plan Ahead for September 2026</span>
              </h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Use the 30-Day Content Calendar to automatically generate seasonal campaigns for Fall Launch, College Pitch Day, and Coffee Day.
              </p>
              <Link
                href="/calendar"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold transition"
              >
                <span>Open Content Calendar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
