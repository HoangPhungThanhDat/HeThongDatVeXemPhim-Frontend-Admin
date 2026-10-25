import AxiosAdmin from "api/client/AxiosAdmin";

const DashboardApi = {
  getStatistics: () => AxiosAdmin.get("/dashboard/statistics"),
};

export default DashboardApi;