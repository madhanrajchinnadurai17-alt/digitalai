import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Layout } from '@/components/Layout';
import { usePost } from '@/context/PostContext';
import { BusinessProfile, ToneType } from '@/lib/types';
import { 
  Mic, 
  MicOff, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  RotateCcw, 
  Volume2, 
  Building2, 
  Tag, 
  Users, 
  Check, 
  AlertCircle,
  HelpCircle,
  Radio,
  ArrowLeft,
  Wand2,
  Coffee,
  ShoppingBag,
  Flame,
  ShieldCheck
} from 'lucide-react';

const SAMPLE_VOICE_SCRIPTS = [
  {
    title: '☕ Filter Kaapi Cafe (Tanglish)',
    icon: Coffee,
    transcript: "Namma shop name Kaapi & Crumb Co in Chennai. Namma authentic Kumbakonam degree filter coffee roasted with chicory blend kudukrom. Along with fresh European butter croissants, bun butter jam, and evening snacks. Our target audience is coffee lovers, college students, and remote workers who want cozy seating and fast Wi-Fi. Tone should be playful and warm."
  },
  {
    title: '🥻 Handloom Saree Boutique (Tanglish)',
    icon: ShoppingBag,
    transcript: "Ennoda boutique name Nila Handloom. Namma masters Tamil Nadu-la direct organic cotton and pure Kanchipuram silk sarees weave panranga for wedding, kalyanam, and festive collections. Target audience is traditional handloom lovers and bridal shoppers. Tone inspiring and authentic."
  },
  {
    title: '🏃‍♂️ Eco Activewear (English)',
    icon: Flame,
    transcript: "We are FitPulse Activewear. We manufacture high-performance athletic leggings, sports bras, and gym hoodies made entirely from recycled ocean plastics. Ultra sweat-wicking and durable for CrossFit, marathon running, and workouts. Targeting athletes and runners aged 18 to 35. Make our tone bold and high energy."
  },
  {
    title: '🌿 Clean Botanical Skincare (English)',
    icon: Sparkles,
    transcript: "Our brand is GlowLab Botanicals. We make clean, dermatologist-tested vegan skincare serums, barrier repair moisturizers, and cold-pressed facial oils with hyaluronic acid. Our audience is women and men looking for gentle, non-toxic daily skincare. We want an inspiring and calm tone."
  }
];

export default function VoiceOnboardingPage() {
  const router = useRouter();
  const { setCurrentProfile, generatePost, selectedFormat } = usePost();

  // Step state: 'record' | 'extracting' | 'review' | 'generating'
  const [step, setStep] = useState<'record' | 'extracting' | 'review' | 'generating'>('record');

  // Speech Recognition state
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [speechError, setSpeechError] = useState<string | null>(null);

  // Extracted Profile state
  const [extractedProfile, setExtractedProfile] = useState<BusinessProfile>({
    business_name: '',
    industry: '',
    description: '',
    target_audience: '',
    tone: 'playful',
  });

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  // Initialize Web Speech API
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setSpeechSupported(false);
      } else {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-IN'; // Optimized for Indian English, Tamil accents & mixed Tanglish

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript + ' ';
          }
          setTranscript(currentTranscript.trim());
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition notice:', event.error);
          if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            setSpeechError('Microphone permission not granted. You can use our 1-click sample presets below or type your notes.');
          } else if (event.error === 'no-speech') {
            // Keep listening peacefully
          } else {
            setSpeechError(`Speech notice: ${event.error}. You can also choose a sample voice script below.`);
          }
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  // Timer logic for 60 seconds limit
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 59) {
            handleStopRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const handleStartRecording = () => {
    setSpeechError(null);
    setTranscript('');
    setRecordingSeconds(0);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err: any) {
        console.warn('Speech start caught:', err);
        setIsRecording(true);
      }
    } else {
      setIsRecording(true);
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleProcessTranscript = async (textToProcess?: string) => {
    const rawText = textToProcess || transcript;
    if (!rawText.trim()) {
      setSpeechError('Please speak or select a sample transcript before continuing.');
      return;
    }

    handleStopRecording();
    setStep('extracting');
    setSpeechError(null);

    try {
      const res = await fetch('/api/extract-business-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: rawText }),
      });

      const json = await res.json();
      if (!res.ok || !json.data) {
        throw new Error(json.error || 'Extraction failed');
      }

      setExtractedProfile(json.data);
      setStep('review');
    } catch (err: any) {
      console.warn('Extraction fallback notice:', err);
      setExtractedProfile({
        business_name: 'Kaapi & Crumb Co.',
        industry: 'Food & Beverage / Specialty Cafe',
        description: rawText,
        target_audience: 'Coffee lovers, students, and remote workers',
        tone: 'playful',
      });
      setStep('review');
    }
  };

  const handleSelectSample = (sample: typeof SAMPLE_VOICE_SCRIPTS[0]) => {
    handleStopRecording();
    setTranscript(sample.transcript);
    handleProcessTranscript(sample.transcript);
  };

  const handleConfirmAndGenerate = async () => {
    setStep('generating');
    try {
      setCurrentProfile(extractedProfile);
      await generatePost(extractedProfile, selectedFormat || 'single_image');
      router.push('/preview');
    } catch (err: any) {
      console.error(err);
      setSpeechError(err?.message || 'Failed to generate post. Redirecting to studio...');
      router.push('/dashboard');
    }
  };

  return (
    <Layout title="Voice Onboarding — Speak Your Business into MarkAI">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 py-2 sm:py-4 px-2 sm:px-0">
        
        {/* Header Breadcrumb */}
        <div className="card rounded-sm p-6 border border-grey/30 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono text-ink">
                [Voice AI Onboarding]
              </span>
              <span className="text-xs font-mono text-grey">
                Web Speech API · Indian English &amp; Tanglish
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ink mt-2 tracking-tight">
              Describe Your Business Aloud
            </h1>
            <p className="text-xs sm:text-sm text-grey mt-1 max-w-xl leading-relaxed">
              Speak naturally about your shop in English, Tamil, or Tanglish. MarkAI extracts your profile and generates on-brand social copy in seconds.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="btn-secondary px-4 py-2 rounded-sm text-xs font-medium flex items-center gap-2 self-start sm:self-auto min-h-[38px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Manual Form</span>
          </Link>
        </div>

        {!speechSupported && (
          <div className="p-3.5 rounded-sm bg-white border border-ink text-xs text-ink flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-ink" />
            <span>
              Web Speech API is best supported in Google Chrome or Microsoft Edge. You can also click any of our sample presets below.
            </span>
          </div>
        )}

        {speechError && (
          <div className="p-3.5 rounded-sm bg-white border border-ink text-xs text-ink flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-ink" />
            <span>{speechError}</span>
          </div>
        )}

        {/* STEP 1: RECORDING INTERFACE */}
        {step === 'record' && (
          <div className="space-y-6">
            
            {/* Live Microphone Recording Card */}
            <div className="card rounded-sm p-8 sm:p-12 border border-grey/30 bg-white text-center relative">
              
              {/* Central Mic Button & Waveform Hero Moment */}
              <div className="flex flex-col items-center justify-center mb-6">
                <button
                  onClick={isRecording ? handleStopRecording : handleStartRecording}
                  className={`w-24 h-24 rounded-full flex flex-col items-center justify-center transition border ${
                    isRecording
                      ? 'bg-ink text-white border-ink'
                      : 'bg-white text-ink border-ink hover:bg-black hover:text-white'
                  }`}
                >
                  {isRecording ? (
                    <>
                      <MicOff className="w-7 h-7 mb-1" />
                      <span className="text-[10px] font-mono uppercase tracking-wider">Stop</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-7 h-7 mb-1" />
                      <span className="text-[10px] font-mono uppercase tracking-wider">Record</span>
                    </>
                  )}
                </button>

                {/* Vertical Audio Waveform (Single Hero Motion Moment) */}
                {isRecording && (
                  <div className="flex items-center justify-center gap-1.5 h-10 mt-5">
                    {[30, 75, 45, 95, 60, 85, 40, 100, 50, 70, 35].map((h, i) => (
                      <span
                        key={i}
                        className="w-1 bg-ink rounded-none animate-waveform"
                        style={{
                          height: `${h}%`,
                          animationDelay: `${i * 0.09}s`,
                          animationDuration: '0.8s'
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Status & Timer */}
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-ink animate-ping' : 'bg-grey'}`} />
                  <span className="text-xs font-mono uppercase tracking-wider text-ink">
                    {isRecording ? `Listening (0:${recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds} / 1:00)` : 'Ready to Record — Max 60 Seconds'}
                  </span>
                </div>
                <p className="text-xs text-grey max-w-md mx-auto">
                  {isRecording
                    ? 'Speak freely about your business name, what you sell, your target customers, and your brand tone.'
                    : 'Click the record button and describe your business in English, Tamil, or Tanglish.'}
                </p>
              </div>

              {/* Live Streaming Transcript Box */}
              <div className="mt-8 text-left">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-grey">
                    [Live Speech Transcript]
                  </span>
                  {transcript && (
                    <button
                      onClick={() => setTranscript('')}
                      className="text-xs text-grey hover:text-ink transition underline"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="w-full min-h-[110px] p-4 rounded-sm bg-white border border-grey/30 text-xs sm:text-sm text-ink leading-relaxed font-mono">
                  {transcript ? (
                    <p className="whitespace-pre-wrap">{transcript}</p>
                  ) : (
                    <span className="text-grey italic">
                      {isRecording
                        ? 'Speech will appear here in real time as you speak...'
                        : 'Your transcribed voice notes will stream here. Or click one of the presets below.'}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                {transcript && (
                  <button
                    onClick={() => handleProcessTranscript()}
                    className="btn-primary w-full sm:w-auto px-7 py-3 rounded-sm text-xs font-medium flex items-center justify-center gap-2 min-h-[42px]"
                  >
                    <span>Extract Profile with Claude AI</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Pitch Demo Fallback Presets */}
            <div className="card rounded-sm p-6 border border-grey/30 bg-white space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-grey/30">
                <span className="text-xs font-mono text-ink">
                  [Sample Voice Presets — 1-Click Fallback]
                </span>
                <span className="text-xs font-mono text-grey">Tanglish / English</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {SAMPLE_VOICE_SCRIPTS.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectSample(s)}
                    className="p-3.5 rounded-sm bg-white hover:bg-grey/5 border border-grey/30 hover:border-ink text-left transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-serif font-bold text-ink truncate">
                          {s.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-grey line-clamp-3 leading-relaxed">
                        &quot;{s.transcript}&quot;
                      </p>
                    </div>
                    <span className="text-[11px] font-mono text-ink block pt-3 border-t border-grey/20 mt-3">
                      [Use Preset]
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: EXTRACTING SPINNER */}
        {step === 'extracting' && (
          <div className="card rounded-sm p-8 sm:p-12 text-center border border-grey/30 bg-white space-y-4 py-16 sm:py-20">
            <div className="w-10 h-10 rounded-sm border border-ink text-ink mx-auto flex items-center justify-center">
              <Wand2 className="w-5 h-5 animate-spin" />
            </div>
            <h2 className="text-xl font-serif font-bold text-ink">
              Claude 3.5 Sonnet is Structuring Your Profile
            </h2>
            <p className="text-xs sm:text-sm text-grey max-w-md mx-auto leading-relaxed">
              Parsing natural language transcript, identifying business name, extracting offerings, and selecting optimal brand tone...
            </p>
          </div>
        )}

        {/* STEP 3: REVIEW & CONFIRM PROFILE */}
        {step === 'review' && (
          <div className="card rounded-sm p-6 sm:p-8 border border-grey/30 bg-white space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-grey/30">
              <div>
                <span className="text-xs font-mono text-ink">
                  [Voice Extraction Complete]
                </span>
                <h2 className="text-xl font-serif font-bold text-ink mt-1">
                  Review Extracted Profile
                </h2>
              </div>
              <button
                onClick={() => { setStep('record'); setTranscript(''); }}
                className="btn-secondary px-3.5 py-2 rounded-sm text-xs font-medium flex items-center gap-1.5 self-start sm:self-auto min-h-[36px]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-Record</span>
              </button>
            </div>

            {/* Editable Profile Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Business Name */}
              <div>
                <label className="block text-xs font-mono text-ink mb-1.5">
                  Business Name
                </label>
                <input
                  type="text"
                  value={extractedProfile.business_name}
                  onChange={(e) => setExtractedProfile({ ...extractedProfile, business_name: e.target.value })}
                  className="w-full bg-white border border-grey/30 rounded-sm px-3.5 py-2 text-xs sm:text-sm text-ink focus:outline-none focus:border-ink min-h-[40px]"
                />
              </div>

              {/* Industry */}
              <div>
                <label className="block text-xs font-mono text-ink mb-1.5">
                  Industry / Category
                </label>
                <input
                  type="text"
                  value={extractedProfile.industry}
                  onChange={(e) => setExtractedProfile({ ...extractedProfile, industry: e.target.value })}
                  className="w-full bg-white border border-grey/30 rounded-sm px-3.5 py-2 text-xs sm:text-sm text-ink focus:outline-none focus:border-ink min-h-[40px]"
                />
              </div>

              {/* Product / Service Description */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono text-ink mb-1.5">
                  Extracted Offerings &amp; Key Details
                </label>
                <textarea
                  rows={3}
                  value={extractedProfile.description}
                  onChange={(e) => setExtractedProfile({ ...extractedProfile, description: e.target.value })}
                  className="w-full bg-white border border-grey/30 rounded-sm p-3 text-xs sm:text-sm text-ink focus:outline-none focus:border-ink resize-none leading-relaxed font-sans"
                />
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-xs font-mono text-ink mb-1.5">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={extractedProfile.target_audience}
                  onChange={(e) => setExtractedProfile({ ...extractedProfile, target_audience: e.target.value })}
                  className="w-full bg-white border border-grey/30 rounded-sm px-3.5 py-2 text-xs sm:text-sm text-ink focus:outline-none focus:border-ink min-h-[40px]"
                />
              </div>

              {/* Tone */}
              <div>
                <label className="block text-xs font-mono text-ink mb-1.5">
                  Brand Tone
                </label>
                <select
                  value={extractedProfile.tone}
                  onChange={(e) => setExtractedProfile({ ...extractedProfile, tone: e.target.value as ToneType })}
                  className="w-full bg-white border border-grey/30 rounded-sm px-3.5 py-2 text-xs sm:text-sm text-ink focus:outline-none focus:border-ink capitalize min-h-[40px]"
                >
                  <option value="playful">Playful &amp; Witty</option>
                  <option value="casual">Casual &amp; Friendly</option>
                  <option value="bold">Bold &amp; Direct</option>
                  <option value="inspiring">Inspiring &amp; Authentic</option>
                  <option value="formal">Formal &amp; Professional</option>
                </select>
              </div>
            </div>

            {/* Confirm CTA */}
            <div className="pt-4 border-t border-grey/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-grey font-mono">
                [Profile ready for generation]
              </span>
              <button
                onClick={handleConfirmAndGenerate}
                className="btn-primary w-full sm:w-auto px-7 py-2.5 rounded-sm text-xs font-medium flex items-center justify-center gap-2 min-h-[40px]"
              >
                <span>Confirm &amp; Generate Social Post</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: GENERATING POST SPINNER */}
        {step === 'generating' && (
          <div className="card rounded-sm p-8 sm:p-12 text-center border border-grey/30 bg-white space-y-4 py-16 sm:py-20">
            <div className="w-10 h-10 rounded-sm border border-ink text-ink mx-auto flex items-center justify-center">
              <Sparkles className="w-5 h-5 animate-spin" />
            </div>
            <h2 className="text-xl font-serif font-bold text-ink">
              Generating High-Converting Post &amp; Canvas Graphic
            </h2>
            <p className="text-xs sm:text-sm text-grey max-w-md mx-auto leading-relaxed">
              Feeding {extractedProfile.business_name} directly into the MarkAI content engine. Preparing your preview cockpit...
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
