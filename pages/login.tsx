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
        <div className="mb-6 p-5 rounded-sm border border-grey/30 bg-white text-center">
          <div className="text-xs font-mono text-ink mb-1.5">
            [Evaluation Demo Mode]
          </div>
          <p className="text-xs text-grey">
            Use one-click demo login to access the full business cockpit instantly.
          </p>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="btn-primary mt-3 w-full py-2.5 px-4 rounded-sm text-xs font-medium"
          >
            Instant Pitch Demo Login
          </button>
        </div>

        {/* Auth Card */}
        <div className="card rounded-sm p-6 sm:p-8 border border-grey/30 bg-white">
          <div className="text-left mb-6 pb-4 border-b border-grey/30">
            <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">Sign In</h1>
            <p className="text-xs text-grey mt-1">
              Access your business profile and publishing queue
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-sm bg-white border border-ink flex items-start gap-2.5 text-xs text-ink">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-ink mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@business.com"
                className="w-full bg-white border border-grey/30 rounded-sm px-3.5 py-2 text-sm text-ink placeholder-grey focus:outline-none focus:border-ink transition min-h-[40px]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-ink mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-grey/30 rounded-sm px-3.5 py-2 text-sm text-ink placeholder-grey focus:outline-none focus:border-ink transition min-h-[40px]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 px-4 rounded-sm text-xs font-medium mt-2"
            >
              {loading ? (
                <span>Verifying...</span>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-grey/30 text-left">
            <p className="text-xs text-grey">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-ink font-medium hover:underline transition">
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-4 text-center text-xs font-mono text-grey">
          {isFirebaseConfigured
            ? '[Firebase Authentication]'
            : '[Session: Pitch Demo Authentication]'}
        </div>
      </div>
    </Layout>
  );
}
