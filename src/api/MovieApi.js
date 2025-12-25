import axios from "./AxiosAdmin";

const MovieApi = {
  getAll: () => axios.get("/movies"),
  getById: (MovieId) => axios.get(`/movies/${MovieId}`),
  create: (data,config) => axios.post("/movies", data,config),
  update: (MovieId, data, config) => {
    // Nếu data là FormData, thêm _method=PUT vào
    if (data instanceof FormData) {
      data.append("_method", "PUT");
      return axios.post(`/movies/${MovieId}`, data, config);
    }
    // Nếu không phải FormData (chỉ JSON), vẫn có thể dùng PUT
    return axios.put(`/movies/${MovieId}`, data, config);
  },
  delete: (MovieId) => axios.delete(`/movies/${MovieId}`),
};

export default MovieApi;
