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
        <div className="bg-surface rounded-2xl p-6 sm:p-7 border border-border shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-kanchipuram/5 border border-kanchipuram/15 text-xs font-semibold text-kanchipuram mb-2">
              <History className="w-3.5 h-3.5" />
              <span>Publishing Log</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink tracking-tight">
              Post History
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-1">
              Track all AI-generated posts, draft copies, and live Instagram publishing states.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadHistory}
              className="p-3 rounded-xl bg-canvas border border-border text-muted hover:text-ink hover:border-ink/20 transition"
              title="Refresh post history"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-kanchipuram' : ''}`} />
            </button>
            <Link
              href="/dashboard"
              className="btn-primary px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold shadow-sm flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-tumbler" />
              <span>Create New Post</span>
            </Link>
          </div>
        </div>

        {/* Filter and Search Toolbar */}
        <div className="bg-surface rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-border shadow-card">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {(['ALL', 'Posted', 'Draft', 'Failed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex-shrink-0 ${
                  statusFilter === tab
                    ? 'bg-kanchipuram text-white shadow-sm'
                    : 'bg-canvas text-muted hover:text-ink hover:bg-border/40 border border-border'
                }`}
              >
                {tab === 'ALL' ? 'All Posts' : tab}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword or theme..."
              className="w-full bg-canvas border border-border rounded-xl pl-10 pr-3.5 py-2 text-xs text-ink placeholder:text-muted/60 focus:outline-none focus:border-kanchipuram focus:ring-1 focus:ring-kanchipuram"
            />
          </div>
        </div>

        {/* Post List */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-2 border-kanchipuram border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-muted font-medium">Loading your post history...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-surface rounded-2xl p-12 text-center border-2 border-dashed border-border">
            <div className="w-14 h-14 rounded-2xl bg-kanchipuram/5 text-kanchipuram border border-kanchipuram/15 flex items-center justify-center mx-auto mb-4">
              <History className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-display font-bold text-ink">No posts found</h3>
            <p className="text-xs text-muted mt-1 max-w-sm mx-auto">
              {searchQuery || statusFilter !== 'ALL'
                ? 'Try adjusting your search or filters to see more results.'
                : 'Start by filling out your business profile to generate your first AI Instagram post.'}
            </p>
            <Link
              href="/dashboard"
              className="btn-primary inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-xl text-xs font-semibold"
            >
              <Sparkles className="w-4 h-4 text-tumbler" />
              <span>Generate Your First Post</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-surface rounded-2xl p-5 sm:p-6 shadow-card hover:shadow-card-hover border border-border transition flex flex-col md:flex-row gap-5 items-start md:items-center justify-between"
              >
                {/* Left Side: Thumbnail & Content Info */}
                <div className="flex items-start gap-4 flex-1">
                  {post.image_data ? (
                    <img
                      src={post.image_data}
                      alt={post.post_theme || 'Generated Graphic'}
                      className="w-20 h-20 rounded-xl object-cover border border-border flex-shrink-0 cursor-pointer hover:opacity-90 transition shadow-sm"
                      onClick={() => setSelectedPost(post)}
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-canvas border border-border flex flex-col items-center justify-center text-center p-1 text-muted flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-kanchipuram mb-1" />
                      <span className="text-[9px] uppercase font-bold tracking-wide text-muted">MarkAI</span>
                    </div>
                  )}

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={post.status} size="sm" />
                      <span className="text-xs font-bold text-ink">
                        {post.business_name}
                      </span>
                      <span className="text-[11px] text-muted flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <h3 className="text-sm font-display font-bold text-ink tracking-tight">
                      {post.post_theme || 'Instagram Post'}
                    </h3>

                    <p className="text-xs text-muted line-clamp-2 leading-relaxed">
                      {post.caption}
                    </p>

                    {post.instagram_media_id && (
                      <div className="flex items-center gap-1.5 text-[11px] text-muted font-mono pt-1">
                        <Instagram className="w-3.5 h-3.5 text-pink-600" />
                        <span>Media ID: {post.instagram_media_id}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side: Action Controls */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-border">
                  <button
                    onClick={() => handleCopy(post.id, post.caption)}
                    className="p-2.5 rounded-xl bg-canvas hover:bg-border/40 border border-border text-muted hover:text-ink transition text-xs flex items-center gap-1.5 font-semibold"
                    title="Copy Caption"
                  >
                    {copiedId === post.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-success" />
                        <span className="text-success text-[11px]">Copied</span>
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
                    className="p-2.5 rounded-xl bg-canvas hover:bg-border/40 border border-border text-muted hover:text-ink transition text-xs flex items-center gap-1.5 font-semibold"
                    title="View details"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span className="text-[11px] hidden sm:inline">View</span>
                  </button>

                  {post.status !== 'Posted' && (
                    <button
                      onClick={() => handlePublishPost(post)}
                      disabled={publishingId === post.id}
                      className="btn-instagram px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm disabled:opacity-50"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-surface rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-elevation relative max-h-[90vh] overflow-y-auto border border-border">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <StatusBadge status={selectedPost.status} />
                  <span className="text-sm font-bold text-ink">{selectedPost.business_name}</span>
                </div>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="btn-secondary px-3 py-1.5 rounded-xl text-xs font-semibold"
                >
                  Close
                </button>
              </div>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
                {selectedPost.image_data && (
                  <div>
                    <span className="text-[11px] font-bold text-muted uppercase tracking-wider block mb-2">
                      Branded Graphic
                    </span>
                    <img
                      src={selectedPost.image_data}
                      alt={selectedPost.post_theme}
                      className="w-full aspect-square object-cover rounded-xl border border-border shadow-sm"
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <span className="text-[11px] font-bold text-muted uppercase tracking-wider block mb-1">
                      Post Theme Headline
                    </span>
                    <p className="text-sm font-display font-bold text-kanchipuram">
                      {selectedPost.post_theme}
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-muted uppercase tracking-wider block mb-1">
                      Caption & Copy
                    </span>
                    <div className="p-3.5 rounded-xl bg-canvas border border-border text-xs text-ink whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
                      {selectedPost.caption}
                    </div>
                  </div>

                  {selectedPost.best_time && (
                    <div>
                      <span className="text-[11px] font-bold text-muted uppercase tracking-wider block mb-0.5">
                        Recommended Posting Window
                      </span>
                      <p className="text-xs font-semibold text-success">{selectedPost.best_time}</p>
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
