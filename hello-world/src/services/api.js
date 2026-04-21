import axios from 'axios';

// WHAT IS AXIOS?
// Axios is a library that makes HTTP requests (GET, POST, PUT, DELETE)
// It's like fetch() but with better error handling

// Backend URL - where Django is running
const API_BASE_URL = 'http://localhost:8000/api';

// Create an axios instance with default settings
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// REQUEST INTERCEPTOR - Runs before every request
// It automatically adds the authentication token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      // Add Authorization header: "Bearer eyJhbGciOiJIUzI1NiIs..."
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR - Runs after every response
// If we get a 401 (Unauthorized), try to refresh the token
api.interceptors.response.use(
  (response) => response, // If successful, just return the response
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried refreshing yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          // Try to get a new access token using the refresh token
          const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
            refresh: refreshToken,
          });
          
          // Save the new token
          localStorage.setItem('access_token', response.data.access);
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          return api(originalRequest); // Retry the original request
        } catch (refreshError) {
          // If refresh fails, log the user out
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

// ============================================
// AUTHENTICATION ENDPOINTS
// ============================================

// POST /api/auth/login/
export const login = (username, password) => {
  return api.post('/auth/login/', { username, password });
};

// POST /api/auth/register/
export const register = (userData) => {
  return api.post('/auth/register/', userData);
};

// POST /api/auth/logout/
export const logout = (refreshToken) => {
  return api.post('/auth/logout/', { refresh_token: refreshToken });
};

// GET /api/auth/profile/
export const getCurrentUser = () => {
  return api.get('/auth/profile/');
};

// ============================================
// INTERNSHIP ENDPOINTS
// ============================================

// GET /api/internships/ - Get all internships
export const getInternships = () => {
  return api.get('/internships/');
};

// GET /api/internships/5/ - Get specific internship
export const getInternship = (id) => {
  return api.get(`/internships/${id}/`);
};

// POST /api/internships/ - Create new internship
export const createInternship = (data) => {
  return api.post('/internships/', data);
};

// PUT /api/internships/5/ - Update internship
export const updateInternship = (id, data) => {
  return api.put(`/internships/${id}/`, data);
};

// DELETE /api/internships/5/ - Delete internship
export const deleteInternship = (id) => {
  return api.delete(`/internships/${id}/`);
};

// ============================================
// WEEKLY LOG ENDPOINTS
// ============================================

// GET /api/logs/ - Get all logs
export const getLogs = () => {
  return api.get('/logs/');
};

// POST /api/logs/ - Create new log
export const createLog = (data) => {
  return api.post('/logs/', data);
};

// POST /api/logs/5/submit/ - Submit log for review
export const submitLog = (id) => {
  return api.post(`/logs/${id}/submit/`);
};

// POST /api/logs/5/workplace_review/ - Workplace supervisor reviews
export const workplaceReview = (id, data) => {
  return api.post(`/logs/${id}/workplace_review/`, data);
};

// POST /api/logs/5/academic_review/ - Academic supervisor reviews
export const academicReview = (id, data) => {
  return api.post(`/logs/${id}/academic_review/`, data);
};

// ============================================
// DASHBOARD ENDPOINTS
// ============================================

// GET /api/dashboard/stats/ - Get statistics for dashboard
export const getDashboardStats = () => {
  return api.get('/dashboard/stats/');
};

export default api;