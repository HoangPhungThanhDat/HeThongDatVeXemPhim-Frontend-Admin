import axios from "./AxiosAdmin";

const MovieGenresApi = {
  getAll: () => axios.get("/moviegenres"),
  getById: (MovieGenreId) => axios.get(`/moviegenres/${MovieGenreId}`),
  create: (data) => axios.post("/moviegenres", data),
  update: (MovieGenreId, data) => axios.put(`/moviegenres/${MovieGenreId}`, data),
  delete: (MovieGenreId) => axios.delete(`/moviegenres/${MovieGenreId}`),
};

export default MovieGenresApi;
