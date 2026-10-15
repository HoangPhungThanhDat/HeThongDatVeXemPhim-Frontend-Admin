// src/views/admin/quanlydatve/constants.js

export const STATUS_ORDER = {
    "Đã đặt": { color: "#2563eb", bg: "#eff6ff", border: "#93c5fd", dot: "#3b82f6" },
    "Đã check-in": { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", dot: "#10b981" },
    "Đã hủy": { color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", dot: "#ef4444" },
    "Hoàn tiền": { color: "#d97706", bg: "#fffbeb", border: "#fcd34d", dot: "#f59e0b" },
    "Hết hạn": { color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb", dot: "#9ca3af" },
    "Chờ xử lý": { color: "#d97706", bg: "#fffbeb", border: "#fcd34d", dot: "#f59e0b" },
    "Đã duyệt": { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", dot: "#10b981" },
    "Từ chối": { color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", dot: "#ef4444" },
    "Paid": { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", dot: "#10b981" },
    "Pending": { color: "#d97706", bg: "#fffbeb", border: "#fcd34d", dot: "#f59e0b" },
    "Cancelled": { color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", dot: "#ef4444" },
    "Completed": { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", dot: "#10b981" },
    "Refunded": { color: "#d97706", bg: "#fffbeb", border: "#fcd34d", dot: "#f59e0b" },
    "Expired": { color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb", dot: "#9ca3af" },
  };
  
  export const STATUS_PAY = {
    "Đã thanh toán": { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7" },
    "Chờ thanh toán": { color: "#d97706", bg: "#fffbeb", border: "#fcd34d" },
    "Đã hoàn": { color: "#7c3aed", bg: "#f5f3ff", border: "#c4b5fd" },
    "Thất bại": { color: "#dc2626", bg: "#fef2f2", border: "#fca5a5" },
    "Success": { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7" },
    "Failed": { color: "#dc2626", bg: "#fef2f2", border: "#fca5a5" },
    "Pending": { color: "#d97706", bg: "#fffbeb", border: "#fcd34d" },
    "Refunded": { color: "#7c3aed", bg: "#f5f3ff", border: "#c4b5fd" },
  };
  
  export const STATUS_REFUND = {
    "Chờ xử lý": { color: "#d97706", bg: "#fffbeb", border: "#fcd34d" },
    "Đã duyệt": { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7" },
    "Từ chối": { color: "#dc2626", bg: "#fef2f2", border: "#fca5a5" },
  };
  
  export const PAY_METHODS = [
    "Ví MoMo",
    "Ví ZaloPay",
    "Thẻ VISA",
    "Thẻ Mastercard",
    "Chuyển khoản",
    "Tiền mặt",
  ];
  
  export const FORMATS = ["2D", "3D", "IMAX", "4DX"];
  
  export const ORDER_STATUS_OPTIONS = [
    "Tất cả",
    "Đã đặt",
    "Đã check-in",
    "Đã hủy",
    "Hoàn tiền",
    "Hết hạn",
    "Chờ xử lý",
    "Paid",
    "Pending",
    "Cancelled",
    "Completed",
    "Refunded",
    "Expired",
  ];
  
  export const PAY_STATUS_OPTIONS = [
    "Tất cả",
    "Đã thanh toán",
    "Chờ thanh toán",
    "Đã hoàn",
    "Thất bại",
    "Success",
    "Failed",
    "Pending",
    "Refunded",
  ];