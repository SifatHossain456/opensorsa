const axios = require('axios');
const cache = require('./cacheService');
const { calculateSorsaScore } = require('./scoreCalculator');
const { detectBotAndSybil } = require('./botDetector');
const { matchVcAndKols } = require('./vcKolRegistry');
const { analyzeCryptoContent } = require('./cryptoAnalyzer');

const BASE_URL = 'https://api.fxtwitter.com';
const USER_AGENT = 'OpenSorsa-Intelligence-Engine/1.0 (+https://github.com/opensorsa)';

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 12000,
  headers: {
    'User-Agent': USER_AGENT,
    'Accept': 'application/json'
  }
});

// Clean up usernames (strip @, trim whitespace, normalize lowercase)
function sanitizeUsername(input) {
  if (!input) return '';
  return input.trim().replace(/^@+/, '').replace(/^https?:\/\/(www\.)?(twitter|x)\.com\//, '').split(/[/?#]/)[0].toLowerCase();
}

/**
 * Fetch profile info for a handle
 */
async function fetchUserProfile(username) {
  const cleanHandle = sanitizeUsername(username);
  if (!cleanHandle) throw new Error('Invalid or empty username provided');

  const cacheKey = `profile:${cleanHandle}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const res = await client.get(`/${cleanHandle}`);
    if (res.data && res.data.user) {
      const user = res.data.user;
      cache.set(cacheKey, user, 10 * 60 * 1000); // 10m cache
      return user;
    }
    throw new Error('User not found or account is private');
  } catch (err) {
    if (err.response && err.response.status === 404) {
      throw new Error(`Twitter user @${cleanHandle} not found`);
    }
    throw new Error(`Failed to fetch user @${cleanHandle}: ${err.message}`);
  }
}

/**
 * Fetch recent tweets/statuses
 */
async function fetchUserStatuses(username, count = 25) {
  const cleanHandle = sanitizeUsername(username);
  const cacheKey = `statuses:${cleanHandle}:${count}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const res = await client.get(`/2/profile/${cleanHandle}/statuses?count=${count}`);
    const results = (res.data && res.data.results) || [];
    cache.set(cacheKey, results, 5 * 60 * 1000); // 5m cache
    return results;
  } catch (err) {
    console.warn(`[OpenSorsa] Warning fetching statuses for @${cleanHandle}:`, err.message);
    return []; // Return empty array if error
  }
}

/**
 * Fetch following list for network mapping
 */
async function fetchUserFollowing(username, count = 40) {
  const cleanHandle = sanitizeUsername(username);
  const cacheKey = `following:${cleanHandle}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const res = await client.get(`/2/profile/${cleanHandle}/following?count=${count}`);
    const results = (res.data && res.data.results) || [];
    cache.set(cacheKey, results, 15 * 60 * 1000);
    return results;
  } catch (err) {
    console.warn(`[OpenSorsa] Warning fetching following for @${cleanHandle}:`, err.message);
    return [];
  }
}

/**
 * Fetch followers list
 */
async function fetchUserFollowers(username, count = 40) {
  const cleanHandle = sanitizeUsername(username);
  const cacheKey = `followers:${cleanHandle}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const res = await client.get(`/2/profile/${cleanHandle}/followers?count=${count}`);
    const results = (res.data && res.data.results) || [];
    cache.set(cacheKey, results, 15 * 60 * 1000);
    return results;
  } catch (err) {
    console.warn(`[OpenSorsa] Warning fetching followers for @${cleanHandle}:`, err.message);
    return [];
  }
}

/**
 * Full Intelligence Dossier: aggregates all features into a single response
 * (Equivalents of Sorsa / TweetScout Premium)
 */
async function getFullIntelligence(username) {
  const cleanHandle = sanitizeUsername(username);
  const cacheKey = `full_intel:${cleanHandle}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  // 1. Fetch Profile
  const profile = await fetchUserProfile(cleanHandle);

  // 2. Fetch Statuses, Following & Followers in parallel
  const [statuses, followingList, followersList] = await Promise.all([
    fetchUserStatuses(cleanHandle, 30),
    fetchUserFollowing(cleanHandle, 50),
    fetchUserFollowers(cleanHandle, 50)
  ]);

  // 3. Analyze Crypto & Cashtag mentions
  const cryptoAnalysis = analyzeCryptoContent(statuses);

  // 4. VC & KOL Radar (Match both following and followers against our registry)
  const followingVcMatches = matchVcAndKols(followingList);
  const followersVcMatches = matchVcAndKols(followersList);

  // Deduplicate VC / KOL matches
  const uniqueVcMatchesMap = new Map();
  [...followingVcMatches, ...followersVcMatches].forEach(item => {
    uniqueVcMatchesMap.set(item.handle.toLowerCase(), item);
  });
  const allVcMatches = Array.from(uniqueVcMatchesMap.values());

  // 5. Compute OpenSorsa Score (0 - 1000)
  const scoreData = calculateSorsaScore(profile, statuses, allVcMatches, cryptoAnalysis.metrics);

  // 6. Compute Bot & Sybil Detection
  const botData = detectBotAndSybil(profile, statuses, cryptoAnalysis.metrics);

  // 7. Calculate Engagement Rate (ER%)
  // Standard formula: (Total Likes + Total Retweets + Total Replies) / (Total Views or Followers) * 100
  let engagementRate = '0.00%';
  if (cryptoAnalysis.metrics.totalViews > 0) {
    const rawEr = ((cryptoAnalysis.metrics.totalLikes + cryptoAnalysis.metrics.totalReposts + cryptoAnalysis.metrics.totalReplies) / cryptoAnalysis.metrics.totalViews) * 100;
    engagementRate = `${rawEr.toFixed(2)}%`;
  } else if (profile.followers > 0 && cryptoAnalysis.metrics.totalAnalyzedTweets > 0) {
    const rawEr = ((cryptoAnalysis.metrics.avgLikes + cryptoAnalysis.metrics.avgReposts) / profile.followers) * 100;
    engagementRate = `${rawEr.toFixed(2)}%`;
  }

  // Assemble comprehensive intel response
  const intel = {
    username: cleanHandle,
    queriedAt: new Date().toISOString(),
    profile: {
      id: profile.id,
      name: profile.name,
      screen_name: profile.screen_name,
      url: profile.url,
      avatar: profile.avatar_url,
      banner: profile.banner_url,
      description: profile.description,
      location: profile.location || 'Global',
      joined: profile.joined,
      website: profile.website,
      verified: profile.verification?.verified || false,
      verificationType: profile.verification?.type || 'none',
      stats: {
        followers: Number(profile.followers) || 0,
        following: Number(profile.following) || 0,
        tweets: Number(profile.tweets) || 0,
        likes: Number(profile.likes) || 0,
        mediaCount: Number(profile.media_count) || 0,
        ratio: ((Number(profile.followers) || 0) / Math.max(1, Number(profile.following) || 1)).toFixed(1)
      }
    },
    sorsaScore: scoreData,
    botDetection: botData,
    engagement: {
      engagementRate,
      ...cryptoAnalysis.metrics
    },
    vcKolRadar: {
      totalMatches: allVcMatches.length,
      detectedFunds: allVcMatches.filter(m => m.type === 'VC'),
      detectedKols: allVcMatches.filter(m => m.type !== 'VC'),
      matches: allVcMatches
    },
    cryptoIntelligence: {
      sentiment: cryptoAnalysis.sentiment,
      cashtags: cryptoAnalysis.cashtags,
      hashtags: cryptoAnalysis.hashtags,
      topKeywords: cryptoAnalysis.topKeywords,
      contractAddresses: cryptoAnalysis.contractAddresses
    },
    tweets: statuses.map(t => ({
      id: t.id,
      url: t.url,
      text: t.text,
      createdAt: t.created_at,
      views: Number(t.views) || 0,
      likes: Number(t.likes) || 0,
      reposts: Number(t.reposts || t.retweets) || 0,
      replies: Number(t.replies) || 0,
      bookmarks: Number(t.bookmarks) || 0,
      media: t.media || null,
      isReply: !!t.replying_to
    }))
  };

  cache.set(cacheKey, intel, 5 * 60 * 1000); // 5 minutes cache
  return intel;
}

module.exports = {
  sanitizeUsername,
  fetchUserProfile,
  fetchUserStatuses,
  fetchUserFollowing,
  fetchUserFollowers,
  getFullIntelligence
};
