import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { usePost } from '@/context/PostContext';
import { ConnectedPlatformAccount, SocialPlatform } from '@/lib/types';
import { getConnectedPlatforms, togglePlatformConnection } from '@/lib/supabase';
import { 
  Share2, 
  Instagram, 
  Facebook, 
  Linkedin, 
  Twitter, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Send, 
  Sparkles, 
  Check, 
  Sliders, 
  ShieldCheck 
} from 'lucide-react';

export default function PlatformsPage() {
  const { currentProfile } = usePost();
  const [platforms, setPlatforms] = useState<ConnectedPlatformAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [broadcastText, setBroadcastText] = useState('Exciting updates from our workshop! Swipe through our latest release and grab exclusive perks this week. ✨');
  const [selectedChannels, setSelectedChannels] = useState<SocialPlatform[]>(['instagram', 'facebook', 'twitter']);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  const loadPlatforms = async () => {
    setLoading(true);
    try {
      const data = await getConnectedPlatforms();
      setPlatforms(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlatforms();
  }, []);

  const handleToggle = async (platform: SocialPlatform, currentStatus: boolean) => {
    const updated = await togglePlatformConnection(platform, !currentStatus);
    setPlatforms(updated);
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastText.trim() || selectedChannels.length === 0) return;
    setIsBroadcasting(true);
    try {
      const res = await fetch('/api/post-multi-platform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caption: broadcastText,
          platforms: selectedChannels,
          businessName: currentProfile.business_name
        })
      });
      if (res.ok) {
        setBroadcastSuccess(true);
        setTimeout(() => setBroadcastSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsBroadcasting(false);
    }
  };
  const getPlatformIcon = (platform: SocialPlatform) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="w-4 h-4 text-ink" />;
      case 'facebook':
        return <Facebook className="w-4 h-4 text-ink" />;
      case 'linkedin':
        return <Linkedin className="w-4 h-4 text-ink" />;
      case 'twitter':
        return <Twitter className="w-4 h-4 text-ink" />;
    }
  };

  return (
    <Layout title="Multi-Platform Social Hub — MarkAI">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-surface rounded-xl p-6 sm:p-8 border border-line flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs text-muted mb-2">
              <Share2 className="w-3.5 h-3.5 text-ink" />
              <span>[Omnichannel Social Hub]</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-sans font-bold text-ink tracking-tight flex items-center gap-3">
              Multi-Platform Social Hub
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-1 max-w-2xl leading-relaxed">
              Connect brand accounts via OAuth. MarkAI adapts character limits and broadcasts on-brand copy to Instagram, Facebook, LinkedIn, and Twitter in one click.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadPlatforms}
              className="p-2.5 rounded-xl bg-surface border border-line text-muted hover:text-ink hover:border-line transition"
              title="Refresh connection status"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-ink' : ''}`} />
            </button>
          </div>
        </div>

        {/* Connected Accounts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {platforms.map((p) => (
            <div
              key={p.platform}
              className={`rounded-xl p-5 border transition flex flex-col justify-between ${
                p.connected
                  ? 'bg-surface border-line'
                  : 'bg-surface border-dashed border-line opacity-70'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-xl border border-line">
                    {getPlatformIcon(p.platform)}
                  </div>
                  {p.connected ? (
                    <span className="font-mono text-[10px] text-success bg-success-light border border-success-border px-2 py-0.5 rounded-xl font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-success" />
                      [Connected]
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] text-muted border border-line px-2 py-0.5 rounded-xl">
                      [Disconnected]
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-sans font-bold text-ink capitalize">{p.platform} Account</h3>
                <p className="text-xs text-muted mt-0.5 truncate font-mono">{p.account_handle}</p>

                <div className="mt-3 text-[10px] text-muted space-y-0.5 font-mono">
                  <div>Synced: {p.last_synced}</div>
                  <div>Permissions: {p.permissions.length} active</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-line">
                <button
                  type="button"
                  onClick={() => handleToggle(p.platform, p.connected)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-medium transition ${
                    p.connected
                      ? 'border border-line text-muted hover:text-danger hover:border-danger'
                      : 'btn-primary'
                  }`}
                >
                  {p.connected ? 'Disconnect' : 'Connect Account'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 1-Click Multi-Channel Broadcast Studio */}
        <div className="bg-surface rounded-xl p-6 sm:p-8 border border-line space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-line">
            <span className="text-xs font-mono text-ink flex items-center gap-2">
              <Send className="w-3.5 h-3.5 text-process" />
              <span>Simultaneous Multi-Channel Broadcast</span>
            </span>
            <span className="font-mono text-[10px] text-process bg-process-light border border-process-border px-2 py-0.5 rounded-xl font-medium">
              [Format Auto-Adapted]
            </span>
          </div>

          <form onSubmit={handleBroadcast} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-muted mb-2 uppercase">
                Select Publishing Channels:
              </label>
              <div className="flex flex-wrap gap-2">
                {(['instagram', 'facebook', 'linkedin', 'twitter'] as SocialPlatform[]).map((plat) => {
                  const isSelected = selectedChannels.includes(plat);
                  return (
                    <button
                      key={plat}
                      type="button"
                      onClick={() => {
                        setSelectedChannels(prev => 
                          isSelected ? prev.filter(p => p !== plat) : [...prev, plat]
                        );
                      }}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition border ${
                        isSelected
                          ? 'bg-process text-white border-process shadow-sm'
                          : 'bg-surface border-line text-muted hover:text-ink hover:border-line'
                      }`}
                    >
                      {getPlatformIcon(plat)}
                      <span className="capitalize">{plat}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-muted mb-1.5 uppercase">
                Broadcast Caption & Story Hook:
              </label>
              <textarea
                rows={4}
                value={broadcastText}
                onChange={(e) => setBroadcastText(e.target.value)}
                className="w-full bg-surface border border-line rounded-xl p-3 text-sm text-ink leading-relaxed placeholder:text-muted focus:outline-none focus:border-line transition font-sans resize-none"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs font-mono text-muted">
                Broadcasting to <strong className="text-ink">[{selectedChannels.length} platforms]</strong>
              </span>
              <button
                type="submit"
                disabled={isBroadcasting || selectedChannels.length === 0}
                className="btn-primary px-5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2 self-start sm:self-auto"
              >
                {isBroadcasting ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : broadcastSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Broadcast Sent</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>1-Click Broadcast</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
