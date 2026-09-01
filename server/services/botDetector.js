// Advanced Bot, Sybil & Fake Audience Detection Engine
// Inspects heuristic signals, patterns, engagement ratios, and handle abnormalities

function detectBotAndSybil(user = {}, tweets = [], metrics = {}) {
  const flags = [];
  let authenticityScore = 100;

  const followers = Number(user.followers) || 0;
  const following = Number(user.following) || 0;
  const tweetCount = Number(user.tweets) || 0;
  const screenName = user.screen_name || '';
  const description = user.description || '';
  const avatarUrl = user.avatar_url || '';
  const isVerified = user.verification?.verified || false;

  // 1. Handle randomness / number spam test
  const trailingDigitsMatch = screenName.match(/\d+$/);
  if (trailingDigitsMatch && trailingDigitsMatch[0].length >= 5) {
    authenticityScore -= 20;
    flags.push({
      type: 'warning',
      signal: 'Automated Username Pattern',
      description: `Handle ends with ${trailingDigitsMatch[0].length} consecutive random numbers, common in bot farms.`
    });
  }

  // 2. Default / Missing avatar test
  if (!avatarUrl || avatarUrl.includes('default_profile')) {
    authenticityScore -= 25;
    flags.push({
      type: 'critical',
      signal: 'Default Profile Picture',
      description: 'Account does not have a customized profile image.'
    });
  }

  // 3. Follower to Following Ratio anomaly
  if (following > 2000 && followers < 100) {
    authenticityScore -= 30;
    flags.push({
      type: 'critical',
      signal: 'Follow/Unfollow Churn Ratio',
      description: `Following ${following} users with only ${followers} followers (Ratio < 0.05).`
    });
  } else if (following > 4000 && followers < 1000) {
    authenticityScore -= 15;
    flags.push({
      type: 'warning',
      signal: 'Mass Follow Spammer Behavior',
      description: 'Aggressive following behavior exceeding normal human engagement thresholds.'
    });
  }

  // 4. Ghost / Bought Follower Discrepancy (High followers, dead engagement)
  if (followers >= 50000 && metrics.avgLikes !== undefined) {
    const likeRatio = (metrics.avgLikes / followers) * 100;
    if (likeRatio < 0.005) {
      authenticityScore -= 25;
      flags.push({
        type: 'high',
        signal: 'Extremely Low Engagement Ratio',
        description: `Average likes (${metrics.avgLikes}) are less than 0.005% of follower count (${followers}), indicating inactive/bought followers.`
      });
    }
  }

  // 5. Bio Analysis
  if (!description || description.trim().length < 5) {
    authenticityScore -= 10;
    flags.push({
      type: 'info',
      signal: 'Empty or Minimal Bio',
      description: 'Account profile lacks bio information.'
    });
  }

  // 6. Verification boost
  if (isVerified) {
    authenticityScore = Math.min(100, authenticityScore + 10);
    flags.push({
      type: 'positive',
      signal: 'Verified Identity',
      description: `Verified ${user.verification?.type || 'X'} account.`
    });
  }

  // 7. Tweet activity history
  if (tweetCount === 0) {
    authenticityScore -= 20;
    flags.push({
      type: 'warning',
      signal: 'Zero Public Tweets',
      description: 'Account has never published a tweet.'
    });
  }

  // Ensure score stays bounded [5, 100]
  authenticityScore = Math.max(5, Math.min(100, Math.round(authenticityScore)));

  // Determine Risk Category
  let riskLevel = 'Very Low';
  let badgeColor = 'emerald';
  if (authenticityScore < 30) {
    riskLevel = 'Critical Sybil / Bot Risk';
    badgeColor = 'rose';
  } else if (authenticityScore < 55) {
    riskLevel = 'High Risk of Inauthentic Audience';
    badgeColor = 'amber';
  } else if (authenticityScore < 75) {
    riskLevel = 'Moderate Bot Signals';
    badgeColor = 'yellow';
  } else if (authenticityScore < 90) {
    riskLevel = 'Low Risk';
    badgeColor = 'blue';
  }

  const estimatedRealAudiencePct = authenticityScore;
  const estimatedFakeAudiencePct = 100 - authenticityScore;

  return {
    authenticityScore,
    riskLevel,
    badgeColor,
    estimatedRealAudiencePct,
    estimatedFakeAudiencePct,
    flags
  };
}

module.exports = {
  detectBotAndSybil
};
