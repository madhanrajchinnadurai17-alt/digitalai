import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { usePost } from '@/context/PostContext';
import { BrandKit } from '@/lib/types';
import { 
  Palette, 
  Sparkles, 
  Check, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Volume2, 
  Save, 
  RefreshCw,
  Eye,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function BrandKitPage() {
  const { brandKit, saveCurrentBrandKit, currentProfile } = usePost();
  const [formData, setFormData] = useState<BrandKit>(brandKit);
  const [newDo, setNewDo] = useState('');
  const [newDont, setNewDont] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleColorChange = (field: 'primary_color' | 'secondary_color' | 'accent_color', color: string) => {
    setFormData(prev => ({ ...prev, [field]: color }));
  };

  const handleAddDo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDo.trim()) {
      setFormData(prev => ({ ...prev, dos_list: [...prev.dos_list, newDo.trim()] }));
      setNewDo('');
    }
  };

  const handleRemoveDo = (index: number) => {
    setFormData(prev => ({
      ...prev,
      dos_list: prev.dos_list.filter((_, i) => i !== index)
    }));
  };

  const handleAddDont = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDont.trim()) {
      setFormData(prev => ({ ...prev, donts_list: [...prev.donts_list, newDont.trim()] }));
      setNewDont('');
    }
  };

  const handleRemoveDont = (index: number) => {
    setFormData(prev => ({
      ...prev,
      donts_list: prev.donts_list.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveCurrentBrandKit(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout title="Brand Kit & Voice Profile — MarkAI">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Bar */}
        <div className="bg-surface rounded-xl p-6 border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-muted mb-1.5">
              [Brand Identity &amp; Voice Engine]
            </div>
            <h1 className="text-2xl sm:text-3xl font-sans font-bold text-ink tracking-tight">
              Brand Kit Guidelines
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-1 max-w-2xl leading-relaxed">
              Define your brand once. MarkAI automatically injects your colors, voice guidelines, and mandatory Do&apos;s &amp; Don&apos;ts into every future AI generation.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary px-5 py-2.5 rounded-xl text-xs font-medium self-start sm:self-auto"
          >
            {saving ? (
              <span>Saving...</span>
            ) : savedSuccess ? (
              <span>Brand Kit Saved</span>
            ) : (
              <span>Save Guidelines</span>
            )}
          </button>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form Controls */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Color Palette Card */}
            <div className="bg-surface rounded-xl p-6 border border-line space-y-4">
              <h3 className="text-sm font-sans font-bold text-ink">
                1. Brand Color Specifications
              </h3>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-ink mb-1.5">
                    Primary
                  </label>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-surface border border-line">
                    <input
                      type="color"
                      value={formData.primary_color}
                      onChange={(e) => handleColorChange('primary_color', e.target.value)}
                      className="w-6 h-6 rounded-lg border-0 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={formData.primary_color}
                      onChange={(e) => handleColorChange('primary_color', e.target.value)}
                      className="w-full bg-transparent text-xs font-mono text-ink uppercase focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-ink mb-1.5">
                    Secondary
                  </label>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-surface border border-line">
                    <input
                      type="color"
                      value={formData.secondary_color}
                      onChange={(e) => handleColorChange('secondary_color', e.target.value)}
                      className="w-6 h-6 rounded-lg border-0 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={formData.secondary_color}
                      onChange={(e) => handleColorChange('secondary_color', e.target.value)}
                      className="w-full bg-transparent text-xs font-mono text-ink uppercase focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-ink mb-1.5">
                    Accent
                  </label>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-surface border border-line">
                    <input
                      type="color"
                      value={formData.accent_color}
                      onChange={(e) => handleColorChange('accent_color', e.target.value)}
                      className="w-6 h-6 rounded-lg border-0 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={formData.accent_color}
                      onChange={(e) => handleColorChange('accent_color', e.target.value)}
                      className="w-full bg-transparent text-xs font-mono text-ink uppercase focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Voice & Guidelines */}
            <div className="bg-surface rounded-xl p-6 border border-line space-y-4">
              <h3 className="text-sm font-sans font-bold text-ink">
                2. Brand Voice &amp; Tone Guidelines
              </h3>

              <div>
                <label className="block text-xs font-mono text-ink mb-1.5">
                  Core Voice Philosophy
                </label>
                <textarea
                  rows={3}
                  value={formData.brand_voice_guidelines}
                  onChange={(e) => setFormData({ ...formData, brand_voice_guidelines: e.target.value })}
                  placeholder="e.g. Warm, artisanal, passionate, neighborly, prioritizing organic craft quality over generic sales hype..."
                  className="w-full bg-surface border border-line rounded-xl p-3 text-xs sm:text-sm text-ink placeholder-muted focus:outline-none focus:border-line resize-none font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-ink mb-1.5">
                  Logo / Badge Headline Text
                </label>
                <input
                  type="text"
                  value={formData.logo_badge_text}
                  onChange={(e) => setFormData({ ...formData, logo_badge_text: e.target.value })}
                  placeholder="e.g. BREW & BEAN CO."
                  className="w-full bg-surface border border-line rounded-xl px-3.5 py-2 text-xs sm:text-sm text-ink placeholder-muted focus:outline-none focus:border-line"
                />
              </div>
            </div>

            {/* Mandatory Do's and Don'ts */}
            <div className="bg-surface rounded-xl p-6 border border-line space-y-5">
              <h3 className="text-sm font-sans font-bold text-ink">
                3. Mandatory Do&apos;s &amp; Don&apos;ts
              </h3>

              {/* Do's List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-ink">
                    [Mandatory Do&apos;s]
                  </span>
                  <span className="text-[10px] font-mono text-muted">{formData.dos_list.length} rules</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.dos_list.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-surface border border-line text-xs font-mono text-ink"
                    >
                      <span>+ {item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDo(idx)}
                        className="text-muted hover:text-ink transition ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <form onSubmit={handleAddDo} className="flex gap-2">
                  <input
                    type="text"
                    value={newDo}
                    onChange={(e) => setNewDo(e.target.value)}
                    placeholder="Add a brand Do..."
                    className="flex-1 bg-surface border border-line rounded-xl px-3 py-1.5 text-xs text-ink placeholder-muted focus:outline-none focus:border-line"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl btn-secondary text-xs font-medium"
                  >
                    Add
                  </button>
                </form>
              </div>

              {/* Don'ts List */}
              <div className="space-y-3 pt-4 border-t border-line">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-ink">
                    [Strict Don&apos;ts]
                  </span>
                  <span className="text-[10px] font-mono text-muted">{formData.donts_list.length} rules</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.donts_list.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-surface border border-line text-xs font-mono text-muted"
                    >
                      <span>- {item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDont(idx)}
                        className="text-muted hover:text-ink transition ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <form onSubmit={handleAddDont} className="flex gap-2">
                  <input
                    type="text"
                    value={newDont}
                    onChange={(e) => setNewDont(e.target.value)}
                    placeholder="Add a brand Don't..."
                    className="flex-1 bg-surface border border-line rounded-xl px-3 py-1.5 text-xs text-ink placeholder-muted focus:outline-none focus:border-line"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl btn-secondary text-xs font-medium"
                  >
                    Add
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Right Column: Live Brand Identity Preview */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-surface rounded-xl p-6 border border-line space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <span className="text-xs font-mono text-ink">
                  [Brand Preview Card]
                </span>
                <span className="text-xs font-mono text-muted">
                  [Active]
                </span>
              </div>

              {/* Clean Preview Frame */}
              <div className="w-full aspect-square rounded-xl p-6 border border-line bg-surface flex flex-col justify-between text-ink">
                <div className="text-[10px] font-mono uppercase tracking-wider text-muted">
                  [{formData.logo_badge_text || currentProfile.business_name}]
                </div>

                <div>
                  <p className="text-lg font-sans font-bold leading-snug">
                    {currentProfile.business_name}
                  </p>
                  <p className="text-xs text-muted mt-2 line-clamp-3 leading-relaxed">
                    {formData.brand_voice_guidelines || 'Crafted with authentic intention and premium quality.'}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[9px] font-mono text-muted uppercase pt-2 border-t border-line">
                  <span>BRAND GUIDELINES APPLIED</span>
                  <span>MARKAI</span>
                </div>
              </div>

              {/* Memory Context Injection Summary */}
              <div className="p-4 rounded-xl bg-surface border border-line space-y-1.5 text-xs">
                <span className="text-xs font-mono text-ink block">
                  [Prompt Memory Engine]
                </span>
                <p className="text-muted leading-relaxed">
                  Every time content is generated, these rules are injected directly into the Claude prompt to enforce consistent voice and brand governance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
