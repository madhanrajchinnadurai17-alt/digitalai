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
          <div className="w-6 h-6 border-2 border-line border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-muted font-mono">Loading performance intelligence...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Performance & Engagement Analytics — MarkAI">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-surface rounded-xl p-6 sm:p-8 border border-line flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs text-muted mb-2">
              <TrendingUp className="w-3.5 h-3.5 text-ink" />
              <span>[Performance Intelligence]</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-sans font-bold text-ink tracking-tight flex items-center gap-3">
              Performance Analytics & Queue
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-1 max-w-2xl leading-relaxed">
              Track reach, engagement rates, and scheduled posts across connected social channels in real time.
            </p>
          </div>
        </div>

        {/* Top 4 KPI Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface rounded-xl p-5 border border-line">
            <span className="text-xs font-mono text-muted uppercase block mb-1">Total Reach</span>
            <span className="text-2xl sm:text-3xl font-sans font-bold text-ink">
              {metrics.total_reach.toLocaleString()}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-mono text-success font-semibold mt-2">
              <TrendingUp className="w-3 h-3 text-success" />
              <span>[+{metrics.follower_growth}% MoM]</span>
            </div>
          </div>

          <div className="bg-surface rounded-xl p-5 border border-line">
            <span className="text-xs font-mono text-muted uppercase block mb-1">Impressions</span>
            <span className="text-2xl sm:text-3xl font-sans font-bold text-ink">
              {metrics.total_impressions.toLocaleString()}
            </span>
            <p className="text-[11px] font-mono text-muted mt-2">[47 Posts Total]</p>
          </div>

          <div className="bg-surface rounded-xl p-5 border border-line">
            <span className="text-xs font-mono text-muted uppercase block mb-1">Avg. Engagement</span>
            <span className="text-2xl sm:text-3xl font-sans font-bold text-ink">
              {metrics.avg_engagement_rate}%
            </span>
            <p className="text-[11px] font-mono text-process font-medium mt-2">[2.4x benchmark]</p>
          </div>

          <div className="bg-surface rounded-xl p-5 border border-line">
            <span className="text-xs font-mono text-muted uppercase block mb-1">Total Interactions</span>
            <span className="text-2xl sm:text-3xl font-sans font-bold text-ink">
              {(metrics.total_likes + metrics.total_comments + metrics.total_shares).toLocaleString()}
            </span>
            <p className="text-[11px] font-mono text-muted mt-2">[Likes, Comments, Saves]</p>
          </div>
        </div>

        {/* Channel Breakdown & Scheduled Queue */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Platform Breakdown */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-surface rounded-xl p-6 sm:p-7 border border-line space-y-4">
              <h3 className="text-base font-sans font-bold text-ink flex items-center gap-2">
                <Share2 className="w-4 h-4 text-ink" />
                <span>Channel Engagement Breakdown</span>
              </h3>

              <div className="space-y-3">
                {Object.entries(metrics.platform_breakdown).map(([plat, data]) => (
                  <div
                    key={plat}
                    className="p-3.5 rounded-xl bg-surface border border-line flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl border border-line text-ink">
                        {plat === 'instagram' ? <Instagram className="w-4 h-4" /> :
                         plat === 'facebook' ? <Facebook className="w-4 h-4" /> :
                         plat === 'linkedin' ? <Linkedin className="w-4 h-4" /> :
                         <Twitter className="w-4 h-4" />}
                      </div>
                      <div>
                        <h4 className="text-xs font-medium text-ink capitalize">{plat}</h4>
                        <p className="text-[11px] font-mono text-muted">{data.posts} posts published</p>
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <span className="text-xs font-medium text-ink">{data.reach.toLocaleString()} Reach</span>
                      <span className="block text-[11px] text-success font-medium">[{data.engagement}% Eng]</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Performing Posts */}
            <div className="bg-surface rounded-xl p-6 sm:p-7 border border-line space-y-4">
              <h3 className="text-base font-sans font-bold text-ink flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-ink" />
                <span>Top Performing Posts</span>
              </h3>

              <div className="space-y-2.5">
                {metrics.top_performing_posts.map((post, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-surface border border-line flex items-center justify-between gap-3"
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs font-sans font-medium text-ink line-clamp-1">{post.title}</span>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-muted">
                        <span className="capitalize">{post.format.replace('_', ' ')}</span>
                        <span>/</span>
                        <span className="capitalize">{post.platform}</span>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-success bg-success-light border border-success-border px-2 py-0.5 rounded-xl flex-shrink-0 font-medium">
                      [{post.engagement}% Eng]
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Scheduled Publishing Queue */}
          <div className="lg:col-span-6">
            <div className="bg-surface rounded-xl p-6 sm:p-7 border border-line space-y-5 h-full">
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <h3 className="text-base font-sans font-bold text-ink flex items-center gap-2">
                  <Clock className="w-4 h-4 text-ink" />
                  <span>Scheduled Publishing Queue</span>
                </h3>
                <span className="font-mono text-[10px] text-success bg-success-light border border-success-border px-2 py-0.5 rounded-xl font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  [Cron Worker Active]
                </span>
              </div>

              {scheduledPosts.length === 0 ? (
                <div className="py-12 text-center text-xs font-mono text-muted">
                  No upcoming scheduled posts in queue.
                </div>
              ) : (
                <div className="space-y-3">
                  {scheduledPosts.map((post) => (
                    <div
                      key={post.id}
                      className="p-4 rounded-xl bg-surface border border-line space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          {post.platforms.map((p) => (
                            <span key={p} className="text-[10px] font-mono px-2 py-0.5 rounded-xl border border-line text-ink capitalize">
                              {p}
                            </span>
                          ))}
                        </div>
                        <span className="text-[11px] font-mono text-muted flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(post.scheduled_timestamp).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>

                      <p className="text-xs text-muted line-clamp-2 leading-relaxed font-sans">
                        {post.caption}
                      </p>

                      <div className="pt-2 border-t border-line flex items-center justify-between text-[10px] font-mono text-muted">
                        <span>Status: <strong className="text-ink uppercase">[{post.status}]</strong></span>
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
