// src/api/RoomApi.js
import axios from "./AxiosAdmin";

const RoomApi = {
  getAll: () => axios.get("/rooms"),
  getById: (RoomId) => axios.get(`/rooms/${RoomId}`),
  
  // ✅ Lấy phòng theo rạp
  getByCinema: (cinemaId) => axios.get(`/rooms?cinemaId=${cinemaId}`),
  
  create: (data) => axios.post("/rooms", data),
  update: (RoomId, data) => axios.put(`/rooms/${RoomId}`, data),
  delete: (RoomId) => axios.delete(`/rooms/${RoomId}`),
};

export default RoomApi;