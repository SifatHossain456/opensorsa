const express = require('express');
const router = express.Router();
const {
  sanitizeUsername,
  fetchUserProfile,
  fetchUserStatuses,
  getFullIntelligence
} = require('../services/twitterService');
const { VC_AND_KOL_REGISTRY } = require('../services/vcKolRegistry');

// Health Check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'OpenSorsa Intelligence API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Tracked VC Directory
router.get('/vc-directory', (req, res) => {
  res.json({
    total: VC_AND_KOL_REGISTRY.length,
    entities: VC_AND_KOL_REGISTRY
  });
});

// Basic User Profile
router.get('/user/:username', async (req, res) => {
  try {
    const username = sanitizeUsername(req.params.username);
    const profile = await fetchUserProfile(username);
    res.json({ success: true, user: profile });
  } catch (err) {
    res.status(err.message.includes('not found') ? 404 : 500).json({
      success: false,
      error: err.message
    });
  }
});

// Full Intelligence Dossier (Equivalent of Sorsa / TweetScout Premium)
router.get('/user/:username/full-intel', async (req, res) => {
  try {
    const username = sanitizeUsername(req.params.username);
    const intel = await getFullIntelligence(username);
    res.json({ success: true, data: intel });
  } catch (err) {
    res.status(err.message.includes('not found') ? 404 : 500).json({
      success: false,
      error: err.message
    });
  }
});

// User Statuses / Tweets
router.get('/user/:username/tweets', async (req, res) => {
  try {
    const username = sanitizeUsername(req.params.username);
    const count = parseInt(req.query.count, 10) || 20;
    const tweets = await fetchUserStatuses(username, count);
    res.json({ success: true, count: tweets.length, tweets });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Compare two accounts side-by-side
router.get('/compare', async (req, res) => {
  try {
    const u1 = sanitizeUsername(req.query.user1);
    const u2 = sanitizeUsername(req.query.user2);

    if (!u1 || !u2) {
      return res.status(400).json({
        success: false,
        error: 'Both user1 and user2 query parameters are required for comparison'
      });
    }

    const [intel1, intel2] = await Promise.all([
      getFullIntelligence(u1),
      getFullIntelligence(u2)
    ]);

    res.json({
      success: true,
      comparison: {
        user1: intel1,
        user2: intel2,
        winner: {
          sorsaScore: intel1.sorsaScore.score > intel2.sorsaScore.score ? u1 : (intel2.sorsaScore.score > intel1.sorsaScore.score ? u2 : 'tie'),
          followers: intel1.profile.stats.followers > intel2.profile.stats.followers ? u1 : u2,
          engagement: intel1.engagement.avgViews > intel2.engagement.avgViews ? u1 : u2,
          vcInfluence: intel1.vcKolRadar.totalMatches > intel2.vcKolRadar.totalMatches ? u1 : u2
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Export intelligence dossier as JSON or CSV
router.get('/export/:username', async (req, res) => {
  try {
    const username = sanitizeUsername(req.params.username);
    const format = (req.query.format || 'json').toLowerCase();
    const intel = await getFullIntelligence(username);

    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${username}_opensorsa_report.csv"`);

      let csv = 'Category,Metric,Value\n';
      csv += `Profile,Handle,@${intel.profile.screen_name}\n`;
      csv += `Profile,Name,"${(intel.profile.name || '').replace(/"/g, '""')}"\n`;
      csv += `Profile,Followers,${intel.profile.stats.followers}\n`;
      csv += `Profile,Following,${intel.profile.stats.following}\n`;
      csv += `Profile,Ratio,${intel.profile.stats.ratio}\n`;
      csv += `Profile,Tweets Count,${intel.profile.stats.tweets}\n`;
      csv += `Profile,Verified,${intel.profile.verified}\n`;
      csv += `Sorsa Intelligence,Sorsa Score,${intel.sorsaScore.score}/1000\n`;
      csv += `Sorsa Intelligence,Tier,"${intel.sorsaScore.tier}"\n`;
      csv += `Sorsa Intelligence,Percentile,"${intel.sorsaScore.percentile}"\n`;
      csv += `Bot Detection,Authenticity Score,${intel.botDetection.authenticityScore}%\n`;
      csv += `Bot Detection,Risk Level,"${intel.botDetection.riskLevel}"\n`;
      csv += `Engagement,Engagement Rate,${intel.engagement.engagementRate}\n`;
      csv += `Engagement,Avg Views,${intel.engagement.avgViews}\n`;
      csv += `Engagement,Avg Likes,${intel.engagement.avgLikes}\n`;
      csv += `VC Radar,Total Matches,${intel.vcKolRadar.totalMatches}\n`;

      if (intel.cryptoIntelligence.cashtags.length > 0) {
        csv += `Crypto,Top Cashtags,"${intel.cryptoIntelligence.cashtags.map(c => '$' + c.symbol).join('; ')}"\n`;
      }
      csv += `Crypto,Sentiment,"${intel.cryptoIntelligence.sentiment.verdict}"\n`;

      return res.send(csv);
    }

    // Default JSON
    res.setHeader('Content-Disposition', `attachment; filename="${username}_opensorsa_report.json"`);
    return res.json(intel);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
