import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, ArrowRight, Lock, Mail, AlertCircle, Zap, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithEmail, loginAsDemoUser, isFirebaseConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await loginWithEmail(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Failed to sign in. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    loginAsDemoUser();
    router.push('/dashboard');
  };

  return (
    <Layout title="Sign In — MarkAI">
      <div className="max-w-md mx-auto py-8">
        
        {/* Pitch competition fast-access banner */}
        <div className="mb-6 p-5 rounded-3xl bg-gradient-to-r from-violet-950/60 via-fuchsia-950/50 to-amber-950/40 border border-fuchsia-500/30 text-center shadow-xl backdrop-blur-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-2">
            <Zap className="w-3.5 h-3.5" /> Pitch Competition Demo Mode
          </div>
          <p className="text-xs text-slate-300">
            For judges and fast evaluation, use one-click demo login to access the full cockpit instantly.
          </p>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="btn-primary mt-3 w-full py-3 px-4 rounded-xl text-xs font-bold shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Instant Pitch Demo Login</span>
          </button>
        </div>

        {/* Auth Glass Card */}
        <div className="card-glass rounded-3xl p-7 sm:p-8 shadow-2xl border border-white/10">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Welcome Back</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Sign in with your business account to manage & auto-post content
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-space-950/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-fuchsia focus:ring-1 focus:ring-brand-fuchsia transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-space-950/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-fuchsia focus:ring-1 focus:ring-brand-fuchsia transition"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <p className="text-xs text-slate-400">
              Don't have an account?{' '}
              <Link href="/signup" className="text-fuchsia-400 hover:text-fuchsia-300 font-bold transition">
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* Security / Stack Note */}
        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
          <span>
            {isFirebaseConfigured
              ? 'Secured with Firebase Authentication'
              : 'Running on Demo Sandbox Authentication'}
          </span>
        </div>
      </div>
    </Layout>
  );
}
