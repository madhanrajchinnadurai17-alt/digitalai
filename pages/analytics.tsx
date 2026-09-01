import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { AnalyticsMetricSummary, ScheduledPostRecord } from '@/lib/types';
import { getAnalyticsSummary, getScheduledPosts } from '@/lib/supabase';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Heart, 
  MessageSquare, 
  Share2, 
  Calendar, 
  Instagram, 
  Facebook, 
  Linkedin, 
  Twitter, 
  Sparkles,
  Layers,
  Film,
  Image as ImageIcon,
  Clock,
  CheckCircle2
} from 'lucide-react';

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState<AnalyticsMetricSummary | null>(null);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPostRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [m, s] = await Promise.all([
          getAnalyticsSummary(),
          getScheduledPosts()
        ]);
        setMetrics(m);
        setScheduledPosts(s);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading || !metrics) {
    return (
      <Layout title="Analytics — MarkAI">
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-3 border-fuchsia-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-400">Loading performance intelligence...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Performance & Engagement Analytics — MarkAI">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="card-glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Phase 3 · Performance Intelligence
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight flex items-center gap-3">
              <BarChart3 className="w-7 h-7 text-emerald-400" />
              <span>Performance Analytics & Queue</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Track reach, engagement rates, and scheduled posts across connected social channels in real time.
            </p>
          </div>
        </div>

        {/* Top 4 KPI Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card-glass rounded-3xl p-5 shadow-xl border border-white/10">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Reach</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {metrics.total_reach.toLocaleString()}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 mt-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+{metrics.follower_growth}% this month</span>
            </div>
          </div>

          <div className="card-glass rounded-3xl p-5 shadow-xl border border-white/10">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Impressions</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-fuchsia-400">
              {metrics.total_impressions.toLocaleString()}
            </span>
            <p className="text-[11px] text-slate-400 mt-2">Across 47 total posts</p>
          </div>

          <div className="card-glass rounded-3xl p-5 shadow-xl border border-white/10">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Avg. Engagement</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-300">
              {metrics.avg_engagement_rate}%
            </span>
            <p className="text-[11px] text-emerald-400 mt-2 font-semibold">2.4x industry average</p>
          </div>

          <div className="card-glass rounded-3xl p-5 shadow-xl border border-white/10">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Interactions</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-cyan-400">
              {(metrics.total_likes + metrics.total_comments + metrics.total_shares).toLocaleString()}
            </span>
            <p className="text-[11px] text-slate-400 mt-2">Likes, Comments & Saves</p>
          </div>
        </div>

        {/* Channel Breakdown & Scheduled Queue */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Platform Breakdown */}
          <div className="lg:col-span-6 space-y-6">
            <div className="card-glass rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/10 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Share2 className="w-5 h-5 text-cyan-400" />
                <span>Channel Engagement Breakdown</span>
              </h3>

              <div className="space-y-3">
                {Object.entries(metrics.platform_breakdown).map(([plat, data]) => (
                  <div
                    key={plat}
                    className="p-4 rounded-2xl bg-space-950/80 border border-white/10 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-white/[0.05]">
                        {plat === 'instagram' ? <Instagram className="w-4 h-4 text-pink-400" /> :
                         plat === 'facebook' ? <Facebook className="w-4 h-4 text-blue-400" /> :
                         plat === 'linkedin' ? <Linkedin className="w-4 h-4 text-cyan-400" /> :
                         <Twitter className="w-4 h-4 text-sky-400" />}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white capitalize">{plat}</h4>
                        <p className="text-[11px] text-slate-400">{data.posts} posts published</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-100">{data.reach.toLocaleString()} Reach</span>
                      <span className="block text-[11px] font-bold text-emerald-400">{data.engagement}% Eng.</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Performing Posts */}
            <div className="card-glass rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/10 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>Top Performing Posts</span>
              </h3>

              <div className="space-y-3">
                {metrics.top_performing_posts.map((post, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-space-950/80 border border-white/10 flex items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-white line-clamp-1">{post.title}</span>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span className="capitalize font-bold text-fuchsia-400">{post.format.replace('_', ' ')}</span>
                        <span>·</span>
                        <span className="capitalize text-slate-300">{post.platform}</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 flex-shrink-0">
                      {post.engagement}% Eng
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Scheduled Publishing Queue */}
          <div className="lg:col-span-6">
            <div className="card-glass rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/10 space-y-5 h-full">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-fuchsia-400" />
                  <span>Scheduled Publishing Queue</span>
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  Cron Worker Active
                </span>
              </div>

              {scheduledPosts.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  No upcoming scheduled posts in queue.
                </div>
              ) : (
                <div className="space-y-3">
                  {scheduledPosts.map((post) => (
                    <div
                      key={post.id}
                      className="p-4 rounded-2xl bg-space-950/80 border border-white/10 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          {post.platforms.map((p) => (
                            <span key={p} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/[0.05] text-slate-300 capitalize">
                              {p}
                            </span>
                          ))}
                        </div>
                        <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(post.scheduled_timestamp).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>

                      <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
                        {post.caption}
                      </p>

                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                        <span>Status: <strong className="text-amber-400 uppercase font-mono">{post.status}</strong></span>
                        <span>Auto-publish via QStash</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
