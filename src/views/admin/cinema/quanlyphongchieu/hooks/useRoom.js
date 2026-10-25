// src/views/admin/quanlyphongchieu/hooks/useRoom.js

import { useState, useEffect, useCallback, useRef } from 'react';
import RoomManagementApi from 'api/cinema/RoomManagementApi'; // Đảm bảo đúng đường dẫn
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

  const showToast = useCallback((icon, message) => {
    Swal.fire({
      toast: true, position: 'top-end', icon, title: message,
      showConfirmButton: false, timer: 3000, timerProgressBar: true,
    });
  }, []);

  const loadDashboard = useCallback(async (force = false) => {
    if (isInitialized.current && !force) return;
    try {
      setLoading(true);
      // ✅ Gọi API với timestamp để chống cache
      const response = await RoomManagementApi.getDashboard({ _t: Date.now() });
      
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
        showToast('error', 'Không thể tải dữ liệu!');
      }
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, [selectedCinemaId, showToast]);

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

  // ==================== THÊM PHÒNG CHIẾU ====================
  const handleAddRoom = useCallback(
    async (roomData) => {
      setIsSubmitting(true);
      try {
        const payload = {
          CinemaId: Number(selectedCinemaId),
          Name: String(roomData.Name || '').trim(),
          RoomType: roomData.RoomType || '2D',
          SeatCount: Number(roomData.Capacity || roomData.SeatCount || 0),
          Status: roomData.Status || 'Active',
        };

        console.log('📤 Payload thêm phòng:', payload);

        if (!payload.CinemaId || !payload.Name || payload.SeatCount <= 0) {
          showToast('error', 'Dữ liệu không hợp lệ: Thiếu rạp, tên hoặc số ghế!');
          setIsSubmitting(false);
          return false;
        }

        await RoomManagementApi.createRoom(payload);
        showToast('success', '🎉 Thêm phòng chiếu thành công!');

        // ✅ Load lại dữ liệu thật từ server
        await refreshData(); 
        
        return true;
      } catch (error) {
        console.error('❌ Lỗi add room:', error);
        console.log('📌 Chi tiết lỗi từ API:', error.response?.data);
        showToast('error', error.response?.data?.message || '❌ Thêm thất bại!');
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [selectedCinemaId, showToast, refreshData],
  );

  // ==================== CẬP NHẬT PHÒNG CHIẾU ====================
  const handleUpdateRoom = useCallback(
    async (roomId, roomData) => {
      setIsSubmitting(true);
      try {
        const payload = {
          CinemaId: Number(selectedCinemaId),
          Name: String(roomData.Name || '').trim(),
          RoomType: roomData.RoomType || '2D',
          SeatCount: Number(roomData.Capacity || roomData.TotalSeats || roomData.SeatCount || 0),
          Status: roomData.Status || 'Active',
        };

        await RoomManagementApi.updateRoom(roomId, payload);
        showToast('success', '✅ Cập nhật phòng chiếu thành công!');

        await refreshData();
        
        return true;
      } catch (error) {
        console.error('❌ Lỗi update room:', error);
        console.log('📌 Chi tiết lỗi từ API:', error.response?.data);
        showToast('error', error.response?.data?.message || '❌ Cập nhật thất bại!');
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [selectedCinemaId, showToast, refreshData],
  );

  // ==================== XÓA PHÒNG CHIẾU ====================
  const handleDeleteRoom = useCallback(
    async (roomId) => {
      try {
        setIsSubmitting(true);
        await RoomManagementApi.deleteRoom(roomId);
        showToast('success', '🗑️ Xóa phòng chiếu thành công!');

        await refreshData();
        
        return true;
      } catch (error) {
        console.error('❌ Lỗi delete room:', error);
        showToast('error', error.response?.data?.message || '❌ Xóa thất bại!');
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [showToast, refreshData],
  );

  // ==================== ĐỔI TRẠNG THÁI PHÒNG ====================
  const handleToggleRoomStatus = useCallback(
    async (roomId, currentStatus) => {
      let newStatus;
      if (currentStatus === 'Active') newStatus = 'Inactive';
      else if (currentStatus === 'Inactive') newStatus = 'Maintenance';
      else newStatus = 'Active';

      try {
        const room = (rooms[selectedCinemaId] || []).find((r) => r.RoomId === roomId);
        if (!room) return;

        const payload = {
          CinemaId: Number(selectedCinemaId),
          Name: room.Name || "Phòng chiếu",
          RoomType: room.RoomType || "2D",
          SeatCount: Number(room.SeatCount || room.TotalSeats || 0),
          Status: newStatus,
        };

        await RoomManagementApi.updateRoom(roomId, payload);
        
        const statusLabel = { Active: 'kích hoạt', Inactive: 'khóa', Maintenance: 'bảo trì' }[newStatus];
        showToast('success', `✅ Đã ${statusLabel} phòng chiếu!`);
        
        await refreshData();
      } catch (error) {
        console.error('❌ Lỗi toggle status:', error);
        showToast('error', '❌ Không thể cập nhật trạng thái!');
      }
    },
    [rooms, selectedCinemaId, showToast, refreshData],
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