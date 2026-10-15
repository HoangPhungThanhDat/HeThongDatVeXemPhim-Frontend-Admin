// src/views/admin/quanlyrapchieu/hooks/useCinema.js

import { useState, useEffect, useCallback } from 'react';
import CinemasApi from 'api/cinema/CinemasApi';
import Swal from 'sweetalert2';

export const useCinema = () => {
  const [cinemas, setCinemas] = useState([]);
  const [rooms, setRooms] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await CinemasApi.getAll();
      const data = response.data.data || response.data || [];
      setCinemas(data);

      const roomsData = {};
      data.forEach((c) => {
        roomsData[c.CinemaId] = c.Rooms || [];
      });
      setRooms(roomsData);
    } catch (error) {
      console.error('❌ Lỗi load cinemas:', error);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Không thể tải dữ liệu rạp!',
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
      position: 'top-end',
      icon,
      title: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  }, []);

  // ✅ ADD CINEMA - Hỗ trợ upload ảnh lên Cloudinary
  const handleAddCinema = useCallback(
    async (formData) => {
      setIsSubmitting(true);
      try {
        const payload = new FormData();
        payload.append('Name', formData.Name);
        payload.append('Address', formData.Address);
        payload.append('City', formData.City);
        payload.append('Phone', formData.Phone);
        payload.append('Email', formData.Email || '');
        payload.append('Status', formData.Status || 'Active');
        payload.append('OpenTime', formData.OpenTime || '08:00 – 23:00');
        payload.append('Description', formData.Description || '');
        payload.append('Manager', formData.Manager || '');

        // ✅ Upload ảnh lên Cloudinary
        if (formData.ImageFile instanceof File) {
          payload.append('ImageUrl', formData.ImageFile);
        }

        console.log('📤 Creating cinema:', {
          Name: formData.Name,
          Address: formData.Address,
          hasImage: formData.ImageFile instanceof File,
        });

        const response = await CinemasApi.create(payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const newCinema = response.data.data || response.data;
        setCinemas((prev) => [newCinema, ...prev]);
        setRooms((prev) => ({ ...prev, [newCinema.CinemaId]: [] }));

        showToast('success', '🎉 Thêm rạp thành công!');
        setIsSubmitting(false);
        return true;
      } catch (error) {
        console.error('❌ Lỗi add cinema:', error);
        showToast(
          'error',
          error.response?.data?.message || '❌ Thêm thất bại!',
        );
        setIsSubmitting(false);
        return false;
      }
    },
    [showToast],
  );

  // ✅ UPDATE CINEMA - Hỗ trợ upload ảnh mới lên Cloudinary
  const handleUpdateCinema = useCallback(
    async (cinemaId, formData) => {
      setIsSubmitting(true);
      try {
        const payload = new FormData();
        payload.append('_method', 'PUT');
        payload.append('Name', formData.Name);
        payload.append('Address', formData.Address);
        payload.append('City', formData.City);
        payload.append('Phone', formData.Phone);
        payload.append('Email', formData.Email || '');
        payload.append('Status', formData.Status || 'Active');
        payload.append('OpenTime', formData.OpenTime || '08:00 – 23:00');
        payload.append('Description', formData.Description || '');
        payload.append('Manager', formData.Manager || '');

        // ✅ Upload ảnh mới lên Cloudinary (nếu có)
        if (formData.ImageFile instanceof File) {
          payload.append('ImageUrl', formData.ImageFile);
        }

        console.log(`📤 Updating cinema ${cinemaId}:`, {
          Name: formData.Name,
          Address: formData.Address,
          hasImage: formData.ImageFile instanceof File,
        });

        const response = await CinemasApi.update(cinemaId, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const updatedCinema = response.data.data || response.data;
        setCinemas((prev) =>
          prev.map((c) => (c.CinemaId === cinemaId ? updatedCinema : c)),
        );

        showToast('success', '✅ Cập nhật rạp thành công!');
        setIsSubmitting(false);
        return true;
      } catch (error) {
        console.error('❌ Lỗi update cinema:', error);
        showToast(
          'error',
          error.response?.data?.message || '❌ Cập nhật thất bại!',
        );
        setIsSubmitting(false);
        return false;
      }
    },
    [showToast],
  );

  // ✅ DELETE CINEMA - Xóa cả ảnh trên Cloudinary
  const handleDeleteCinema = useCallback(
    async (cinemaId) => {
      try {
        await CinemasApi.delete(cinemaId);
        setCinemas((prev) => prev.filter((c) => c.CinemaId !== cinemaId));
        setRooms((prev) => {
          const newRooms = { ...prev };
          delete newRooms[cinemaId];
          return newRooms;
        });
        showToast('success', '🗑️ Xóa rạp thành công!');
        return true;
      } catch (error) {
        console.error('❌ Lỗi delete cinema:', error);
        showToast('error', error.response?.data?.message || '❌ Xóa thất bại!');
        return false;
      }
    },
    [showToast],
  );

  // ✅ TOGGLE STATUS - Bật/tắt trạng thái rạp
  const handleToggleStatus = useCallback(
    async (cinemaId, currentStatus) => {
      try {
        const cinema = cinemas.find((c) => c.CinemaId === cinemaId);
        if (!cinema) return;

        const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
        const payload = new FormData();
        payload.append('_method', 'PUT');
        payload.append('Name', cinema.Name || '');
        payload.append('Address', cinema.Address || '');
        payload.append('City', cinema.City || '');
        payload.append('Phone', cinema.Phone || '');
        payload.append('Email', cinema.Email || '');
        payload.append('Status', newStatus);
        payload.append('OpenTime', cinema.OpenTime || '08:00 – 23:00');
        payload.append('Description', cinema.Description || '');
        payload.append('Manager', cinema.Manager || '');

        // ✅ Giữ nguyên ảnh cũ
        if (cinema.ImageUrl) {
          payload.append('ImageUrl', cinema.ImageUrl);
        }

        await CinemasApi.update(cinemaId, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        setCinemas((prev) =>
          prev.map((c) =>
            c.CinemaId === cinemaId ? { ...c, Status: newStatus } : c,
          ),
        );

        showToast(
          'success',
          `✅ Đã ${newStatus === 'Active' ? 'kích hoạt' : 'khóa'} rạp!`,
        );
      } catch (error) {
        console.error('❌ Lỗi toggle status:', error);
        showToast('error', '❌ Không thể cập nhật trạng thái!');
      }
    },
    [cinemas, showToast],
  );

  // ✅ GET CINEMA STATS - Tính tổng ghế từ API
  const getCinemaStats = useCallback(() => {
    let totalRooms = 0;
    let totalSeats = 0;

    // ✅ Tính tổng từ cinemas (dữ liệu từ API)
    cinemas.forEach((cinema) => {
      totalRooms += cinema.TotalRooms || 0;
      totalSeats += cinema.TotalSeats || 0;
    });

    return {
      total: cinemas.length,
      active: cinemas.filter((c) => c.Status === 'Active').length,
      inactive: cinemas.filter((c) => c.Status === 'Inactive').length,
      totalRooms: totalRooms,
      totalSeats: totalSeats,
    };
  }, [cinemas]);

  // ✅ ADD ROOM - Thêm phòng chiếu
  const handleAddRoom = useCallback(
    (cinemaId, roomData) => {
      const newRoom = {
        RoomId: Date.now(),
        Name: roomData.Name,
        RoomType: roomData.RoomType || '2D',
        Seats: roomData.Seats || 0,
        Status: roomData.Status || 'Active',
      };

      setRooms((prev) => ({
        ...prev,
        [cinemaId]: [...(prev[cinemaId] || []), newRoom],
      }));

      showToast('success', '✅ Thêm phòng chiếu thành công!');
    },
    [showToast],
  );

  // ✅ TOGGLE ROOM STATUS - Bật/tắt trạng thái phòng
  const handleToggleRoomStatus = useCallback(
    (cinemaId, roomId) => {
      setRooms((prev) => {
        const updated = (prev[cinemaId] || []).map((r) =>
          r.RoomId === roomId || r.id === roomId
            ? { ...r, Status: r.Status === 'Active' ? 'Inactive' : 'Active' }
            : r,
        );
        return { ...prev, [cinemaId]: updated };
      });

      const room = (rooms[cinemaId] || []).find(
        (r) => r.RoomId === roomId || r.id === roomId,
      );
      const isActive = room?.Status === 'Active';
      showToast(
        'info',
        isActive ? '⏸ Phòng đã chuyển bảo trì' : '✅ Phòng đã kích hoạt',
      );
    },
    [rooms, showToast],
  );

  // ✅ DELETE ROOM - Xóa phòng chiếu
  const handleDeleteRoom = useCallback(
    (cinemaId, roomId) => {
      setRooms((prev) => ({
        ...prev,
        [cinemaId]: (prev[cinemaId] || []).filter(
          (r) => r.RoomId !== roomId && r.id !== roomId,
        ),
      }));
      showToast('info', '🗑️ Đã xóa phòng chiếu');
    },
    [showToast],
  );

  return {
    cinemas,
    setCinemas,
    rooms,
    loading,
    isSubmitting,
    setIsSubmitting,
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
