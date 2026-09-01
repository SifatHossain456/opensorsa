import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HomeHero from './components/HomeHero';
import ProfileHeader from './components/ProfileHeader';
import ScoreGauge from './components/ScoreGauge';
import BotRiskMeter from './components/BotRiskMeter';
import VcKolRadar from './components/VcKolRadar';
import CryptoAnalytics from './components/CryptoAnalytics';
import TweetsFeed from './components/TweetsFeed';
import CompareModal from './components/CompareModal';
import ExportModal from './components/ExportModal';
import { Award, Landmark, DollarSign, MessageSquare, ShieldCheck, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';

export default function App() {
  const [intel, setIntel] = useState(null);
  const [currentHandle, setCurrentHandle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('radar');
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem('opensorsa_recent');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const fetchIntel = async (handle) => {
    const clean = handle.trim().replace(/^@+/, '').toLowerCase();
    if (!clean) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/user/${encodeURIComponent(clean)}/full-intel`);
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || `Could not find account @${clean}. Please verify the handle.`);
      }

      setIntel(data.data);
      setCurrentHandle(clean);
      setActiveTab('radar');

      // Save to recent
      setRecentSearches((prev) => {
        const next = [clean, ...prev.filter((h) => h !== clean)].slice(0, 10);
        try {
          localStorage.setItem('opensorsa_recent', JSON.stringify(next));
        } catch {}
        return next;
      });
    } catch (err) {
      console.error('Fetch intel error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoHome = () => {
    setIntel(null);
    setCurrentHandle('');
    setError(null);
  };

  const tabs = [
    { id: 'radar', label: `Followed By (${intel?.vcKolRadar?.totalMatches || 0})`, icon: Landmark },
    { id: 'tweets', label: `Analyzed Posts (${intel?.tweets?.length || 0})`, icon: MessageSquare },
    { id: 'crypto', label: 'Crypto & Cashtags', icon: DollarSign },
    { id: 'bot', label: 'Audience Health', icon: ShieldCheck }
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-pink-500 selection:text-white">
      {/* Navbar */}
      <Navbar
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        isDataLoaded={!!intel}
        onSearch={fetchIntel}
        onGoHome={handleGoHome}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Loading Spinner */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-28">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 animate-spin p-[2px] mb-4">
              <div className="h-full w-full bg-[#07090e] rounded-[14px]"></div>
            </div>
            <h3 className="text-lg font-bold text-white font-mono">
              Analyzing @{currentHandle || 'account'}...
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Calculating Sorsa Influence Score, scanning VC network, and auditing tweets.
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="max-w-xl mx-auto my-16 bg-[#0b0e14] rounded-3xl p-8 border border-rose-500/30 text-center shadow-2xl">
            <AlertCircle className="h-10 w-10 text-rose-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">
              Account Not Found or Inaccessible
            </h3>
            <p className="text-xs text-slate-400 mb-6">{error}</p>
            <button
              onClick={handleGoHome}
              className="px-5 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-400 text-white font-semibold text-xs transition-all shadow-lg shadow-pink-500/20"
            >
              Back to Search
            </button>
          </div>
        )}

        {/* Home / Hero Landing State (When no user has been searched) */}
        {!intel && !loading && !error && (
          <HomeHero
            onSearch={fetchIntel}
            loading={loading}
            recentSearches={recentSearches}
          />
        )}

        {/* Search Results Report View */}
        {!loading && !error && intel && (
          <div className="space-y-6 animate-fadeIn">
            {/* Breadcrumb / Back button */}
            <div className="flex items-center justify-between">
              <button
                onClick={handleGoHome}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Search</span>
              </button>
              <div className="text-xs text-slate-500 font-mono">
                Queried: {new Date(intel.queriedAt).toLocaleTimeString()}
              </div>
            </div>

            {/* Row 1: Sorsa Score Card (Exact replica) & Bot Health Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <ScoreGauge scoreData={intel.sorsaScore} />
              </div>
              <div className="lg:col-span-5">
                <BotRiskMeter botData={intel.botDetection} />
              </div>
            </div>

            {/* Row 2: Profile Header Card */}
            <ProfileHeader
              profile={intel.profile}
            />

            {/* Row 3: Tab Selector */}
            <div className="flex items-center gap-2 border-b border-white/5 pb-2 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-[#151924] text-white border border-white/10 shadow-md font-bold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Panels */}
            {activeTab === 'radar' && (
              <VcKolRadar vcData={intel.vcKolRadar} />
            )}

            {activeTab === 'tweets' && (
              <TweetsFeed
                tweets={intel.tweets}
                authorName={intel.profile.name}
                authorHandle={intel.profile.screen_name}
                authorAvatar={intel.profile.avatar}
              />
            )}

            {activeTab === 'crypto' && (
              <CryptoAnalytics
                cryptoData={intel.cryptoIntelligence}
                engagementData={intel.engagement}
              />
            )}

            {activeTab === 'bot' && (
              <BotRiskMeter botData={intel.botDetection} />
            )}
          </div>
        )}
      </main>

      {/* Comparison Modal */}
      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        initialUser1={currentHandle || 'vitalikbuterin'}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        username={currentHandle}
        intelData={intel}
      />

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#07090e] py-6 mt-16 text-center text-xs text-slate-500 font-mono">
        <span className="font-bold text-white">SORSA</span> FREE TERMINAL &bull; 100% Free X / Twitter Intelligence
      </footer>
    </div>
  );
}
