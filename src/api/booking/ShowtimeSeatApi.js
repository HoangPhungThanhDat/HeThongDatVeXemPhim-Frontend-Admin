// src/api/ShowtimeSeatApi.js
import axios from '../client/AxiosAdmin';

const ShowtimeSeatApi = {
  getAll: () => axios.get('/showtimeseats'),
  getById: (Id) => axios.get(`/showtimeseats/${Id}`),
  create: (data) => axios.post('/showtimeseats', data),
  update: (Id, data) => axios.put(`/showtimeseats/${Id}`, data),
  delete: (Id) => axios.delete(`/showtimeseats/${Id}`),

  // ✅ Thêm phương thức cập nhật trạng thái ghế
  updateStatus: (Id, status) =>
    axios.put(`/showtimeseats/${Id}`, { Status: status }),

  generateByShowtime: (showtimeId) =>
    axios.post(`/showtimes/${showtimeId}/generate-seats`),

  // ✅ Server-side pagination
  getPaged: ({
    page = 1,
    limit = 200,
    showtimeId = '',
    status = '',
    signal,
  } = {}) => {
    const params = new URLSearchParams({ page, limit });
    if (showtimeId) params.append('showtime_id', showtimeId);
    if (status) params.append('status', status);
    return axios.get(`/showtimeseats/paged?${params}`, { signal });
  },

  // ✅ Thêm phương thức cập nhật theo showtime
  updateByShowtime: (showtimeId, data) =>
    axios.put(`/showtimeseats/showtime/${showtimeId}`, data),
};

export default ShowtimeSeatApi;
