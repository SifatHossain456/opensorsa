import React, { useState } from 'react';
import { MessageSquare, Eye, Heart, Repeat, Bookmark, ExternalLink, Filter, Sparkles } from 'lucide-react';

function formatNumber(num) {
  if (!num) return '0';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return num.toLocaleString();
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (e) {
    return dateStr;
  }
}

export default function TweetsFeed({ tweets, authorName, authorHandle, authorAvatar }) {
  const [sortBy, setSortBy] = useState('views'); // 'views' | 'likes' | 'reposts' | 'recent'

  if (!tweets || tweets.length === 0) {
    return (
      <div className="glass-panel rounded-3xl p-8 text-center text-slate-400">
        <MessageSquare className="h-10 w-10 text-slate-600 mx-auto mb-3" />
        <p className="text-sm">No recent public tweets found for this handle.</p>
      </div>
    );
  }

  // Sorting logic
  const sortedTweets = [...tweets].sort((a, b) => {
    if (sortBy === 'views') return (b.views || 0) - (a.views || 0);
    if (sortBy === 'likes') return (b.likes || 0) - (a.likes || 0);
    if (sortBy === 'reposts') return (b.reposts || 0) - (a.reposts || 0);
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="glass-panel rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-cyan-400" />
          <h2 className="text-base font-bold text-white">
            Analyzed Posts ({tweets.length})
          </h2>
        </div>

        {/* Sort buttons */}
        <div className="flex items-center gap-1.5 bg-dark-900 p-1 rounded-xl border border-white/5 overflow-x-auto">
          <button
            onClick={() => setSortBy('views')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg transition-all ${
              sortBy === 'views'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Top Views</span>
          </button>
          <button
            onClick={() => setSortBy('likes')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg transition-all ${
              sortBy === 'likes'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Heart className="h-3.5 w-3.5" />
            <span>Most Liked</span>
          </button>
          <button
            onClick={() => setSortBy('reposts')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg transition-all ${
              sortBy === 'reposts'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Repeat className="h-3.5 w-3.5" />
            <span>Top Retweets</span>
          </button>
          <button
            onClick={() => setSortBy('recent')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg transition-all ${
              sortBy === 'recent'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Latest</span>
          </button>
        </div>
      </div>

      {/* Tweet Cards List */}
      <div className="space-y-3.5">
        {sortedTweets.map((t, idx) => (
          <div
            key={t.id || idx}
            className="glass-panel p-5 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all group"
          >
            {/* Top row */}
            <div className="flex items-center justify-between mb-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full overflow-hidden bg-dark-800 shrink-0">
                  <img
                    src={authorAvatar || `https://unavatar.io/x/${authorHandle}`}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="font-semibold text-white">{authorName}</span>
                <span className="text-slate-400 font-mono">@{authorHandle}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-400">{formatDate(t.createdAt)}</span>
              </div>

              <a
                href={t.url || `https://x.com/${authorHandle}/status/${t.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-cyan-400 flex items-center gap-1 transition-colors"
                title="View original on X"
              >
                <span>View on X</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Post text */}
            <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-line mb-3.5 font-normal">
              {t.text}
            </p>

            {/* Photos / Media if present */}
            {t.media && t.media.photos && t.media.photos.length > 0 && (
              <div className="mb-3.5 rounded-xl overflow-hidden max-h-72 border border-white/10">
                <img
                  src={t.media.photos[0].url}
                  alt="Post Attachment"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            )}

            {/* Metrics Pills */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-2 border-t border-white/5">
              <div className="flex items-center gap-1.5 text-cyan-400" title="Views">
                <Eye className="h-3.5 w-3.5" />
                <span>{formatNumber(t.views)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-rose-400" title="Likes">
                <Heart className="h-3.5 w-3.5" />
                <span>{formatNumber(t.likes)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400" title="Retweets">
                <Repeat className="h-3.5 w-3.5" />
                <span>{formatNumber(t.reposts)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-blue-400" title="Replies">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>{formatNumber(t.replies)}</span>
              </div>
              {t.bookmarks > 0 && (
                <div className="flex items-center gap-1.5 text-amber-400" title="Bookmarks">
                  <Bookmark className="h-3.5 w-3.5" />
                  <span>{formatNumber(t.bookmarks)}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
