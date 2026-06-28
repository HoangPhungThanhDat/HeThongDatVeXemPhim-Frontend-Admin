// src/views/admin/quanlylichchieudinhky/components/mini/FInput.jsx

import React, { useState } from "react";
import { BASE } from "../../constants";

export const FInput = ({ label, ...props }) => {
  const [f, setF] = useState(false);

  return (
    <div>
      {label && (
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: "#9ca3af", marginBottom: 6 }}>
          {label}
        </div>
      )}
      <input
        {...props}
        onFocus={() => setF(true)}
        onBlur={() => setF(false)}
        style={{
          width: "100%",
          height: 42,
          padding: "0 13px",
          borderRadius: 10,
          fontSize: 13.5,
          fontWeight: 500,
          background: "#fafafa",
          color: "#111827",
          border: `1.5px solid ${f ? BASE.or1 : "#d1d5db"}`,
          boxShadow: f ? `0 0 0 3px rgba(249,115,22,.12)` : "none",
          outline: "none",
          transition: "all 0.18s",
          boxSizing: "border-box",
          ...props.style,
        }}
      />
    </div>
  );
};