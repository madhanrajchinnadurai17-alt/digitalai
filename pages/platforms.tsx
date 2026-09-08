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
        return <Instagram className="w-5 h-5 text-pink-600" />;
      case 'facebook':
        return <Facebook className="w-5 h-5 text-blue-600" />;
      case 'linkedin':
        return <Linkedin className="w-5 h-5 text-blue-700" />;
      case 'twitter':
        return <Twitter className="w-5 h-5 text-sky-500" />;
    }
  };

  return (
    <Layout title="Multi-Platform Social Hub — MarkAI">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-border shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-kanchipuram/5 border border-kanchipuram/15 text-xs font-semibold text-kanchipuram mb-2">
              <Share2 className="w-3.5 h-3.5 text-tumbler" />
              <span>Omnichannel Social Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink tracking-tight flex items-center gap-3">
              <Share2 className="w-7 h-7 text-kanchipuram" />
              <span>Multi-Platform Social Hub</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-1 max-w-2xl leading-relaxed">
              Connect your brand accounts once via OAuth. MarkAI adapts character constraints and broadcasts on-brand copy to Instagram, Facebook, LinkedIn, and Twitter in one click.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadPlatforms}
              className="p-3 rounded-xl bg-canvas border border-border text-muted hover:text-ink hover:border-ink/20 transition"
              title="Refresh connection status"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-kanchipuram' : ''}`} />
            </button>
          </div>
        </div>

        {/* Connected Accounts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {platforms.map((p) => (
            <div
              key={p.platform}
              className={`rounded-2xl p-5 border transition flex flex-col justify-between ${
                p.connected
                  ? 'bg-surface border-border shadow-card hover:shadow-card-hover'
                  : 'bg-canvas/50 border-dashed border-border opacity-70'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-canvas border border-border">
                    {getPlatformIcon(p.platform)}
                  </div>
                  {p.connected ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-success bg-success/10 px-2 py-0.5 rounded-full border border-success/20">
                      <CheckCircle2 className="w-3 h-3" /> Connected
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-muted bg-canvas px-2 py-0.5 rounded-full border border-border">
                      Disconnected
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-display font-bold text-ink capitalize">{p.platform} Account</h3>
                <p className="text-xs text-muted mt-0.5 truncate">{p.account_handle}</p>

                <div className="mt-3 text-[10px] text-muted/80 space-y-0.5 font-mono">
                  <div>Synced: {p.last_synced}</div>
                  <div>Permissions: {p.permissions.length} active</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => handleToggle(p.platform, p.connected)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-semibold transition ${
                    p.connected
                      ? 'bg-danger/10 text-danger hover:bg-danger/15 border border-danger/20'
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
        <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-border shadow-card space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <span className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-2">
              <Send className="w-4 h-4 text-kanchipuram" />
              <span>Simultaneous Multi-Channel Broadcast</span>
            </span>
            <span className="text-[11px] text-kanchipuram font-semibold px-2 py-0.5 rounded-full bg-kanchipuram/10 border border-kanchipuram/20">
              Format Auto-Adapted
            </span>
          </div>

          <form onSubmit={handleBroadcast} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-muted mb-2 uppercase tracking-wider">
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
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition border ${
                        isSelected
                          ? 'bg-kanchipuram text-white border-kanchipuram shadow-sm'
                          : 'bg-canvas border-border text-muted hover:text-ink'
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
              <label className="block text-xs font-bold text-muted mb-1.5 uppercase tracking-wider">
                Broadcast Caption & Story Hook:
              </label>
              <textarea
                rows={4}
                value={broadcastText}
                onChange={(e) => setBroadcastText(e.target.value)}
                className="w-full bg-canvas border border-border rounded-xl p-4 text-sm text-ink leading-relaxed placeholder:text-muted/60 focus:outline-none focus:border-kanchipuram focus:ring-1 focus:ring-kanchipuram resize-none"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs text-muted">
                Broadcasting to <strong className="text-ink font-semibold">{selectedChannels.length} platforms</strong>
              </span>
              <button
                type="submit"
                disabled={isBroadcasting || selectedChannels.length === 0}
                className="btn-primary px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold shadow-sm flex items-center gap-2 self-start sm:self-auto"
              >
                {isBroadcasting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : broadcastSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Broadcast Sent!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>1-Click Broadcast Everywhere</span>
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
