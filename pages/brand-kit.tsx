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
        <div className="card-glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/30">
                Phase 2 · Brand Memory
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight flex items-center gap-3">
              <Palette className="w-7 h-7 text-fuchsia-400" />
              <span>Brand Kit & Voice Profile</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Define your brand once. MarkAI automatically injects your colors, voice guidelines, and mandatory Do's & Don'ts into every future AI content generation.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-lg flex items-center gap-2"
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
            <div className="card-glass rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/10 space-y-5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Palette className="w-5 h-5 text-fuchsia-400" />
                <span>1. Brand Color Palette</span>
              </h3>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Primary
                  </label>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-space-950/80 border border-white/10">
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
                      className="w-full bg-transparent text-xs font-mono text-slate-200 uppercase focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Secondary
                  </label>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-space-950/80 border border-white/10">
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
                      className="w-full bg-transparent text-xs font-mono text-slate-200 uppercase focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Accent
                  </label>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-space-950/80 border border-white/10">
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
                      className="w-full bg-transparent text-xs font-mono text-slate-200 uppercase focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Voice & Guidelines */}
            <div className="card-glass rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/10 space-y-5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-amber-300" />
                <span>2. Brand Voice & Tone Guidelines</span>
              </h3>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Core Voice Philosophy
                </label>
                <textarea
                  rows={3}
                  value={formData.brand_voice_guidelines}
                  onChange={(e) => setFormData({ ...formData, brand_voice_guidelines: e.target.value })}
                  placeholder="e.g. Warm, artisanal, passionate, neighborly, prioritizing organic craft quality over generic sales hype..."
                  className="w-full bg-space-950/80 border border-white/10 rounded-xl p-3.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-fuchsia resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Logo / Badge Headline Text
                </label>
                <input
                  type="text"
                  value={formData.logo_badge_text}
                  onChange={(e) => setFormData({ ...formData, logo_badge_text: e.target.value })}
                  placeholder="e.g. BREW & BEAN CO."
                  className="w-full bg-space-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-fuchsia"
                />
              </div>
            </div>

            {/* Mandatory Do's and Don'ts */}
            <div className="card-glass rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/10 space-y-6">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>3. Mandatory Brand Do's & Don'ts</span>
              </h3>

              {/* Do's List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Mandatory Do's (Always Include)
                  </span>
                  <span className="text-[10px] text-slate-400">{formData.dos_list.length} rules</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.dos_list.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-300 text-xs border border-emerald-500/25 shadow-sm"
                    >
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDo(idx)}
                        className="hover:text-rose-400 transition"
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
                    className="flex-1 bg-space-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 text-xs font-bold transition flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </form>
              </div>

              {/* Don'ts List */}
              <div className="space-y-3 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" /> Strict Don'ts (Never Say / Do)
                  </span>
                  <span className="text-[10px] text-slate-400">{formData.donts_list.length} rules</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.donts_list.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-300 text-xs border border-rose-500/25 shadow-sm"
                    >
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDont(idx)}
                        className="hover:text-rose-400 transition"
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
                    className="flex-1 bg-space-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30 text-xs font-bold transition flex items-center gap-1"
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
            <div className="card-glass rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/10 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-fuchsia-400" />
                  <span>Live Brand Card Preview</span>
                </span>
                <span className="text-[10px] text-fuchsia-300 font-bold px-2 py-0.5 rounded-full bg-fuchsia-500/15 border border-fuchsia-500/30">
                  Instant Memory
                </span>
              </div>

              {/* Sample Live Mockup */}
              <div
                className="w-full aspect-square rounded-2xl p-6 shadow-2xl flex flex-col justify-between text-white relative overflow-hidden border border-white/20"
                style={{
                  background: `linear-gradient(135deg, ${formData.primary_color} 0%, ${formData.secondary_color} 100%)`
                }}
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold tracking-wider uppercase self-start">
                  <span>{formData.logo_badge_text || currentProfile.business_name}</span>
                </div>

                <div>
                  <span className="text-4xl font-serif text-white/30 block leading-none">“</span>
                  <p className="text-lg font-extrabold leading-snug tracking-tight">
                    {currentProfile.business_name}
                  </p>
                  <p className="text-xs text-white/80 mt-1 line-clamp-2">
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
              <div className="p-4 rounded-2xl bg-space-950/80 border border-white/10 space-y-2 text-xs">
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
                  Automatic AI Prompt Injection
                </span>
                <p className="text-slate-400 leading-relaxed">
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
