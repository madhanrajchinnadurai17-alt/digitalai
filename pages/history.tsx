import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Layout } from '@/components/Layout';
import { PostRecord, PostStatus } from '@/lib/types';
import { fetchPostHistory, updatePostStatus } from '@/lib/supabase';
import { StatusBadge } from '@/components/StatusBadge';
import { useAuth } from '@/context/AuthContext';
import { 
  History, 
  Sparkles, 
  Calendar, 
  ExternalLink, 
  Copy, 
  Check, 
  Send, 
  Filter, 
  Search,
  Eye,
  RefreshCw,
  Clock,
  Instagram,
  ArrowRight
} from 'lucide-react';

export default function HistoryPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<PostRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'ALL' | PostStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<PostRecord | null>(null);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await fetchPostHistory(user?.uid || 'demo-user');
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [user?.uid]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePublishPost = async (post: PostRecord) => {
    setPublishingId(post.id);
    try {
      const res = await fetch('/api/post-instagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: post.id,
          caption: post.caption,
          imageData: post.image_data,
          businessName: post.business_name,
        }),
      });

      const json = await res.json();
      if (json.success) {
        await updatePostStatus(post.id, 'Posted', json.media_id);
        await loadHistory();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setPublishingId(null);
    }
  };

  const filteredPosts = posts.filter((p) => {
    const matchesFilter = statusFilter === 'ALL' || p.status === statusFilter;
    const matchesSearch =
      searchQuery === '' ||
      p.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.post_theme?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.caption.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <Layout title="Post History — MarkAI">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <History className="w-6 h-6 text-brand-400" />
              Post History & Publishing Log
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Track all AI-generated posts, draft copies, and live Instagram publishing states.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadHistory}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
              title="Refresh post history"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/20 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create New Post</span>
            </Link>
          </div>
        </div>

        {/* Filter and Search Toolbar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {(['ALL', 'Posted', 'Draft', 'Failed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex-shrink-0 ${
                  statusFilter === tab
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {tab === 'ALL' ? 'All Posts' : tab}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search history..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* Post List / Table */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-slate-400">Loading your post history...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-2xl p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-400 border border-brand-500/20 flex items-center justify-center mx-auto mb-4">
              <History className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-white">No posts found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {searchQuery || statusFilter !== 'ALL'
                ? 'Try adjusting your search or filters to see more results.'
                : 'Start by filling out your business profile to generate your first AI Instagram post.'}
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Generate Your First Post
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-xl transition flex flex-col md:flex-row gap-5 items-start md:items-center justify-between"
              >
                {/* Left Side: Thumbnail & Content Info */}
                <div className="flex items-start gap-4 flex-1">
                  {post.image_data ? (
                    <img
                      src={post.image_data}
                      alt={post.post_theme || 'Generated Graphic'}
                      className="w-20 h-20 rounded-xl object-cover border border-slate-800 flex-shrink-0 cursor-pointer hover:opacity-90"
                      onClick={() => setSelectedPost(post)}
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-brand-900/50 to-indigo-950 border border-slate-800 flex flex-col items-center justify-center text-center p-1 text-slate-400 flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-brand-400 mb-1" />
                      <span className="text-[9px] uppercase font-bold text-slate-400">MarkAI</span>
                    </div>
                  )}

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={post.status} size="sm" />
                      <span className="text-xs font-bold text-slate-200">
                        {post.business_name}
                      </span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-white tracking-tight">
                      {post.post_theme || 'Instagram Post'}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {post.caption}
                    </p>

                    {post.instagram_media_id && (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono pt-1">
                        <Instagram className="w-3 h-3 text-pink-400" />
                        <span>Media ID: {post.instagram_media_id}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side: Action Controls */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-800/80">
                  <button
                    onClick={() => handleCopy(post.id, post.caption)}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition text-xs flex items-center gap-1.5"
                    title="Copy Caption"
                  >
                    {copiedId === post.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 text-[11px] hidden sm:inline">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[11px] hidden sm:inline">Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setSelectedPost(post)}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition text-xs flex items-center gap-1.5"
                    title="View details"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span className="text-[11px] hidden sm:inline">View</span>
                  </button>

                  {post.status !== 'Posted' && (
                    <button
                      onClick={() => handlePublishPost(post)}
                      disabled={publishingId === post.id}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-md shadow-pink-600/20 disabled:opacity-50"
                    >
                      {publishingId === post.id ? (
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Instagram className="w-3.5 h-3.5" />
                      )}
                      <span>Post Now</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detailed Post Modal */}
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <StatusBadge status={selectedPost.status} />
                  <span className="text-sm font-bold text-white">{selectedPost.business_name}</span>
                </div>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Close
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedPost.image_data && (
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                      Branded Graphic
                    </span>
                    <img
                      src={selectedPost.image_data}
                      alt={selectedPost.post_theme}
                      className="w-full aspect-square object-cover rounded-xl border border-slate-800 shadow"
                    />
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Post Theme Headline
                    </span>
                    <p className="text-sm font-semibold text-brand-300">
                      {selectedPost.post_theme}
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Caption & Copy
                    </span>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 whitespace-pre-wrap max-h-48 overflow-y-auto">
                      {selectedPost.caption}
                    </div>
                  </div>

                  {selectedPost.best_time && (
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
                        Recommended Posting Window
                      </span>
                      <p className="text-xs text-emerald-400">{selectedPost.best_time}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
