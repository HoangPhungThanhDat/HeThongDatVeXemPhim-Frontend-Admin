// views/admin/quanlykhuyenmai/constants.js

export const STATUS_CONFIG = {
    "Active": { 
      label: "Đang diễn ra",
      color: "#059669", 
      bg: "#ecfdf5", 
      border: "#6ee7b7", 
      dot: "#10b981", 
      darkBg: "#064e3b", 
      darkBorder: "#065f46",
      darkColor: "#34d399"
    },
    "Inactive": { 
      label: "Đã kết thúc",
      color: "#6b7280", 
      bg: "#f9fafb", 
      border: "#e5e7eb", 
      dot: "#9ca3af", 
      darkBg: "#1f2937", 
      darkBorder: "#374151",
      darkColor: "#9ca3af"
    },
    "Scheduled": { 
      label: "Sắp diễn ra",
      color: "#b45309", 
      bg: "#fffbeb", 
      border: "#fcd34d", 
      dot: "#f59e0b", 
      darkBg: "#451a03", 
      darkBorder: "#92400e",
      darkColor: "#fbbf24"
    },
    "Paused": { 
      label: "Tạm dừng",
      color: "#7c3aed", 
      bg: "#f5f3ff", 
      border: "#c4b5fd", 
      dot: "#8b5cf6", 
      darkBg: "#2e1065", 
      darkBorder: "#4c1d95",
      darkColor: "#a78bfa"
    },
  };
  
  export const STATUS_MAP = {
    "Active": "Đang diễn ra",
    "Inactive": "Đã kết thúc",
    "Scheduled": "Sắp diễn ra",
    "Paused": "Tạm dừng",
  };
  
  export const STATUS_REVERSE_MAP = {
    "Đang diễn ra": "Active",
    "Đã kết thúc": "Inactive",
    "Sắp diễn ra": "Scheduled",
    "Tạm dừng": "Paused",
  };
  
  export const TYPE_CONFIG = {
    "Percentage": { 
      label: "Giảm theo %",
      color: "#0369a1", 
      bg: "#eff6ff", 
      border: "#93c5fd", 
      icon: "FaPercent",
      displayLabel: "%"
    },
    "FixedAmount": { 
      label: "Giảm tiền cố định",
      color: "#059669", 
      bg: "#ecfdf5", 
      border: "#6ee7b7", 
      icon: "MdAttachMoney",
      displayLabel: "₫"
    },
    "BuyOneGetOne": { 
      label: "Mua 1 tặng 1",
      color: "#c2410c", 
      bg: "#fff7ed", 
      border: "#fdba74", 
      icon: "MdCardGiftcard",
      displayLabel: "1+1"
    },
  };
  
  export const TYPE_MAP = {
    "Percentage": "Giảm theo %",
    "FixedAmount": "Giảm tiền cố định",
    "BuyOneGetOne": "Mua 1 tặng 1",
  };
  
  export const APPLY_FOR_OPTS = [
    "Tất cả phim",
    "Phim cụ thể",
    "Suất chiếu cụ thể",
    "Rạp cụ thể"
  ];
  
  export const DISCOUNT_TYPE_OPTS = [
    { value: "Percentage", label: "Giảm theo %" },
    { value: "FixedAmount", label: "Giảm tiền cố định" },
    { value: "BuyOneGetOne", label: "Mua 1 tặng 1" },
  ];