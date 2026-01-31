import axios from "./AxiosAdmin";

const NewApi = {
  getAll: () => axios.get("/news"),
  getById: (NewsId) => axios.get(`/news/${NewsId}`),
  create: (data,config) => axios.post("/news", data,config),
  update: (NewsId, data, config) => {
    // Nếu data là FormData, thêm _method=PUT vào
    if (data instanceof FormData) {
      data.append("_method", "PUT");
      return axios.post(`/news/${NewsId}`, data, config);
    }
    // Nếu không phải FormData (chỉ JSON), vẫn có thể dùng PUT
    return axios.put(`/news/${NewsId}`, data, config);
  },
  delete: (NewsId) => axios.delete(`/news/${NewsId}`),
};

export default NewApi;
