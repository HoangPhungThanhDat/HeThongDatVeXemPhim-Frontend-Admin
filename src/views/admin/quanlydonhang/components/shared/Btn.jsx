// components/shared/Btn.jsx
import React, { useState } from "react";
import { C, DARK } from "../../constants";

export default function Btn({ children, variant = "primary", size = "md", icon, onClick, full, disabled, G }) {
  const [hover, setHover] = useState(false);
  const isDark = G && G.ink === DARK.ink;
  
  const pad = size === "sm" ? "6px 14px" : size === "xs" ? "4px 10px" : "10px 22px";
  const fs = size === "sm" ? 12 : size === "xs" ? 11 : 13.5;
  
  const styles = {
    primary: {
      background: disabled ? (isDark ? "#4a5568" : "#d1d5db") : hover ? C.or2 : C.or1,
      color: "#fff",
      border: "none",
      boxShadow: disabled ? "none" : hover ? "0 6px 20px rgba(249,115,22,.4)" : "0 3px 10px rgba(249,115,22,.25)",
      transform: (!disabled && hover) ? "translateY(-1px)" : "none"
    },
    ghost: {
      background: hover ? (isDark ? G.ink6 : C.ink6) : (isDark ? G.bgCard : "#fff"),
      color: isDark ? G.ink3 : C.ink3,
      border: `1.5px solid ${isDark ? G.ink5 : C.ink5}`
    },
    danger: {
      background: hover ? "#fee2e2" : C.redBg,
      color: C.red,
      border: `1px solid ${C.redBdr}`
    },
    success: {
      background: hover ? "#dcfce7" : C.greenBg,
      color: C.green,
      border: `1px solid ${C.greenBdr}`
    },
    warn: {
      background: hover ? "#fef3c7" : C.amberBg,
      color: C.amber,
      border: `1px solid ${C.amberBdr}`
    },
    dark: {
      background: hover ? "#27272a" : (isDark ? G.bgDark : C.bgDark),
      color: "#fff",
      border: "none",
      boxShadow: "0 3px 12px rgba(0,0,0,.2)",
      transform: hover ? "translateY(-1px)" : "none"
    },
    violet: {
      background: hover ? "#ede9fe" : C.violetBg,
      color: C.violet,
      border: `1px solid ${C.violetBdr}`
    },
  };

  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        padding: pad,
        borderRadius: 10,
        fontSize: fs,
        fontWeight: 700,
        cursor: disabled ? "not-allowed" : "pointer",
        outline: "none",
        transition: "all 0.18s",
        width: full ? "100%" : "auto",
        border: "none",
        ...styles[variant]
      }}
    >
      {icon && <span style={{ fontSize: fs + 1 }}>{icon}</span>}
      {children}
    </button>
  );
}