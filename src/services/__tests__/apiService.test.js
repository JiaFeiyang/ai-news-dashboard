import ApiService from '../apiService';

// Mock global fetch
global.fetch = jest.fn();

describe('ApiService', () => {
  const baseURL = 'http://localhost:3001/api';
  let apiService;

  beforeEach(() => {
    apiService = new ApiService(baseURL);
    fetch.mockClear();
  });

  describe('constructor', () => {
    test('should initialize with provided base URL', () => {
      const service = new ApiService('https://test-api.com');
      expect(service.baseURL).toBe('https://test-api.com');
    });

    test('should use default base URL when none provided', () => {
      const service = new ApiService();
      expect(service.baseURL).toBe('http://localhost:3001/api');
    });

    test('should use environment variable as base URL when none provided', () => {
      process.env.REACT_APP_API_URL = 'https://env-api.com';
      const service = new ApiService();
      expect(service.baseURL).toBe('https://env-api.com');
      delete process.env.REACT_APP_API_URL; // Clean up
    });
  });

  describe('request method', () => {
    test('should make a successful GET request', async () => {
      const mockResponse = { data: 'test response' };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: {
          get: () => 'application/json'
        }
      });

      const response = await apiService.request('/test-endpoint', {
        method: 'GET'
      });

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/test-endpoint',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      expect(response).toEqual(mockResponse);
    });

    test('should make a successful POST request', async () => {
      const payload = { name: 'test', value: 123 };
      const mockResponse = { success: true, data: payload };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: {
          get: () => 'application/json'
        }
      });

      const response = await apiService.request('/test-endpoint', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/test-endpoint',
        {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      expect(response).toEqual(mockResponse);
    });

    test('should handle non-JSON response', async () => {
      const mockText = 'Plain text response';
      fetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockText),
        headers: {
          get: () => 'text/plain'
        }
      });

      const response = await apiService.request('/test-endpoint', {
        method: 'GET'
      });

      expect(response).toBe(mockText);
    });

    test('should throw error for non-OK response', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404
      });

      await expect(apiService.request('/test-endpoint', {
        method: 'GET'
      })).rejects.toThrow('HTTP error! Status: 404');
    });

    test('should throw error when fetch fails', async () => {
      const errorMessage = 'Network error';
      fetch.mockRejectedValueOnce(new Error(errorMessage));

      await expect(apiService.request('/test-endpoint', {
        method: 'GET'
      })).rejects.toThrow(errorMessage);
    });

    test('should merge custom headers with default headers', async () => {
      const mockResponse = { data: 'test' };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: {
          get: () => 'application/json'
        }
      });

      await apiService.request('/test-endpoint', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer token123',
          'X-Custom-Header': 'custom-value'
        }
      });

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/test-endpoint',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer token123',
            'X-Custom-Header': 'custom-value'
          }
        }
      );
    });
  });

  describe('get method', () => {
    test('should make a GET request with query parameters', async () => {
      const mockResponse = { data: 'result' };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: {
          get: () => 'application/json'
        }
      });

      const params = { q: 'search', limit: 10, sort: 'date' };
      const response = await apiService.get('/search', params);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/search?q=search&limit=10&sort=date',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      expect(response).toEqual(mockResponse);
    });

    test('should make a GET request without query parameters', async () => {
      const mockResponse = { data: 'result' };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: {
          get: () => 'application/json'
        }
      });

      const response = await apiService.get('/test');

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/test',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      expect(response).toEqual(mockResponse);
    });
  });

  describe('post method', () => {
    test('should make a POST request with JSON payload', async () => {
      const payload = { name: 'test', value: 123 };
      const mockResponse = { success: true, id: 1 };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: {
          get: () => 'application/json'
        }
      });

      const response = await apiService.post('/create', payload);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/create',
        {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      expect(response).toEqual(mockResponse);
    });
  });

  describe('put method', () => {
    test('should make a PUT request with JSON payload', async () => {
      const payload = { name: 'updated', value: 456 };
      const mockResponse = { success: true, updated: true };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: {
          get: () => 'application/json'
        }
      });

      const response = await apiService.put('/update/1', payload);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/update/1',
        {
          method: 'PUT',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      expect(response).toEqual(mockResponse);
    });
  });

  describe('delete method', () => {
    test('should make a DELETE request', async () => {
      const mockResponse = { success: true };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: {
          get: () => 'application/json'
        }
      });

      const response = await apiService.delete('/delete/1');

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/delete/1',
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      expect(response).toEqual(mockResponse);
    });
  });
});