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
        <div className="bg-white rounded-sm p-6 border border-grey/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-grey mb-1.5">
              [Publishing Ledger]
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ink tracking-tight">
              Post History
            </h1>
            <p className="text-xs sm:text-sm text-grey mt-1">
              Ledger of all AI-generated posts, draft copies, and Instagram publishing states.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={loadHistory}
              className="p-2.5 rounded-sm border border-grey/30 text-grey hover:text-ink transition"
              title="Refresh ledger"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <Link
              href="/dashboard"
              className="btn-primary px-4 py-2 rounded-sm text-xs font-medium"
            >
              Generate Post
            </Link>
          </div>
        </div>

        {/* Filter and Search Toolbar */}
        <div className="bg-white rounded-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-grey/30">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {(['ALL', 'Posted', 'Draft', 'Failed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-sm text-xs font-mono transition flex-shrink-0 ${
                  statusFilter === tab
                    ? 'bg-ink text-white'
                    : 'bg-white text-grey hover:text-ink border border-grey/30'
                }`}
              >
                [{tab === 'ALL' ? 'All Records' : tab}]
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search keyword or theme..."
              className="w-full bg-white border border-grey/30 rounded-sm px-3 py-1.5 text-xs text-ink placeholder-grey focus:outline-none focus:border-ink"
            />
          </div>
        </div>

        {/* Post List */}
        {loading ? (
          <div className="py-20 text-center">
            <p className="text-xs font-mono text-grey">Loading ledger records...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-white rounded-sm p-12 text-center border border-grey/30">
            <h3 className="text-base font-serif font-bold text-ink">No records found</h3>
            <p className="text-xs text-grey mt-1 max-w-sm mx-auto">
              {searchQuery || statusFilter !== 'ALL'
                ? 'Adjust filter or search query.'
                : 'Generate your first social post from the business dashboard.'}
            </p>
            <Link
              href="/dashboard"
              className="btn-primary inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-sm text-xs font-medium"
            >
              Generate First Post
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-sm p-5 border border-grey/30 transition flex flex-col md:flex-row gap-5 items-start md:items-center justify-between"
              >
                {/* Left Side: Thumbnail & Content Info */}
                <div className="flex items-start gap-4 flex-1">
                  {post.image_data ? (
                    <img
                      src={post.image_data}
                      alt={post.post_theme || 'Generated Graphic'}
                      className="w-16 h-16 rounded-sm object-cover border border-grey/30 flex-shrink-0 cursor-pointer"
                      onClick={() => setSelectedPost(post)}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-sm bg-white border border-grey/30 flex flex-col items-center justify-center text-center p-1 text-grey flex-shrink-0">
                      <span className="text-[10px] font-mono">[MarkAI]</span>
                    </div>
                  )}

                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={post.status} size="sm" />
                      <span className="text-xs font-serif font-bold text-ink">
                        {post.business_name}
                      </span>
                      <span className="text-[11px] font-mono text-grey">
                        {new Date(post.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <h3 className="text-xs font-medium text-ink">
                      {post.post_theme || 'Instagram Post'}
                    </h3>

                    <p className="text-xs text-grey line-clamp-2 leading-relaxed">
                      {post.caption}
                    </p>

                    {post.instagram_media_id && (
                      <div className="text-[10px] font-mono text-grey pt-0.5">
                        Media ID: {post.instagram_media_id}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side: Action Controls */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-grey/20">
                  <button
                    onClick={() => handleCopy(post.id, post.caption)}
                    className="px-2.5 py-1.5 rounded-sm border border-grey/30 text-grey hover:text-ink transition text-xs font-mono"
                    title="Copy Caption"
                  >
                    {copiedId === post.id ? '[Copied]' : 'Copy'}
                  </button>

                  <button
                    onClick={() => setSelectedPost(post)}
                    className="px-2.5 py-1.5 rounded-sm border border-grey/30 text-grey hover:text-ink transition text-xs font-mono"
                    title="View details"
                  >
                    View
                  </button>

                  {post.status !== 'Posted' && (
                    <button
                      onClick={() => handlePublishPost(post)}
                      disabled={publishingId === post.id}
                      className="btn-primary px-3 py-1.5 rounded-sm text-xs font-medium disabled:opacity-50"
                    >
                      {publishingId === post.id ? 'Publishing...' : 'Post Now'}
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
            <div className="bg-white rounded-sm max-w-2xl w-full p-6 border border-ink relative max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-grey/30">
                <div className="flex items-center gap-2.5">
                  <StatusBadge status={selectedPost.status} />
                  <span className="text-sm font-serif font-bold text-ink">{selectedPost.business_name}</span>
                </div>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="btn-secondary px-3 py-1.5 rounded-sm text-xs font-medium"
                >
                  Close
                </button>
              </div>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
                {selectedPost.image_data && (
                  <div>
                    <span className="text-xs font-mono text-grey block mb-2">
                      [Canvas Graphic]
                    </span>
                    <img
                      src={selectedPost.image_data}
                      alt={selectedPost.post_theme}
                      className="w-full aspect-square object-cover rounded-sm border border-grey/30"
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-mono text-grey block mb-1">
                      [Post Theme Hook]
                    </span>
                    <p className="text-sm font-serif font-bold text-ink">
                      {selectedPost.post_theme}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs font-mono text-grey block mb-1">
                      [Caption Text]
                    </span>
                    <div className="p-3 rounded-sm bg-white border border-grey/30 text-xs text-ink whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed font-sans">
                      {selectedPost.caption}
                    </div>
                  </div>

                  {selectedPost.best_time && (
                    <div>
                      <span className="text-xs font-mono text-grey block mb-0.5">
                        [Optimal Window]
                      </span>
                      <p className="text-xs font-mono text-ink">{selectedPost.best_time}</p>
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
