import React from 'react';
import { BadgeCheck, Calendar, MapPin, Link as LinkIcon, ExternalLink, Users, MessageSquare, Landmark, Crown } from 'lucide-react';

function formatNumber(num) {
  if (num === undefined || num === null) return '0';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return num.toLocaleString();
}

function getAccountAge(joinedStr) {
  if (!joinedStr) return null;
  const joinDate = new Date(joinedStr);
  const diffMonths = (new Date().getFullYear() - joinDate.getFullYear()) * 12 + (new Date().getMonth() - joinDate.getMonth());
  const years = Math.floor(diffMonths / 12);
  const months = diffMonths % 12;
  if (years > 0) return `${years}y ${months}m ago`;
  return `${months}m ago`;
}

export default function ProfileHeader({ profile, vcData }) {
  if (!profile) return null;

  const joinFormatted = profile.joined ? new Date(profile.joined).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : null;
  const accountAge = getAccountAge(profile.joined);
  const vcCount = vcData?.detectedFunds?.length || 0;
  const kolCount = vcData?.detectedKols?.length || 0;

  return (
    <div className="w-full bg-[#0b0e14] border border-white/5 rounded-3xl overflow-hidden shadow-2xl mb-6">
      {/* Banner */}
      <div className="relative h-40 sm:h-52 w-full bg-[#11141c] overflow-hidden">
        {profile.banner ? (
          <img
            src={profile.banner}
            alt="Profile Banner"
            className="w-full h-full object-cover opacity-80"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-[#111522] via-[#0d101a] to-[#1a1226]"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-transparent to-transparent"></div>
      </div>

      {/* Main Info Section */}
      <div className="px-6 sm:px-8 pb-7 pt-0 relative">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-5">
          {/* Avatar & Identifiers */}
          <div className="flex items-end gap-4">
            <div className="relative">
              <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-2xl p-1 bg-[#0b0e14] border-2 border-white/10 shadow-2xl overflow-hidden">
                <img
                  src={profile.avatar || `https://unavatar.io/x/${profile.screen_name}`}
                  alt={profile.name}
                  className="w-full h-full object-cover rounded-[12px] bg-[#141824]"
                  onError={(e) => {
                    e.target.src = `https://api.dicebear.com/7.x/identicon/svg?seed=${profile.screen_name}`;
                  }}
                />
              </div>
              {profile.verified && (
                <div className="absolute -bottom-1 -right-1 bg-cyan-400 text-dark-950 p-1 rounded-full shadow-lg" title="Verified Account">
                  <BadgeCheck className="h-4 w-4 fill-dark-950 text-cyan-400" />
                </div>
              )}
            </div>

            <div className="pb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {profile.name}
                </h1>
                {profile.verified && (
                  <span className="px-2.5 py-0.5 text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full flex items-center gap-1">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    Verified
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-slate-400 font-mono text-sm sm:text-base">
                  @{profile.screen_name}
                </span>
                <a
                  href={`https://x.com/${profile.screen_name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-cyan-400 transition-colors"
                  title="Open on X (Twitter)"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Direct External Link */}
          <div className="self-start sm:self-end">
            <a
              href={`https://x.com/${profile.screen_name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-[#171b26] hover:bg-[#202534] border border-white/10 rounded-xl text-xs font-semibold text-white transition-all shadow-md"
            >
              <span>View Profile on X</span>
              <ExternalLink className="h-3.5 w-3.5 text-slate-300" />
            </a>
          </div>
        </div>

        {/* Bio */}
        {profile.description && (
          <p className="text-slate-300 text-sm leading-relaxed max-w-4xl whitespace-pre-line mb-5 font-normal">
            {profile.description}
          </p>
        )}

        {/* Metadata Details */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-400 border-t border-white/5 pt-3 mb-5">
          {profile.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              <span>{profile.location}</span>
            </div>
          )}
          {joinFormatted && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>Joined {joinFormatted} {accountAge && <span className="text-slate-400">({accountAge})</span>}</span>
            </div>
          )}
          {profile.website && (
            <div className="flex items-center gap-1.5">
              <LinkIcon className="h-3.5 w-3.5 text-slate-400" />
              <a
                href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline"
              >
                {profile.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-[#12151f] border border-white/5 p-3.5 rounded-2xl">
            <div className="text-slate-400 text-xs mb-1">Followers</div>
            <div className="text-xl sm:text-2xl font-extrabold text-white font-sans">
              {formatNumber(profile.stats.followers)}
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              {profile.stats.followers.toLocaleString()}
            </div>
          </div>

          <div className="bg-[#12151f] border border-white/5 p-3.5 rounded-2xl">
            <div className="text-slate-400 text-xs mb-1">Following</div>
            <div className="text-xl sm:text-2xl font-extrabold text-white font-sans">
              {formatNumber(profile.stats.following)}
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              {profile.stats.following.toLocaleString()}
            </div>
          </div>

          <div className="bg-[#12151f] border border-white/5 p-3.5 rounded-2xl">
            <div className="text-slate-400 text-xs mb-1">Ratio (F/F)</div>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-sans">
              {profile.stats.ratio}:1
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              Follower authority
            </div>
          </div>

          <div className="bg-[#12151f] border border-white/5 p-3.5 rounded-2xl">
            <div className="text-slate-400 text-xs mb-1">Total Tweets</div>
            <div className="text-xl sm:text-2xl font-extrabold text-white font-sans">
              {formatNumber(profile.stats.tweets)}
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              Published posts
            </div>
          </div>

          <div className="bg-[#12151f] border border-white/5 p-3.5 rounded-2xl">
            <div className="text-slate-400 text-xs mb-1">Followed by VCs</div>
            <div className="text-xl sm:text-2xl font-extrabold text-purple-400 font-sans">
              {vcCount}
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              Institutional funds
            </div>
          </div>

          <div className="bg-[#12151f] border border-white/5 p-3.5 rounded-2xl">
            <div className="text-slate-400 text-xs mb-1">Followed by KOLs</div>
            <div className="text-xl sm:text-2xl font-extrabold text-pink-400 font-sans">
              {kolCount}
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              Top industry figures
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
