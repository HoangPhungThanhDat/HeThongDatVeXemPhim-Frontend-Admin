import axios from "./AxiosAdmin";

const CinemasApi = {
  getAll: () => axios.get("/cinemas"),
  getById: (CinemaId) => axios.get(`/cinemas/${CinemaId}`),
  create: (data, config) => axios.post("/cinemas", data, config),
  update: (CinemaId, data, config) => {
    // Nếu data là FormData, thêm _method=PUT vào
    if (data instanceof FormData) {
      data.append("_method", "PUT");
      return axios.post(`/cinemas/${CinemaId}`, data, config);
    }
    // Nếu không phải FormData (chỉ JSON), vẫn có thể dùng PUT
    return axios.put(`/cinemas/${CinemaId}`, data, config);
  },

  delete: (CinemaId) => axios.delete(`/cinemas/${CinemaId}`),
};

export default CinemasApi;