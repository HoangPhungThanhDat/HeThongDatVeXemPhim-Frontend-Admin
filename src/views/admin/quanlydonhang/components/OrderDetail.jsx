// components/OrderDetail.jsx
import React, { useState } from "react";
import { C, fmt, fmtDate } from "../constants";
import Btn from "./shared/Btn";
import Panel from "./shared/Panel";
import SectionHead from "./shared/SectionHead";
import StatusChip from "./shared/StatusChip";
import PayChip from "./shared/PayChip";
import RefundModal from "./RefundModal";

export default function OrderDetail({ 
  order, 
  onClose, 
  onRefund, 
  onAddNote, 
  toastFn, 
  G,
  getUserName = () => "N/A",
  getPromotionTitle = () => "Không có"
}) {
  const [note, setNote] = useState("");
  const [showRefund, setShowRefund] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const isDark = G && G.ink === C.ink;
  const bg = isDark ? G.bgCard : C.bgCard;
  const ink = isDark ? G.ink : C.ink;
  const ink2 = isDark ? G.ink2 : C.ink2;
  const ink3 = isDark ? G.ink3 : C.ink3;
  const ink4 = isDark ? G.ink4 : C.ink4;
  const ink5 = isDark ? G.ink5 : C.ink5;
  const ink6 = isDark ? G.ink6 : C.ink6;
  const bgDark = isDark ? G.bgDark : C.bgDark;
  const isMobile = window.innerWidth < 768;

  // ─── Handle note ──────────────────────────────────────────────
  const handleNote = () => {
    if (!note.trim()) return;
    onAddNote(order.OrderId, note.trim());
    setNote("");
    toastFn("📝 Đã thêm ghi chú nội bộ");
  };

  // ─── Handle status change ──────────────────────────────────────
  const handleStatusChange = async (newStatus) => {
    setIsProcessing(true);
    try {
      // Update status via API through parent
      await onRefund(order.OrderId, newStatus === "Hoàn tiền" ? "approve" : "reject", "");
      toastFn(`✅ Đã cập nhật trạng thái thành "${newStatus}"`);
    } catch (err) {
      toastFn("❌ Cập nhật trạng thái thất bại!");
    } finally {
      setIsProcessing(false);
    }
  };

  // ─── Get customer info ────────────────────────────────────────
  const customerName = getUserName(order.UserId);
  const promotionTitle = getPromotionTitle(order.PromotionId);
  
  // ─── Format data ──────────────────────────────────────────────
  const orderId = order.OrderId || order.id || "N/A";
  const totalAmount = order.TotalAmount || order.total || 0;
  const orderDate = order.OrderDate || order.createdAt || order.CreatedAt || new Date().toISOString();
  const status = order.Status || order.status || "Chờ thanh toán";
  const payMethod = order.PayMethod || order.payMethod || "Chưa cập nhật";
  const combo = order.Combo || order.combo || "Không có";
  const seats = order.Seats || order.seats || ["Chưa có"];
  const movie = order.Movie || order.movie || "Phim đang cập nhật";
  const cinema = order.Cinema || order.cinema || "Rạp đang cập nhật";
  const room = order.Room || order.room || "Phòng đang cập nhật";
  const phone = order.Phone || order.phone || order.UserId || "N/A";
  const email = order.Email || order.email || "N/A";
  const refundReason = order.RefundReason || order.refundReason || "";
  const notes = order.Notes || order.notes || [];
  const showtime = order.Showtime || order.showtime || orderDate;

  return (
    <>
      {showRefund && (
        <RefundModal
          order={order}
          onClose={() => setShowRefund(false)}
          onDecide={(id, dec, reason) => {
            onRefund(id, dec, reason);
            toastFn(dec === "approve" ? "✅ Đã đề xuất duyệt hoàn tiền lên Admin" : "❌ Đã từ chối yêu cầu hoàn tiền");
          }}
          G={G}
        />
      )}
      
      {/* ─── Overlay ────────────────────────────────────────────── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(9,9,11,.55)",
          backdropFilter: "blur(4px)",
          zIndex: 999,
          animation: "fadein 0.2s ease"
        }}
        onClick={onClose}
      />
      
      {/* ─── Drawer ──────────────────────────────────────────────── */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: isMobile ? "100vw" : "min(580px,100vw)",
          background: bg,
          boxShadow: "-8px 0 40px rgba(0,0,0,.18)",
          zIndex: 1000,
          overflowY: "auto",
          animation: "slidefromright 0.3s cubic-bezier(.4,0,.2,1)"
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            position: "sticky",
            top: 0,
            background: bg,
            borderBottom: `1px solid ${ink6}`,
            padding: "16px 20px",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div>
            <div style={{ fontSize: 15, fontWeight: 900, color: ink }}>Chi tiết đơn hàng</div>
            <div
              style={{
                fontSize: 11.5,
                color: ink4,
                marginTop: 2,
                fontFamily: "monospace",
                fontWeight: 600
              }}
            >
              {orderId}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <StatusChip status={status} />
            <button
              onClick={onClose}
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                border: `1.5px solid ${ink5}`,
                background: ink6,
                cursor: "pointer",
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: ink2
              }}
              disabled={isProcessing}
            >
              ✕
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          
          {/* ── Movie & Showtime ── */}
          <div
            style={{
              background: bgDark,
              borderRadius: 14,
              padding: "18px",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background: `linear-gradient(90deg,${C.or1},#fbbf24)`
              }}
            />
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#71717a",
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 7
              }}
            >
              🎬 Phim & Suất chiếu
            </div>
            <div
              style={{
                fontSize: 17,
                fontWeight: 900,
                color: "#fff",
                marginBottom: 10,
                lineHeight: 1.25
              }}
            >
              {movie}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                ["🏢 Rạp", cinema],
                ["🎭 Phòng", room],
                ["🕐 Suất chiếu", fmtDate(showtime)],
                ["💺 Ghế", seats.join(", ")]
              ].map(([l, v]) => (
                <div
                  key={l}
                  style={{
                    padding: "9px 11px",
                    borderRadius: 9,
                    background: "rgba(255,255,255,.06)"
                  }}
                >
                  <div style={{ fontSize: 9.5, color: "#71717a", fontWeight: 700, marginBottom: 2 }}>
                    {l}
                  </div>
                  <div style={{ fontSize: 12.5, color: "#fff", fontWeight: 700 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Customer Info ── */}
          <Panel style={{ padding: 16 }} G={G}>
            <SectionHead label="Thông tin khách hàng" G={G} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                ["👤 Họ tên", customerName],
                ["📱 Số điện thoại", phone],
                ["✉️ Email", email],
                ["📅 Đặt lúc", fmtDate(orderDate)]
              ].map(([l, v]) => (
                <div
                  key={l}
                  style={{
                    padding: "9px 11px",
                    borderRadius: 9,
                    background: isDark ? G.ink6 : C.ink6,
                    border: `1px solid ${isDark ? G.ink5 : C.ink5}`
                  }}
                >
                  <div style={{ fontSize: 9.5, color: ink4, fontWeight: 700, marginBottom: 2 }}>
                    {l}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: ink,
                      fontWeight: 700,
                      wordBreak: "break-all"
                    }}
                  >
                    {v}
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          {/* ── Payment & Combo ── */}
          <Panel style={{ padding: 16 }} G={G}>
            <SectionHead label="Thanh toán & Combo" G={G} />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10
              }}
            >
              <div style={{ fontSize: 12, color: ink3, fontWeight: 600 }}>Phương thức</div>
              <PayChip method={payMethod} />
            </div>
            
            {combo !== "Không có" && combo !== "Không có combo" && (
              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: 9,
                  background: C.or3,
                  border: `1px solid ${C.or4}`,
                  marginBottom: 10
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    color: C.or2,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 0.8,
                    marginBottom: 2
                  }}
                >
                  🍿 Combo
                </div>
                <div style={{ fontSize: 13, color: ink2, fontWeight: 700 }}>{combo}</div>
              </div>
            )}

            {/* Khuyến mãi */}
            {promotionTitle !== "Không có" && promotionTitle !== "Không có khuyến mãi" && (
              <div
                style={{
                  padding: "8px 12px",
                  borderRadius: 9,
                  background: C.violetBg,
                  border: `1px solid ${C.violetBdr}`,
                  marginBottom: 10
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    color: C.violet,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 0.8,
                    marginBottom: 2
                  }}
                >
                  🎁 Khuyến mãi
                </div>
                <div style={{ fontSize: 13, color: ink2, fontWeight: 700 }}>{promotionTitle}</div>
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 0",
                borderTop: `1px solid ${ink6}`
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: ink3 }}>Tổng đơn hàng</div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  color: C.or1,
                  letterSpacing: "-0.5px"
                }}
              >
                {fmt(totalAmount)}
              </div>
            </div>
          </Panel>

          {/* ── Refund ── */}
          {refundReason && (
            <div
              style={{
                padding: "14px 16px",
                borderRadius: 12,
                background: C.violetBg,
                border: `1px solid ${C.violetBdr}`
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: C.violet,
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  marginBottom: 6
                }}
              >
                ⚠️ Yêu cầu hoàn tiền
              </div>
              <div style={{ fontSize: 13, color: ink2, lineHeight: 1.5, marginBottom: 10 }}>
                {refundReason}
              </div>
              {status === "Hoàn tiền" && (
                <Btn
                  variant="violet"
                  icon="🔄"
                  onClick={() => setShowRefund(true)}
                  G={G}
                  disabled={isProcessing}
                >
                  Xử lý yêu cầu hoàn tiền
                </Btn>
              )}
            </div>
          )}

          {/* ── Actions ── */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Btn
              variant="ghost"
              size="sm"
              icon="🎫"
              onClick={() => toastFn("📋 Đã sao chép mã QR vé")}
              G={G}
            >
              Xem QR vé
            </Btn>
            
            {status !== "Hoàn tiền" && status !== "Đã hủy" && status !== "Đã hủy" && (
              <Btn
                variant="violet"
                size="sm"
                icon="🔄"
                onClick={() => setShowRefund(true)}
                G={G}
                disabled={isProcessing}
              >
                Yêu cầu hoàn tiền
              </Btn>
            )}
            
            {status === "Chờ thanh toán" && (
              <Btn
                variant="success"
                size="sm"
                icon="✅"
                onClick={() => handleStatusChange("Đã thanh toán")}
                G={G}
                disabled={isProcessing}
              >
                Xác nhận thanh toán
              </Btn>
            )}
            
            {status === "Đã thanh toán" && (
              <Btn
                variant="success"
                size="sm"
                icon="🎉"
                onClick={() => handleStatusChange("Đã check-in")}
                G={G}
                disabled={isProcessing}
              >
                Đánh dấu check-in
              </Btn>
            )}
          </div>

          {/* ── Notes ── */}
          <Panel style={{ padding: 16 }} G={G}>
            <SectionHead label="Ghi chú nội bộ" G={G} />
            
            {notes.length === 0 ? (
              <div style={{ textAlign: "center", padding: "14px 0", color: ink4, fontSize: 12 }}>
                Chưa có ghi chú nào
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
                {notes.map((n, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 9,
                      background: isDark ? G.ink6 : C.ink6,
                      border: `1px solid ${isDark ? G.ink5 : C.ink5}`
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: ink3 }}>
                        {n.author || "Nhân viên"}
                      </span>
                      <span style={{ fontSize: 10, color: ink4 }}>{n.time || "N/A"}</span>
                    </div>
                    <div style={{ fontSize: 12.5, color: ink2, lineHeight: 1.5 }}>
                      {n.text || n.content || ""}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Thêm ghi chú nội bộ..."
                onKeyDown={e => e.key === "Enter" && handleNote()}
                style={{
                  flex: 1,
                  height: 38,
                  padding: "0 12px",
                  borderRadius: 9,
                  fontSize: 13,
                  border: `1.5px solid ${ink5}`,
                  outline: "none",
                  background: isDark ? G.ink6 : "#fafafa",
                  color: ink,
                  fontFamily: "inherit"
                }}
                onFocus={e => e.target.style.border = `1.5px solid ${C.or1}`}
                onBlur={e => e.target.style.border = `1.5px solid ${ink5}`}
                disabled={isProcessing}
              />
              <Btn
                variant="primary"
                size="sm"
                icon="+"
                onClick={handleNote}
                G={G}
                disabled={!note.trim() || isProcessing}
              >
                Thêm
              </Btn>
            </div>
          </Panel>

          {/* ── Footer Info ── */}
          <div
            style={{
              padding: "12px 14px",
              borderRadius: 10,
              background: isDark ? G.ink6 : "#f8fafc",
              border: `1px solid ${isDark ? G.ink5 : C.ink5}`,
              fontSize: 11,
              color: ink4,
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 6
            }}
          >
            <span>Tạo: {order.CreatedAt || order.createdAt || "N/A"}</span>
            <span>Cập nhật: {order.UpdatedAt || order.updatedAt || "N/A"}</span>
            <span>ID: {orderId}</span>
          </div>
        </div>
      </div>
    </>
  );
}