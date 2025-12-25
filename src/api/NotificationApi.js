import axios from "./AxiosAdmin";

const NotificationApi = {
  getAll: () => axios.get("/notifications"),
  getById: (NotificationId) => axios.get(`/notifications/${NotificationId}`),
  create: (data) => axios.post("/notifications", data),
  update: (NotificationId, data) => axios.put(`/notifications/${NotificationId}`, data),
  delete: (NotificationId) => axios.delete(`/notifications/${NotificationId}`),
};

export default NotificationApi;