import React from 'react';
import { Download, FileJson, FileSpreadsheet, Printer, X, Check } from 'lucide-react';

export default function ExportModal({ isOpen, onClose, username, intelData }) {
  if (!isOpen || !username) return null;

  const handleDownload = (format) => {
    const url = `/api/export/${encodeURIComponent(username)}?format=${format}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = `${username}_opensorsa_report.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-dark-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
            <Download className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              Export Intelligence Dossier
            </h2>
            <p className="text-xs text-slate-400">
              Download intelligence report for @{username} for 100% free.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {/* JSON Option */}
          <button
            onClick={() => handleDownload('json')}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-dark-950 border border-white/5 hover:border-cyan-500/40 hover:bg-cyan-500/5 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                <FileJson className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold text-white text-sm group-hover:text-cyan-400">
                  Full JSON Dossier
                </div>
                <div className="text-xs text-slate-400">Complete raw data and analytics payload</div>
              </div>
            </div>
            <Download className="h-4 w-4 text-slate-500 group-hover:text-cyan-400" />
          </button>

          {/* CSV Option */}
          <button
            onClick={() => handleDownload('csv')}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-dark-950 border border-white/5 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold text-white text-sm group-hover:text-emerald-400">
                  Excel / CSV Summary
                </div>
                <div className="text-xs text-slate-400">Key metrics, Sorsa Score, and Bot risk</div>
              </div>
            </div>
            <Download className="h-4 w-4 text-slate-500 group-hover:text-emerald-400" />
          </button>

          {/* Print / PDF Option */}
          <button
            onClick={handlePrint}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-dark-950 border border-white/5 hover:border-purple-500/40 hover:bg-purple-500/5 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                <Printer className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold text-white text-sm group-hover:text-purple-400">
                  Print or Save as PDF
                </div>
                <div className="text-xs text-slate-400">Formatted executive summary report</div>
              </div>
            </div>
            <Printer className="h-4 w-4 text-slate-500 group-hover:text-purple-400" />
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-white/5 text-center text-[11px] text-slate-500">
          ✨ Sorsa / TweetScout charges \$100+ for CSV exports — Always free on OpenSorsa.
        </div>
      </div>
    </div>
  );
}
