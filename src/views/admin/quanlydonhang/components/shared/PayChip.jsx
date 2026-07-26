// components/shared/PayChip.jsx
import React from "react";
import { PAY_METHOD } from "../../constants";

export default function PayChip({ method }) {
  const p = PAY_METHOD[method] || { icon: "💰", color: "#52525b" };
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      fontSize: 12,
      fontWeight: 600,
      color: p.color
    }}>
      <span style={{ fontSize: 13 }}>{p.icon}</span>
      {method}
    </span>
  );
}