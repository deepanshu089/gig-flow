/**
 * API v1 Routes Index
 * 
 * Central export point for all v1 routes.
 * This makes it easier to import routes in the main application.
 */

const authRoutes = require('./authRoutes');
const gigRoutes = require('./gigRoutes');
const bidRoutes = require('./bidRoutes');

module.exports = {
    authRoutes,
    gigRoutes,
    bidRoutes
};
