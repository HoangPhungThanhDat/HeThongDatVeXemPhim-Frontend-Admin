// src/api/CinemasApi.js
import axios from '../client/AxiosAdmin';

const CinemasApi = {
  getAll: () => axios.get('/cinemas'),
  getById: (CinemaId) => axios.get(`/cinemas/${CinemaId}`),

  // ✅ Lấy rạp theo thành phố
  getByCity: (city) => axios.get(`/cinemas?city=${city}`),

  create: (data, config) => axios.post('/cinemas', data, config),
  update: (CinemaId, data, config) => {
    if (data instanceof FormData) {
      data.append('_method', 'PUT');
      return axios.post(`/cinemas/${CinemaId}`, data, config);
    }
    return axios.put(`/cinemas/${CinemaId}`, data, config);
  },
  delete: (CinemaId) => axios.delete(`/cinemas/${CinemaId}`),

  // ✅ Server-side pagination
  getPaged: ({
    page = 1,
    limit = 10,
    search = '',
    city = '',
    status = '',
    signal,
  } = {}) => {
    const params = new URLSearchParams({ page, limit });
    if (search) params.append('search', search);
    if (city) params.append('city', city);
    if (status) params.append('status', status);
    return axios.get(`/cinemas/paged?${params}`, { signal });
  },
};

export default CinemasApi;
