// src/views/admin/quanlylichchieudinhky/components/mini/DayBtn.jsx

import React, { useState } from "react";
import { BASE, DAYS_VI } from "../../constants";

export const DayBtn = ({ day, active, onClick }) => {
  const [h, setH] = useState(false);
  const weekend = day === 0 || day === 6;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        width: 38,
        height: 38,
        borderRadius: 10,
        fontSize: 11.5,
        fontWeight: 800,
        cursor: "pointer",
        outline: "none",
        transition: "all 0.15s",
        border: active ? `2px solid ${BASE.or1}` : `1.5px solid #d1d5db`,
        background: active ? BASE.or1 : h ? "#f3f4f6" : "#fafafa",
        color: active ? "#fff" : weekend ? BASE.or1 : "#6b7280",
      }}
    >
      {DAYS_VI[day]}
    </button>
  );
};