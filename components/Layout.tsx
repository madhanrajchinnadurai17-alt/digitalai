import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Navbar } from './Navbar';
import { Sparkles, ArrowUpRight, Github } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function Layout({
  children,
  title = 'MarkAI — AI Social Media Auto-Poster for Small Business',
  description = 'Generate on-brand captions, targeted hashtags, and branded graphics in seconds, then auto-post directly to Instagram.',
}: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#070512] text-slate-100 antialiased selection:bg-fuchsia-500 selection:text-white relative overflow-x-hidden">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Ambient background glowing orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-violet-600/15 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-fuchsia-600/15 rounded-full blur-[140px]"></div>
        <div className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[160px]"></div>
      </div>

      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {children}
      </main>

      {/* Unified Global Footer */}
      <footer className="border-t border-white/[0.08] bg-[#0A071B]/90 backdrop-blur-xl relative z-10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-white/[0.06]">
            
            {/* Col 1: Brand Info */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-amber-400 p-[1px]">
                  <div className="w-full h-full bg-[#0E0927] rounded-[11px] flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </div>
                </div>
                <span className="font-extrabold text-lg tracking-tight text-white">MarkAI</span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                The AI-powered social media generator & Instagram auto-poster built for small businesses to dominate digital engagement.
              </p>
              <div className="inline-flex items-center gap-2 text-[11px] font-semibold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                <span>🏆 College Pitch Competition · Sept 9, 2026</span>
              </div>
            </div>

            {/* Col 2: Navigation Links */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Product</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><Link href="/dashboard" className="hover:text-white transition">Business Cockpit</Link></li>
                <li><Link href="/preview" className="hover:text-white transition">Post Studio</Link></li>
                <li><Link href="/history" className="hover:text-white transition">Publishing History</Link></li>
                <li><Link href="/#demo" className="hover:text-white transition">Live Pitch Demo</Link></li>
              </ul>
            </div>

            {/* Col 3: Authentication & Status */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Access</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><Link href="/login" className="hover:text-white transition">Founder Login</Link></li>
                <li><Link href="/signup" className="hover:text-white transition">Create Account</Link></li>
                <li><Link href="/login" className="text-fuchsia-400 hover:text-fuchsia-300 font-semibold transition">1-Click Demo Login</Link></li>
                <li><span className="text-emerald-400 flex items-center gap-1.5 mt-1"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Meta & Claude Online</span></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© 2026 MarkAI · Built for Pitch Competition MVP. All rights reserved.</p>
            <p className="text-[11px] text-slate-500">
              Powered by Anthropic Claude 3.5 Sonnet & Meta Graph API
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
