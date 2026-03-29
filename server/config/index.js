const constants = require('./constants');

// Environment-specific configuration
const config = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-news-dashboard',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_jwt_secret_for_development',
  API_RATE_LIMIT: parseInt(process.env.API_RATE_LIMIT) || 100,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info'
};

// Merge constants with config
Object.assign(config, constants);

module.exports = config;