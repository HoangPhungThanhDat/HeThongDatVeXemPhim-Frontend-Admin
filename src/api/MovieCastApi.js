import axios from "./AxiosAdmin";

const MovieCastApi = {
  getAll:  ()             => axios.get("/moviecasts"),
  getById: (CastId)       => axios.get(`/moviecasts/${CastId}`),
  create:  (data)         => axios.post("/moviecasts", data),
  update:  (CastId, data) => axios.put(`/moviecasts/${CastId}`, data),
  delete:  (CastId)       => axios.delete(`/moviecasts/${CastId}`),

  // ✅ Server-side pagination
  getPaged: ({ page = 1, limit = 10, search = "", role = "", signal } = {}) => {
    const params = new URLSearchParams({ page, limit });
    if (search) params.append("search", search);
    if (role)   params.append("role", role);
    return axios.get(`/moviecasts/paged?${params}`, { signal });
  },
};

export default MovieCastApi;