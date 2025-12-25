import axios from "./AxiosAdmin";

const RoomApi = {
  getAll: () => axios.get("/rooms"),
  getById: (RoomId) => axios.get(`/rooms/${RoomId}`),
  create: (data) => axios.post("/rooms", data),
  update: (RoomId, data) => axios.put(`/rooms/${RoomId}`, data),
  delete: (RoomId) => axios.delete(`/rooms/${RoomId}`),
};

export default RoomApi;
