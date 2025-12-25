import axios from "./AxiosAdmin";

const ReviewApi = {
  getAll: () => axios.get("/reviews"),
  getById: (ReviewId) => axios.get(`/reviews/${ReviewId}`),
  create: (data) => axios.post("/reviews", data),
  update: (ReviewId, data) => axios.put(`/reviews/${ReviewId}`, data),
  delete: (ReviewId) => axios.delete(`/reviews/${ReviewId}`),
};

export default ReviewApi;
