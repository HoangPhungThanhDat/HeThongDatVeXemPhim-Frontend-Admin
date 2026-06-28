

export const ROLE_CONFIG = {
    "Actor": {
      label: "Diễn viên",
      color: "#c2410c", 
      bg: "#fff7ed", 
      border: "#fdba74",
      dot: "#f97316", 
      darkBg: "rgba(194,65,12,0.16)",
      darkBorder: "rgba(253,186,116,0.35)",
      darkColor: "#fdba74"
    },
    "Director": {
      label: "Đạo diễn",
      color: "#1d4ed8", 
      bg: "#eff6ff", 
      border: "#93c5fd",
      dot: "#3b82f6", 
      darkBg: "rgba(37,99,235,0.16)",
      darkBorder: "rgba(147,197,253,0.35)",
      darkColor: "#93c5fd"
    },
    "Producer": {
      label: "Nhà sản xuất",
      color: "#7c3aed", 
      bg: "#f5f3ff", 
      border: "#c4b5fd",
      dot: "#8b5cf6", 
      darkBg: "rgba(124,58,237,0.16)",
      darkBorder: "rgba(196,181,253,0.35)",
      darkColor: "#c4b5fd"
    },
    "Writer": {
      label: "Biên kịch",
      color: "#059669", 
      bg: "#ecfdf5", 
      border: "#6ee7b7",
      dot: "#10b981", 
      darkBg: "rgba(16,185,129,0.16)",
      darkBorder: "rgba(110,231,183,0.35)",
      darkColor: "#6ee7b7"
    },
  };
  
  export const ROLE_MAP = {
    "Actor": "Diễn viên",
    "Director": "Đạo diễn",
    "Producer": "Nhà sản xuất",
    "Writer": "Biên kịch",
  };
  
  export const ROLE_OPTS = [
    { value: "Actor", label: "Diễn viên" },
    { value: "Director", label: "Đạo diễn" },
    { value: "Producer", label: "Nhà sản xuất" },
    { value: "Writer", label: "Biên kịch" },
  ];
  
  export const STATUS_CONFIG = {
    "Active": { 
      label: "Đang hoạt động",
      color: "#059669", 
      bg: "#ecfdf5", 
      border: "#6ee7b7", 
      dot: "#10b981", 
      darkBg: "#064e3b", 
      darkBorder: "#065f46",
      darkColor: "#34d399"
    },
    "Inactive": { 
      label: "Không hoạt động",
      color: "#6b7280", 
      bg: "#f9fafb", 
      border: "#e5e7eb", 
      dot: "#9ca3af", 
      darkBg: "#1f2937", 
      darkBorder: "#374151",
      darkColor: "#9ca3af"
    },
  };
  
  export const STATUS_MAP = {
    "Active": "Đang hoạt động",
    "Inactive": "Không hoạt động",
  };
  
  export const STATUS_OPTS = [
    { value: "Active", label: "Đang hoạt động" },
    { value: "Inactive", label: "Không hoạt động" },
  ];