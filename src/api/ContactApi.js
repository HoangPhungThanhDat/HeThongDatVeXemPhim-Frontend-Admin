import axios from "./AxiosAdmin";

const ContactApi = {
  getAll: () => axios.get("/contacts"),
  getById: (ContactId) => axios.get(`/contacts/${ContactId}`),
  create: (data) => axios.post("/contacts", data),
  update: (ContactId, data) => axios.put(`/contacts/${ContactId}`, data),
  delete: (ContactId) => axios.delete(`/contacts/${ContactId}`),
};

export default ContactApi;