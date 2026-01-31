import axios from "./AxiosAdmin";

const FoodAndDrinkApi = {
  getAll: () => axios.get("/foodanddrinks"),
  getById: (ItemId) => axios.get(`/foodanddrinks/${ItemId}`),
  create: (data, config) => axios.post("/foodanddrinks", data, config),
  update: (ItemId, data, config) => {
    // Nếu data là FormData, thêm _method=PUT vào
    if (data instanceof FormData) {
      data.append("_method", "PUT");
      return axios.post(`/foodanddrinks/${ItemId}`, data, config);
    }
    // Nếu không phải FormData (chỉ JSON), vẫn có thể dùng PUT
    return axios.put(`/foodanddrinks/${ItemId}`, data, config);
  },
  delete: (ItemId) => axios.delete(`/foodanddrinks/${ItemId}`),
};

export default FoodAndDrinkApi;
