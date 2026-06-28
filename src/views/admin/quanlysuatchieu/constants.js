

export const STATUS = {
  "Scheduled": { color: "#059669", bg: "#ecfdf5", border: "#a7f3d0", dot: "#10b981", icon: "MdPlayCircle", tag: "🟢", label: "Đã lên lịch" },
  "Cancelled": { color: "#d97706", bg: "#fffbeb", border: "#fde68a", dot: "#f59e0b", icon: "MdTimer", tag: "🟡", label: "Đã hủy" },
  "Finished": { color: "#6b7280", bg: "#f3f4f6", border: "#e5e7eb", dot: "#9ca3af", icon: "MdDone", tag: "⚫", label: "Đã kết thúc" },
};

export const STATUS_OPTIONS = ["Tất cả", "Scheduled", "Cancelled", "Finished"];
export const STATUS_LABELS = {
  "Scheduled": "Đã lên lịch",
  "Cancelled": "Đã hủy",
  "Finished": "Đã kết thúc"
};

export const DEFAULT_SHOWTIMES = [];

export const TIME_SLOTS_DEFAULT = [
  { id: 1, from: "00:00", to: "06:00", price: "" },
  { id: 2, from: "06:00", to: "12:00", price: "" },
  { id: 3, from: "12:00", to: "18:00", price: "" },
  { id: 4, from: "18:00", to: "24:00", price: "" },
];

export const PAGE_SIZE = 10;