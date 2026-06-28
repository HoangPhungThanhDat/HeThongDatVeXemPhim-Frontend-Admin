// src/views/admin/quanlylichchieudinhky/components/ScheduleDetail.jsx

import React from "react";
import { REVERSE_DAYS_MAP, DAYS_VI, timeTier, tierColor, tierBg, tierBdr, fmt } from "../constants";
import { StatusBadge } from "./shared/StatusBadge";
import { StatCard } from "./shared/StatCard";
import { SectionTitle } from "./shared/SectionTitle";
import { Btn } from "./mini/Btn";
import { Panel } from "./mini/Panel";
import { Pill } from "./mini/Pill";

export const ScheduleDetail = ({ sch, onBack, onEdit, getMovieTitle, getRoomName }) => {
  const daysVI = Array.isArray(sch.DaysOfWeek) 
    ? sch.DaysOfWeek.map(d => REVERSE_DAYS_MAP[d] || d)
    : [];
  
  const times = sch.StartTime && sch.EndTime 
    ? [sch.StartTime.slice(0,5), sch.EndTime.slice(0,5)]
    : [];
  
  const dayIndices = daysVI.map(d => {
    const map = { "Chủ nhật": 0, "Thứ 2": 1, "Thứ 3": 2, "Thứ 4": 3, "Thứ 5": 4, "Thứ 6": 5, "Thứ 7": 6 };
    return map[d] !== undefined ? map[d] : 0;
  });

  const totalSlots = (sch.DaysOfWeek?.length || 0) * (times.length || 1);
  const movieTitle = getMovieTitle(sch.MovieId);
  const roomName = getRoomName(sch.RoomId);

  return (
    <div style={{ animation: "gfadeIn 0.3s ease", paddingTop: "80px", paddingBottom: "100px" }}>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 22,
        gap: 12,
        flexWrap: "wrap",
        position: "sticky",
        top: 0,
        background: "#f5f4f1",
        zIndex: 10,
        padding: "12px 0",
        marginTop: "-12px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Btn variant="ghost" icon="←" onClick={onBack}>Quay lại</Btn>
          <div>
            <div style={{ fontSize: 19, fontWeight: 900, color: "#111827", letterSpacing: "-0.4px" }}>
              Chi tiết lịch #{sch.ScheduleId}
            </div>
            <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{movieTitle}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <StatusBadge status={sch.Status} />
          <Btn variant="primary" icon="✏️" onClick={onEdit}>Chỉnh sửa</Btn>
        </div>
      </div>

      {/* Hero Banner */}
      <div style={{
        background: "#1a1a2e",
        borderRadius: 20,
        padding: "28px 32px",
        marginBottom: 18,
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg,#f97316,#fbbf24,#f97316)`,
          backgroundSize: "200% 100%",
          animation: "gshimmer 3s linear infinite",
        }} />
        <div style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: `#f9731612`,
          transform: "translate(50%,-50%)",
        }} />
        <div style={{ display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap", position: "relative" }}>
          <div style={{
            width: 68,
            height: 68,
            borderRadius: 18,
            background: `#f9731625`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            flexShrink: 0,
          }}>
            🎬
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: "#fff", letterSpacing: "-0.5px", marginBottom: 8 }}>
              {movieTitle}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Pill color="#94a3b8" bg="rgba(255,255,255,.08)" border="rgba(255,255,255,.12)" size="sm">
                🏢 {roomName}
              </Pill>
              <Pill color="#94a3b8" bg="rgba(255,255,255,.08)" border="rgba(255,255,255,.12)" size="sm">
                ID: #{sch.ScheduleId}
              </Pill>
            </div>
          </div>
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
              Tổng suất / tuần
            </div>
            <div style={{ fontSize: 44, fontWeight: 900, color: "#f97316", lineHeight: 1 }}>{totalSlots}</div>
            <div style={{ fontSize: 12, color: "#64748b" }}>suất chiếu</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 18 }} className="resp-grid-4">
        <StatCard label="Ngày / tuần" value={sch.DaysOfWeek?.length || 0} emoji="📅" accent="#2563eb" sub={daysVI.join(", ") || "Chưa có"} />
        <StatCard label="Suất / ngày" value={times.length} emoji="🕐" accent="#059669" sub={times[0] + " → " + times[times.length - 1]} />
        <StatCard label="Giá vé" value={fmt(sch.Price || 0)} emoji="💰" accent="#f97316" />
        <StatCard label="Trạng thái" value={sch.Status === "Active" ? "Hoạt động" : "Tạm dừng"} emoji={sch.Status === "Active" ? "✅" : "⏸"} accent={sch.Status === "Active" ? "#059669" : "#d97706"} />
      </div>

      {/* Detail Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 300px", gap: 16 }} className="resp-grid-detail">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Schedule Table */}
          <Panel>
            <SectionTitle label="Bảng lịch chiếu trong tuần" />
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 550 }}>
                <thead>
                  <tr>
                    <th style={{ padding: "8px 10px", textAlign: "left", fontSize: 10, fontWeight: 800, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.8 }}>Giờ chiếu</th>
                    {[0, 1, 2, 3, 4, 5, 6].map(d => {
                      const active = dayIndices.includes(d);
                      const w = d === 0 || d === 6;
                      return (
                        <th key={d} style={{
                          padding: "8px 6px",
                          textAlign: "center",
                          fontSize: 11,
                          fontWeight: 900,
                          color: active ? "#f97316" : "#9ca3af",
                          background: active ? "#fff3e8" : "transparent",
                        }}>
                          {DAYS_VI[d]}
                          {w && <div style={{ fontSize: 8.5, color: "#9ca3af" }}>CT</div>}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {times.map(t => (
                    <tr key={t}>
                      <td style={{ padding: "7px 10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                          <div style={{ width: 6, height: 6, borderRadius: 2, background: tierColor(t) }} />
                          <span style={{ fontSize: 13, fontWeight: 800, color: tierColor(t) }}>{t}</span>
                          <span style={{ fontSize: 10.5, color: "#9ca3af", textTransform: "capitalize" }}>({timeTier(t)})</span>
                        </div>
                      </td>
                      {[0, 1, 2, 3, 4, 5, 6].map(d => (
                        <td key={d} style={{ padding: "7px 6px", textAlign: "center" }}>
                          {dayIndices.includes(d) ? (
                            <div style={{
                              width: "100%",
                              padding: "6px 4px",
                              background: tierBg(t),
                              border: `1px solid ${tierBdr(t)}`,
                              borderRadius: 8,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}>
                              <span style={{ fontSize: 13, color: tierColor(t) }}>✓</span>
                            </div>
                          ) : (
                            <span style={{ fontSize: 13, color: "#d1d5db" }}>—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          {/* Price Analysis */}
          <Panel>
            <SectionTitle label="Phân tích giá theo khung giờ" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }} className="resp-grid-3">
              {["sáng", "chiều", "tối"].map(tier => {
                const col = { sáng: "#d97706", chiều: "#f97316", tối: "#7c3aed" }[tier];
                const lbl = { sáng: "🌅 Buổi sáng", chiều: "☀️ Buổi chiều", tối: "🌙 Buổi tối" }[tier];
                const count = times.filter(t => timeTier(t) === tier).length;
                return (
                  <div key={tier} style={{
                    padding: "16px 14px",
                    borderRadius: 12,
                    background: `${col}0a`,
                    border: `1px solid ${col}28`,
                  }}>
                    <div style={{ fontSize: 11.5, fontWeight: 800, color: col, marginBottom: 5 }}>{lbl}</div>
                    <div style={{ fontSize: 26, fontWeight: 900, color: col, lineHeight: 1, marginBottom: 8 }}>{count}</div>
                    <div style={{ fontSize: 10, color: "#9ca3af", marginBottom: 4, fontWeight: 600 }}>suất chiếu</div>
                    <div style={{ height: 1, background: `${col}25`, marginBottom: 8 }} />
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>{fmt(sch.Price || 0)}</div>
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Panel>
            <SectionTitle label="Thông tin chung" />
            {[
              ["Phim", movieTitle],
              ["Phòng chiếu", roomName],
              ["Bắt đầu", sch.StartDate?.split('T')[0] || sch.StartDate],
              ["Kết thúc", sch.EndDate?.split('T')[0] || sch.EndDate],
              ["Giá vé", fmt(sch.Price || 0)],
            ].map(([l, v]) => (
              <div key={l} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                padding: "9px 0",
                borderBottom: "1px solid #f3f4f6",
              }}>
                <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 600, flexShrink: 0 }}>{l}</span>
                <span style={{ fontSize: 12.5, color: "#111827", fontWeight: 700, textAlign: "right", maxWidth: 160, lineHeight: 1.3 }}>
                  {v}
                </span>
              </div>
            ))}
            <div style={{ marginTop: 12 }}><StatusBadge status={sch.Status} /></div>
          </Panel>

          <Panel>
            <SectionTitle label="Thao tác nhanh" />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Btn variant="primary" icon="📋" full>Nhân bản lịch tuần này</Btn>
              <Btn variant="ghost" icon="📊" full>Xem thống kê vé</Btn>
              <Btn variant="warn" icon="💰" full>Chỉnh giá hàng loạt</Btn>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
};