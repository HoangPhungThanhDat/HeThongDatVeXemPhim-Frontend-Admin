// components/shared/Panel.jsx
import React from "react";
import { C } from "../../constants";

export default function Panel({ children, style: sx, G }) {
  const bg = G ? G.bgCard : C.bgCard;
  const border = G ? G.ink6 : C.ink6;
  return (
    <div style={{
      background: bg,
      borderRadius: 16,
      border: `1px solid ${border}`,
      boxShadow: G ? "0 2px 8px rgba(0,0,0,.3)" : "0 2px 8px rgba(0,0,0,.05)",
      padding: 20,
      ...sx
    }}>
      {children}
    </div>
  );
}