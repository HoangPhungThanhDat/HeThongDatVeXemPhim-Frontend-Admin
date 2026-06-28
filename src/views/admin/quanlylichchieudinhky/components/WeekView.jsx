// src/views/admin/quanlylichchieudinhky/components/WeekView.jsx

import React, { useState } from "react";
import { CINEMAS, DAYS_VI, getMovie, tierColor, tierBg, tierBdr } from "../constants";
import { SectionTitle } from "./shared/SectionTitle";
import { Panel } from "./mini/Panel";

export const WeekView = ({ schedules, movies = [] }) => {
  const [cinema, setCinema] = useState("all");
  const list = cinema === "all" 
    ? schedules 
    : schedules.filter(s => s.cinemaId === parseInt(cinema) || s.RoomId === parseInt(cinema));
  const hours = ["08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22"];

  // Helper để lấy danh sách ngày trong tuần từ schedule
  const getDaysOfWeek = (schedule) => {
    if (!schedule.DaysOfWeek) return [];
    if (Array.isArray(schedule.DaysOfWeek)) return schedule.DaysOfWeek;
    if (typeof schedule.DaysOfWeek === 'string') {
      try {
        return JSON.parse(schedule.DaysOfWeek);
      } catch {
        return schedule.DaysOfWeek.split(',').map(d => d.trim());
      }
    }
    return [];
  };

  // Map ngày tiếng Anh sang index
  const dayToIndex = {
    "Mon": 1, "Tue": 2, "Wed": 3, "Thu": 4, "Fri": 5, "Sat": 6, "Sun": 0
  };

  return (
    <Panel style={{ padding: 0, overflow: "hidden" }}>
      <div style={{
        padding: "16px 22px",
        borderBottom: "1px solid #f3f4f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        flexWrap: "wrap",
      }}>
        <SectionTitle label="Lịch chiếu theo tuần" />
        <select
          value={cinema}
          onChange={e => setCinema(e.target.value)}
          style={{
            height: 34,
            padding: "0 12px",
            borderRadius: 8,
            fontSize: 12.5,
            fontWeight: 600,
            border: "1.5px solid #d1d5db",
            background: "#fafafa",
            color: "#374151",
            cursor: "pointer",
            outline: "none",
          }}
        >
          <option value="all">Tất cả rạp</option>
          {CINEMAS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        <div style={{ minWidth: 700 }}>
          {/* Header */}
          <div style={{ display: "grid", gridTemplateColumns: "56px repeat(7, 1fr)", borderBottom: "1px solid #f3f4f6" }}>
            <div style={{ background: "#f3f4f6" }} />
            {[0, 1, 2, 3, 4, 5, 6].map(d => {
              const w = d === 0 || d === 6;
              return (
                <div key={d} style={{
                  padding: "10px 4px",
                  textAlign: "center",
                  background: w ? "#fff3e8" : "#f3f4f6",
                  borderLeft: "1px solid #d1d5db",
                }}>
                  <div style={{ fontSize: 12, fontWeight: 900, color: w ? "#f97316" : "#6b7280", letterSpacing: 1 }}>
                    {DAYS_VI[d]}
                  </div>
                  <div style={{ fontSize: 9, color: "#9ca3af", marginTop: 2 }}>{w ? "Cuối tuần" : "Thường"}</div>
                </div>
              );
            })}
          </div>

          {/* Rows */}
          {hours.map((hour, hi) => (
            <div key={hour} style={{
              display: "grid",
              gridTemplateColumns: "56px repeat(7, 1fr)",
              borderBottom: "1px solid #f3f4f630",
              minHeight: 54,
              background: hi % 2 === 0 ? "#fafafa" : "#ffffff",
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", paddingRight: 10, paddingTop: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af" }}>{hour}:00</span>
              </div>
              {[0, 1, 2, 3, 4, 5, 6].map(day => {
                const items = [];
                list.forEach(s => {
                  const days = getDaysOfWeek(s);
                  const dayIndices = days.map(d => dayToIndex[d]).filter(d => d !== undefined);
                  if (!dayIndices.includes(day)) return;
                  
                  // Lấy giờ bắt đầu và kết thúc
                  const startTime = s.StartTime?.slice(0, 5) || "08:00";
                  const endTime = s.EndTime?.slice(0, 5) || "22:00";
                  const startHour = parseInt(startTime.split(':')[0]);
                  
                  if (startHour === parseInt(hour)) {
                    const mv = getMovie(s.MovieId, movies);
                    const tier = timeTier(startTime);
                    const col = { sáng: "#d97706", chiều: "#f97316", tối: "#7c3aed" }[tier] || "#d97706";
                    const bg = { sáng: "#fffbeb", chiều: "#fff3e8", tối: "#f5f3ff" }[tier] || "#fffbeb";
                    const bdr = { sáng: "#fde68a", chiều: "#fed7aa", tối: "#ddd6fe" }[tier] || "#fde68a";
                    
                    items.push({ 
                      startTime, 
                      endTime, 
                      mv, 
                      col, 
                      bg, 
                      bdr,
                      title: mv?.Title || s.MovieId
                    });
                  }
                });
                
                const w = day === 0 || day === 6;
                return (
                  <div key={day} style={{
                    padding: "4px 3px",
                    borderLeft: "1px solid #f3f4f630",
                    background: w ? "rgba(249,115,22,.02)" : "transparent",
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                  }}>
                    {items.map((it, i) => (
                      <div key={i} style={{
                        background: it.bg,
                        border: `1px solid ${it.bdr}`,
                        borderLeft: `3px solid ${it.col}`,
                        borderRadius: 6,
                        padding: "3px 6px",
                      }}>
                        <div style={{ fontSize: 10, fontWeight: 800, color: it.col }}>
                          {it.startTime} - {it.endTime}
                        </div>
                        <div style={{
                          fontSize: 9,
                          fontWeight: 600,
                          color: "#6b7280",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                          maxWidth: 90,
                        }}>
                          {it.title?.slice(0, 20) || "Phim"}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{
        padding: "12px 22px",
        borderTop: "1px solid #f3f4f6",
        display: "flex",
        gap: 18,
        flexWrap: "wrap",
      }}>
        {[
          ["🌅 Buổi sáng", "trước 12:00", "#d97706"],
          ["☀️ Buổi chiều", "12:00–17:59", "#f97316"],
          ["🌙 Buổi tối", "18:00–22:30", "#7c3aed"],
        ].map(([l, r, c]) => (
          <div key={l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
            <span style={{ fontSize: 11, color: "#6b7280", fontWeight: 600 }}>
              {l} <span style={{ color: "#9ca3af", fontWeight: 400 }}>({r})</span>
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
};