import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, AlertTriangle, RefreshCw, Server, Key, Database, Share2, Sparkles } from 'lucide-react';

interface ServiceStatus {
  configured: boolean;
  description: string;
}

interface HealthResponse {
  status: string;
  timestamp: string;
  services: {
    anthropic_claude: ServiceStatus;
    firebase_auth: ServiceStatus;
    supabase_postgres: ServiceStatus;
    meta_graph_api: ServiceStatus;
  };
}

interface SystemStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SystemStatusModal({ isOpen, onClose }: SystemStatusModalProps) {
  const [data, setData] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/health');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHealth();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const services = [
    {
      key: 'anthropic_claude',
      name: 'Anthropic Claude API',
      icon: Sparkles,
      envVar: 'ANTHROPIC_API_KEY',
      fallbackText: 'Smart Local Generator Fallback Active (Zero Interruption)',
    },
    {
      key: 'firebase_auth',
      name: 'Firebase Auth',
      icon: Key,
      envVar: 'NEXT_PUBLIC_FIREBASE_API_KEY',
      fallbackText: 'Demo Session Active (Pitch-ready Instant Auth)',
    },
    {
      key: 'supabase_postgres',
      name: 'Supabase Postgres',
      icon: Database,
      envVar: 'NEXT_PUBLIC_SUPABASE_URL',
      fallbackText: 'Client LocalStorage Persistence Active',
    },
    {
      key: 'meta_graph_api',
      name: 'Meta Graph API (Instagram)',
      icon: Share2,
      envVar: 'META_ACCESS_TOKEN & INSTAGRAM_ACCOUNT_ID',
      fallbackText: 'Instagram Sandbox Simulator Active (Valid Container Simulation)',
    },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="card-glass rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-white/10 relative">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-brand-violet/15 text-brand-violet border border-brand-violet/30 shadow-inner">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base sm:text-lg">System & Integration Health</h3>
              <p className="text-xs text-slate-400">MarkAI Production & Pitch Sandbox Status</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {services.map((s) => {
            const status = data?.services?.[s.key];
            const isConfigured = status?.configured ?? false;
            const Icon = s.icon;

            return (
              <div
                key={s.key}
                className={`p-3.5 rounded-2xl border transition ${
                  isConfigured
                    ? 'bg-emerald-950/25 border-emerald-500/30'
                    : 'bg-space-950/60 border-white/[0.07]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-xl ${
                        isConfigured
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-200">{s.name}</h4>
                      <p className="text-xs text-slate-400">{status?.description || s.envVar}</p>
                    </div>
                  </div>
                  {isConfigured ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" /> Live
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                      <AlertTriangle className="w-3 h-3" /> Sandbox
                    </span>
                  )}
                </div>
                {!isConfigured && (
                  <p className="mt-2 text-[11px] text-amber-300/80 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20">
                    ℹ️ {s.fallbackText}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={fetchHealth}
            disabled={loading}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh status
          </button>
          <button
            onClick={onClose}
            className="btn-primary px-5 py-2 text-xs font-bold rounded-xl"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
