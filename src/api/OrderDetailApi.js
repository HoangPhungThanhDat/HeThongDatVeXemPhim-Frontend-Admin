// src/api/OrderDetailApi.js
import axios from "./AxiosAdmin";

const OrderDetailApi = {
  // ✅ Lấy tất cả chi tiết đơn hàng
  getAll: () => axios.get("/orderdetails"),
  
  // ✅ Lấy chi tiết đơn hàng theo ID
  getById: (OrderDetailId) => axios.get(`/orderdetails/${OrderDetailId}`),
  
  // ✅ Lấy chi tiết đơn hàng theo OrderId (QUAN TRỌNG)
  getByOrder: (orderId) => axios.get(`/orderdetails?orderId=${orderId}`),
  
  // ✅ Lấy chi tiết đơn hàng theo OrderId và có phân trang
  getByOrderPaged: (orderId, { page = 1, limit = 10 } = {}) => {
    const params = new URLSearchParams({ page, limit });
    if (orderId) params.append("orderId", orderId);
    return axios.get(`/orderdetails/paged?${params}`);
  },
  
  // ✅ Tạo mới chi tiết đơn hàng
  create: (data) => axios.post("/orderdetails", data),
  
  // ✅ Cập nhật chi tiết đơn hàng
  update: (OrderDetailId, data) => axios.put(`/orderdetails/${OrderDetailId}`, data),
  
  // ✅ Xóa chi tiết đơn hàng
  delete: (OrderDetailId) => axios.delete(`/orderdetails/${OrderDetailId}`),
  
  // ✅ Xóa tất cả chi tiết đơn hàng theo OrderId
  deleteByOrder: (orderId) => axios.delete(`/orderdetails?orderId=${orderId}`),
  
  // ✅ Server-side pagination với filter
  getPaged: ({ page = 1, limit = 10, orderId = "", search = "", signal } = {}) => {
    const params = new URLSearchParams({ page, limit });
    if (orderId) params.append("orderId", orderId);
    if (search) params.append("search", search);
    return axios.get(`/orderdetails/paged?${params}`, { signal });
  },
};

export default OrderDetailApi;