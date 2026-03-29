import ApiService from './apiService';

/**
 * Agent Updates Service
 * Handles API calls related to agent updates, notifications, and activity feeds
 */
class AgentUpdatesService extends ApiService {
  constructor() {
    super();
  }

  /**
   * Get agent updates with pagination and filtering options
   * @param {Object} filters - Filter options for the query
   * @returns {Promise} - Promise resolving to an array of agent updates
   */
  async getAgentUpdates(filters = {}) {
    return this.get('/agents/updates', filters);
  }

  /**
   * Get a specific agent update by ID
   * @param {string} updateId - The ID of the update to retrieve
   * @returns {Promise} - Promise resolving to a single agent update
   */
  async getAgentUpdateById(updateId) {
    if (!updateId) {
      throw new Error('Update ID is required');
    }
    return this.get(`/agents/updates/${updateId}`);
  }

  /**
   * Create a new agent update
   * @param {Object} updateData - The data for the new update
   * @returns {Promise} - Promise resolving to the created update
   */
  async createAgentUpdate(updateData) {
    if (!updateData) {
      throw new Error('Update data is required');
    }
    return this.post('/agents/updates', updateData);
  }

  /**
   * Update an existing agent update
   * @param {string} updateId - The ID of the update to update
   * @param {Object} updateData - The updated data
   * @returns {Promise} - Promise resolving to the updated update
   */
  async updateAgentUpdate(updateId, updateData) {
    if (!updateId) {
      throw new Error('Update ID is required');
    }
    if (!updateData) {
      throw new Error('Update data is required');
    }
    return this.put(`/agents/updates/${updateId}`, updateData);
  }

  /**
   * Delete an agent update
   * @param {string} updateId - The ID of the update to delete
   * @returns {Promise} - Promise resolving to deletion confirmation
   */
  async deleteAgentUpdate(updateId) {
    if (!updateId) {
      throw new Error('Update ID is required');
    }
    return this.delete(`/agents/updates/${updateId}`);
  }

  /**
   * Get agent notifications
   * @param {Object} options - Filtering and pagination options
   * @returns {Promise} - Promise resolving to an array of notifications
   */
  async getNotifications(options = {}) {
    return this.get('/agents/notifications', options);
  }

  /**
   * Mark notification as read
   * @param {string} notificationId - The ID of the notification to mark as read
   * @returns {Promise} - Promise resolving to the operation result
   */
  async markNotificationAsRead(notificationId) {
    if (!notificationId) {
      throw new Error('Notification ID is required');
    }
    return this.post(`/agents/notifications/${notificationId}/read`);
  }

  /**
   * Mark all notifications as read
   * @returns {Promise} - Promise resolving to the operation result
   */
  async markAllNotificationsAsRead() {
    return this.post('/agents/notifications/mark-all-read');
  }

  /**
   * Get agent activity feed
   * @param {string} agentId - The ID of the agent
   * @param {Object} options - Filtering and pagination options
   * @returns {Promise} - Promise resolving to agent's activity feed
   */
  async getAgentActivityFeed(agentId, options = {}) {
    if (!agentId) {
      throw new Error('Agent ID is required');
    }
    return this.get(`/agents/${agentId}/activity`, options);
  }

  /**
   * Subscribe to agent updates
   * @param {string} agentId - The ID of the agent to subscribe to
   * @returns {Promise} - Promise resolving to the subscription result
   */
  async subscribeToAgent(agentId) {
    if (!agentId) {
      throw new Error('Agent ID is required');
    }
    return this.post(`/agents/${agentId}/subscribe`);
  }

  /**
   * Unsubscribe from agent updates
   * @param {string} agentId - The ID of the agent to unsubscribe from
   * @returns {Promise} - Promise resolving to the unsubscription result
   */
  async unsubscribeFromAgent(agentId) {
    if (!agentId) {
      throw new Error('Agent ID is required');
    }
    return this.delete(`/agents/${agentId}/unsubscribe`);
  }

  /**
   * Get popular agents
   * @param {Object} options - Filtering and pagination options
   * @returns {Promise} - Promise resolving to popular agents list
   */
  async getPopularAgents(options = {}) {
    return this.get('/agents/popular', options);
  }

  /**
   * Get agent statistics
   * @param {string} agentId - The ID of the agent
   * @returns {Promise} - Promise resolving to agent's statistics
   */
  async getAgentStats(agentId) {
    if (!agentId) {
      throw new Error('Agent ID is required');
    }
    return this.get(`/agents/${agentId}/stats`);
  }
}

// Export singleton instance
const agentUpdatesService = new AgentUpdatesService();
export default agentUpdatesService;