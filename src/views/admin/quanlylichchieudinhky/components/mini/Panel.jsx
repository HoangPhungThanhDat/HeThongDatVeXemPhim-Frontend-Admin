// src/views/admin/quanlylichchieudinhky/components/mini/Panel.jsx

import React from "react";

export const Panel = ({ children, style: sx }) => (
  <div style={{
    background: "#ffffff",
    borderRadius: 18,
    border: "1px solid #f3f4f6",
    boxShadow: "0 2px 8px rgba(0,0,0,.06)",
    padding: 22,
    ...sx,
  }}>
    {children}
  </div>
);