import AxiosAdmin from "api/client/AxiosAdmin";

const AuditLogApi = {
  getLogs: (params) => AxiosAdmin.get("/auditlogs", { params }),
};

export default AuditLogApi;