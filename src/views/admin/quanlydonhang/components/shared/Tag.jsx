// components/shared/Tag.jsx
import React from "react";

export default function Tag({ children, color, bg, border }) {
  return (
    <span style={{
      padding: "2px 7px",
      borderRadius: 6,
      fontSize: 10.5,
      fontWeight: 700,
      color,
      background: bg,
      border: `1px solid ${border}`
    }}>
      {children}
    </span>
  );
}