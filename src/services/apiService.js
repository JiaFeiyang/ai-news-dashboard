/**
 * API Service Base Class
 * Provides basic HTTP request functionality for the application
 */
class ApiService {
  constructor(baseURL) {
    this.baseURL = baseURL || process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
  }

  /**
   * Generic method to handle API requests
   * @param {string} endpoint - The API endpoint
   * @param {Object} options - Request options including method, headers, and body
   * @returns {Promise} - Promise that resolves to the API response
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    // Merge provided headers with default headers
    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Handle different content types appropriately
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return await response.text();
      }
    } catch (error) {
      console.error(`API request failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * GET request helper
   * @param {string} endpoint - The API endpoint
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response promise
   */
  async get(endpoint, params = {}) {
    // Construct query string from params
    const queryString = Object.keys(params).length > 0
      ? '?' + new URLSearchParams(params).toString()
      : '';

    return this.request(`${endpoint}${queryString}`, {
      method: 'GET',
    });
  }

  /**
   * POST request helper
   * @param {string} endpoint - The API endpoint
   * @param {Object} data - Request payload
   * @returns {Promise} - API response promise
   */
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT request helper
   * @param {string} endpoint - The API endpoint
   * @param {Object} data - Request payload
   * @returns {Promise} - API response promise
   */
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request helper
   * @param {string} endpoint - The API endpoint
   * @returns {Promise} - API response promise
   */
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

export default ApiService;