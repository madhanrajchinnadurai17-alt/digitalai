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
        <div className="bg-surface rounded-xl p-6 sm:p-8 border border-line flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs text-muted mb-2">
              <Film className="w-3.5 h-3.5 text-ink" />
              <span>[Short-Form Video Engine]</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-sans font-bold text-ink tracking-tight flex items-center gap-3">
              Programmatic 9:16 Video Studio
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-1 max-w-2xl leading-relaxed">
              Auto-generate 12-second vertical Reels from captions and hooks using kinetic typography and synchronized scene pacing.
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
                className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
                  isSelected
                    ? 'border-line bg-surface ring-1 ring-ink'
                    : 'bg-surface border-line text-muted hover:border-line'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-process' : 'text-muted'}`} />
                  {isSelected && (
                    <span className="font-mono text-[10px] text-process bg-process-light border border-process-border px-1.5 py-0.5 rounded-xl">
                      [Active]
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-sans font-bold text-ink">{arch.label}</h4>
                  <p className="text-[10px] text-muted mt-0.5 leading-snug">{arch.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main 2-Column Cockpit: Left Player | Right Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: 9:16 Vertical Video Player Simulation */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-[320px] aspect-[9/16] rounded-xl p-6 border border-line relative overflow-hidden flex flex-col justify-between text-white select-none bg-black">
              
              {/* Top Bar inside Video */}
              <div className="flex items-center justify-between z-10">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/60 text-[10px] font-mono tracking-wider uppercase border border-white/20">
                  <span>{currentScene.badge_text || currentProfile.business_name}</span>
                </div>
                <div className="text-[10px] font-mono bg-black/60 px-2 py-0.5 rounded-xl border border-white/15">
                  00:0{activeSceneIdx * 4} / 00:12
                </div>
              </div>

              {/* Center Kinetic Typography Animation */}
              <div className="my-auto text-center space-y-3 z-10">
                <span className="text-3xl font-sans text-white/40 block leading-none">“</span>
                <h3 className="text-xl font-sans font-bold tracking-tight leading-tight uppercase">
                  {currentScene.title_text}
                </h3>
                <p className="text-xs font-sans text-white/80 max-w-[220px] mx-auto leading-relaxed">
                  {currentScene.subtitle_text}
                </p>
                <div className="w-12 h-0.5 bg-surface mx-auto"></div>
              </div>

              {/* Bottom Scene Indicators & Watermark */}
              <div className="space-y-3 z-10">
                {/* Scene Progress Bars */}
                <div className="grid grid-cols-3 gap-1">
                  {activeProject.scenes.map((_, i) => (
                    <div
                      key={i}
                      className={`h-0.5 transition-all duration-300 ${
                        i === activeSceneIdx ? 'bg-pending' : i < activeSceneIdx ? 'bg-surface/60' : 'bg-surface/20'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-white/70 uppercase pt-2 border-t border-white/20">
                  <span className="flex items-center gap-1 text-pending">
                    <Music className="w-3 h-3 animate-pulse" />
                    <span className="truncate max-w-[140px]">{activeProject.audio_track.split(' ')[0]} Beats</span>
                  </span>
                  <span>@markai</span>
                </div>
              </div>
            </div>

            {/* Video Controls Bar */}
            <div className="w-full max-w-[320px] mt-4 flex items-center justify-between p-3 rounded-xl bg-surface border border-line">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-xl bg-surface hover:bg-black text-white transition"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
              </button>

              <button
                onClick={() => { setActiveSceneIdx(0); setIsPlaying(true); }}
                className="p-2 rounded-xl border border-line text-muted hover:text-ink transition"
                title="Restart"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setAudioMuted(!audioMuted)}
                className="p-2 rounded-xl border border-line text-muted hover:text-ink transition"
                title={audioMuted ? 'Unmute' : 'Mute'}
              >
                {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-ink" />}
              </button>

              <button
                onClick={() => alert('High-res vertical MP4 download triggered via MarkAI Canvas Video Renderer.')}
                className="btn-secondary px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Right: AI Video Script Generator Form & Scene Breakdown */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-surface rounded-xl p-6 border border-line space-y-4">
              <h3 className="text-base font-sans font-bold text-ink flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-process" />
                <span>AI Video Director Engine</span>
              </h3>

              <form onSubmit={handleGenerateVideo} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-muted mb-1.5 uppercase">
                    Custom Campaign Angle / Hook:
                  </label>
                  <input
                    type="text"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="e.g. Highlight our fresh single-origin pour overs or Autumn seasonal menu"
                    className="w-full bg-surface border border-line rounded-xl px-3.5 py-2 text-xs sm:text-sm text-ink placeholder:text-muted focus:outline-none focus:border-process focus:ring-1 focus:ring-process transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isGenerating}
                  className="btn-primary w-full py-2.5 px-4 rounded-xl text-xs font-medium flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Rendering 9:16 Kinetic Storyboard...</span>
                    </>
                  ) : (
                    <>
                      <Film className="w-3.5 h-3.5" />
                      <span>Generate New 9:16 Reel with AI</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Scene-by-Scene Timeline Breakdown */}
            <div className="bg-surface rounded-xl p-6 border border-line space-y-4">
              <h3 className="text-base font-sans font-bold text-ink flex items-center gap-2">
                <Layers className="w-4 h-4 text-ink" />
                <span>Scene Timeline & Typography Sequence</span>
              </h3>

              <div className="space-y-3">
                {activeProject.scenes.map((scene, idx) => (
                  <div
                    key={scene.id}
                    onClick={() => { setActiveSceneIdx(idx); setIsPlaying(false); }}
                    className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                      activeSceneIdx === idx
                        ? 'border-process bg-process-light/40 ring-1 ring-process/30'
                        : 'border-line hover:border-line'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-xl text-xs font-mono flex items-center justify-center border ${
                        activeSceneIdx === idx
                          ? 'bg-process text-white border-process'
                          : 'bg-surface text-ink border-line'
                      }`}>
                        0{idx + 1}
                      </span>
                      <div>
                        <h4 className="text-xs font-sans font-bold text-ink">{scene.title_text}</h4>
                        <p className="text-[11px] text-muted">{scene.subtitle_text}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-muted">
                      [{scene.duration_seconds}s]
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
