// src/api/AxiosAdmin.js
import axios from "axios";

// Tạo instance axios với cấu hình mặc định
const AxiosAdmin = axios.create({
  baseURL: "http://localhost:5000/api",  // ✅ Sửa thành cổng 5000 (backend của bạn)
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ============================================
// INTERCEPTOR REQUEST - Thêm token vào header
// ============================================
AxiosAdmin.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("✅ Token added to request:", token.substring(0, 20) + "...");
    } else {
      console.log("⚠️ No token found in localStorage");
    }
    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// ============================================
// INTERCEPTOR RESPONSE - Xử lý lỗi token
// ============================================
AxiosAdmin.interceptors.response.use(
  (response) => {
    console.log("✅ Response success:", response.config.url);
    return response;
  },
  (error) => {
    console.error("❌ Response error:", error.response?.status, error.response?.data);
    
    // Nếu token hết hạn (401) hoặc không có quyền (403)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.log("🔴 Token expired or invalid, logging out...");
      
      // Xóa toàn bộ thông tin đăng nhập
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("fullname");
      localStorage.removeItem("UserId");
      localStorage.removeItem("email");
      
      // Chuyển về trang đăng nhập
      window.location.href = "/login";
    }
    
    return Promise.reject(error);
  }
);

// ============================================
// EXPORT
// ============================================
export default AxiosAdmin;