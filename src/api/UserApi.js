// src/api/UserApi.js
import axiosAdmin from "./AxiosAdmin";

const UserApi = {
  getAll: () => axiosAdmin.get("/users"),
  getById: (id) => axiosAdmin.get(`/users/${id}`),
  
  // ✅ Lấy user theo email
  getByEmail: (email) => axiosAdmin.get(`/users?email=${email}`),
  
  // ✅ Lấy user theo vai trò
  getByRole: (roleId) => axiosAdmin.get(`/users?roleId=${roleId}`),
  
  create: (data) => axiosAdmin.post("/users", data),
  update: (id, data) => axiosAdmin.put(`/users/${id}`, data),
  delete: (id) => axiosAdmin.delete(`/users/${id}`),

  // ✅ Server-side pagination
  getPaged: ({ page = 1, limit = 10, search = "", status = "", signal } = {}) => {
    const params = new URLSearchParams({ page, limit });
    if (search) params.append("search", search);
    if (status) params.append("status", status);
    return axiosAdmin.get(`/users/paged?${params}`, { signal });
  },
};

export default UserApi;