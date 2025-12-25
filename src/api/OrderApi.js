import axios from "./AxiosAdmin";

const OrderApi = {
  getAll: () => axios.get("/orders"),
  getById: (OrderId) => axios.get(`/orders/${OrderId}`),
  create: (data) => axios.post("/orders", data),
  update: (OrderId, data) => axios.put(`/orders/${OrderId}`, data),
  delete: (OrderId) => axios.delete(`/orders/${OrderId}`),
};

export default OrderApi;
