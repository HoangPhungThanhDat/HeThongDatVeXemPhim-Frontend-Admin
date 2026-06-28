// src/views/admin/quanlylichchieudinhky/components/mini/Btn.jsx

import React, { useState } from "react";
import { BASE } from "../../constants";

export const Btn = ({ children, variant = "primary", size = "md", icon, onClick, full, style: sx }) => {
  const [h, setH] = useState(false);
  const pad = size === "sm" ? "6px 14px" : size === "xs" ? "5px 11px" : "10px 22px";
  const fs = size === "sm" ? 12 : size === "xs" ? 11 : 13.5;

  const styles = {
    primary: {
      background: h ? BASE.or2 : BASE.or1,
      color: "#fff",
      border: "none",
      boxShadow: h ? "0 6px 20px rgba(249,115,22,.45)" : "0 3px 12px rgba(249,115,22,.30)",
      transform: h ? "translateY(-1px)" : "none",
    },
    ghost: {
      background: h ? "#f3f4f6" : "#fff",
      color: "#374151",
      border: "1.5px solid #d1d5db",
      transform: h ? "translateY(-1px)" : "none",
    },
    danger: {
      background: h ? "#fee2e2" : BASE.redBg,
      color: BASE.red,
      border: `1px solid ${BASE.redBdr}`,
    },
    success: {
      background: h ? "#d1fae5" : BASE.greenBg,
      color: BASE.green,
      border: `1px solid ${BASE.greenBdr}`,
    },
    warn: {
      background: h ? "#fef3c7" : BASE.amberBg,
      color: BASE.amber,
      border: `1px solid ${BASE.amberBdr}`,
    },
    dark: {
      background: h ? "#2d2d4a" : "#1a1a2e",
      color: "#fff",
      border: "none",
      boxShadow: h ? "0 6px 20px rgba(0,0,0,.4)" : "0 3px 12px rgba(0,0,0,.2)",
      transform: h ? "translateY(-1px)" : "none",
    },
  };

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        padding: pad,
        borderRadius: 10,
        fontSize: fs,
        fontWeight: 700,
        cursor: "pointer",
        outline: "none",
        transition: "all 0.18s",
        width: full ? "100%" : "auto",
        ...styles[variant],
        ...sx,
      }}
    >
      {icon && <span style={{ fontSize: fs + 1 }}>{icon}</span>}
      {children}
    </button>
  );
};