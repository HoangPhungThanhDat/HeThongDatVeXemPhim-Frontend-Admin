// components/RefundModal.jsx
import React, { useState } from "react";
import { C } from "../constants";
import Btn from "./shared/Btn";

export default function RefundModal({ order, onClose, onDecide, G }) {
  const [decision, setDecision] = useState(null);
  const [reason, setReason] = useState("");
  const isDark = G && G.ink === C.ink;
  const bg = isDark ? G.bgCard : C.bgCard;
  const ink = isDark ? G.ink : C.ink;
  const ink2 = isDark ? G.ink2 : C.ink2;
  const ink4 = isDark ? G.ink4 : C.ink4;
  const ink5 = isDark ? G.ink5 : C.ink5;
  const ink6 = isDark ? G.ink6 : C.ink6;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(9,9,11,.7)",
      backdropFilter: "blur(8px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2000,
      padding: 16,
      animation: "fadein 0.2s ease"
    }}>
      <div style={{
        background: bg,
        borderRadius: 22,
        width: "100%",
        maxWidth: 500,
        boxShadow: "0 40px 100px rgba(0,0,0,.35)",
        animation: "scalein 0.25s ease",
        overflow: "hidden"
      }}>
        <div style={{
          background: `linear-gradient(135deg,${C.violet}15,${C.or3})`,
          padding: "20px 22px 16px",
          borderBottom: `1px solid ${ink6}`
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 900, color: ink }}>🔄 Xử lý yêu cầu hoàn tiền</div>
              <div style={{ fontSize: 11.5, color: ink4, marginTop: 3 }}>Đơn hàng #{order.id}</div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: `1.5px solid ${ink5}`,
                background: ink6,
                cursor: "pointer",
                fontSize: 15,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: ink2
              }}
            >✕</button>
          </div>
        </div>

        <div style={{ padding: 20 }}>
          <div style={{
            padding: "12px 14px",
            borderRadius: 12,
            background: C.violetBg,
            border: `1px solid ${C.violetBdr}`,
            marginBottom: 16
          }}>
            <div style={{
              fontSize: 10.5,
              fontWeight: 700,
              color: C.violet,
              textTransform: "uppercase",
              letterSpacing: 0.8,
              marginBottom: 5
            }}>Lý do yêu cầu của khách</div>
            <div style={{ fontSize: 13, color: ink2, fontWeight: 500, lineHeight: 1.5 }}>
              {order.refundReason || "Khách không để lại lý do"}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            {[
              { k: "approve", label: "✅ Duyệt hoàn tiền", desc: "Chuyển lên Admin duyệt thực tế", color: C.green, bg: C.greenBg, bdr: C.greenBdr },
              { k: "reject", label: "❌ Từ chối hoàn tiền", desc: "Gửi thông báo từ chối đến khách", color: C.red, bg: C.redBg, bdr: C.redBdr }
            ].map(opt => (
              <div
                key={opt.k}
                onClick={() => setDecision(opt.k)}
                style={{
                  padding: "12px 10px",
                  borderRadius: 12,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  border: `2px solid ${decision === opt.k ? opt.color : ink5}`,
                  background: decision === opt.k ? opt.bg : (isDark ? G.ink6 : "#fafafa")
                }}
              >
                <div style={{
                  fontSize: 12.5,
                  fontWeight: 800,
                  color: decision === opt.k ? opt.color : (isDark ? G.ink3 : C.ink3),
                  marginBottom: 3
                }}>{opt.label}</div>
                <div style={{ fontSize: 10.5, color: ink4 }}>{opt.desc}</div>
              </div>
            ))}
          </div>

          {decision && (
            <div style={{ marginBottom: 16, animation: "slidein 0.2s ease" }}>
              <div style={{
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: "0.8px",
                textTransform: "uppercase",
                color: ink4,
                marginBottom: 6
              }}>Ghi chú kèm theo</div>
              <textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Nhập lý do hoặc ghi chú..."
                rows={3}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 10,
                  fontSize: 13,
                  border: `1.5px solid ${ink5}`,
                  outline: "none",
                  resize: "vertical",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  background: isDark ? G.ink6 : "#fafafa",
                  color: ink
                }}
                onFocus={e => e.target.style.border = `1.5px solid ${C.or1}`}
                onBlur={e => e.target.style.border = `1.5px solid ${ink5}`}
              />
            </div>
          )}

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={onClose} G={G}>Hủy</Btn>
            <Btn
              variant={decision === "approve" ? "success" : decision === "reject" ? "danger" : "primary"}
              disabled={!decision}
              onClick={() => { onDecide(order.id, decision, reason); onClose(); }}
              G={G}
            >
              {decision === "approve" ? "✅ Xác nhận duyệt" : decision === "reject" ? "❌ Xác nhận từ chối" : "Chọn quyết định"}
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}