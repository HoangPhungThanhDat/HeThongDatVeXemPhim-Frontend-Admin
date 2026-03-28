import axios from "./AxiosAdmin";

const MovieApi = {
  getAll: () => axios.get("/movies"),
  getById: (MovieId) => axios.get(`/movies/${MovieId}`),

  create: (data, config) => axios.post("/movies", data, config),

  update: (MovieId, data, config) => {
    if (data instanceof FormData) {
      data.append("_method", "PUT");
      return axios.post(`/movies/${MovieId}`, data, config);
    }
    return axios.put(`/movies/${MovieId}`, data, config);
  },

  delete: (MovieId) => axios.delete(`/movies/${MovieId}`),

  // ✅ Server-side pagination
  getPaged: ({ page = 1, limit = 10, search = "", status = "", signal } = {}) => {
    const params = new URLSearchParams({ page, limit });
    if (search) params.append("search", search);
    if (status) params.append("status", status);
    return axios.get(`/movies/paged?${params}`, { signal });
  },
};

export default MovieApi;