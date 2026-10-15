// src/App.js
import useTokenRefresh from "hooks/useTokenRefresh";
import './assets/css/App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import PrivateRoute from './components/PrivateRoute';
import { ChakraProvider } from '@chakra-ui/react';
import initialTheme from './theme/theme';
import { useState } from 'react';
import SignInCentered from 'views/auth/signIn';

export default function Main() {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  
  // ⭐ Auto refresh access token trước khi hết hạn
  useTokenRefresh();

  return (
    <ChakraProvider theme={currentTheme}>
      <Routes>
        {/* Google OAuth callback */}
        <Route path="/login" element={<SignInCentered />} />
        
        {/* Auth (login form) */}
        <Route path="auth/*" element={<AuthLayout />} />

        {/* Admin — yêu cầu đăng nhập */}
        <Route
          path="admin/*"
          element={
            <PrivateRoute>
              <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />
            </PrivateRoute>
          }
        />

        {/* Mặc định: / → /admin */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
        
        {/* ⭐ Catch-all: bất kỳ path lạ → /admin (PrivateRoute sẽ đá về login nếu chưa login) */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </ChakraProvider>
  );
}