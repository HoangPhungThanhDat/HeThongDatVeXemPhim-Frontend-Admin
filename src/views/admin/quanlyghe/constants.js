// constants.js
import { MdChair } from "react-icons/md";

export const CINEMAS = [
  { id: 1, name: "Gấu Phim Hà Nội – Vincom", address: "191 Bà Triệu, Hai Bà Trưng, HN" },
  { id: 2, name: "Gấu Phim TP.HCM – Landmark", address: "Tòa nhà Landmark 81, Bình Thạnh, HCM" },
  { id: 3, name: "Gấu Phim Đà Nẵng – Coop", address: "2 Hùng Vương, Hải Châu, Đà Nẵng" },
];

export const ROOMS = {
  1: [
    { id: 1, name: "Phòng 1 – Standard 2D", type: "standard", rows: 8, cols: 12, status: "active",  capacity: 96 },
    { id: 2, name: "Phòng 2 – Premium 3D",  type: "premium",  rows: 7, cols: 10, status: "active",  capacity: 70 },
    { id: 3, name: "Phòng 3 – IMAX",        type: "imax",     rows: 10,cols: 14, status: "maintenance", capacity: 140 },
    { id: 4, name: "Phòng 4 – Sweetbox",    type: "sweetbox", rows: 4, cols: 8,  status: "active",  capacity: 32 },
  ],
  2: [
    { id: 5, name: "Phòng 1 – Standard 2D", type: "standard", rows: 9, cols: 12, status: "active",  capacity: 108 },
    { id: 6, name: "Phòng 2 – IMAX 3D",     type: "imax",     rows: 11,cols: 16, status: "active",  capacity: 176 },
    { id: 7, name: "Phòng 3 – VIP Lounge",  type: "vip",      rows: 5, cols: 8,  status: "active",  capacity: 40 },
  ],
  3: [
    { id: 8, name: "Phòng 1 – Standard",    type: "standard", rows: 8, cols: 10, status: "active",  capacity: 80 },
    { id: 9, name: "Phòng 2 – 4DX",         type: "4dx",      rows: 6, cols: 10, status: "maintenance", capacity: 60 },
  ],
};

export const ROOM_SEAT_CONFIG = {
  standard: { regularRatio: 0.8,  vipRatio: 0,    sweetboxRatio: 0,   accessibleCount: 4, coupleRatio: 0 },
  premium:  { regularRatio: 0.6,  vipRatio: 0.25, sweetboxRatio: 0,   accessibleCount: 4, coupleRatio: 0 },
  imax:     { regularRatio: 0.75, vipRatio: 0.15, sweetboxRatio: 0,   accessibleCount: 6, coupleRatio: 0 },
  sweetbox: { regularRatio: 0,    vipRatio: 0,    sweetboxRatio: 0.7, accessibleCount: 0, coupleRatio: 0.3 },
  vip:      { regularRatio: 0.3,  vipRatio: 0.5,  sweetboxRatio: 0,   accessibleCount: 2, coupleRatio: 0.2 },
  "4dx":    { regularRatio: 0.85, vipRatio: 0.1,  sweetboxRatio: 0,   accessibleCount: 4, coupleRatio: 0 },
};

export const ROW_LABELS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export const SEAT_TYPES = {
  regular:    { label: "Thường",     color: "#f97316", bg: "#fff7ed", border: "#fb923c", bookedBg: "#dc2626", bookedColor: "#fff" },
  vip:        { label: "VIP",        color: "#7c3aed", bg: "#f5f3ff", border: "#a78bfa", bookedBg: "#5b21b6", bookedColor: "#fff" },
  sweetbox:   { label: "Sweetbox",   color: "#db2777", bg: "#fdf2f8", border: "#f9a8d4", bookedBg: "#9d174d", bookedColor: "#fff" },
  couple:     { label: "Đôi",        color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", bookedBg: "#991b1b", bookedColor: "#fff" },
  accessible: { label: "Tiếp cận",   color: "#0284c7", bg: "#f0f9ff", border: "#7dd3fc", bookedBg: "#0369a1", bookedColor: "#fff" },
};

export const ROOM_TYPE_BADGES = {
  standard: { label: "Standard",  bg: "#f1f5f9", color: "#475569" },
  premium:  { label: "Premium",   bg: "#f5f3ff", color: "#7c3aed" },
  imax:     { label: "IMAX",      bg: "#fff7ed", color: "#f97316" },
  sweetbox: { label: "Sweetbox",  bg: "#fdf2f8", color: "#db2777" },
  vip:      { label: "VIP",       bg: "#fffbeb", color: "#b45309" },
  "4dx":    { label: "4DX",       bg: "#f0fdf4", color: "#16a34a" },
};