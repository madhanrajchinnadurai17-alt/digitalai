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
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Top Header Card */}
        <div className="card rounded-2xl p-6 sm:p-8 shadow-card border border-border">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-kanchipuram-light text-kanchipuram border border-kanchipuram-border">
                  Step 1 of 2 · Content Engine
                </span>
                <Link
                  href="/voice-onboarding"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-tumbler-light text-tumbler border border-tumbler-border hover:bg-amber-100 transition shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-marigold" />
                  <span>🎙️ Speak via Voice AI</span>
                </Link>
                <Link
                  href="/brand-kit"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-muted border border-border hover:text-ink transition"
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Brand Kit Active</span>
                </Link>
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink mt-2 tracking-tight">
                Business Profile &amp; Multi-Format AI
              </h1>
              <p className="text-xs sm:text-sm text-muted mt-1 max-w-2xl leading-relaxed">
                Define your profile and select your format. MarkAI uses Anthropic Claude to craft on-brand copy, carousel slide outlines, and viral Reels scripts.
              </p>
            </div>

            {/* Quick Demo Presets */}
            <div className="flex flex-col items-start lg:items-end gap-1.5">
              <span className="text-xs font-semibold text-tumbler flex items-center gap-1.5 uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 text-marigold" />
                Theervu&apos;athon Presets:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {DEMO_PRESET_PROFILES.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePresetSelect(p)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-50 hover:bg-white text-ink border border-border hover:border-kanchipuram transition"
                  >
                    {p.label.split(' ')[0]} {p.profile.business_name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Format Selector Bar */}
        <div className="card rounded-xl p-3 sm:p-4 border border-border shadow-card flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs font-semibold text-ink uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-kanchipuram" />
            <span>Target Post Format:</span>
          </span>

          <div className="grid grid-cols-3 gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setSelectedFormat('single_image')}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
                selectedFormat === 'single_image'
                  ? 'bg-kanchipuram text-white shadow-sm'
                  : 'bg-canvas text-muted hover:text-ink border border-border'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Single Post</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedFormat('carousel')}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
                selectedFormat === 'carousel'
                  ? 'bg-kanchipuram text-white shadow-sm'
                  : 'bg-canvas text-muted hover:text-ink border border-border'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Carousel Outline</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedFormat('reels_script')}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
                selectedFormat === 'reels_script'
                  ? 'bg-kanchipuram text-white shadow-sm'
                  : 'bg-canvas text-muted hover:text-ink border border-border'
              }`}
            >
              <Film className="w-4 h-4" />
              <span>Reels Script</span>
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          
          {/* Left: Form Controls */}
          <div className="lg:col-span-7">
            <div className="card rounded-2xl p-6 sm:p-8 shadow-card border border-border">
              <form onSubmit={handleGenerate} className="space-y-4 sm:space-y-5">
                
                {error && (
                  <div className="p-3.5 rounded-xl bg-danger-light border border-danger-border text-xs text-danger">
                    {error}
                  </div>
                )}

                {/* 1. Business Name */}
                <div>
                  <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                    1. Business Name <span className="text-danger">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      type="text"
                      value={formData.business_name}
                      onChange={(e) => handleChange('business_name', e.target.value)}
                      placeholder="e.g. Brew & Bean Specialty Coffee"
                      className="w-full bg-canvas border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-ink placeholder-muted focus:outline-none focus:border-kanchipuram focus:ring-1 focus:ring-kanchipuram transition"
                      required
                    />
                  </div>
                </div>

                {/* 2. Industry */}
                <div>
                  <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                    2. Industry / Category <span className="text-danger">*</span>
                  </label>
                  <div className="relative">
                    <Tag className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      type="text"
                      value={formData.industry}
                      onChange={(e) => handleChange('industry', e.target.value)}
                      placeholder="e.g. Specialty Coffee, Fitness Apparel, Clean Skincare"
                      className="w-full bg-canvas border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-ink placeholder-muted focus:outline-none focus:border-kanchipuram focus:ring-1 focus:ring-kanchipuram transition"
                      required
                    />
                  </div>
                </div>

                {/* 3. Product / Service Description */}
                <div>
                  <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                    3. Product or Service Description <span className="text-danger">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      placeholder="What makes your product special? Mention key benefits, unique selling points, or offers..."
                      className="w-full bg-canvas border border-border rounded-xl p-3 text-sm text-ink placeholder-muted focus:outline-none focus:border-kanchipuram focus:ring-1 focus:ring-kanchipuram transition resize-none leading-relaxed"
                      required
                    />
                  </div>
                </div>

                {/* 4. Target Audience */}
                <div>
                  <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                    4. Target Audience
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      type="text"
                      value={formData.target_audience}
                      onChange={(e) => handleChange('target_audience', e.target.value)}
                      placeholder="e.g. Coffee lovers, remote workers, athletes aged 20-38"
                      className="w-full bg-canvas border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-ink placeholder-muted focus:outline-none focus:border-kanchipuram focus:ring-1 focus:ring-kanchipuram transition"
                    />
                  </div>
                </div>

                {/* 5. Tone of Voice */}
                <div>
                  <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
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
                          className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition ${
                            isSelected
                              ? 'bg-kanchipuram-light border-kanchipuram text-ink ring-1 ring-kanchipuram/30 shadow-sm'
                              : 'bg-gray-50 border-border text-muted hover:border-gray-300'
                          }`}
                        >
                          <span className="text-xl flex-shrink-0">{t.emoji}</span>
                          <div>
                            <p className="text-xs font-semibold text-ink">{t.label}</p>
                            <p className="text-[11px] text-muted leading-tight mt-0.5">{t.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="btn-primary w-full py-3.5 px-6 rounded-xl text-sm sm:text-base font-semibold shadow-md"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Claude AI is Crafting {selectedFormat.replace('_', ' ')}...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 text-marigold" />
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
            <div className="card rounded-2xl p-6 shadow-card border border-border">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="text-xs font-semibold text-ink uppercase tracking-wider flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-tumbler" />
                  <span>Prompt Context Memory</span>
                </span>
                <Link href="/brand-kit" className="text-[11px] font-medium text-kanchipuram hover:underline">
                  Edit Brand Kit →
                </Link>
              </div>

              <div className="mt-4 space-y-3 text-xs">
                <div>
                  <span className="text-muted block text-[11px] font-medium">Brand Name:</span>
                  <span className="text-ink font-semibold">{formData.business_name}</span>
                </div>
                <div>
                  <span className="text-muted block text-[11px] font-medium">Format:</span>
                  <span className="text-kanchipuram font-semibold uppercase">{selectedFormat.replace('_', ' ')}</span>
                </div>
                <div>
                  <span className="text-muted block text-[11px] font-medium">Brand Guidelines Injected:</span>
                  <span className="text-ink-soft font-normal line-clamp-2">
                    {brandKit.brand_voice_guidelines || 'Active'}
                  </span>
                </div>
                <div>
                  <span className="text-muted block text-[11px] font-medium">Active Brand Rules:</span>
                  <span className="text-success font-medium">
                    {brandKit.dos_list.length} Do&apos;s · {brandKit.donts_list.length} Don&apos;ts
                  </span>
                </div>
              </div>
            </div>

            {/* Link to Calendar CTA */}
            <div className="card rounded-2xl p-6 shadow-card border border-tumbler-border bg-gradient-to-br from-tumbler-light/60 to-surface">
              <h4 className="text-sm font-semibold text-ink flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-tumbler" />
                <span>Plan Ahead for September 2026</span>
              </h4>
              <p className="text-xs text-muted mt-2 leading-relaxed">
                Use the 30-Day Content Calendar to automatically generate seasonal campaigns for Fall Launch, College Pitch Day, and local festivals.
              </p>
              <Link
                href="/calendar"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-tumbler text-white text-xs font-semibold hover:bg-tumbler-hover transition"
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
