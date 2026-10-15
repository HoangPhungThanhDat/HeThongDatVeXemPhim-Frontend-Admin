// src/api/TicketApi.js
import axios from '../client/AxiosAdmin';

const TicketApi = {
  getAll: () => axios.get('/tickets'),
  getById: (TicketId) => axios.get(`/tickets/${TicketId}`),
  create: (data) => {
    console.log('📤 TicketApi.create called with:', data);
    return axios.post('/tickets', data);
  },
  update: (TicketId, data) => axios.put(`/tickets/${TicketId}`, data),
  delete: (TicketId) => axios.delete(`/tickets/${TicketId}`),
  getByShowtime: (showtimeId) => axios.get(`/tickets/showtime/${showtimeId}`),
  getByUser: (userId) => axios.get(`/tickets/user/${userId}`),
  checkin: (TicketId) => axios.post(`/tickets/${TicketId}/checkin`),
  cancel: (TicketId) => axios.post(`/tickets/${TicketId}/cancel`),
};

export default TicketApi;
