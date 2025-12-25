import axios from "./AxiosAdmin";

const BannerApi = {
  getAll: () => axios.get("/banners"),
  getById: (BannerId) => axios.get(`/banners/${BannerId}`),
  create: (data, config) => axios.post("/banners", data, config),
  update: (BannerId, data, config) => {
    // Nếu data là FormData, thêm _method=PUT vào
    if (data instanceof FormData) {
      data.append("_method", "PUT");
      return axios.post(`/banners/${BannerId}`, data, config);
    }
    // Nếu không phải FormData (chỉ JSON), vẫn có thể dùng PUT
    return axios.put(`/banners/${BannerId}`, data, config);
  },

  delete: (BannerId) => axios.delete(`/banners/${BannerId}`),
};

export default BannerApi;
