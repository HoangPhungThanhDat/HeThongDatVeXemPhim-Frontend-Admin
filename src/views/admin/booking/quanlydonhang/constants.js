// src/views/admin/quanlydonhang/constants.js

export const ORDER_STATUS_CFG = {
  // Status tiếng Việt
  "Đã đặt": { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", dot: "#10b981" },
  "Đã check-in": { color: "#0284c7", bg: "#f0f9ff", border: "#bae6fd", dot: "#38bdf8" },
  "Đã hủy": { color: "#dc2626", bg: "#fef2f2", border: "#fecaca", dot: "#ef4444" },
  "Hết hạn": { color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb", dot: "#9ca3af" },
  "Đã thanh toán": { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", dot: "#10b981" },
  "Chờ thanh toán": { color: "#ea580c", bg: "#fff7ed", border: "#fed7aa", dot: "#fb923c" },
  "Đã hoàn tiền": { color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe", dot: "#a78bfa" },
  "Hoàn tiền": { color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe", dot: "#a78bfa" },
  "Chờ xử lý": { color: "#ea580c", bg: "#fff7ed", border: "#fed7aa", dot: "#fb923c" },
  
  // Status tiếng Anh từ API
  "Pending": { color: "#ea580c", bg: "#fff7ed", border: "#fed7aa", dot: "#fb923c" },
  "Paid": { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", dot: "#10b981" },
  "Cancelled": { color: "#dc2626", bg: "#fef2f2", border: "#fecaca", dot: "#ef4444" },
  "Completed": { color: "#0284c7", bg: "#f0f9ff", border: "#bae6fd", dot: "#38bdf8" },
  "Refunded": { color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe", dot: "#a78bfa" },
  "Expired": { color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb", dot: "#9ca3af" },
};

export const PAYMENT_STATUS_CFG = {
  "Đã thanh toán": { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", dot: "#10b981" },
  "Chờ thanh toán": { color: "#ea580c", bg: "#fff7ed", border: "#fed7aa", dot: "#fb923c" },
  "Đã hoàn tiền": { color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe", dot: "#a78bfa" },
  "Success": { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", dot: "#10b981" },
  "Failed": { color: "#dc2626", bg: "#fef2f2", border: "#fecaca", dot: "#ef4444" },
  "Pending": { color: "#ea580c", bg: "#fff7ed", border: "#fed7aa", dot: "#fb923c" },
};

export const REFUND_STATUS_CFG = {
  "Đang chờ duyệt": { color: "#ea580c", bg: "#fff7ed", border: "#fed7aa", dot: "#fb923c" },
  "Đã duyệt": { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", dot: "#10b981" },
  "Từ chối": { color: "#dc2626", bg: "#fef2f2", border: "#fecaca", dot: "#ef4444" },
};

export const PAYMENT_METHOD_CFG = {
  "Tiền mặt": { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7" },
  "Chuyển khoản": { color: "#0284c7", bg: "#f0f9ff", border: "#bae6fd" },
  "Ví điện tử": { color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
};

export const ORDER_STATUS_OPTIONS = [
  "Tất cả",
  "Đã đặt",
  "Đã check-in",
  "Đã hủy",
  "Hết hạn",
  "Chờ thanh toán",
  "Đã thanh toán",
  "Hoàn tiền",
];

export const PAYMENT_STATUS_OPTIONS = [
  "Tất cả",
  "Đã thanh toán",
  "Chờ thanh toán",
  "Đã hoàn tiền",
];

export const COL = {
  idx: "36px",
  order: "1",
  cinema: "150px",
  showtime: "138px",
  total: "116px",
  payment: "132px",
  status: "128px",
  actions: "140px",
};

export const OR = "#ea580c";
export const ORL = "#fb923c";
export const ORPL = "#fff7ed";
export const ORBD = "#fed7aa";
export const ORSW = "rgba(234,88,12,0.25)";

export const fmtVND = (n) => {
  if (!n && n !== 0) return "0đ";
  return n.toLocaleString("vi-VN") + "đ";
};