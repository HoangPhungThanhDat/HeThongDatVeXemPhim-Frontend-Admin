// views/admin/quanlybanner/constants.js

export const STATUS_CONFIG = {
    "Active": { 
      label: "Đang hiện",
      color: "#059669", 
      bg: "#ecfdf5", 
      border: "#6ee7b7", 
      dot: "#10b981", 
      darkBg: "#064e3b", 
      darkBorder: "#065f46", 
      darkColor: "#34d399" 
    },
    "Inactive": { 
      label: "Đã ẩn",
      color: "#6b7280", 
      bg: "#f9fafb", 
      border: "#e5e7eb", 
      dot: "#9ca3af", 
      darkBg: "#1f2937", 
      darkBorder: "#374151", 
      darkColor: "#9ca3af" 
    },
    "Scheduled": { 
      label: "Hẹn giờ",
      color: "#b45309", 
      bg: "#fffbeb", 
      border: "#fcd34d", 
      dot: "#f59e0b", 
      darkBg: "#451a03", 
      darkBorder: "#92400e", 
      darkColor: "#fbbf24" 
    },
  };
  
  export const STATUS_MAP = {
    "Active": "Đang hiện",
    "Inactive": "Đã ẩn",
    "Scheduled": "Hẹn giờ",
  };
  
  export const STATUS_REVERSE_MAP = {
    "Đang hiện": "Active",
    "Đã ẩn": "Inactive",
    "Hẹn giờ": "Scheduled",
  };
  
  export const LINK_TYPE_CONFIG = {
    "Movie": { 
      label: "Phim",
      color: "#7c3aed", 
      bg: "#f5f3ff", 
      border: "#c4b5fd", 
      icon: "MdLocalOffer", 
      darkBg: "#2e1065", 
      darkBorder: "#5b21b6", 
      darkColor: "#a78bfa" 
    },
    "Promotion": { 
      label: "Khuyến mãi",
      color: "#0369a1", 
      bg: "#eff6ff", 
      border: "#93c5fd", 
      icon: "MdLocalOffer", 
      darkBg: "#082f49", 
      darkBorder: "#0369a1", 
      darkColor: "#60a5fa" 
    },
    "None": { 
      label: "Không có",
      color: "#94a3b8", 
      bg: "#f8fafc", 
      border: "#e2e8f0", 
      icon: "MdLink", 
      darkBg: "#1e293b", 
      darkBorder: "#334155", 
      darkColor: "#94a3b8" 
    },
  };
  
  export const LINK_TYPE_MAP = {
    "Movie": "Phim",
    "Promotion": "Khuyến mãi",
    "None": "Không có",
  };
  
  export const POSITION_MAP = {
    "Home": "Trang chủ",
    "MoviePage": "Trang phim",
    "PromotionPage": "Trang khuyến mãi",
  };