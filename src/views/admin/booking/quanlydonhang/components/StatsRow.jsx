// components/StatsRow.jsx
import React from "react";
import Stat from "./shared/Stat";
import { C } from "../constants";

export default function StatsRow({ stats, filteredCount, G }) {
  return (
    <div className="stats-grid" style={{
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: 10,
      marginBottom: 18
    }}>
      <Stat
        label="Tổng đơn"
        value={stats.total}
        emoji="🧾"
        accent={C.or1}
        sub={`${filteredCount} hiển thị`}
        delay={0}
        G={G}
      />
      <Stat
        label="Đã thanh toán"
        value={stats.paid}
        emoji="✅"
        accent={C.green}
        sub="bao gồm check-in"
        delay={0.05}
        G={G}
      />
      <Stat
        label="Yêu cầu hoàn"
        value={stats.refund}
        emoji="🔄"
        accent={C.violet}
        sub="chờ xử lý"
        delay={0.1}
        G={G}
      />
      <Stat
        label="Doanh thu"
        value={stats.revenue}
        emoji="💰"
        accent={C.amber}
        sub="đơn thành công"
        delay={0.15}
        G={G}
      />
    </div>
  );
}