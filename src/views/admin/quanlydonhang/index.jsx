import React, { useState, useEffect, useRef } from "react";
import { useColorMode, useColorModeValue } from "@chakra-ui/react";

/* ═══════════════════════════════════════════════════════════
   DESIGN SYSTEM — Gấu Phim · Order Management
   Fixed: navbar overlap + full mobile responsive
═══════════════════════════════════════════════════════════ */
const C = {
  or1: "#f97316", or2: "#ea6c0a", or3: "#fff7ed", or4: "#fed7aa", or5: "#fdba74",
  bg: "#f5f5f2", bgCard: "#ffffff", bgDark: "#18181b", bgDeep: "#09090b",
  ink: "#09090b", ink2: "#18181b", ink3: "#52525b", ink4: "#a1a1aa", ink5: "#d4d4d8", ink6: "#f4f4f5",
  green: "#16a34a", greenBg: "#f0fdf4", greenBdr: "#86efac",
  amber: "#d97706", amberBg: "#fffbeb", amberBdr: "#fcd34d",
  red: "#dc2626", redBg: "#fef2f2", redBdr: "#fca5a5",
  blue: "#2563eb", blueBg: "#eff6ff", blueBdr: "#93c5fd",
  violet: "#7c3aed", violetBg: "#f5f3ff", violetBdr: "#c4b5fd",
  teal: "#0d9488", tealBg: "#f0fdfa", tealBdr: "#99f6e4",
};

// ─── Dark Mode Colors ──────────────────────────────────────
const DARK = {
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

const ORDER_STATUS = {
  "Đã thanh toán": { color: C.green, bg: C.greenBg, border: C.greenBdr, dot: true },
  "Chờ thanh toán": { color: C.amber, bg: C.amberBg, border: C.amberBdr, dot: false },
  "Đã hủy": { color: C.red, bg: C.redBg, border: C.redBdr, dot: false },
  "Hoàn tiền": { color: C.violet, bg: C.violetBg, border: C.violetBdr, dot: false },
  "Đang xử lý": { color: C.blue, bg: C.blueBg, border: C.blueBdr, dot: true },
  "Đã check-in": { color: C.teal, bg: C.tealBg, border: C.tealBdr, dot: false },
};
const PAY_METHOD = {
  "Ví MoMo": { icon: "💜", color: "#a21caf" },
  "Thẻ ngân hàng": { icon: "💳", color: C.blue },
  "ZaloPay": { icon: "🔵", color: "#0064ff" },
  "Tiền mặt": { icon: "💵", color: C.green },
  "VNPay": { icon: "🟥", color: C.red },
};

const CINEMAS = ["Gấu Phim Hà Nội", "Gấu Phim TP.HCM", "Gấu Phim Đà Nẵng"];
const MOVIES = ["Avengers: Infinity War", "Spider-Man: No Way Home", "Doctor Strange: Multiverse", "Thor: Love and Thunder", "Black Panther: Wakanda"];

const ORDERS_RAW = [
  { id: "GPF-2026001", customer: "Nguyễn Văn An", phone: "0901234567", email: "an.nguyen@email.com", movie: "Avengers: Infinity War", cinema: "Gấu Phim Hà Nội", room: "IMAX 1", showtime: "2026-05-24 19:00", seats: ["F7", "F8", "F9"], combo: "Combo Đôi (2 bắp + 2 Pepsi)", total: 487000, payMethod: "Ví MoMo", status: "Đã thanh toán", createdAt: "2026-05-24 14:22", notes: [], isNew: true, refundReason: "" },
  { id: "GPF-2026002", customer: "Trần Thị Bích", phone: "0912345678", email: "bich.tran@email.com", movie: "Spider-Man: No Way Home", cinema: "Gấu Phim TP.HCM", room: "3D Hall B", showtime: "2026-05-24 20:30", seats: ["A3", "A4"], combo: "Không có", total: 190000, payMethod: "ZaloPay", status: "Chờ thanh toán", createdAt: "2026-05-24 15:05", notes: [], isNew: true, refundReason: "" },
  { id: "GPF-2026003", customer: "Lê Hồng Minh", phone: "0923456789", email: "minh.le@email.com", movie: "Black Panther: Wakanda", cinema: "Gấu Phim Hà Nội", room: "IMAX 2", showtime: "2026-05-23 14:30", seats: ["D12", "D13", "D14", "D15"], combo: "Combo Gia Đình (4 bắp + 4 nước)", total: 980000, payMethod: "Thẻ ngân hàng", status: "Đã check-in", createdAt: "2026-05-23 10:15", notes: [{ author: "Hoàng Anh", time: "2026-05-23 11:00", text: "Khách VIP, ưu tiên hỗ trợ" }], isNew: false, refundReason: "" },
  { id: "GPF-2026004", customer: "Phạm Quốc Hùng", phone: "0934567890", email: "hung.pham@email.com", movie: "Doctor Strange: Multiverse", cinema: "Gấu Phim Đà Nẵng", room: "3D Hall 01", showtime: "2026-05-22 16:00", seats: ["B5"], combo: "Bắp cỡ lớn", total: 175000, payMethod: "Tiền mặt", status: "Đã hủy", createdAt: "2026-05-22 09:30", notes: [{ author: "System", time: "2026-05-22 10:00", text: "Khách hủy vé qua app" }], isNew: false, refundReason: "" },
  { id: "GPF-2026005", customer: "Ngô Thị Thu", phone: "0945678901", email: "thu.ngo@email.com", movie: "Thor: Love and Thunder", cinema: "Gấu Phim TP.HCM", room: "2D Phòng C", showtime: "2026-05-21 10:00", seats: ["G1", "G2"], combo: "Pepsi cỡ lớn x2", total: 250000, payMethod: "VNPay", status: "Hoàn tiền", createdAt: "2026-05-21 08:00", notes: [{ author: "Minh Châu", time: "2026-05-21 14:00", text: "Khách yêu cầu hoàn tiền vì bị ốm, đã chuyển lên Admin duyệt." }], isNew: false, refundReason: "Khách bị ốm không đi được" },
  { id: "GPF-2026006", customer: "Vũ Đình Long", phone: "0956789012", email: "long.vu@email.com", movie: "Avengers: Infinity War", cinema: "Gấu Phim Hà Nội", room: "IMAX 1", showtime: "2026-05-24 22:00", seats: ["H10", "H11", "H12", "H13", "H14"], combo: "Combo Nhóm 5", total: 1250000, payMethod: "Ví MoMo", status: "Đã thanh toán", createdAt: "2026-05-24 16:40", notes: [], isNew: true, refundReason: "" },
  { id: "GPF-2026007", customer: "Đinh Thị Lan", phone: "0967890123", email: "lan.dinh@email.com", movie: "Spider-Man: No Way Home", cinema: "Gấu Phim Đà Nẵng", room: "3D Hall 02", showtime: "2026-05-24 13:00", seats: ["C8", "C9"], combo: "Combo Đôi", total: 360000, payMethod: "Thẻ ngân hàng", status: "Đang xử lý", createdAt: "2026-05-24 12:55", notes: [], isNew: true, refundReason: "" },
  { id: "GPF-2026008", customer: "Hoàng Trọng Khải", phone: "0978901234", email: "khai.hoang@email.com", movie: "Black Panther: Wakanda", cinema: "Gấu Phim TP.HCM", room: "IMAX 4", showtime: "2026-05-20 19:00", seats: ["E5", "E6", "E7"], combo: "Không có", total: 345000, payMethod: "ZaloPay", status: "Đã check-in", createdAt: "2026-05-20 16:20", notes: [], isNew: false, refundReason: "" },
];

const fmt = n => n.toLocaleString("vi-VN") + "đ";
const fmtDate = s => { const [d, t] = s.split(" "); const [y, m, day] = d.split("-"); return `${t} · ${day}/${m}/${y}`; };

function useHover() { const [h, set] = useState(false); return [h, { onMouseEnter: () => set(true), onMouseLeave: () => set(false) }]; }
function useIsMobile() { const [m, setM] = useState(window.innerWidth < 768); useEffect(() => { const fn = () => setM(window.innerWidth < 768); window.addEventListener("resize", fn); return () => window.removeEventListener("resize", fn); }, []); return m; }

function StatusChip({ status }) {
  const s = ORDER_STATUS[status] || ORDER_STATUS["Chờ thanh toán"];
  return (<span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 20, fontSize: 11.5, fontWeight: 700, color: s.color, background: s.bg, border: `1px solid ${s.border}`, whiteSpace: "nowrap" }}>
    <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.color, animation: s.dot ? "op-pulse 1.8s ease infinite" : "none" }} />
    {status}
  </span>);
}
function PayChip({ method }) { const p = PAY_METHOD[method] || { icon: "💰", color: "#52525b" }; return (<span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: p.color }}><span style={{ fontSize: 13 }}>{p.icon}</span>{method}</span>); }
function Tag({ children, color, bg, border }) { return <span style={{ padding: "2px 7px", borderRadius: 6, fontSize: 10.5, fontWeight: 700, color, background: bg, border: `1px solid ${border}` }}>{children}</span>; }
function Badge({ count }) { if (!count) return null; return <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 18, height: 18, borderRadius: 9, background: C.red, color: "#fff", fontSize: 10, fontWeight: 800, padding: "0 4px" }}>{count > 99 ? "99+" : count}</span>; }
function Panel({ children, style: sx, G }) { const bg = G ? G.bgCard : C.bgCard; const border = G ? G.ink6 : C.ink6; return <div style={{ background: bg, borderRadius: 16, border: `1px solid ${border}`, boxShadow: G ? "0 2px 8px rgba(0,0,0,.3)" : "0 2px 8px rgba(0,0,0,.05)", padding: 20, ...sx }}>{children}</div>; }
function SectionHead({ label, G }) { const color = G ? G.ink3 : C.ink3; return (<div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}><div style={{ width: 3, height: 14, borderRadius: 2, background: `linear-gradient(180deg,${C.or1},#fbbf24)`, flexShrink: 0 }} /><span style={{ fontSize: 10.5, fontWeight: 900, letterSpacing: "1.2px", textTransform: "uppercase", color }}>{label}</span></div>); }

function Btn({ children, variant = "primary", size = "md", icon, onClick, full, disabled, G }) {
  const [h, hov] = useHover();
  const isDark = G && G.ink === DARK.ink;
  const pad = size === "sm" ? "6px 14px" : size === "xs" ? "4px 10px" : "10px 22px";
  const fs = size === "sm" ? 12 : size === "xs" ? 11 : 13.5;
  const styles = {
    primary: { background: disabled ? (isDark ? "#4a5568" : "#d1d5db") : h ? C.or2 : C.or1, color: "#fff", border: "none", boxShadow: disabled ? "none" : h ? "0 6px 20px rgba(249,115,22,.4)" : "0 3px 10px rgba(249,115,22,.25)", transform: (!disabled && h) ? "translateY(-1px)" : "none" },
    ghost: { background: h ? (isDark ? G.ink6 : C.ink6) : (isDark ? G.bgCard : "#fff"), color: isDark ? G.ink3 : C.ink3, border: `1.5px solid ${isDark ? G.ink5 : C.ink5}` },
    danger: { background: h ? "#fee2e2" : C.redBg, color: C.red, border: `1px solid ${C.redBdr}` },
    success: { background: h ? "#dcfce7" : C.greenBg, color: C.green, border: `1px solid ${C.greenBdr}` },
    warn: { background: h ? "#fef3c7" : C.amberBg, color: C.amber, border: `1px solid ${C.amberBdr}` },
    dark: { background: h ? "#27272a" : (isDark ? G.bgDark : C.bgDark), color: "#fff", border: "none", boxShadow: "0 3px 12px rgba(0,0,0,.2)", transform: h ? "translateY(-1px)" : "none" },
    violet: { background: h ? "#ede9fe" : C.violetBg, color: C.violet, border: `1px solid ${C.violetBdr}` },
  };
  return (<button onClick={disabled ? undefined : onClick} {...(disabled ? {} : hov)} disabled={disabled} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, padding: pad, borderRadius: 10, fontSize: fs, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer", outline: "none", transition: "all 0.18s", width: full ? "100%" : "auto", border: "none", ...styles[variant] }}>
    {icon && <span style={{ fontSize: fs + 1 }}>{icon}</span>}{children}
  </button>);
}

function Stat({ label, value, sub, emoji, accent, delay, G }) {
  const [h, hov] = useHover();
  const isDark = G && G.ink === DARK.ink;
  const bg = isDark ? G.bgCard : C.bgCard;
  const border = isDark ? G.ink6 : C.ink6;
  const ink = isDark ? G.ink : C.ink;
  const ink4 = isDark ? G.ink4 : C.ink4;
  return (<div {...hov} style={{ background: bg, borderRadius: 16, border: `1px solid ${border}`, padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: h ? (isDark ? "0 8px 24px rgba(0,0,0,.4)" : "0 8px 24px rgba(0,0,0,.09)") : (isDark ? "0 2px 6px rgba(0,0,0,.3)" : "0 2px 6px rgba(0,0,0,.04)"), transform: h ? "translateY(-3px)" : "none", transition: "all 0.2s", animationDelay: `${delay}s`, animation: "slideup 0.4s ease both" }}>
    <div>
      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.8px", textTransform: "uppercase", color: ink4, marginBottom: 5 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 900, color: ink, lineHeight: 1, letterSpacing: "-1px" }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: ink4, marginTop: 4, fontWeight: 500 }}>{sub}</div>}
    </div>
    <div style={{ width: 44, height: 44, borderRadius: 13, background: `${accent}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{emoji}</div>
  </div>);
}

// ─── Export Excel Function ──────────────────────────────────
function exportToExcel(orders, G) {
  const data = orders.map((o, i) => ({
    "STT": i + 1,
    "Mã đơn hàng": o.id,
    "Khách hàng": o.customer,
    "SĐT": o.phone,
    "Email": o.email,
    "Phim": o.movie,
    "Rạp": o.cinema,
    "Phòng": o.room,
    "Suất chiếu": o.showtime,
    "Ghế": o.seats.join(", "),
    "Combo": o.combo,
    "Tổng tiền": o.total,
    "Phương thức": o.payMethod,
    "Trạng thái": o.status,
    "Ngày đặt": o.createdAt,
  }));
  const headers = Object.keys(data[0] || {});
  const rows = [headers, ...data.map(row => headers.map(h => row[h] || ""))];
  const csv = rows.map(row => row.join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `DonHang_GauPhim_${new Date().toISOString().slice(0,10)}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

// ─── Refund Modal ───────────────────────────────────────────
function RefundModal({ order, onClose, onDecide, G }) {
  const [decision, setDecision] = useState(null);
  const [reason, setReason] = useState("");
  const isDark = G && G.ink === DARK.ink;
  const bg = isDark ? G.bgCard : C.bgCard;
  const ink = isDark ? G.ink : C.ink;
  const ink2 = isDark ? G.ink2 : C.ink2;
  const ink4 = isDark ? G.ink4 : C.ink4;
  const ink5 = isDark ? G.ink5 : C.ink5;
  const ink6 = isDark ? G.ink6 : C.ink6;
  return (<div style={{ position: "fixed", inset: 0, background: "rgba(9,9,11,.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: 16, animation: "fadein 0.2s ease" }}>
    <div style={{ background: bg, borderRadius: 22, width: "100%", maxWidth: 500, boxShadow: "0 40px 100px rgba(0,0,0,.35)", animation: "scalein 0.25s ease", overflow: "hidden" }}>
      <div style={{ background: `linear-gradient(135deg,${C.violet}15,${C.or3})`, padding: "20px 22px 16px", borderBottom: `1px solid ${ink6}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 900, color: ink }}>🔄 Xử lý yêu cầu hoàn tiền</div>
            <div style={{ fontSize: 11.5, color: ink4, marginTop: 3 }}>Đơn hàng #{order.id}</div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: `1.5px solid ${ink5}`, background: ink6, cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", color: ink2 }}>✕</button>
        </div>
      </div>
      <div style={{ padding: 20 }}>
        <div style={{ padding: "12px 14px", borderRadius: 12, background: C.violetBg, border: `1px solid ${C.violetBdr}`, marginBottom: 16 }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, color: C.violet, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 5 }}>Lý do yêu cầu của khách</div>
          <div style={{ fontSize: 13, color: ink2, fontWeight: 500, lineHeight: 1.5 }}>{order.refundReason || "Khách không để lại lý do"}</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          {[{ k: "approve", label: "✅ Duyệt hoàn tiền", desc: "Chuyển lên Admin duyệt thực tế", color: C.green, bg: C.greenBg, bdr: C.greenBdr },
          { k: "reject", label: "❌ Từ chối hoàn tiền", desc: "Gửi thông báo từ chối đến khách", color: C.red, bg: C.redBg, bdr: C.redBdr }].map(opt => (
            <div key={opt.k} onClick={() => setDecision(opt.k)} style={{ padding: "12px 10px", borderRadius: 12, cursor: "pointer", transition: "all 0.15s", border: `2px solid ${decision === opt.k ? opt.color : ink5}`, background: decision === opt.k ? opt.bg : (isDark ? G.ink6 : "#fafafa") }}>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: decision === opt.k ? opt.color : (isDark ? G.ink3 : C.ink3), marginBottom: 3 }}>{opt.label}</div>
              <div style={{ fontSize: 10.5, color: ink4 }}>{opt.desc}</div>
            </div>
          ))}
        </div>
        {decision && <div style={{ marginBottom: 16, animation: "slidein 0.2s ease" }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.8px", textTransform: "uppercase", color: ink4, marginBottom: 6 }}>Ghi chú kèm theo</div>
          <textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Nhập lý do hoặc ghi chú..." rows={3}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 10, fontSize: 13, border: `1.5px solid ${ink5}`, outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box", background: isDark ? G.ink6 : "#fafafa", color: ink }}
            onFocus={e => e.target.style.border = `1.5px solid ${C.or1}`} onBlur={e => e.target.style.border = `1.5px solid ${ink5}`} />
        </div>}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Btn variant="ghost" onClick={onClose} G={G}>Hủy</Btn>
          <Btn variant={decision === "approve" ? "success" : decision === "reject" ? "danger" : "primary"} disabled={!decision} onClick={() => { onDecide(order.id, decision, reason); onClose(); }} G={G}>
            {decision === "approve" ? "✅ Xác nhận duyệt" : decision === "reject" ? "❌ Xác nhận từ chối" : "Chọn quyết định"}
          </Btn>
        </div>
      </div>
    </div>
  </div>);
}

// ─── Order Detail Drawer ────────────────────────────────────
function OrderDetail({ order, onClose, onRefund, onAddNote, toastFn, G }) {
  const [note, setNote] = useState("");
  const [showRefund, setShowRefund] = useState(false);
  const isMobile = useIsMobile();
  const isDark = G && G.ink === DARK.ink;
  const bg = isDark ? G.bgCard : C.bgCard;
  const ink = isDark ? G.ink : C.ink;
  const ink2 = isDark ? G.ink2 : C.ink2;
  const ink3 = isDark ? G.ink3 : C.ink3;
  const ink4 = isDark ? G.ink4 : C.ink4;
  const ink5 = isDark ? G.ink5 : C.ink5;
  const ink6 = isDark ? G.ink6 : C.ink6;
  const bgDark = isDark ? G.bgDark : C.bgDark;
  const handleNote = () => { if (!note.trim()) return; onAddNote(order.id, note.trim()); setNote(""); toastFn("📝 Đã thêm ghi chú nội bộ"); };
  return (<>
    {showRefund && <RefundModal order={order} onClose={() => setShowRefund(false)} onDecide={(id, dec, reason) => { onRefund(id, dec, reason); toastFn(dec === "approve" ? "✅ Đã đề xuất duyệt hoàn tiền lên Admin" : "❌ Đã từ chối yêu cầu hoàn tiền"); }} G={G} />}
    <div style={{ position: "fixed", inset: 0, background: "rgba(9,9,11,.55)", backdropFilter: "blur(4px)", zIndex: 999, animation: "fadein 0.2s ease" }} onClick={onClose} />
    <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: isMobile ? "100vw" : "min(580px,100vw)", background: bg, boxShadow: "-8px 0 40px rgba(0,0,0,.18)", zIndex: 1000, overflowY: "auto", animation: "slidefromright 0.3s cubic-bezier(.4,0,.2,1)" }}>
      <div style={{ position: "sticky", top: 0, background: bg, borderBottom: `1px solid ${ink6}`, padding: "16px 20px", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 900, color: ink }}>Chi tiết đơn hàng</div>
          <div style={{ fontSize: 11.5, color: ink4, marginTop: 2, fontFamily: "monospace", fontWeight: 600 }}>{order.id}</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <StatusChip status={order.status} />
          <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: 9, border: `1.5px solid ${ink5}`, background: ink6, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", color: ink2 }}>✕</button>
        </div>
      </div>
      <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ background: bgDark, borderRadius: 14, padding: "18px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${C.or1},#fbbf24)` }} />
          <div style={{ fontSize: 11, fontWeight: 700, color: "#71717a", textTransform: "uppercase", letterSpacing: 1, marginBottom: 7 }}>🎬 Phim & Suất chiếu</div>
          <div style={{ fontSize: 17, fontWeight: 900, color: "#fff", marginBottom: 10, lineHeight: 1.25 }}>{order.movie}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[["🏢 Rạp", order.cinema], ["🎭 Phòng", order.room], ["🕐 Suất chiếu", fmtDate(order.showtime)], ["💺 Ghế", order.seats.join(", ")]].map(([l, v]) => (
              <div key={l} style={{ padding: "9px 11px", borderRadius: 9, background: "rgba(255,255,255,.06)" }}>
                <div style={{ fontSize: 9.5, color: "#71717a", fontWeight: 700, marginBottom: 2 }}>{l}</div>
                <div style={{ fontSize: 12.5, color: "#fff", fontWeight: 700 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
        <Panel style={{ padding: 16 }} G={G}>
          <SectionHead label="Thông tin khách hàng" G={G} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[["👤 Họ tên", order.customer], ["📱 Số điện thoại", order.phone], ["✉️ Email", order.email], ["📅 Đặt lúc", fmtDate(order.createdAt)]].map(([l, v]) => (
              <div key={l} style={{ padding: "9px 11px", borderRadius: 9, background: isDark ? G.ink6 : C.ink6, border: `1px solid ${isDark ? G.ink5 : C.ink5}` }}>
                <div style={{ fontSize: 9.5, color: ink4, fontWeight: 700, marginBottom: 2 }}>{l}</div>
                <div style={{ fontSize: 12, color: ink, fontWeight: 700, wordBreak: "break-all" }}>{v}</div>
              </div>
            ))}
          </div>
        </Panel>
        <Panel style={{ padding: 16 }} G={G}>
          <SectionHead label="Thanh toán & Combo" G={G} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontSize: 12, color: ink3, fontWeight: 600 }}>Phương thức</div>
            <PayChip method={order.payMethod} />
          </div>
          {order.combo !== "Không có" && <div style={{ padding: "10px 12px", borderRadius: 9, background: C.or3, border: `1px solid ${C.or4}`, marginBottom: 10 }}>
            <div style={{ fontSize: 10, color: C.or2, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 2 }}>🍿 Combo</div>
            <div style={{ fontSize: 13, color: ink2, fontWeight: 700 }}>{order.combo}</div>
          </div>}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderTop: `1px solid ${ink6}` }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: ink3 }}>Tổng đơn hàng</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: C.or1, letterSpacing: "-0.5px" }}>{fmt(order.total)}</div>
          </div>
        </Panel>
        {order.refundReason && <div style={{ padding: "14px 16px", borderRadius: 12, background: C.violetBg, border: `1px solid ${C.violetBdr}` }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: C.violet, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>⚠️ Yêu cầu hoàn tiền</div>
          <div style={{ fontSize: 13, color: ink2, lineHeight: 1.5, marginBottom: 10 }}>{order.refundReason}</div>
          {order.status === "Hoàn tiền" && <Btn variant="violet" icon="🔄" onClick={() => setShowRefund(true)} G={G}>Xử lý yêu cầu hoàn tiền</Btn>}
        </div>}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Btn variant="ghost" size="sm" icon="🎫" onClick={() => toastFn("📋 Đã sao chép mã QR vé")} G={G}>Xem QR vé</Btn>
          {order.status !== "Hoàn tiền" && order.status !== "Đã hủy" && <Btn variant="violet" size="sm" icon="🔄" onClick={() => setShowRefund(true)} G={G}>Yêu cầu hoàn tiền</Btn>}
          <Btn variant="success" size="sm" icon="✅" onClick={() => toastFn("✅ Đã đánh dấu xử lý xong")} G={G}>Đánh dấu xử lý</Btn>
        </div>
        <Panel style={{ padding: 16 }} G={G}>
          <SectionHead label="Ghi chú nội bộ" G={G} />
          {order.notes.length === 0 ? (<div style={{ textAlign: "center", padding: "14px 0", color: ink4, fontSize: 12 }}>Chưa có ghi chú nào</div>) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
              {order.notes.map((n, i) => (
                <div key={i} style={{ padding: "10px 12px", borderRadius: 9, background: isDark ? G.ink6 : C.ink6, border: `1px solid ${isDark ? G.ink5 : C.ink5}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: ink3 }}>{n.author}</span>
                    <span style={{ fontSize: 10, color: ink4 }}>{n.time}</span>
                  </div>
                  <div style={{ fontSize: 12.5, color: ink2, lineHeight: 1.5 }}>{n.text}</div>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <input value={note} onChange={e => setNote(e.target.value)} placeholder="Thêm ghi chú nội bộ..." onKeyDown={e => e.key === "Enter" && handleNote()}
              style={{ flex: 1, height: 38, padding: "0 12px", borderRadius: 9, fontSize: 13, border: `1.5px solid ${ink5}`, outline: "none", background: isDark ? G.ink6 : "#fafafa", color: ink, fontFamily: "inherit" }}
              onFocus={e => e.target.style.border = `1.5px solid ${C.or1}`} onBlur={e => e.target.style.border = `1.5px solid ${ink5}`} />
            <Btn variant="primary" size="sm" icon="+" onClick={handleNote} G={G}>Thêm</Btn>
          </div>
        </Panel>
      </div>
    </div>
  </>);
}

// ─── Mobile Order Card ──────────────────────────────────────
function OrderCard({ order, idx, onView, G }) {
  const [h, hov] = useHover();
  const isNew = order.isNew;
  const isDark = G && G.ink === DARK.ink;
  const bg = isDark ? G.bgCard : C.bgCard;
  const ink = isDark ? G.ink : C.ink;
  const ink2 = isDark ? G.ink2 : C.ink2;
  const ink3 = isDark ? G.ink3 : C.ink3;
  const ink4 = isDark ? G.ink4 : C.ink4;
  const ink6 = isDark ? G.ink6 : C.ink6;
  const border = h ? C.or1 : (isNew ? C.or4 : ink6);
  const bgColor = isNew ? C.or3 : bg;
  return (<div {...hov} onClick={onView} style={{ background: bgColor, borderRadius: 14, border: `1.5px solid ${border}`, boxShadow: h ? "0 4px 20px rgba(249,115,22,.12)" : isNew ? "0 2px 8px rgba(249,115,22,.08)" : (isDark ? "0 1px 4px rgba(0,0,0,.3)" : "0 1px 4px rgba(0,0,0,.04)"), transition: "all 0.18s", cursor: "pointer", overflow: "hidden", animation: `slideup 0.35s ease ${idx * .04}s both`, position: "relative" }}>
    {isNew && <div style={{ position: "absolute", top: 0, left: 0, width: 3, bottom: 0, background: `linear-gradient(180deg,${C.or1},#fbbf24)`, borderRadius: "2px 0 0 2px" }} />}
    <div style={{ padding: "14px 14px 14px 18px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          {isNew && <span style={{ padding: "1px 6px", borderRadius: 5, fontSize: 9.5, fontWeight: 800, background: C.or1, color: "#fff" }}>NEW</span>}
          <span style={{ fontFamily: "monospace", fontSize: 12.5, fontWeight: 800, color: C.or1 }}>{order.id}</span>
        </div>
        <StatusChip status={order.status} />
      </div>
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: ink, marginBottom: 3, lineHeight: 1.3 }}>{order.movie}</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: ink3 }}>👤 {order.customer}</span>
          <span style={{ fontSize: 12, color: ink4 }}>📱 {order.phone}</span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
        <div style={{ padding: "8px 10px", borderRadius: 9, background: isDark ? G.ink6 : C.ink6 }}>
          <div style={{ fontSize: 9.5, color: ink4, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 2 }}>Rạp / Phòng</div>
          <div style={{ fontSize: 11.5, color: ink2, fontWeight: 700 }}>{order.cinema}</div>
          <div style={{ fontSize: 11, color: ink4 }}>{order.room}</div>
        </div>
        <div style={{ padding: "8px 10px", borderRadius: 9, background: isDark ? G.ink6 : C.ink6 }}>
          <div style={{ fontSize: 9.5, color: ink4, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 2 }}>Suất chiếu</div>
          <div style={{ fontSize: 11.5, color: C.blue, fontWeight: 700 }}>{fmtDate(order.showtime)}</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          {order.seats.slice(0, 3).map(s => <Tag key={s} color={C.blue} bg={C.blueBg} border={C.blueBdr}>{s}</Tag>)}
          {order.seats.length > 3 && <Tag color={ink3} bg={isDark ? G.ink6 : C.ink6} border={isDark ? G.ink5 : C.ink5}>+{order.seats.length - 3}</Tag>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <PayChip method={order.payMethod} />
          <span style={{ fontSize: 16, fontWeight: 900, color: C.or1 }}>{fmt(order.total)}</span>
        </div>
      </div>
      {order.notes.length > 0 && <div style={{ fontSize: 11, color: ink4, marginTop: 8 }}>📝 {order.notes.length} ghi chú nội bộ</div>}
    </div>
  </div>);
}

// ─── Desktop Order Row ──────────────────────────────────────
function OrderRow({ order, idx, onView, G }) {
  const [h, hov] = useHover();
  const isNew = order.isNew;
  const isDark = G && G.ink === DARK.ink;
  const bg = isDark ? G.bgCard : C.bgCard;
  const ink = isDark ? G.ink : C.ink;
  const ink2 = isDark ? G.ink2 : C.ink2;
  const ink3 = isDark ? G.ink3 : C.ink3;
  const ink4 = isDark ? G.ink4 : C.ink4;
  const ink5 = isDark ? G.ink5 : C.ink5;
  const ink6 = isDark ? G.ink6 : C.ink6;
  const border = h ? C.or1 : (isNew ? C.or4 : ink6);
  const bgColor = isNew ? C.or3 : bg;
  return (<div {...hov} onClick={onView} style={{ background: bgColor, borderRadius: 12, border: `1.5px solid ${border}`, boxShadow: h ? "0 4px 20px rgba(249,115,22,.12)" : isNew ? "0 2px 8px rgba(249,115,22,.08)" : (isDark ? "0 1px 4px rgba(0,0,0,.3)" : "0 1px 4px rgba(0,0,0,.04)"), transition: "all 0.18s", cursor: "pointer", overflow: "hidden", animation: `slideup 0.35s ease ${idx * .04}s both`, position: "relative" }}>
    {isNew && <div style={{ position: "absolute", top: 0, left: 0, width: 3, bottom: 0, background: `linear-gradient(180deg,${C.or1},#fbbf24)`, borderRadius: "2px 0 0 2px" }} />}
    <div style={{ padding: "12px 14px 12px 18px", display: "grid", gridTemplateColumns: "140px 1fr 160px 110px 110px 140px 110px", gap: 10, alignItems: "center" }}>
      <div>
        {isNew && <span style={{ padding: "1px 6px", borderRadius: 5, fontSize: 9.5, fontWeight: 800, background: C.or1, color: "#fff", display: "inline-block", marginBottom: 3 }}>NEW</span>}
        <div style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: C.or1 }}>{order.id}</div>
        <div style={{ fontSize: 10, color: ink4, marginTop: 2 }}>{fmtDate(order.createdAt)}</div>
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: ink, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{order.movie}</div>
        <div style={{ fontSize: 12, color: ink3 }}>👤 {order.customer}</div>
        <div style={{ fontSize: 11, color: ink4 }}>📱 {order.phone}</div>
      </div>
      <div>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: ink2, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{order.cinema}</div>
        <div style={{ fontSize: 11, color: ink4 }}>{order.room}</div>
        <div style={{ fontSize: 11, color: C.blue, fontWeight: 600 }}>{fmtDate(order.showtime)}</div>
      </div>
      <div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          {order.seats.slice(0, 3).map(s => <Tag key={s} color={C.blue} bg={C.blueBg} border={C.blueBdr}>{s}</Tag>)}
          {order.seats.length > 3 && <Tag color={ink3} bg={isDark ? G.ink6 : C.ink6} border={isDark ? G.ink5 : C.ink5}>+{order.seats.length - 3}</Tag>}
        </div>
        <div style={{ fontSize: 10, color: ink4, marginTop: 4 }}>{order.seats.length} ghế</div>
      </div>
      <div>
        <div style={{ fontSize: 15, fontWeight: 900, color: C.or1, letterSpacing: "-0.5px" }}>{fmt(order.total)}</div>
        {order.combo !== "Không có" && <div style={{ fontSize: 10, color: C.or2, marginTop: 2, fontWeight: 600 }}>🍿 Combo</div>}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <StatusChip status={order.status} />
        <PayChip method={order.payMethod} />
      </div>
      <div onClick={e => e.stopPropagation()} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <Btn variant="primary" size="xs" icon="👁" onClick={onView} G={G}>Chi tiết</Btn>
        {order.notes.length > 0 && <div style={{ fontSize: 10, color: ink4, textAlign: "center" }}>📝 {order.notes.length} ghi chú</div>}
      </div>
    </div>
  </div>);
}

/* ══════════════════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════════════════ */
export default function QuanLyDonHang() {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const G = isDark ? DARK : C;

  const [orders, setOrders] = useState(ORDERS_RAW);
  const [detail, setDetail] = useState(null);
  const [search, setSearch] = useState("");
  const [fStatus, setFStatus] = useState("Tất cả");
  const [fCinema, setFCinema] = useState("Tất cả");
  const [fMovie, setFMovie] = useState("Tất cả");
  const [fDate, setFDate] = useState("");
  const [toast, setToast] = useState(null);
  const [newCount, setNewCount] = useState(ORDERS_RAW.filter(o => o.isNew).length);
  const [realtimePulse, setRealtimePulse] = useState(false);
  const [tab, setTab] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const isMobile = useIsMobile();
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      const fake = { id: "GPF-2026009", customer: "Bùi Thị Hoa", phone: "0989012345", email: "hoa.bui@email.com", movie: "Avengers: Infinity War", cinema: "Gấu Phim Hà Nội", room: "IMAX 1", showtime: "2026-05-24 22:00", seats: ["J1", "J2", "J3"], combo: "Combo Nhóm", total: 620000, payMethod: "Ví MoMo", status: "Chờ thanh toán", createdAt: new Date().toISOString().slice(0, 16).replace("T", " "), notes: [], isNew: true, refundReason: "" };
      setOrders(p => [fake, ...p]);
      setNewCount(c => c + 1);
      setRealtimePulse(true);
      setToast("🔔 Đơn hàng mới #GPF-2026009 vừa được tạo!");
      setTimeout(() => setRealtimePulse(false), 3000);
      setTimeout(() => setToast(null), 4500);
    }, 6000);
    return () => clearTimeout(timerRef.current);
  }, []);

  const toastFn = msg => { setToast(msg); setTimeout(() => setToast(null), 3500); };

  const filtered = orders.filter(o => {
    const q = search.toLowerCase();
    const mS = !q || o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.phone.includes(q) || o.email.toLowerCase().includes(q) || o.movie.toLowerCase().includes(q);
    const mSt = fStatus === "Tất cả" || o.status === fStatus;
    const mC = fCinema === "Tất cả" || o.cinema === fCinema;
    const mM = fMovie === "Tất cả" || o.movie === fMovie;
    const mD = !fDate || o.createdAt.startsWith(fDate);
    const mT = tab === "all" || (tab === "new" && o.isNew) || (tab === "refund" && o.status === "Hoàn tiền") || (tab === "pending" && o.status === "Chờ thanh toán");
    return mS && mSt && mC && mM && mD && mT;
  });

  const stats = {
    total: orders.length,
    paid: orders.filter(o => o.status === "Đã thanh toán" || o.status === "Đã check-in").length,
    refund: orders.filter(o => o.status === "Hoàn tiền").length,
    revenue: orders.filter(o => o.status === "Đã thanh toán" || o.status === "Đã check-in").reduce((a, o) => a + o.total, 0),
  };

  const handleAddNote = (id, text) => {
    const note = { author: "Nhân viên BO", time: new Date().toLocaleString("vi-VN"), text };
    setOrders(p => p.map(o => o.id === id ? { ...o, notes: [...o.notes, note] } : o));
  };
  const handleRefund = (id, decision, reason) => {
    setOrders(p => p.map(o => {
      if (o.id !== id) return o;
      const noteText = decision === "approve" ? `Đề xuất duyệt hoàn tiền lên Admin. Ghi chú: ${reason || "—"}` : `Từ chối hoàn tiền. Lý do: ${reason || "—"}`;
      return { ...o, status: decision === "approve" ? "Hoàn tiền" : "Đã hủy", notes: [...o.notes, { author: "Nhân viên BO", time: new Date().toLocaleString("vi-VN"), text: noteText }] };
    }));
  };
  const handleMarkSeen = () => { setOrders(p => p.map(o => ({ ...o, isNew: false }))); setNewCount(0); };
  const handleExport = () => { exportToExcel(filtered, G); toastFn("📥 Đã xuất danh sách đơn hàng ra Excel!"); };

  const hasFilter = search || fStatus !== "Tất cả" || fCinema !== "Tất cả" || fMovie !== "Tất cả" || fDate;

  const bg = isDark ? G.bg : C.bg;
  const bgCard = isDark ? G.bgCard : C.bgCard;
  const ink = isDark ? G.ink : C.ink;
  const ink2 = isDark ? G.ink2 : C.ink2;
  const ink3 = isDark ? G.ink3 : C.ink3;
  const ink4 = isDark ? G.ink4 : C.ink4;
  const ink5 = isDark ? G.ink5 : C.ink5;
  const ink6 = isDark ? G.ink6 : C.ink6;

  const STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:'Sora',system-ui,sans-serif;background:${bg};}
    @keyframes slideup{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadein{from{opacity:0}to{opacity:1}}
    @keyframes scalein{from{opacity:0;transform:scale(.96) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}
    @keyframes slidein{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
    @keyframes slidefromright{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
    @keyframes op-pulse{0%,100%{opacity:1}50%{opacity:.3}}
    @keyframes toast-in{from{opacity:0;transform:translateX(-50%) translateY(12px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
    @keyframes realtime-ring{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}}
    ::-webkit-scrollbar{width:5px;height:5px}
    ::-webkit-scrollbar-track{background:${isDark ? G.ink6 : "#f1f5f9"}}
    ::-webkit-scrollbar-thumb{background:${isDark ? G.ink5 : "#d4d4d8"};border-radius:99px}
    input,select,textarea{font-family:'Sora',system-ui,sans-serif;}
    select{appearance:auto}
    @media(max-width:767px){
      .stats-grid{grid-template-columns:1fr 1fr!important;}
      .tabs-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch;}
      .desktop-only{display:none!important;}
    }
  `;

  return (
    <div style={{
      minHeight: "100vh",
      background: bg,
      fontFamily: "'Sora',system-ui,sans-serif",
      paddingTop: isMobile ? "90px" : "80px",
      paddingLeft: isMobile ? 12 : 20,
      paddingRight: isMobile ? 12 : 20,
      paddingBottom: 60
    }}>
      <style>{STYLES}</style>

      {toast && <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", padding: "13px 20px", borderRadius: 14, background: isDark ? G.bgDark : C.bgDark, color: "#fff", fontSize: 13, fontWeight: 700, boxShadow: "0 10px 36px rgba(0,0,0,.35)", zIndex: 9999, animation: "toast-in 0.3s ease", whiteSpace: "nowrap", maxWidth: "calc(100vw - 32px)", textAlign: "center" }}>{toast}</div>}

      {detail && <OrderDetail order={orders.find(o => o.id === detail.id) || detail} onClose={() => setDetail(null)} onRefund={handleRefund} onAddNote={handleAddNote} toastFn={toastFn} G={G} />}

      <div style={{ maxWidth: 1400, margin: "0 auto" }}>

        {/* ── PAGE HEADER ── */}
        <div style={{ display: "flex", alignItems: isMobile ? "flex-start" : "center", justifyContent: "space-between", marginBottom: 20, gap: 12, flexWrap: "wrap", animation: "slideup 0.4s ease both" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: isMobile ? 44 : 52, height: isMobile ? 44 : 52, borderRadius: 14, background: `linear-gradient(135deg,${C.or1},#fbbf24)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: isMobile ? 20 : 24, boxShadow: `0 8px 24px rgba(249,115,22,.38)`, flexShrink: 0 }}>🧾</div>
            <div>
              <h1 style={{ fontSize: isMobile ? 20 : 26, fontWeight: 900, color: ink, letterSpacing: "-0.6px", lineHeight: 1.1 }}>Quản lý Đơn hàng</h1>
              <p style={{ fontSize: isMobile ? 11 : 12.5, color: ink4, marginTop: 3, fontWeight: 500 }}>Theo dõi, tra cứu & xử lý đơn đặt vé · Realtime</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            {/* Dark Mode Toggle */}
            <button onClick={toggleColorMode} style={{ width: 38, height: 38, borderRadius: 10, background: isDark ? ink6 : "#fafafa", border: `1.5px solid ${ink5}`, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", color: ink2 }}>
              {isDark ? "☀️" : "🌙"}
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 9, background: bgCard, border: `1px solid ${ink6}` }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.green, animation: "op-pulse 1.6s ease infinite" }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: C.green }}>REALTIME</span>
            </div>
            {newCount > 0 && (
              <button onClick={handleMarkSeen} style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 12px", borderRadius: 9, background: realtimePulse ? C.or3 : bgCard, border: `1.5px solid ${realtimePulse ? C.or1 : ink5}`, cursor: "pointer", transition: "all 0.3s", animation: realtimePulse ? "realtime-ring 0.4s ease" : "none", color: ink2 }}>
                <span style={{ fontSize: 12.5, fontWeight: 800, color: C.or1 }}>{newCount} mới</span>
                <Badge count={newCount} />
              </button>
            )}
            {/* Export Button */}
            <Btn variant="dark" icon="📥" onClick={handleExport} G={G}>Xuất Excel</Btn>
          </div>
        </div>

        {/* ── STATS ── */}
        <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 18 }}>
          <Stat label="Tổng đơn" value={stats.total} emoji="🧾" accent={C.or1} sub={`${filtered.length} hiển thị`} delay={0} G={G} />
          <Stat label="Đã thanh toán" value={stats.paid} emoji="✅" accent={C.green} sub="bao gồm check-in" delay={0.05} G={G} />
          <Stat label="Yêu cầu hoàn" value={stats.refund} emoji="🔄" accent={C.violet} sub="chờ xử lý" delay={0.1} G={G} />
          <Stat label="Doanh thu" value={fmt(stats.revenue)} emoji="💰" accent={C.amber} sub="đơn thành công" delay={0.15} G={G} />
        </div>

        {/* ── TABS ── */}
        <div className="tabs-wrap" style={{ display: "flex", gap: 2, marginBottom: 12, background: isDark ? G.ink6 : "#e4e4e7", borderRadius: 11, padding: 3, width: isMobile ? "100%" : "fit-content" }}>
          {[{ k: "all", l: "Tất cả", count: orders.length }, { k: "new", l: "🔔 Mới", count: newCount }, { k: "pending", l: "⏳ Chờ TT", count: orders.filter(o => o.status === "Chờ thanh toán").length }, { k: "refund", l: "🔄 Hoàn tiền", count: orders.filter(o => o.status === "Hoàn tiền").length }].map(t => (
            <button key={t.k} onClick={() => setTab(t.k)} style={{ flex: isMobile ? 1 : 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "7px 14px", borderRadius: 8, fontSize: isMobile ? 11.5 : 12.5, fontWeight: 700, border: "none", cursor: "pointer", transition: "all 0.18s", background: tab === t.k ? C.or1 : "transparent", color: tab === t.k ? "#fff" : ink4, boxShadow: tab === t.k ? "0 2px 10px rgba(249,115,22,.35)" : "none", whiteSpace: "nowrap" }}>
              {t.l}
              {t.count > 0 && <span style={{ fontSize: 10, fontWeight: 800, padding: "1px 5px", borderRadius: 9, background: tab === t.k ? "rgba(255,255,255,.3)" : ink6, color: tab === t.k ? "#fff" : ink3 }}>{t.count}</span>}
            </button>
          ))}
        </div>

        {/* ── FILTER BAR ── */}
        <div style={{ background: bgCard, borderRadius: 14, border: `1px solid ${ink6}`, boxShadow: isDark ? "0 2px 8px rgba(0,0,0,.3)" : "0 2px 8px rgba(0,0,0,.04)", marginBottom: 12, overflow: "hidden" }}>
          <div style={{ padding: "12px 14px", borderBottom: `1px solid ${ink6}`, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: "1 1 220px", minWidth: 0 }}>
              <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 13, pointerEvents: "none" }}>🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm mã đơn, tên khách, SĐT, email..."
                style={{ width: "100%", height: 38, paddingLeft: 32, paddingRight: 10, borderRadius: 9, fontSize: 12.5, fontWeight: 500, background: isDark ? G.ink6 : "#fafafa", border: `1.5px solid ${ink5}`, outline: "none", color: ink }}
                onFocus={e => e.target.style.border = `1.5px solid ${C.or1}`} onBlur={e => e.target.style.border = `1.5px solid ${ink5}`} />
            </div>
            {isMobile ? (
              <button onClick={() => setShowFilters(v => !v)} style={{ display: "flex", alignItems: "center", gap: 6, height: 38, padding: "0 14px", borderRadius: 9, fontSize: 12, fontWeight: 700, border: `1.5px solid ${showFilters ? C.or1 : ink5}`, background: showFilters ? C.or3 : (isDark ? G.ink6 : "#fafafa"), color: showFilters ? C.or1 : ink3, cursor: "pointer" }}>
                ⚙️ Lọc {hasFilter && <Badge count={[fStatus !== "Tất cả", fCinema !== "Tất cả", fMovie !== "Tất cả", !!fDate].filter(Boolean).length} />}
              </button>
            ) : (
              <>
                {[{ val: fStatus, set: setFStatus, opts: ["Tất cả", "Đã thanh toán", "Chờ thanh toán", "Đã hủy", "Hoàn tiền", "Đang xử lý", "Đã check-in"], flex: "0 1 150px" },
                { val: fCinema, set: setFCinema, opts: ["Tất cả", ...CINEMAS], flex: "0 1 170px" },
                { val: fMovie, set: setFMovie, opts: ["Tất cả", ...MOVIES], flex: "1 1 160px" },
                ].map((f, i) => (
                  <select key={i} value={f.val} onChange={e => f.set(e.target.value)} style={{ flex: f.flex, height: 38, padding: "0 10px", borderRadius: 9, fontSize: 12.5, fontWeight: 600, background: isDark ? G.ink6 : "#fafafa", border: `1.5px solid ${ink5}`, outline: "none", color: ink3, cursor: "pointer" }}
                    onFocus={e => e.target.style.border = `1.5px solid ${C.or1}`} onBlur={e => e.target.style.border = `1.5px solid ${ink5}`}>
                    {f.opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                ))}
                <input type="date" value={fDate} onChange={e => setFDate(e.target.value)} style={{ flex: "0 1 145px", height: 38, padding: "0 10px", borderRadius: 9, fontSize: 12.5, fontWeight: 600, background: isDark ? G.ink6 : "#fafafa", border: `1.5px solid ${ink5}`, outline: "none", color: ink3, cursor: "pointer" }}
                  onFocus={e => e.target.style.border = `1.5px solid ${C.or1}`} onBlur={e => e.target.style.border = `1.5px solid ${ink5}`} />
                {hasFilter && <Btn variant="ghost" size="sm" onClick={() => { setSearch(""); setFStatus("Tất cả"); setFCinema("Tất cả"); setFMovie("Tất cả"); setFDate(""); }} G={G}>✕ Xóa</Btn>}
              </>
            )}
          </div>

          {/* Mobile filters expanded */}
          {isMobile && showFilters && (
            <div style={{ padding: "12px 14px", borderBottom: `1px solid ${ink6}`, display: "flex", flexDirection: "column", gap: 10, animation: "slidein 0.2s ease" }}>
              {[{ label: "Trạng thái", val: fStatus, set: setFStatus, opts: ["Tất cả", "Đã thanh toán", "Chờ thanh toán", "Đã hủy", "Hoàn tiền", "Đang xử lý", "Đã check-in"] },
              { label: "Rạp chiếu", val: fCinema, set: setFCinema, opts: ["Tất cả", ...CINEMAS] },
              { label: "Phim", val: fMovie, set: setFMovie, opts: ["Tất cả", ...MOVIES] },
              ].map(f => (
                <div key={f.label}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: ink4, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 5 }}>{f.label}</div>
                  <select value={f.val} onChange={e => f.set(e.target.value)} style={{ width: "100%", height: 40, padding: "0 12px", borderRadius: 9, fontSize: 13, fontWeight: 600, background: isDark ? G.ink6 : "#fafafa", border: `1.5px solid ${ink5}`, outline: "none", color: ink3, cursor: "pointer" }}>
                    {f.opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, color: ink4, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 5 }}>Ngày đặt</div>
                <input type="date" value={fDate} onChange={e => setFDate(e.target.value)} style={{ width: "100%", height: 40, padding: "0 12px", borderRadius: 9, fontSize: 13, fontWeight: 600, background: isDark ? G.ink6 : "#fafafa", border: `1.5px solid ${ink5}`, outline: "none", color: ink3, cursor: "pointer" }} />
              </div>
              {hasFilter && <Btn variant="danger" size="sm" full onClick={() => { setSearch(""); setFStatus("Tất cả"); setFCinema("Tất cả"); setFMovie("Tất cả"); setFDate(""); }} G={G}>✕ Xóa tất cả bộ lọc</Btn>}
            </div>
          )}

          {/* Desktop column headers */}
          {!isMobile && (
            <div className="desktop-only" style={{ padding: "8px 18px 8px 20px", background: isDark ? G.ink6 : "#fafafa", borderBottom: `1px solid ${ink6}`, display: "grid", gridTemplateColumns: "140px 1fr 160px 110px 110px 140px 110px", gap: 10, alignItems: "center" }}>
              {["Mã đơn hàng", "Phim & Khách hàng", "Rạp / Suất", "Ghế", "Giá", "Thanh toán", "Thao tác"].map(col => (
                <div key={col} style={{ fontSize: 9.5, fontWeight: 900, color: ink4, textTransform: "uppercase", letterSpacing: "1px" }}>{col}</div>
              ))}
            </div>
          )}

          {/* List */}
          <div style={{ padding: "10px 10px" }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 0", color: ink4 }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>🧾</div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>Không tìm thấy đơn hàng</div>
                <div style={{ fontSize: 12, marginTop: 5 }}>Thử thay đổi bộ lọc</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {filtered.map((order, idx) =>
                  isMobile
                    ? <OrderCard key={order.id} order={order} idx={idx} onView={() => setDetail(order)} G={G} />
                    : <OrderRow key={order.id} order={order} idx={idx} onView={() => setDetail(order)} G={G} />
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ padding: "10px 16px", borderTop: `1px solid ${ink6}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontSize: 12, color: ink4 }}>Hiển thị <strong style={{ color: ink }}>{filtered.length}</strong> / {orders.length} đơn hàng</span>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Btn variant="dark" size="sm" icon="📥" onClick={handleExport} G={G}>Xuất Excel</Btn>
              <span style={{ fontSize: 11, color: ink4 }}>Tự động cập nhật · 30s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}