// src/views/admin/quanlylichchieudinhky/components/shared/StatCard.jsx

import React, { useState } from "react";

export const StatCard = ({ label, value, sub, emoji, accent, delay = 0 }) => {
  const [h, setH] = useState(false);

  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: "#ffffff",
        borderRadius: 16,
        border: "1px solid #f3f4f6",
        padding: "20px 22px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: h ? "0 8px 24px rgba(0,0,0,.10)" : "0 2px 6px rgba(0,0,0,.05)",
        transform: h ? "translateY(-3px)" : "none",
        transition: "all 0.22s",
        animationDelay: `${delay}s`,
        animation: "gfadeUp 0.45s ease both",
      }}
    >
      <div>
        <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "0.9px", textTransform: "uppercase", color: "#9ca3af", marginBottom: 6 }}>
          {label}
        </div>
        <div style={{ fontSize: 30, fontWeight: 900, color: "#111827", lineHeight: 1, letterSpacing: "-1px" }}>
          {value}
        </div>
        {sub && <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 5, fontWeight: 500 }}>{sub}</div>}
      </div>
      <div style={{
        width: 50,
        height: 50,
        borderRadius: 14,
        background: `${accent}15`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 22,
      }}>
        {emoji}
      </div>
    </div>
  );
};