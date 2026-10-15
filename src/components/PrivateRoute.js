// src/components/PrivateRoute.js
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "utils/auth";

/**
 * PrivateRoute — Chỉ cho phép truy cập nếu đã đăng nhập.
 *
 * Cách dùng:
 *   <PrivateRoute>
 *     <AdminLayout />
 *   </PrivateRoute>
 *
 * Nếu chưa login → redirect về /auth/sign-in
 * Lưu lại `from` để sau khi login có thể quay lại trang cũ.
 */
const PrivateRoute = ({ children }) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    return (
      <Navigate
        to="/auth/sign-in"
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
};

export default PrivateRoute;