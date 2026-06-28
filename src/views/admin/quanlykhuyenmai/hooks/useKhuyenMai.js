// views/admin/quanlykhuyenmai/hooks/useKhuyenMai.js

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

  // Lấy dữ liệu từ API
  const fetchPromos = useCallback(async () => {
    setLoading(true);
    try {
      const response = await PromotionApi.getAll();
      const data = response.data.data || response.data || [];
      
      // Transform dữ liệu từ API
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
        createdAt: item.CreatedAt || item.createdAt || "",
        updatedAt: item.UpdatedAt || item.updatedAt || "",
      }));
      setPromos(transformed);
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
  }, [toast]);

  useEffect(() => {
    fetchPromos();
  }, [fetchPromos]);

  // Filter
  const filtered = useMemo(() => {
    return promos
      .filter((p) => {
        const matchSearch = (p.title || "").toLowerCase().includes(search.toLowerCase()) ||
          (p.code || "").toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === "Tất cả" || p.status === filterStatus;
        const matchType = filterType === "Tất cả" || p.discountType === filterType;
        return matchSearch && matchStatus && matchType;
      })
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
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

      setPromos((prev) =>
        prev.map((p) =>
          (p.PromotionId || p.id) === id ? { ...p, status: newStatus } : p
        )
      );
      
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
        description: "Không thể cập nhật trạng thái",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [promos, toast]);

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
        description: "Không thể xóa chương trình",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [toast]);

  // Create
  const createPromo = useCallback(async (formData) => {
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          if (key === "ImageFile" && value instanceof File) {
            data.append("ImageUrl", value);
          } else if (key !== "ImageUrl" && key !== "imageUrl") {
            data.append(key, value);
          }
        }
      });

      const response = await PromotionApi.create(data);
      const newPromo = response.data.data || response.data;
      
      setPromos((prev) => [
        {
          ...newPromo,
          id: newPromo.PromotionId || newPromo.id,
          title: newPromo.Title || newPromo.title,
          status: newPromo.Status || newPromo.status,
          discountType: newPromo.DiscountType || newPromo.discountType,
          usageCount: 0,
        },
        ...prev
      ]);
      
      toast({
        title: "Thành công",
        description: "Thêm chương trình mới thành công",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      return true;
    } catch (error) {
      console.error("Lỗi khi thêm:", error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm chương trình mới",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
  }, [toast]);

  // Update
  const updatePromo = useCallback(async (id, formData) => {
    try {
      const data = new FormData();
      data.append("_method", "PUT");
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          if (key === "ImageFile" && value instanceof File) {
            data.append("ImageUrl", value);
          } else if (key !== "ImageUrl" && key !== "imageUrl") {
            data.append(key, value);
          }
        }
      });

      await PromotionApi.update(id, data);
      
      setPromos((prev) =>
        prev.map((p) =>
          (p.PromotionId || p.id) === id ? { ...p, ...formData } : p
        )
      );
      
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
        description: "Không thể cập nhật chương trình",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
  }, [toast]);

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
  };
}