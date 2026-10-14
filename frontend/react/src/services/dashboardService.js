import api from './api';

export const dashboardService = {
  async getStats() {
    return api.get('/admin/dashboard/stats');
  },
};

export default dashboardService;
