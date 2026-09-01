import React, { useState } from 'react';
import { DollarSign, TrendingUp, Hash, Copy, Check, Eye, Heart, Repeat, MessageCircle } from 'lucide-react';

export default function CryptoAnalytics({ cryptoData, engagementData }) {
  const [copiedAddress, setCopiedAddress] = useState(null);

  if (!cryptoData) return null;

  const { cashtags = [], hashtags = [], topKeywords = [], contractAddresses = [], sentiment = { verdict: 'Neutral' } } = cryptoData;
  const metrics = engagementData || {};

  const handleCopy = (address) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const getSentimentColor = (verdict = '') => {
    if (verdict.includes('Bullish')) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (verdict.includes('Bearish')) return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
  };

  return (
    <div className="space-y-4">
      {/* 3 Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Engagement Rate */}
        <div className="bg-[#0b0e14] border border-white/5 rounded-3xl p-5 shadow-xl">
          <div className="text-xs text-slate-400 font-medium">Engagement Rate (ER%)</div>
          <div className="text-3xl font-extrabold text-cyan-400 font-mono mt-1">
            {metrics.engagementRate || '0.00%'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Interaction ratio per view across sample timeline
          </div>
        </div>

        {/* Sentiment */}
        <div className="bg-[#0b0e14] border border-white/5 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Content Sentiment</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getSentimentColor(sentiment.verdict)}`}>
              {sentiment.verdict}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-2 text-xs font-mono">
            <span className="text-emerald-400">+{sentiment.bullishSignals || 0} Bullish</span>
            <span className="text-rose-400">-{sentiment.bearishSignals || 0} Bearish</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            Heuristic NLP scan of recent tweets
          </div>
        </div>

        {/* Average Views & Likes */}
        <div className="bg-[#0b0e14] border border-white/5 rounded-3xl p-5 shadow-xl">
          <div className="text-xs text-slate-400 font-medium">Average Performance</div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="bg-[#12151f] p-2 rounded-xl">
              <div className="text-[10px] text-slate-400">Avg Views</div>
              <div className="font-bold text-white font-mono text-sm">{(metrics.avgViews || 0).toLocaleString()}</div>
            </div>
            <div className="bg-[#12151f] p-2 rounded-xl">
              <div className="text-[10px] text-slate-400">Avg Likes</div>
              <div className="font-bold text-white font-mono text-sm">{(metrics.avgLikes || 0).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Cashtags & Hashtags */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cashtags ($BTC, $ETH) */}
        <div className="bg-[#0b0e14] border border-white/5 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white font-bold text-sm flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-400" />
              <span>Discussed Crypto Cashtags</span>
            </h4>
            <span className="text-xs text-slate-400 font-mono">{cashtags.length} tokens</span>
          </div>

          {cashtags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {cashtags.map((item) => (
                <div
                  key={item.symbol}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-xs flex items-center gap-1.5"
                >
                  <span className="font-bold">${item.symbol}</span>
                  <span className="text-[10px] text-slate-400">({item.count}x)</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-4 text-center">
              No specific crypto $CASHTAGS found in recent sample posts.
            </p>
          )}
        </div>

        {/* Topics & Keywords */}
        <div className="bg-[#0b0e14] border border-white/5 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white font-bold text-sm flex items-center gap-2">
              <Hash className="h-4 w-4 text-cyan-400" />
              <span>Frequent Topics</span>
            </h4>
            <span className="text-xs text-slate-400 font-mono">Wordcloud</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {hashtags.map((h) => (
              <span
                key={h.tag}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-mono"
              >
                #{h.tag}
              </span>
            ))}
            {topKeywords.slice(0, 10).map((k) => (
              <span
                key={k.word}
                className="px-2.5 py-1 rounded-lg bg-[#12151f] text-slate-300 border border-white/5 text-xs font-mono"
              >
                {k.word}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Contract Addresses */}
      {contractAddresses && contractAddresses.length > 0 && (
        <div className="bg-[#0b0e14] border border-white/5 rounded-3xl p-6 shadow-xl">
          <h4 className="text-white font-bold text-sm mb-3">Discovered Smart Contract Addresses (CA)</h4>
          <div className="space-y-2">
            {contractAddresses.map((ca, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-[#12151f] border border-white/5 text-xs font-mono"
              >
                <div className="truncate mr-2">
                  <span className="text-slate-400">{ca.chain}: </span>
                  <span className="text-cyan-400 font-bold">{ca.address}</span>
                </div>
                <button
                  onClick={() => handleCopy(ca.address)}
                  className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white shrink-0 flex items-center gap-1"
                >
                  {copiedAddress === ca.address ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span className="text-emerald-400 text-[10px]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
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
