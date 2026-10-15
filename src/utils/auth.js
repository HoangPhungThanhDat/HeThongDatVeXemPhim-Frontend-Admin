
import AuthApi from "api/auth/AuthApi";

/**
 * Xóa toàn bộ thông tin auth khỏi localStorage.
 */
export const clearAuthStorage = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("role");
  localStorage.removeItem("fullname");
  localStorage.removeItem("UserId");
  localStorage.removeItem("email");
};

/**
 * Lưu thông tin user sau khi login thành công.
 */
export const saveAuthData = (accessToken, user) => {
  localStorage.setItem("access_token", accessToken);
  localStorage.setItem("role", user.RoleName || "Admin");
  localStorage.setItem("fullname", user.FullName || "");
  localStorage.setItem("UserId", user.UserId || "");
  localStorage.setItem("email", user.Email || "");
};

/**
 * Đăng xuất khỏi thiết bị hiện tại.
 *  - Gọi API để backend revoke refresh token + xóa cookie HttpOnly
 *  - Sau đó xóa localStorage
 *  - Redirect về /auth/sign-in
 */
export const logout = async () => {
  try {
    await AuthApi.Logout();
  } catch (e) {
    console.warn("Logout API failed:", e);
  } finally {
    clearAuthStorage();
    window.location.href = "/auth/sign-in";
  }
};

/**
 * Đăng xuất khỏi TẤT CẢ thiết bị.
 */
export const logoutAll = async () => {
  try {
    await AuthApi.LogoutAll();
  } catch (e) {
    console.warn("LogoutAll API failed:", e);
  } finally {
    clearAuthStorage();
    window.location.href = "/auth/sign-in";
  }
};

/**
 * Kiểm tra user đã đăng nhập chưa.
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem("access_token");
};