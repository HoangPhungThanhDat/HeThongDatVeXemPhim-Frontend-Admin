
import AxiosAdmin from "api/client/AxiosAdmin";

const AuthApi = {
  // ============================================
  // AUTHENTICATION METHODS
  // ============================================

  Login: (credentials) => AxiosAdmin.post("/login", credentials),
  Logout: () => AxiosAdmin.post("/logout"),
  LogoutAll: () => AxiosAdmin.post("/auth/logout-all"),
  Refresh: () => AxiosAdmin.post("/auth/refresh"),
  Register: (userData) => AxiosAdmin.post("/register", userData),
  Me: () => AxiosAdmin.get("/auth/me"),

  // ============================================
  // GOOGLE OAUTH METHODS (Dùng fwd.host + localhost)
  // ============================================

  googleLogin: () => {
    // Chuyển sang localhost
    window.location.href = "https://fwd.host/http://localhost/api/auth/google";
  },

  verifyGoogleToken: (token) => {
    console.log(
      "🔍 Verifying Google token:",
      token ? token.substring(0, 30) + "..." : "No token"
    );
    return AxiosAdmin.get(
      `/auth/google/check?token=${encodeURIComponent(token)}`
    );
  },

  getGoogleAuthUrl: () => {
    // Chuyển sang localhost
    return "https://fwd.host/http://localhost/api/auth/google";
  },

  handleGoogleCallback: (token) => AuthApi.verifyGoogleToken(token),

  // ============================================
  // USER PROFILE METHODS
  // ============================================

  getProfile: () => AxiosAdmin.get("/profile"),
  updateProfile: (userData) => AxiosAdmin.put("/profile", userData),
  changePassword: (passwordData) =>
    AxiosAdmin.put("/change-password", passwordData),
};

export default AuthApi;