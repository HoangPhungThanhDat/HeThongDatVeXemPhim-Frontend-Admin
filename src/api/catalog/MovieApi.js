import axios from '../client/AxiosAdmin';

const MovieApi = {
  getAll: () => axios.get('/movies'),
  getById: (MovieId) => axios.get(`/movies/${MovieId}`),

  // ✅ Lấy phim theo trạng thái
  getByStatus: (status) => axios.get(`/movies?status=${status}`),

  // ✅ Lấy phim đang chiếu
  getNowShowing: () => axios.get(`/movies?status=NowShowing`),

  // ✅ Lấy phim sắp chiếu
  getComingSoon: () => axios.get(`/movies?status=ComingSoon`),

  create: (data, config) => axios.post('/movies', data, config),

  update: (MovieId, data, config) => {
    if (data instanceof FormData) {
      data.append('_method', 'PUT');
      return axios.post(`/movies/${MovieId}`, data, config);
    }
    return axios.put(`/movies/${MovieId}`, data, config);
  },

  delete: (MovieId) => axios.delete(`/movies/${MovieId}`),

  // ✅ Server-side pagination
  getPaged: ({
    page = 1,
    limit = 10,
    search = '',
    status = '',
    signal,
  } = {}) => {
    const params = new URLSearchParams({ page, limit });
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    return axios.get(`/movies/paged?${params}`, { signal });
  },

  // ✅ Auto update status
  autoUpdateStatus: () => axios.post('/movies/auto-update-status'),

  // ✅ Update single movie status
  updateSingleStatus: (movieId) =>
    axios.post(`/movies/update-status/${movieId}`),

  // ✅ Thêm: Lấy phim kèm cast members
  getWithCast: (MovieId) => axios.get(`/movies/${MovieId}?include=castMembers`),
};

export default MovieApi;
