import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

export default function BotRiskMeter({ botData }) {
  if (!botData) return null;

  const {
    authenticityScore = 95,
    riskLevel = 'Very Low',
    estimatedRealAudiencePct = 95,
    estimatedFakeAudiencePct = 5,
    flags = []
  } = botData;

  const getRiskColor = () => {
    if (authenticityScore >= 75) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (authenticityScore >= 50) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  return (
    <div className="bg-[#0b0e14] border border-white/5 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-base tracking-wide flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <span>Audience Health & Authenticity</span>
          </h3>

          <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRiskColor()}`}>
            {riskLevel}
          </div>
        </div>

        {/* Real vs Fake Progress Bar */}
        <div className="bg-[#12151f] border border-white/5 rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              <span className="text-slate-300">Real Audience:</span>
              <span className="text-emerald-400 font-bold font-mono">{estimatedRealAudiencePct}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-500"></span>
              <span className="text-slate-300">Suspicious:</span>
              <span className="text-rose-400 font-bold font-mono">{estimatedFakeAudiencePct}%</span>
            </div>
          </div>

          <div className="h-2.5 w-full bg-dark-950 rounded-full overflow-hidden flex border border-white/5">
            <div
              className="h-full bg-emerald-400 transition-all duration-700"
              style={{ width: `${estimatedRealAudiencePct}%` }}
            ></div>
            <div
              className="h-full bg-rose-500 transition-all duration-700"
              style={{ width: `${estimatedFakeAudiencePct}%` }}
            ></div>
          </div>
        </div>

        {/* Heuristic Flags List */}
        <div className="space-y-2">
          {flags.slice(0, 3).map((flag, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-[#12151f]/80 border border-white/5 flex items-start gap-2.5 text-xs"
            >
              {flag.type === 'positive' ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="font-semibold text-white text-[11px]">{flag.signal}</div>
                <div className="text-slate-400 text-[10px] leading-tight">{flag.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-[11px] text-slate-500 pt-3 border-t border-white/5 mt-4">
        Sybil detection algorithm checking bot patterns, churn, and follower reciprocity.
      </div>
    </div>
  );
}
