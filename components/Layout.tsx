import React from 'react';
import Head from 'next/head';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function Layout({
  children,
  title = 'MarkAI — AI Social Media Auto-Poster for Small Business',
  description = 'Generate and auto-publish branded social media posts in seconds.',
}: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased selection:bg-brand-500 selection:text-white">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="border-t border-slate-900 bg-slate-950 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 MarkAI · Built for College Pitch Competition MVP (Sept 9, 2026)</p>
          <div className="flex items-center gap-4">
            <span>Powered by Anthropic Claude & Meta Graph API</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
