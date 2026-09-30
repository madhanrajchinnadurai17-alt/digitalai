import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Navbar } from './Navbar';
import { Sparkles } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function Layout({
  children,
  title = 'MarkAI — Voice-First AI Marketing Platform',
  description = 'Generate on-brand captions, targeted hashtags, and branded graphics in seconds, then auto-post directly to Instagram.',
}: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B0D13] text-slate-100 antialiased selection:bg-ai-violet selection:text-white relative overflow-x-hidden">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Cyber Ambient Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-ai-violet/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-ai-cyan/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] bg-ai-indigo/10 rounded-full blur-[140px]" />
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Modern Cyber Glass Footer */}
        <footer className="border-t border-white/10 bg-[#0E111B]/80 backdrop-blur-xl mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-white/10">
              
              {/* Col 1: Brand Info */}
              <div className="md:col-span-2 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-ai-violet to-ai-cyan flex items-center justify-center text-white shadow-ai-glow">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-lg text-white tracking-tight">MarkAI</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-ai-violet/20 text-ai-violet border border-ai-violet/30">
                    AI AGENT v2.0
                  </span>
                </div>
                <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                  Voice-first autonomous AI marketing engine. Multi-modal generation across captions, branded graphics, and guided reels.
                </p>
                <div className="text-xs font-mono text-slate-500">
                  Autonomous Marketing Agent · September 2026
                </div>
              </div>

              {/* Col 2: Navigation Links */}
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">AI Workflows</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><Link href="/voice-onboarding" className="hover:text-ai-cyan transition">Voice Setup</Link></li>
                  <li><Link href="/dashboard" className="hover:text-ai-cyan transition">Business Cockpit</Link></li>
                  <li><Link href="/preview" className="hover:text-ai-cyan transition">Post Studio</Link></li>
                  <li><Link href="/calendar" className="hover:text-ai-cyan transition">Content Calendar</Link></li>
                  <li><Link href="/history" className="hover:text-ai-cyan transition">Publishing History</Link></li>
                </ul>
              </div>

              {/* Col 3: Authentication & Status */}
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Ecosystem</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><Link href="/brand-kit" className="hover:text-ai-cyan transition">Brand Kit</Link></li>
                  <li><Link href="/video-creator" className="hover:text-ai-cyan transition">Guided Video Creator</Link></li>
                  <li><Link href="/agent" className="hover:text-ai-cyan transition">CMO Agent</Link></li>
                  <li><Link href="/login" className="text-ai-violet font-medium hover:underline transition">Pitch Demo Login</Link></li>
                  <li>
                    <span className="text-slate-400 inline-flex items-center gap-1.5 mt-1 text-xs font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Claude 3.5 Sonnet &amp; Gemini Vision Online
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <p>© 2026 MarkAI. Autonomous local commerce marketing.</p>
              <p className="flex items-center gap-2">
                <span className="text-ai-violet">●</span> Anthropic Claude &amp; Google Gemini Multimodal
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
