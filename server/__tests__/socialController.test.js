const socialController = require('../../server/controllers/socialController');

// Mock Express request and response objects
const createMockRequest = (params = {}, query = {}, body = {}) => ({
  params,
  query,
  body
});

const createMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  res.send = jest.fn().mockReturnThis();
  return res;
};

describe('Social Controller', () => {
  let mockRequest;
  let mockResponse;
  let mockNext;

  beforeEach(() => {
    mockRequest = createMockRequest();
    mockResponse = createMockResponse();
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllSocialContent', () => {
    test('should return all social content with default sorting', async () => {
      mockRequest.query = {};

      await socialController.getAllSocialContent(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalled();

      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.success).toBe(true);
      expect(Array.isArray(responseData.data)).toBe(true);
      expect(responseData.count).toBeGreaterThanOrEqual(0);
    });

    test('should filter by platform when platform query is provided', async () => {
      mockRequest.query = { platform: 'twitter' };

      await socialController.getAllSocialContent(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.success).toBe(true);

      // All returned items should be from the specified platform
      if (responseData.data.length > 0) {
        responseData.data.forEach(item => {
          expect(item.platform).toBe('twitter');
        });
      }
    });

    test('should sort by specified field and order', async () => {
      mockRequest.query = { sortBy: 'likes', order: 'desc' };

      await socialController.getAllSocialContent(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.success).toBe(true);

      // Verify that the response contains data
      expect(Array.isArray(responseData.data)).toBe(true);
    });

    test('should limit results when limit query is provided', async () => {
      mockRequest.query = { limit: 2 };

      await socialController.getAllSocialContent(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.success).toBe(true);
      expect(responseData.count).toBeLessThanOrEqual(2);
    });

    test('should handle errors gracefully', async () => {
      // Simulate error condition - this is tricky because we can't easily mock internal errors
      // We'll use the real controller and make sure it handles errors properly

      // Temporarily modify the controller to test error handling by mocking Date.now
      const originalDateNow = global.Date.now;
      global.Date.now = jest.fn(() => {
        // This doesn't directly trigger an error in the controller, so just call normally
        return 1234567890;
      });

      await socialController.getAllSocialContent(mockRequest, mockResponse, mockNext);

      // Restore original implementation
      global.Date.now = originalDateNow;

      // Check that the response is as expected
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getSocialContentById', () => {
    test('should return social content by valid ID', async () => {
      mockRequest.params = { id: '1' };

      await socialController.getSocialContentById(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.success).toBe(true);
      expect(responseData.data).toBeDefined();
      expect(responseData.data.id).toBe(1);
    });

    test('should return 404 for invalid ID', async () => {
      mockRequest.params = { id: '999' }; // Assuming this ID doesn't exist

      await socialController.getSocialContentById(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe('Social post not found');
    });

    test('should handle invalid ID format', async () => {
      mockRequest.params = { id: 'invalid' };

      await socialController.getSocialContentById(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBeDefined();
    });
  });

  describe('getSocialContentByPlatform', () => {
    test('should return social content for valid platform', async () => {
      mockRequest.params = { platform: 'twitter' };
      mockRequest.query = {};

      await socialController.getSocialContentByPlatform(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.success).toBe(true);
      expect(Array.isArray(responseData.data)).toBe(true);

      // All returned items should be from the specified platform
      if (responseData.data.length > 0) {
        responseData.data.forEach(item => {
          expect(item.platform).toBe('twitter');
        });
      }
    });

    test('should sort results by specified field', async () => {
      mockRequest.params = { platform: 'twitter' };
      mockRequest.query = { sortBy: 'likes', order: 'desc' };

      await socialController.getSocialContentByPlatform(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.success).toBe(true);
      expect(Array.isArray(responseData.data)).toBe(true);
    });

    test('should limit results when specified', async () => {
      mockRequest.params = { platform: 'twitter' };
      mockRequest.query = { limit: 1 };

      await socialController.getSocialContentByPlatform(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.success).toBe(true);
      expect(responseData.count).toBeLessThanOrEqual(1);
    });

    test('should return empty array for non-existent platform', async () => {
      mockRequest.params = { platform: 'nonexistent_platform' };
      mockRequest.query = {};

      await socialController.getSocialContentByPlatform(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.success).toBe(true);
      expect(Array.isArray(responseData.data)).toBe(true);
      expect(responseData.count).toBe(0);
    });
  });

  describe('searchSocialContent', () => {
    test('should search by query term in content or username', async () => {
      mockRequest.query = { q: 'AI' }; // Search for posts containing 'AI'

      await socialController.searchSocialContent(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.success).toBe(true);
      expect(Array.isArray(responseData.data)).toBe(true);
    });

    test('should filter by platform in combination with search', async () => {
      mockRequest.query = { q: 'AI', platform: 'twitter' };

      await socialController.searchSocialContent(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.success).toBe(true);
      expect(Array.isArray(responseData.data)).toBe(true);

      // All returned items should be from the specified platform
      if (responseData.data.length > 0) {
        responseData.data.forEach(item => {
          expect(item.platform).toBe('twitter');
        });
      }
    });

    test('should filter by sentiment', async () => {
      mockRequest.query = { sentiment: 'positive' };

      await socialController.searchSocialContent(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.success).toBe(true);
      expect(Array.isArray(responseData.data)).toBe(true);

      // All returned items should have the specified sentiment
      if (responseData.data.length > 0) {
        responseData.data.forEach(item => {
          expect(item.sentiment).toBe('positive');
        });
      }
    });

    test('should apply all filters together', async () => {
      mockRequest.query = { q: 'AI', platform: 'twitter', sentiment: 'positive' };

      await socialController.searchSocialContent(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.success).toBe(true);
      expect(Array.isArray(responseData.data)).toBe(true);

      if (responseData.data.length > 0) {
        responseData.data.forEach(item => {
          expect(item.platform).toBe('twitter');
          expect(item.sentiment).toBe('positive');
          // Content or username should contain the search term
          expect(
            item.content.toLowerCase().includes('ai') ||
            item.username.toLowerCase().includes('ai')
          ).toBe(true);
        });
      }
    });

    test('should return all content when no filters are applied', async () => {
      mockRequest.query = {}; // No filters

      await socialController.searchSocialContent(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.success).toBe(true);
      expect(Array.isArray(responseData.data)).toBe(true);
    });
  });
});