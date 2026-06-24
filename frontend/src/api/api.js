/**
 * PhishGuard Pro — Centralized API Service
 * All backend API calls go through this module.
 */
import axios from 'axios';
import { auth } from '../firebase/config';

// Create Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request Interceptor: Attach Firebase ID Token ────
api.interceptors.request.use(
  async (config) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Failed to get auth token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor: Handle Errors ──────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        console.warn('Unauthorized — redirecting to login');
      } else if (status === 429) {
        console.warn('Rate limited — please wait');
      }
      return Promise.reject({
        status,
        message: data?.message || data?.error || 'An error occurred',
        data,
      });
    }
    return Promise.reject({
      status: 0,
      message: 'Network error — check your connection',
    });
  }
);

// ── API Functions ────────────────────────────────────

/**
 * Scan a URL for phishing indicators.
 * @param {string} url - The URL to scan
 */
export const scanUrl = (url) => api.post('/scan', { url });

/**
 * Get detailed prediction with feature breakdown.
 * @param {string} url - The URL to analyze
 */
export const predictUrl = (url) => api.post('/predict', { url });

/**
 * Get authenticated user's scan history.
 * @param {number} limit - Maximum records to return
 */
export const getHistory = (limit = 50) => api.get('/history', { params: { limit } });

/**
 * Delete a scan record.
 * @param {string} id - Scan record ID
 */
export const deleteHistory = (id) => api.delete(`/history/${id}`);

/**
 * Get aggregated dashboard statistics.
 */
export const getStats = () => api.get('/stats');

/**
 * Generate and download a PDF security report.
 * @param {object} scanData - The scan result data
 */
export const exportReport = (scanData) =>
  api.post('/export-report', scanData, {
    responseType: 'blob',
  });

/**
 * Health check endpoint.
 */
export const healthCheck = () => api.get('/health');

export default api;
