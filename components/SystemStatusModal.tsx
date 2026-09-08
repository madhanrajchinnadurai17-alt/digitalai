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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-sm max-w-lg w-full p-6 border border-ink relative">
        <div className="flex items-center justify-between pb-4 border-b border-grey/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-sm border border-grey/30 text-ink">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-ink text-base sm:text-lg">System &amp; Integration Health</h3>
              <p className="text-xs text-grey">MarkAI Verification Matrix</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-sm text-grey hover:text-ink border border-grey/30 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-5 space-y-2.5">
          {services.map((s) => {
            const status = data?.services?.[s.key];
            const isConfigured = status?.configured ?? false;
            const Icon = s.icon;

            return (
              <div
                key={s.key}
                className="p-3 rounded-sm border border-grey/30 bg-white"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-sm border border-grey/20 text-ink">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-ink">{s.name}</h4>
                      <p className="text-xs text-grey">{status?.description || s.envVar}</p>
                    </div>
                  </div>
                  {isConfigured ? (
                    <span className="text-xs font-mono text-ink">
                      [Live]
                    </span>
                  ) : (
                    <span className="text-xs font-mono text-grey">
                      [Sandbox]
                    </span>
                  )}
                </div>
                {!isConfigured && (
                  <p className="mt-2 text-[11px] font-mono text-grey border-t border-grey/20 pt-1.5">
                    Fallback: {s.fallbackText}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-grey/30 flex items-center justify-between">
          <button
            onClick={fetchHealth}
            disabled={loading}
            className="inline-flex items-center gap-1.5 text-xs text-grey hover:text-ink transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh status
          </button>
          <button
            onClick={onClose}
            className="btn-primary px-5 py-2 text-xs rounded-sm"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
