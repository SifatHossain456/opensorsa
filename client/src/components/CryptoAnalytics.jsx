import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Hash, Copy, Check, Eye, Heart, Repeat, MessageCircle } from 'lucide-react';

export default function CryptoAnalytics({ cryptoData, engagementData }) {
  const [copiedAddress, setCopiedAddress] = useState(null);

  if (!cryptoData) return null;

  const { cashtags, hashtags, topKeywords, contractAddresses, sentiment } = cryptoData;
  const metrics = engagementData || {};

  const handleCopy = (address) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const getSentimentColor = (verdict) => {
    if (verdict.includes('Bullish')) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (verdict.includes('Bearish')) return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
  };

  return (
    <div className="space-y-6">
      {/* Top Row: Engagement Velocity & Sentiment */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sentiment Card */}
        <div className="glass-panel rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-cyan-400" />
              Content Sentiment
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getSentimentColor(sentiment.verdict)}`}>
              {sentiment.verdict}
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Bullish Signals:</span>
              <span className="text-emerald-400 font-bold font-mono">+{sentiment.bullishSignals}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Bearish Signals:</span>
              <span className="text-rose-400 font-bold font-mono">-{sentiment.bearishSignals}</span>
            </div>
            <div className="h-2 w-full bg-dark-900 rounded-full overflow-hidden flex border border-white/5">
              <div
                className="h-full bg-emerald-400"
                style={{ width: `${Math.max(10, Math.min(90, (sentiment.bullishSignals / Math.max(1, sentiment.bullishSignals + sentiment.bearishSignals)) * 100))}%` }}
              ></div>
              <div
                className="h-full bg-rose-500"
                style={{ width: `${Math.max(10, Math.min(90, (sentiment.bearishSignals / Math.max(1, sentiment.bullishSignals + sentiment.bearishSignals)) * 100))}%` }}
              ></div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 mt-3 pt-3 border-t border-white/5">
            Analyzed from {metrics.totalAnalyzedTweets || 0} recent posts
          </div>
        </div>

        {/* Engagement Rate Card */}
        <div className="glass-panel rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Engagement Rate (ER%)
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                Live
              </span>
            </div>
            <div className="text-3xl font-extrabold font-mono text-gradient-cyan mt-1">
              {metrics.engagementRate || '0.00%'}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Average interaction per view across all recent posts.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/5 text-xs">
            <div className="bg-dark-900/60 p-2 rounded-xl">
              <div className="text-slate-400 flex items-center gap-1 text-[11px]">
                <Eye className="h-3 w-3 text-cyan-400" /> Avg Views
              </div>
              <div className="font-mono font-bold text-white text-sm mt-0.5">
                {(metrics.avgViews || 0).toLocaleString()}
              </div>
            </div>
            <div className="bg-dark-900/60 p-2 rounded-xl">
              <div className="text-slate-400 flex items-center gap-1 text-[11px]">
                <Heart className="h-3 w-3 text-rose-400" /> Avg Likes
              </div>
              <div className="font-mono font-bold text-white text-sm mt-0.5">
                {(metrics.avgLikes || 0).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Retweet & Reply Velocity */}
        <div className="glass-panel rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Viral Spread Dynamics
            </span>
            <div className="text-sm text-slate-300 mt-2">
              Virality coefficient from retweets and replies.
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/5 text-xs">
            <div className="bg-dark-900/60 p-2.5 rounded-xl">
              <div className="text-slate-400 flex items-center gap-1 text-[11px]">
                <Repeat className="h-3 w-3 text-emerald-400" /> Avg Reposts
              </div>
              <div className="font-mono font-bold text-white text-base mt-0.5">
                {(metrics.avgReposts || 0).toLocaleString()}
              </div>
            </div>
            <div className="bg-dark-900/60 p-2.5 rounded-xl">
              <div className="text-slate-400 flex items-center gap-1 text-[11px]">
                <MessageCircle className="h-3 w-3 text-blue-400" /> Avg Replies
              </div>
              <div className="font-mono font-bold text-white text-base mt-0.5">
                {(metrics.avgReplies || 0).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 mt-2">
            Total Views Analyzed: {(metrics.totalViews || 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Cashtags & Hashtags Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cashtags ($BTC, $ETH, $SOL) */}
        <div className="glass-panel rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-400" />
              <span>Discussed Crypto Cashtags</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {cashtags.length} tokens
            </span>
          </div>

          {cashtags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {cashtags.map((item) => (
                <div
                  key={item.symbol}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs flex items-center gap-2"
                >
                  <span className="font-bold">${item.symbol}</span>
                  <span className="px-1.5 py-0.2 bg-dark-950/60 rounded text-[10px] text-slate-400">
                    {item.count}x
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-4 text-center">
              No specific $CASHTAGS detected in recent sample tweets.
            </p>
          )}
        </div>

        {/* Top Hashtags & Keywords */}
        <div className="glass-panel rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Hash className="h-4 w-4 text-cyan-400" />
              <span>Frequent Topics & Keywords</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Wordcloud</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {hashtags.map((h) => (
              <span
                key={h.tag}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-mono"
              >
                #{h.tag} ({h.count})
              </span>
            ))}
            {topKeywords.slice(0, 10).map((k) => (
              <span
                key={k.word}
                className="px-2.5 py-1 rounded-lg bg-white/5 text-slate-300 border border-white/5 text-xs font-mono"
              >
                {k.word}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Contract Addresses if any */}
      {contractAddresses && contractAddresses.length > 0 && (
        <div className="glass-panel rounded-3xl p-6 shadow-xl">
          <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
            <span>Discovered Contract Addresses (CA)</span>
          </h3>
          <div className="space-y-2">
            {contractAddresses.map((ca, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-dark-900 border border-white/10 text-xs font-mono"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-slate-400">{ca.chain}:</span>
                  <span className="text-cyan-400 font-bold truncate">{ca.address}</span>
                </div>
                <button
                  onClick={() => handleCopy(ca.address)}
                  className="flex items-center gap-1 text-slate-400 hover:text-white px-2 py-1 rounded bg-white/5 hover:bg-white/10"
                >
                  {copiedAddress === ca.address ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400 text-[10px]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span className="text-[10px]">Copy</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
