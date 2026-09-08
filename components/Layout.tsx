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
    <div className="min-h-screen flex flex-col bg-white text-ink antialiased selection:bg-ink selection:text-white relative">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Structured Minimal Editorial Footer */}
      <footer className="border-t border-grey/30 bg-white mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-grey/30">
            
            {/* Col 1: Brand Info */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-sm bg-ink flex items-center justify-center text-white">
                  <span className="font-serif font-bold text-sm">M</span>
                </div>
                <span className="font-serif font-bold text-lg text-ink">MarkAI</span>
              </div>
              <p className="text-sm text-grey max-w-sm leading-relaxed">
                Voice-first AI social media automation for home businesses and local merchants in Tamil Nadu.
              </p>
              <div className="text-xs font-mono text-grey">
                Pitch Demo — Theervu&apos;athon · Sept 9, 2026
              </div>
            </div>

            {/* Col 2: Navigation Links */}
            <div>
              <h4 className="text-xs font-bold text-ink uppercase tracking-wider mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-grey">
                <li><Link href="/voice-onboarding" className="hover:text-ink transition">Voice Setup</Link></li>
                <li><Link href="/dashboard" className="hover:text-ink transition">Business Cockpit</Link></li>
                <li><Link href="/preview" className="hover:text-ink transition">Post Studio</Link></li>
                <li><Link href="/calendar" className="hover:text-ink transition">Content Calendar</Link></li>
                <li><Link href="/history" className="hover:text-ink transition">Publishing History</Link></li>
              </ul>
            </div>

            {/* Col 3: Authentication & Status */}
            <div>
              <h4 className="text-xs font-bold text-ink uppercase tracking-wider mb-3">Platform</h4>
              <ul className="space-y-2 text-sm text-grey">
                <li><Link href="/brand-kit" className="hover:text-ink transition">Brand Kit</Link></li>
                <li><Link href="/video-creator" className="hover:text-ink transition">Guided Video Creator</Link></li>
                <li><Link href="/login" className="text-ink font-medium hover:underline transition">Pitch Demo Login</Link></li>
                <li>
                  <span className="text-grey inline-flex items-center gap-1.5 mt-1 text-xs font-mono">
                    [System: Meta Graph &amp; Claude Online]
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-grey">
            <p>© 2026 MarkAI. Built for micro-enterprises with local voice AI.</p>
            <p>
              Anthropic Claude 3.5 Sonnet &amp; Meta Graph API
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
