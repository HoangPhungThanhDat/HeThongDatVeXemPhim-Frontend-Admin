import axios from "./AxiosAdmin";

const TicketApi = {
  getAll: () => axios.get("/tickets"),
  getById: (TicketId) => axios.get(`/tickets/${TicketId}`),
  create: (data) => axios.post("/tickets", data),
  update: (TicketId, data) => axios.put(`/tickets/${TicketId}`, data),
  delete: (TicketId) => axios.delete(`/tickets/${TicketId}`),
};

export default TicketApi;
