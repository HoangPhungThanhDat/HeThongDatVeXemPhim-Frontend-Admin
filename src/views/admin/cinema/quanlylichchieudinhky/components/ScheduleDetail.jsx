// src/views/admin/quanlylichchieudinhky/components/ScheduleDetail.jsx

import React from "react";
import { REVERSE_DAYS_MAP, DAYS_VI, fmt } from "../constants";
import { StatusBadge } from "./shared/StatusBadge";
import { StatCard } from "./shared/StatCard";
import { SectionTitle } from "./shared/SectionTitle";
import { Btn } from "./mini/Btn";
import { Panel } from "./mini/Panel";
import { Pill } from "./mini/Pill";

export const ScheduleDetail = ({ sch, onBack, onEdit, getMovieTitle, getRoomName }) => {
  if (!sch) return null;

  const daysVI = Array.isArray(sch.DaysOfWeek) 
    ? sch.DaysOfWeek.map(d => REVERSE_DAYS_MAP[d] || d)
    : [];
  
  // ✅ Chỉ lấy StartTime và EndTime
  const startTime = sch.StartTime?.slice(0,5) || "--:--";
  const endTime = sch.EndTime?.slice(0,5) || "--:--";
  
  const dayIndices = daysVI.map(d => {
    const map = { "Chủ nhật": 0, "Thứ 2": 1, "Thứ 3": 2, "Thứ 4": 3, "Thứ 5": 4, "Thứ 6": 5, "Thứ 7": 6 };
    return map[d] !== undefined ? map[d] : 0;
  });

  const movieTitle = getMovieTitle(sch.MovieId);
  const roomName = getRoomName(sch.RoomId);

  return (
    <div style={{ animation: "gfadeIn 0.3s ease", paddingTop: "80px", paddingBottom: "100px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22, gap: 12, flexWrap: "wrap", position: "sticky", top: 0, background: "#f5f4f1", zIndex: 10, padding: "12px 0", marginTop: "-12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Btn variant="ghost" icon="←" onClick={onBack}>Quay lại</Btn>
          <div>
            <div style={{ fontSize: 19, fontWeight: 900, color: "#111827", letterSpacing: "-0.4px" }}>Chi tiết lịch #{sch.ScheduleId}</div>
            <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{movieTitle}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <StatusBadge status={sch.Status} />
          <Btn variant="primary" icon="✏️" onClick={onEdit}>Chỉnh sửa</Btn>
        </div>
      </div>

      {/* Hero Banner */}
      <div style={{ background: "#1a1a2e", borderRadius: 20, padding: "28px 32px", marginBottom: 18, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,#f97316,#fbbf24,#f97316)` }} />
        <div style={{ display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap", position: "relative" }}>
          <div style={{ width: 68, height: 68, borderRadius: 18, background: `#f9731625`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, flexShrink: 0 }}></div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: "#fff", letterSpacing: "-0.5px", marginBottom: 8 }}>{movieTitle}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Pill color="#94a3b8" bg="rgba(255,255,255,.08)" border="rgba(255,255,255,.12)" size="sm">🏢 {roomName}</Pill>
              <Pill color="#94a3b8" bg="rgba(255,255,255,.08)" border="rgba(255,255,255,.12)" size="sm">ID: #{sch.ScheduleId}</Pill>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 18 }} className="resp-grid-4">
        <StatCard label="Ngày / tuần" value={sch.DaysOfWeek?.length || 0} emoji="📅" accent="#2563eb" sub="ngày hoạt động" />
        <StatCard label="Khung giờ" value={`${startTime} - ${endTime}`} emoji="🕐" accent="#059669" sub="hoạt động" />
        <StatCard label="Giá vé" value={fmt(sch.Price || 0)} emoji="💰" accent="#f97316" />
        <StatCard label="Trạng thái" value={sch.Status === "Active" ? "Hoạt động" : "Tạm dừng"} emoji={sch.Status === "Active" ? "✅" : "⏸"} accent={sch.Status === "Active" ? "#059669" : "#d97706"} />
      </div>

      {/* Detail Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 300px", gap: 16 }} className="resp-grid-detail">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          
          {/* Lịch chiếu dạng lưới (Chỉ hiển thị ngày nào có chiếu) */}
          <Panel>
            <SectionTitle label="Lịch chiếu trong tuần" />
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 550 }}>
                <thead>
                  <tr>
                    <th style={{ padding: "8px 10px", textAlign: "left", fontSize: 10, fontWeight: 800, color: "#9ca3af", textTransform: "uppercase" }}>Khung giờ</th>
                    {[0, 1, 2, 3, 4, 5, 6].map(d => (
                      <th key={d} style={{ padding: "8px 6px", textAlign: "center", fontSize: 11, fontWeight: 900, color: dayIndices.includes(d) ? "#f97316" : "#9ca3af", background: dayIndices.includes(d) ? "#fff3e8" : "transparent" }}>
                        {DAYS_VI[d]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: "12px 10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <div style={{ width: 6, height: 6, borderRadius: 2, background: "#f97316" }} />
                        <span style={{ fontSize: 14, fontWeight: 800, color: "#f97316" }}>{startTime} - {endTime}</span>
                      </div>
                    </td>
                    {[0, 1, 2, 3, 4, 5, 6].map(d => (
                      <td key={d} style={{ padding: "12px 6px", textAlign: "center" }}>
                        {dayIndices.includes(d) ? (
                          <div style={{ width: "100%", padding: "8px 4px", background: "#fff3e8", border: `1px solid #fed7aa`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span style={{ fontSize: 14, color: "#f97316", fontWeight: 700 }}>Hoạt động</span>
                          </div>
                        ) : (
                          <span style={{ fontSize: 14, color: "#d1d5db" }}>—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
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
              <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "9px 0", borderBottom: "1px solid #f3f4f6" }}>
                <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 600, flexShrink: 0 }}>{l}</span>
                <span style={{ fontSize: 12.5, color: "#111827", fontWeight: 700, textAlign: "right", maxWidth: 160, lineHeight: 1.3 }}>{v}</span>
              </div>
            ))}
            <div style={{ marginTop: 12 }}><StatusBadge status={sch.Status} /></div>
          </Panel>
        </div>
      </div>
    </div>
  );
};