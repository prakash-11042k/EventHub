const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const api = {
  getToken() {
    return localStorage.getItem('token');
  },

  getUserInfo() {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  setAuth(token, user) {
    if (token) localStorage.setItem('token', token);
    if (user) localStorage.setItem('user', JSON.stringify(user));
  },

  clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isLoggedIn() {
    return !!this.getToken();
  },

  isAdmin() {
    const user = this.getUserInfo();
    return user && user.role === 'ADMIN';
  },

  async fetchAPI(endpoint, options = {}) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    if (options.body && typeof options.body !== 'string') {
      config.body = JSON.stringify(options.body);
    }

    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    try {
      const response = await fetch(url, config);

      if (response.status === 401) {
        // Trigger event so AuthContext handles logout cleanly
        if (!endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
          this.clearAuth();
          window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        }
      }

      if (response.status === 204) {
        return null; // No Content
      }

      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');
      const data = isJson ? await response.json() : null;

      if (!response.ok) {
        const errorMessage = (data && (data.message || data.error)) || response.statusText || 'Request failed';
        const error = new Error(errorMessage);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  get(endpoint, options = {}) {
    return this.fetchAPI(endpoint, { ...options, method: 'GET' });
  },

  post(endpoint, body, options = {}) {
    return this.fetchAPI(endpoint, { ...options, method: 'POST', body });
  },

  put(endpoint, body, options = {}) {
    return this.fetchAPI(endpoint, { ...options, method: 'PUT', body });
  },

  delete(endpoint, options = {}) {
    return this.fetchAPI(endpoint, { ...options, method: 'DELETE' });
  },
};

export default api;
