import axios from "./AxiosAdmin";

const GenreApi = {
  getAll: () => axios.get("/genres"),
  getById: (GenreId) => axios.get(`/genres/${GenreId}`),
  create: (data) => axios.post("/genres", data),
  update: (GenreId, data) => axios.put(`/genres/${GenreId}`, data),
  delete: (GenreId) => axios.delete(`/genres/${GenreId}`),
};

export default GenreApi;
