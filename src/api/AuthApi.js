// src/api/AuthApi.js
import axios from "./AxiosAdmin";

const AuthApi = {
    // ============================================
    // AUTHENTICATION METHODS
    // ============================================
    
    /**
     * Đăng nhập bằng email và password
     * @param {Object} Credentials - { Email, Password }
     * @returns {Promise} - { token, user }
     */
    Login: (Credentials) => axios.post("/login", Credentials),
    
    /**
     * Đăng xuất
     * @returns {Promise} - { message }
     */
    Logout: () => axios.post("/logout"),
    
    /**
     * Đăng ký tài khoản mới
     * @param {Object} userData - { FullName, Email, Password, ... }
     * @returns {Promise} - { user }
     */
    Register: (userData) => axios.post("/register", userData),
    
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
     * @param {string} token - JWT token từ Google
     * @returns {Promise} - { success, token, user }
     */
    verifyGoogleToken: (token) => {
        console.log("🔍 Verifying Google token:", token ? token.substring(0, 30) + "..." : "No token");
        return axios.get(`/auth/google/check?token=${token}`);
    },
    
    /**
     * Lấy URL đăng nhập Google
     * @returns {string} - URL đăng nhập Google
     */
    getGoogleAuthUrl: () => "http://localhost:5000/api/auth/google",
    
    /**
     * Kiểm tra trạng thái đăng nhập Google (callback redirect)
     * @param {string} token - Token từ URL
     * @returns {Promise} - { success, token, user }
     */
    handleGoogleCallback: (token) => {
        return AuthApi.verifyGoogleToken(token);
    },
    
    // ============================================
    // USER PROFILE METHODS
    // ============================================
    
    /**
     * Lấy thông tin profile người dùng
     * @returns {Promise} - { user }
     */
    getProfile: () => axios.get("/profile"),
    
    /**
     * Cập nhật thông tin profile
     * @param {Object} userData - Dữ liệu cần cập nhật
     * @returns {Promise} - { user }
     */
    updateProfile: (userData) => axios.put("/profile", userData),
    
    /**
     * Đổi mật khẩu
     * @param {Object} passwordData - { current_password, new_password, new_password_confirmation }
     * @returns {Promise} - { message }
     */
    changePassword: (passwordData) => axios.put("/change-password", passwordData),
};

export default AuthApi;