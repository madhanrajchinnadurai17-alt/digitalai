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
        <div className="mb-6 p-5 rounded-2xl bg-tumbler-light border border-tumbler-border text-center shadow-sm">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white text-tumbler text-xs font-semibold border border-tumbler-border mb-2">
            <Zap className="w-3.5 h-3.5 text-marigold" /> Theervu&apos;athon Demo Mode
          </div>
          <p className="text-xs text-ink-soft">
            For judges and pitch evaluation, use one-click demo login to access the full cockpit instantly.
          </p>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="btn-primary mt-3 w-full py-2.5 px-4 rounded-xl text-xs font-semibold"
          >
            <Sparkles className="w-4 h-4 text-marigold" />
            <span>Instant Pitch Demo Login</span>
          </button>
        </div>

        {/* Auth Card */}
        <div className="card rounded-2xl p-7 sm:p-8 shadow-card border border-border">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-display font-bold text-ink tracking-tight">Welcome Back</h1>
            <p className="text-xs sm:text-sm text-muted mt-1">
              Sign in to manage and auto-publish your business content
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-danger-light border border-danger-border flex items-start gap-2.5 text-xs text-danger">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-danger mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@business.com"
                  className="w-full bg-canvas border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-ink placeholder-muted focus:outline-none focus:border-kanchipuram focus:ring-1 focus:ring-kanchipuram transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-canvas border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-ink placeholder-muted focus:outline-none focus:border-kanchipuram focus:ring-1 focus:ring-kanchipuram transition"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold mt-2"
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

          <div className="mt-6 pt-5 border-t border-border text-center">
            <p className="text-xs text-muted">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-kanchipuram font-semibold hover:underline transition">
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted">
          <ShieldCheck className="w-3.5 h-3.5 text-muted" />
          <span>
            {isFirebaseConfigured
              ? 'Secured with Firebase Authentication'
              : 'Running on Pitch Demo Authentication'}
          </span>
        </div>
      </div>
    </Layout>
  );
}
