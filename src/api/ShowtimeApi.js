// src/api/ShowtimeApi.js
import axios from "./AxiosAdmin";

const ShowtimeApi = {
  getAll: () => axios.get("/showtimes"),
  getById: (ShowtimeId) => axios.get(`/showtimes/${ShowtimeId}`),
  
  // ✅ Lấy suất chiếu theo phim
  getByMovie: (movieId) => axios.get(`/showtimes?movieId=${movieId}`),
  
  // ✅ Lấy suất chiếu theo phòng
  getByRoom: (roomId) => axios.get(`/showtimes?roomId=${roomId}`),
  
  // ✅ Lấy suất chiếu theo ngày
  getByDate: (date) => axios.get(`/showtimes?date=${date}`),
  
  create: (data) => axios.post("/showtimes", data),
  update: (ShowtimeId, data) => axios.put(`/showtimes/${ShowtimeId}`, data),
  delete: (ShowtimeId) => axios.delete(`/showtimes/${ShowtimeId}`),

  // ✅ Server-side pagination
  getPaged: ({ page = 1, limit = 10, search = "", status = "", signal } = {}) => {
    const params = new URLSearchParams({ page, limit });
    if (search) params.append("search", search);
    if (status) params.append("status", status);
    return axios.get(`/showtimes/paged?${params}`, { signal });
  },
};

export default ShowtimeApi;