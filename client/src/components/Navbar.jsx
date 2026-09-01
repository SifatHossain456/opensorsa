import React, { useState } from 'react';
import { Scale, Download, Search, Sparkles, Home } from 'lucide-react';

export default function Navbar({ onOpenCompare, onOpenExport, isDataLoaded, onSearch, onGoHome }) {
  const [navSearch, setNavSearch] = useState('');

  const handleNavSubmit = (e) => {
    e.preventDefault();
    if (!navSearch.trim()) return;
    onSearch(navSearch.trim());
    setNavSearch('');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#07090e]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5 cursor-pointer shrink-0" onClick={onGoHome}>
          <span className="font-extrabold text-xl tracking-wider text-white font-sans">
            SORSA
          </span>
          <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-pink-500/10 text-pink-400 border border-pink-500/20 rounded-md">
            FREE
          </span>
        </div>

        {/* Compact Nav Search (Shown when report is loaded) */}
        {isDataLoaded && (
          <form onSubmit={handleNavSubmit} className="hidden md:flex items-center max-w-md w-full relative">
            <Search className="h-4 w-4 text-slate-500 absolute left-3.5" />
            <input
              type="text"
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              placeholder="Search another handle (@sama, @openai)..."
              className="w-full bg-[#0d1017] border border-white/10 rounded-xl py-1.5 pl-9 pr-3 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-pink-500/50"
            />
          </form>
        )}

        {/* Navigation Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {isDataLoaded && (
            <button
              onClick={onGoHome}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-[#11141d] hover:bg-[#181d2a] border border-white/5 rounded-xl transition-all"
            >
              <Home className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">New Search</span>
            </button>
          )}

          <button
            onClick={onOpenCompare}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-[#11141d] hover:bg-[#181d2a] border border-white/5 rounded-xl transition-all"
          >
            <Scale className="h-3.5 w-3.5 text-purple-400" />
            <span className="hidden sm:inline">Compare</span>
          </button>

          {isDataLoaded && (
            <button
              onClick={onOpenExport}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl transition-all"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
