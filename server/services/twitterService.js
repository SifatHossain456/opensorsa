const axios = require('axios');
const cache = require('./cacheService');
const { calculateSorsaScore } = require('./scoreCalculator');
const { detectBotAndSybil } = require('./botDetector');
const { matchVcAndKols } = require('./vcKolRegistry');
const { analyzeCryptoContent, extractText } = require('./cryptoAnalyzer');

const BASE_URL = 'https://api.fxtwitter.com';
const USER_AGENT = 'OpenSorsa-Intelligence-Engine/1.0 (+https://github.com/opensorsa)';

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
  headers: {
    'User-Agent': USER_AGENT,
    'Accept': 'application/json'
  }
});

// Clean up usernames (strip @, trim whitespace, normalize lowercase)
function sanitizeUsername(input) {
  if (!input) return '';
  return input
    .trim()
    .replace(/^@+/, '')
    .replace(/^https?:\/\/(www\.)?(twitter|x)\.com\//, '')
    .split(/[/?#]/)[0]
    .trim();
}

/**
 * Fetch profile info for a handle with multi-tier fallback
 */
async function fetchUserProfile(username) {
  const cleanHandle = sanitizeUsername(username);
  if (!cleanHandle) throw new Error('Please enter a valid Twitter/X username');

  const cacheKey = `profile:${cleanHandle.toLowerCase()}`;
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
    // If 404, user doesn't exist
    if (err.response && err.response.status === 404) {
      throw new Error(`Twitter user @${cleanHandle} was not found. Please check spelling.`);
    }

    // Try fallback to vxtwitter / fixupx if primary had transient network error
    try {
      const fallbackRes = await axios.get(`https://api.vxtwitter.com/${cleanHandle}`, {
        timeout: 6000,
        headers: { 'User-Agent': USER_AGENT }
      });
      if (fallbackRes.data && (fallbackRes.data.user || fallbackRes.data.user_screen_name)) {
        const u = fallbackRes.data.user || fallbackRes.data;
        const user = {
          screen_name: u.screen_name || u.user_screen_name || cleanHandle,
          name: u.name || u.user_name || cleanHandle,
          id: u.id || '',
          followers: u.followers || u.user_followers_count || 0,
          following: u.following || u.user_friends_count || 0,
          likes: u.likes || u.user_favourites_count || 0,
          tweets: u.tweets || u.user_statuses_count || 0,
          media_count: u.media_count || 0,
          description: u.description || u.user_description || '',
          location: u.location || u.user_location || '',
          banner_url: u.banner_url || '',
          avatar_url: u.avatar_url || u.user_profile_image_url || '',
          joined: u.joined || '',
          verification: { verified: u.verified || false, type: u.verified_type || 'individual' }
        };
        cache.set(cacheKey, user, 10 * 60 * 1000);
        return user;
      }
    } catch (fallbackErr) {
      // Fallback also failed
    }

    throw new Error(`Could not fetch @${cleanHandle}. The account might be private, suspended, or rate-limited on X.`);
  }
}

/**
 * Fetch recent tweets/statuses safely
 */
async function fetchUserStatuses(username, count = 25) {
  const cleanHandle = sanitizeUsername(username);
  const cacheKey = `statuses:${cleanHandle.toLowerCase()}:${count}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const res = await client.get(`/2/profile/${cleanHandle}/statuses?count=${count}`);
    const results = (res.data && res.data.results) || [];
    cache.set(cacheKey, results, 5 * 60 * 1000);
    return results;
  } catch (err) {
    console.warn(`[OpenSorsa] Warning fetching statuses for @${cleanHandle}:`, err.message);
    return [];
  }
}

/**
 * Fetch following list safely
 */
async function fetchUserFollowing(username, count = 40) {
  const cleanHandle = sanitizeUsername(username);
  const cacheKey = `following:${cleanHandle.toLowerCase()}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const res = await client.get(`/2/profile/${cleanHandle}/following?count=${count}`);
    const results = (res.data && res.data.results) || [];
    cache.set(cacheKey, results, 15 * 60 * 1000);
    return results;
  } catch (err) {
    return [];
  }
}

/**
 * Fetch followers list safely
 */
async function fetchUserFollowers(username, count = 40) {
  const cleanHandle = sanitizeUsername(username);
  const cacheKey = `followers:${cleanHandle.toLowerCase()}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const res = await client.get(`/2/profile/${cleanHandle}/followers?count=${count}`);
    const results = (res.data && res.data.results) || [];
    cache.set(cacheKey, results, 15 * 60 * 1000);
    return results;
  } catch (err) {
    return [];
  }
}

/**
 * Full Intelligence Dossier: aggregates all features safely
 */
async function getFullIntelligence(username) {
  const cleanHandle = sanitizeUsername(username);
  if (!cleanHandle) throw new Error('Please enter a valid username');

  const cacheKey = `full_intel:${cleanHandle.toLowerCase()}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  // 1. Fetch Profile (Must succeed)
  const profile = await fetchUserProfile(cleanHandle);

  // 2. Fetch Statuses, Following & Followers with allSettled to prevent any partial failure from breaking the request
  const [statusesSettled, followingSettled, followersSettled] = await Promise.allSettled([
    fetchUserStatuses(cleanHandle, 30),
    fetchUserFollowing(cleanHandle, 50),
    fetchUserFollowers(cleanHandle, 50)
  ]);

  const statuses = statusesSettled.status === 'fulfilled' ? statusesSettled.value : [];
  const followingList = followingSettled.status === 'fulfilled' ? followingSettled.value : [];
  const followersList = followersSettled.status === 'fulfilled' ? followersSettled.value : [];

  // 3. Analyze Crypto & Cashtag mentions
  const cryptoAnalysis = analyzeCryptoContent(statuses);

  // 4. VC & KOL Radar (Match both following and followers against our registry)
  const followingVcMatches = matchVcAndKols(followingList);
  const followersVcMatches = matchVcAndKols(followersList);

  const uniqueVcMatchesMap = new Map();
  [...followingVcMatches, ...followersVcMatches].forEach(item => {
    uniqueVcMatchesMap.set(item.handle.toLowerCase(), item);
  });
  const allVcMatches = Array.from(uniqueVcMatchesMap.values());

  // 5. Compute OpenSorsa Score (Scaled 0 - 2000+)
  const scoreData = calculateSorsaScore(profile, statuses, allVcMatches, cryptoAnalysis.metrics);

  // 6. Compute Bot & Sybil Detection
  const botData = detectBotAndSybil(profile, statuses, cryptoAnalysis.metrics);

  // 7. Calculate Engagement Rate (ER%)
  let engagementRate = '0.00%';
  if (cryptoAnalysis.metrics.totalViews > 0) {
    const rawEr = ((cryptoAnalysis.metrics.totalLikes + cryptoAnalysis.metrics.totalReposts + cryptoAnalysis.metrics.totalReplies) / cryptoAnalysis.metrics.totalViews) * 100;
    engagementRate = `${rawEr.toFixed(2)}%`;
  } else if (profile.followers > 0 && cryptoAnalysis.metrics.totalAnalyzedTweets > 0) {
    const rawEr = ((cryptoAnalysis.metrics.avgLikes + cryptoAnalysis.metrics.avgReposts) / profile.followers) * 100;
    engagementRate = `${rawEr.toFixed(2)}%`;
  }

  // Format tweets safely
  const formattedTweets = (Array.isArray(statuses) ? statuses : []).map(t => ({
    id: t.id || String(Date.now()),
    url: t.url || `https://x.com/${profile.screen_name}/status/${t.id}`,
    text: extractText(t),
    createdAt: t.created_at || t.createdAt || '',
    views: Number(t.views) || 0,
    likes: Number(t.likes) || 0,
    reposts: Number(t.reposts || t.retweets) || 0,
    replies: Number(t.replies) || 0,
    bookmarks: Number(t.bookmarks) || 0,
    media: t.media || null,
    isReply: !!t.replying_to
  }));

  const intel = {
    username: cleanHandle,
    queriedAt: new Date().toISOString(),
    profile: {
      id: profile.id || '',
      name: profile.name || cleanHandle,
      screen_name: profile.screen_name || cleanHandle,
      url: profile.url || `https://x.com/${cleanHandle}`,
      avatar: profile.avatar_url || profile.avatar || '',
      banner: profile.banner_url || profile.banner || null,
      description: profile.description || '',
      location: profile.location || '',
      joined: profile.joined || null,
      website: profile.website || null,
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
    tweets: formattedTweets
  };

  cache.set(cacheKey, intel, 5 * 60 * 1000);
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
