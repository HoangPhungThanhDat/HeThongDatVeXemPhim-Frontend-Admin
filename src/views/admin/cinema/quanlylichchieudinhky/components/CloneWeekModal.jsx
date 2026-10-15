// src/views/admin/quanlylichchieudinhky/components/CloneWeekModal.jsx

import React, { useState } from "react";
import { BASE, getMovie, getCinema } from "../constants";
import { SectionTitle } from "./shared/SectionTitle";
import { StatusBadge } from "./shared/StatusBadge";
import { Btn } from "./mini/Btn";
import { FInput } from "./mini/FInput";

export const CloneWeekModal = ({ schedules, movies = [], onClose, onClone }) => {
  const [targetDate, setTargetDate] = useState("");
  const [selectedIds, setSelectedIds] = useState(
    schedules.filter(s => s.Status === "Active").map(s => s.ScheduleId || s.id)
  );

  const handleClone = () => {
    if (!targetDate) {
      alert("Vui lòng chọn ngày bắt đầu tuần đích!");
      return;
    }
    onClone(selectedIds, targetDate);
    onClose();
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(15,15,26,.65)",
      backdropFilter: "blur(6px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      animation: "gfadeIn 0.2s ease",
      padding: 16,
    }}>
      <div style={{
        background: "#ffffff",
        borderRadius: 22,
        width: "100%",
        maxWidth: 540,
        maxHeight: "88vh",
        overflowY: "auto",
        boxShadow: "0 30px 80px rgba(0,0,0,.30)",
        animation: "gscaleIn 0.25s ease",
      }}>
        <div style={{
          padding: "22px 24px 18px",
          borderBottom: "1px solid #f3f4f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 900, color: "#111827", letterSpacing: "-0.3px" }}>
              📋 Nhân bản lịch tuần
            </div>
            <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 3 }}>
              Sao chép lịch tuần hiện tại sang tuần mới
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 34,
            height: 34,
            borderRadius: 9,
            border: "1.5px solid #d1d5db",
            background: "#f3f4f6",
            cursor: "pointer",
            fontSize: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            ✕
          </button>
        </div>

        <div style={{ padding: 24 }}>
          <SectionTitle label="Chọn tuần đích" />
          <div style={{ marginBottom: 16 }}>
            <FInput label="Ngày bắt đầu tuần mới *" type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} />
          </div>

          <SectionTitle label="Chọn lịch chiếu để nhân bản" />
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
            {schedules.map(s => {
              const id = s.ScheduleId || s.id;
              const checked = selectedIds.includes(id);
              const mv = getMovie(s.MovieId, movies);
              const cinema = getCinema(s.cinemaId);
              const daysCount = s.DaysOfWeek?.length || 0;
              const timesCount = s.times?.length || 1;
              return (
                <label key={id} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "11px 14px",
                  borderRadius: 11,
                  cursor: "pointer",
                  background: checked ? BASE.or3 : "#f3f4f6",
                  border: `1.5px solid ${checked ? BASE.or4 : "#d1d5db"}`,
                  transition: "all 0.15s",
                }}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => setSelectedIds(p => checked ? p.filter(i => i !== id) : [...p, id])}
                    style={{ accentColor: BASE.or1, width: 15, height: 15 }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#111827",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}>
                      {mv?.Title || "Không tìm thấy phim"}
                    </div>
                    <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>
                      {cinema?.name || "Chưa có rạp"} · {daysCount} ngày · {timesCount} suất
                    </div>
                  </div>
                  <StatusBadge status={s.Status} />
                </label>
              );
            })}
          </div>

          <div style={{
            padding: "12px 16px",
            borderRadius: 10,
            background: BASE.amberBg,
            border: `1px solid ${BASE.amberBdr}`,
            marginBottom: 16,
          }}>
            <div style={{ fontSize: 12, color: BASE.amber, fontWeight: 600 }}>
              ⚡ Sẽ tạo bản sao cho {selectedIds.length} lịch chiếu sang tuần mới bắt đầu từ ngày {targetDate || "(chưa chọn)"}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={onClose}>Hủy</Btn>
            <Btn variant="primary" icon="📋" onClick={handleClone}>
              Nhân bản ({selectedIds.length} lịch)
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
};