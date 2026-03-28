import axios from "./AxiosAdmin";

const ShowtimeSeatApi = {
  getAll: () => axios.get("/showtimeseats"),
  getById: (Id) => axios.get(`/showtimeseats/${Id}`),
  create: (data) => axios.post("/showtimeseats", data),
  update: (Id, data) => axios.put(`/showtimeseats/${Id}`, data),
  delete: (Id) => axios.delete(`/showtimeseats/${Id}`),

  generateByShowtime: (showtimeId) =>
    axios.post(`/showtimes/${showtimeId}/generate-seats`),

  // ✅ Server-side pagination
  getPaged: ({ page = 1, limit = 20, showtimeId = "", status = "", signal } = {}) => {
    const params = new URLSearchParams({ page, limit });
    if (showtimeId) params.append("showtime_id", showtimeId);
    if (status)     params.append("status", status);
    return axios.get(`/showtimeseats/paged?${params}`, { signal });
  },
};

export default ShowtimeSeatApi;