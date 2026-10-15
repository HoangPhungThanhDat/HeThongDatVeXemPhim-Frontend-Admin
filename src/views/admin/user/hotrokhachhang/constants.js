// constants.js
export const STATUS_OPTIONS = [
    { value: "Chưa xử lý", label: "Chưa xử lý", color: "#dc2626", bg: "#fef2f2", dot: "#ef4444" },
    { value: "Đang xử lý", label: "Đang xử lý", color: "#f59e0b", bg: "#fffbeb", dot: "#f59e0b" },
    { value: "Đã xử lý", label: "Đã xử lý", color: "#059669", bg: "#ecfdf5", dot: "#10b981" },
  ];
  
  export const STATUS_CONFIG = {
    "Chưa xử lý": { color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", dot: "#ef4444" },
    "Đang xử lý": { color: "#f59e0b", bg: "#fffbeb", border: "#fcd34d", dot: "#f59e0b" },
    "Đã xử lý": { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", dot: "#10b981" },
  };
  
  export const getStatusBadge = (status) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG["Chưa xử lý"];
    return {
      ...config,
      label: status || "Chưa xử lý"
    };
  };
  
  export const DARK = {
    dark: {
      bgPage: "#0f172a",
      bgCard: "#1e293b",
      bgCardHover: "#2d3748",
      bgInput: "#2d3748",
      borderCard: "#334155",
      borderInput: "#374151",
      textPrimary: "#f1f5f9",
      textSecondary: "#94a3b8",
      textMuted: "#64748b",
      textBody: "#cbd5e1",
    },
    light: {
      bgPage: "#f8fafc",
      bgCard: "white",
      bgCardHover: "#fffaf7",
      bgInput: "#fafafa",
      borderCard: "#f1f5f9",
      borderInput: "#e8edf3",
      textPrimary: "#0f172a",
      textSecondary: "#64748b",
      textMuted: "#94a3b8",
      textBody: "#334155",
    }
  };