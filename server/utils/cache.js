// Cache Manager for AI News Dashboard
// Implements caching functionality for API responses and data

class CacheManager {
  constructor() {
    this.cache = new Map();
    this.timers = new Map(); // Track timeouts for expiration
  }

  /**
   * Store data in cache with optional TTL (time to live)
   * @param {string} key - Cache key
   * @param {*} value - Value to store
   * @param {number} ttl - Time to live in milliseconds (optional)
   */
  set(key, value, ttl = null) {
    // Clear any existing timer for this key
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }

    // Store the value
    this.cache.set(key, value);

    // Set expiration timer if TTL is provided
    if (ttl && ttl > 0) {
      const timerId = setTimeout(() => {
        this.delete(key);
      }, ttl);

      this.timers.set(key, timerId);
    }
  }

  /**
   * Get value from cache
   * @param {string} key - Cache key
   * @returns {*} Cached value or undefined
   */
  get(key) {
    return this.cache.has(key) ? this.cache.get(key) : undefined;
  }

  /**
   * Check if key exists in cache
   * @param {string} key - Cache key
   * @returns {boolean} True if key exists
   */
  has(key) {
    return this.cache.has(key);
  }

  /**
   * Delete key from cache
   * @param {string} key - Cache key
   */
  delete(key) {
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }

    return this.cache.delete(key);
  }

  /**
   * Clear entire cache
   */
  clear() {
    // Clear all timers
    for (const timerId of this.timers.values()) {
      clearTimeout(timerId);
    }
    this.timers.clear();

    // Clear cache
    this.cache.clear();
  }

  /**
   * Get cache size
   * @returns {number} Number of items in cache
   */
  size() {
    return this.cache.size;
  }

  /**
   * Get all cache keys
   * @returns {Array<string>} Array of cache keys
   */
  keys() {
    return Array.from(this.cache.keys());
  }

  /**
   * Extend TTL of an existing cached item
   * @param {string} key - Cache key
   * @param {number} ttl - New time to live in milliseconds
   */
  extendTTL(key, ttl) {
    if (!this.cache.has(key) || !ttl || ttl <= 0) {
      return false;
    }

    // Remove existing timer
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }

    // Set new timer
    const timerId = setTimeout(() => {
      this.delete(key);
    }, ttl);

    this.timers.set(key, timerId);
    return true;
  }
}

// Create singleton instance
const cacheManager = new CacheManager();

module.exports = cacheManager;