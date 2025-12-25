import axiosAdmin from "./AxiosAdmin";

const UserApi = {
  getAll: () => axiosAdmin.get("/users"), // lấy tất cả user
  getById: (id) => axiosAdmin.get(`/users/${id}`), // lấy user theo id
  create: (data) => axiosAdmin.post("/users", data), // thêm user
  update: (id, data) => axiosAdmin.put(`/users/${id}`, data), // cập nhật user
  delete: (id) => axiosAdmin.delete(`/users/${id}`), // xóa user
};

export default UserApi;
