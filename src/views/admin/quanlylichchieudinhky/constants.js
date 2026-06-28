// src/views/admin/quanlylichchieudinhky/constants.js

export const BASE = {
    or1: "#f97316",
    or2: "#ea6c0a",
    or3: "#fff3e8",
    or4: "#fed7aa",
    green: "#059669",
    greenBg: "#ecfdf5",
    greenBdr: "#a7f3d0",
    amber: "#d97706",
    amberBg: "#fffbeb",
    amberBdr: "#fde68a",
    red: "#dc2626",
    redBg: "#fef2f2",
    redBdr: "#fecaca",
    blue: "#2563eb",
    blueBg: "#eff6ff",
    blueBdr: "#bfdbfe",
    violet: "#7c3aed",
    violetBg: "#f5f3ff",
    violetBdr: "#ddd6fe",
  };
  
  // Dữ liệu mẫu cho CINEMAS (có thể thay thế bằng API sau)
  export const CINEMAS = [
    { id: 1, name: "Gấu Phim Hà Nội", city: "HN" },
    { id: 2, name: "Gấu Phim TP.HCM", city: "HCM" },
    { id: 3, name: "Gấu Phim Đà Nẵng", city: "ĐN" },
  ];
  
  export const DAYS_VI = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  export const DAYS_FULL = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
  export const ALL_TIMES = ["08:00","09:30","10:00","11:30","13:00","14:30","16:00","17:30","19:00","20:30","22:00"];
  
  // Helper functions
  export const timeTier = t => { const h = +t.split(":")[0]; return h < 12 ? "sáng" : h < 18 ? "chiều" : "tối"; };
  export const tierColor = (t) => ({ sáng: BASE.amber, chiều: BASE.or1, tối: BASE.violet }[timeTier(t)]);
  export const tierBg = (t) => ({ sáng: BASE.amberBg, chiều: BASE.or3, tối: BASE.violetBg }[timeTier(t)]);
  export const tierBdr = (t) => ({ sáng: BASE.amberBdr, chiều: BASE.or4, tối: BASE.violetBdr }[timeTier(t)]);
  export const fmt = n => n.toLocaleString("vi-VN") + "đ";
  
  // Các hàm helper cần thiết cho BulkEditPriceModal và CloneWeekModal
  export const getMovie = (id, movies) => {
    if (!movies) return null;
    return movies.find(m => m.MovieId === id);
  };
  
  export const getCinema = (id) => {
    return CINEMAS.find(c => c.id === id);
  };
  
  // Map từ tiếng Việt sang tiếng Anh cho API
  export const DAYS_MAP = {
    "Thứ 2": "Mon",
    "Thứ 3": "Tue",
    "Thứ 4": "Wed",
    "Thứ 5": "Thu",
    "Thứ 6": "Fri",
    "Thứ 7": "Sat",
    "Chủ nhật": "Sun",
    "CN": "Sun"
  };
  
  export const REVERSE_DAYS_MAP = {
    "Mon": "Thứ 2",
    "Tue": "Thứ 3",
    "Wed": "Thứ 4",
    "Thu": "Thứ 5",
    "Fri": "Thứ 6",
    "Sat": "Thứ 7",
    "Sun": "Chủ nhật"
  };
  
  export const STATUS_MAP = {
    "Active": { color: BASE.green, bg: BASE.greenBg, border: BASE.greenBdr, dot: "pulse", label: "Đang hoạt động" },
    "Inactive": { color: BASE.amber, bg: BASE.amberBg, border: BASE.amberBdr, dot: "solid", label: "Tạm dừng" },
    "Deleted": { color: "#6b7280", bg: "#f3f4f6", border: "#d1d5db", dot: "solid", label: "Đã xóa" },
  };
  
  export const DAYS_OPTIONS_VI = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];