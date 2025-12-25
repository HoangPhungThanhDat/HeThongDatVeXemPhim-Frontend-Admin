import { BrowserRouter } from "react-router-dom";
import { useEffect } from "react";
import AdminRoutes from "./routes/AdminRoutes";
import { jwtDecode } from "jwt-decode";

function App() {
  //  Hàm kiểm tra token hết hạn
  const isTokenExpired = () => {
    const token = localStorage.getItem("token");
    if (!token) return false; //chưa đăng nhập

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000; // giây
      return decoded.exp < currentTime;
    } catch (e) {
      return true;
    }
  };

  // Hàm logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("fullname");
    localStorage.removeItem("UserId");
    window.location.href = "http://localhost:3000/login";
  };

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      // Chỉ kiểm tra nếu đã đăng nhập
      if (token && isTokenExpired()) {
        logout();
      }
    };
    // Kiểm tra khi app load
    checkToken();
    // Kiểm tra định kỳ mỗi phút
    const interval = setInterval(checkToken, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <BrowserRouter>
      <AdminRoutes />
    </BrowserRouter>
  );
}

export default App;