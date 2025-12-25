import axios from "./AxiosAdmin";

const ScheduleApi = {
  getAll: () => axios.get("/schedules"),
  getById: (ScheduleId) => axios.get(`/schedules/${ScheduleId}`),
  create: (data) => axios.post("/schedules", data),
  update: (ScheduleId, data) => axios.put(`/schedules/${ScheduleId}`, data),
  delete: (ScheduleId) => axios.delete(`/schedules/${ScheduleId}`),
};

export default ScheduleApi;
