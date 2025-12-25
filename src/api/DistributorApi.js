import axios from "./AxiosAdmin";

const DistributorApi = {
  getAll: () => axios.get("/distributors"),
  getById: (DistributorId) => axios.get(`/distributors/${DistributorId}`),
  create: (data) => axios.post("/distributors", data),
  update: (DistributorId, data) => axios.put(`/distributors/${DistributorId}`, data),
  delete: (DistributorId) => axios.delete(`/distributors/${DistributorId}`),
};

export default DistributorApi;
