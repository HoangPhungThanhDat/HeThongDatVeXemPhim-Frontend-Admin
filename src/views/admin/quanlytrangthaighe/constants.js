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
  },
  dat: {
    label: "Đã đặt",
    color: "#dc2626",
    bg: "#fef2f2",
    border: "#fca5a5",
    dot: "#ef4444",
    icon: FaTicketAlt,
    badge: "red",
  },
  giu: {
    label: "Đang giữ",
    color: ORANGE.OR,
    bg: ORANGE.ORPL,
    border: ORANGE.ORBD,
    dot: ORANGE.ORL,
    icon: FaUserClock,
    badge: "orange",
  },
  loi: {
    label: "Lỗi / Kẹt",
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "#c4b5fd",
    dot: "#8b5cf6",
    icon: MdError,
    badge: "purple",
  },
  baoTri: {
    label: "Bảo trì",
    color: "#6b7280",
    bg: "#f9fafb",
    border: "#e5e7eb",
    dot: "#9ca3af",
    icon: MdBuild,
    badge: "gray",
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
export const ROWS = ["A", "B", "C", "D", "E", "F"];
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