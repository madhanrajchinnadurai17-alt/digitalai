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
          <div className="w-6 h-6 border-2 border-ink border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-grey font-mono">Loading performance intelligence...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Performance & Engagement Analytics — MarkAI">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-white rounded-sm p-6 sm:p-8 border border-grey/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs text-grey mb-2">
              <TrendingUp className="w-3.5 h-3.5 text-ink" />
              <span>[Performance Intelligence]</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ink tracking-tight flex items-center gap-3">
              Performance Analytics & Queue
            </h1>
            <p className="text-xs sm:text-sm text-grey mt-1 max-w-2xl leading-relaxed">
              Track reach, engagement rates, and scheduled posts across connected social channels in real time.
            </p>
          </div>
        </div>

        {/* Top 4 KPI Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-sm p-5 border border-grey/30">
            <span className="text-xs font-mono text-grey uppercase block mb-1">Total Reach</span>
            <span className="text-2xl sm:text-3xl font-serif font-bold text-ink">
              {metrics.total_reach.toLocaleString()}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-mono text-ink mt-2">
              <TrendingUp className="w-3 h-3 text-ink" />
              <span>[+{metrics.follower_growth}% MoM]</span>
            </div>
          </div>

          <div className="bg-white rounded-sm p-5 border border-grey/30">
            <span className="text-xs font-mono text-grey uppercase block mb-1">Impressions</span>
            <span className="text-2xl sm:text-3xl font-serif font-bold text-ink">
              {metrics.total_impressions.toLocaleString()}
            </span>
            <p className="text-[11px] font-mono text-grey mt-2">[47 Posts Total]</p>
          </div>

          <div className="bg-white rounded-sm p-5 border border-grey/30">
            <span className="text-xs font-mono text-grey uppercase block mb-1">Avg. Engagement</span>
            <span className="text-2xl sm:text-3xl font-serif font-bold text-ink">
              {metrics.avg_engagement_rate}%
            </span>
            <p className="text-[11px] font-mono text-grey mt-2">[2.4x benchmark]</p>
          </div>

          <div className="bg-white rounded-sm p-5 border border-grey/30">
            <span className="text-xs font-mono text-grey uppercase block mb-1">Total Interactions</span>
            <span className="text-2xl sm:text-3xl font-serif font-bold text-ink">
              {(metrics.total_likes + metrics.total_comments + metrics.total_shares).toLocaleString()}
            </span>
            <p className="text-[11px] font-mono text-grey mt-2">[Likes, Comments, Saves]</p>
          </div>
        </div>

        {/* Channel Breakdown & Scheduled Queue */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Platform Breakdown */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white rounded-sm p-6 sm:p-7 border border-grey/30 space-y-4">
              <h3 className="text-base font-serif font-bold text-ink flex items-center gap-2">
                <Share2 className="w-4 h-4 text-ink" />
                <span>Channel Engagement Breakdown</span>
              </h3>

              <div className="space-y-3">
                {Object.entries(metrics.platform_breakdown).map(([plat, data]) => (
                  <div
                    key={plat}
                    className="p-3.5 rounded-sm bg-white border border-grey/30 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-sm border border-grey/30 text-ink">
                        {plat === 'instagram' ? <Instagram className="w-4 h-4" /> :
                         plat === 'facebook' ? <Facebook className="w-4 h-4" /> :
                         plat === 'linkedin' ? <Linkedin className="w-4 h-4" /> :
                         <Twitter className="w-4 h-4" />}
                      </div>
                      <div>
                        <h4 className="text-xs font-medium text-ink capitalize">{plat}</h4>
                        <p className="text-[11px] font-mono text-grey">{data.posts} posts published</p>
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <span className="text-xs font-medium text-ink">{data.reach.toLocaleString()} Reach</span>
                      <span className="block text-[11px] text-grey">[{data.engagement}% Eng]</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Performing Posts */}
            <div className="bg-white rounded-sm p-6 sm:p-7 border border-grey/30 space-y-4">
              <h3 className="text-base font-serif font-bold text-ink flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-ink" />
                <span>Top Performing Posts</span>
              </h3>

              <div className="space-y-2.5">
                {metrics.top_performing_posts.map((post, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-sm bg-white border border-grey/30 flex items-center justify-between gap-3"
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs font-serif font-medium text-ink line-clamp-1">{post.title}</span>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-grey">
                        <span className="capitalize">{post.format.replace('_', ' ')}</span>
                        <span>/</span>
                        <span className="capitalize">{post.platform}</span>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-ink border border-grey/30 px-2 py-0.5 rounded-sm flex-shrink-0">
                      [{post.engagement}% Eng]
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Scheduled Publishing Queue */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-sm p-6 sm:p-7 border border-grey/30 space-y-5 h-full">
              <div className="flex items-center justify-between pb-3 border-b border-grey/30">
                <h3 className="text-base font-serif font-bold text-ink flex items-center gap-2">
                  <Clock className="w-4 h-4 text-ink" />
                  <span>Scheduled Publishing Queue</span>
                </h3>
                <span className="font-mono text-[10px] text-ink border border-ink px-2 py-0.5 rounded-sm">
                  [Cron Worker Active]
                </span>
              </div>

              {scheduledPosts.length === 0 ? (
                <div className="py-12 text-center text-xs font-mono text-grey">
                  No upcoming scheduled posts in queue.
                </div>
              ) : (
                <div className="space-y-3">
                  {scheduledPosts.map((post) => (
                    <div
                      key={post.id}
                      className="p-4 rounded-sm bg-white border border-grey/30 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          {post.platforms.map((p) => (
                            <span key={p} className="text-[10px] font-mono px-2 py-0.5 rounded-sm border border-grey/30 text-ink capitalize">
                              {p}
                            </span>
                          ))}
                        </div>
                        <span className="text-[11px] font-mono text-grey flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(post.scheduled_timestamp).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>

                      <p className="text-xs text-grey line-clamp-2 leading-relaxed font-serif">
                        {post.caption}
                      </p>

                      <div className="pt-2 border-t border-grey/20 flex items-center justify-between text-[10px] font-mono text-grey">
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
