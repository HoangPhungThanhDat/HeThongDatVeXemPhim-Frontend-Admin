// src/api/RoomSeatApi.js

import axios from '../client/AxiosAdmin';

const RoomSeatApi = {
  // Lấy danh sách rạp
  getCinemas: () => {
    return axios.get('/room-seat/cinemas');
  },

  // Lấy danh sách phòng theo rạp
  getRooms: (cinemaId) => {
    return axios.get('/room-seat/rooms', { params: { cinema_id: cinemaId } });
  },

  // Lấy sơ đồ ghế theo phòng
  getSeats: (roomId) => {
    return axios.get(`/room-seat/room/${roomId}/seats`);
  },

  // ✅ Tạo nhiều ghế cùng lúc (Bulk Create)
  createBulkSeats: (roomId, seats) => {
    return axios.post('/seat-management/bulk-seats', {
      room_id: roomId,
      seats,
    });
  },

  // Thêm hàng
  addRows: (roomId, rowCount, position = 'end') => {
    return axios.post(`/room-seat/room/${roomId}/add-rows`, {
      row_count: rowCount,
      position: position,
    });
  },

  // Thêm cột
  addCols: (roomId, colCount, position = 'end') => {
    return axios.post(`/room-seat/room/${roomId}/add-cols`, {
      col_count: colCount,
      position: position,
    });
  },

  // Cập nhật ghế
  updateSeat: (seatId, data) => {
    return axios.put(`/room-seat/seat/${seatId}`, {
      seat_type: data.seat_type || data.SeatType || 'Normal',
      status: data.status || data.Status || 'Available',
    });
  },

  // Xóa hàng
  deleteRow: (roomId, row) => {
    return axios.delete(`/room-seat/room/${roomId}/row/${row}`);
  },

  // Xóa cột
  deleteCol: (roomId, col) => {
    return axios.delete(`/room-seat/room/${roomId}/col/${col}`);
  },

  // Xóa 1 ghế
  deleteSeat: (seatId) => {
    return axios.delete(`/room-seat/seat/${seatId}`);
  },

  // Reset tất cả ghế
  resetSeats: (roomId) => {
    return axios.post(`/room-seat/room/${roomId}/reset`);
  },
};

export default RoomSeatApi;
