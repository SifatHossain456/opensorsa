import React from 'react';
import { BadgeCheck, Calendar, MapPin, Link as LinkIcon, ExternalLink, Users, MessageSquare, ArrowUpRight } from 'lucide-react';

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

export default function ProfileHeader({ profile }) {
  if (!profile) return null;

  const joinFormatted = profile.joined ? new Date(profile.joined).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : null;
  const accountAge = getAccountAge(profile.joined);

  return (
    <div className="w-full bg-[#0b0e14] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
      {/* Banner */}
      <div className="relative h-32 sm:h-44 w-full bg-[#11141c] overflow-hidden">
        {profile.banner ? (
          <img
            src={profile.banner}
            alt="Banner"
            className="w-full h-full object-cover opacity-75"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-[#111522] via-[#0d101a] to-[#1a1226]"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-transparent to-transparent"></div>
      </div>

      {/* Main Info Section */}
      <div className="px-6 sm:px-8 pb-6 pt-0 relative">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 sm:-mt-16 gap-4 mb-4">
          {/* Avatar & Identifiers */}
          <div className="flex items-end gap-4">
            <div className="relative shrink-0">
              <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl p-0.5 bg-[#0b0e14] border-2 border-white/10 shadow-2xl overflow-hidden">
                <img
                  src={profile.avatar || `https://unavatar.io/x/${profile.screen_name}`}
                  alt={profile.name}
                  className="w-full h-full object-cover rounded-[14px] bg-[#141824]"
                  onError={(e) => {
                    e.target.src = `https://api.dicebear.com/7.x/identicon/svg?seed=${profile.screen_name}`;
                  }}
                />
              </div>
              {profile.verified && (
                <div className="absolute -bottom-1 -right-1 bg-cyan-400 text-dark-950 p-1 rounded-full shadow-lg" title="Verified">
                  <BadgeCheck className="h-4 w-4 fill-dark-950 text-cyan-400" />
                </div>
              )}
            </div>

            <div className="pb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  {profile.name}
                </h1>
                {profile.verified && (
                  <span className="px-2 py-0.5 text-[11px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full flex items-center gap-1">
                    Verified
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-slate-400 font-mono text-xs sm:text-sm">
                  @{profile.screen_name}
                </span>
                <a
                  href={`https://x.com/${profile.screen_name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-cyan-400 transition-colors"
                  title="View on X"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* External Link Button */}
          <div className="self-start sm:self-end">
            <a
              href={`https://x.com/${profile.screen_name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#171b26] hover:bg-[#202534] border border-white/10 rounded-xl text-xs font-semibold text-white transition-all shadow-md"
            >
              <span>X.com Profile</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
            </a>
          </div>
        </div>

        {/* Bio */}
        {profile.description && (
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl whitespace-pre-line mb-4 font-normal">
            {profile.description}
          </p>
        )}

        {/* Metadata Details */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 border-t border-white/5 pt-3 mb-4">
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

        {/* 4 Clean Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/5">
          <div className="bg-[#12151f] border border-white/5 p-3 rounded-2xl">
            <div className="text-slate-400 text-xs">Followers</div>
            <div className="text-lg sm:text-xl font-extrabold text-white font-sans mt-0.5">
              {formatNumber(profile.stats.followers)}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              {profile.stats.followers.toLocaleString()}
            </div>
          </div>

          <div className="bg-[#12151f] border border-white/5 p-3 rounded-2xl">
            <div className="text-slate-400 text-xs">Following</div>
            <div className="text-lg sm:text-xl font-extrabold text-white font-sans mt-0.5">
              {formatNumber(profile.stats.following)}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              {profile.stats.following.toLocaleString()}
            </div>
          </div>

          <div className="bg-[#12151f] border border-white/5 p-3 rounded-2xl">
            <div className="text-slate-400 text-xs">Follower/Following Ratio</div>
            <div className="text-lg sm:text-xl font-extrabold text-emerald-400 font-sans mt-0.5">
              {profile.stats.ratio}:1
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              {Number(profile.stats.ratio) > 5 ? 'High Influence' : 'Reciprocal'}
            </div>
          </div>

          <div className="bg-[#12151f] border border-white/5 p-3 rounded-2xl">
            <div className="text-slate-400 text-xs">Published Posts</div>
            <div className="text-lg sm:text-xl font-extrabold text-white font-sans mt-0.5">
              {formatNumber(profile.stats.tweets)}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Lifetime tweets
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
