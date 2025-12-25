import axios from "./AxiosAdmin";

const OrderApi = {
  getAll: () => axios.get("/foodanddrinks"),
  getById: (ItemId) => axios.get(`/foodanddrinks/${ItemId}`),
  create: (data) => axios.post("/foodanddrinks", data),
  update: (ItemId, data) => axios.put(`/foodanddrinks/${ItemId}`, data),
  delete: (ItemId) => axios.delete(`/foodanddrinks/${ItemId}`),
};

export default OrderApi;
