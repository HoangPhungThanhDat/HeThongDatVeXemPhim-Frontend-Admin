

import { useState, useEffect, useCallback, useMemo } from "react";
import FoodAndDrinkApi from "../../../../api/FoodAndDrinkApi";
import Swal from "sweetalert2";

// Helper: Tải ảnh từ URL và chuyển thành File
const fetchImageAsFile = async (imageUrl, fileName = "image.jpg") => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    // Xác định loại file từ blob
    const fileType = blob.type || "image/jpeg";
    const extension = fileType.split("/")[1] || "jpg";
    const fullFileName = fileName.includes(".") ? fileName : `${fileName}.${extension}`;
    return new File([blob], fullFileName, { type: fileType });
  } catch (error) {
    console.error("❌ Lỗi tải ảnh:", error);
    return null;
  }
};

export const useCombo = () => {
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("Tất cả");
  const [filterStatus, setFilterStatus] = useState("Tất cả");

  // Load dữ liệu từ API
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await FoodAndDrinkApi.getAll();
      const data = response.data.data || response.data || [];
      
      const mappedData = data.map((item) => ({
        id: item.id || item.ComboId || item.ItemId,
        name: item.name || item.Name || "",
        description: item.description || item.Description || "",
        price: item.price || item.Price || 0,
        originalPrice: item.originalPrice || item.OriginalPrice || item.price || item.Price || 0,
        image: item.image || item.ImageUrl || "",
        items: item.items || item.Items || [],
        category: item.category || item.Category || "Combo Solo",
        maxPerOrder: item.maxPerOrder || item.MaxPerOrder || 3,
        isActive: item.isActive !== undefined ? item.isActive : (item.Status === "Active"),
        isSeasonal: item.isSeasonal || item.IsSeasonal || false,
        soldCount: item.soldCount || item.SoldCount || 0,
        tag: item.tag || item.Tag || "Mới",
        sortOrder: item.sortOrder || item.SortOrder || 0,
      }));
      
      setCombos(mappedData);
    } catch (error) {
      console.error("❌ Lỗi load combo:", error);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Không thể tải dữ liệu combo!",
        showConfirmButton: false,
        timer: 3000,
      });
      setCombos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filter
  const filtered = useMemo(() => {
    return combos.filter((c) => {
      const q = search.toLowerCase();
      const matchSearch = !q || 
        c.name?.toLowerCase().includes(q) || 
        c.description?.toLowerCase().includes(q) ||
        c.items?.some((i) => i.toLowerCase().includes(q));
      const matchCat = filterCat === "Tất cả" || c.category === filterCat;
      const matchStatus = filterStatus === "Tất cả"
        || (filterStatus === "Đang bán" && c.isActive)
        || (filterStatus === "Đã tắt" && !c.isActive);
      return matchSearch && matchCat && matchStatus;
    });
  }, [combos, search, filterCat, filterStatus]);

  // Stats
  const stats = useMemo(() => ({
    total: combos.length,
    active: combos.filter((c) => c.isActive).length,
    hidden: combos.filter((c) => !c.isActive).length,
    totalSold: combos.reduce((s, c) => s + (c.soldCount || 0), 0),
    seasonal: combos.filter((c) => c.isSeasonal).length,
  }), [combos]);

  // Toggle trạng thái
  const handleToggle = useCallback(async (id) => {
    try {
      const combo = combos.find(c => c.id === id);
      if (!combo) return;
      
      const newIsAvailable = combo.isActive ? 0 : 1;
      const newStatus = combo.isActive ? "Inactive" : "Active";
      
      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("Name", combo.name);
      formData.append("Description", combo.description || "");
      formData.append("Price", Number(combo.price));
      formData.append("IsAvailable", newIsAvailable);
      formData.append("Status", newStatus);
      
      // ✅ Khi toggle, vẫn cần gửi file ảnh
      if (combo.image) {
        // Tải ảnh cũ về và gửi lại dưới dạng file
        const imageFile = await fetchImageAsFile(combo.image, `combo_${combo.id}.jpg`);
        if (imageFile) {
          formData.append("ImageUrl", imageFile);
        } else {
          // Fallback: dùng ảnh mặc định nếu không tải được
          const defaultImage = await fetchImageAsFile("https://via.placeholder.com/300x300?text=No+Image", "default.jpg");
          if (defaultImage) {
            formData.append("ImageUrl", defaultImage);
          }
        }
      } else {
        // Không có ảnh, dùng ảnh mặc định
        const defaultImage = await fetchImageAsFile("https://via.placeholder.com/300x300?text=No+Image", "default.jpg");
        if (defaultImage) {
          formData.append("ImageUrl", defaultImage);
        }
      }
      
      await FoodAndDrinkApi.update(id, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      setCombos((prev) => prev.map((c) => 
        c.id === id ? { ...c, isActive: !c.isActive } : c
      ));
      
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: newStatus === "Active" ? "✅ Đã kích hoạt combo!" : "⏸ Đã tắt combo!",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      console.error("❌ Lỗi toggle status:", error);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: error.response?.data?.message || "❌ Không thể cập nhật trạng thái!",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  }, [combos]);

  // Xóa combo
  const handleDelete = useCallback(async (id) => {
    try {
      await FoodAndDrinkApi.delete(id);
      setCombos((prev) => prev.filter((c) => c.id !== id));
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "🗑️ Xóa combo thành công!",
        showConfirmButton: false,
        timer: 2000,
      });
      return true;
    } catch (error) {
      console.error("❌ Lỗi delete:", error);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: error.response?.data?.message || "❌ Không thể xóa combo!",
        showConfirmButton: false,
        timer: 3000,
      });
      return false;
    }
  }, []);

  // Lưu combo (thêm hoặc sửa)
  const handleSave = useCallback(async (form, view, selected) => {
    try {
      const items = form.items?.filter((i) => i.trim() !== "") || [];
      
      let response;
      const formData = new FormData();
      
      // Nếu là update, thêm _method PUT
      if (view === "edit") {
        formData.append("_method", "PUT");
      }
      
      formData.append("Name", form.name || "");
      formData.append("Description", form.description || "");
      formData.append("Price", Number(form.price) || 0);
      formData.append("IsAvailable", form.isActive ? 1 : 0);
      formData.append("Status", form.isActive ? "Active" : "Inactive");
      
      // ✅ XỬ LÝ ẢNH: Luôn gửi file ảnh
      if (form.imageFile) {
        // Có file ảnh mới từ người dùng
        formData.append("ImageUrl", form.imageFile);
        console.log("📤 Gửi file ảnh mới:", form.imageFile.name);
      } else if (view === "edit" && selected?.image) {
        // Khi sửa và không có ảnh mới: Tải ảnh cũ về và gửi lại dưới dạng file
        console.log("📤 Tải ảnh cũ về và gửi lại:", selected.image);
        const imageFile = await fetchImageAsFile(selected.image, `combo_${selected.id}.jpg`);
        if (imageFile) {
          formData.append("ImageUrl", imageFile);
          console.log("📤 Đã tải ảnh cũ thành công:", imageFile.name);
        } else {
          // Nếu không tải được ảnh cũ, dùng ảnh mặc định
          console.log("⚠️ Không tải được ảnh cũ, dùng ảnh mặc định");
          const defaultImage = await fetchImageAsFile("https://via.placeholder.com/300x300?text=No+Image", "default.jpg");
          if (defaultImage) {
            formData.append("ImageUrl", defaultImage);
          }
        }
      } else if (view === "add" && !form.imageFile) {
        // Thêm mới mà không có ảnh: dùng ảnh mặc định
        console.log("📤 Dùng ảnh mặc định");
        const defaultImage = await fetchImageAsFile("https://via.placeholder.com/300x300?text=No+Image", "default.jpg");
        if (defaultImage) {
          formData.append("ImageUrl", defaultImage);
        }
      } else {
        // Fallback: dùng ảnh mặc định
        console.log("📤 Fallback: dùng ảnh mặc định");
        const defaultImage = await fetchImageAsFile("https://via.placeholder.com/300x300?text=No+Image", "default.jpg");
        if (defaultImage) {
          formData.append("ImageUrl", defaultImage);
        }
      }
      
      // Log để debug
      console.log("📤 FormData gửi lên:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + (pair[1] instanceof File ? pair[1].name : pair[1]));
      }

      if (view === "add") {
        response = await FoodAndDrinkApi.create(formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        response = await FoodAndDrinkApi.update(selected.id, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      const newCombo = response.data.data || response.data;
      
      if (view === "add") {
        setCombos((prev) => [
          { 
            ...newCombo, 
            id: newCombo.id || Date.now(),
            name: newCombo.Name || form.name,
            description: newCombo.Description || form.description,
            price: newCombo.Price || form.price,
            image: newCombo.ImageUrl || form.image || "",
            items: items,
            category: form.category || "Combo Solo",
            maxPerOrder: form.maxPerOrder || 3,
            isActive: newCombo.IsAvailable === 1,
            isSeasonal: form.isSeasonal || false,
            soldCount: 0,
            tag: form.tag || "Mới",
            sortOrder: prev.length + 1 
          },
          ...prev
        ]);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "🎉 Thêm combo thành công!",
          showConfirmButton: false,
          timer: 2000,
        });
      } else {
        setCombos((prev) => prev.map((c) =>
          c.id === selected.id ? { 
            ...c, 
            ...newCombo,
            name: newCombo.Name || c.name,
            description: newCombo.Description || c.description,
            price: newCombo.Price || c.price,
            image: newCombo.ImageUrl || c.image,
            isActive: newCombo.IsAvailable === 1,
            items: items,
          } : c
        ));
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "✅ Cập nhật combo thành công!",
          showConfirmButton: false,
          timer: 2000,
        });
      }
      
      return response;
    } catch (error) {
      console.error("❌ Lỗi save combo:", error);
      console.error("Chi tiết lỗi:", error.response?.data);
      
      const errorData = error.response?.data;
      let errorMessage = "❌ Lưu thất bại!";
      
      if (errorData?.errors) {
        const errors = Object.values(errorData.errors).flat();
        errorMessage = errors.join("\n");
      } else if (errorData?.message) {
        errorMessage = errorData.message;
      }
      
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: errorMessage,
        showConfirmButton: false,
        timer: 5000,
      });
      throw error;
    }
  }, []);

  return {
    combos,
    setCombos,
    loading,
    search,
    setSearch,
    filterCat,
    setFilterCat,
    filterStatus,
    setFilterStatus,
    filtered,
    stats,
    handleToggle,
    handleDelete,
    handleSave,
    loadData,
  };
};