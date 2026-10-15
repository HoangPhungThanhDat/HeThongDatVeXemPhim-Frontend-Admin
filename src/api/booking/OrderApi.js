// src/api/OrderApi.js
import axios from '../client/AxiosAdmin';

const OrderApi = {
  getAll: () => axios.get('/orders'),
  getById: (OrderId) => axios.get(`/orders/${OrderId}`),
  getDetails: (OrderId) => axios.get(`/orders/${OrderId}/details`), // ✅ API mới
  create: (data) => axios.post('/orders', data),
  update: (OrderId, data) => axios.put(`/orders/${OrderId}`, data),
  delete: (OrderId) => axios.delete(`/orders/${OrderId}`),
};

export default OrderApi;
