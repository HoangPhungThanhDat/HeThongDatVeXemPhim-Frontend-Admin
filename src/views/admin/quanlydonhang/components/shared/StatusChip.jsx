// components/shared/StatusChip.jsx
import React from "react";
import { ORDER_STATUS } from "../../constants";

export default function StatusChip({ status }) {
  const s = ORDER_STATUS[status] || ORDER_STATUS["Chờ thanh toán"];
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
      whiteSpace: "nowrap"
    }}>
      <span style={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: s.color,
        animation: s.dot ? "op-pulse 1.8s ease infinite" : "none"
      }} />
      {status}
    </span>
  );
}