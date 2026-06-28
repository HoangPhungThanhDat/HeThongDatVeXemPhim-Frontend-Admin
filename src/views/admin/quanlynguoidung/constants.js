// src/views/admin/quanlynguoidung/constants.js

export const DARK = {
    bg: "#0a0a18",
    bgCard: "#16213e",
    bgDark: "#0f0f1a",
    bgDeep: "#05050a",
    ink: "#f7fafc",
    ink2: "#e2e8f0",
    ink3: "#a0aec0",
    ink4: "#718096",
    ink5: "#4a5568",
    ink6: "#2d3748",
  };
  
  export const STATUS_CONFIG = {
    "Active": { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", dot: "#10b981", label: "Hoạt động" },
    "Inactive": { color: "#d97706", bg: "#fffbeb", border: "#fde68a", dot: "#f59e0b", label: "Khóa" },
    "Banned": { color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", dot: "#ef4444", label: "Cấm" },
  };
  
  export const STATUS_OPTIONS = ["Tất cả", "Active", "Inactive", "Banned"];
  export const GENDER_OPTIONS = ["Male", "Female", "Other"];
  
  export const PAGE_SIZE = 12;
  
  export const EMPTY_USER = {
    FullName: "",
    Email: "",
    PhoneNumber: "",
    Gender: "",
    DateOfBirth: "",
    PasswordHash: "",
    RoleId: 2,
    Status: "Active",
  };