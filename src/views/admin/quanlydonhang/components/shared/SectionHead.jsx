// components/shared/SectionHead.jsx
import React from "react";
import { C } from "../../constants";

export default function SectionHead({ label, G }) {
  const color = G ? G.ink3 : C.ink3;
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 14
    }}>
      <div style={{
        width: 3,
        height: 14,
        borderRadius: 2,
        background: `linear-gradient(180deg,${C.or1},#fbbf24)`,
        flexShrink: 0
      }} />
      <span style={{
        fontSize: 10.5,
        fontWeight: 900,
        letterSpacing: "1.2px",
        textTransform: "uppercase",
        color
      }}>
        {label}
      </span>
    </div>
  );
}