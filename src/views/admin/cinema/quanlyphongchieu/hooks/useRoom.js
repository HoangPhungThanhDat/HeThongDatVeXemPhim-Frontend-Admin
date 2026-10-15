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

  // ✅ Ref để kiểm tra đã initialized chưa
  const isInitialized = useRef(false);
  const isMounted = useRef(true);

  // ✅ Cleanup khi unmount
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  /**
   * 📊 Load dashboard - CHỈ GỌI 1 LẦN DUY NHẤT
   */
  const loadDashboard = useCallback(async () => {
    // ✅ Nếu đã initialized thì không gọi lại
    if (isInitialized.current) {
      console.log('⏭️ Đã load dashboard trước đó, bỏ qua');
      return;
    }

    try {
      setLoading(true);
      console.log('🔄 Đang load dashboard lần đầu...');

      const response = await RoomManagementApi.getDashboard();

      if (response.success && isMounted.current) {
        const data = response.data;
        setDashboardData(data);

        // Xử lý danh sách rạp
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

        // Nhóm phòng theo rạp
        const groupedRooms = {};
        data.forEach((cinema) => {
          groupedRooms[cinema.CinemaId] = cinema.Rooms.map((room) => ({
            ...room,
          }));
        });
        setRooms(groupedRooms);

        // Chọn rạp đầu tiên (CHỈ 1 LẦN)
        if (cinemaList.length > 0 && !selectedCinemaId) {
          setSelectedCinemaId(cinemaList[0].CinemaId);
        }

        // ✅ Đánh dấu đã initialized
        isInitialized.current = true;
        console.log('✅ Dashboard loaded successfully');
      }
    } catch (error) {
      console.error('❌ Lỗi load dashboard:', error);
      if (isMounted.current) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Không thể tải dữ liệu!',
          showConfirmButton: false,
          timer: 3000,
        });
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [selectedCinemaId]); // ✅ Vẫn giữ dependency nhưng đã có isInitialized để ngăn gọi lại

  /**
   * 🎯 Lấy chi tiết phòng + sơ đồ ghế
   */
  const loadRoomDetail = useCallback(async (roomId) => {
    if (!roomId) return null;

    try {
      setLoadingDetail(true);
      console.log(`🔄 Đang load chi tiết phòng ${roomId}...`);

      const response = await RoomManagementApi.getRoomDetail(roomId);

      if (response.success && isMounted.current) {
        setRoomDetail(response.data);
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('❌ Lỗi load chi tiết phòng:', error);
      if (isMounted.current) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Không thể tải chi tiết phòng!',
          showConfirmButton: false,
          timer: 3000,
        });
      }
      return null;
    } finally {
      if (isMounted.current) {
        setLoadingDetail(false);
      }
    }
  }, []);

  /**
   * 🔄 Refresh dữ liệu sau CRUD
   * ✅ Reset initialized để load lại
   */
  const refreshData = useCallback(async () => {
    console.log('🔄 Refresh dữ liệu...');
    isInitialized.current = false;
    await loadDashboard();
  }, [loadDashboard]);

  /**
   * 🎉 Toast notification
   */
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

  /**
   * ➕ Thêm phòng chiếu
   */
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
        await refreshData();

        showToast('success', '🎉 Thêm phòng chiếu thành công!');
        setIsSubmitting(false);
        return true;
      } catch (error) {
        console.error('❌ Lỗi add room:', error);
        showToast(
          'error',
          error.response?.data?.message || '❌ Thêm thất bại!',
        );
        setIsSubmitting(false);
        return false;
      }
    },
    [selectedCinemaId, refreshData, showToast],
  );

  /**
   * ✏️ Cập nhật phòng chiếu
   */
  const handleUpdateRoom = useCallback(
    async (roomId, roomData) => {
      setIsSubmitting(true);
      try {
        const payload = {
          CinemaId: selectedCinemaId,
          Name: roomData.Name,
          RoomType: roomData.RoomType,
          SeatCount: roomData.Capacity || roomData.TotalSeats || 0,
          Status: roomData.Status,
        };

        await RoomManagementApi.updateRoom(roomId, payload);
        await refreshData();

        showToast('success', '✅ Cập nhật phòng chiếu thành công!');
        setIsSubmitting(false);
        return true;
      } catch (error) {
        console.error('❌ Lỗi update room:', error);
        showToast(
          'error',
          error.response?.data?.message || '❌ Cập nhật thất bại!',
        );
        setIsSubmitting(false);
        return false;
      }
    },
    [selectedCinemaId, refreshData, showToast],
  );

  /**
   * 🗑️ Xóa phòng chiếu
   */
  const handleDeleteRoom = useCallback(
    async (roomId) => {
      try {
        await RoomManagementApi.deleteRoom(roomId);
        await refreshData();

        showToast('success', '🗑️ Xóa phòng chiếu thành công!');
        return true;
      } catch (error) {
        console.error('❌ Lỗi delete room:', error);
        showToast('error', error.response?.data?.message || '❌ Xóa thất bại!');
        return false;
      }
    },
    [refreshData, showToast],
  );

  /**
   * 🔄 Chuyển trạng thái phòng
   */
  const handleToggleRoomStatus = useCallback(
    async (roomId, currentStatus) => {
      try {
        const room = (rooms[selectedCinemaId] || []).find(
          (r) => r.RoomId === roomId,
        );
        if (!room) return;

        let newStatus;
        if (currentStatus === 'Active') newStatus = 'Inactive';
        else if (currentStatus === 'Inactive') newStatus = 'Maintenance';
        else newStatus = 'Active';

        await RoomManagementApi.updateRoom(roomId, {
          ...room,
          Status: newStatus,
        });

        await refreshData();

        const statusLabel = {
          Active: 'kích hoạt',
          Inactive: 'khóa',
          Maintenance: 'bảo trì',
        }[newStatus];

        showToast('success', `✅ Đã ${statusLabel} phòng chiếu!`);
      } catch (error) {
        console.error('❌ Lỗi toggle status:', error);
        showToast('error', '❌ Không thể cập nhật trạng thái!');
      }
    },
    [rooms, selectedCinemaId, refreshData, showToast],
  );

  /**
   * 📋 Lấy danh sách phòng theo rạp
   */
  const getCinemaRooms = useCallback(
    (cinemaId) => {
      return rooms[cinemaId] || [];
    },
    [rooms],
  );

  /**
   * 📊 Lấy thống kê của rạp
   */
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
      // Fallback
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

  /**
   * 🪑 Cập nhật sơ đồ ghế
   */
  const updateSeats = useCallback(
    async (roomId, seats) => {
      try {
        setIsSubmitting(true);
        const response = await RoomManagementApi.updateSeats(roomId, seats);

        if (response.success) {
          showToast('success', '✅ Cập nhật sơ đồ ghế thành công!');
          // Refresh lại chi tiết phòng
          await loadRoomDetail(roomId);
          return true;
        }
        return false;
      } catch (error) {
        console.error('❌ Lỗi update seats:', error);
        showToast(
          'error',
          error.response?.data?.message || '❌ Cập nhật thất bại!',
        );
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [loadRoomDetail, showToast],
  );

  // ✅ Effect chỉ chạy 1 lần khi mount
  useEffect(() => {
    console.log('🚀 Khởi tạo useRoom...');
    loadDashboard();

    // ✅ Cleanup
    return () => {
      isMounted.current = false;
    };
  }, []); // ✅ Dependency array rỗng - CHỈ CHẠY 1 LẦN

  return {
    // Dữ liệu
    dashboardData,
    cinemas,
    rooms,
    roomDetail,
    loading,
    loadingDetail,
    isSubmitting,
    selectedCinemaId,

    // Actions
    setSelectedCinemaId,
    loadDashboard,
    loadRoomDetail,
    refreshData,
    handleAddRoom,
    handleUpdateRoom,
    handleDeleteRoom,
    handleToggleRoomStatus,
    getCinemaRooms,
    getStats,
    updateSeats,
    showToast,
  };
};
