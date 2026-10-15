// src/api/auth/AuthApi.js
import AxiosAdmin from "api/client/AxiosAdmin";

const AuthApi = {
  // ============================================
  // AUTHENTICATION METHODS
  // ============================================

  /**
   * Đăng nhập bằng email và password
   * @param {Object} credentials - { Email, Password }
   * @returns {Promise} - { success, access_token, expires_in, user }
   */
  Login: (credentials) => AxiosAdmin.post("/login", credentials),

  /**
   * Đăng xuất khỏi thiết bị hiện tại.
   * Backend sẽ revoke refresh token + xóa cookie HttpOnly.
   */
  Logout: () => AxiosAdmin.post("/logout"),

  /**
   * Đăng xuất khỏi TẤT CẢ thiết bị.
   * Backend sẽ revoke tất cả refresh token của user.
   */
  LogoutAll: () => AxiosAdmin.post("/auth/logout-all"),

  /**
   * Refresh access token (dùng cookie HttpOnly).
   * Được gọi tự động bởi AxiosAdmin interceptor khi gặp 401.
   */
  Refresh: () => AxiosAdmin.post("/auth/refresh"),

  /**
   * Đăng ký tài khoản mới
   * @param {Object} userData - { FullName, Email, Password, ... }
   * @returns {Promise} - { user }
   */
  Register: (userData) => AxiosAdmin.post("/register", userData),

  /**
   * Lấy thông tin user hiện tại (từ access token).
   * @returns {Promise} - { success, user }
   */
  Me: () => AxiosAdmin.get("/auth/me"),

  // ============================================
  // GOOGLE OAUTH METHODS
  // ============================================

  /**
   * Đăng nhập bằng Google - Redirect đến Google OAuth
   * @description Chuyển hướng trình duyệt đến trang đăng nhập Google
   */
  googleLogin: () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  },

  /**
   * Xác thực token từ Google callback
   * @param {string} token - JWT access token từ Google
   * @returns {Promise} - { success, token, user }
   */
  verifyGoogleToken: (token) => {
    console.log(
      "🔍 Verifying Google token:",
      token ? token.substring(0, 30) + "..." : "No token"
    );
    return AxiosAdmin.get(
      `/auth/google/check?token=${encodeURIComponent(token)}`
    );
  },

  /**
   * Lấy URL đăng nhập Google
   * @returns {string} - URL đăng nhập Google
   */
  getGoogleAuthUrl: () => "http://localhost:5000/api/auth/google",

  /**
   * Alias cho verifyGoogleToken
   */
  handleGoogleCallback: (token) => AuthApi.verifyGoogleToken(token),

  // ============================================
  // USER PROFILE METHODS
  // ============================================

  /**
   * Lấy thông tin profile người dùng
   * @returns {Promise} - { user }
   */
  getProfile: () => AxiosAdmin.get("/profile"),

  /**
   * Cập nhật thông tin profile
   * @param {Object} userData - Dữ liệu cần cập nhật
   * @returns {Promise} - { user }
   */
  updateProfile: (userData) => AxiosAdmin.put("/profile", userData),

  /**
   * Đổi mật khẩu
   * @param {Object} passwordData - { current_password, new_password, new_password_confirmation }
   * @returns {Promise} - { message }
   */
  changePassword: (passwordData) =>
    AxiosAdmin.put("/change-password", passwordData),
};

export default AuthApi;