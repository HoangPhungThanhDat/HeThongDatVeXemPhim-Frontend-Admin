// src/views/admin/quanlyphongchieu/hooks/useRoom.js

import { useState, useEffect, useCallback, useRef } from 'react';
import RoomManagementApi from 'api/cinema/RoomManagementApi';
import Swal from 'sweetalert2';

export const useRoom = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [cinemas, setCinemas] = useState([]);
  const [rooms, setRooms] = useState({});
  const [roomDetail, setRoomDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCinemaId, setSelectedCinemaId] = useState(null);

  const isInitialized = useRef(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const loadDashboard = useCallback(async (force = false) => {
    if (isInitialized.current && !force) return;
    try {
      setLoading(true);
      const response = await RoomManagementApi.getDashboard();
      if (response.success && isMounted.current) {
        const data = response.data;
        setDashboardData(data);

        const cinemaList = data.map((cinema) => ({
          CinemaId: cinema.CinemaId,
          Name: cinema.Name,
          Address: cinema.Address,
          City: cinema.City,
          Phone: cinema.Phone,
          Email: cinema.Email,
          ImageUrl: cinema.ImageUrl,
          Status: cinema.Status,
          Stats: cinema.Stats,
        }));
        setCinemas(cinemaList);

        const groupedRooms = {};
        data.forEach((cinema) => {
          groupedRooms[cinema.CinemaId] = cinema.Rooms.map((room) => ({ ...room }));
        });
        setRooms(groupedRooms);

        if (cinemaList.length > 0 && !selectedCinemaId) {
          setSelectedCinemaId(cinemaList[0].CinemaId);
        }
        isInitialized.current = true;
      }
    } catch (error) {
      console.error('❌ Lỗi load dashboard:', error);
      if (isMounted.current) {
        Swal.fire({
          toast: true, position: 'top-end', icon: 'error',
          title: 'Không thể tải dữ liệu!', showConfirmButton: false, timer: 3000,
        });
      }
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, [selectedCinemaId]);

  const loadRoomDetail = useCallback(async (roomId) => {
    if (!roomId) return null;
    try {
      setLoadingDetail(true);
      const response = await RoomManagementApi.getRoomDetail(roomId);
      if (response.success && isMounted.current) {
        setRoomDetail(response.data);
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('❌ Lỗi load chi tiết phòng:', error);
      return null;
    } finally {
      if (isMounted.current) setLoadingDetail(false);
    }
  }, []);

  const refreshData = useCallback(async () => {
    isInitialized.current = false;
    await loadDashboard(true);
  }, [loadDashboard]);

  const showToast = useCallback((icon, message) => {
    Swal.fire({
      toast: true, position: 'top-end', icon, title: message,
      showConfirmButton: false, timer: 3000, timerProgressBar: true,
    });
  }, []);

  const handleAddRoom = useCallback(
    async (roomData) => {
      setIsSubmitting(true);
      try {
        const payload = {
          CinemaId: selectedCinemaId,
          Name: roomData.Name,
          RoomType: roomData.RoomType,
          SeatCount: roomData.Capacity || 0,
          Status: roomData.Status || 'Active',
        };

        await RoomManagementApi.createRoom(payload);
        
        const tempRoom = {
          RoomId: `temp_${Date.now()}`,
          Name: payload.Name,
          RoomType: payload.RoomType,
          Status: payload.Status,
          SeatCount: payload.SeatCount,
          TotalSeats: 0,
          BookedSeats: 0,
          CurrentMovie: null,
        };

        setRooms((prev) => ({
          ...prev,
          [selectedCinemaId]: [...(prev[selectedCinemaId] || []), tempRoom],
        }));

        showToast('success', '🎉 Thêm phòng chiếu thành công!');
        return true;
      } catch (error) {
        console.error('❌ Lỗi add room:', error);
        showToast('error', error.response?.data?.message || '❌ Thêm thất bại!');
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [selectedCinemaId, showToast],
  );

  const handleUpdateRoom = useCallback(
    async (roomId, roomData) => {
      setIsSubmitting(true);

      // 1. Cập nhật giao diện ngay lập tức
      setRooms((prev) => {
        const current = prev[selectedCinemaId] || [];
        return {
          ...prev,
          [selectedCinemaId]: current.map((r) =>
            r.RoomId === roomId ? { ...r, ...roomData, SeatCount: roomData.SeatCount } : r
          ),
        };
      });

      setRoomDetail((prev) => {
        if (prev && prev.RoomId === roomId) return { ...prev, ...roomData };
        return prev;
      });

      try {
        const payload = {
          CinemaId: selectedCinemaId,
          Name: roomData.Name,
          RoomType: roomData.RoomType,
          SeatCount: roomData.Capacity || roomData.TotalSeats || roomData.SeatCount || 0,
          Status: roomData.Status,
        };

        await RoomManagementApi.updateRoom(roomId, payload);
        
        showToast('success', '✅ Cập nhật phòng chiếu thành công!');
        return true;
      } catch (error) {
        console.error('❌ Lỗi update room:', error);
        showToast('error', error.response?.data?.message || '❌ Cập nhật thất bại!');
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [selectedCinemaId, showToast],
  );

  const handleDeleteRoom = useCallback(
    async (roomId) => {
      try {
        await RoomManagementApi.deleteRoom(roomId);
        
        setRooms((prev) => ({
          ...prev,
          [selectedCinemaId]: (prev[selectedCinemaId] || []).filter((r) => r.RoomId !== roomId),
        }));

        showToast('success', '🗑️ Xóa phòng chiếu thành công!');
        return true;
      } catch (error) {
        console.error('❌ Lỗi delete room:', error);
        showToast('error', error.response?.data?.message || '❌ Xóa thất bại!');
        return false;
      }
    },
    [selectedCinemaId, showToast],
  );

  /**
   * 🔄 Chuyển trạng thái phòng (Sửa lỗi 422)
   */
  const handleToggleRoomStatus = useCallback(
    async (roomId, currentStatus) => {
      let newStatus;
      if (currentStatus === 'Active') newStatus = 'Inactive';
      else if (currentStatus === 'Inactive') newStatus = 'Maintenance';
      else newStatus = 'Active';

      // Cập nhật giao diện ngay
      setRooms((prev) => ({
        ...prev,
        [selectedCinemaId]: (prev[selectedCinemaId] || []).map((r) =>
          r.RoomId === roomId ? { ...r, Status: newStatus } : r
        ),
      }));

      try {
        const room = (rooms[selectedCinemaId] || []).find((r) => r.RoomId === roomId);
        if (!room) return;

        // ✅ SỬA LỖI 422: Chỉ gửi các trường cần thiết và đảm bảo Name không bị rỗng
        const payload = {
          CinemaId: selectedCinemaId,
          Name: room.Name || "Phòng chiếu", // Fallback nếu Name bị rỗng
          RoomType: room.RoomType || "2D",
          SeatCount: room.SeatCount || room.TotalSeats || 0,
          Status: newStatus,
        };

        await RoomManagementApi.updateRoom(roomId, payload);
        
        const statusLabel = { Active: 'kích hoạt', Inactive: 'khóa', Maintenance: 'bảo trì' }[newStatus];
        showToast('success', `✅ Đã ${statusLabel} phòng chiếu!`);
      } catch (error) {
        console.error('❌ Lỗi toggle status:', error);
        console.log("Chi tiết lỗi 422:", error.response?.data); // Debug
        
        showToast('error', '❌ Không thể cập nhật trạng thái!');
        
        // Khôi phục nếu lỗi
        setRooms((prev) => ({
          ...prev,
          [selectedCinemaId]: (prev[selectedCinemaId] || []).map((r) =>
            r.RoomId === roomId ? { ...r, Status: currentStatus } : r
          ),
        }));
      }
    },
    [rooms, selectedCinemaId, showToast],
  );

  const getCinemaRooms = useCallback((cinemaId) => rooms[cinemaId] || [], [rooms]);

  const getStats = useCallback(
    (cinemaId) => {
      if (dashboardData) {
        const cinema = dashboardData.find((c) => c.CinemaId === cinemaId);
        if (cinema?.Stats) {
          return {
            total: cinema.Stats.total_rooms || 0,
            active: cinema.Stats.active_rooms || 0,
            inactive: cinema.Stats.inactive_rooms || 0,
            maintenance: cinema.Stats.maintenance_rooms || 0,
            totalSeats: cinema.Stats.total_seats || 0,
            totalBooked: cinema.Stats.total_booked || 0,
            totalAvailable: cinema.Stats.total_available || 0,
            totalBroken: cinema.Stats.total_broken || 0,
            occupancyRate: cinema.Stats.occupancy_rate || 0,
          };
        }
      }
      const roomList = rooms[cinemaId] || [];
      return {
        total: roomList.length,
        active: roomList.filter((r) => r.Status === 'Active').length,
        inactive: roomList.filter((r) => r.Status === 'Inactive').length,
        maintenance: roomList.filter((r) => r.Status === 'Maintenance').length,
        totalSeats: roomList.reduce((s, r) => s + (r.TotalSeats || 0), 0),
        totalBooked: roomList.reduce((s, r) => s + (r.BookedSeats || 0), 0),
      };
    },
    [rooms, dashboardData],
  );

  const updateSeats = useCallback(
    async (roomId, seats) => {
      try {
        setIsSubmitting(true);
        const response = await RoomManagementApi.updateSeats(roomId, seats);

        if (response.success) {
          showToast('success', '✅ Cập nhật sơ đồ ghế thành công!');
          await loadRoomDetail(roomId);
          return true;
        }
        return false;
      } catch (error) {
        console.error('❌ Lỗi update seats:', error);
        showToast('error', error.response?.data?.message || '❌ Cập nhật thất bại!');
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [loadRoomDetail, showToast],
  );

  useEffect(() => {
    loadDashboard();
  }, []);

  return {
    dashboardData, cinemas, rooms, roomDetail, loading, loadingDetail, isSubmitting, selectedCinemaId,
    setSelectedCinemaId, loadDashboard, loadRoomDetail, refreshData,
    handleAddRoom, handleUpdateRoom, handleDeleteRoom, handleToggleRoomStatus,
    getCinemaRooms, getStats, updateSeats, showToast,
  };
};