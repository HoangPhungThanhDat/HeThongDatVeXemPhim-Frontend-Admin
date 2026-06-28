// src/views/admin/quanlylichchieudinhky/components/BulkEditPriceModal.jsx

import React, { useState } from "react";
import { BASE, getMovie, getCinema } from "../constants";
import { SectionTitle } from "./shared/SectionTitle";
import { StatusBadge } from "./shared/StatusBadge";
import { Btn } from "./mini/Btn";
import { FInput } from "./mini/FInput";

export const BulkEditPriceModal = ({ schedules, movies = [], onClose, onApply }) => {
  const [prices, setPrices] = useState({
    sáng: { base: 60000, wk: 70000 },
    chiều: { base: 80000, wk: 95000 },
    tối: { base: 95000, wk: 115000 },
  });
  const [sel, setSel] = useState(schedules.map(s => s.ScheduleId || s.id));

  const set = (tier, k, v) => setPrices(p => ({
    ...p,
    [tier]: { ...p[tier], [k]: parseInt(v) || 0 },
  }));

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
              💰 Chỉnh giá vé hàng loạt
            </div>
            <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 3 }}>
              Áp dụng giá theo khung giờ cho nhiều lịch chiếu
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
          <SectionTitle label="Giá theo khung giờ" />
          {[
            ["sáng", "🌅 Buổi sáng", BASE.amber],
            ["chiều", "☀️ Buổi chiều", BASE.or1],
            ["tối", "🌙 Buổi tối", BASE.violet],
          ].map(([k, lbl, col]) => (
            <div key={k} style={{
              padding: 14,
              borderRadius: 12,
              marginBottom: 10,
              background: `${col}08`,
              border: `1px solid ${col}25`,
            }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: col, marginBottom: 10 }}>{lbl}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <FInput label="Ngày thường (đ)" type="number" step="5000" value={prices[k].base} onChange={e => set(k, "base", e.target.value)} />
                <FInput label="Cuối tuần (đ)" type="number" step="5000" value={prices[k].wk} onChange={e => set(k, "wk", e.target.value)} />
              </div>
            </div>
          ))}

          <SectionTitle label="Áp dụng cho lịch chiếu" />
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
            {schedules.map(s => {
              const id = s.ScheduleId || s.id;
              const checked = sel.includes(id);
              const mv = getMovie(s.MovieId, movies);
              const cinema = getCinema(s.cinemaId);
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
                    onChange={() => setSel(p => checked ? p.filter(i => i !== id) : [...p, id])}
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
                      {cinema?.name || "Chưa có rạp"} · {s.times?.length || 1} suất/ngày
                    </div>
                  </div>
                  <StatusBadge status={s.Status} />
                </label>
              );
            })}
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={onClose}>Hủy</Btn>
            <Btn variant="primary" icon="✓" onClick={() => { onApply(sel, prices); onClose(); }}>
              Áp dụng ({sel.length} lịch)
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
};