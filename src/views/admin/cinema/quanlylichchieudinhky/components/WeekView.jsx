// src/views/admin/quanlylichchieudinhky/components/WeekView.jsx

import React from "react";
import { DAYS_VI } from "../constants";
import { SectionTitle } from "./shared/SectionTitle";
import { Panel } from "./mini/Panel";

export const WeekView = ({ schedules = [], movies = [] }) => {
  const getDaysOfWeek = (schedule) => {
    if (!schedule.DaysOfWeek) return [];
    if (Array.isArray(schedule.DaysOfWeek)) return schedule.DaysOfWeek;
    if (typeof schedule.DaysOfWeek === 'string') {
      try { return JSON.parse(schedule.DaysOfWeek); } 
      catch { return schedule.DaysOfWeek.split(',').map(d => d.trim()); }
    }
    return [];
  };

  const dayToIndex = {
    "Mon": 1, "Tue": 2, "Wed": 3, "Thu": 4, "Fri": 5, "Sat": 6, "Sun": 0
  };

  return (
    <Panel style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ padding: "16px 22px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <SectionTitle label="Lịch chiếu theo tuần" />
      </div>

      <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        <div style={{ minWidth: 700 }}>
          {/* Header */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: "1px solid #f3f4f6" }}>
            {[0, 1, 2, 3, 4, 5, 6].map(d => {
              const w = d === 0 || d === 6;
              return (
                <div key={d} style={{ padding: "12px 4px", textAlign: "center", background: w ? "#fff3e8" : "#f3f4f6", borderLeft: d > 0 ? "1px solid #d1d5db" : "none" }}>
                  <div style={{ fontSize: 13, fontWeight: 900, color: w ? "#f97316" : "#6b7280", letterSpacing: 1 }}>{DAYS_VI[d]}</div>
                  <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 2 }}>{w ? "Cuối tuần" : "Trong tuần"}</div>
                </div>
              );
            })}
          </div>

          {/* Rows */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", minHeight: 200 }}>
            {[0, 1, 2, 3, 4, 5, 6].map(day => {
              const items = [];
              
              schedules.forEach(s => {
                const days = getDaysOfWeek(s);
                const dayIndices = days.map(d => dayToIndex[d]).filter(d => d !== undefined);
                
                if (dayIndices.includes(day)) {
                  // ✅ Ép kiểu Number để tìm phim chuẩn xác
                  const movieIdToFind = Number(s.MovieId);
                  const mv = movies.find(m => Number(m.MovieId) === movieIdToFind);
                  
                  const startTime = s.StartTime?.slice(0, 5) || "08:00";
                  const endTime = s.EndTime?.slice(0, 5) || "22:00";
                  
                  items.push({ 
                    id: s.ScheduleId,
                    startTime, 
                    endTime, 
                    movieTitle: mv?.Title || `Phim #${s.MovieId}`,
                    status: s.Status
                  });
                }
              });
              
              const w = day === 0 || day === 6;
              
              return (
                <div key={day} style={{ padding: "8px 6px", borderLeft: day > 0 ? "1px solid #f3f4f6" : "none", background: w ? "rgba(249,115,22,.02)" : "transparent", display: "flex", flexDirection: "column", gap: 8 }}>
                  {items.length > 0 ? (
                    items.map((it, i) => (
                      <div key={i} style={{ background: it.status === "Active" ? "#fff3e8" : "#f3f4f6", border: `1px solid ${it.status === "Active" ? "#fed7aa" : "#d1d5db"}`, borderLeft: `4px solid ${it.status === "Active" ? "#f97316" : "#9ca3af"}`, borderRadius: 8, padding: "8px 10px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                        <div style={{ fontSize: 12, fontWeight: 800, color: it.status === "Active" ? "#f97316" : "#6b7280", marginBottom: 4 }}>
                          {it.startTime} - {it.endTime}
                        </div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "#374151", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", lineHeight: 1.3 }}>
                          {it.movieTitle}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#d1d5db", fontSize: 12, fontStyle: "italic" }}>
                      Trống
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ padding: "12px 22px", borderTop: "1px solid #f3f4f6", display: "flex", gap: 18, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: "#f97316" }} />
          <span style={{ fontSize: 11, color: "#6b7280", fontWeight: 600 }}>Đang hoạt động</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: "#9ca3af" }} />
          <span style={{ fontSize: 11, color: "#6b7280", fontWeight: 600 }}>Tạm dừng</span>
        </div>
      </div>
    </Panel>
  );
};