// src/views/admin/quanlynguoidung/hooks/useUser.js

import { useState, useEffect, useCallback, useMemo } from "react";
import UserApi from "../../../../api/UserApi";
import RoleApi from "../../../../api/RoleApi";
import Swal from "sweetalert2";
import { useServerPagination } from "../../../../hooks/useServerPagination";
import { PAGE_SIZE } from "../constants";

export const useUser = () => {
  const [roles, setRoles] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [view, setView] = useState("list");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Server-side pagination
  const extraParams = useMemo(
    () => ({ search, status: statusFilter }),
    [search, statusFilter]
  );

  const { data: users, total, totalPages, page, loading, goToPage, reload } =
    useServerPagination(UserApi.getPaged, { limit: PAGE_SIZE, extraParams });

  // Load roles
  useEffect(() => {
    RoleApi.getAll()
      .then((res) => setRoles(res.data.data || []))
      .catch(console.error);
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
      position: "top-end",
      icon,
      title: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  }, []);

  // Toggle status
  const handleToggleLock = useCallback(async (userId) => {
    try {
      const user = users.find(u => u.UserId === userId);
      if (!user) return;
      
      const newStatus = user.Status === "Active" ? "Inactive" : "Active";
      await UserApi.update(userId, { ...user, Status: newStatus });
      
      reload();
      showToast("success", `✅ Đã ${newStatus === "Active" ? "kích hoạt" : "khóa"} tài khoản!`);
    } catch (error) {
      console.error("❌ Lỗi toggle status:", error);
      showToast("error", "❌ Không thể cập nhật trạng thái!");
    }
  }, [users, reload, showToast]);

  // Delete user
  const handleDeleteUser = useCallback(async (userId) => {
    try {
      await UserApi.delete(userId);
      reload();
      showToast("success", "🗑️ Xóa người dùng thành công!");
      return true;
    } catch (error) {
      console.error("❌ Lỗi delete:", error);
      showToast("error", error.response?.data?.message || "❌ Xóa thất bại!");
      return false;
    }
  }, [reload, showToast]);

  // Add user
  const handleAddUser = useCallback(async (formData) => {
    setIsSubmitting(true);
    try {
      await UserApi.create(formData);
      reload();
      showToast("success", "🎉 Thêm người dùng thành công!");
      return true;
    } catch (error) {
      console.error("❌ Lỗi add user:", error);
      showToast("error", error.response?.data?.message || "❌ Thêm thất bại!");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [reload, showToast]);

  // Update user
  const handleUpdateUser = useCallback(async (userId, formData) => {
    setIsSubmitting(true);
    try {
      // Remove PasswordHash if empty
      if (!formData.PasswordHash) {
        delete formData.PasswordHash;
      }
      await UserApi.update(userId, formData);
      reload();
      showToast("success", "✅ Cập nhật người dùng thành công!");
      return true;
    } catch (error) {
      console.error("❌ Lỗi update user:", error);
      showToast("error", error.response?.data?.message || "❌ Cập nhật thất bại!");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [reload, showToast]);

  // Stats
  const stats = useMemo(() => ({
    total: total || 0,
    active: users.filter(u => u.Status === "Active").length,
    inactive: users.filter(u => u.Status === "Inactive").length,
    banned: users.filter(u => u.Status === "Banned").length,
  }), [users, total]);

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