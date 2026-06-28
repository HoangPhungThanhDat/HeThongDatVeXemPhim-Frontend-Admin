

export const STATUS_CONFIG = {
    "Published": { 
      label: "Đã đăng",
      color: "#059669", 
      bg: "#ecfdf5", 
      border: "#6ee7b7", 
      dot: "#10b981", 
      darkBg: "#064e3b", 
      darkBorder: "#065f46",
      darkColor: "#34d399"
    },
    "Draft": { 
      label: "Bản nháp",
      color: "#64748b", 
      bg: "#f8fafc", 
      border: "#cbd5e1", 
      dot: "#94a3b8", 
      darkBg: "#1f2937", 
      darkBorder: "#374151",
      darkColor: "#9ca3af"
    },
    "Scheduled": { 
      label: "Hẹn giờ",
      color: "#7c3aed", 
      bg: "#f5f3ff", 
      border: "#c4b5fd", 
      dot: "#8b5cf6", 
      darkBg: "#2e1065", 
      darkBorder: "#4c1d95",
      darkColor: "#a78bfa"
    },
    "Hidden": { 
      label: "Tạm ẩn",
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
    "Published": "Đã đăng",
    "Draft": "Bản nháp",
    "Scheduled": "Hẹn giờ",
    "Hidden": "Tạm ẩn",
  };
  
  export const STATUS_REVERSE_MAP = {
    "Đã đăng": "Published",
    "Bản nháp": "Draft",
    "Hẹn giờ": "Scheduled",
    "Tạm ẩn": "Hidden",
  };
  
  export const CATEGORY_CONFIG = {
    "Tin tức": { 
      color: "#0369a1", 
      bg: "#e0f2fe", 
      border: "#7dd3fc",
      darkBg: "rgba(14,165,233,0.16)",
      darkBorder: "rgba(125,211,252,0.35)",
      darkColor: "#7dd3fc"
    },
    "Review phim": { 
      color: "#7c3aed", 
      bg: "#f5f3ff", 
      border: "#c4b5fd",
      darkBg: "rgba(124,58,237,0.16)",
      darkBorder: "rgba(196,181,253,0.35)",
      darkColor: "#c4b5fd"
    },
    "Sự kiện": { 
      color: "#be185d", 
      bg: "#fdf2f8", 
      border: "#f9a8d4",
      darkBg: "rgba(219,39,119,0.16)",
      darkBorder: "rgba(249,168,212,0.35)",
      darkColor: "#f9a8d4"
    },
    "Hậu trường": { 
      color: "#065f46", 
      bg: "#ecfdf5", 
      border: "#6ee7b7",
      darkBg: "rgba(5,150,105,0.16)",
      darkBorder: "rgba(110,231,183,0.35)",
      darkColor: "#6ee7b7"
    },
    "Khuyến mãi": { 
      color: "#c2410c", 
      bg: "#fff7ed", 
      border: "#fdba74",
      darkBg: "rgba(194,65,12,0.16)",
      darkBorder: "rgba(253,186,116,0.35)",
      darkColor: "#fdba74"
    },
  };
  
  export const CATEGORY_OPTS = [
    "Tin tức",
    "Review phim",
    "Sự kiện",
    "Hậu trường",
    "Khuyến mãi"
  ];
  
  export const STATUS_OPTS = [
    { value: "Draft", label: "Bản nháp" },
    { value: "Published", label: "Đã đăng" },
    { value: "Scheduled", label: "Hẹn giờ" },
    { value: "Hidden", label: "Tạm ẩn" },
  ];