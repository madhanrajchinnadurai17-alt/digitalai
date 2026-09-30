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
        <div className="card rounded-xl p-6 sm:p-8 border border-line bg-surface">
          <div className="text-left mb-6 pb-4 border-b border-line">
            <h1 className="text-2xl font-sans font-bold text-ink tracking-tight">Create Account</h1>
            <p className="text-xs text-muted mt-1">
              Start generating on-brand social media copy in minutes
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-surface border border-line flex items-start gap-2.5 text-xs text-ink">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-ink mb-1.5">
                Work / Business Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@yourbusiness.com"
                className="w-full bg-surface border border-line rounded-xl px-3.5 py-2 text-sm text-ink placeholder-muted focus:outline-none focus:border-line transition min-h-[40px]"
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
                placeholder="Minimum 6 characters"
                className="w-full bg-surface border border-line rounded-xl px-3.5 py-2 text-sm text-ink placeholder-muted focus:outline-none focus:border-line transition min-h-[40px]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-ink mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className="w-full bg-surface border border-line rounded-xl px-3.5 py-2 text-sm text-ink placeholder-muted focus:outline-none focus:border-line transition min-h-[40px]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 px-4 rounded-xl text-xs font-medium mt-2"
            >
              {loading ? (
                <span>Creating Account...</span>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-line text-left">
            <p className="text-xs text-muted">
              Already have an account?{' '}
              <Link href="/login" className="text-ink font-medium hover:underline transition">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
