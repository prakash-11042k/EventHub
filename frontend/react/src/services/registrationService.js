import api from './api';

export const registrationService = {
  async registerForEvent(eventId) {
    return api.post(`/registrations/events/${eventId}`);
  },

  async cancelRegistration(eventId) {
    return api.delete(`/registrations/events/${eventId}`);
  },

  async getMyRegistrations() {
    return api.get('/registrations/my-registrations');
  },

  async getEventRegistrations(eventId) {
    return api.get(`/registrations/events/${eventId}`);
  },

  async getAllRegistrations() {
    return api.get('/registrations');
  },
};

export default registrationService;
