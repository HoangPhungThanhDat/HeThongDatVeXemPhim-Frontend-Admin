import axios from "./AxiosAdmin";

const ShowtimeApi = {
  getAll: () => axios.get("/showtimes"),
  getById: (ShowtimeId) => axios.get(`/showtimes/${ShowtimeId}`),
  create: (data) => axios.post("/showtimes", data),
  update: (ShowtimeId, data) => axios.put(`/showtimes/${ShowtimeId}`, data),
  delete: (ShowtimeId) => axios.delete(`/showtimes/${ShowtimeId}`),
};

export default ShowtimeApi;
