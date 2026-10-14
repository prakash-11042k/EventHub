import api from './api';

export const categoryService = {
  async getAllCategories() {
    return api.get('/categories');
  },

  async getCategoryById(id) {
    return api.get(`/categories/${id}`);
  },

  async createCategory(categoryData) {
    return api.post('/categories', categoryData);
  },

  async updateCategory(id, categoryData) {
    return api.put(`/categories/${id}`, categoryData);
  },

  async deleteCategory(id) {
    return api.delete(`/categories/${id}`);
  },
};

export default categoryService;
