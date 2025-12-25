import axios from "./AxiosAdmin";

const OrderDetailApi = {
  getAll: () => axios.get("/orderdetails"),
  getById: (OrderDetailId) => axios.get(`/orderdetails/${OrderDetailId}`),
  create: (data) => axios.post("/orderdetails", data),
  update: (OrderDetailId, data) => axios.put(`/orderdetails/${OrderDetailId}`, data),
  delete: (OrderDetailId) => axios.delete(`/orderdetails/${OrderDetailId}`),
};

export default OrderDetailApi;
