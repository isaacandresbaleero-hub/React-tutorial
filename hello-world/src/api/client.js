import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post('/api/token/refresh/', {
          refresh: refreshToken,
        });
        localStorage.setItem('access_token', response.data.access);
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const login = (credentials) => apiClient.post('/token/', credentials);
export const register = (userData) => apiClient.post('/register/', userData);
export const getCurrentUser = () => apiClient.get('/users/me/');

// Placement endpoints
export const getPlacements = (params) => apiClient.get('/placements/', { params });
export const getPlacement = (id) => apiClient.get(`/placements/${id}/`);
export const createPlacement = (data) => apiClient.post('/placements/', data);
export const updatePlacement = (id, data) => apiClient.put(`/placements/${id}/`, data);
export const deletePlacement = (id) => apiClient.delete(`/placements/${id}/`);

// Weekly Log endpoints
export const getWeeklyLogs = (placementId) => apiClient.get(`/placements/${placementId}/logs/`);
export const getWeeklyLog = (placementId, weekNumber) => apiClient.get(`/placements/${placementId}/logs/${weekNumber}/`);
export const createWeeklyLog = (placementId, data) => apiClient.post(`/placements/${placementId}/logs/`, data);
export const updateWeeklyLog = (placementId, weekNumber, data) => apiClient.put(`/placements/${placementId}/logs/${weekNumber}/`, data);
export const submitWeeklyLog = (placementId, weekNumber) => apiClient.post(`/placements/${placementId}/logs/${weekNumber}/submit/`);
export const reviewWeeklyLog = (placementId, weekNumber, data) => apiClient.post(`/placements/${placementId}/logs/${weekNumber}/review/`, data);

export default apiClient;