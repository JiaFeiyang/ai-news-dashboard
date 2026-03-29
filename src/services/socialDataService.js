import ApiService from './apiService';

/**
 * Social Data Service
 * Handles API calls related to social content such as posts, comments, and user interactions
 */
class SocialDataService extends ApiService {
  constructor() {
    super();
  }

  /**
   * Get social posts with pagination and filtering options
   * @param {Object} filters - Filter options for the query
   * @returns {Promise} - Promise resolving to an array of social posts
   */
  async getSocialPosts(filters = {}) {
    return this.get('/social/posts', filters);
  }

  /**
   * Get a specific social post by ID
   * @param {string} postId - The ID of the post to retrieve
   * @returns {Promise} - Promise resolving to a single social post
   */
  async getSocialPostById(postId) {
    if (!postId) {
      throw new Error('Post ID is required');
    }
    return this.get(`/social/posts/${postId}`);
  }

  /**
   * Create a new social post
   * @param {Object} postData - The data for the new post
   * @returns {Promise} - Promise resolving to the created post
   */
  async createSocialPost(postData) {
    if (!postData) {
      throw new Error('Post data is required');
    }
    return this.post('/social/posts', postData);
  }

  /**
   * Update an existing social post
   * @param {string} postId - The ID of the post to update
   * @param {Object} postData - The updated data
   * @returns {Promise} - Promise resolving to the updated post
   */
  async updateSocialPost(postId, postData) {
    if (!postId) {
      throw new Error('Post ID is required');
    }
    if (!postData) {
      throw new Error('Post data is required');
    }
    return this.put(`/social/posts/${postId}`, postData);
  }

  /**
   * Delete a social post
   * @param {string} postId - The ID of the post to delete
   * @returns {Promise} - Promise resolving to deletion confirmation
   */
  async deleteSocialPost(postId) {
    if (!postId) {
      throw new Error('Post ID is required');
    }
    return this.delete(`/social/posts/${postId}`);
  }

  /**
   * Get comments for a specific post
   * @param {string} postId - The ID of the post
   * @param {Object} options - Pagination and sorting options
   * @returns {Promise} - Promise resolving to an array of comments
   */
  async getComments(postId, options = {}) {
    if (!postId) {
      throw new Error('Post ID is required');
    }
    return this.get(`/social/posts/${postId}/comments`, options);
  }

  /**
   * Like a social post
   * @param {string} postId - The ID of the post to like
   * @returns {Promise} - Promise resolving to the like operation result
   */
  async likePost(postId) {
    if (!postId) {
      throw new Error('Post ID is required');
    }
    return this.post(`/social/posts/${postId}/like`);
  }

  /**
   * Unlike a social post
   * @param {string} postId - The ID of the post to unlike
   * @returns {Promise} - Promise resolving to the unlike operation result
   */
  async unlikePost(postId) {
    if (!postId) {
      throw new Error('Post ID is required');
    }
    return this.delete(`/social/posts/${postId}/like`);
  }

  /**
   * Share a social post
   * @param {string} postId - The ID of the post to share
   * @returns {Promise} - Promise resolving to the share operation result
   */
  async sharePost(postId) {
    if (!postId) {
      throw new Error('Post ID is required');
    }
    return this.post(`/social/posts/${postId}/share`);
  }

  /**
   * Get trending social topics
   * @param {Object} options - Filtering and pagination options
   * @returns {Promise} - Promise resolving to trending topics
   */
  async getTrendingTopics(options = {}) {
    return this.get('/social/trends', options);
  }

  /**
   * Get user's social activity feed
   * @param {string} userId - The ID of the user
   * @param {Object} options - Filtering and pagination options
   * @returns {Promise} - Promise resolving to user's activity feed
   */
  async getUserFeed(userId, options = {}) {
    if (!userId) {
      throw new Error('User ID is required');
    }
    return this.get(`/social/users/${userId}/feed`, options);
  }
}

// Export singleton instance
const socialDataService = new SocialDataService();
export default socialDataService;