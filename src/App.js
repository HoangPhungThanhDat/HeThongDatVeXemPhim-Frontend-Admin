// src/App.js
import React, { useState, useMemo } from 'react';
import useTokenRefresh from "hooks/useTokenRefresh";
import './assets/css/App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import PrivateRoute from './components/PrivateRoute';
import { ChakraProvider } from '@chakra-ui/react';
import initialTheme from './theme/theme';
import SignInCentered from 'views/auth/signIn';

export default function Main() {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  
  useTokenRefresh();

  // ✅ Ghi nhớ AdminLayout để tránh bị mount lại khi theme thay đổi
  const memoizedAdminLayout = useMemo(() => {
    return (
      <PrivateRoute>
        <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />
      </PrivateRoute>
    );
  }, [currentTheme]); // Chỉ tạo lại khi theme thay đổi, không tạo lại khi state khác thay đổi

  return (
    <ChakraProvider theme={currentTheme}>
      <Routes>
        {/* Google OAuth callback */}
        <Route path="/login" element={<SignInCentered />} />
        
        {/* Auth (login form) */}
        <Route path="auth/*" element={<AuthLayout />} />

        {/* Admin — yêu cầu đăng nhập */}
        <Route path="admin/*" element={memoizedAdminLayout} />

        {/* Mặc định: / → /admin */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
        
        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </ChakraProvider>
  );
}