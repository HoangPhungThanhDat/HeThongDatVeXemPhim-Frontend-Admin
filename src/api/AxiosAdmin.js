import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

//  Gắn token vào mọi request
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Kiểm tra response: nếu token hết hạn → tự động logout
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
   

      // Xóa toàn bộ thông tin đăng nhập
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("fullname");
      localStorage.removeItem("UserId");

      // Chuyển về trang đăng nhập
      window.location.href = "http://localhost:3000/login";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;