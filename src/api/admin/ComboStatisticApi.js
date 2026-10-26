import AxiosAdmin from "api/client/AxiosAdmin";

const ComboStatisticApi = {
  getStatistics: (period = '7days') => AxiosAdmin.get(`/dashboard/combo-statistics?period=${period}`),
};

export default ComboStatisticApi;