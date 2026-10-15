// src/hooks/useTokenRefresh.js
import { useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import AuthApi from "api/auth/AuthApi";

/**
 * Tự động refresh access token trước khi hết hạn.
 *
 * Cách hoạt động:
 *  - Cứ 60 giây kiểm tra 1 lần
 *  - Nếu access token còn < 2 phút → gọi /auth/refresh
 *  - Không làm gì nếu chưa login
 */
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
          } finally {
            isRefreshingRef.current = false;
          }
        }
      } catch (e) {
        // Token malformed → bỏ qua, để interceptor xử lý
      }
    };

    checkIn1Minute();
    const interval = setInterval(checkAndRefresh, 60 * 1000);

    function checkIn1Minute() {
      // Kiểm tra ngay lập tức
      checkAndRefresh();
    }

    return () => clearInterval(interval);
  }, []);
}