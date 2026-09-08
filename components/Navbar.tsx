import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  Sparkles, 
  LayoutDashboard, 
  Eye, 
  History, 
  LogOut, 
  Activity, 
  ArrowRight, 
  Zap, 
  Menu, 
  X,
  CalendarDays,
  Palette,
  Share2,
  BarChart3,
  Film,
  Globe,
  Bot,
  Clapperboard,
  Mic
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { SystemStatusModal } from './SystemStatusModal';

export function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const appNavItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/voice-onboarding', label: 'Voice Setup', icon: Mic },
    { href: '/video-creator', label: 'Guided Video', icon: Clapperboard, highlight: true },
    { href: '/calendar', label: 'Calendar', icon: CalendarDays },
    { href: '/video-studio', label: 'Video Studio', icon: Film },
    { href: '/platforms', label: 'Channels', icon: Share2 },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/website-builder', label: 'Website', icon: Globe },
    { href: '/agent', label: 'AI Agent', icon: Bot },
    { href: '/brand-kit', label: 'Brand Kit', icon: Palette },
    { href: '/history', label: 'History', icon: History },
  ];

  const landingNavItems = [
    { href: '/#features', label: 'Features' },
    { href: '/#how-it-works', label: 'How It Works' },
    { href: '/#demo', label: 'Live Demo' },
    { href: '/voice-onboarding', label: '🎙️ Voice AI' },
    { href: '/video-creator', label: '🎬 Video Creator', highlight: true },
    { href: '/calendar', label: 'Calendar' },
    { href: '/agent', label: 'CMO Agent' },
    { href: '/dashboard', label: 'Cockpit' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-kanchipuram flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
                  <Sparkles className="w-4 h-4 text-marigold" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-xl text-ink tracking-tight">
                      MarkAI
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-kanchipuram-light text-kanchipuram border border-kanchipuram-border">
                      <span className="w-1.5 h-1.5 rounded-full bg-kanchipuram animate-pulse"></span>
                      Voice-First
                    </span>
                  </div>
                  <span className="text-[11px] text-muted font-normal hidden sm:block">
                    AI Marketing for Home &amp; Local Business
                  </span>
                </div>
              </Link>
            </div>

            {/* Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1 p-1 rounded-xl bg-gray-50 border border-border">
              {(user ? appNavItems : landingNavItems).map((item) => {
                const isActive = router.pathname === item.href;
                const Icon = (item as any).icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      isActive
                        ? 'bg-kanchipuram text-white shadow-sm'
                        : (item as any).highlight
                        ? 'bg-tumbler-light text-tumbler font-semibold border border-tumbler-border hover:bg-amber-100'
                        : 'text-muted hover:text-ink hover:bg-white'
                    }`}
                  >
                    {Icon && <Icon className="w-3.5 h-3.5" />}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Area */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setShowStatusModal(true)}
                title="System Status"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted hover:text-ink bg-gray-50 hover:bg-gray-100 border border-border transition"
              >
                <Activity className="w-3.5 h-3.5 text-success" />
                <span className="hidden sm:inline">Health</span>
              </button>

              {user ? (
                <div className="flex items-center gap-2.5">
                  <div className="hidden lg:flex flex-col text-right">
                    <span className="text-xs font-semibold text-ink truncate max-w-[120px]">
                      {user.displayName || user.email?.split('@')[0]}
                    </span>
                    <span className="text-[10px] text-muted font-medium">
                      {user.isDemoUser ? 'Pitch Demo' : 'Account'}
                    </span>
                  </div>

                  <button
                    onClick={() => logout().then(() => router.push('/'))}
                    title="Sign Out"
                    className="p-1.5 rounded-lg text-muted hover:text-danger hover:bg-danger-light border border-border transition"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/voice-onboarding"
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-kanchipuram-light text-kanchipuram border border-kanchipuram-border hover:bg-indigo-100 transition hidden sm:inline-flex items-center gap-1.5"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Voice Setup</span>
                  </Link>
                  <Link
                    href="/login"
                    className="btn-secondary px-3 py-1.5 rounded-lg text-xs font-semibold hidden sm:inline-flex"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="btn-primary px-3.5 py-1.5 rounded-lg text-xs font-semibold"
                  >
                    <span>Try Free</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}

              {/* Mobile / Tablet Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-ink xl:hidden bg-gray-50 border border-border"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile / Tablet Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-border bg-surface p-4 space-y-1.5 max-h-[85vh] overflow-y-auto shadow-lg">
            {(user ? appNavItems : landingNavItems).map((item) => {
              const Icon = (item as any).icon;
              const isActive = router.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive ? 'bg-kanchipuram text-white' : 'text-ink hover:bg-gray-100'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4 text-muted" />}
                  <span>{item.label}</span>
                </Link>
              );
            })}
            {!user && (
              <div className="pt-3 border-t border-border flex flex-col gap-2">
                <Link
                  href="/voice-onboarding"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary w-full py-2.5 rounded-xl text-xs text-center flex items-center justify-center gap-1.5"
                >
                  <Mic className="w-4 h-4" />
                  <span>Voice AI Onboarding</span>
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-secondary w-full py-2.5 rounded-xl text-xs text-center"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary w-full py-2.5 rounded-xl text-xs text-center"
                >
                  Create Free Account
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      <SystemStatusModal isOpen={showStatusModal} onClose={() => setShowStatusModal(false)} />
    </>
  );
}
