import React from 'react';
import { Scale, Download, Zap, Sparkles } from 'lucide-react';

export default function Navbar({ onOpenCompare, onOpenExport, isDataLoaded, activeTab, setActiveTab }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#090b10]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xl tracking-wider text-white font-sans">
              SORSA
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-pink-500/10 text-pink-400 border border-pink-500/20 rounded-md">
              100% FREE
            </span>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCompare}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-200 bg-[#131722] hover:bg-[#1a2030] border border-white/5 rounded-xl transition-all"
          >
            <Scale className="h-4 w-4 text-purple-400" />
            <span className="hidden sm:inline">Compare Accounts</span>
          </button>

          {isDataLoaded && (
            <button
              onClick={onOpenExport}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl transition-all"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export Report</span>
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-[#101923] border border-cyan-500/20 rounded-full text-cyan-400 text-xs font-mono">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>Live Data</span>
          </div>
        </div>
      </div>
    </header>
  );
}
