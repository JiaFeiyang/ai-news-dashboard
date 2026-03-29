import socialDataService from './socialDataService';
import agentUpdatesService from './agentUpdatesService';

/**
 * API Client
 * Provides high-level API functions for use by React hooks and components
 */

export const fetchSocialFeeds = async (filters = {}) => {
  try {
    const response = await socialDataService.getSocialPosts(filters);
    return response;
  } catch (error) {
    console.error('Error fetching social feeds:', error);
    throw error;
  }
};

export const fetchAgentUpdates = async (filters = {}) => {
  try {
    const response = await agentUpdatesService.getAgentUpdates(filters);
    return response;
  } catch (error) {
    console.error('Error fetching agent updates:', error);
    throw error;
  }
};

// Export other API functions as needed
export default {
  fetchSocialFeeds,
  fetchAgentUpdates
};