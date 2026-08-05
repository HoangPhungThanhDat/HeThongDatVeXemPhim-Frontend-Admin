// src/api/SeatApi.js
import axios from "./AxiosAdmin";

const SeatApi = {
  getAll: () => axios.get("/seats"),
  getById: (SeatId) => axios.get(`/seats/${SeatId}`),
  
  // ✅ Lấy ghế theo phòng
  getByRoom: (roomId) => axios.get(`/seats?roomId=${roomId}`),
  
  // ✅ Lấy ghế theo phòng và trạng thái
  getByRoomAndStatus: (roomId, status) => axios.get(`/seats?roomId=${roomId}&status=${status}`),
  
  // ✅ QUAN TRỌNG: Lấy ghế theo suất chiếu (để lấy thông tin ghế trong suất chiếu)
  getByShowtime: (showtimeId) => axios.get(`/seats?showtimeId=${showtimeId}`),
  
  // ✅ Lấy ghế theo suất chiếu và trạng thái
  getByShowtimeAndStatus: (showtimeId, status) => axios.get(`/seats?showtimeId=${showtimeId}&status=${status}`),
  
  create: (data) => axios.post("/seats", data),
  createBulk: (data) => axios.post("/seats/bulk", data),
  update: (SeatId, data) => axios.put(`/seats/${SeatId}`, data),
  delete: (SeatId) => axios.delete(`/seats/${SeatId}`),
  deleteByRoom: (roomId) => axios.delete(`/seats?roomId=${roomId}`),
  
  // ✅ Server-side pagination
  getPaged: ({ page = 1, limit = 10, roomId = "", status = "", signal } = {}) => {
    const params = new URLSearchParams({ page, limit });
    if (roomId) params.append("roomId", roomId);
    if (status) params.append("status", status);
    return axios.get(`/seats/paged?${params}`, { signal });
  },
};

export default SeatApi;