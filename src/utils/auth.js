import { jwtDecode } from "jwt-decode";

export const isTokenExpired = () => {
  const token = localStorage.getItem("token");
  if (!token) return true;
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // tính bằng giây
    return decoded.exp < currentTime;
  } catch (e) {
    return true; // nếu token không hợp lệ thì coi như hết hạn
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("fullname");
  localStorage.removeItem("UserId");
  window.location.href = "http://localhost:3000/login";
};
