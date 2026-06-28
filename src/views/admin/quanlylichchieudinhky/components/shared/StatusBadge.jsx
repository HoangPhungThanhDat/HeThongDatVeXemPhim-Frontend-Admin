// src/views/admin/quanlylichchieudinhky/components/shared/StatusBadge.jsx

import React from "react";
import { STATUS_MAP } from "../../constants";

export const StatusBadge = ({ status }) => {
  const s = STATUS_MAP[status] || STATUS_MAP["Hết hạn"];

  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      padding: "4px 10px",
      borderRadius: 20,
      fontSize: 11.5,
      fontWeight: 700,
      color: s.color,
      background: s.bg,
      border: `1px solid ${s.border}`,
      letterSpacing: 0.2,
      whiteSpace: "nowrap",
    }}>
      {s.dot && (
        <span style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: s.color,
          animation: s.dot === "pulse" ? "gpulse 1.8s ease infinite" : "none",
        }} />
      )}
      {s.label}
    </span>
  );
};