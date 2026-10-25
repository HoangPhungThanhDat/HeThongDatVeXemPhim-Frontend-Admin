// src/views/admin/quanlylichchieudinhky/constants.js

export const BASE = {
    or1: "#f97316", or2: "#ea6c0a", or3: "#fff3e8", or4: "#fed7aa",
    green: "#059669", greenBg: "#ecfdf5", greenBdr: "#a7f3d0",
    amber: "#d97706", amberBg: "#fffbeb", amberBdr: "#fde68a",
    red: "#dc2626", redBg: "#fef2f2", redBdr: "#fecaca",
    blue: "#2563eb", blueBg: "#eff6ff", blueBdr: "#bfdbfe",
    violet: "#7c3aed", violetBg: "#f5f3ff", violetBdr: "#ddd6fe",
};

export const DAYS_VI = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
export const DAYS_FULL = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

export const fmt = n => n.toLocaleString("vi-VN") + "đ";

// Hàm giả lập để tránh lỗi import ở các file cũ
export const timeTier = (t) => "sáng";
export const tierColor = () => BASE.or1;
export const tierBg = () => BASE.or3;
export const tierBdr = () => BASE.or4;
export const CINEMAS = []; // Rỗng vì đã dùng API
export const getCinema = () => null; 

export const getMovie = (id, movies) => {
  if (!movies) return null;
  return movies.find(m => m.MovieId === id);
};

export const DAYS_MAP = {
  "Thứ 2": "Mon", "Thứ 3": "Tue", "Thứ 4": "Wed",
  "Thứ 5": "Thu", "Thứ 6": "Fri", "Thứ 7": "Sat", "Chủ nhật": "Sun", "CN": "Sun"
};

export const REVERSE_DAYS_MAP = {
  "Mon": "Thứ 2", "Tue": "Thứ 3", "Wed": "Thứ 4",
  "Thu": "Thứ 5", "Fri": "Thứ 6", "Sat": "Thứ 7", "Sun": "Chủ nhật"
};

export const STATUS_MAP = {
  "Active": { color: BASE.green, bg: BASE.greenBg, border: BASE.greenBdr, dot: "pulse", label: "Đang hoạt động" },
  "Inactive": { color: BASE.amber, bg: BASE.amberBg, border: BASE.amberBdr, dot: "solid", label: "Tạm dừng" },
  "Deleted": { color: "#6b7280", bg: "#f3f4f6", border: "#d1d5db", dot: "solid", label: "Đã xóa" },
};

export const DAYS_OPTIONS_VI = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];