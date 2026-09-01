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
        return <Instagram className="w-5 h-5 text-pink-400" />;
      case 'facebook':
        return <Facebook className="w-5 h-5 text-blue-400" />;
      case 'linkedin':
        return <Linkedin className="w-5 h-5 text-cyan-400" />;
      case 'twitter':
        return <Twitter className="w-5 h-5 text-sky-400" />;
    }
  };

  return (
    <Layout title="Multi-Platform Social Hub — MarkAI">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="card-glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                Phase 3 · Omnichannel Social Hub
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight flex items-center gap-3">
              <Share2 className="w-7 h-7 text-cyan-400" />
              <span>Multi-Platform Social Hub</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Connect your brand accounts once via OAuth. MarkAI adapts character constraints and broadcasts on-brand copy to Instagram, Facebook, LinkedIn, and Twitter in one click.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadPlatforms}
              className="p-3 rounded-2xl bg-white/[0.05] border border-white/10 text-slate-400 hover:text-white transition"
              title="Refresh connection status"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Connected Accounts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {platforms.map((p) => (
            <div
              key={p.platform}
              className={`card-glass rounded-3xl p-5 border transition flex flex-col justify-between ${
                p.connected
                  ? 'border-white/15 bg-space-950/80 shadow-xl'
                  : 'border-white/[0.05] opacity-60 bg-space-950/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-2xl bg-white/[0.05] border border-white/10">
                    {getPlatformIcon(p.platform)}
                  </div>
                  {p.connected ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" /> Connected
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                      Disconnected
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-white capitalize">{p.platform} Account</h3>
                <p className="text-xs text-slate-400 mt-0.5 truncate">{p.account_handle}</p>
                <div className="mt-3 text-[10px] text-slate-500 space-y-0.5 font-mono">
                  <div>Synced: {p.last_synced}</div>
                  <div>Permissions: {p.permissions.length} active</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => handleToggle(p.platform, p.connected)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition ${
                    p.connected
                      ? 'bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border border-rose-500/30'
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
        <div className="card-glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Send className="w-4 h-4 text-fuchsia-400" />
              <span>Simultaneous Multi-Channel Broadcast</span>
            </span>
            <span className="text-[11px] text-fuchsia-300 font-bold px-2 py-0.5 rounded-full bg-fuchsia-500/15 border border-fuchsia-500/30">
              Format Auto-Adapted
            </span>
          </div>

          <form onSubmit={handleBroadcast} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
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
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition border ${
                        isSelected
                          ? 'bg-fuchsia-500/20 border-fuchsia-400 text-white shadow-md'
                          : 'bg-white/[0.03] border-white/10 text-slate-400'
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
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Broadcast Caption & Story Hook:
              </label>
              <textarea
                rows={4}
                value={broadcastText}
                onChange={(e) => setBroadcastText(e.target.value)}
                className="w-full bg-space-950/80 border border-white/10 rounded-2xl p-4 text-sm text-slate-200 leading-relaxed focus:outline-none focus:border-brand-fuchsia resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Broadcasting to <strong className="text-white">{selectedChannels.length} platforms</strong>
              </span>
              <button
                type="submit"
                disabled={isBroadcasting || selectedChannels.length === 0}
                className="btn-primary px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-lg flex items-center gap-2"
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
