// src/api/SeatManagementApi.js

import axios from '../client/AxiosAdmin';

const SeatManagementApi = {
  // Lấy toàn bộ dữ liệu (rạp, phòng, suất chiếu, ghế)
  getData: (params = {}) => {
    return axios.get('/seat-management/data', { params });
  },

  // Lấy ghế theo suất chiếu
  getSeatsByShowtime: (showtimeId) => {
    return axios.get(`/seat-management/showtime/${showtimeId}/seats`);
  },

  // Tạo ghế tự động
  generateSeats: (showtimeId) => {
    return axios.post('/seat-management/generate', { showtime_id: showtimeId });
  },

  // Cập nhật trạng thái ghế
  updateSeat: (showtimeSeatId, status) => {
    return axios.put('/seat-management/seat', {
      showtime_seat_id: showtimeSeatId,
      status: status,
    });
  },

  // Reset ghế
  resetSeat: (showtimeSeatId) => {
    return axios.post('/seat-management/reset', {
      showtime_seat_id: showtimeSeatId,
    });
  },

  // Xóa ghế
  deleteSeat: (showtimeSeatId) => {
    return axios.delete('/seat-management/seat', {
      data: { showtime_seat_id: showtimeSeatId },
    });
  },
};

export default SeatManagementApi;
