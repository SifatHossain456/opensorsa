const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend Vite dev server (usually port 5173 or any origin)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// API Routes
app.use('/api', apiRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to OpenSorsa API - Free X/Twitter Intelligence Platform',
    endpoints: {
      health: '/api/health',
      fullIntel: '/api/user/:username/full-intel',
      profile: '/api/user/:username',
      tweets: '/api/user/:username/tweets',
      compare: '/api/compare?user1=:u1&user2=:u2',
      export: '/api/export/:username?format=json|csv',
      vcDirectory: '/api/vc-directory'
    },
    documentation: '100% Free Sorsa / TweetScout Alternative'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[OpenSorsa Error]', err.stack);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 OpenSorsa Server running on http://localhost:${PORT}`);
  console.log(`📡 Ready to analyze X/Twitter handles for 100% free!`);
  console.log(`=======================================================`);
});
