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
        <div className="card rounded-xl p-6 sm:p-8 border border-line bg-surface">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono text-ink">
                  [Content Engine · Business Cockpit]
                </span>
                <Link
                  href="/voice-onboarding"
                  className="text-xs font-mono text-muted hover:text-ink transition underline"
                >
                  [Voice Setup]
                </Link>
                <Link
                  href="/brand-kit"
                  className="text-xs font-mono text-muted hover:text-ink transition underline"
                >
                  [Brand Kit]
                </Link>
              </div>
              <h1 className="text-2xl sm:text-3xl font-sans font-bold text-ink mt-2 tracking-tight">
                Business Profile &amp; Generation Controls
              </h1>
              <p className="text-xs sm:text-sm text-muted mt-1 max-w-2xl leading-relaxed">
                Define your profile and select your format. MarkAI uses Anthropic Claude to craft on-brand copy, carousel slide outlines, and viral Reels scripts.
              </p>
            </div>

            {/* Quick Demo Presets */}
            <div className="flex flex-col items-start lg:items-end gap-1.5">
              <span className="text-xs font-mono text-ink uppercase tracking-wider">
                Preset Profiles:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {DEMO_PRESET_PROFILES.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePresetSelect(p)}
                    className="px-2.5 py-1 text-xs font-mono rounded-xl bg-surface hover:bg-grey/10 text-ink border border-line hover:border-line transition"
                  >
                    {p.profile.business_name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Format Selector Bar */}
        <div className="card rounded-xl p-3 sm:p-4 border border-line bg-surface flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs font-mono text-ink">
            Format Selection:
          </span>

          <div className="grid grid-cols-3 gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setSelectedFormat('single_image')}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                selectedFormat === 'single_image'
                  ? 'ai-gradient text-white border border-ai-cyan/40 shadow-sm ai-glow'
                  : 'bg-surface text-muted hover:text-ink border border-line hover:border-line'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Single Post</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedFormat('carousel')}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                selectedFormat === 'carousel'
                  ? 'ai-gradient text-white border border-ai-cyan/40 shadow-sm ai-glow'
                  : 'bg-surface text-muted hover:text-ink border border-line hover:border-line'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Carousel Outline</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedFormat('reels_script')}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                selectedFormat === 'reels_script'
                  ? 'ai-gradient text-white border border-ai-cyan/40 shadow-sm ai-glow'
                  : 'bg-surface text-muted hover:text-ink border border-line hover:border-line'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Reels Script</span>
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          
          {/* Left: Form Controls */}
          <div className="lg:col-span-7">
            <div className="card rounded-xl p-6 sm:p-8 border border-line bg-surface">
              <form onSubmit={handleGenerate} className="space-y-4 sm:space-y-5">
                
                {error && (
                  <div className="p-3.5 rounded-xl bg-danger-light border border-danger-border text-xs text-danger">
                    {error}
                  </div>
                )}

                {/* 1. Business Name */}
                <div>
                  <label className="block text-xs font-mono text-ink mb-1.5">
                    1. Business Name
                  </label>
                  <input
                    type="text"
                    value={formData.business_name}
                    onChange={(e) => handleChange('business_name', e.target.value)}
                    placeholder="e.g. Kaapi & Crumb Co."
                    className="w-full bg-surface border border-line rounded-xl px-3.5 py-2 text-sm text-ink placeholder-muted focus:outline-none focus:border-process focus:ring-1 focus:ring-process transition min-h-[40px]"
                    required
                  />
                </div>

                {/* 2. Industry */}
                <div>
                  <label className="block text-xs font-mono text-ink mb-1.5">
                    2. Industry / Category
                  </label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => handleChange('industry', e.target.value)}
                    placeholder="e.g. Specialty Coffee, Handloom Silk, Organic Groceries"
                    className="w-full bg-surface border border-line rounded-xl px-3.5 py-2 text-sm text-ink placeholder-muted focus:outline-none focus:border-process focus:ring-1 focus:ring-process transition min-h-[40px]"
                    required
                  />
                </div>

                {/* 3. Product / Service Description */}
                <div>
                  <label className="block text-xs font-mono text-ink mb-1.5">
                    3. Product or Service Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="What makes your product special? Mention key benefits, unique selling points, or offers..."
                    className="w-full bg-surface border border-line rounded-xl p-3 text-sm text-ink placeholder-muted focus:outline-none focus:border-process focus:ring-1 focus:ring-process transition resize-none leading-relaxed font-sans"
                    required
                  />
                </div>

                {/* 4. Target Audience */}
                <div>
                  <label className="block text-xs font-mono text-ink mb-1.5">
                    4. Target Audience
                  </label>
                  <input
                    type="text"
                    value={formData.target_audience}
                    onChange={(e) => handleChange('target_audience', e.target.value)}
                    placeholder="e.g. College students, young professionals, specialty coffee enthusiasts"
                    className="w-full bg-surface border border-line rounded-xl px-3.5 py-2 text-sm text-ink placeholder-muted focus:outline-none focus:border-process focus:ring-1 focus:ring-process transition min-h-[40px]"
                    required
                  />
                </div>

                {/* 5. Brand Tone of Voice */}
                <div>
                  <label className="block text-xs font-mono text-ink mb-1.5">
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
                              ? 'bg-surface text-white border-line'
                              : 'bg-surface border-line text-muted hover:text-ink hover:border-line'
                          }`}
                        >
                          <div>
                            <p className="text-xs font-bold">{t.label}</p>
                            <p className={`text-[11px] leading-tight mt-0.5 ${isSelected ? 'text-white/80' : 'text-muted'}`}>
                              {t.description}
                            </p>
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
                    className="btn-primary w-full py-3 px-6 rounded-xl text-xs font-medium"
                  >
                    {isGenerating ? (
                      <div className="flex items-center justify-center gap-2.5">
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Claude 3.5 Sonnet is Crafting {selectedFormat.replace('_', ' ')}...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <span>Generate AI {selectedFormat === 'carousel' ? 'Carousel Outline' : selectedFormat === 'reels_script' ? 'Reels Script' : 'Post & Graphic'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right: Live Prompt Preview & Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="card rounded-xl p-6 border border-line bg-surface">
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <span className="text-xs font-mono text-process bg-process-light border border-process-border px-2 py-0.5 rounded-xl">
                  [Prompt Context Memory]
                </span>
                <Link href="/brand-kit" className="text-xs font-mono text-muted hover:text-ink underline">
                  Brand Kit
                </Link>
              </div>

              <div className="mt-4 space-y-3 text-xs">
                <div>
                  <span className="text-muted block text-[11px] font-mono">Brand Name:</span>
                  <span className="text-ink font-medium">{formData.business_name}</span>
                </div>
                <div>
                  <span className="text-muted block text-[11px] font-mono">Format:</span>
                  <span className="text-ink font-mono uppercase">{selectedFormat.replace('_', ' ')}</span>
                </div>
                <div>
                  <span className="text-muted block text-[11px] font-mono">Brand Guidelines Injected:</span>
                  <span className="text-muted line-clamp-2">
                    {brandKit.brand_voice_guidelines || 'Active'}
                  </span>
                </div>
                <div>
                  <span className="text-muted block text-[11px] font-mono">Active Brand Rules:</span>
                  <span className="text-ink font-mono">
                    [{brandKit.dos_list.length} Do&apos;s · {brandKit.donts_list.length} Don&apos;ts]
                  </span>
                </div>
              </div>
            </div>

            {/* Link to Calendar CTA */}
            <div className="card rounded-xl p-6 border border-line bg-surface">
              <h4 className="text-sm font-sans font-bold text-ink">
                30-Day Content Calendar
              </h4>
              <p className="text-xs text-muted mt-2 leading-relaxed">
                Plan ahead with automatically generated seasonal campaigns for Fall Launch, Pitch Day, and local festivals.
              </p>
              <Link
                href="/calendar"
                className="inline-flex items-center gap-2 mt-4 px-3.5 py-2 rounded-xl border border-line text-ink text-xs font-medium hover:border-line transition"
              >
                <span>Open Calendar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
