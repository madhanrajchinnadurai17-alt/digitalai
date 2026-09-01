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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg">System & Integration Health</h3>
              <p className="text-xs text-slate-400">MarkAI Production & Pitch Sandbox Status</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {services.map((s) => {
            const status = data?.services?.[s.key];
            const isConfigured = status?.configured ?? false;
            const Icon = s.icon;

            return (
              <div
                key={s.key}
                className={`p-3.5 rounded-xl border transition ${
                  isConfigured
                    ? 'bg-emerald-950/20 border-emerald-500/30'
                    : 'bg-slate-800/40 border-slate-700/60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        isConfigured
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-200">{s.name}</h4>
                      <p className="text-xs text-slate-400">{status?.description || s.envVar}</p>
                    </div>
                  </div>
                  {isConfigured ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Live
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                      <AlertTriangle className="w-3.5 h-3.5" /> Sandbox
                    </span>
                  )}
                </div>
                {!isConfigured && (
                  <p className="mt-2 text-[11px] text-amber-300/80 bg-amber-500/5 px-2 py-1 rounded border border-amber-500/10">
                    ℹ️ {s.fallbackText}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
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
            className="px-4 py-2 text-sm font-medium bg-brand-600 hover:bg-brand-500 text-white rounded-xl transition shadow-lg shadow-brand-600/20"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
