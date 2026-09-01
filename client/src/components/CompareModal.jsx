import React, { useState } from 'react';
import { Scale, X, Loader2, Trophy, ArrowRight, ShieldCheck, Award, Users, Eye } from 'lucide-react';

function formatNumber(num) {
  if (!num) return '0';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return num.toLocaleString();
}

export default function CompareModal({ isOpen, onClose, initialUser1 }) {
  const [handle1, setHandle1] = useState(initialUser1 || 'vitalikbuterin');
  const [handle2, setHandle2] = useState('cz_binance');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  const handleCompare = async (e) => {
    e.preventDefault();
    if (!handle1.trim() || !handle2.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/compare?user1=${encodeURIComponent(handle1.trim())}&user2=${encodeURIComponent(handle2.trim())}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Comparison failed');
      setResult(data.comparison);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const u1 = result?.user1;
  const u2 = result?.user2;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-dark-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
            <Scale className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              Versus Mode: Head-to-Head Battle
            </h2>
            <p className="text-xs text-slate-400">
              Side-by-side comparison of Sorsa Scores, reach, virality, and authenticity.
            </p>
          </div>
        </div>

        {/* Handles Input Form */}
        <form onSubmit={handleCompare} className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-8">
          <div className="sm:col-span-5 relative">
            <span className="absolute left-3.5 top-3 text-cyan-400 font-mono text-sm">@</span>
            <input
              type="text"
              value={handle1}
              onChange={(e) => setHandle1(e.target.value)}
              placeholder="Handle 1 (e.g. vitalikbuterin)"
              className="w-full bg-dark-950 border border-white/10 rounded-xl py-2.5 pl-8 pr-3 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="sm:col-span-2 flex items-center justify-center">
            <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-mono font-bold text-slate-400">
              VS
            </span>
          </div>

          <div className="sm:col-span-5 relative">
            <span className="absolute left-3.5 top-3 text-purple-400 font-mono text-sm">@</span>
            <input
              type="text"
              value={handle2}
              onChange={(e) => setHandle2(e.target.value)}
              placeholder="Handle 2 (e.g. cz_binance)"
              className="w-full bg-dark-950 border border-white/10 rounded-xl py-2.5 pl-8 pr-3 text-white font-mono text-sm focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="sm:col-span-12 flex justify-center mt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-dark-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-dark-950" />
                  <span>Calculating Battle Metrics...</span>
                </>
              ) : (
                <>
                  <Scale className="h-4 w-4 text-dark-950" />
                  <span>Run Comparison</span>
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs mb-6 text-center">
            {error}
          </div>
        )}

        {/* Comparison Results Card */}
        {result && u1 && u2 && (
          <div className="space-y-6">
            {/* Fighter Avatars */}
            <div className="grid grid-cols-2 gap-4 border-b border-white/10 pb-6">
              {/* Fighter 1 */}
              <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-dark-950 border border-white/5 relative">
                {u1.sorsaScore.score >= u2.sorsaScore.score && (
                  <div className="absolute -top-3 px-3 py-0.5 rounded-full bg-cyan-500 text-dark-950 text-[10px] font-extrabold flex items-center gap-1 shadow-lg">
                    <Trophy className="h-3 w-3" />
                    <span>SCORE WINNER</span>
                  </div>
                )}
                <img
                  src={u1.profile.avatar || `https://unavatar.io/x/${u1.profile.screen_name}`}
                  alt=""
                  className="h-16 w-16 rounded-2xl object-cover border-2 border-cyan-400 mb-2 shadow-lg"
                />
                <h3 className="font-bold text-white text-base">{u1.profile.name}</h3>
                <span className="text-cyan-400 font-mono text-xs">@{u1.profile.screen_name}</span>
                <div className="mt-3 text-3xl font-extrabold font-mono text-cyan-400">
                  {u1.sorsaScore.score}
                  <span className="text-xs text-slate-400 font-normal ml-1">/1000</span>
                </div>
                <span className="text-[11px] text-slate-400 mt-1">{u1.sorsaScore.tier}</span>
              </div>

              {/* Fighter 2 */}
              <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-dark-950 border border-white/5 relative">
                {u2.sorsaScore.score >= u1.sorsaScore.score && (
                  <div className="absolute -top-3 px-3 py-0.5 rounded-full bg-purple-500 text-white text-[10px] font-extrabold flex items-center gap-1 shadow-lg">
                    <Trophy className="h-3 w-3" />
                    <span>SCORE WINNER</span>
                  </div>
                )}
                <img
                  src={u2.profile.avatar || `https://unavatar.io/x/${u2.profile.screen_name}`}
                  alt=""
                  className="h-16 w-16 rounded-2xl object-cover border-2 border-purple-400 mb-2 shadow-lg"
                />
                <h3 className="font-bold text-white text-base">{u2.profile.name}</h3>
                <span className="text-purple-400 font-mono text-xs">@{u2.profile.screen_name}</span>
                <div className="mt-3 text-3xl font-extrabold font-mono text-purple-400">
                  {u2.sorsaScore.score}
                  <span className="text-xs text-slate-400 font-normal ml-1">/1000</span>
                </div>
                <span className="text-[11px] text-slate-400 mt-1">{u2.sorsaScore.tier}</span>
              </div>
            </div>

            {/* Metrics Breakdown Table */}
            <div className="space-y-2.5 text-xs font-mono">
              {/* Followers */}
              <div className="grid grid-cols-12 items-center p-3 rounded-xl bg-dark-950 border border-white/5">
                <div className="col-span-4 text-right font-bold text-white">
                  {formatNumber(u1.profile.stats.followers)}
                </div>
                <div className="col-span-4 text-center text-slate-400 flex items-center justify-center gap-1">
                  <Users className="h-3.5 w-3.5 text-slate-500" />
                  <span>Followers</span>
                </div>
                <div className="col-span-4 text-left font-bold text-white">
                  {formatNumber(u2.profile.stats.followers)}
                </div>
              </div>

              {/* F/F Ratio */}
              <div className="grid grid-cols-12 items-center p-3 rounded-xl bg-dark-950 border border-white/5">
                <div className="col-span-4 text-right font-bold text-emerald-400">
                  {u1.profile.stats.ratio}:1
                </div>
                <div className="col-span-4 text-center text-slate-400">
                  Follower/Following Ratio
                </div>
                <div className="col-span-4 text-left font-bold text-emerald-400">
                  {u2.profile.stats.ratio}:1
                </div>
              </div>

              {/* Avg Views */}
              <div className="grid grid-cols-12 items-center p-3 rounded-xl bg-dark-950 border border-white/5">
                <div className="col-span-4 text-right font-bold text-cyan-400">
                  {(u1.engagement.avgViews || 0).toLocaleString()}
                </div>
                <div className="col-span-4 text-center text-slate-400 flex items-center justify-center gap-1">
                  <Eye className="h-3.5 w-3.5 text-cyan-500" />
                  <span>Avg Views/Post</span>
                </div>
                <div className="col-span-4 text-left font-bold text-cyan-400">
                  {(u2.engagement.avgViews || 0).toLocaleString()}
                </div>
              </div>

              {/* Engagement Rate */}
              <div className="grid grid-cols-12 items-center p-3 rounded-xl bg-dark-950 border border-white/5">
                <div className="col-span-4 text-right font-bold text-white">
                  {u1.engagement.engagementRate}
                </div>
                <div className="col-span-4 text-center text-slate-400">
                  Engagement Rate %
                </div>
                <div className="col-span-4 text-left font-bold text-white">
                  {u2.engagement.engagementRate}
                </div>
              </div>

              {/* VC Matches */}
              <div className="grid grid-cols-12 items-center p-3 rounded-xl bg-dark-950 border border-white/5">
                <div className="col-span-4 text-right font-bold text-purple-400">
                  {u1.vcKolRadar.totalMatches} connected
                </div>
                <div className="col-span-4 text-center text-slate-400">
                  VC / KOL Radar
                </div>
                <div className="col-span-4 text-left font-bold text-purple-400">
                  {u2.vcKolRadar.totalMatches} connected
                </div>
              </div>

              {/* Bot Authenticity */}
              <div className="grid grid-cols-12 items-center p-3 rounded-xl bg-dark-950 border border-white/5">
                <div className="col-span-4 text-right font-bold text-emerald-400">
                  {u1.botDetection.authenticityScore}% Real
                </div>
                <div className="col-span-4 text-center text-slate-400 flex items-center justify-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Audience Health</span>
                </div>
                <div className="col-span-4 text-left font-bold text-emerald-400">
                  {u2.botDetection.authenticityScore}% Real
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
