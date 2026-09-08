import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Layout } from '@/components/Layout';
import { usePost } from '@/context/PostContext';
import { GraphicCanvas } from '@/components/GraphicCanvas';
import { StatusBadge } from '@/components/StatusBadge';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Save, 
  ArrowLeft, 
  Clock, 
  Image as ImageIcon, 
  Hash, 
  CheckCircle2, 
  AlertCircle, 
  Instagram, 
  Copy,
  Check,
  Layers,
  Film,
  Music,
  Video,
  ChevronRight
} from 'lucide-react';

export default function PreviewPage() {
  const router = useRouter();
  const { 
    currentProfile, 
    generatedPost, 
    publishToInstagram, 
    saveAsDraft, 
    isPosting,
    currentPostRecord,
    selectedFormat 
  } = usePost();

  const [caption, setCaption] = useState('');
  const [currentImageData, setCurrentImageData] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [copiedSlides, setCopiedSlides] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [postResult, setPostResult] = useState<{
    open: boolean;
    success: boolean;
    mediaId?: string;
    simulated?: boolean;
    message?: string;
    error?: string;
  }>({ open: false, success: false });

  // Sync initial generated content with fallback safety
  useEffect(() => {
    if (generatedPost) {
      const fullText = `${generatedPost.caption}\n\n${generatedPost.hashtags.join(' ')}`;
      setCaption(fullText);
    } else {
      // Fallback post generation so page never crashes on fresh direct navigation
      import('@/lib/mockData').then(({ generateFallbackPost }) => {
        const fallback = generateFallbackPost(currentProfile, selectedFormat || 'single_image');
        setCaption(`${fallback.caption}\n\n${fallback.hashtags.join(' ')}`);
      });
    }
  }, [generatedPost, currentProfile, selectedFormat]);

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopySlides = () => {
    if (generatedPost?.carousel_slides) {
      const formatted = generatedPost.carousel_slides
        .map(s => `[SLIDE ${s.slide_number}] ${s.headline}\n${s.body}\n(Visual Cue: ${s.visual_cue})`)
        .join('\n\n');
      navigator.clipboard.writeText(formatted);
      setCopiedSlides(true);
      setTimeout(() => setCopiedSlides(false), 2000);
    } else if (generatedPost?.reels_script) {
      const r = generatedPost.reels_script;
      const formatted = `HOOK: ${r.hook}\nDURATION: ${r.duration}\nMUSIC: ${r.music_suggestion}\n\nSCENES:\n` +
        r.scenes.map(s => `[${s.timestamp}] Visual: ${s.visual_action}\nAudio: ${s.spoken_audio}\nOn-Screen Text: ${s.on_screen_text}`).join('\n\n');
      navigator.clipboard.writeText(formatted);
      setCopiedSlides(true);
      setTimeout(() => setCopiedSlides(false), 2000);
    }
  };

  const handleSaveDraft = async () => {
    try {
      await saveAsDraft(caption, currentImageData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePublish = async () => {
    try {
      const res = await publishToInstagram(caption, currentImageData);
      if (res.success) {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 }
        });

        setPostResult({
          open: true,
          success: true,
          mediaId: res.media_id,
          simulated: res.simulated,
          message: res.simulated 
            ? 'Post successfully published in Sandbox Demo Mode!' 
            : 'Post successfully published live to your Instagram Business Account!'
        });
      } else {
        setPostResult({
          open: true,
          success: false,
          error: res.error || 'Failed to publish post to Instagram'
        });
      }
    } catch (err: any) {
      setPostResult({
        open: true,
        success: false,
        error: err?.message || 'Instagram publishing error'
      });
    }
  };

  const activePost = generatedPost || {
    format: selectedFormat || 'single_image',
    post_theme: `Transforming ${currentProfile.industry} with ${currentProfile.business_name}`,
    caption: `Experience premium quality with ${currentProfile.business_name}. Handcrafted with passion and intention. ✨`,
    hashtags: ['#SmallBusiness', '#HandcraftedQuality', '#LocalFavorite', `#${currentProfile.business_name.replace(/\s+/g, '')}`],
    visual_idea: 'High-contrast branded graphic with signature color overlay',
    best_time: 'Tuesday & Thursday at 8:15 AM'
  };

  const format = activePost.format || selectedFormat || 'single_image';

  return (
    <Layout title="Preview & Post — MarkAI">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Navigation & Header Breadcrumb */}
        <div className="card rounded-sm p-5 sm:p-6 border border-grey/30 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-2 rounded-sm border border-grey/30 text-grey hover:text-ink transition"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-ink">
                  [Studio Stage: {format === 'carousel' ? 'Carousel Outline' : format === 'reels_script' ? 'Reels Storyboard' : 'Review & Publish'}]
                </span>
                {currentPostRecord?.status && (
                  <StatusBadge status={currentPostRecord.status} size="sm" />
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-ink mt-1">
                Post Studio — {currentProfile.business_name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleSaveDraft}
              className="btn-secondary px-3.5 py-2 rounded-sm text-xs font-medium"
            >
              {saveSuccess ? (
                <span className="text-ink font-mono">[Saved]</span>
              ) : (
                <span>Save Draft</span>
              )}
            </button>

            <button
              onClick={handlePublish}
              disabled={isPosting}
              className="btn-primary px-5 py-2 rounded-sm text-xs font-medium"
            >
              {isPosting ? (
                <span>Publishing to Instagram...</span>
              ) : (
                <span>Post to Instagram</span>
              )}
            </button>
          </div>
        </div>

        {/* AI Insight Metadata Chips */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="card p-4 rounded-sm border border-grey/30 bg-white">
            <span className="text-xs font-mono text-grey block">
              [Theme Hook]
            </span>
            <p className="text-xs font-medium text-ink mt-1 line-clamp-1">
              {activePost.post_theme}
            </p>
          </div>

          <div className="card p-4 rounded-sm border border-grey/30 bg-white">
            <span className="text-xs font-mono text-grey block">
              [Posting Window]
            </span>
            <p className="text-xs font-medium text-ink mt-1">
              {activePost.best_time}
            </p>
          </div>

          <div className="card p-4 rounded-sm border border-grey/30 bg-white">
            <span className="text-xs font-mono text-grey block">
              [Creative Angle]
            </span>
            <p className="text-xs font-medium text-ink mt-1 line-clamp-1">
              {activePost.visual_idea}
            </p>
          </div>
        </div>

        {/* Dynamic Multi-Format Cockpit */}
        {format === 'carousel' ? (
          /* Multi-Slide Carousel Outline View */
          <div className="space-y-6">
            <div className="card rounded-sm p-6 border border-grey/30 bg-white">
              <div className="flex items-center justify-between pb-4 border-b border-grey/30 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-ink">
                    [Carousel Deck: {activePost.carousel_slides?.length || 5} Slides]
                  </span>
                </div>
                <button
                  onClick={handleCopySlides}
                  className="btn-secondary px-3 py-1.5 rounded-sm text-xs font-medium"
                >
                  {copiedSlides ? 'Deck Copied' : 'Copy Slide Outline'}
                </button>
              </div>

              {/* Slide Deck Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {activePost.carousel_slides?.map((slide) => (
                  <div
                    key={slide.slide_number}
                    className="p-4 rounded-sm border border-grey/30 bg-white flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono text-grey mb-2">
                        <span>SLIDE 0{slide.slide_number}</span>
                        {slide.slide_number === 1 && (
                          <span className="text-[10px] font-mono text-ink">
                            [HOOK]
                          </span>
                        )}
                        {slide.slide_number === 5 && (
                          <span className="text-[10px] font-mono text-ink">
                            [CTA]
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-serif font-bold text-ink leading-snug">
                        {slide.headline}
                      </h4>
                      <p className="text-[11px] text-grey mt-2 leading-relaxed">
                        {slide.body}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-grey/20 text-[10px] text-grey font-mono">
                      Visual: {slide.visual_cue}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Accompanying Caption Editor */}
            <div className="card rounded-sm p-6 border border-grey/30 bg-white">
              <div className="flex items-center justify-between pb-3 border-b border-grey/30 mb-3">
                <span className="text-xs font-mono text-ink">
                  [Carousel Intro Caption]
                </span>
                <button
                  onClick={handleCopyCaption}
                  className="text-xs text-grey hover:text-ink underline transition"
                >
                  {copied ? 'Copied' : 'Copy Caption'}
                </button>
              </div>
              <textarea
                rows={5}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full bg-white border border-grey/30 rounded-sm p-3.5 text-xs sm:text-sm text-ink leading-relaxed focus:outline-none focus:border-ink resize-none font-sans"
              />
            </div>
          </div>
        ) : format === 'reels_script' ? (
          /* Reels / Video Script Storyboard View */
          <div className="space-y-6">
            <div className="card rounded-sm p-6 border border-grey/30 bg-white space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-grey/30">
                <div>
                  <h3 className="text-base font-serif font-bold text-ink">Reels Video Storyboard</h3>
                  <div className="flex items-center gap-3 text-xs font-mono text-grey mt-0.5">
                    <span>Duration: {activePost.reels_script?.duration || '20s'}</span>
                    <span>·</span>
                    <span>Music: {activePost.reels_script?.music_suggestion || 'Upbeat Kinetic Lofi'}</span>
                  </div>
                </div>

                <button
                  onClick={handleCopySlides}
                  className="btn-secondary px-3 py-1.5 rounded-sm text-xs font-medium"
                >
                  {copiedSlides ? 'Script Copied' : 'Copy Script'}
                </button>
              </div>

              {/* 3-Second Hook Callout */}
              <div className="p-3.5 rounded-sm border border-grey/30 bg-white flex items-start gap-3">
                <span className="text-xs font-mono text-ink shrink-0">
                  [Hook]
                </span>
                <p className="text-xs sm:text-sm text-ink">
                  &quot;{activePost.reels_script?.hook || activePost.post_theme}&quot;
                </p>
              </div>

              {/* Scene Breakdown Storyboard */}
              <div className="space-y-2">
                <span className="text-xs font-mono text-grey block">
                  [Scene Timeline]
                </span>

                <div className="grid grid-cols-1 gap-2">
                  {activePost.reels_script?.scenes?.map((scene, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-sm border border-grey/30 bg-white grid grid-cols-1 md:grid-cols-12 gap-3 items-center"
                    >
                      <div className="md:col-span-2">
                        <span className="text-xs font-mono text-ink">
                          [{scene.timestamp}]
                        </span>
                      </div>
                      <div className="md:col-span-4 text-xs text-ink">
                        <span className="text-grey font-mono block text-[10px]">VISUAL:</span>
                        {scene.visual_action}
                      </div>
                      <div className="md:col-span-4 text-xs text-grey">
                        <span className="text-grey font-mono block text-[10px]">VOICEOVER:</span>
                        {scene.spoken_audio}
                      </div>
                      <div className="md:col-span-2 text-xs font-mono text-ink text-right">
                        {scene.on_screen_text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Accompanying Caption */}
            <div className="card rounded-sm p-6 border border-grey/30 bg-white">
              <div className="flex items-center justify-between pb-3 border-b border-grey/30 mb-3">
                <span className="text-xs font-mono text-ink">
                  [Reels Caption &amp; Hashtags]
                </span>
                <button
                  onClick={handleCopyCaption}
                  className="text-xs text-grey hover:text-ink underline transition"
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <textarea
                rows={4}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full bg-white border border-grey/30 rounded-sm p-3.5 text-xs sm:text-sm text-ink leading-relaxed focus:outline-none focus:border-ink resize-none font-sans"
              />
            </div>
          </div>
        ) : (
          /* Default: Single Image Post with HTML5 Canvas Studio */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            <div className="lg:col-span-6 space-y-4">
              <div className="card rounded-sm p-6 border border-grey/30 bg-white flex flex-col h-full">
                <div className="flex items-center justify-between pb-3.5 border-b border-grey/30 mb-3">
                  <span className="text-xs font-mono text-ink">
                    [Instagram Caption &amp; Copy]
                  </span>
                  <button
                    onClick={handleCopyCaption}
                    className="text-xs text-grey hover:text-ink underline transition"
                  >
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>

                <div className="flex-1">
                  <textarea
                    rows={14}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="w-full h-full min-h-[330px] bg-white border border-grey/30 rounded-sm p-3.5 text-xs sm:text-sm text-ink leading-relaxed placeholder-grey focus:outline-none focus:border-ink transition resize-none font-sans"
                    placeholder="Your generated caption will appear here..."
                  />
                </div>

                <div className="mt-3 flex items-center justify-between text-xs font-mono text-grey">
                  <span>[{activePost.hashtags?.length || 0} Hashtags]</span>
                  <span>{caption.length} characters</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <div className="card rounded-sm p-6 border border-grey/30 bg-white">
                <div className="flex items-center justify-between pb-3.5 border-b border-grey/30 mb-4">
                  <span className="text-xs font-mono text-ink">
                    [Canvas Graphic Viewport · 1080 × 1080]
                  </span>
                </div>

                <GraphicCanvas
                  businessName={currentProfile.business_name}
                  themeTitle={activePost.post_theme}
                  onImageReady={(dataUrl) => setCurrentImageData(dataUrl)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Post Result Feedback Modal */}
        {postResult.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-sm max-w-md w-full p-6 text-center border border-ink">
              {postResult.success ? (
                <>
                  <h3 className="text-xl font-serif font-bold text-ink">Post Dispatched</h3>
                  <p className="text-xs text-grey mt-2">
                    {postResult.message}
                  </p>
                  
                  {postResult.mediaId && (
                    <div className="mt-4 p-3 rounded-sm bg-white border border-grey/30 text-left">
                      <span className="text-[10px] text-grey font-mono block">Media ID:</span>
                      <code className="text-xs font-mono text-ink break-all">{postResult.mediaId}</code>
                    </div>
                  )}

                  <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
                    <Link
                      href="/history"
                      className="btn-primary flex-1 py-2 px-4 rounded-sm text-xs font-medium text-center"
                    >
                      View Ledger
                    </Link>
                    <button
                      onClick={() => setPostResult({ open: false, success: false })}
                      className="btn-secondary flex-1 py-2 px-4 rounded-sm text-xs font-medium"
                    >
                      Dismiss
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-serif font-bold text-ink">Publishing Notice</h3>
                  <p className="text-xs text-grey mt-2">
                    {postResult.error}
                  </p>
                  <button
                    onClick={() => setPostResult({ open: false, success: false })}
                    className="btn-secondary mt-6 w-full py-2 px-4 rounded-sm text-xs font-medium"
                  >
                    Dismiss
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
