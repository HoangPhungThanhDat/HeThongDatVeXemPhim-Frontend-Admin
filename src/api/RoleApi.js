import axios from "./AxiosAdmin";

const RoleApi = {
  getAll: () => axios.get("/roles"),
  getById: (RoleId) => axios.get(`/roles/${RoleId}`),
  create: (data) => axios.post("/roles", data),
  update: (RoleId, data) => axios.put(`/roles/${RoleId}`, data),
  delete: (RoleId) => axios.delete(`/roles/${RoleId}`),
};

export default RoleApi;
