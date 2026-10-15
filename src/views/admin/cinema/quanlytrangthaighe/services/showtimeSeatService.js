// src/views/admin/quanlytrangthaighe/services/showtimeSeatService.js

import ShowtimeSeatApi from 'api/booking/ShowtimeSeatApi';
import ShowtimeApi from 'api/cinema/ShowtimeApi';
import CinemasApi from 'api/cinema/CinemasApi';
import RoomApi from 'api/cinema/RoomApi';

// Lấy danh sách trạng thái ghế theo showtime
export const fetchShowtimeSeats = async (showtimeId) => {
  try {
    const response = await ShowtimeSeatApi.getAll();
    const allSeats = response.data.data || response.data || [];

    if (showtimeId) {
      const filtered = allSeats.filter(
        (seat) => String(seat.ShowtimeId) === String(showtimeId),
      );
      return filtered;
    }
    return allSeats;
  } catch (error) {
    console.error('❌ Lỗi khi lấy danh sách trạng thái ghế:', error);
    throw error;
  }
};

// Lấy danh sách suất chiếu
export const fetchShowtimes = async () => {
  try {
    const response = await ShowtimeApi.getAll();
    return response.data.data || response.data || [];
  } catch (error) {
    console.error('❌ Lỗi khi lấy danh sách suất chiếu:', error);
    throw error;
  }
};

// Lấy danh sách rạp chiếu
export const fetchCinemas = async () => {
  try {
    const response = await CinemasApi.getAll();
    return response.data.data || response.data || [];
  } catch (error) {
    console.error('❌ Lỗi khi lấy danh sách rạp chiếu:', error);
    throw error;
  }
};

// Lấy danh sách phòng chiếu
export const fetchRooms = async () => {
  try {
    const response = await RoomApi.getAll();
    return response.data.data || response.data || [];
  } catch (error) {
    console.error('❌ Lỗi khi lấy danh sách phòng chiếu:', error);
    throw error;
  }
};

// Tạo ghế tự động cho suất chiếu
export const generateSeatsForShowtime = async (showtimeId) => {
  try {
    const response = await ShowtimeSeatApi.generateByShowtime(showtimeId);
    return response.data;
  } catch (error) {
    console.error('❌ Lỗi khi tạo ghế tự động:', error);
    throw error;
  }
};

// Cập nhật trạng thái ghế - ĐÚNG CẤU TRÚC BẢNG
export const updateSeatStatus = async (showtimeSeatId, data) => {
  try {
    // Kiểm tra dữ liệu bắt buộc
    if (!showtimeSeatId) {
      throw new Error('ShowtimeSeatId is required');
    }

    if (!data || !data.Status) {
      throw new Error('Status is required');
    }

    // Tạo dữ liệu update theo đúng cấu trúc bảng ShowtimeSeats
    const updateData = {
      ShowtimeId: data.ShowtimeId,
      SeatId: data.SeatId,
      Status: data.Status,
      UpdatedAt: data.UpdatedAt || new Date().toISOString(),
      UpdatedBy: data.UpdatedBy || 'admin',
    };

    // Log dữ liệu gửi đi
    console.log('📤 Updating seat status with data:', {
      showtimeSeatId,
      updateData,
    });

    const response = await ShowtimeSeatApi.update(showtimeSeatId, updateData);
    console.log('✅ Update seat status response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Lỗi khi cập nhật trạng thái ghế:', error);

    // Log chi tiết lỗi
    if (error.response) {
      console.error('❌ Response error data:', error.response.data);
      console.error('❌ Response error status:', error.response.status);
    }

    throw error;
  }
};

// Xóa trạng thái ghế
export const deleteShowtimeSeat = async (showtimeSeatId) => {
  try {
    const response = await ShowtimeSeatApi.delete(showtimeSeatId);
    return response.data;
  } catch (error) {
    console.error('❌ Lỗi khi xóa trạng thái ghế:', error);
    throw error;
  }
};

// Lấy thông tin chi tiết 1 trạng thái ghế
export const fetchShowtimeSeatById = async (showtimeSeatId) => {
  try {
    const response = await ShowtimeSeatApi.getById(showtimeSeatId);
    return response.data.data || response.data;
  } catch (error) {
    console.error('❌ Lỗi khi lấy chi tiết trạng thái ghế:', error);
    throw error;
  }
};
