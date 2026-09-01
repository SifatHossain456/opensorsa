import React, { useState } from 'react';
import { Landmark, Users, ExternalLink, Search, Sparkles } from 'lucide-react';

export default function VcKolRadar({ vcData }) {
  const [filter, setFilter] = useState('ALL');
  const [searchFilter, setSearchFilter] = useState('');

  if (!vcData) return null;

  const { totalMatches = 0, matches = [], detectedFunds = [], detectedKols = [] } = vcData;

  const baseList = filter === 'VC'
    ? detectedFunds
    : filter === 'KOL'
    ? detectedKols
    : matches;

  const displayList = baseList.filter((item) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (item.name || '').toLowerCase().includes(q) || (item.handle || '').toLowerCase().includes(q);
  });

  return (
    <div className="bg-[#0b0e14] border border-white/5 rounded-3xl p-6 sm:p-7 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-white font-bold text-base tracking-wide">
              Followed By Top Accounts
            </h3>
            <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full">
              {totalMatches} tracked
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Accounts from our 80+ curated Tier-1 VC funds, founders, and prominent crypto figures.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#12151f] p-1 rounded-xl border border-white/5 self-start">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
              filter === 'ALL'
                ? 'bg-purple-500/20 text-purple-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({totalMatches})
          </button>
          <button
            onClick={() => setFilter('VC')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
              filter === 'VC'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            VCs ({detectedFunds.length})
          </button>
          <button
            onClick={() => setFilter('KOL')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
              filter === 'KOL'
                ? 'bg-pink-500/20 text-pink-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            KOLs/Founders ({detectedKols.length})
          </button>
        </div>
      </div>

      {/* Quick Search within followed by */}
      <div className="relative mb-4">
        <Search className="h-4 w-4 text-slate-500 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          placeholder="Filter by name or handle..."
          className="w-full bg-[#12151f] border border-white/5 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white/20 font-mono"
        />
      </div>

      {/* Grid of VC & KOL cards */}
      {displayList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {displayList.map((item, idx) => {
            const isVc = item.type === 'VC';
            return (
              <div
                key={idx}
                className="bg-[#12151f] border border-white/5 hover:border-white/15 p-3.5 rounded-2xl transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-xl bg-dark-800 border border-white/10 overflow-hidden shrink-0">
                    <img
                      src={item.avatar || `https://unavatar.io/x/${item.handle}`}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://api.dicebear.com/7.x/identicon/svg?seed=${item.handle}`;
                      }}
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-white text-xs sm:text-sm group-hover:text-cyan-400 transition-colors truncate">
                      {item.name}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-slate-400 font-mono text-[11px] truncate">@{item.handle}</span>
                      <span className={`px-1.5 py-0.2 text-[9px] rounded font-mono font-medium shrink-0 ${
                        isVc ? 'bg-cyan-500/10 text-cyan-400' : 'bg-pink-500/10 text-pink-400'
                      }`}>
                        {item.category || item.type}
                      </span>
                    </div>
                  </div>
                </div>

                <a
                  href={`https://x.com/${item.handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-slate-500 hover:text-white rounded-lg transition-all shrink-0 ml-2"
                  title="View on X"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 bg-[#12151f]/50 rounded-2xl border border-white/5">
          <p className="text-xs text-slate-400">No matching accounts found in this category.</p>
        </div>
      )}
    </div>
  );
}
