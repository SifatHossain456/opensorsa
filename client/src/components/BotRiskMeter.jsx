import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export default function BotRiskMeter({ botData }) {
  if (!botData) return null;

  const {
    authenticityScore,
    riskLevel,
    badgeColor,
    estimatedRealAudiencePct,
    estimatedFakeAudiencePct,
    flags
  } = botData;

  const getRiskIcon = () => {
    if (authenticityScore >= 75) return <ShieldCheck className="h-5 w-5 text-emerald-400" />;
    if (authenticityScore >= 50) return <AlertTriangle className="h-5 w-5 text-amber-400" />;
    return <ShieldAlert className="h-5 w-5 text-rose-400" />;
  };

  const getBadgeClass = () => {
    if (badgeColor === 'emerald') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    if (badgeColor === 'blue') return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    if (badgeColor === 'yellow' || badgeColor === 'amber') return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
  };

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              {getRiskIcon()}
              <span>Audience Authenticity & Bot Risk</span>
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-purple-500/15 text-purple-300 border border-purple-500/30 rounded-md">
              Sybil Detection
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit for bot-inflated followers, follow-churn farms, and synthetic engagement.
          </p>
        </div>

        <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getBadgeClass()}`}>
          {riskLevel}
        </div>
      </div>

      {/* Progress Bar & Percentages */}
      <div className="bg-dark-900/90 border border-white/5 rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between text-sm mb-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
            <span className="text-slate-300 font-medium">Estimated Real Audience</span>
            <span className="text-emerald-400 font-bold font-mono text-base">
              {estimatedRealAudiencePct}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500"></span>
            <span className="text-slate-300 font-medium">Bot / Inactive</span>
            <span className="text-rose-400 font-bold font-mono text-base">
              {estimatedFakeAudiencePct}%
            </span>
          </div>
        </div>

        {/* Stacked Bar */}
        <div className="h-3 w-full bg-dark-950 rounded-full overflow-hidden flex border border-white/10">
          <div
            className="h-full bg-emerald-400 transition-all duration-700"
            style={{ width: `${estimatedRealAudiencePct}%` }}
            title={`Real: ${estimatedRealAudiencePct}%`}
          ></div>
          <div
            className="h-full bg-rose-500 transition-all duration-700"
            style={{ width: `${estimatedFakeAudiencePct}%` }}
            title={`Suspicious: ${estimatedFakeAudiencePct}%`}
          ></div>
        </div>
      </div>

      {/* Signals / Flags */}
      <div>
        <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">
          Detected Heuristics & Signals ({flags.length})
        </h3>

        <div className="space-y-2.5">
          {flags.map((flag, idx) => {
            let flagIcon = <Info className="h-4 w-4 text-cyan-400 shrink-0" />;
            let flagBorder = 'border-cyan-500/20 bg-cyan-500/5';
            if (flag.type === 'positive') {
              flagIcon = <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />;
              flagBorder = 'border-emerald-500/20 bg-emerald-500/5';
            } else if (flag.type === 'warning' || flag.type === 'high') {
              flagIcon = <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />;
              flagBorder = 'border-amber-500/20 bg-amber-500/5';
            } else if (flag.type === 'critical') {
              flagIcon = <ShieldAlert className="h-4 w-4 text-rose-400 shrink-0" />;
              flagBorder = 'border-rose-500/20 bg-rose-500/5';
            }

            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border ${flagBorder} flex items-start gap-3 text-xs`}
              >
                {flagIcon}
                <div>
                  <div className="font-semibold text-white">{flag.signal}</div>
                  <div className="text-slate-400 mt-0.5 leading-relaxed">{flag.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
