import api from './api';

export const analyticsService = {
  getFarmerAnalytics: async () => {
    const response = await api.get('/analytics/farmer');
    return response.data;
  },
};
