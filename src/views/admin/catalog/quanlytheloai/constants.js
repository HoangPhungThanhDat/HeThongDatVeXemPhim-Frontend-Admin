

export const STATUS_CONFIG = {
    "Active": { 
      label: "Hoạt động",
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
    "Banned": { 
      label: "Cấm",
      color: "#dc2626", 
      bg: "#fef2f2", 
      border: "#fca5a5", 
      dot: "#ef4444", 
      darkBg: "#3d1515", 
      darkBorder: "#7f1d1d",
      darkColor: "#f87171"
    },
  };
  
  export const STATUS_MAP = {
    "Active": "Hoạt động",
    "Inactive": "Không hoạt động",
    "Banned": "Cấm",
  };
  
  export const STATUS_REVERSE_MAP = {
    "Hoạt động": "Active",
    "Không hoạt động": "Inactive",
    "Cấm": "Banned",
  };
  
  export const STATUS_OPTS = [
    { value: "Active", label: "Hoạt động" },
    { value: "Inactive", label: "Không hoạt động" },
    { value: "Banned", label: "Cấm" },
  ];
  
  export const ICON_OPTIONS = [
    { key: "FaFire", label: "Lửa" },
    { key: "FaBolt", label: "Sấm" },
    { key: "FaHeart", label: "Tim" },
    { key: "FaGhost", label: "Ma" },
    { key: "FaSkull", label: "Đầu lâu" },
    { key: "FaChild", label: "Trẻ em" },
    { key: "FaRocket", label: "Tên lửa" },
    { key: "FaCompass", label: "La bàn" },
    { key: "FaLaugh", label: "Hài" },
    { key: "FaBrain", label: "Não" },
    { key: "FaDragon", label: "Rồng" },
    { key: "FaTheaterMasks", label: "Sân khấu" },
    { key: "FaClock", label: "Đồng hồ" },
    { key: "FaMusic", label: "Âm nhạc" },
    { key: "FaFootballBall", label: "Thể thao" },
    { key: "FaLeaf", label: "Thiên nhiên" },
    { key: "FaSnowflake", label: "Băng" },
    { key: "FaCrown", label: "Vương miện" },
    { key: "FaStar", label: "Ngôi sao" },
    { key: "FaGem", label: "Pha lê" },
    { key: "FaMagic", label: "Phép thuật" },
    { key: "FaEye", label: "Mắt" },
    { key: "FaGlobe", label: "Trái đất" },
    { key: "FaTree", label: "Cây" },
    { key: "FaPaw", label: "Thú" },
    { key: "FaFilm", label: "Phim" },
    { key: "FaTag", label: "Tag" },
    { key: "FaLayerGroup", label: "Layer" },
  ];
  
  export const GENRE_PALETTES = [
    { label: "Cam", value: "#f97316", bg: "#fff7ed", border: "#fed7aa" },
    { label: "Đỏ", value: "#ef4444", bg: "#fef2f2", border: "#fca5a5" },
    { label: "Tím", value: "#8b5cf6", bg: "#f5f3ff", border: "#c4b5fd" },
    { label: "Xanh lá", value: "#10b981", bg: "#ecfdf5", border: "#6ee7b7" },
    { label: "Xanh dương", value: "#3b82f6", bg: "#eff6ff", border: "#93c5fd" },
    { label: "Hồng", value: "#ec4899", bg: "#fdf2f8", border: "#f9a8d4" },
    { label: "Vàng", value: "#f59e0b", bg: "#fffbeb", border: "#fcd34d" },
    { label: "Xanh ngọc", value: "#06b6d4", bg: "#ecfeff", border: "#67e8f9" },
  ];