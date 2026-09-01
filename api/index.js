const express = require('express');
const cors = require('cors');
const apiRoutes = require('../server/routes/api');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Handle both /api/... and direct /...
app.use('/api', apiRoutes);
app.use('/', apiRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error('[OpenSorsa API Error]', err.stack);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

module.exports = app;
