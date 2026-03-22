import axios from "./AxiosAdmin";

const ShowtimeSeatApi = {
  getAll: () => axios.get("/showtimeseats"),
  getById: (Id) => axios.get(`/showtimeseats/${Id}`),
  create: (data) => axios.post("/showtimeseats", data),
  update: (Id, data) => axios.put(`/showtimeseats/${Id}`, data),
  delete: (Id) => axios.delete(`/showtimeseats/${Id}`),

  // ✅ THÊM: Tạo ghế tự động theo showtime
  generateByShowtime: (showtimeId) =>
    axios.post(`/showtimes/${showtimeId}/generate-seats`),
};

export default ShowtimeSeatApi;