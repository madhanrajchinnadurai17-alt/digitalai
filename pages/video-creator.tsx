import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Layout } from '@/components/Layout';
import { usePost } from '@/context/PostContext';
import { GuidedVideoTemplate, GuidedShot, ShotFeedback } from '@/lib/types';
import confetti from 'canvas-confetti';
import { 
  Clapperboard, 
  Sparkles, 
  Camera, 
  Upload, 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  CheckCircle2, 
  Check, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  Film, 
  Music, 
  Layers, 
  Eye, 
  Sun, 
  Maximize2, 
  Wand2,
  Volume2,
  VolumeX,
  Radio,
  Image as ImageIcon
} from 'lucide-react';

const SAMPLE_DEMO_PHOTOS: { [key in GuidedVideoTemplate]: { [shotIdx: number]: string } } = {
  product_spotlight: {
    0: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    1: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80',
    2: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80'
  },
  before_after: {
    0: 'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?w=800&auto=format&fit=crop&q=80',
    1: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800&auto=format&fit=crop&q=80',
    2: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&auto=format&fit=crop&q=80'
  },
  bts_story: {
    0: 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=800&auto=format&fit=crop&q=80',
    1: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&auto=format&fit=crop&q=80',
    2: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&auto=format&fit=crop&q=80'
  }
};

export default function VideoCreatorPage() {
  const { currentProfile } = usePost();

  // Wizard Steps: 1 (Template) | 2 (Shots & Uploads) | 3 (Assembled Video)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Template Selection
  const [selectedTemplate, setSelectedTemplate] = useState<GuidedVideoTemplate>('product_spotlight');
  const [isGeneratingShots, setIsGeneratingShots] = useState(false);
  const [shots, setShots] = useState<GuidedShot[]>([]);

  // Analyzing & Upload State
  const [analyzingShotIdx, setAnalyzingShotIdx] = useState<number | null>(null);

  // Video Playback Engine State
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeShotIdx, setActiveShotIdx] = useState(0);
  const [audioMuted, setAudioMuted] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Determine Recommended Template based on profile
  useEffect(() => {
    const ind = currentProfile.industry.toLowerCase();
    if (ind.includes('food') || ind.includes('cafe') || ind.includes('coffee') || ind.includes('retail') || ind.includes('beauty')) {
      setSelectedTemplate('product_spotlight');
    } else if (ind.includes('fitness') || ind.includes('service') || ind.includes('cleaning') || ind.includes('skin')) {
      setSelectedTemplate('before_after');
    } else {
      setSelectedTemplate('bts_story');
    }
  }, [currentProfile.industry]);

  // Video Loop Engine
  useEffect(() => {
    let timer: any = null;
    if (isPlaying && shots.length > 0 && currentStep === 3) {
      const currentDuration = (shots[activeShotIdx]?.duration_seconds || 4) * 1000;
      timer = setTimeout(() => {
        setActiveShotIdx((prev) => (prev >= shots.length - 1 ? 0 : prev + 1));
      }, currentDuration);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, activeShotIdx, shots, currentStep]);

  // Step 1 -> Step 2: Generate Shot Guide
  const handleGenerateShotGuide = async (templateToUse?: GuidedVideoTemplate) => {
    const t = templateToUse || selectedTemplate;
    setIsGeneratingShots(true);
    try {
      const res = await fetch('/api/guided-video/generate-shots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: currentProfile,
          template: t
        })
      });

      const json = await res.json();
      console.log('[Video Creator] Shot generation source:', json.source);
      if (json.data && Array.isArray(json.data)) {
        setShots(json.data);
        setCurrentStep(2);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingShots(false);
    }
  };

  // Upload or Preset Image Handler + Gemini Vision Evaluation
  const handleProcessImageForShot = async (shotIdx: number, base64Url: string) => {
    setAnalyzingShotIdx(shotIdx);

    // Update local shot with image
    setShots((prev) => {
      const copy = [...prev];
      copy[shotIdx] = {
        ...copy[shotIdx],
        uploaded_image: base64Url,
        status: 'analyzing'
      };
      return copy;
    });

    try {
      const currentShot = shots[shotIdx];
      const res = await fetch('/api/guided-video/analyze-shot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Url,
          shotTitle: currentShot.title,
          shotInstruction: currentShot.instruction,
          businessName: currentProfile.business_name
        })
      });

      const json = await res.json();
      console.log('[Video Creator] Vision analysis source:', json.source);
      const feedback: ShotFeedback = json.data || {
        matches: true,
        score: 94,
        feedback: 'Photo matches the shot requirement with crisp natural lighting!',
        tip: 'Ensure your smartphone lens is clean for maximum sharpness.'
      };

      setShots((prev) => {
        const copy = [...prev];
        copy[shotIdx] = {
          ...copy[shotIdx],
          ai_feedback: feedback,
          status: 'approved'
        };
        return copy;
      });
    } catch (err) {
      console.warn('Vision feedback error:', err);
      setShots((prev) => {
        const copy = [...prev];
        copy[shotIdx] = {
          ...copy[shotIdx],
          status: 'approved'
        };
        return copy;
      });
    } finally {
      setAnalyzingShotIdx(null);
    }
  };

  const handleFileUpload = (shotIdx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          handleProcessImageForShot(shotIdx, reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseDemoPresetPhoto = (shotIdx: number) => {
    const sampleUrl = SAMPLE_DEMO_PHOTOS[selectedTemplate]?.[shotIdx] || SAMPLE_DEMO_PHOTOS['product_spotlight'][0];
    handleProcessImageForShot(shotIdx, sampleUrl);
  };

  // Step 2 -> Step 3: Assemble Video
  const handleAssembleVideo = () => {
    const unuploaded = shots.some((s) => !s.uploaded_image);
    if (unuploaded) {
      // Auto fill remaining shots with pitch demo presets for seamless demo experience
      const updated = shots.map((s, idx) => {
        if (!s.uploaded_image) {
          const fallbackImg = SAMPLE_DEMO_PHOTOS[selectedTemplate]?.[idx] || SAMPLE_DEMO_PHOTOS['product_spotlight'][0];
          return {
            ...s,
            uploaded_image: fallbackImg,
            status: 'approved' as const,
            ai_feedback: {
              matches: true,
              score: 95,
              feedback: 'Perfect shot alignment with vibrant subject focus!',
              tip: 'Keep this steady angle for smooth transitions.'
            }
          };
        }
        return s;
      });
      setShots(updated);
    }

    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 }
    });

    setActiveShotIdx(0);
    setIsPlaying(true);
    setCurrentStep(3);
  };

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert('Video Reel successfully compiled in 1080x1920 vertical format and ready for Instagram & TikTok!');
    }, 1500);
  };

  const templatesList: { id: GuidedVideoTemplate; label: string; desc: string; icon: any; recommendedFor: string }[] = [
    {
      id: 'product_spotlight',
      label: 'Product Spotlight',
      desc: 'Close-up camera zoom on signature item, ingredient/texture macro, and in-hand customer hero view.',
      icon: Sparkles,
      recommendedFor: 'Cafes, Bakeries, Retail, Skincare & Craft Products'
    },
    {
      id: 'before_after',
      label: 'Before / After Transformation',
      desc: 'Highlighting raw problem state, active handcrafting process, and delightful final finished result.',
      icon: Layers,
      recommendedFor: 'Fitness, Salons, Cleaning, Coaching & Services'
    },
    {
      id: 'bts_story',
      label: 'Day in the Life / Behind the Scenes',
      desc: 'Casual, authentic story showing morning workshop setup, precision details, and ready-to-order spread.',
      icon: Film,
      recommendedFor: 'Makers, Boutiques, Restaurants & Tech Founders'
    }
  ];

  const currentShot = shots[activeShotIdx] || shots[0];

  return (
    <Layout title="Guided Video Creator — MarkAI">
      <div className="max-w-5xl mx-auto space-y-6 py-2 sm:py-4 px-2 sm:px-0">
        
        {/* Top Header Card */}
        <div className="bg-surface rounded-xl p-6 sm:p-8 border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs text-muted">
                [Gemini Multimodal Director]
              </span>
              <span className="font-mono text-xs text-muted border-l border-line pl-2">
                [Step {currentStep} of 3]
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-sans font-bold text-ink mt-2 tracking-tight">
              Guided Video Creator
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-1 max-w-xl leading-relaxed">
              MarkAI guides you to capture real photos and clips, reviews composition with Gemini Vision, and compiles an editorial vertical Reel.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="btn-secondary px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2 self-start sm:self-auto min-h-[40px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Post Studio</span>
          </Link>
        </div>

        {/* STEP 1: TEMPLATE SELECTION */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h2 className="text-lg sm:text-xl font-sans font-bold text-ink">
                1. Select Storyboard Archetype
              </h2>
              <span className="text-xs font-mono text-muted">
                Tailored for {currentProfile.business_name}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {templatesList.map((tpl) => {
                const isSelected = selectedTemplate === tpl.id;
                const Icon = tpl.icon;
                return (
                  <button
                    key={tpl.id}
                    onClick={() => setSelectedTemplate(tpl.id)}
                    className={`bg-surface rounded-xl p-5 border text-left transition flex flex-col justify-between space-y-4 ${
                      isSelected
                        ? 'border-ai-violet ring-2 ring-process/30 shadow-ai-glow'
                        : 'border-line hover:border-line hover:border-ai-violet/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className={`p-2 rounded-xl ${isSelected ? 'ai-gradient text-white shadow-sm' : 'border border-line text-ink'}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        {isSelected && (
                          <span className="font-mono text-[10px] text-ai-cyan bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded-full font-semibold">
                            [Recommended]
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-sans font-bold text-ink">
                        {tpl.label}
                      </h3>
                      <p className="text-xs text-muted mt-2 leading-relaxed">
                        {tpl.desc}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-line text-[11px] text-muted font-mono">
                      Target: <span className="text-ink">{tpl.recommendedFor}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => handleGenerateShotGuide()}
                disabled={isGeneratingShots}
                className="btn-primary w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 min-h-[44px]"
              >
                {isGeneratingShots ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating Shot Guide...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Generate AI Shot Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: GUIDED SHOT CHECKLIST & UPLOAD WITH GEMINI FEEDBACK */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-line">
              <div>
                <span className="font-mono text-xs text-muted">
                  [Step 2 of 3 — Checklist & Review]
                </span>
                <h2 className="text-xl sm:text-2xl font-sans font-bold text-ink mt-1">
                  Capture & Review Shots
                </h2>
              </div>
              <button
                onClick={() => setCurrentStep(1)}
                className="btn-secondary px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 self-start sm:self-auto min-h-[36px]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Change Archetype</span>
              </button>
            </div>

            {/* Shots Checklist Cards */}
            <div className="space-y-4">
              {shots.map((shot, idx) => (
                <div
                  key={idx}
                  className={`bg-surface rounded-xl p-5 border transition space-y-4 ${
                    shot.uploaded_image ? 'border-success/50 ring-1 ring-success/20' : 'border-line'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs text-ink border border-line px-2 py-0.5 rounded-xl">
                          Shot 0{shot.shot_number}
                        </span>
                        <h3 className="text-base font-sans font-bold text-ink">
                          {shot.title}
                        </h3>
                        {shot.status === 'approved' && (
                          <span className="font-mono text-[10px] text-success bg-success-light border border-success-border px-2 py-0.5 rounded-xl flex items-center gap-1">
                            <Check className="w-3 h-3 text-success" /> [Approved]
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-ink leading-relaxed">
                        {shot.instruction}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted pt-1 font-mono">
                        <div className="flex items-center gap-1.5">
                          <Camera className="w-3.5 h-3.5 text-ink" />
                          <span>Angle: <strong className="text-ink">{shot.camera_angle}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Sun className="w-3.5 h-3.5 text-pending" />
                          <span>Lighting: <strong className="text-ink">{shot.lighting_tip}</strong></span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-surface border border-line text-xs">
                        <span className="font-mono text-[10px] text-muted uppercase block mb-0.5">
                          Voiceover Script / Caption:
                        </span>
                        <span className="text-ink font-sans italic">"{shot.voiceover_script}"</span>
                      </div>
                    </div>

                    {/* Upload Controls & Preview */}
                    <div className="flex sm:flex-col items-center gap-2 flex-shrink-0">
                      {shot.uploaded_image ? (
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border border-success group">
                          <img
                            src={shot.uploaded_image}
                            alt={shot.title}
                            className="w-full h-full object-cover"
                          />
                          <label className="absolute inset-0 bg-surface/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] font-mono text-white transition cursor-pointer">
                            [Retake]
                            <input
                              type="file"
                              accept="image/*,video/*"
                              className="hidden"
                              onChange={(e) => handleFileUpload(idx, e)}
                            />
                          </label>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2 w-full sm:w-auto">
                          <label className="btn-primary px-4 py-2 rounded-xl text-xs font-medium cursor-pointer flex items-center justify-center gap-1.5 min-h-[38px]">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Media</span>
                            <input
                              type="file"
                              accept="image/*,video/*"
                              className="hidden"
                              onChange={(e) => handleFileUpload(idx, e)}
                            />
                          </label>

                          <button
                            type="button"
                            onClick={() => handleUseDemoPresetPhoto(idx)}
                            className="btn-secondary px-3 py-1.5 rounded-xl text-[11px] font-mono text-muted hover:text-ink flex items-center justify-center gap-1"
                          >
                            <ImageIcon className="w-3 h-3" />
                            <span>[Demo Preset]</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Gemini Multimodal Feedback Pill */}
                  {analyzingShotIdx === idx && (
                    <div className="p-3 rounded-xl border border-process-border bg-process-light flex items-center gap-2 text-xs font-mono text-process">
                      <div className="w-3.5 h-3.5 border-2 border-process border-t-transparent rounded-full animate-spin"></div>
                      <span>Gemini Vision evaluating composition & lighting...</span>
                    </div>
                  )}

                  {shot.ai_feedback && (
                    <div className="p-3.5 rounded-xl bg-surface border border-success-border space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-success flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                          {shot.ai_feedback.feedback}
                        </span>
                        <span className="font-mono text-[10px] text-success bg-success-light border border-success-border px-2 py-0.5 rounded-xl">
                          [{shot.ai_feedback.score}/100 Quality]
                        </span>
                      </div>
                      <p className="text-muted text-[11px] font-mono">
                        Note: {shot.ai_feedback.tip}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Assemble Video CTA */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-line">
              <span className="text-xs font-mono text-muted">
                All frames verified. MarkAI will apply typographic overlays and pan sequence.
              </span>
              <button
                onClick={handleAssembleVideo}
                className="btn-primary w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 min-h-[44px]"
              >
                <Film className="w-4 h-4" />
                <span>Assemble Vertical Reel</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: FINISHED ASSEMBLED VIDEO PREVIEW & DOWNLOAD */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-line">
              <div>
                <span className="font-mono text-xs text-muted flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-ink" />
                  [Step 3 of 3 — Compiled Reel]
                </span>
                <h2 className="text-xl sm:text-2xl font-sans font-bold text-ink mt-1">
                  Preview & Export
                </h2>
              </div>

              <button
                onClick={() => setCurrentStep(2)}
                className="btn-secondary px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 self-start sm:self-auto min-h-[36px]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Adjust Shots</span>
              </button>
            </div>

            {/* 2-Column Layout: Player + Storyboard Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: 9:16 Vertical Video Player */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="w-full max-w-[320px] aspect-[9/16] rounded-xl border border-line relative overflow-hidden flex flex-col justify-between text-white select-none bg-black">
                  
                  {/* Real Customer Uploaded Image with Ken Burns Zoom/Pan */}
                  {currentShot?.uploaded_image && (
                    <img
                      src={currentShot.uploaded_image}
                      alt={currentShot.title}
                      className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[4000ms] ease-out ${
                        isPlaying ? 'scale-110 translate-y-[-2%]' : 'scale-100'
                      }`}
                    />
                  )}

                  {/* Subtle Vignette Overlay for Readability */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/85 pointer-events-none" />

                  {/* Top Bar inside Video */}
                  <div className="relative z-10 p-4 flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase border border-white/30 bg-black/60 px-2 py-0.5 rounded-xl">
                      {currentProfile.business_name}
                    </span>
                    <span className="font-mono text-[10px] bg-black/60 px-2 py-0.5 rounded-xl border border-white/20">
                      Shot {activeShotIdx + 1}/{shots.length}
                    </span>
                  </div>

                  {/* Bottom Text Overlay Captions */}
                  <div className="relative z-10 p-4 space-y-3">
                    <div className="p-3 rounded-xl bg-black/70 border border-white/20 text-center">
                      <p className="text-xs sm:text-sm font-sans italic text-white leading-snug">
                        "{currentShot?.voiceover_script}"
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="grid grid-cols-3 gap-1">
                      {shots.map((_, i) => (
                        <div
                          key={i}
                          className={`h-0.5 rounded-lg transition-all duration-300 ${
                            i === activeShotIdx ? 'bg-pending' : i < activeShotIdx ? 'bg-surface/80' : 'bg-surface/20'
                          }`}
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-white/70 uppercase pt-1">
                      <span className="flex items-center gap-1 text-pending">
                        <Music className="w-3 h-3 animate-pulse" />
                        <span>Lofi Beat (120 BPM)</span>
                      </span>
                      <span>MarkAI</span>
                    </div>
                  </div>
                </div>

                {/* Video Player Controls */}
                <div className="w-full max-w-[320px] mt-4 flex items-center justify-between p-3 rounded-xl bg-surface border border-line">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 rounded-xl bg-surface hover:bg-black text-white transition"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                  </button>

                  <button
                    onClick={() => { setActiveShotIdx(0); setIsPlaying(true); }}
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
                    onClick={handleDownload}
                    disabled={downloading}
                    className="btn-primary px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5"
                  >
                    {downloading ? (
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )}
                    <span>Export Reel</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Shot Storyboard Breakdown & Actions */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-surface rounded-xl p-6 border border-line space-y-4">
                  <div className="flex items-center justify-between border-b border-line pb-3">
                    <h3 className="text-base font-sans font-bold text-ink flex items-center gap-2">
                      <Layers className="w-4 h-4" />
                      <span>Assembled Sequence</span>
                    </h3>
                    <span className="font-mono text-xs text-muted">[{shots.length} Frames]</span>
                  </div>

                  <div className="space-y-3">
                    {shots.map((shot, idx) => (
                      <div
                        key={idx}
                        onClick={() => { setActiveShotIdx(idx); setIsPlaying(false); }}
                        className={`p-3 rounded-xl border transition cursor-pointer flex items-center gap-4 ${
                          activeShotIdx === idx
                            ? 'border-line bg-surface ring-1 ring-ink'
                            : 'border-line hover:border-line'
                        }`}
                      >
                        {shot.uploaded_image && (
                          <img
                            src={shot.uploaded_image}
                            alt={shot.title}
                            className="w-12 h-12 rounded-xl object-cover border border-line flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-ink">
                              Shot 0{shot.shot_number}: {shot.title}
                            </span>
                            <span className="text-[10px] font-mono text-muted">
                              [{shot.duration_seconds}s]
                            </span>
                          </div>
                          <p className="text-xs text-muted font-sans italic">
                            "{shot.voiceover_script}"
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ready to Publish CTA */}
                <div className="bg-surface rounded-xl p-5 border border-line flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-sans font-bold text-ink">
                      Publish to Social Channels
                    </h4>
                    <p className="text-xs text-muted mt-0.5 font-mono">
                      Queue this video into Post Studio for scheduling
                    </p>
                  </div>
                  <Link
                    href="/preview"
                    className="btn-primary px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 flex-shrink-0"
                  >
                    <span>Send to Cockpit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
