import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Waitlist API Service
 */
export const waitlistAPI = {
  /**
   * Fetch all waitlist entries with optional filtering
   */
  getAll: async (filters = {}) => {
    try {
      const response = await api.get('/waitlist', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch waitlist' };
    }
  },

  /**
   * Fetch a single waitlist entry by ID
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/waitlist/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch entry' };
    }
  },

  /**
   * Add a new customer to the waitlist
   */
  create: async (data) => {
    try {
      const response = await api.post('/waitlist', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create entry' };
    }
  },

  /**
   * Update waitlist entry status
   */
  updateStatus: async (id, status) => {
    try {
      const response = await api.put(`/waitlist/${id}`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update entry' };
    }
  },

  /**
   * Delete a waitlist entry
   */
  delete: async (id) => {
    try {
      const response = await api.delete(`/waitlist/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to delete entry' };
    }
  },

  /**
   * Get waitlist statistics
   */
  getStats: async () => {
    try {
      const response = await api.get('/waitlist/stats/summary');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch statistics' };
    }
  },
};

/**
 * Health Check
 */
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Server not available' };
  }
};

export default api;
