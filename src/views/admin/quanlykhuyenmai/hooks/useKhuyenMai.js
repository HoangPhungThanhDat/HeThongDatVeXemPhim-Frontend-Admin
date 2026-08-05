// src/views/admin/quanlykhuyenmai/hooks/useKhuyenMai.js

import { useState, useEffect, useCallback, useMemo } from "react";
import { useToast } from "@chakra-ui/react";
import PromotionApi from "../../../../api/PromotionApi";

export function useKhuyenMai() {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [filterType, setFilterType] = useState("Tất cả");
  const toast = useToast();

  // Hàm sắp xếp: Mới nhất lên đầu
  const sortPromos = useCallback((items) => {
    return [...items].sort((a, b) => {
      const timeA = a.createdAt || a.CreatedAt || 0;
      const timeB = b.createdAt || b.CreatedAt || 0;
      
      if (timeA && timeB) {
        return new Date(timeB) - new Date(timeA);
      }
      
      const idA = a.PromotionId || a.id || 0;
      const idB = b.PromotionId || b.id || 0;
      return idB - idA;
    });
  }, []);

  // Lấy dữ liệu từ API
  const fetchPromos = useCallback(async () => {
    setLoading(true);
    try {
      const response = await PromotionApi.getAll();
      const data = response.data.data || response.data || [];
      
      const transformed = data.map((item) => ({
        ...item,
        id: item.PromotionId || item.id,
        title: item.Title || item.title || "",
        code: item.Code || item.code || "",
        description: item.Description || item.description || "",
        imageUrl: item.ImageUrl || item.imageUrl || null,
        discountType: item.DiscountType || item.discountType || "Percentage",
        discountValue: item.DiscountValue || item.discountValue || 0,
        startDate: item.StartDate || item.startDate || "",
        endDate: item.EndDate || item.endDate || "",
        isActive: item.IsActive !== undefined ? item.IsActive : (item.isActive || true),
        status: item.Status || item.status || "Inactive",
        applyFor: item.ApplyFor || item.applyFor || "Tất cả phim",
        applyTarget: item.ApplyTarget || item.applyTarget || "",
        minOrder: item.MinOrder || item.minOrder || 0,
        maxDiscount: item.MaxDiscount || item.maxDiscount || 0,
        usageCount: item.UsageCount || item.usageCount || 0,
        usageLimit: item.UsageLimit || item.usageLimit || 0,
        createdAt: item.CreatedAt || item.createdAt || new Date().toISOString(),
        updatedAt: item.UpdatedAt || item.updatedAt || "",
      }));
      
      const sorted = sortPromos(transformed);
      setPromos(sorted);
    } catch (error) {
      console.error("Lỗi khi tải danh sách khuyến mãi:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách khuyến mãi",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast, sortPromos]);

  useEffect(() => {
    fetchPromos();
  }, [fetchPromos]);

  // Filter
  const filtered = useMemo(() => {
    return promos.filter((p) => {
      const matchSearch = (p.title || "").toLowerCase().includes(search.toLowerCase()) ||
        (p.code || "").toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === "Tất cả" || p.status === filterStatus;
      const matchType = filterType === "Tất cả" || p.discountType === filterType;
      return matchSearch && matchStatus && matchType;
    });
  }, [promos, search, filterStatus, filterType]);

  // Stats
  const counts = useMemo(() => ({
    total: promos.length,
    active: promos.filter((p) => p.status === "Active").length,
    upcoming: promos.filter((p) => p.status === "Scheduled").length,
    ended: promos.filter((p) => p.status === "Inactive" || p.status === "Paused").length,
    totalUsage: promos.reduce((s, p) => s + (p.usageCount || 0), 0),
  }), [promos]);

  // Toggle status
  const toggleStatus = useCallback(async (id) => {
    const promo = promos.find((p) => (p.PromotionId || p.id) === id);
    if (!promo) return;

    const newStatus = promo.status === "Paused" ? "Active" : "Paused";
    try {
      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("Status", newStatus);
      
      await PromotionApi.update(id, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setPromos((prev) => {
        const updated = prev.map((p) =>
          (p.PromotionId || p.id) === id ? { ...p, status: newStatus } : p
        );
        return sortPromos(updated);
      });
      
      toast({
        title: "Thành công",
        description: `Chương trình đã ${newStatus === "Active" ? "bật" : "tạm dừng"}`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể cập nhật trạng thái",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [promos, toast, sortPromos]);

  // Delete
  const deletePromo = useCallback(async (id) => {
    try {
      await PromotionApi.delete(id);
      setPromos((prev) => prev.filter((p) => (p.PromotionId || p.id) !== id));
      toast({
        title: "Thành công",
        description: "Chương trình đã được xóa",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể xóa chương trình",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [toast]);

  // CREATE - Nhận FormData từ form
  const createPromo = useCallback(async (formData) => {
    try {
      // Nếu formData không phải là FormData, tạo mới
      const data = formData instanceof FormData ? formData : new FormData();
      
      // Nếu là object, convert sang FormData
      if (!(formData instanceof FormData)) {
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== '') {
            if (key === 'ImageFile' && value instanceof File) {
              data.append('ImageUrl', value);
            } else if (key !== 'ImageUrl' && key !== 'imageUrl') {
              data.append(key, value);
            }
          }
        });
      }
      
      // Đảm bảo có UserId
      if (!data.has('UserId')) {
        data.append('UserId', localStorage.getItem('UserId') || '');
      }

      const response = await PromotionApi.create(data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      const newPromo = response.data.data || response.data;
      
      const promoItem = {
        ...newPromo,
        id: newPromo.PromotionId || newPromo.id,
        title: newPromo.Title || newPromo.title || "",
        code: newPromo.Code || newPromo.code || "",
        description: newPromo.Description || newPromo.description || "",
        imageUrl: newPromo.ImageUrl || newPromo.imageUrl || null,
        discountType: newPromo.DiscountType || newPromo.discountType || "Percentage",
        discountValue: newPromo.DiscountValue || newPromo.discountValue || 0,
        startDate: newPromo.StartDate || newPromo.startDate || "",
        endDate: newPromo.EndDate || newPromo.endDate || "",
        status: newPromo.Status || newPromo.status || "Active",
        applyFor: newPromo.ApplyFor || newPromo.applyFor || "Tất cả phim",
        applyTarget: newPromo.ApplyTarget || newPromo.applyTarget || "",
        minOrder: newPromo.MinOrder || newPromo.minOrder || 0,
        maxDiscount: newPromo.MaxDiscount || newPromo.maxDiscount || 0,
        usageCount: 0,
        usageLimit: newPromo.UsageLimit || newPromo.usageLimit || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setPromos((prev) => sortPromos([promoItem, ...prev]));
      
      toast({
        title: "Thành công 🎉",
        description: `Đã tạo khuyến mãi "${promoItem.title}" thành công`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      return true;
    } catch (error) {
      console.error("Lỗi khi thêm:", error);
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể thêm chương trình mới",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
  }, [toast, sortPromos]);

  // UPDATE - Nhận FormData từ form
  const updatePromo = useCallback(async (id, formData) => {
    try {
      // Nếu formData không phải là FormData, tạo mới
      const data = formData instanceof FormData ? formData : new FormData();
      
      // Thêm _method=PUT cho Laravel
      if (!data.has('_method')) {
        data.append('_method', 'PUT');
      }
      
      // Nếu là object, convert sang FormData
      if (!(formData instanceof FormData)) {
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== '') {
            if (key === 'ImageFile' && value instanceof File) {
              data.append('ImageUrl', value);
            } else if (key !== 'ImageUrl' && key !== 'imageUrl' && key !== '_method') {
              data.append(key, value);
            }
          }
        });
      }
      
      // Đảm bảo có UserId
      if (!data.has('UserId')) {
        data.append('UserId', localStorage.getItem('UserId') || '');
      }

      await PromotionApi.update(id, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      // Cập nhật state
      setPromos((prev) => {
        const updated = prev.map((p) => {
          if ((p.PromotionId || p.id) === id) {
            // Lấy dữ liệu từ formData nếu là object
            const formDataObj = formData instanceof FormData ? {} : formData;
            return {
              ...p,
              ...formDataObj,
              updatedAt: new Date().toISOString(),
            };
          }
          return p;
        });
        return sortPromos(updated);
      });
      
      toast({
        title: "Thành công",
        description: "Cập nhật chương trình thành công",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      return true;
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể cập nhật chương trình",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
  }, [toast, sortPromos]);

  // Đưa khuyến mãi lên đầu
  const moveToTop = useCallback((id) => {
    setPromos((prev) => {
      const item = prev.find(p => (p.PromotionId || p.id) === id);
      if (!item) return prev;
      
      const remaining = prev.filter(p => (p.PromotionId || p.id) !== id);
      return sortPromos([item, ...remaining]);
    });
  }, [sortPromos]);

  // Refresh danh sách
  const refreshPromos = useCallback(async () => {
    await fetchPromos();
  }, [fetchPromos]);

  return {
    promos,
    loading,
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    filterType,
    setFilterType,
    filtered,
    counts,
    fetchPromos,
    toggleStatus,
    deletePromo,
    createPromo,
    updatePromo,
    moveToTop,
    refreshPromos,
  };
}