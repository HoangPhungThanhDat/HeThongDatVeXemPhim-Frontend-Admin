// src/views/admin/quanlynguoidung/hooks/useUser.js

import { useState, useEffect, useCallback, useMemo } from 'react';
import UserApi from 'api/user/UserApi';
import RoleApi from 'api/user/RoleApi';
import Swal from 'sweetalert2';
import { useServerPagination } from 'hooks/useServerPagination';
import { PAGE_SIZE } from '../constants';

export const useUser = () => {
  const [roles, setRoles] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [view, setView] = useState('list');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Server-side pagination
  const extraParams = useMemo(
    () => ({ search, status: statusFilter }),
    [search, statusFilter],
  );

  const {
    data: users,
    total,
    totalPages,
    page,
    loading,
    goToPage,
    reload,
    prependData, // ✅ Lấy prependData từ hook
  } = useServerPagination(UserApi.getPaged, { limit: PAGE_SIZE, extraParams });

  // Load roles - SỬA LẠI
  useEffect(() => {
    const loadRoles = async () => {
      try {
        const res = await RoleApi.getAll();
        // ✅ Kiểm tra cấu trúc dữ liệu trả về
        let rolesData = [];
        if (res.data?.data) {
          rolesData = res.data.data;
        } else if (res.data) {
          rolesData = res.data;
        } else {
          rolesData = res;
        }

        // ✅ Đảm bảo roles có đủ các trường cần thiết
        const formattedRoles = rolesData.map((role) => ({
          RoleId: role.RoleId || role.id,
          RoleName: role.RoleName || role.name || role.role_name || 'User',
          Description: role.Description || role.description || '',
          Status: role.Status || role.status || 'active',
        }));

        console.log('✅ Roles loaded:', formattedRoles);
        setRoles(formattedRoles);
      } catch (error) {
        console.error('❌ Lỗi load roles:', error);
        // ✅ Fallback roles nếu API lỗi
        setRoles([
          {
            RoleId: 1,
            RoleName: 'Admin',
            Description: 'Quản trị viên',
            Status: 'active',
          },
          {
            RoleId: 2,
            RoleName: 'User',
            Description: 'Người dùng thông thường',
            Status: 'active',
          },
          {
            RoleId: 7,
            RoleName: 'Staff',
            Description: 'Nhân viên',
            Status: 'active',
          },
        ]);
      }
    };

    loadRoles();
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Show toast
  const showToast = useCallback((icon, message) => {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon,
      title: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  }, []);

  // Toggle status
  const handleToggleLock = useCallback(
    async (userId) => {
      try {
        const user = users.find((u) => u.UserId === userId);
        if (!user) return;

        const newStatus = user.Status === 'Active' ? 'Inactive' : 'Active';
        await UserApi.update(userId, { ...user, Status: newStatus });

        reload();
        showToast(
          'success',
          `✅ Đã ${newStatus === 'Active' ? 'kích hoạt' : 'khóa'} tài khoản!`,
        );
      } catch (error) {
        console.error('❌ Lỗi toggle status:', error);
        showToast('error', '❌ Không thể cập nhật trạng thái!');
      }
    },
    [users, reload, showToast],
  );

  // Delete user
  const handleDeleteUser = useCallback(
    async (userId) => {
      try {
        await UserApi.delete(userId);
        reload();
        showToast('success', '🗑️ Xóa người dùng thành công!');
        return true;
      } catch (error) {
        console.error('❌ Lỗi delete:', error);
        showToast('error', error.response?.data?.message || '❌ Xóa thất bại!');
        return false;
      }
    },
    [reload, showToast],
  );

  // ✅ SỬA: Add user - Thêm vào đầu danh sách
  const handleAddUser = useCallback(
    async (formData) => {
      setIsSubmitting(true);
      try {
        const response = await UserApi.create(formData);
        const newUser = response.data?.data || response.data || {};

        // ✅ Tạo object user mới với đầy đủ fields
        const userItem = {
          UserId: newUser.UserId || newUser.id,
          FullName: newUser.FullName || formData.FullName || '',
          Email: newUser.Email || formData.Email || '',
          PhoneNumber: newUser.PhoneNumber || formData.PhoneNumber || '',
          Status: newUser.Status || formData.Status || 'Active',
          RoleId: newUser.RoleId || formData.RoleId || 2,
          CreatedAt: new Date().toISOString(),
          UpdatedAt: new Date().toISOString(),
          // Giữ các field khác
          ...newUser,
        };

        // ✅ THÊM VÀO ĐẦU DANH SÁCH
        prependData(userItem);

        showToast('success', '🎉 Thêm người dùng thành công!');
        return true;
      } catch (error) {
        console.error('❌ Lỗi add user:', error);
        showToast(
          'error',
          error.response?.data?.message || '❌ Thêm thất bại!',
        );
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [prependData, showToast],
  );

  // ✅ SỬA: Update user - Cập nhật và đưa lên đầu
  const handleUpdateUser = useCallback(
    async (userId, formData) => {
      setIsSubmitting(true);
      try {
        // Remove PasswordHash if empty
        if (!formData.PasswordHash) {
          delete formData.PasswordHash;
        }

        const response = await UserApi.update(userId, formData);
        const updatedUser = response.data?.data || response.data || {};

        // ✅ Reload để cập nhật dữ liệu mới
        reload();

        showToast('success', '✅ Cập nhật người dùng thành công!');
        return true;
      } catch (error) {
        console.error('❌ Lỗi update user:', error);
        showToast(
          'error',
          error.response?.data?.message || '❌ Cập nhật thất bại!',
        );
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [reload, showToast],
  );

  // Stats
  const stats = useMemo(
    () => ({
      total: total || 0,
      active: users.filter((u) => u.Status === 'Active').length,
      inactive: users.filter((u) => u.Status === 'Inactive').length,
      banned: users.filter((u) => u.Status === 'Banned').length,
    }),
    [users, total],
  );

  return {
    users,
    roles,
    loading,
    total,
    totalPages,
    page,
    goToPage,
    reload,
    search,
    setSearch,
    searchInput,
    setSearchInput,
    statusFilter,
    setStatusFilter,
    selectedUser,
    setSelectedUser,
    view,
    setView,
    stats,
    isSubmitting,
    setIsSubmitting,
    handleToggleLock,
    handleDeleteUser,
    handleAddUser,
    handleUpdateUser,
    showToast,
  };
};
