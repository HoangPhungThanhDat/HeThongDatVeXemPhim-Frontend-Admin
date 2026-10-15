

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
    "Paused": { 
      label: "Tạm dừng",
      color: "#b45309", 
      bg: "#fffbeb", 
      border: "#fcd34d", 
      dot: "#f59e0b", 
      darkBg: "#451a03", 
      darkBorder: "#92400e",
      darkColor: "#fbbf24"
    },
    "Ended": { 
      label: "Ngừng hợp tác",
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
    "Paused": "Tạm dừng",
    "Ended": "Ngừng hợp tác",
  };
  
  export const STATUS_OPTS = [
    { value: "Active", label: "Đang hoạt động" },
    { value: "Inactive", label: "Không hoạt động" },
    { value: "Paused", label: "Tạm dừng" },
    { value: "Ended", label: "Ngừng hợp tác" },
  ];
  
  export const REGION_CONFIG = {
    "International": { 
      label: "Quốc tế",
      color: "#2563eb", 
      bg: "#eff6ff", 
      border: "#93c5fd",
      darkBg: "rgba(37,99,235,0.16)",
      darkBorder: "rgba(147,197,253,0.35)",
      darkColor: "#93c5fd"
    },
    "Domestic": { 
      label: "Trong nước",
      color: "#7c3aed", 
      bg: "#f5f3ff", 
      border: "#c4b5fd",
      darkBg: "rgba(124,58,237,0.16)",
      darkBorder: "rgba(196,181,253,0.35)",
      darkColor: "#c4b5fd"
    },
  };
  
  export const REGION_MAP = {
    "International": "Quốc tế",
    "Domestic": "Trong nước",
  };
  
  export const REGION_OPTS = [
    { value: "International", label: "Quốc tế" },
    { value: "Domestic", label: "Trong nước" },
  ];
  
  export const FLAG_MAP = {
    "Mỹ": "🇺🇸",
    "Anh": "🇬🇧",
    "Hàn Quốc": "🇰🇷",
    "Nhật Bản": "🇯🇵",
    "Pháp": "🇫🇷",
    "Trung Quốc": "🇨🇳",
    "Việt Nam": "🇻🇳",
    "Đức": "🇩🇪",
    "Ý": "🇮🇹",
    "Ấn Độ": "🇮🇳",
    "Australia": "🇦🇺",
    "Canada": "🇨🇦",
  };
  
  export const COUNTRY_OPTS = [
    "Mỹ", "Anh", "Hàn Quốc", "Nhật Bản", "Pháp", 
    "Trung Quốc", "Việt Nam", "Đức", "Ý", "Ấn Độ", 
    "Australia", "Canada"
  ];