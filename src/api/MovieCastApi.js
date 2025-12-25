import axios from "./AxiosAdmin";

const MovieCastApi = {
  getAll: () => axios.get("/moviecasts"),
  getById: (CastId) => axios.get(`/moviecasts/${CastId}`),
  create: (data) => axios.post("/moviecasts", data),
  update: (CastId, data) => axios.put(`/moviecasts/${CastId}`, data),
  delete: (CastId) => axios.delete(`/moviecasts/${CastId}`),
};

export default MovieCastApi;
