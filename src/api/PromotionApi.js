import axiosAdmin from "./AxiosAdmin";

const PromotionApi = {
  getAll: () => axiosAdmin.get("/promotions"), 
  getById: (PromotionId) => axiosAdmin.get(`/promotions/${PromotionId}`), 

  create: (data, config = {}) => {
    return axiosAdmin.post("/promotions", data, {
      ...config,
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  update: (PromotionId, data, config = {}) => {
    if (data instanceof FormData) {
      data.append("_method", "PUT");
      return axiosAdmin.post(`/promotions/${PromotionId}`, data, {
        ...config,
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
    return axiosAdmin.put(`/promotions/${PromotionId}`, data, config);
  },

  delete: (PromotionId) => axiosAdmin.delete(`/promotions/${PromotionId}`),
};

export default PromotionApi;
