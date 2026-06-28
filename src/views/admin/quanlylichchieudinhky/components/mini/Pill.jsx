// src/views/admin/quanlylichchieudinhky/components/mini/Pill.jsx

import React from "react";

export const Pill = ({ children, color, bg, border, size = "md", dot }) => {
  const s = size === "sm" ? { fontSize: 10, px: "7px", py: "3px" } : { fontSize: 11.5, px: "10px", py: "4px" };
  
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      padding: `${s.py} ${s.px}`,
      borderRadius: 20,
      fontSize: s.fontSize,
      fontWeight: 700,
      color,
      background: bg,
      border: `1px solid ${border}`,
      letterSpacing: 0.2,
      whiteSpace: "nowrap",
    }}>
      {dot && (
        <span style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: color,
          animation: dot === "pulse" ? "gpulse 1.8s ease infinite" : "none",
        }} />
      )}
      {children}
    </span>
  );
};