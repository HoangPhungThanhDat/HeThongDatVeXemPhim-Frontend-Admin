// src/views/admin/quanlylichchieudinhky/components/shared/SectionTitle.jsx

import React from "react";
import { BASE } from "../../constants";

export const SectionTitle = ({ label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 18 }}>
    <div style={{ width: 3, height: 16, borderRadius: 2, background: `linear-gradient(180deg,${BASE.or1},#fbbf24)` }} />
    <span style={{ fontSize: 10.5, fontWeight: 900, letterSpacing: "1.4px", textTransform: "uppercase", color: "#374151" }}>
      {label}
    </span>
  </div>
);