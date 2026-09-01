import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function ScoreGauge({ scoreData }) {
  if (!scoreData) return null;

  const { score = 237, delta = '+8', tier = 'Tier 2. Noted', breakdown } = scoreData;

  // Scale: 100 to 2000
  const minScale = 100;
  const maxScale = 2000;
  const clampedScore = Math.max(minScale, Math.min(maxScale, score));
  const progressPercent = ((clampedScore - minScale) / (maxScale - minScale)) * 100;

  // Exact positions of tick marks on 100 to 2000 scale
  const ticks = [
    { value: 100, pos: 0 },
    { value: 500, pos: ((500 - 100) / (2000 - 100)) * 100 },
    { value: 1000, pos: ((1000 - 100) / (2000 - 100)) * 100 },
    { value: 1500, pos: ((1500 - 100) / (2000 - 100)) * 100 },
    { value: 2000, pos: 100 }
  ];

  // Dynamic thumb inner color based on progress along the gradient
  const getThumbColor = (pct) => {
    if (pct < 25) return '#e86a82'; // salmon / pink as in screenshot
    if (pct < 50) return '#db2777'; // magenta
    if (pct < 75) return '#38bdf8'; // sky blue
    return '#34d399'; // mint green
  };

  return (
    <div className="bg-[#0b0e14] border border-white/5 rounded-3xl p-6 sm:p-7 shadow-2xl relative">
      {/* Title */}
      <h3 className="text-white font-bold text-base tracking-wide mb-3">
        Score
      </h3>

      {/* Score Header Row: Big Number + Delta + Tier Pill Badge */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-baseline gap-2.5">
          <span className="text-5xl sm:text-6xl font-extrabold text-white tracking-tight font-sans">
            {score}
          </span>
          <div className="flex items-center text-emerald-400 font-bold text-lg font-sans">
            <span>{delta}</span>
            <ArrowUpRight className="h-5 w-5 stroke-[2.5] text-emerald-400 -ml-0.5" />
          </div>
        </div>

        {/* Tier Badge (matching exact screenshot styling) */}
        <div className="px-4 py-1.5 rounded-full bg-[#2a1329] border border-pink-500/20 text-[#f472b6] font-medium text-sm sm:text-base tracking-wide shadow-sm">
          {tier}
        </div>
      </div>

      {/* Horizontal Gradient Slider Track */}
      <div className="relative pt-2 pb-1">
        <div
          className="h-3.5 sm:h-4 w-full rounded-full relative"
          style={{
            background: 'linear-gradient(90deg, #f87171 0%, #fb7185 15%, #ec4899 35%, #c084fc 55%, #38bdf8 75%, #34d399 100%)'
          }}
        >
          {/* Thumb Pin (Circle with thick white border) */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-7 h-7 rounded-full border-[3.5px] border-white shadow-xl shadow-black/80 transition-all duration-700 pointer-events-none"
            style={{
              left: `calc(${progressPercent}% - 14px)`,
              backgroundColor: getThumbColor(progressPercent)
            }}
          ></div>
        </div>

        {/* Scale Ticks and Labels */}
        <div className="relative w-full h-8 mt-1.5 text-xs text-slate-500 font-mono select-none">
          {ticks.map((tick) => (
            <div
              key={tick.value}
              className="absolute -translate-x-1/2 flex flex-col items-center"
              style={{ left: `${tick.pos}%` }}
            >
              <div className="h-1.5 w-[1.5px] bg-slate-600 mb-1"></div>
              <span className="text-[11px] text-slate-400">{tick.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Score Components Breakdown Footer */}
      {breakdown && (
        <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {Object.entries(breakdown).map(([key, item]) => (
            <div key={key} className="bg-dark-900/60 p-2.5 rounded-xl border border-white/5">
              <div className="text-slate-400 text-[11px] truncate">{item.label}</div>
              <div className="text-white font-bold font-mono text-sm mt-0.5">
                {item.points} <span className="text-slate-400 font-normal text-[10px]">/{item.max}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
