import axios from '../client/AxiosAdmin';

const MovieCastApi = {
  getAll: () => axios.get('/moviecasts'),
  getById: (CastId) => axios.get(`/moviecasts/${CastId}`),
  create: (data) => axios.post('/moviecasts', data),
  update: (CastId, data) => axios.put(`/moviecasts/${CastId}`, data),
  delete: (CastId) => axios.delete(`/moviecasts/${CastId}`),

  // ✅ Server-side pagination (Đã thêm status)
  getPaged: ({ page = 1, limit = 10, search = '', role = '', status = '', signal } = {}) => {
    const params = new URLSearchParams({ page, limit });
    if (search) params.append('search', search);
    if (role) params.append('role', role);
    if (status) params.append('status', status); // ✅ Thêm dòng này
    return axios.get(`/moviecasts/paged?${params}`, { signal });
  },
};

export default MovieCastApi;