import axios from "./AxiosAdmin";

const WishlistApi = {
  getAll: () => axios.get("/wishlists"),
  getById: (WishlistId) => axios.get(`/wishlists/${WishlistId}`),
  create: (data) => axios.post("/wishlists", data),
  update: (WishlistId, data) => axios.put(`/wishlists/${WishlistId}`, data),
  delete: (WishlistId) => axios.delete(`/wishlists/${WishlistId}`),
};

export default WishlistApi;
