// Crypto Cashtags, Token Addresses, Sentiment & Keyword Extractor

const BULLISH_WORDS = ['bullish', 'pump', 'moon', 'gem', 'accumulate', 'buying', 'ath', 'breakout', 'long', 'up', 'surge', 'undervalued', 'alpha'];
const BEARISH_WORDS = ['bearish', 'dump', 'scam', 'rug', 'sell', 'crash', 'down', 'fud', 'short', 'overvalued', 'hack', 'exploit', 'drop'];

function analyzeCryptoContent(tweets = []) {
  const cashtagCount = {};
  const contractAddresses = new Set();
  const hashtagCount = {};
  const wordFrequency = {};
  let totalLikes = 0;
  let totalViews = 0;
  let totalReposts = 0;
  let totalReplies = 0;
  let bullishPoints = 0;
  let bearishPoints = 0;

  // Regex patterns
  const cashtagRegex = /\$([A-Za-z0-9]{2,10})\b/g;
  const hashtagRegex = /#([A-Za-z0-9_]{2,30})\b/g;
  const evmAddressRegex = /\b(0x[a-fA-F0-9]{40})\b/g;
  const solanaAddressRegex = /\b([1-9A-HJ-NP-Za-km-z]{32,44})\b/g;

  tweets.forEach(tweet => {
    const text = tweet.text || tweet.raw_text || '';
    const lower = text.toLowerCase();

    // Engagement aggregation
    const views = Number(tweet.views) || 0;
    const likes = Number(tweet.likes) || 0;
    const reposts = Number(tweet.reposts || tweet.retweets) || 0;
    const replies = Number(tweet.replies) || 0;

    totalLikes += likes;
    totalViews += views;
    totalReposts += reposts;
    totalReplies += replies;

    // Cashtag extraction
    let match;
    while ((match = cashtagRegex.exec(text)) !== null) {
      const sym = match[1].toUpperCase();
      // Filter out non-crypto numbers
      if (!/^\d+$/.test(sym)) {
        cashtagCount[sym] = (cashtagCount[sym] || 0) + 1;
      }
    }

    // Hashtag extraction
    while ((match = hashtagRegex.exec(text)) !== null) {
      const tag = match[1].toLowerCase();
      hashtagCount[tag] = (hashtagCount[tag] || 0) + 1;
    }

    // EVM Addresses
    while ((match = evmAddressRegex.exec(text)) !== null) {
      contractAddresses.add({
        address: match[1],
        chain: 'EVM (Ethereum/Base/BSC/Arbitrum)',
        tweetId: tweet.id
      });
    }

    // Sentiment heuristic
    BULLISH_WORDS.forEach(w => {
      if (lower.includes(w)) bullishPoints++;
    });
    BEARISH_WORDS.forEach(w => {
      if (lower.includes(w)) bearishPoints++;
    });

    // Keyword tokens
    const words = lower.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/);
    words.forEach(w => {
      if (w.length > 3 && !['https', 'with', 'that', 'this', 'from', 'have', 'your', 'about', 'just', 'more', 'what'].includes(w)) {
        wordFrequency[w] = (wordFrequency[w] || 0) + 1;
      }
    });
  });

  // Sort cashtags
  const sortedCashtags = Object.entries(cashtagCount)
    .sort((a, b) => b[1] - a[1])
    .map(([symbol, count]) => ({ symbol, count }));

  // Sort hashtags
  const sortedHashtags = Object.entries(hashtagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([tag, count]) => ({ tag, count }));

  // Top keywords
  const topKeywords = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word, count]) => ({ word, count }));

  // Sentiment ratio
  let sentiment = 'Neutral';
  const totalSentimentTokens = bullishPoints + bearishPoints;
  if (totalSentimentTokens > 0) {
    const bullRatio = bullishPoints / totalSentimentTokens;
    if (bullRatio >= 0.65) sentiment = 'Strongly Bullish';
    else if (bullRatio >= 0.55) sentiment = 'Slightly Bullish';
    else if (bullRatio <= 0.35) sentiment = 'Strongly Bearish';
    else if (bullRatio <= 0.45) sentiment = 'Slightly Bearish';
  }

  const tweetCount = Math.max(tweets.length, 1);
  const avgLikes = Math.round(totalLikes / tweetCount);
  const avgViews = Math.round(totalViews / tweetCount);
  const avgReposts = Math.round(totalReposts / tweetCount);
  const avgReplies = Math.round(totalReplies / tweetCount);

  return {
    cashtags: sortedCashtags,
    hashtags: sortedHashtags,
    topKeywords,
    contractAddresses: Array.from(contractAddresses),
    sentiment: {
      verdict: sentiment,
      bullishSignals: bullishPoints,
      bearishSignals: bearishPoints
    },
    metrics: {
      totalAnalyzedTweets: tweets.length,
      totalLikes,
      totalViews,
      totalReposts,
      totalReplies,
      avgLikes,
      avgViews,
      avgReposts,
      avgReplies
    }
  };
}

module.exports = {
  analyzeCryptoContent
};
