import AxiosAdmin from "api/client/AxiosAdmin";

const DashboardApi = {
  getStatistics: (period = 'week') => AxiosAdmin.get(`/dashboard/statistics?period=${period}`),
};

export default DashboardApi;