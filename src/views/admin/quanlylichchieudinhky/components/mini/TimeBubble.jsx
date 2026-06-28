// src/views/admin/quanlylichchieudinhky/components/mini/TimeBubble.jsx

import React, { useState } from "react";
import { tierColor, tierBg, tierBdr } from "../../constants";

export const TimeBubble = ({ time, active, onClick }) => {
  const [h, setH] = useState(false);
  const col = tierColor(time);
  const bg = active ? col : h ? tierBg(time) : "#fafafa";
  const c = active ? "#fff" : col;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        padding: "5px 11px",
        borderRadius: 8,
        fontSize: 12,
        fontWeight: 700,
        border: `1.5px solid ${active ? col : tierBdr(time)}`,
        background: bg,
        color: c,
        cursor: "pointer",
        transition: "all 0.15s",
        outline: "none",
      }}
    >
      {time}
    </button>
  );
};