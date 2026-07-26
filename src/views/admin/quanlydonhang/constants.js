// constants.js
export const C = {
    or1: "#f97316", 
    or2: "#ea6c0a", 
    or3: "#fff7ed", 
    or4: "#fed7aa", 
    or5: "#fdba74",
    bg: "#f5f5f2", 
    bgCard: "#ffffff", 
    bgDark: "#18181b", 
    bgDeep: "#09090b",
    ink: "#09090b", 
    ink2: "#18181b", 
    ink3: "#52525b", 
    ink4: "#a1a1aa", 
    ink5: "#d4d4d8", 
    ink6: "#f4f4f5",
    green: "#16a34a", 
    greenBg: "#f0fdf4", 
    greenBdr: "#86efac",
    amber: "#d97706", 
    amberBg: "#fffbeb", 
    amberBdr: "#fcd34d",
    red: "#dc2626", 
    redBg: "#fef2f2", 
    redBdr: "#fca5a5",
    blue: "#2563eb", 
    blueBg: "#eff6ff", 
    blueBdr: "#93c5fd",
    violet: "#7c3aed", 
    violetBg: "#f5f3ff", 
    violetBdr: "#c4b5fd",
    teal: "#0d9488", 
    tealBg: "#f0fdfa", 
    tealBdr: "#99f6e4",
  };
  
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
  
  // ─── Order Status Config ──────────────────────────────────────────
  export const ORDER_STATUS = {
    // Vietnamese statuses
    "Đã thanh toán": { color: C.green, bg: C.greenBg, border: C.greenBdr, dot: true, label: "Đã thanh toán" },
    "Chờ thanh toán": { color: C.amber, bg: C.amberBg, border: C.amberBdr, dot: false, label: "Chờ thanh toán" },
    "Đã hủy": { color: C.red, bg: C.redBg, border: C.redBdr, dot: false, label: "Đã hủy" },
    "Hoàn tiền": { color: C.violet, bg: C.violetBg, border: C.violetBdr, dot: false, label: "Hoàn tiền" },
    "Đang xử lý": { color: C.blue, bg: C.blueBg, border: C.blueBdr, dot: true, label: "Đang xử lý" },
    "Đã check-in": { color: C.teal, bg: C.tealBg, border: C.tealBdr, dot: false, label: "Đã check-in" },
    // English statuses (from API)
    "Pending": { color: C.amber, bg: C.amberBg, border: C.amberBdr, dot: false, label: "Chờ xử lý" },
    "Paid": { color: C.green, bg: C.greenBg, border: C.greenBdr, dot: true, label: "Đã thanh toán" },
    "Cancelled": { color: C.red, bg: C.redBg, border: C.redBdr, dot: false, label: "Đã hủy" },
    "Completed": { color: C.teal, bg: C.tealBg, border: C.tealBdr, dot: false, label: "Hoàn tất" },
  };
  
  // ─── Payment Method Config ────────────────────────────────────────
  export const PAY_METHOD = {
    "Ví MoMo": { icon: "💜", color: "#a21caf" },
    "Thẻ ngân hàng": { icon: "💳", color: C.blue },
    "ZaloPay": { icon: "🔵", color: "#0064ff" },
    "Tiền mặt": { icon: "💵", color: C.green },
    "VNPay": { icon: "🟥", color: C.red },
    "Momo": { icon: "💜", color: "#a21caf" },
    "Banking": { icon: "💳", color: C.blue },
    "Cash": { icon: "💵", color: C.green },
  };
  
  // ─── Cinema & Movie Lists ─────────────────────────────────────────
  export const CINEMAS = ["Gấu Phim Hà Nội", "Gấu Phim TP.HCM", "Gấu Phim Đà Nẵng"];
  export const MOVIES = [
    "Avengers: Infinity War", 
    "Spider-Man: No Way Home", 
    "Doctor Strange: Multiverse", 
    "Thor: Love and Thunder", 
    "Black Panther: Wakanda"
  ];
  
  // ─── Format Helpers with Safe Checks ─────────────────────────────
  export const fmt = (n) => {
    if (n === undefined || n === null || n === "") return "0đ";
    const num = typeof n === 'string' ? parseFloat(n.replace(/,/g, '')) : n;
    if (isNaN(num) || !isFinite(num)) return "0đ";
    return num.toLocaleString("vi-VN") + "đ";
  };
  
  export const fmtDate = (s) => {
    if (!s) return "N/A";
    try {
      // Nếu là string ISO
      if (typeof s === 'string') {
        // Kiểm tra nếu đã có format "HH:MM · DD/MM/YYYY"
        if (s.includes('·')) return s;
        
        // Parse date
        const parts = s.split(" ");
        if (parts.length === 2) {
          const [d, t] = parts;
          const dateParts = d.split("-");
          if (dateParts.length === 3) {
            return `${t} · ${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
          }
        }
        
        // Thử parse bằng Date
        const date = new Date(s);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          });
        }
      }
      return s;
    } catch {
      return s || "N/A";
    }
  };
  
  // ─── Get status config ────────────────────────────────────────────
  export const getStatusConfig = (status) => {
    if (!status) return ORDER_STATUS["Chờ thanh toán"];
    return ORDER_STATUS[status] || ORDER_STATUS["Chờ thanh toán"];
  };
  
  // ─── Get payment config ───────────────────────────────────────────
  export const getPaymentConfig = (method) => {
    if (!method) return { icon: "💰", color: C.ink3 };
    return PAY_METHOD[method] || { icon: "💰", color: C.ink3 };
  };