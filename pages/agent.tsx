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
        <div className="bg-surface rounded-xl p-6 sm:p-8 border border-line flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs text-muted mb-2">
              <Bot className="w-3.5 h-3.5 text-ink" />
              <span>[Virtual CMO Agent]</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-sans font-bold text-ink tracking-tight flex items-center gap-3">
              Autonomous Marketing Agent
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-1 max-w-2xl leading-relaxed">
              MarkAI audits post performance across channels and operates an autonomous closed-loop campaign engine that plans, optimizes, and schedules your entire month of marketing.
            </p>
          </div>
        </div>

        {/* 1-Click Autopilot Hero Banner */}
        <div className="bg-surface rounded-xl p-6 sm:p-8 border border-line relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-1.5 font-mono text-xs text-muted">
                <Zap className="w-3.5 h-3.5 text-ink" />
                <span>[One-Click Full-Month Autopilot]</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-sans font-bold text-ink">
                Autonomous Marketing System
              </h2>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                MarkAI will craft 16 seasonal campaigns, adapt copy per channel, and schedule them across optimal engagement windows for {currentProfile.business_name}.
              </p>
            </div>

            <div className="flex flex-col items-start lg:items-end gap-3 flex-shrink-0">
              <button
                onClick={handleLaunchAutopilot}
                disabled={isLaunching}
                className={`py-3 px-6 rounded-xl text-xs font-medium flex items-center gap-2 transition ${
                  launchSuccess
                    ? 'bg-success text-white border border-success'
                    : 'btn-primary'
                }`}
              >
                {isLaunching ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Agent Orchestrating Campaigns...</span>
                  </>
                ) : launchSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Autopilot Active for September</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Launch 30-Day Autopilot</span>
                  </>
                )}
              </button>
              <span className="text-[11px] font-mono text-muted flex items-center gap-1.5">
                Status:{' '}
                <strong className="text-success uppercase bg-success-light border border-success-border px-1.5 py-0.5 rounded-xl font-semibold">
                  [{campaign.status}]
                </strong>{' '}
                <span className="text-process font-medium">(16/16 scheduled)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Closed-Loop AI Recommendations & Weekly Digest */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Strategic Recommendations */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-surface rounded-xl p-6 sm:p-7 border border-line space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <h3 className="text-base font-sans font-bold text-ink flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-process" />
                  <span>Strategy Recommendations</span>
                </h3>
                <span className="font-mono text-[10px] text-process bg-process-light border border-process-border px-2 py-0.5 rounded-xl font-medium">
                  [Closed-Loop Optimization]
                </span>
              </div>

              <div className="space-y-3">
                {recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-4 rounded-xl bg-surface border border-line space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-sans font-bold text-ink flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded-xl bg-process-light text-process border border-process-border text-[10px] font-mono uppercase font-semibold">
                          {rec.category}
                        </span>
                        {rec.title}
                      </span>
                      <span className="text-[10px] font-mono text-success bg-success-light border border-success-border px-2 py-0.5 rounded-xl font-semibold">
                        [{rec.impact_score}/100 Impact]
                      </span>
                    </div>

                    <p className="text-xs text-muted leading-relaxed">
                      {rec.insight}
                    </p>

                    <div className="pt-2 border-t border-line flex items-center justify-between text-[11px] font-mono">
                      <span className="text-muted">Action: <strong className="text-ink font-normal">{rec.action_item}</strong></span>
                      <span className="text-success font-semibold">[{rec.expected_impact}]</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Weekly Executive Digest */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-surface rounded-xl p-6 sm:p-7 border border-line space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <h3 className="text-base font-sans font-bold text-ink flex items-center gap-2">
                  <FileText className="w-4 h-4 text-ink" />
                  <span>Weekly Executive Digest</span>
                </h3>
                <span className="text-[10px] font-mono text-muted">[Week 36, 2026]</span>
              </div>

              <div className="p-4 rounded-xl bg-surface border border-line space-y-3 text-xs leading-relaxed text-muted">
                <p className="font-sans font-bold text-ink text-sm">
                  Executive Summary for {currentProfile.business_name}:
                </p>
                <p className="font-sans">
                  {campaign.weekly_digest_summary || 'MarkAI has generated and scheduled 16 monthly campaigns. Carousel educational formats are delivering 3.4x higher save rates.'}
                </p>
                <div className="pt-2 border-t border-line text-[11px] font-mono space-y-1 text-muted">
                  <div>Channel: <strong className="text-ink font-normal">Instagram [7.8% Eng.]</strong></div>
                  <div>Optimal Window: <strong className="text-ink font-normal">Tuesdays at 08:15 AM</strong></div>
                  <div>Momentum: <strong className="text-ink font-normal">[+18.5% Growth]</strong></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
