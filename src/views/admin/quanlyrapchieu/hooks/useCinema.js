// src/views/admin/quanlyrapchieu/hooks/useCinema.js

import { useState, useEffect, useCallback } from "react";
import CinemasApi from "../../../../api/CinemasApi";
import Swal from "sweetalert2";

export const useCinema = () => {
  const [cinemas, setCinemas] = useState([]);
  const [rooms, setRooms] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ Đã có

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await CinemasApi.getAll();
      const data = response.data.data || response.data || [];
      setCinemas(data);
      
      // Khởi tạo rooms cho từng cinema
      const roomsData = {};
      data.forEach(c => {
        roomsData[c.CinemaId] = c.Rooms || [];
      });
      setRooms(roomsData);
    } catch (error) {
      console.error("❌ Lỗi load cinemas:", error);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Không thể tải dữ liệu rạp!",
        showConfirmButton: false,
        timer: 3000,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

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

  const handleAddCinema = useCallback(async (formData) => {
    setIsSubmitting(true);
    try {
      const payload = new FormData();
      payload.append("Name", formData.Name);
      payload.append("Address", formData.Address);
      payload.append("City", formData.City);
      payload.append("Phone", formData.Phone);
      payload.append("Email", formData.Email);
      payload.append("Status", formData.Status);
      payload.append("OpenTime", formData.OpenTime || "08:00 – 23:00");
      payload.append("Description", formData.Description || "");
      payload.append("Manager", formData.Manager || "");
      
      // Nếu có file ảnh
      if (formData.ImageFile) {
        payload.append("ImageUrl", formData.ImageFile);
      }

      const response = await CinemasApi.create(payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const newCinema = response.data.data || response.data;
      setCinemas((prev) => [newCinema, ...prev]);
      setRooms((prev) => ({ ...prev, [newCinema.CinemaId]: [] }));
      showToast("success", "🎉 Thêm rạp thành công!");
      setIsSubmitting(false);
      return true;
    } catch (error) {
      console.error("❌ Lỗi add cinema:", error);
      showToast("error", error.response?.data?.message || "❌ Thêm thất bại!");
      setIsSubmitting(false);
      return false;
    }
  }, [showToast]);

  const handleUpdateCinema = useCallback(async (cinemaId, formData) => {
    setIsSubmitting(true);
    try {
      const payload = new FormData();
      payload.append("_method", "PUT");
      payload.append("Name", formData.Name);
      payload.append("Address", formData.Address);
      payload.append("City", formData.City);
      payload.append("Phone", formData.Phone);
      payload.append("Email", formData.Email);
      payload.append("Status", formData.Status);
      payload.append("OpenTime", formData.OpenTime || "08:00 – 23:00");
      payload.append("Description", formData.Description || "");
      payload.append("Manager", formData.Manager || "");
      
      // Nếu có file ảnh mới
      if (formData.ImageFile) {
        payload.append("ImageUrl", formData.ImageFile);
      }

      const response = await CinemasApi.update(cinemaId, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const updatedCinema = response.data.data || response.data;
      setCinemas((prev) => prev.map((c) => c.CinemaId === cinemaId ? updatedCinema : c));
      showToast("success", "✅ Cập nhật rạp thành công!");
      setIsSubmitting(false);
      return true;
    } catch (error) {
      console.error("❌ Lỗi update cinema:", error);
      showToast("error", error.response?.data?.message || "❌ Cập nhật thất bại!");
      setIsSubmitting(false);
      return false;
    }
  }, [showToast]);

  const handleDeleteCinema = useCallback(async (cinemaId) => {
    try {
      await CinemasApi.delete(cinemaId);
      setCinemas((prev) => prev.filter((c) => c.CinemaId !== cinemaId));
      setRooms((prev) => {
        const newRooms = { ...prev };
        delete newRooms[cinemaId];
        return newRooms;
      });
      showToast("success", "🗑️ Xóa rạp thành công!");
      return true;
    } catch (error) {
      console.error("❌ Lỗi delete cinema:", error);
      showToast("error", error.response?.data?.message || "❌ Xóa thất bại!");
      return false;
    }
  }, [showToast]);

  const handleToggleStatus = useCallback(async (cinemaId, currentStatus) => {
    try {
      const cinema = cinemas.find(c => c.CinemaId === cinemaId);
      if (!cinema) return;
      
      const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
      const payload = new FormData();
      payload.append("_method", "PUT");
      payload.append("Name", cinema.Name);
      payload.append("Address", cinema.Address);
      payload.append("City", cinema.City);
      payload.append("Phone", cinema.Phone);
      payload.append("Email", cinema.Email);
      payload.append("Status", newStatus);

      await CinemasApi.update(cinemaId, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      setCinemas((prev) => prev.map((c) =>
        c.CinemaId === cinemaId ? { ...c, Status: newStatus } : c
      ));
      
      showToast("success", `✅ Đã ${newStatus === "Active" ? "kích hoạt" : "khóa"} rạp!`);
    } catch (error) {
      console.error("❌ Lỗi toggle status:", error);
      showToast("error", "❌ Không thể cập nhật trạng thái!");
    }
  }, [cinemas, showToast]);

  const handleAddRoom = useCallback((cinemaId, roomData) => {
    const newRoom = {
      RoomId: Date.now(),
      Name: roomData.Name,
      Type: roomData.Type,
      Seats: roomData.Seats,
      Status: roomData.Status,
      Price: roomData.Price,
      CurrentMovie: null,
      NextShow: null,
    };
    
    setRooms((prev) => ({
      ...prev,
      [cinemaId]: [...(prev[cinemaId] || []), newRoom],
    }));
    
    // Update cinema stats
    setCinemas((prev) => prev.map((c) => {
      if (c.CinemaId === cinemaId) {
        const totalRooms = (rooms[cinemaId]?.length || 0) + 1;
        const totalSeats = (rooms[cinemaId] || []).reduce((s, r) => s + (r.Seats || 0), 0) + roomData.Seats;
        const activeRooms = (rooms[cinemaId] || []).filter(r => r.Status === "Active").length + (roomData.Status === "Active" ? 1 : 0);
        return { ...c, TotalRooms: totalRooms, TotalSeats: totalSeats, ActiveRooms: activeRooms };
      }
      return c;
    }));
    
    showToast("success", "✅ Thêm phòng chiếu thành công!");
  }, [rooms, showToast]);

  const handleToggleRoomStatus = useCallback((cinemaId, roomId) => {
    setRooms((prev) => {
      const updated = (prev[cinemaId] || []).map((r) =>
        (r.RoomId === roomId || r.id === roomId)
          ? { ...r, Status: r.Status === "Active" ? "Inactive" : "Active" }
          : r
      );
      return { ...prev, [cinemaId]: updated };
    });
    
    // Update cinema stats
    const room = (rooms[cinemaId] || []).find(r => r.RoomId === roomId || r.id === roomId);
    const isActive = room?.Status === "Active";
    setCinemas((prev) => prev.map((c) => {
      if (c.CinemaId === cinemaId) {
        const activeRooms = (rooms[cinemaId] || []).filter(r => 
          r.Status === "Active" && (r.RoomId !== roomId && r.id !== roomId)
        ).length + (isActive ? 0 : 1);
        return { ...c, ActiveRooms: activeRooms };
      }
      return c;
    }));
    
    showToast("info", isActive ? "⏸ Phòng đã chuyển bảo trì" : "✅ Phòng đã kích hoạt");
  }, [rooms, showToast]);

  const handleDeleteRoom = useCallback((cinemaId, roomId) => {
    setRooms((prev) => ({
      ...prev,
      [cinemaId]: (prev[cinemaId] || []).filter(r => r.RoomId !== roomId && r.id !== roomId),
    }));
    
    // Update cinema stats
    const room = (rooms[cinemaId] || []).find(r => r.RoomId === roomId || r.id === roomId);
    setCinemas((prev) => prev.map((c) => {
      if (c.CinemaId === cinemaId) {
        const totalRooms = (rooms[cinemaId]?.length || 0) - 1;
        const totalSeats = (rooms[cinemaId] || []).reduce((s, r) => 
          s + (r.Seats || 0), 0) - (room?.Seats || 0);
        const activeRooms = (rooms[cinemaId] || []).filter(r => 
          r.Status === "Active" && r.RoomId !== roomId && r.id !== roomId
        ).length;
        return { ...c, TotalRooms: totalRooms, TotalSeats: totalSeats, ActiveRooms: activeRooms };
      }
      return c;
    }));
    
    showToast("info", "🗑️ Đã xóa phòng chiếu");
  }, [rooms, showToast]);

  const getCinemaStats = useCallback(() => ({
    total: cinemas.length,
    active: cinemas.filter(c => c.Status === "Active").length,
    inactive: cinemas.filter(c => c.Status === "Inactive").length,
    totalRooms: cinemas.reduce((s, c) => s + (c.TotalRooms || 0), 0),
  }), [cinemas]);

  return {
    cinemas,
    setCinemas,
    rooms,
    loading,
    isSubmitting,
    setIsSubmitting, // ✅ Export setIsSubmitting
    loadData,
    handleAddCinema,
    handleUpdateCinema,
    handleDeleteCinema,
    handleToggleStatus,
    handleAddRoom,
    handleToggleRoomStatus,
    handleDeleteRoom,
    getCinemaStats,
    showToast,
  };
};