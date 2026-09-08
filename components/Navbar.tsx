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
      <header className="sticky top-0 z-40 border-b border-grey/30 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-sm bg-ink flex items-center justify-center text-white">
                  <span className="font-serif font-bold text-base leading-none">M</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-xl text-ink tracking-tight">
                      MarkAI
                    </span>
                    <span className="text-[11px] font-mono text-grey">
                      [Voice-First]
                    </span>
                  </div>
                  <span className="text-[11px] text-grey hidden sm:block">
                    Social Automation for Micro-Enterprises
                  </span>
                </div>
              </Link>
            </div>

            {/* Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1 p-1 rounded-sm border border-grey/30 bg-white">
              {(user ? appNavItems : landingNavItems).map((item) => {
                const isActive = router.pathname === item.href;
                const Icon = (item as any).icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium transition ${
                      isActive
                        ? 'bg-ink text-white'
                        : 'text-grey hover:text-ink hover:bg-white'
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
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm text-xs font-medium text-grey hover:text-ink border border-grey/30 transition"
              >
                <Activity className="w-3.5 h-3.5 text-ink" />
                <span className="hidden sm:inline">System Health</span>
              </button>

              {user ? (
                <div className="flex items-center gap-2.5">
                  <div className="hidden lg:flex flex-col text-right">
                    <span className="text-xs font-medium text-ink truncate max-w-[120px]">
                      {user.displayName || user.email?.split('@')[0]}
                    </span>
                    <span className="text-[10px] text-grey font-mono">
                      {user.isDemoUser ? '[Demo Account]' : '[Standard]'}
                    </span>
                  </div>

                  <button
                    onClick={() => logout().then(() => router.push('/'))}
                    title="Sign Out"
                    className="p-1.5 rounded-sm text-grey hover:text-ink border border-grey/30 transition"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/voice-onboarding"
                    className="px-3 py-1.5 rounded-sm text-xs font-medium border border-grey/30 text-ink hover:border-ink transition hidden sm:inline-flex items-center gap-1.5"
                  >
                    <Mic className="w-3.5 h-3.5 text-ink" />
                    <span>Voice Setup</span>
                  </Link>
                  <Link
                    href="/login"
                    className="btn-secondary px-3 py-1.5 rounded-sm text-xs hidden sm:inline-flex"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="btn-primary px-3.5 py-1.5 rounded-sm text-xs font-medium"
                  >
                    Try Free
                  </Link>
                </div>
              )}

              {/* Mobile / Tablet Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-sm text-ink xl:hidden border border-grey/30"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile / Tablet Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-grey/30 bg-white p-4 space-y-1.5 max-h-[85vh] overflow-y-auto">
            {(user ? appNavItems : landingNavItems).map((item) => {
              const Icon = (item as any).icon;
              const isActive = router.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-sm text-sm font-medium transition ${
                    isActive ? 'bg-ink text-white' : 'text-ink hover:bg-grey/10'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4 text-grey" />}
                  <span>{item.label}</span>
                </Link>
              );
            })}
            {!user && (
              <div className="pt-3 border-t border-grey/30 flex flex-col gap-2">
                <Link
                  href="/voice-onboarding"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary w-full py-2.5 rounded-sm text-xs text-center flex items-center justify-center gap-1.5"
                >
                  <Mic className="w-4 h-4" />
                  <span>Voice AI Onboarding</span>
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-secondary w-full py-2.5 rounded-sm text-xs text-center"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary w-full py-2.5 rounded-sm text-xs text-center"
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
