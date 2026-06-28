

import { useState, useEffect, useCallback } from "react";
import RoomApi from "../../../../api/RoomApi";
import CinemasApi from "../../../../api/CinemasApi";
import Swal from "sweetalert2";

export const useRoom = () => {
  const [rooms, setRooms] = useState({});
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCinemaId, setSelectedCinemaId] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [roomRes, cinemaRes] = await Promise.all([
        RoomApi.getAll(),
        CinemasApi.getAll(),
      ]);

      const roomData = roomRes.data.data || roomRes.data || [];
      const cinemaData = cinemaRes.data.data || cinemaRes.data || [];
      
      setCinemas(cinemaData);
      
      // Nhóm rooms theo cinema
      const groupedRooms = {};
      roomData.forEach(room => {
        const cinemaId = room.CinemaId;
        if (!groupedRooms[cinemaId]) groupedRooms[cinemaId] = [];
        groupedRooms[cinemaId].push(room);
      });
      setRooms(groupedRooms);
      
      // Chọn cinema đầu tiên
      if (cinemaData.length > 0 && !selectedCinemaId) {
        setSelectedCinemaId(cinemaData[0].CinemaId);
      }
    } catch (error) {
      console.error("❌ Lỗi load rooms:", error);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Không thể tải dữ liệu phòng chiếu!",
        showConfirmButton: false,
        timer: 3000,
      });
    } finally {
      setLoading(false);
    }
  }, [selectedCinemaId]);

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

  const handleAddRoom = useCallback(async (roomData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        CinemaId: selectedCinemaId,
        Name: roomData.Name,
        RoomType: roomData.RoomType,
        TotalSeats: roomData.Capacity,
        Status: roomData.Status,
      };

      const response = await RoomApi.create(payload);
      const newRoom = response.data.data || response.data;
      
      setRooms((prev) => ({
        ...prev,
        [selectedCinemaId]: [...(prev[selectedCinemaId] || []), newRoom],
      }));
      
      showToast("success", "🎉 Thêm phòng chiếu thành công!");
      setIsSubmitting(false);
      return true;
    } catch (error) {
      console.error("❌ Lỗi add room:", error);
      showToast("error", error.response?.data?.message || "❌ Thêm thất bại!");
      setIsSubmitting(false);
      return false;
    }
  }, [selectedCinemaId, showToast]);

  const handleUpdateRoom = useCallback(async (roomId, roomData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        CinemaId: selectedCinemaId,
        Name: roomData.Name,
        RoomType: roomData.RoomType,
        TotalSeats: roomData.Capacity || roomData.TotalSeats,
        Status: roomData.Status,
      };

      const response = await RoomApi.update(roomId, payload);
      const updatedRoom = response.data.data || response.data;
      
      setRooms((prev) => {
        const updated = (prev[selectedCinemaId] || []).map((r) =>
          r.RoomId === roomId ? updatedRoom : r
        );
        return { ...prev, [selectedCinemaId]: updated };
      });
      
      showToast("success", "✅ Cập nhật phòng chiếu thành công!");
      setIsSubmitting(false);
      return true;
    } catch (error) {
      console.error("❌ Lỗi update room:", error);
      showToast("error", error.response?.data?.message || "❌ Cập nhật thất bại!");
      setIsSubmitting(false);
      return false;
    }
  }, [selectedCinemaId, showToast]);

  const handleDeleteRoom = useCallback(async (roomId) => {
    try {
      await RoomApi.delete(roomId);
      setRooms((prev) => {
        const updated = (prev[selectedCinemaId] || []).filter((r) => r.RoomId !== roomId);
        return { ...prev, [selectedCinemaId]: updated };
      });
      showToast("success", "🗑️ Xóa phòng chiếu thành công!");
      return true;
    } catch (error) {
      console.error("❌ Lỗi delete room:", error);
      showToast("error", error.response?.data?.message || "❌ Xóa thất bại!");
      return false;
    }
  }, [selectedCinemaId, showToast]);

  const handleToggleRoomStatus = useCallback(async (roomId, currentStatus) => {
    try {
      const room = (rooms[selectedCinemaId] || []).find(r => r.RoomId === roomId);
      if (!room) return;
      
      let newStatus;
      if (currentStatus === "Active") newStatus = "Inactive";
      else if (currentStatus === "Inactive") newStatus = "Maintenance";
      else newStatus = "Active";

      await RoomApi.update(roomId, {
        ...room,
        Status: newStatus,
      });
      
      setRooms((prev) => {
        const updated = (prev[selectedCinemaId] || []).map((r) =>
          r.RoomId === roomId ? { ...r, Status: newStatus } : r
        );
        return { ...prev, [selectedCinemaId]: updated };
      });
      
      const statusLabel = { Active: "kích hoạt", Inactive: "khóa", Maintenance: "bảo trì" }[newStatus];
      showToast("success", `✅ Đã ${statusLabel} phòng chiếu!`);
    } catch (error) {
      console.error("❌ Lỗi toggle status:", error);
      showToast("error", "❌ Không thể cập nhật trạng thái!");
    }
  }, [rooms, selectedCinemaId, showToast]);

  const getCinemaRooms = useCallback((cinemaId) => {
    return rooms[cinemaId] || [];
  }, [rooms]);

  const getStats = useCallback((cinemaId) => {
    const roomList = rooms[cinemaId] || [];
    return {
      total: roomList.length,
      active: roomList.filter((r) => r.Status === "Active").length,
      inactive: roomList.filter((r) => r.Status === "Inactive").length,
      maintenance: roomList.filter((r) => r.Status === "Maintenance").length,
      totalSeats: roomList.reduce((s, r) => s + (r.TotalSeats || 0), 0),
      totalBooked: roomList.reduce((s, r) => s + (r.bookedSeats || 0), 0),
    };
  }, [rooms]);

  return {
    rooms,
    cinemas,
    loading,
    isSubmitting,
    selectedCinemaId,
    setSelectedCinemaId,
    loadData,
    handleAddRoom,
    handleUpdateRoom,
    handleDeleteRoom,
    handleToggleRoomStatus,
    getCinemaRooms,
    getStats,
    showToast,
  };
};