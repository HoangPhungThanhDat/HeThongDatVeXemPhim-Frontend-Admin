import axios from "./AxiosAdmin";

const ShowtimeApi = {
  getAll:  ()                   => axios.get("/showtimes"),
  getById: (ShowtimeId)         => axios.get(`/showtimes/${ShowtimeId}`),
  create:  (data)               => axios.post("/showtimes", data),
  update:  (ShowtimeId, data)   => axios.put(`/showtimes/${ShowtimeId}`, data),
  delete:  (ShowtimeId)         => axios.delete(`/showtimes/${ShowtimeId}`),

  // ✅ Server-side pagination
  getPaged: ({ page = 1, limit = 10, search = "", status = "", signal } = {}) => {
    const params = new URLSearchParams({ page, limit });
    if (search) params.append("search", search);
    if (status) params.append("status", status);
    return axios.get(`/showtimes/paged?${params}`, { signal });
  },
};

export default ShowtimeApi;