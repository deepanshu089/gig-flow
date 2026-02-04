/**
 * API v2 Routes Index
 * 
 * Central export point for all v2 routes.
 * This is a placeholder for future API v2 implementation.
 * 
 * When v2 is ready, uncomment and use these routes.
 */

const authRoutes = require('./authRoutes');
const gigRoutes = require('./gigRoutes');
const bidRoutes = require('./bidRoutes');

module.exports = {
    authRoutes,
    gigRoutes,
    bidRoutes
};

// Note: v2 routes are currently placeholders
// To activate v2, update src/index.js to include:
// app.use('/api/v2/auth', require('./routes/v2').authRoutes);
// app.use('/api/v2/gigs', require('./routes/v2').gigRoutes);
// app.use('/api/v2/bids', require('./routes/v2').bidRoutes);
