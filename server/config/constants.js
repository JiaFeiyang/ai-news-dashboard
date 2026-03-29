// Application constants
const constants = {
  // API Configuration
  API_VERSION: 'v1',
  API_BASE_PATH: '/api',

  // Database
  DB_CONNECTION_RETRIES: 5,
  DB_CONNECTION_DELAY: 2000, // milliseconds

  // Cache
  DEFAULT_CACHE_TTL: 300, // 5 minutes
  LONG_CACHE_TTL: 3600, // 1 hour

  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,

  // Social Media Integration
  SOCIAL_POSTS_FETCH_INTERVAL: 300000, // 5 minutes in milliseconds
  AGENT_UPDATES_FETCH_INTERVAL: 60000, // 1 minute in milliseconds

  // Error Messages
  ERROR_MESSAGES: {
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access forbidden',
    NOT_FOUND: 'Resource not found',
    SERVER_ERROR: 'Internal server error',
    VALIDATION_ERROR: 'Validation failed'
  }
};

module.exports = constants;