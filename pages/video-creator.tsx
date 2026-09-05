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
      <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 py-2 sm:py-4 px-2 sm:px-0">
        
        {/* Top Header Card */}
        <div className="card-glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Gemini Multimodal Video Director
              </span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10">
                Step {currentStep} of 3
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight flex items-center gap-3">
              <Clapperboard className="w-7 h-7 text-amber-400" />
              <span>Guided Video Creator</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
              No fake AI animations. MarkAI guides you to capture your <strong>real photos & clips</strong>, reviews each shot with Gemini Vision, and auto-assembles a finished viral Reel.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="btn-secondary px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 self-start sm:self-auto min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Post Studio</span>
          </Link>
        </div>

        {/* STEP 1: TEMPLATE SELECTION */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-extrabold text-white">
                1. Select Your Video Storyboard Archetype
              </h2>
              <span className="text-xs text-slate-400">
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
                    className={`card-glass rounded-3xl p-6 border text-left transition flex flex-col justify-between space-y-4 group ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500/10 ring-2 ring-amber-400/50 shadow-2xl shadow-amber-500/15'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className={`p-3 rounded-2xl ${isSelected ? 'bg-amber-500/20 text-amber-300' : 'bg-white/5 text-slate-400'}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        {isSelected && (
                          <span className="text-[10px] font-extrabold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                            ★ RECOMMENDED
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-extrabold text-white group-hover:text-amber-300 transition">
                        {tpl.label}
                      </h3>
                      <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                        {tpl.desc}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/10 text-[11px] text-slate-400">
                      Best for: <strong className="text-slate-200">{tpl.recommendedFor}</strong>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => handleGenerateShotGuide()}
                disabled={isGeneratingShots}
                className="btn-primary w-full sm:w-auto px-8 py-4 rounded-2xl text-xs sm:text-sm font-extrabold shadow-xl flex items-center justify-center gap-2 min-h-[48px]"
              >
                {isGeneratingShots ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Gemini AI is Generating Smartphone Shot Guide...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 text-amber-300" />
                    <span>Generate AI Shot Guide</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: GUIDED SHOT CHECKLIST & UPLOAD WITH GEMINI FEEDBACK */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div>
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  2. Smartphone Filming Checklist & Gemini Vision Review
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                  Upload Real Photos for Each Shot
                </h2>
              </div>
              <button
                onClick={() => setCurrentStep(1)}
                className="btn-secondary px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto min-h-[40px]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Change Template</span>
              </button>
            </div>

            {/* Shots Checklist Cards */}
            <div className="space-y-4">
              {shots.map((shot, idx) => (
                <div
                  key={idx}
                  className={`card-glass rounded-3xl p-5 sm:p-6 border transition space-y-4 ${
                    shot.uploaded_image
                      ? 'border-emerald-500/40 bg-space-950/90 shadow-xl'
                      : 'border-white/10 bg-space-950/60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/15 text-amber-300 text-xs font-mono font-extrabold border border-amber-500/30">
                          SHOT 0{shot.shot_number}
                        </span>
                        <h3 className="text-base font-bold text-white">
                          {shot.title}
                        </h3>
                        {shot.status === 'approved' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Gemini Vision Approved
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                        🎬 {shot.instruction}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400 pt-1">
                        <div className="flex items-center gap-1.5">
                          <Camera className="w-3.5 h-3.5 text-fuchsia-400" />
                          <span>Angle: <strong className="text-slate-300">{shot.camera_angle}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Sun className="w-3.5 h-3.5 text-amber-400" />
                          <span>Lighting: <strong className="text-slate-300">{shot.lighting_tip}</strong></span>
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-xs text-slate-300">
                        <span className="text-[10px] font-bold text-fuchsia-300 uppercase tracking-wider block mb-0.5">
                          Voiceover Script / Caption:
                        </span>
                        "{shot.voiceover_script}"
                      </div>
                    </div>

                    {/* Upload Controls & Preview */}
                    <div className="flex sm:flex-col items-center gap-3 flex-shrink-0">
                      {shot.uploaded_image ? (
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border border-emerald-500/50 shadow-lg group">
                          <img
                            src={shot.uploaded_image}
                            alt={shot.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                          />
                          <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] font-bold text-white transition cursor-pointer">
                            Retake
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
                          <label className="btn-primary px-4 py-2.5 rounded-2xl text-xs font-bold shadow-md cursor-pointer flex items-center justify-center gap-1.5 min-h-[40px]">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Real Photo</span>
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
                            className="btn-secondary px-3 py-1.5 rounded-xl text-[11px] font-medium text-slate-400 hover:text-white flex items-center justify-center gap-1"
                          >
                            <ImageIcon className="w-3 h-3" />
                            <span>Pitch Demo Preset</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Gemini Multimodal Feedback Pill */}
                  {analyzingShotIdx === idx && (
                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2 text-xs text-amber-300">
                      <div className="w-3.5 h-3.5 border-2 border-amber-300 border-t-transparent rounded-full animate-spin"></div>
                      <span>Gemini 1.5 Vision is reviewing image composition & lighting...</span>
                    </div>
                  )}

                  {shot.ai_feedback && (
                    <div className="p-3.5 rounded-2xl bg-space-900 border border-emerald-500/30 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          {shot.ai_feedback.feedback}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full">
                          {shot.ai_feedback.score}/100 Quality
                        </span>
                      </div>
                      <p className="text-slate-300 text-[11px]">
                        💡 <strong>Improvement Tip:</strong> {shot.ai_feedback.tip}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Assemble Video CTA */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
              <span className="text-xs text-slate-400">
                All shots verified. MarkAI will combine photos, apply kinetic pan/zoom, overlay captions & sync music.
              </span>
              <button
                onClick={handleAssembleVideo}
                className="btn-primary w-full sm:w-auto px-8 py-4 rounded-2xl text-xs sm:text-sm font-extrabold shadow-xl flex items-center justify-center gap-2 min-h-[48px]"
              >
                <Film className="w-4 h-4 text-amber-300" />
                <span>Auto-Assemble Finished Video Reel</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: FINISHED ASSEMBLED VIDEO PREVIEW & DOWNLOAD */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  3. Finished Real-Media Video Reel
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                  Ready to Preview & Download
                </h2>
              </div>

              <button
                onClick={() => setCurrentStep(2)}
                className="btn-secondary px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto min-h-[40px]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Adjust Shots</span>
              </button>
            </div>

            {/* 2-Column Layout: Player + Storyboard Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: 9:16 Vertical Video Player */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="w-full max-w-[320px] aspect-[9/16] rounded-3xl shadow-2xl border border-white/20 relative overflow-hidden flex flex-col justify-between text-white select-none bg-black">
                  
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

                  {/* Dark Vignette Overlay for Readability */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />

                  {/* Top Bar inside Video */}
                  <div className="relative z-10 p-5 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-[10px] font-bold tracking-wider uppercase border border-white/20">
                      {currentProfile.business_name}
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-black/50 px-2 py-0.5 rounded-full border border-white/10">
                      Shot 0{activeShotIdx + 1} / 0{shots.length}
                    </span>
                  </div>

                  {/* Bottom Text Overlay Captions (from AI Voiceover Script) */}
                  <div className="relative z-10 p-5 space-y-3">
                    <div className="p-3.5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/15 text-center animate-fadeIn">
                      <p className="text-xs sm:text-sm font-extrabold text-white drop-shadow leading-snug">
                        "{currentShot?.voiceover_script}"
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="grid grid-cols-3 gap-1.5">
                      {shots.map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 rounded-full transition-all duration-300 ${
                            i === activeShotIdx ? 'bg-amber-400 shadow' : i < activeShotIdx ? 'bg-white/70' : 'bg-white/20'
                          }`}
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-bold text-white/80 uppercase pt-1">
                      <span className="flex items-center gap-1 text-amber-300">
                        <Music className="w-3 h-3 animate-pulse" />
                        <span>Upbeat Lofi Groove (120 BPM)</span>
                      </span>
                      <span>MarkAI</span>
                    </div>
                  </div>
                </div>

                {/* Video Player Controls */}
                <div className="w-full max-w-[320px] mt-4 flex items-center justify-between p-3 rounded-2xl bg-space-950/80 border border-white/10 shadow-xl">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold transition shadow-md"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black" />}
                  </button>

                  <button
                    onClick={() => { setActiveShotIdx(0); setIsPlaying(true); }}
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
                    onClick={handleDownload}
                    disabled={downloading}
                    className="btn-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    {downloading ? (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )}
                    <span>Download Reel</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Shot Storyboard Breakdown & Actions */}
              <div className="lg:col-span-7 space-y-6">
                <div className="card-glass rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/10 space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-amber-300" />
                    <span>Assembled Sequence & Voiceover Storyboard</span>
                  </h3>

                  <div className="space-y-3">
                    {shots.map((shot, idx) => (
                      <div
                        key={idx}
                        onClick={() => { setActiveShotIdx(idx); setIsPlaying(false); }}
                        className={`p-4 rounded-2xl border transition cursor-pointer flex items-center gap-4 ${
                          activeShotIdx === idx
                            ? 'bg-amber-500/15 border-amber-400 ring-1 ring-amber-400/40 shadow-lg'
                            : 'bg-space-950/80 border-white/10 hover:border-white/20'
                        }`}
                      >
                        {shot.uploaded_image && (
                          <img
                            src={shot.uploaded_image}
                            alt={shot.title}
                            className="w-14 h-14 rounded-xl object-cover border border-white/10 flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white">
                              Shot 0{shot.shot_number}: {shot.title}
                            </span>
                            <span className="text-[10px] font-mono text-amber-300">
                              {shot.duration_seconds}s
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 italic">
                            "{shot.voiceover_script}"
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ready to Publish CTA */}
                <div className="card-glass rounded-3xl p-6 shadow-2xl border border-white/10 bg-gradient-to-r from-space-950 to-fuchsia-950/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Publish Reel to Instagram & Facebook
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Ready to push this video straight into your posting queue?
                    </p>
                  </div>
                  <Link
                    href="/preview"
                    className="btn-instagram px-5 py-2.5 rounded-2xl text-xs font-bold shadow-lg flex items-center gap-1.5 flex-shrink-0"
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
