import './assets/css/App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import PrivateRoute from './components/PrivateRoute'; // ← thêm dòng này
import { ChakraProvider } from '@chakra-ui/react';
import initialTheme from './theme/theme';
import { useState } from 'react';

export default function Main() {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  return (
    <ChakraProvider theme={currentTheme}>
      <Routes>
        {/* Route công khai — trang đăng nhập */}
        <Route path="auth/*" element={<AuthLayout />} />

        {/* Route được bảo vệ — phải đăng nhập mới vào được */}
        <Route
          path="admin/*"
          element={
            <PrivateRoute>
              <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />
            </PrivateRoute>
          }
        />

        {/* Mặc định → /admin (nếu chưa login sẽ bị PrivateRoute đá về /auth/sign-in) */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
      </Routes>
    </ChakraProvider>
  );
}