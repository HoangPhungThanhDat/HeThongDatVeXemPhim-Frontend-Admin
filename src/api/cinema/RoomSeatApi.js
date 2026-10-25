import axios from '../client/AxiosAdmin';

const RoomSeatApi = {
  getCinemas: () => axios.get('/room-seat/cinemas'),
  getRooms: (cinemaId) => axios.get('/room-seat/rooms', { params: { cinema_id: cinemaId } }),
  getSeats: (roomId) => axios.get(`/room-seat/room/${roomId}/seats`),

  createBulkSeats: (roomId, seats) => axios.post('/seat-management/bulk-seats', { room_id: roomId, seats }),

  // ✅ API MỚI: Gộp thêm hàng và cột
  addSeats: (roomId, rowCount, colCount, position = 'end') => {
    const payload = {
      row_count: Number(rowCount),
      col_count: Number(colCount),
      position: position,
    };
    console.log("📤 [API addSeats] Payload:", payload);
    
    return axios.post(`/room-seat/room/${roomId}/add-seats`, payload)
      .catch(error => {
        console.error("🔥 [API addSeats] Lỗi từ Backend:", JSON.stringify(error.response?.data, null, 2));
        throw error;
      });
  },

  // Các API cũ (giữ để tương thích ngược)
  addRows: (roomId, rowCount, position = 'end') => {
    return axios.post(`/room-seat/room/${roomId}/add-rows`, { row_count: Number(rowCount), position });
  },

  addCols: (roomId, colCount, position = 'end') => {
    return axios.post(`/room-seat/room/${roomId}/add-cols`, { col_count: Number(colCount), position });
  },

  updateSeat: (seatId, data) => {
    return axios.put(`/room-seat/seat/${seatId}`, {
      seat_type: data.seat_type || data.SeatType || 'Normal',
      status: data.status || data.Status || 'Available',
    });
  },

  deleteRow: (roomId, row) => axios.delete(`/room-seat/room/${roomId}/row/${row}`),
  deleteCol: (roomId, col) => axios.delete(`/room-seat/room/${roomId}/col/${col}`),
  deleteSeat: (seatId) => axios.delete(`/room-seat/seat/${seatId}`),
  resetSeats: (roomId) => axios.post(`/room-seat/room/${roomId}/reset`),
};

export default RoomSeatApi;