import axios from "./AxiosAdmin";

const StaffApi = {
  getAll: () => axios.get("/staffs"),
  getById: (StaffId) => axios.get(`/staffs/${StaffId}`),
  create: (data) => axios.post("/staffs", data),
  update: (StaffId, data) => axios.put(`/staffs/${StaffId}`, data),
  delete: (StaffId) => axios.delete(`/staffs/${StaffId}`),
};

export default StaffApi;
