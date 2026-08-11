import api from './api';

export const orderService = {
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  getBuyerOrders: async () => {
    const response = await api.get('/orders/buyer');
    return response.data;
  },

  getFarmerOrders: async () => {
    const response = await api.get('/orders/farmer');
    return response.data;
  },

  updateOrderStatus: async (id, status) => {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data;
  },
};
