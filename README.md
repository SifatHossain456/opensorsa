# ⚡ OpenSorsa — 100% Free X / Twitter Intelligence & Analytics Platform

A complete, free alternative to **Sorsa.io (formerly TweetScout)**. Search any X (Twitter) username and get comprehensive, A-to-Z intelligence without needing expensive official API subscriptions or premium paywalls.

![OpenSorsa Platform](https://img.shields.io/badge/Status-Active%20&%20Free-00f2fe?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)

---

## 🌟 Key Features (All 100% Free vs Sorsa Premium)

1. **Sorsa / Influence Score (0 - 1000)**:
   - Multi-factor algorithmic calculation of account power based on follower reach, logarithmic velocity, ratio health, and credibility.
   - Categorized into Tiers: S-Tier (Titan), A-Tier (Elite), B-Tier (Authority), C-Tier, D-Tier, E-Tier.
2. **VC & Tier-1 KOL Radar**:
   - Curated registry of 80+ top institutional crypto venture capital funds (a16z, Paradigm, Sequoia, Pantera, Binance Labs, Multicoin, etc.) and industry titans (Vitalik, CZ, Brian Armstrong, Anatoly, Cobie, etc.).
   - Automatically cross-references following and followers to detect high-value connections.
3. **Audience Authenticity & Bot / Sybil Detector**:
   - Analyzes username patterns, default avatars, follow/unfollow churn, mass-following behaviors, and engagement-to-follower ratios.
   - Computes an estimated Real Audience % vs Bot/Inactive % with detailed risk flags.
4. **Crypto Cashtags & Contract Tracker**:
   - Automatically extracts `$BTC`, `$ETH`, `$SOL`, meme tokens, and EVM / Solana contract addresses from posts.
   - Sentiment analysis (Bullish / Neutral / Bearish).
5. **Viral Spread & Engagement Dynamics**:
   - Computes Engagement Rate (ER%), Average Views per post, Average Likes, Average Retweets, and Average Replies.
   - Interactive tweet viewer with sorting by Top Views, Most Liked, and Most Retweeted.
6. **Versus Mode (Head-to-Head Comparison)**:
   - Compare two handles side-by-side (e.g. `@vitalikbuterin` vs `@cz_binance`) with automatic winner badges across all metrics.
7. **One-Click Export**:
   - Download complete intelligence dossiers in **JSON** or **CSV/Excel** format, or generate printable summaries.

---

## 🚀 Quick Start

### 1. Start the Backend API (Port 5000)
```bash
cd server
node index.js
```

### 2. Start the Frontend Web Dashboard (Port 5173)
```bash
cd client
npm.cmd run dev
```

Open your browser and navigate to: **`http://localhost:5173`**

---

## 📁 Project Architecture

```
opensorsa/
├── server/                      # Express.js Intelligence API
│   ├── index.js                 # API entry point & CORS
│   ├── routes/
│   │   └── api.js               # REST Endpoints (/full-intel, /compare, /export)
│   └── services/
│       ├── twitterService.js    # Data aggregation engine
│       ├── scoreCalculator.js   # Sorsa Score (0-1000) algorithm
│       ├── botDetector.js       # Sybil & bot detection engine
│       ├── vcKolRegistry.js     # 80+ VC & KOL directory
│       ├── cryptoAnalyzer.js    # Cashtags, contracts, sentiment
│       └── cacheService.js      # In-memory TTL cache
│
├── client/                      # Vite + React + Tailwind CSS UI
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Header & quick actions
│   │   │   ├── SearchBar.jsx    # Search input with presets
│   │   │   ├── ProfileHeader.jsx# User banner, avatar, badges, stats
│   │   │   ├── ScoreGauge.jsx   # Animated circular score dial
│   │   │   ├── BotRiskMeter.jsx # Authenticity bar & flags
│   │   │   ├── VcKolRadar.jsx   # VC & KOL connections grid
│   │   │   ├── CryptoAnalytics.jsx# Cashtag frequency & sentiment
│   │   │   ├── TweetsFeed.jsx   # Interactive post list & sorting
│   │   │   ├── CompareModal.jsx # Head-to-head versus battle
│   │   │   └── ExportModal.jsx  # JSON & CSV download
│   │   ├── App.jsx              # Main dashboard application
│   │   ├── index.css            # Cyber styling & glassmorphism
│   │   └── main.jsx
│   ├── vite.config.js           # Vite dev server & API proxy
│   └── package.json
└── README.md
```
