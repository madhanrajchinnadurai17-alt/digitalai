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
  Palette
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
    { href: '/calendar', label: '30-Day Calendar', icon: CalendarDays },
    { href: '/brand-kit', label: 'Brand Kit', icon: Palette },
    { href: '/preview', label: 'Studio Preview', icon: Eye },
    { href: '/history', label: 'Post History', icon: History },
  ];

  const landingNavItems = [
    { href: '/#features', label: 'Features' },
    { href: '/#how-it-works', label: 'How It Works' },
    { href: '/#demo', label: 'Live Demo' },
    { href: '/calendar', label: 'Calendar' },
    { href: '/dashboard', label: 'App Cockpit' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#070512]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-amber-400 p-[1px] shadow-lg shadow-fuchsia-500/25 group-hover:scale-105 transition-transform duration-200">
                  <div className="w-full h-full bg-[#0E0927] rounded-[15px] flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-amber-300 group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xl tracking-tight text-gradient-brand">
                      MarkAI
                    </span>
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/30">
                      Phase 2
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium hidden sm:block">
                    AI Marketing Automation for Small Business
                  </span>
                </div>
              </Link>

              {/* Pitch Demo Badge */}
              <div className="hidden xl:flex items-center gap-2 ml-4 px-3 py-1 rounded-full bg-space-900/90 border border-white/10 text-[11px] text-slate-300 shadow-inner">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                <span className="font-medium text-amber-300">Pitch Demo · Sept 9, 2026</span>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 p-1 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
              {(user ? appNavItems : landingNavItems).map((item) => {
                const isActive = router.pathname === item.href;
                const Icon = (item as any).icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md shadow-fuchsia-600/25'
                        : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                    }`}
                  >
                    {Icon && <Icon className="w-3.5 h-3.5" />}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Area */}
            <div className="flex items-center gap-3">
              {/* System Health Button */}
              <button
                onClick={() => setShowStatusModal(true)}
                title="System Status"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/10 transition"
              >
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Services</span>
              </button>

              {user ? (
                <div className="flex items-center gap-3">
                  <div className="hidden lg:flex flex-col text-right">
                    <span className="text-xs font-bold text-slate-200 truncate max-w-[130px]">
                      {user.displayName || user.email}
                    </span>
                    <span className="text-[10px] text-fuchsia-400 font-medium">
                      {user.isDemoUser ? 'Pitch Demo Account' : 'Connected'}
                    </span>
                  </div>

                  <button
                    onClick={() => logout().then(() => router.push('/'))}
                    title="Sign Out"
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/5 hover:border-rose-500/20 transition"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="btn-secondary px-3.5 py-1.5 rounded-xl text-xs font-semibold hidden sm:inline-flex"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="btn-primary px-4 py-1.5 rounded-xl text-xs font-bold shadow-md"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-300 lg:hidden bg-white/5 border border-white/10"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-[#0E0927]/95 backdrop-blur-2xl p-4 space-y-2 animate-fadeIn">
            {(user ? appNavItems : landingNavItems).map((item) => {
              const Icon = (item as any).icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:bg-white/10 transition"
                >
                  {Icon && <Icon className="w-4 h-4 text-fuchsia-400" />}
                  <span>{item.label}</span>
                </Link>
              );
            })}
            {!user && (
              <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
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
