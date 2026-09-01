import React, { useState } from 'react';
import { Search, Loader2, Award, ShieldCheck, Landmark, DollarSign, TrendingUp, Sparkles, ArrowRight, Zap } from 'lucide-react';

const POPULAR_SUGGESTIONS = [
  { handle: 'vitalikbuterin', name: 'Vitalik Buterin', category: 'Ethereum' },
  { handle: 'sama', name: 'Sam Altman', category: 'OpenAI' },
  { handle: 'elonmusk', name: 'Elon Musk', category: 'X / Tesla' },
  { handle: 'cz_binance', name: 'CZ', category: 'Binance' },
  { handle: 'solana', name: 'Solana', category: 'Layer 1' },
  { handle: 'naval', name: 'Naval', category: 'Angel / KOL' },
  { handle: 'openai', name: 'OpenAI', category: 'AI' },
  { handle: 'cobie', name: 'Cobie', category: 'Crypto KOL' },
  { handle: 'aeyakovenko', name: 'Anatoly', category: 'Solana' },
  { handle: 'beabor', name: 'Bibi Borges', category: 'Research' }
];

export default function HomeHero({ onSearch, loading, recentSearches = [] }) {
  const [inputVal, setInputVal] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    onSearch(inputVal.trim());
  };

  const handleSuggestionClick = (handle) => {
    setInputVal(handle);
    onSearch(handle);
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-12 sm:py-20 px-4 text-center">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-mono font-medium mb-6">
        <Sparkles className="h-3.5 w-3.5" />
        <span>100% Free Sorsa & TweetScout Intelligence Alternative</span>
      </div>

      {/* Main Heading */}
      <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-3xl mx-auto font-sans">
        Analyze any <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400">X (Twitter)</span> Account Instantly
      </h1>

      <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
        Get the exact Sorsa Influence Score (0-2000), detect fake/bot audience, and uncover VC & Tier-1 KOL followers with zero paid API subscriptions.
      </p>

      {/* Big Search Input Box */}
      <div className="mt-8 max-w-2xl mx-auto">
        <form onSubmit={handleFormSubmit} className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
          <div className="relative flex items-center bg-[#0d1017] border border-white/10 rounded-2xl p-2 shadow-2xl focus-within:border-pink-500/50 transition-all">
            <div className="pl-4 pr-2 text-slate-500 font-mono text-lg font-bold">
              @
            </div>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Type any username (e.g. sama, elonmusk, vitalikbuterin)..."
              className="w-full bg-transparent text-white placeholder-slate-500 text-base font-mono focus:outline-none py-2.5 px-2"
              autoFocus
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !inputVal.trim()}
              className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold px-6 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-lg shadow-pink-500/20 shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Scanning...</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  <span>Search</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Popular Suggestions */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-500 font-medium flex items-center gap-1 mr-1">
            <TrendingUp className="h-3.5 w-3.5 text-pink-400" />
            Try searching:
          </span>
          {POPULAR_SUGGESTIONS.map((item) => (
            <button
              key={item.handle}
              onClick={() => handleSuggestionClick(item.handle)}
              disabled={loading}
              className="px-3 py-1.5 rounded-xl bg-[#11141d] hover:bg-[#181d2a] border border-white/5 hover:border-pink-500/30 text-slate-300 hover:text-white transition-all text-xs font-mono"
            >
              @{item.handle}
            </button>
          ))}
        </div>
      </div>

      {/* Feature Capabilities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-16 max-w-5xl mx-auto text-left">
        <div className="p-5 rounded-2xl bg-[#0b0e14] border border-white/5 hover:border-white/10 transition-all">
          <div className="h-10 w-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-3">
            <Award className="h-5 w-5" />
          </div>
          <h2 className="text-sm font-bold text-white mb-1">Sorsa Score (0-2000)</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Multi-factor authority rating with horizontal gradient scale and Tier badges.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0b0e14] border border-white/5 hover:border-white/10 transition-all">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h2 className="text-sm font-bold text-white mb-1">Audience Authenticity</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Detect Sybil farms, bought followers, and mass follow/unfollow churn.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0b0e14] border border-white/5 hover:border-white/10 transition-all">
          <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-3">
            <Landmark className="h-5 w-5" />
          </div>
          <h2 className="text-sm font-bold text-white mb-1">VC & KOL Radar</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            80+ Tier-1 Venture Capital funds and founders cross-matched in followers.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0b0e14] border border-white/5 hover:border-white/10 transition-all">
          <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3">
            <DollarSign className="h-5 w-5" />
          </div>
          <h2 className="text-sm font-bold text-white mb-1">Crypto & Cashtags</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Extracted $BTC, $ETH, $SOL mentions, contract addresses, and market sentiment.
          </p>
        </div>
      </div>
    </div>
  );
}
