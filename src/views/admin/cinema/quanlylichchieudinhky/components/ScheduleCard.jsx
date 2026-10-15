// src/views/admin/quanlylichchieudinhky/components/ScheduleCard.jsx

import React, { useState } from "react";
import { DAYS_VI, DAYS_FULL, REVERSE_DAYS_MAP, timeTier, tierBg, tierColor, tierBdr, fmt } from "../constants";
import { StatusBadge } from "./shared/StatusBadge";
import { Btn } from "./mini/Btn";
import { Pill } from "./mini/Pill";

export const ScheduleCard = ({ 
  sch, 
  index, 
  onView, 
  onEdit, 
  onClone, 
  onToggle, 
  onDelete,
  getMovieTitle, 
  getRoomName 
}) => {
  const [h, setH] = useState(false);
  
  const daysOfWeek = Array.isArray(sch.DaysOfWeek) ? sch.DaysOfWeek : [];
  const daysVI = daysOfWeek.map(d => REVERSE_DAYS_MAP[d] || d);
  const dayIndices = daysVI.map(d => {
    const map = { "Chủ nhật": 0, "Thứ 2": 1, "Thứ 3": 2, "Thứ 4": 3, "Thứ 5": 4, "Thứ 6": 5, "Thứ 7": 6 };
    return map[d] !== undefined ? map[d] : 0;
  });

  const times = sch.StartTime && sch.EndTime ? [sch.StartTime.slice(0,5), sch.EndTime.slice(0,5)] : [];
  const totalSlots = daysOfWeek.length * (times.length || 1);

  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: "#ffffff",
        borderRadius: 16,
        border: h ? `1.5px solid #f97316` : `1.5px solid #f3f4f6`,
        boxShadow: h ? `0 6px 28px rgba(249,115,22,.10)` : "0 2px 8px rgba(0,0,0,.05)",
        transition: "all 0.2s",
        overflow: "hidden",
        animation: `gfadeUp 0.38s ease ${index * 0.06}s both`,
      }}
    >
      <div style={{
        height: 3,
        background: h ? `linear-gradient(90deg,#f97316,#fbbf24)` : `linear-gradient(90deg,#f9731640,transparent)`,
        transition: "all 0.2s",
      }} />
      
      <div style={{ padding: "18px 22px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flex: "1 1 220px", minWidth: 0 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: `#f9731618`,
              border: `1.5px solid #f9731630`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              flexShrink: 0,
            }}>
              🎬
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#111827", lineHeight: 1.25, marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {getMovieTitle(sch.MovieId)}
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <Pill color="#6b7280" bg="#f3f4f6" border="#d1d5db" size="sm">
                  ID: #{sch.ScheduleId}
                </Pill>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, flex: "1 1 160px", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ padding: "8px 12px", borderRadius: 10, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
              <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: "0.8px", textTransform: "uppercase", color: "#2563eb", marginBottom: 2 }}>Rạp</div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: "#374151" }}>{getRoomName(sch.RoomId)}</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <div style={{ textAlign: "center", padding: "8px 14px", borderRadius: 10, background: "#fff3e8", border: "1px solid #fed7aa" }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#f97316", lineHeight: 1 }}>{totalSlots}</div>
              <div style={{ fontSize: 9.5, fontWeight: 700, color: "#ea6c0a", textTransform: "uppercase", letterSpacing: 0.8, marginTop: 1 }}>suất/tuần</div>
            </div>
            <StatusBadge status={sch.Status} />
          </div>
        </div>

        {/* Content */}
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "stretch", marginBottom: 16 }}>
          {/* Days */}
          <div style={{ flex: "1 1 200px", padding: "12px 14px", borderRadius: 12, background: "#f3f4f6", border: "1px solid #d1d5db" }}>
            <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: "#9ca3af", marginBottom: 9 }}>Ngày chiếu / tuần</div>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {[0, 1, 2, 3, 4, 5, 6].map(d => {
                const active = dayIndices.includes(d);
                const weekend = d === 0 || d === 6;
                return (
                  <div key={d} style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10.5,
                    fontWeight: 800,
                    background: active ? "#f97316" : "#fff",
                    color: active ? "#fff" : weekend ? "#f97316" : "#9ca3af",
                    border: `1.5px solid ${active ? "#f97316" : "#d1d5db"}`,
                    boxShadow: active ? "0 2px 6px rgba(249,115,22,.30)" : "none",
                  }}>
                    {DAYS_VI[d]}
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: 11, color: "#6b7280", marginTop: 8, fontWeight: 500 }}>
              {daysVI.join(" · ") || "Chưa có ngày"}
            </div>
          </div>

          {/* Times */}
          <div style={{ flex: "1 1 200px", padding: "12px 14px", borderRadius: 12, background: "#f3f4f6", border: "1px solid #d1d5db" }}>
            <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: "#9ca3af", marginBottom: 9 }}>Khung giờ chiếu</div>
            {times.length > 0 ? (
              <>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {times.map(t => {
                    const tier = timeTier(t);
                    const col = { sáng: "#d97706", chiều: "#f97316", tối: "#7c3aed" }[tier];
                    return (
                      <span key={t} style={{
                        padding: "4px 10px",
                        borderRadius: 7,
                        fontSize: 12,
                        fontWeight: 700,
                        background: tierBg(t),
                        color: tierColor(t),
                        border: `1px solid ${tierBdr(t)}`,
                      }}>
                        {t}
                      </span>
                    );
                  })}
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                  {["sáng", "chiều", "tối"].map(tier => {
                    const count = times.filter(t => timeTier(t) === tier).length;
                    if (!count) return null;
                    const col = { sáng: "#d97706", chiều: "#f97316", tối: "#7c3aed" }[tier];
                    return <span key={tier} style={{ fontSize: 10, color: col, fontWeight: 600 }}>{count} {tier}</span>;
                  })}
                </div>
              </>
            ) : (
              <div style={{ fontSize: 12, color: "#9ca3af" }}>Chưa có giờ chiếu</div>
            )}
          </div>

          {/* Price & Validity */}
          <div style={{ flex: "1 1 150px", display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ flex: 1, padding: "12px 14px", borderRadius: 12, background: "#fff3e8", border: "1px solid #fed7aa" }}>
              <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: "#ea6c0a", marginBottom: 6 }}>Giá vé</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#f97316", letterSpacing: "-0.5px" }}>{fmt(sch.Price || 0)}</div>
            </div>
            <div style={{ padding: "10px 14px", borderRadius: 12, background: "#f3f4f6", border: "1px solid #d1d5db" }}>
              <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: "#9ca3af", marginBottom: 4 }}>Hiệu lực</div>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: "#374151" }}>{sch.StartDate?.split('T')[0] || sch.StartDate}</div>
              <div style={{ fontSize: 11, color: "#9ca3af" }}>→ {sch.EndDate?.split('T')[0] || sch.EndDate}</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", borderTop: "1px solid #f3f4f6", paddingTop: 14 }}>
          <div style={{ flex: 1, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Btn variant="ghost" size="sm" icon="👁" onClick={() => onView(sch)}>Xem chi tiết</Btn>
            <Btn variant="primary" size="sm" icon="✏️" onClick={() => onEdit(sch)}>Chỉnh sửa</Btn>
            <Btn variant="success" size="sm" icon="📋" onClick={() => onClone(sch)}>Nhân bản</Btn>
            <Btn
              variant={sch.Status === "Active" ? "warn" : "ghost"}
              size="sm"
              icon={sch.Status === "Active" ? "⏸" : "▶"}
              onClick={() => onToggle(sch.ScheduleId, sch.Status)}
            >
              {sch.Status === "Active" ? "Tạm dừng" : "Kích hoạt"}
            </Btn>
            <Btn variant="danger" size="sm" icon="🗑" onClick={() => onDelete(sch.ScheduleId)}>Xóa</Btn>
          </div>
        </div>
      </div>
    </div>
  );
};