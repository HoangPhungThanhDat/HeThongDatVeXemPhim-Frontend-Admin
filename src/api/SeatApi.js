// src/api/SeatApi.js
import axios from "./AxiosAdmin";

const SeatApi = {
  getAll: () => axios.get("/seats"),
  getById: (SeatId) => axios.get(`/seats/${SeatId}`),
  
  // ✅ Lấy ghế theo phòng - Cách 1: Dùng query parameter
  getByRoom: (roomId) => axios.get(`/seats?roomId=${roomId}`),
  
  // ✅ Lấy ghế theo phòng và trạng thái
  getByRoomAndStatus: (roomId, status) => axios.get(`/seats?roomId=${roomId}&status=${status}`),
  
  create: (data) => axios.post("/seats", data),
  createBulk: (data) => axios.post("/seats/bulk", data),
  update: (SeatId, data) => axios.put(`/seats/${SeatId}`, data),
  delete: (SeatId) => axios.delete(`/seats/${SeatId}`),
  deleteByRoom: (roomId) => axios.delete(`/seats?roomId=${roomId}`),
};

export default SeatApi;