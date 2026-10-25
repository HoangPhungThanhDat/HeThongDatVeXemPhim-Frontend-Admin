// src/hooks/useTokenRefresh.js
import { useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import AuthApi from "api/auth/AuthApi";

export default function useTokenRefresh() {
  const isRefreshingRef = useRef(false);

  useEffect(() => {
    const checkAndRefresh = async () => {
      if (isRefreshingRef.current) return;

      const token = localStorage.getItem("access_token");
      if (!token) return;

      try {
        const { exp } = jwtDecode(token);
        const now = Math.floor(Date.now() / 1000);
        const secondsLeft = exp - now;

        // Còn < 120 giây → refresh ngay
        if (secondsLeft < 120 && secondsLeft > -60) {
          isRefreshingRef.current = true;
          try {
            const { data } = await AuthApi.Refresh();
            if (data?.access_token) {
              localStorage.setItem("access_token", data.access_token);
              console.log("✅ Token refreshed proactively");
            }
          } catch (e) {
            console.warn("Proactive refresh failed:", e);
            
            // ⭐ Nếu lỗi 401 (Refresh token hết hạn hoặc không hợp lệ)
            if (e.response && e.response.status === 401) {
              console.log("🧹 Refresh token không hợp lệ, đang đăng xuất...");
              
              // Xóa sạch bộ nhớ tạm
              localStorage.removeItem("access_token");
              localStorage.removeItem("token");
              localStorage.removeItem("role");
              localStorage.removeItem("fullname");
              localStorage.removeItem("UserId");
              localStorage.removeItem("email");

              // ⭐ ĐÁ NGƯỜI DÙNG RA TRANG ĐĂNG NHẬP (Nếu chưa ở trang login)
              if (!window.location.pathname.includes("/auth/sign-in")) {
                window.location.href = "/auth/sign-in";
              }
            }
          } finally {
            isRefreshingRef.current = false;
          }
        }
      } catch (e) {
        // Token malformed (hỏng) → xóa luôn và đá ra ngoài
        localStorage.removeItem("access_token");
        if (!window.location.pathname.includes("/auth/sign-in")) {
          window.location.href = "/auth/sign-in";
        }
      }
    };

    // Kiểm tra ngay lập tức khi vừa vào trang
    checkAndRefresh();
    
    // Cứ 60 giây kiểm tra 1 lần
    const interval = setInterval(checkAndRefresh, 60 * 1000);

    return () => clearInterval(interval);
  }, []);
}