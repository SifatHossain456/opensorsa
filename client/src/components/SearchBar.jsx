import React, { useState } from 'react';
import { Search, Loader2, History, TrendingUp, X } from 'lucide-react';

const QUICK_PICKS = [
  { handle: 'vitalikbuterin', label: 'Vitalik Buterin' },
  { handle: 'cz_binance', label: 'CZ Binance' },
  { handle: 'elonmusk', label: 'Elon Musk' },
  { handle: 'aeyakovenko', label: 'Anatoly (Solana)' },
  { handle: 'brian_armstrong', label: 'Brian Armstrong' },
  { handle: 'cobie', label: 'Cobie' }
];

export default function SearchBar({ onSearch, loading, currentUsername, recentSearches, onClearRecent }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query.trim());
  };

  const handleSelect = (handle) => {
    setQuery(handle);
    onSearch(handle);
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-6">
      {/* Big Cyber Search Box */}
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-2xl blur-sm opacity-35 group-hover:opacity-60 transition duration-300"></div>
        <div className="relative flex items-center bg-dark-900 border border-white/10 rounded-2xl shadow-2xl p-1.5 focus-within:border-cyan-500/60 transition-all">
          <div className="pl-4 pr-2 text-slate-400">
            <span className="font-mono text-cyan-400 font-bold text-lg">@</span>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter X/Twitter username (e.g. vitalikbuterin, elonmusk)..."
            className="w-full bg-transparent text-white placeholder-slate-500 text-sm sm:text-base font-mono focus:outline-none py-2.5 px-1"
            disabled={loading}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors mr-1"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-dark-950 font-semibold px-5 py-2.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20 text-sm"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-dark-950" />
                <span>Scanning...</span>
              </>
            ) : (
              <>
                <Search className="h-4 w-4 text-dark-950" />
                <span>Deep Intel</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Quick Picks & Trending */}
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <div className="flex items-center gap-1 text-slate-400 mr-1">
          <TrendingUp className="h-3.5 w-3.5 text-cyan-400" />
          <span>Popular:</span>
        </div>
        {QUICK_PICKS.map((item) => (
          <button
            key={item.handle}
            onClick={() => handleSelect(item.handle)}
            disabled={loading}
            className={`px-2.5 py-1 rounded-lg border text-xs font-mono transition-all ${
              currentUsername === item.handle.toLowerCase()
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-white/5 text-slate-300 border-white/5 hover:border-white/20 hover:bg-white/10'
            }`}
          >
            @{item.handle}
          </button>
        ))}
      </div>

      {/* Recent History if any */}
      {recentSearches && recentSearches.length > 0 && (
        <div className="mt-2.5 flex items-center gap-2 text-xs text-slate-400">
          <History className="h-3.5 w-3.5 text-slate-500" />
          <span className="text-[11px]">Recent:</span>
          <div className="flex flex-wrap gap-1.5 items-center">
            {recentSearches.slice(0, 5).map((handle) => (
              <button
                key={handle}
                onClick={() => handleSelect(handle)}
                className="text-slate-300 hover:text-cyan-400 font-mono text-[11px] underline underline-offset-2"
              >
                @{handle}
              </button>
            ))}
            {onClearRecent && (
              <button
                onClick={onClearRecent}
                className="text-[10px] text-slate-500 hover:text-rose-400 ml-2"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
