

import { useState, useEffect, useCallback } from "react";
import RoleApi from "../../../../api/RoleApi";
import Swal from "sweetalert2";

export const useRole = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await RoleApi.getAll();
      const data = response.data.data || response.data || [];
      setRoles(data);
    } catch (error) {
      console.error("❌ Lỗi load roles:", error);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Không thể tải dữ liệu vai trò!",
        showConfirmButton: false,
        timer: 3000,
      });
      setRoles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

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

  // Add role
  const handleAddRole = useCallback(async (formData) => {
    setIsSubmitting(true);
    try {
      const response = await RoleApi.create(formData);
      const newRole = response.data.data || response.data;
      setRoles((prev) => [newRole, ...prev]);
      showToast("success", "🎉 Thêm vai trò thành công!");
      return true;
    } catch (error) {
      console.error("❌ Lỗi add role:", error);
      showToast("error", error.response?.data?.message || "❌ Thêm thất bại!");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [showToast]);

  // Update role
  const handleUpdateRole = useCallback(async (roleId, formData) => {
    setIsSubmitting(true);
    try {
      const response = await RoleApi.update(roleId, formData);
      const updatedRole = response.data.data || response.data;
      setRoles((prev) => prev.map((r) => r.RoleId === roleId ? updatedRole : r));
      showToast("success", "✅ Cập nhật vai trò thành công!");
      return true;
    } catch (error) {
      console.error("❌ Lỗi update role:", error);
      showToast("error", error.response?.data?.message || "❌ Cập nhật thất bại!");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [showToast]);

  // Delete role
  const handleDeleteRole = useCallback(async (roleId) => {
    try {
      await RoleApi.delete(roleId);
      setRoles((prev) => prev.filter((r) => r.RoleId !== roleId));
      showToast("success", "🗑️ Xóa vai trò thành công!");
      return true;
    } catch (error) {
      console.error("❌ Lỗi delete role:", error);
      showToast("error", error.response?.data?.message || "❌ Xóa thất bại!");
      return false;
    }
  }, [showToast]);

  // Toggle status
  const handleToggleStatus = useCallback(async (roleId, currentStatus) => {
    try {
      const role = roles.find(r => r.RoleId === roleId);
      if (!role) return;
      
      const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
      await RoleApi.update(roleId, {
        RoleName: role.RoleName,
        Description: role.Description,
        Status: newStatus,
      });
      
      setRoles((prev) => prev.map((r) =>
        r.RoleId === roleId ? { ...r, Status: newStatus } : r
      ));
      
      showToast("success", `✅ Đã ${newStatus === "Active" ? "kích hoạt" : "khóa"} vai trò!`);
    } catch (error) {
      console.error("❌ Lỗi toggle status:", error);
      showToast("error", "❌ Không thể cập nhật trạng thái!");
    }
  }, [roles, showToast]);

  return {
    roles,
    setRoles,
    loading,
    isSubmitting,
    setIsSubmitting,
    loadData,
    handleAddRole,
    handleUpdateRole,
    handleDeleteRole,
    handleToggleStatus,
    showToast,
  };
};