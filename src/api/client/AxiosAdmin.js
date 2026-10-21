// src/api/client/AxiosAdmin.js
import axios from "axios";

const BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const AxiosAdmin = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // ⭐ BẮT BUỘC để cookie hoạt động
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ════════════════════════════════════════════════════════
// REQUEST INTERCEPTOR — Gắn Bearer Token
// ════════════════════════════════════════════════════════
AxiosAdmin.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Biến module-scope để queue request khi đang refresh ───
let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

const onRefreshFailed = (error) => {
  refreshSubscribers.forEach((cb) => cb(null, error));
  refreshSubscribers = [];
};

const clearAuthStorage = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("fullname");
  localStorage.removeItem("UserId");
  localStorage.removeItem("email");
};

// ════════════════════════════════════════════════════════
// RESPONSE INTERCEPTOR — Auto refresh khi 401
// ════════════════════════════════════════════════════════
AxiosAdmin.interceptors.response.use(
  (response) => response,
  async (error) => {
    // ✅ Bỏ qua lỗi Cancel (nếu có dùng CancelToken ở nơi khác)
    if (axios.isCancel(error) || error?.isSilent) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    // Bỏ qua nếu không phải 401 hoặc đã retry rồi
    if (
      !error.response ||
      error.response.status !== 401 ||
      !originalRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    // Không refresh cho chính các endpoint auth
    const url = originalRequest.url || "";
    if (
      url.includes("/auth/refresh") ||
      url.includes("/login") ||
      url.includes("/auth/logout")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // Nếu đang refresh → xếp hàng chờ
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((token, err) => {
          if (err || !token) {
            return reject(err || new Error("Refresh failed"));
          }
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(AxiosAdmin(originalRequest));
        });
      });
    }

    isRefreshing = true;

    try {
      // Gọi refresh — cookie HttpOnly tự gửi kèm
      const { data } = await axios.post(
        `${BASE_URL}/auth/refresh`,
        {},
        {
          withCredentials: true,
          headers: { Accept: "application/json" },
        }
      );

      const newAccessToken = data.access_token;
      if (!newAccessToken) {
        throw new Error("No access_token in refresh response");
      }

      // Lưu token mới
      localStorage.setItem("access_token", newAccessToken);

      // Cập nhật user info nếu có
      if (data.user) {
        localStorage.setItem("fullname", data.user.FullName || "");
        localStorage.setItem("UserId", data.user.UserId || "");
        localStorage.setItem("email", data.user.Email || "");
        localStorage.setItem("role", data.user.RoleName || "Admin");
      }

      onRefreshed(newAccessToken);

      // Retry request gốc
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return AxiosAdmin(originalRequest);
    } catch (refreshError) {
      console.error("❌ Refresh token failed:", refreshError);

      onRefreshFailed(refreshError);
      clearAuthStorage();

      // Chỉ redirect nếu chưa ở trang login
      if (!window.location.pathname.includes("/auth/sign-in")) {
        window.location.href = "/auth/sign-in";
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default AxiosAdmin;