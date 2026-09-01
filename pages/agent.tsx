import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { usePost } from '@/context/PostContext';
import { StrategyRecommendation, AutopilotCampaign, SocialPlatform } from '@/lib/types';
import { DEFAULT_STRATEGY_RECOMMENDATIONS, DEFAULT_AUTOPILOT_CAMPAIGN } from '@/lib/mockData';
import { getStrategyRecommendations, getAutopilotCampaign } from '@/lib/supabase';
import confetti from 'canvas-confetti';
import { 
  Bot, 
  Sparkles, 
  Zap, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  Flame, 
  Play, 
  RefreshCw,
  FileText,
  Activity
} from 'lucide-react';

export default function AgentPage() {
  const { currentProfile } = usePost();
  const [recommendations, setRecommendations] = useState<StrategyRecommendation[]>(DEFAULT_STRATEGY_RECOMMENDATIONS);
  const [campaign, setCampaign] = useState<AutopilotCampaign>(DEFAULT_AUTOPILOT_CAMPAIGN);
  const [selectedChannels, setSelectedChannels] = useState<SocialPlatform[]>(['instagram', 'facebook', 'twitter']);
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchSuccess, setLaunchSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      const recs = await getStrategyRecommendations();
      const camp = await getAutopilotCampaign();
      setRecommendations(recs);
      setCampaign(camp);
    }
    load();
  }, []);

  const handleLaunchAutopilot = async () => {
    setIsLaunching(true);
    try {
      const res = await fetch('/api/strategy-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'launch_autopilot',
          month: 'September 2026',
          platforms: selectedChannels
        })
      });
      const json = await res.json();
      if (json.data) {
        setCampaign(json.data);
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
        setLaunchSuccess(true);
        setTimeout(() => setLaunchSuccess(false), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLaunching(false);
    }
  };

  return (
    <Layout title="Autonomous CMO Marketing Agent — MarkAI">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="card-glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/30">
                Phase 6 · Virtual CMO Agent
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight flex items-center gap-3">
              <Bot className="w-7 h-7 text-fuchsia-400" />
              <span>Autonomous Marketing Agent</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              MarkAI audits post performance across channels and operates an autonomous closed-loop campaign engine that plans, optimizes, and schedules your entire month of marketing.
            </p>
          </div>
        </div>

        {/* 1-Click Autopilot Hero Banner */}
        <div className="card-glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-fuchsia-500/30 bg-gradient-to-r from-space-950 via-space-900 to-fuchsia-950/30 relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 text-xs font-bold border border-amber-500/30">
                <Zap className="w-3.5 h-3.5" />
                <span>One-Click Full-Month Autopilot</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Put Your Marketing on Total Autopilot
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                MarkAI will craft 16 seasonal campaigns, adapt copy per channel, and schedule them across optimal engagement windows for {currentProfile.business_name}.
              </p>
            </div>

            <div className="flex flex-col items-start lg:items-end gap-3 flex-shrink-0">
              <button
                onClick={handleLaunchAutopilot}
                disabled={isLaunching}
                className="btn-primary py-4 px-8 rounded-2xl text-sm font-extrabold shadow-xl flex items-center gap-2"
              >
                {isLaunching ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Autonomous Agent Orchestrating Campaigns...</span>
                  </>
                ) : launchSuccess ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-white" />
                    <span>Autopilot Active for September!</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Launch 30-Day Autopilot Campaign</span>
                  </>
                )}
              </button>
              <span className="text-[11px] text-slate-400">
                Active Status: <strong className="text-emerald-400 uppercase font-mono">{campaign.status}</strong> (16/16 scheduled)
              </span>
            </div>
          </div>
        </div>

        {/* Closed-Loop AI Recommendations & Weekly Digest */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Strategic Recommendations */}
          <div className="lg:col-span-7 space-y-4">
            <div className="card-glass rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/10 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <span>Closed-Loop Strategy Optimization</span>
                </h3>
                <span className="text-[10px] font-bold text-fuchsia-300">
                  Data-Driven Insights
                </span>
              </div>

              <div className="space-y-4">
                {recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-4 rounded-2xl bg-space-950/80 border border-white/10 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-fuchsia-500/15 text-fuchsia-300 text-[10px] uppercase font-bold">
                          {rec.category}
                        </span>
                        {rec.title}
                      </span>
                      <span className="text-[11px] font-bold text-amber-300 font-mono">
                        {rec.impact_score}/100 Impact
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {rec.insight}
                    </p>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-medium">Action: <strong className="text-slate-200">{rec.action_item}</strong></span>
                      <span className="text-emerald-400 font-bold">{rec.expected_impact}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Weekly Executive Digest */}
          <div className="lg:col-span-5 space-y-6">
            <div className="card-glass rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-300" />
                  <span>Weekly Executive Digest</span>
                </h3>
                <span className="text-[10px] font-mono text-slate-400">Week 36, 2026</span>
              </div>

              <div className="p-4 rounded-2xl bg-space-950/80 border border-white/10 space-y-3 text-xs leading-relaxed text-slate-300">
                <p className="font-semibold text-white">
                  Executive Summary for {currentProfile.business_name}:
                </p>
                <p>
                  {campaign.weekly_digest_summary || 'MarkAI has generated and scheduled 16 monthly campaigns. Carousel educational formats are delivering 3.4x higher save rates.'}
                </p>
                <div className="pt-2 border-t border-white/10 text-[11px] space-y-1">
                  <div>🎯 Top Channel: <strong className="text-pink-400">Instagram (7.8% Eng.)</strong></div>
                  <div>⚡ Optimal Time: <strong className="text-emerald-400">Tuesdays at 8:15 AM</strong></div>
                  <div>📈 Follower Momentum: <strong className="text-fuchsia-400">+18.5% Net Growth</strong></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
