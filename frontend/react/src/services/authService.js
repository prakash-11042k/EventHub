import api from './api';

export const authService = {
  async login(credentials) {
    const data = await api.post('/auth/login', credentials);
    api.setAuth(data.token, data);
    return data;
  },

  async register(userData) {
    const data = await api.post('/auth/register', userData);
    api.setAuth(data.token, data);
    return data;
  },

  logout() {
    api.clearAuth();
  },

  async getProfile() {
    return api.get('/users/profile');
  },

  async updateProfile(updates) {
    const updated = await api.put('/users/profile', updates);
    // Update cached user info
    const current = api.getUserInfo();
    if (current) {
      api.setAuth(api.getToken(), { ...current, fullName: updated.fullName });
    }
    return updated;
  },
};

export default authService;
