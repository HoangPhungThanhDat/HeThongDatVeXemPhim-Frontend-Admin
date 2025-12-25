import axios from "./AxiosAdmin";

const MembershipApi = {
  getAll: () => axios.get("/memberships"),
  getById: (MembershipId) => axios.get(`/memberships/${MembershipId}`),
  create: (data) => axios.post("/memberships", data),
  update: (MembershipId, data) => axios.put(`/memberships/${MembershipId}`, data),
  delete: (MembershipId) => axios.delete(`/memberships/${MembershipId}`),
};

export default MembershipApi;
