import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import ProfileHeader from './components/ProfileHeader';
import ScoreGauge from './components/ScoreGauge';
import BotRiskMeter from './components/BotRiskMeter';
import VcKolRadar from './components/VcKolRadar';
import CryptoAnalytics from './components/CryptoAnalytics';
import TweetsFeed from './components/TweetsFeed';
import CompareModal from './components/CompareModal';
import ExportModal from './components/ExportModal';
import { Award, Landmark, DollarSign, MessageSquare, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';

export default function App() {
  const [currentHandle, setCurrentHandle] = useState('vitalikbuterin');
  const [intel, setIntel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem('opensorsa_recent');
      return saved ? JSON.parse(saved) : ['vitalikbuterin', 'cz_binance', 'elonmusk'];
    } catch {
      return ['vitalikbuterin', 'cz_binance', 'elonmusk'];
    }
  });

  const fetchIntel = async (handle) => {
    const clean = handle.trim().replace(/^@+/, '').toLowerCase();
    if (!clean) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/user/${clean}/full-intel`);
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || `Could not retrieve data for @${clean}`);
      }

      setIntel(data.data);
      setCurrentHandle(clean);

      // Save to recent
      setRecentSearches((prev) => {
        const next = [clean, ...prev.filter((h) => h !== clean)].slice(0, 8);
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

  useEffect(() => {
    fetchIntel('vitalikbuterin');
  }, []);

  const handleClearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('opensorsa_recent');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Award },
    { id: 'radar', label: `Followed By (${intel?.vcKolRadar?.totalMatches || 0})`, icon: Landmark },
    { id: 'tweets', label: `Tweets (${intel?.tweets?.length || 0})`, icon: MessageSquare },
    { id: 'crypto', label: 'Crypto & Cashtags', icon: DollarSign },
    { id: 'bot', label: 'Audience Health', icon: ShieldCheck }
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-pink-500 selection:text-white">
      {/* Top Sorsa Navbar */}
      <Navbar
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        isDataLoaded={!!intel}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Bar */}
        <SearchBar
          onSearch={fetchIntel}
          loading={loading}
          currentUsername={currentHandle}
          recentSearches={recentSearches}
          onClearRecent={handleClearRecent}
        />

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="h-10 w-10 text-pink-400 animate-spin mb-4" />
            <h3 className="text-base font-bold text-white font-mono">
              Loading Sorsa Intelligence for @{currentHandle}...
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Calculating Score, scanning followers, and auditing timeline.
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="max-w-xl mx-auto my-12 bg-[#0b0e14] rounded-3xl p-8 border border-rose-500/30 text-center shadow-2xl">
            <AlertCircle className="h-10 w-10 text-rose-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">
              Query Error
            </h3>
            <p className="text-xs text-slate-400 mb-5">{error}</p>
            <button
              onClick={() => fetchIntel(currentHandle)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition-all"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loaded Data */}
        {!loading && !error && intel && (
          <div className="space-y-6">
            {/* 1. Sorsa Score Card (Exact replica from user's image) */}
            <ScoreGauge scoreData={intel.sorsaScore} />

            {/* 2. Profile Details & Stats */}
            <ProfileHeader
              profile={intel.profile}
              vcData={intel.vcKolRadar}
            />

            {/* 3. Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-white/5 pb-2 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-[#151924] text-white border border-white/10 shadow-md'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Views */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Followed By Top Accounts (VCs & KOLs) */}
                <VcKolRadar vcData={intel.vcKolRadar} />

                {/* Audience Authenticity & Bot Check */}
                <BotRiskMeter botData={intel.botDetection} />

                {/* Crypto & Virality */}
                <CryptoAnalytics
                  cryptoData={intel.cryptoIntelligence}
                  engagementData={intel.engagement}
                />
              </div>
            )}

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
        initialUser1={currentHandle}
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
        <span className="font-bold text-white">SORSA</span> FREE INTELLIGENCE &bull; 100% Free X / Twitter Analytics & Intelligence
      </footer>
    </div>
  );
}
