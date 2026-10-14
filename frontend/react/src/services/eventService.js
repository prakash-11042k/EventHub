import api from './api';

export const eventService = {
  async getAllEvents(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.query) searchParams.append('query', params.query);
    if (params.categoryId) searchParams.append('categoryId', params.categoryId);
    if (params.category) searchParams.append('category', params.category);

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/events?${queryString}` : '/events';
    return api.get(endpoint);
  },

  async getEventById(id) {
    return api.get(`/events/${id}`);
  },

  async createEvent(eventData) {
    return api.post('/events', eventData);
  },

  async updateEvent(id, eventData) {
    return api.put(`/events/${id}`, eventData);
  },

  async deleteEvent(id) {
    return api.delete(`/events/${id}`);
  },

  async deleteAllEvents() {
    return api.delete('/events');
  },
};

export default eventService;
