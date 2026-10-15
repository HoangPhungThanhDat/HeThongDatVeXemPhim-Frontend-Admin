// src/views/admin/quanlytrangthaighe/constants.js

import {
  MdEventSeat,
  MdRefresh,
  MdDarkMode,
  MdLightMode,
  MdBuild,
  MdLock,
  MdCheckCircle,
  MdClose,
  MdWarning,
  MdMeetingRoom,
  MdMovie,
  MdAccessTime,
  MdReplay,
  MdInfoOutline,
  MdFullscreen,
  MdFullscreenExit,
  MdError,
  MdPerson,
  MdOutlineRefresh,
} from "react-icons/md";
import { FaTicketAlt, FaUserClock } from "react-icons/fa";

// ─── Orange palette ───────────────────────────────────────────────────────────
export const ORANGE = {
  OR: "#ea580c",
  ORL: "#fb923c",
  ORD: "#c2410c",
  ORPL: "#fff7ed",
  ORBD: "#fed7aa",
  ORSW: "rgba(234,88,12,0.25)",
  ORGRAD: `linear-gradient(135deg, #c2410c, #ea580c, #fb923c)`,
};

// ─── Seat status config ──────────────────────────────────────────────────────
export const SEAT_STATUS = {
  trong: {
    label: "Trống",
    color: "#059669",
    bg: "#ecfdf5",
    border: "#6ee7b7",
    dot: "#10b981",
    icon: MdCheckCircle,
    badge: "green",
    hoverBg: "#a7f3d0",
  },
  dat: {
    label: "Đã đặt",
    color: "#dc2626",
    bg: "#fee2e2",
    border: "#fca5a5",
    dot: "#ef4444",
    icon: FaTicketAlt,
    badge: "red",
    hoverBg: "#fca5a5",
  },
  giu: {
    label: "Đang giữ",
    color: "#d97706",
    bg: "#fef3c7",
    border: "#fcd34d",
    dot: "#f59e0b",
    icon: FaUserClock,
    badge: "yellow",
    hoverBg: "#fde68a",
  },
  loi: {
    label: "Lỗi / Kẹt",
    color: "#7c3aed",
    bg: "#ede9fe",
    border: "#c4b5fd",
    dot: "#8b5cf6",
    icon: MdError,
    badge: "purple",
    hoverBg: "#c4b5fd",
  },
  baoTri: {
    label: "Bảo trì",
    color: "#6b7280",
    bg: "#f3f4f6",
    border: "#d1d5db",
    dot: "#9ca3af",
    icon: MdBuild,
    badge: "gray",
    hoverBg: "#d1d5db",
  },
};

export const SEAT_STATUS_DEFAULT = {
  label: "Không xác định",
  color: "#6b7280",
  bg: "#f3f4f6",
  border: "#d1d5db",
  dot: "#9ca3af",
  icon: MdEventSeat,
  badge: "gray",
  hoverBg: "#d1d5db",
};

// ✅ THÊM: Màu sắc cho từng loại ghế - PHÂN BIỆT RÕ RÀNG
export const SEAT_TYPE_COLORS = {
  normal: { 
    label: "Thường", 
    bg: "#ecfdf5", 
    border: "#6ee7b7", 
    color: "#065f46",
    icon: null,
    dot: "#10b981"
  },
  vip: { 
    label: "VIP", 
    bg: "#ede9fe", 
    border: "#8b5cf6", 
    color: "#5b21b6",
    icon: "⭐",
    dot: "#8b5cf6"
  },
  couple: { 
    label: "Đôi", 
    bg: "#fef3c7", 
    border: "#f59e0b", 
    color: "#92400e",
    icon: "💑",
    dot: "#f59e0b"
  },
  sweetbox: { 
    label: "Sweetbox", 
    bg: "#fce7f3", 
    border: "#ec4899", 
    color: "#9d174d",
    icon: "💝",
    dot: "#ec4899"
  },
  accessible: { 
    label: "Ưu tiên", 
    bg: "#dbeafe", 
    border: "#3b82f6", 
    color: "#1e40af",
    icon: "♿",
    dot: "#3b82f6"
  },
};

// ─── Map status từ API sang local ──────────────────────────────────────────
export const STATUS_MAP = {
  'Available': 'trong',
  'Reserved': 'dat',
  'Held': 'giu',
  'Broken': 'loi',
  'Inactive': 'baoTri'
};

export const STATUS_MAP_REVERSE = {
  'trong': 'Available',
  'dat': 'Reserved',
  'giu': 'Held',
  'loi': 'Broken',
  'baoTri': 'Inactive'
};

// ─── Rows cho ghế ────────────────────────────────────────────────────────────
export const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H"];
export const SEATS_PER_ROW = 10;

// ─── Export icons ────────────────────────────────────────────────────────────
export const ICONS = {
  MdEventSeat,
  MdRefresh,
  MdDarkMode,
  MdLightMode,
  MdBuild,
  MdLock,
  MdCheckCircle,
  MdClose,
  MdWarning,
  MdMeetingRoom,
  MdMovie,
  MdAccessTime,
  MdReplay,
  MdInfoOutline,
  MdFullscreen,
  MdFullscreenExit,
  MdError,
  MdPerson,
  MdOutlineRefresh,
  FaTicketAlt,
  FaUserClock,
};