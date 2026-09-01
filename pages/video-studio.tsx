import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { usePost } from '@/context/PostContext';
import { VideoProject, VideoTemplateArchetype } from '@/lib/types';
import { DEFAULT_VIDEO_PROJECTS } from '@/lib/mockData';
import { getVideoProjects, saveVideoProject } from '@/lib/supabase';
import { 
  Film, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Download, 
  Layers, 
  CheckCircle2, 
  Zap, 
  Flame, 
  MessageSquare, 
  Lightbulb,
  Music,
  ChevronRight
} from 'lucide-react';

export default function VideoStudioPage() {
  const { currentProfile } = usePost();
  const [projects, setProjects] = useState<VideoProject[]>(DEFAULT_VIDEO_PROJECTS);
  const [activeProject, setActiveProject] = useState<VideoProject>(DEFAULT_VIDEO_PROJECTS[0]);
  const [activeArchetype, setActiveArchetype] = useState<VideoTemplateArchetype>('product_spotlight');
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSceneIdx, setActiveSceneIdx] = useState(0);
  const [audioMuted, setAudioMuted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');

  const archetypes: { id: VideoTemplateArchetype; label: string; icon: any; desc: string }[] = [
    { id: 'product_spotlight', label: 'Product Spotlight', icon: Sparkles, desc: 'Kinetic zoom on signature offering + price badge' },
    { id: 'customer_testimonial', label: 'Customer Review', icon: MessageSquare, desc: '5-star quote cards + customer reaction' },
    { id: 'quick_tips', label: '3 Quick Tips', icon: Lightbulb, desc: 'Step-by-step educational countdown cards' },
    { id: 'flash_sale', label: 'Flash Promo Sale', icon: Flame, desc: 'High urgency flash discount + limited batch hook' }
  ];

  // Playback timer loop
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveSceneIdx((prev) => {
          if (prev >= activeProject.scenes.length - 1) {
            return 0; // loop
          }
          return prev + 1;
        });
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, activeProject.scenes.length]);

  const handleGenerateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: currentProfile,
          archetype: activeArchetype,
          promptText: customPrompt
        })
      });
      const json = await res.json();
      if (json.data) {
        setActiveProject(json.data);
        setProjects(prev => [json.data, ...prev]);
        setActiveSceneIdx(0);
        setIsPlaying(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const currentScene = activeProject.scenes[activeSceneIdx] || activeProject.scenes[0];

  return (
    <Layout title="Programmatic Short-Form Video Studio — MarkAI">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="card-glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                Phase 4 · Short-Form Video Engine
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight flex items-center gap-3">
              <Film className="w-7 h-7 text-rose-400" />
              <span>Programmatic 9:16 Video Studio</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Auto-generate 12-second vertical Reels from captions and product hooks using kinetic typography, animated gradients, and synchronized scene pacing.
            </p>
          </div>
        </div>

        {/* Archetype Selector Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {archetypes.map((arch) => {
            const isSelected = activeArchetype === arch.id;
            const Icon = arch.icon;
            return (
              <button
                key={arch.id}
                type="button"
                onClick={() => setActiveArchetype(arch.id)}
                className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                  isSelected
                    ? 'bg-rose-500/15 border-rose-400 text-white ring-1 ring-rose-400/40 shadow-lg'
                    : 'bg-space-950/60 border-white/10 text-slate-400 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-rose-400' : 'text-slate-400'}`} />
                  {isSelected && <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping"></span>}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{arch.label}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">{arch.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main 2-Column Cockpit: Left Player | Right Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: 9:16 Vertical Video Player Simulation */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-[320px] aspect-[9/16] rounded-3xl p-6 shadow-2xl border border-white/20 relative overflow-hidden flex flex-col justify-between text-white transition-all duration-700 select-none group"
                 style={{ background: currentScene.bg_gradient }}>
              
              {/* Top Bar inside Video */}
              <div className="flex items-center justify-between z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-[10px] font-bold tracking-wider uppercase border border-white/20">
                  <span>{currentScene.badge_text || currentProfile.business_name}</span>
                </div>
                <div className="text-[10px] font-mono font-bold bg-black/40 px-2 py-0.5 rounded-full border border-white/10">
                  00:0{activeSceneIdx * 4} / 00:12
                </div>
              </div>

              {/* Center Kinetic Typography Animation */}
              <div className="my-auto text-center space-y-3 z-10 animate-float">
                <span className="text-4xl font-serif text-white/30 block leading-none">“</span>
                <h3 className="text-2xl font-extrabold tracking-tight leading-tight uppercase drop-shadow-lg">
                  {currentScene.title_text}
                </h3>
                <p className="text-xs font-medium text-white/90 drop-shadow max-w-[220px] mx-auto leading-relaxed">
                  {currentScene.subtitle_text}
                </p>
                <div className="w-16 h-1.5 bg-amber-300 mx-auto rounded-full shadow"></div>
              </div>

              {/* Bottom Scene Indicators & Watermark */}
              <div className="space-y-3 z-10">
                {/* Scene Progress Bars */}
                <div className="grid grid-cols-3 gap-1.5">
                  {activeProject.scenes.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        i === activeSceneIdx ? 'bg-white shadow' : i < activeSceneIdx ? 'bg-white/60' : 'bg-white/20'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-[10px] font-bold text-white/80 uppercase pt-2 border-t border-white/20">
                  <span className="flex items-center gap-1">
                    <Music className="w-3 h-3 text-amber-300 animate-pulse" />
                    <span className="truncate max-w-[140px]">{activeProject.audio_track.split(' ')[0]} Beats</span>
                  </span>
                  <span>@markai</span>
                </div>
              </div>
            </div>

            {/* Video Controls Bar */}
            <div className="w-full max-w-[320px] mt-4 flex items-center justify-between p-3 rounded-2xl bg-space-950/80 border border-white/10 shadow-xl">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold transition shadow-md"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              </button>

              <button
                onClick={() => { setActiveSceneIdx(0); setIsPlaying(true); }}
                className="p-2.5 rounded-xl bg-white/[0.05] hover:bg-white/10 text-slate-300 transition"
                title="Restart"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setAudioMuted(!audioMuted)}
                className="p-2.5 rounded-xl bg-white/[0.05] hover:bg-white/10 text-slate-300 transition"
              >
                {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </button>

              <button
                onClick={() => alert('High-res vertical MP4 download triggered via MarkAI Canvas Video Renderer.')}
                className="btn-secondary px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Right: AI Video Script Generator Form & Scene Breakdown */}
          <div className="lg:col-span-7 space-y-6">
            <div className="card-glass rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/10 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-rose-400" />
                <span>AI Video Director Engine</span>
              </h3>

              <form onSubmit={handleGenerateVideo} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Custom Campaign Angle / Hook:
                  </label>
                  <input
                    type="text"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="e.g. Highlight our fresh single-origin pour overs or Autumn seasonal menu"
                    className="w-full bg-space-950/80 border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-fuchsia"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isGenerating}
                  className="btn-primary w-full py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-bold shadow-lg flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Rendering 9:16 Kinetic Video Storyboard...</span>
                    </>
                  ) : (
                    <>
                      <Film className="w-4 h-4" />
                      <span>Generate New 9:16 Reel with AI</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Scene-by-Scene Timeline Breakdown */}
            <div className="card-glass rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/10 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-300" />
                <span>Scene Timeline & Typography Sequence</span>
              </h3>

              <div className="space-y-3">
                {activeProject.scenes.map((scene, idx) => (
                  <div
                    key={scene.id}
                    onClick={() => { setActiveSceneIdx(idx); setIsPlaying(false); }}
                    className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                      activeSceneIdx === idx
                        ? 'bg-rose-500/15 border-rose-400 ring-1 ring-rose-400/40 shadow-lg'
                        : 'bg-space-950/80 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-white/[0.05] text-xs font-mono font-bold text-rose-300 flex items-center justify-center border border-white/10">
                        0{idx + 1}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-white">{scene.title_text}</h4>
                        <p className="text-[11px] text-slate-400">{scene.subtitle_text}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      {scene.duration_seconds}s
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
