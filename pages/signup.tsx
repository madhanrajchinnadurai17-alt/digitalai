import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, ArrowRight, Lock, Mail, AlertCircle, ShieldCheck } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { signupWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await signupWithEmail(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Sign Up — MarkAI">
      <div className="max-w-md mx-auto py-8">
        <div className="card rounded-2xl p-7 sm:p-8 shadow-card border border-border">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-kanchipuram-light text-kanchipuram border border-kanchipuram-border mb-3">
              <Sparkles className="w-6 h-6 text-marigold" />
            </div>
            <h1 className="text-2xl font-display font-bold text-ink tracking-tight">Create your Account</h1>
            <p className="text-xs sm:text-sm text-muted mt-1">
              Automate your small business social presence in minutes
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
                Work / Business Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@yourbusiness.com"
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
                  placeholder="Minimum 6 characters"
                  className="w-full bg-canvas border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-ink placeholder-muted focus:outline-none focus:border-kanchipuram focus:ring-1 focus:ring-kanchipuram transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5 uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
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
                  <span>Create Free Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-border text-center">
            <p className="text-xs text-muted">
              Already have an account?{' '}
              <Link href="/login" className="text-kanchipuram font-semibold hover:underline transition">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
