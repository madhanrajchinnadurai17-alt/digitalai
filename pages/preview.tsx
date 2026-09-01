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
  Check
} from 'lucide-react';

export default function PreviewPage() {
  const router = useRouter();
  const { 
    currentProfile, 
    generatedPost, 
    publishToInstagram, 
    saveAsDraft, 
    isPosting,
    currentPostRecord 
  } = usePost();

  const [caption, setCaption] = useState('');
  const [currentImageData, setCurrentImageData] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [postResult, setPostResult] = useState<{
    open: boolean;
    success: boolean;
    mediaId?: string;
    simulated?: boolean;
    message?: string;
    error?: string;
  }>({ open: false, success: false });

  // Sync initial generated content
  useEffect(() => {
    if (generatedPost) {
      const fullText = `${generatedPost.caption}\n\n${generatedPost.hashtags.join(' ')}`;
      setCaption(fullText);
    } else {
      router.replace('/dashboard');
    }
  }, [generatedPost, router]);

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  if (!generatedPost) {
    return null;
  }

  return (
    <Layout title="Preview & Post — MarkAI">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Navigation & Header Breadcrumb */}
        <div className="card-glass rounded-3xl p-5 sm:p-6 shadow-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-2.5 rounded-2xl bg-white/[0.05] border border-white/10 text-slate-400 hover:text-white transition"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Step 2 of 2 · Preview & Post
                </span>
                {currentPostRecord?.status && (
                  <StatusBadge status={currentPostRecord.status} size="sm" />
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                Post Cockpit for {currentProfile.business_name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveDraft}
              className="btn-secondary px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Saved to History</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-slate-400" />
                  <span>Save Draft</span>
                </>
              )}
            </button>

            <button
              onClick={handlePublish}
              disabled={isPosting}
              className="btn-instagram px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold shadow-lg"
            >
              {isPosting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Publishing to Instagram...</span>
                </>
              ) : (
                <>
                  <Instagram className="w-4 h-4" />
                  <span>Post to Instagram</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Insight Metadata Chips */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card-glass p-4 rounded-2xl flex items-start gap-3 border border-white/[0.08]">
            <div className="p-2.5 rounded-xl bg-fuchsia-500/15 text-fuchsia-400 flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Post Theme Hook
              </span>
              <p className="text-xs font-semibold text-slate-200 mt-0.5 line-clamp-1">
                {generatedPost.post_theme}
              </p>
            </div>
          </div>

          <div className="card-glass p-4 rounded-2xl flex items-start gap-3 border border-white/[0.08]">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 flex-shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Optimal Posting Window
              </span>
              <p className="text-xs font-semibold text-emerald-300 mt-0.5">
                {generatedPost.best_time}
              </p>
            </div>
          </div>

          <div className="card-glass p-4 rounded-2xl flex items-start gap-3 border border-white/[0.08]">
            <div className="p-2.5 rounded-xl bg-violet-500/15 text-violet-400 flex-shrink-0">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Visual Concept Idea
              </span>
              <p className="text-xs font-semibold text-slate-300 mt-0.5 line-clamp-1">
                {generatedPost.visual_idea}
              </p>
            </div>
          </div>
        </div>

        {/* Split Cockpit: Left Caption Editor | Right Canvas Graphic */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Editable Caption Area */}
          <div className="lg:col-span-6 space-y-4">
            <div className="card-glass rounded-3xl p-6 shadow-2xl border border-white/10 flex flex-col h-full">
              <div className="flex items-center justify-between pb-3.5 border-b border-white/10 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Instagram Caption & Copy
                  </span>
                  <span className="text-[11px] text-fuchsia-400 font-semibold">(Editable)</span>
                </div>
                <button
                  onClick={handleCopyCaption}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition"
                  title="Copy caption to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 text-[11px] font-bold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-medium">Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex-1">
                <textarea
                  rows={14}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full h-full min-h-[330px] bg-space-950/80 border border-white/10 rounded-2xl p-4 text-sm text-slate-200 leading-relaxed placeholder-slate-500 focus:outline-none focus:border-brand-fuchsia focus:ring-1 focus:ring-brand-fuchsia transition resize-none font-sans"
                  placeholder="Your generated caption will appear here..."
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Hash className="w-3.5 h-3.5 text-fuchsia-400" />
                  <span>{generatedPost.hashtags?.length || 0} Hashtags Included</span>
                </div>
                <span>{caption.length} characters</span>
              </div>
            </div>
          </div>

          {/* Right: Auto-generated Branded Graphic Overlay Canvas */}
          <div className="lg:col-span-6 space-y-4">
            <div className="card-glass rounded-3xl p-6 shadow-2xl border border-white/10">
              <div className="flex items-center justify-between pb-3.5 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Branded Text-Overlay Creative
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/30">
                    1080 × 1080
                  </span>
                </div>
              </div>

              {/* High-Resolution HTML5 Canvas Component */}
              <GraphicCanvas
                businessName={currentProfile.business_name}
                themeTitle={generatedPost.post_theme}
                onImageReady={(dataUrl) => setCurrentImageData(dataUrl)}
              />
            </div>
          </div>
        </div>

        {/* Post Result Feedback Modal */}
        {postResult.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="card-glass rounded-3xl max-w-md w-full p-7 shadow-2xl text-center border border-white/10">
              {postResult.success ? (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-inner">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-extrabold text-white">Post Successfully Published!</h3>
                  <p className="text-xs text-slate-300 mt-2">
                    {postResult.message}
                  </p>
                  
                  {postResult.mediaId && (
                    <div className="mt-4 p-3 rounded-2xl bg-space-950 border border-white/10 text-left">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">Instagram Media ID:</span>
                      <code className="text-xs font-mono text-emerald-400 break-all">{postResult.mediaId}</code>
                    </div>
                  )}

                  <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
                    <Link
                      href="/history"
                      className="btn-primary flex-1 py-3 px-4 rounded-xl text-xs font-bold"
                    >
                      View Post History
                    </Link>
                    <button
                      onClick={() => setPostResult({ open: false, success: false })}
                      className="btn-secondary flex-1 py-3 px-4 rounded-xl text-xs font-bold"
                    >
                      Close
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto mb-4 shadow-inner">
                    <AlertCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-extrabold text-white">Publishing Issue</h3>
                  <p className="text-xs text-rose-300 mt-2">
                    {postResult.error}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-3">
                    In pitch demo mode, MarkAI handles sandbox posting automatically. Check your Meta Graph API credentials if testing live production tokens.
                  </p>
                  <button
                    onClick={() => setPostResult({ open: false, success: false })}
                    className="btn-secondary mt-6 w-full py-3 px-4 rounded-xl text-xs font-bold"
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
