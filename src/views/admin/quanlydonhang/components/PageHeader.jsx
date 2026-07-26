// components/PageHeader.jsx
import React from "react";
import { C } from "../constants";
import Btn from "./shared/Btn";
import Badge from "./shared/Badge";

export default function PageHeader({
  isMobile, newCount, realtimePulse, handleMarkSeen, handleExport, G
}) {
  const isDark = G && G.ink === C.ink;
  const ink = isDark ? G.ink : C.ink;
  const ink4 = isDark ? G.ink4 : C.ink4;
  const bgCard = isDark ? G.bgCard : C.bgCard;
  const ink5 = isDark ? G.ink5 : C.ink5;
  const ink6 = isDark ? G.ink6 : C.ink6;

  return (
    <div style={{
      display: "flex",
      alignItems: isMobile ? "flex-start" : "center",
      justifyContent: "space-between",
      marginBottom: 20,
      gap: 12,
      flexWrap: "wrap",
      animation: "slideup 0.4s ease both"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{
          width: isMobile ? 44 : 52,
          height: isMobile ? 44 : 52,
          borderRadius: 14,
          background: `linear-gradient(135deg,${C.or1},#fbbf24)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: isMobile ? 20 : 24,
          boxShadow: `0 8px 24px rgba(249,115,22,.38)`,
          flexShrink: 0
        }}>🧾</div>
        <div>
          <h1 style={{
            fontSize: isMobile ? 20 : 26,
            fontWeight: 900,
            color: ink,
            letterSpacing: "-0.6px",
            lineHeight: 1.1
          }}>Quản lý Đơn hàng</h1>
          <p style={{
            fontSize: isMobile ? 11 : 12.5,
            color: ink4,
            marginTop: 3,
            fontWeight: 500
          }}>Theo dõi, tra cứu & xử lý đơn đặt vé · Realtime</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "7px 12px",
          borderRadius: 9,
          background: bgCard,
          border: `1px solid ${ink6}`
        }}>
          <div style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: C.green,
            animation: "op-pulse 1.6s ease infinite"
          }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: C.green }}>REALTIME</span>
        </div>

        {newCount > 0 && (
          <button
            onClick={handleMarkSeen}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "7px 12px",
              borderRadius: 9,
              background: realtimePulse ? C.or3 : bgCard,
              border: `1.5px solid ${realtimePulse ? C.or1 : ink5}`,
              cursor: "pointer",
              transition: "all 0.3s",
              animation: realtimePulse ? "realtime-ring 0.4s ease" : "none",
              color: ink
            }}
          >
            <span style={{ fontSize: 12.5, fontWeight: 800, color: C.or1 }}>{newCount} mới</span>
            <Badge count={newCount} />
          </button>
        )}

        <Btn variant="dark" icon="📥" onClick={handleExport} G={G}>Xuất Excel</Btn>
      </div>
    </div>
  );
}