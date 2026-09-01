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
  Copy, 
  Check, 
  Search,
  Eye,
  RefreshCw,
  Instagram
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
        <div className="card-glass rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
              <History className="w-7 h-7 text-fuchsia-400" />
              <span>Post History & Publishing Log</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Track all AI-generated posts, draft copies, and live Instagram publishing states.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadHistory}
              className="p-3 rounded-2xl bg-white/[0.05] border border-white/10 text-slate-400 hover:text-white transition"
              title="Refresh post history"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <Link
              href="/dashboard"
              className="btn-primary px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Create New Post</span>
            </Link>
          </div>
        </div>

        {/* Filter and Search Toolbar */}
        <div className="card-glass rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/10 shadow-xl">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {(['ALL', 'Posted', 'Draft', 'Failed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex-shrink-0 ${
                  statusFilter === tab
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md shadow-fuchsia-600/25'
                    : 'bg-white/[0.03] text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]'
                }`}
              >
                {tab === 'ALL' ? 'All Posts' : tab}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword or theme..."
              className="w-full bg-space-950/80 border border-white/10 rounded-xl pl-10 pr-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-fuchsia"
            />
          </div>
        </div>

        {/* Post List */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-3 border-fuchsia-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-slate-400">Loading your post history...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="card-glass rounded-3xl p-12 text-center border-dashed border-white/15">
            <div className="w-14 h-14 rounded-2xl bg-fuchsia-500/15 text-fuchsia-400 border border-fuchsia-500/30 flex items-center justify-center mx-auto mb-4 shadow-inner">
              <History className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white">No posts found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {searchQuery || statusFilter !== 'ALL'
                ? 'Try adjusting your search or filters to see more results.'
                : 'Start by filling out your business profile to generate your first AI Instagram post.'}
            </p>
            <Link
              href="/dashboard"
              className="btn-primary inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-2xl text-xs font-bold"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generate Your First Post</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="card-glass card-glass-hover rounded-3xl p-5 sm:p-6 shadow-2xl border border-white/10 transition flex flex-col md:flex-row gap-5 items-start md:items-center justify-between"
              >
                {/* Left Side: Thumbnail & Content Info */}
                <div className="flex items-start gap-4 flex-1">
                  {post.image_data ? (
                    <img
                      src={post.image_data}
                      alt={post.post_theme || 'Generated Graphic'}
                      className="w-20 h-20 rounded-2xl object-cover border border-white/10 flex-shrink-0 cursor-pointer hover:opacity-90 transition shadow-lg"
                      onClick={() => setSelectedPost(post)}
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-900/50 to-space-950 border border-white/10 flex flex-col items-center justify-center text-center p-1 text-slate-400 flex-shrink-0 shadow-lg">
                      <Sparkles className="w-5 h-5 text-fuchsia-400 mb-1" />
                      <span className="text-[9px] uppercase font-bold text-slate-400">MarkAI</span>
                    </div>
                  )}

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={post.status} size="sm" />
                      <span className="text-xs font-bold text-slate-200">
                        {post.business_name}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white tracking-tight">
                      {post.post_theme || 'Instagram Post'}
                    </h3>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {post.caption}
                    </p>

                    {post.instagram_media_id && (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono pt-1">
                        <Instagram className="w-3.5 h-3.5 text-rose-400" />
                        <span>Media ID: {post.instagram_media_id}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side: Action Controls */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-white/10">
                  <button
                    onClick={() => handleCopy(post.id, post.caption)}
                    className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition text-xs flex items-center gap-1.5 font-semibold"
                    title="Copy Caption"
                  >
                    {copiedId === post.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 text-[11px]">Copied</span>
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
                    className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition text-xs flex items-center gap-1.5 font-semibold"
                    title="View details"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span className="text-[11px] hidden sm:inline">View</span>
                  </button>

                  {post.status !== 'Posted' && (
                    <button
                      onClick={() => handlePublishPost(post)}
                      disabled={publishingId === post.id}
                      className="btn-instagram px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md disabled:opacity-50"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="card-glass rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto border border-white/10">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <StatusBadge status={selectedPost.status} />
                  <span className="text-sm font-bold text-white">{selectedPost.business_name}</span>
                </div>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="btn-secondary px-3 py-1 rounded-xl text-xs font-bold"
                >
                  Close
                </button>
              </div>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
                {selectedPost.image_data && (
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Branded Graphic
                    </span>
                    <img
                      src={selectedPost.image_data}
                      alt={selectedPost.post_theme}
                      className="w-full aspect-square object-cover rounded-2xl border border-white/10 shadow-xl"
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Post Theme Headline
                    </span>
                    <p className="text-sm font-bold text-fuchsia-300">
                      {selectedPost.post_theme}
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Caption & Copy
                    </span>
                    <div className="p-3.5 rounded-2xl bg-space-950 border border-white/10 text-xs text-slate-200 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
                      {selectedPost.caption}
                    </div>
                  </div>

                  {selectedPost.best_time && (
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                        Recommended Posting Window
                      </span>
                      <p className="text-xs font-semibold text-emerald-400">{selectedPost.best_time}</p>
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
