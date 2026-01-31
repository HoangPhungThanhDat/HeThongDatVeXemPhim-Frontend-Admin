import axios from "./AxiosAdmin";

const SeatApi = {
  getAll: () => axios.get("/seats"),
  getById: (SeatId) => axios.get(`/seats/${SeatId}`),
  create: (data) => axios.post("/seats", data),
  createBulk: (data) => axios.post("/seats/bulk", data),
  update: (SeatId, data) => axios.put(`/seats/${SeatId}`, data),
  delete: (SeatId) => axios.delete(`/seats/${SeatId}`),
  deleteByRoom(roomId) {
  return axios.delete(`seats/room/${roomId}`);
}

};

export default SeatApi;
