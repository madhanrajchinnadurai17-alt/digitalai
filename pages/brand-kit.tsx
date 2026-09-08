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
        <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-border shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-kanchipuram/5 border border-kanchipuram/15 text-xs font-semibold text-kanchipuram mb-2">
              <Sparkles className="w-3.5 h-3.5 text-tumbler" />
              <span>Brand Memory & Guidelines</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink tracking-tight flex items-center gap-3">
              <Palette className="w-7 h-7 text-kanchipuram" />
              <span>Brand Kit & Voice Profile</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-1 max-w-2xl leading-relaxed">
              Define your brand once. MarkAI automatically injects your colors, voice guidelines, and mandatory Do's & Don'ts into every future AI content generation.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold shadow-sm flex items-center gap-2 self-start sm:self-auto"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Brand Kit Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Brand Guidelines</span>
              </>
            )}
          </button>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form Controls */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Color Palette Card */}
            <div className="bg-surface rounded-2xl p-6 sm:p-7 border border-border shadow-card space-y-5">
              <h3 className="text-base font-display font-bold text-ink flex items-center gap-2">
                <Palette className="w-5 h-5 text-kanchipuram" />
                <span>1. Brand Color Palette</span>
              </h3>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-muted mb-1.5 uppercase tracking-wider">
                    Primary
                  </label>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-canvas border border-border">
                    <input
                      type="color"
                      value={formData.primary_color}
                      onChange={(e) => handleColorChange('primary_color', e.target.value)}
                      className="w-7 h-7 rounded-lg border-0 cursor-pointer bg-transparent"
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
                  <label className="block text-[11px] font-bold text-muted mb-1.5 uppercase tracking-wider">
                    Secondary
                  </label>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-canvas border border-border">
                    <input
                      type="color"
                      value={formData.secondary_color}
                      onChange={(e) => handleColorChange('secondary_color', e.target.value)}
                      className="w-7 h-7 rounded-lg border-0 cursor-pointer bg-transparent"
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
                  <label className="block text-[11px] font-bold text-muted mb-1.5 uppercase tracking-wider">
                    Accent
                  </label>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-canvas border border-border">
                    <input
                      type="color"
                      value={formData.accent_color}
                      onChange={(e) => handleColorChange('accent_color', e.target.value)}
                      className="w-7 h-7 rounded-lg border-0 cursor-pointer bg-transparent"
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
            <div className="bg-surface rounded-2xl p-6 sm:p-7 border border-border shadow-card space-y-5">
              <h3 className="text-base font-display font-bold text-ink flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-tumbler" />
                <span>2. Brand Voice & Tone Guidelines</span>
              </h3>

              <div>
                <label className="block text-[11px] font-bold text-muted mb-1.5 uppercase tracking-wider">
                  Core Voice Philosophy
                </label>
                <textarea
                  rows={3}
                  value={formData.brand_voice_guidelines}
                  onChange={(e) => setFormData({ ...formData, brand_voice_guidelines: e.target.value })}
                  placeholder="e.g. Warm, artisanal, passionate, neighborly, prioritizing organic craft quality over generic sales hype..."
                  className="w-full bg-canvas border border-border rounded-xl p-3.5 text-xs sm:text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:border-kanchipuram focus:ring-1 focus:ring-kanchipuram resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-muted mb-1.5 uppercase tracking-wider">
                  Logo / Badge Headline Text
                </label>
                <input
                  type="text"
                  value={formData.logo_badge_text}
                  onChange={(e) => setFormData({ ...formData, logo_badge_text: e.target.value })}
                  placeholder="e.g. BREW & BEAN CO."
                  className="w-full bg-canvas border border-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:border-kanchipuram focus:ring-1 focus:ring-kanchipuram"
                />
              </div>
            </div>

            {/* Mandatory Do's and Don'ts */}
            <div className="bg-surface rounded-2xl p-6 sm:p-7 border border-border shadow-card space-y-6">
              <h3 className="text-base font-display font-bold text-ink flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-success" />
                <span>3. Mandatory Brand Do's & Don'ts</span>
              </h3>

              {/* Do's List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-success uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Mandatory Do's (Always Include)
                  </span>
                  <span className="text-[10px] text-muted font-medium">{formData.dos_list.length} rules</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.dos_list.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-success/10 text-success text-xs border border-success/20 font-medium"
                    >
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDo(idx)}
                        className="hover:text-danger transition"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <form onSubmit={handleAddDo} className="flex gap-2">
                  <input
                    type="text"
                    value={newDo}
                    onChange={(e) => setNewDo(e.target.value)}
                    placeholder="Add a brand Do (e.g. Always emphasize single-origin sourcing)"
                    className="flex-1 bg-canvas border border-border rounded-xl px-3 py-2 text-xs text-ink placeholder:text-muted/60 focus:outline-none focus:border-success focus:ring-1 focus:ring-success"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-success text-white hover:bg-success/90 text-xs font-semibold transition flex items-center gap-1 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </form>
              </div>

              {/* Don'ts List */}
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-danger uppercase tracking-wider flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" /> Strict Don'ts (Never Say / Do)
                  </span>
                  <span className="text-[10px] text-muted font-medium">{formData.donts_list.length} rules</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.donts_list.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-danger/10 text-danger text-xs border border-danger/20 font-medium"
                    >
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDont(idx)}
                        className="hover:text-danger/80 transition"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <form onSubmit={handleAddDont} className="flex gap-2">
                  <input
                    type="text"
                    value={newDont}
                    onChange={(e) => setNewDont(e.target.value)}
                    placeholder="Add a brand Don't (e.g. No aggressive sales urgency)"
                    className="flex-1 bg-canvas border border-border rounded-xl px-3 py-2 text-xs text-ink placeholder:text-muted/60 focus:outline-none focus:border-danger focus:ring-1 focus:ring-danger"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-danger text-white hover:bg-danger/90 text-xs font-semibold transition flex items-center gap-1 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Right Column: Live Brand Identity Preview */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-surface rounded-2xl p-6 sm:p-7 border border-border shadow-card space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-kanchipuram" />
                  <span>Live Brand Card Preview</span>
                </span>
                <span className="text-[10px] text-kanchipuram font-bold px-2 py-0.5 rounded-full bg-kanchipuram/10 border border-kanchipuram/20">
                  Instant Memory
                </span>
              </div>

              {/* Sample Live Mockup */}
              <div
                className="w-full aspect-square rounded-2xl p-6 shadow-elevation flex flex-col justify-between text-white relative overflow-hidden border border-black/10"
                style={{
                  background: `linear-gradient(135deg, ${formData.primary_color} 0%, ${formData.secondary_color} 100%)`
                }}
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 backdrop-blur-md text-[11px] font-bold tracking-wider uppercase self-start text-white">
                  <span>{formData.logo_badge_text || currentProfile.business_name}</span>
                </div>

                <div>
                  <span className="text-4xl font-serif text-white/40 block leading-none">“</span>
                  <p className="text-lg font-extrabold leading-snug tracking-tight">
                    {currentProfile.business_name}
                  </p>
                  <p className="text-xs text-white/90 mt-1 line-clamp-2">
                    {formData.brand_voice_guidelines || 'Crafted with authentic intention and premium quality.'}
                  </p>
                  <div
                    className="w-14 h-1.5 mt-3 rounded-full"
                    style={{ backgroundColor: formData.accent_color }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-bold text-white/90 uppercase pt-2.5 border-t border-white/20">
                  <span>✨ BRAND KIT ACTIVE</span>
                  <span className="opacity-75">MarkAI</span>
                </div>
              </div>

              {/* Memory Context Injection Summary */}
              <div className="p-4 rounded-xl bg-canvas border border-border space-y-2 text-xs">
                <span className="text-[11px] font-bold text-tumbler uppercase tracking-wider block">
                  Automatic AI Prompt Injection
                </span>
                <p className="text-muted leading-relaxed">
                  Every time you generate content on the Dashboard or from the Calendar, these rules will be included in the Claude 3.5 Sonnet context window to preserve brand voice consistency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
