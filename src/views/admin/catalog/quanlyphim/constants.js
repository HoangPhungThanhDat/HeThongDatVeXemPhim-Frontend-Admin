

export const STATUS_CONFIG = {
    "NowShowing": { 
      label: "Đang chiếu",
      color: "#059669", 
      bg: "#ecfdf5", 
      border: "#6ee7b7", 
      dot: "#10b981", 
      darkBg: "#064e3b", 
      darkBorder: "#065f46",
      darkColor: "#34d399"
    },
    "ComingSoon": { 
      label: "Sắp chiếu",
      color: "#b45309", 
      bg: "#fffbeb", 
      border: "#fcd34d", 
      dot: "#f59e0b", 
      darkBg: "#451a03", 
      darkBorder: "#92400e",
      darkColor: "#fbbf24"
    },
    "Ended": { 
      label: "Ngừng chiếu",
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
    "NowShowing": "Đang chiếu",
    "ComingSoon": "Sắp chiếu",
    "Ended": "Ngừng chiếu",
  };
  
  export const STATUS_REVERSE_MAP = {
    "Đang chiếu": "NowShowing",
    "Sắp chiếu": "ComingSoon",
    "Ngừng chiếu": "Ended",
  };
  
  export const AGE_CONFIG = {
    "P": { label: "P", color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", darkBg: "rgba(16,185,129,0.16)", darkBorder: "rgba(52,211,153,0.35)", darkColor: "#34d399" },
    "K": { label: "K", color: "#2563eb", bg: "#eff6ff", border: "#93c5fd", darkBg: "rgba(37,99,235,0.18)", darkBorder: "rgba(96,165,250,0.35)", darkColor: "#60a5fa" },
    "C13": { label: "C13", color: "#b45309", bg: "#fffbeb", border: "#fcd34d", darkBg: "rgba(245,158,11,0.18)", darkBorder: "rgba(252,211,77,0.35)", darkColor: "#fcd34d" },
    "C16": { label: "C16", color: "#c2410c", bg: "#fff7ed", border: "#fdba74", darkBg: "rgba(194,65,12,0.18)", darkBorder: "rgba(253,186,116,0.35)", darkColor: "#fdba74" },
    "C18": { label: "C18", color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", darkBg: "rgba(220,38,38,0.18)", darkBorder: "rgba(248,113,113,0.35)", darkColor: "#f87171" },
  };
  
  export const AGE_MAP = {
    "P": "P - Mọi lứa tuổi",
    "K": "K - Dưới 13 tuổi (có phụ huynh)",
    "C13": "C13 - Từ 13 tuổi trở lên",
    "C16": "C16 - Từ 16 tuổi trở lên",
    "C18": "C18 - Từ 18 tuổi trở lên",
  };
  
  export const FORMAT_OPTS = ["2D", "3D", "2D / 3D", "IMAX", "2D / IMAX", "3D / IMAX"];
  export const GENRE_OPTS = ["Hành động", "Kinh dị", "Tình cảm", "Hoạt hình", "Khoa học viễn tưởng", "Phiêu lưu", "Hài hước", "Tâm lý"];
  export const STATUS_OPTS = [
    { value: "NowShowing", label: "Đang chiếu" },
    { value: "ComingSoon", label: "Sắp chiếu" },
    { value: "Ended", label: "Ngừng chiếu" },
  ];
  export const LANGUAGE_OPTS = ["Vietsub", "Lồng tiếng", "Phụ đề Anh"];