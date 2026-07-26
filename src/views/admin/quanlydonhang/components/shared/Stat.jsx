// components/shared/Stat.jsx
import React, { useState } from "react";
import { C } from "../../constants";

export default function Stat({ label, value, sub, emoji, accent, delay, G }) {
  const [hover, setHover] = useState(false);
  const isDark = G && G.ink === C.ink;
  const bg = isDark ? G.bgCard : C.bgCard;
  const border = isDark ? G.ink6 : C.ink6;
  const ink = isDark ? G.ink : C.ink;
  const ink4 = isDark ? G.ink4 : C.ink4;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: bg,
        borderRadius: 16,
        border: `1px solid ${border}`,
        padding: "16px 18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: hover
          ? (isDark ? "0 8px 24px rgba(0,0,0,.4)" : "0 8px 24px rgba(0,0,0,.09)")
          : (isDark ? "0 2px 6px rgba(0,0,0,.3)" : "0 2px 6px rgba(0,0,0,.04)"),
        transform: hover ? "translateY(-3px)" : "none",
        transition: "all 0.2s",
        animationDelay: `${delay}s`,
        animation: "slideup 0.4s ease both"
      }}
    >
      <div>
        <div style={{
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: "0.8px",
          textTransform: "uppercase",
          color: ink4,
          marginBottom: 5
        }}>
          {label}
        </div>
        <div style={{
          fontSize: 26,
          fontWeight: 900,
          color: ink,
          lineHeight: 1,
          letterSpacing: "-1px"
        }}>
          {value}
        </div>
        {sub && (
          <div style={{
            fontSize: 11,
            color: ink4,
            marginTop: 4,
            fontWeight: 500
          }}>
            {sub}
          </div>
        )}
      </div>
      <div style={{
        width: 44,
        height: 44,
        borderRadius: 13,
        background: `${accent}18`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 20
      }}>
        {emoji}
      </div>
    </div>
  );
}