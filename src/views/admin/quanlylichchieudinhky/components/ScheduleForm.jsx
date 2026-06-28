// src/views/admin/quanlylichchieudinhky/components/ScheduleForm.jsx

import React, { useState, useEffect } from "react";
import { 
  DAYS_FULL, DAYS_VI, ALL_TIMES, 
  DAYS_OPTIONS_VI, REVERSE_DAYS_MAP,
  timeTier, tierColor, tierBg, tierBdr, fmt 
} from "../constants";
import { SectionTitle } from "./shared/SectionTitle";
import { Btn } from "./mini/Btn";
import { FInput } from "./mini/FInput";
import { FSelect } from "./mini/FSelect";
import { Panel } from "./mini/Panel";
import { DayBtn } from "./mini/DayBtn";
import { TimeBubble } from "./mini/TimeBubble";

export const ScheduleForm = ({ 
  schedule, 
  onCancel, 
  onSave, 
  isAdd,
  movies,
  rooms,
  getMovieTitle,
  getRoomName 
}) => {
  const [form, setForm] = useState({
    movieId: "",
    roomId: "",
    days: [],
    times: ["10:00", "14:30", "19:00"],
    priceBase: 80000,
    startDate: "",
    endDate: "",
    startTime: "08:00",
    endTime: "22:00",
    status: "Active",
    notes: "",
  });

  // Load data khi edit
  useEffect(() => {
    if (schedule) {
      const daysVI = Array.isArray(schedule.DaysOfWeek) 
        ? schedule.DaysOfWeek.map(d => REVERSE_DAYS_MAP[d] || d)
        : [];
      
      const startTime = schedule.StartTime?.slice(0, 5) || "08:00";
      const endTime = schedule.EndTime?.slice(0, 5) || "22:00";
      const startDate = schedule.StartDate?.split('T')[0] || schedule.StartDate || "";
      const endDate = schedule.EndDate?.split('T')[0] || schedule.EndDate || "";

      setForm({
        movieId: schedule.MovieId || "",
        roomId: schedule.RoomId || "",
        days: daysVI,
        times: [startTime, endTime],
        priceBase: Number(schedule.Price) || 0,
        startDate: startDate,
        endDate: endDate,
        startTime: startTime,
        endTime: endTime,
        status: schedule.Status || "Active",
        notes: schedule.Notes || "",
      });
    }
  }, [schedule]);

  const s = k => v => setForm(f => ({ ...f, [k]: v }));
  const toggleDay = d => s("days")(form.days.includes(d) ? form.days.filter(x => x !== d) : [...form.days, d].sort());
  const toggleTime = t => s("times")(form.times.includes(t) ? form.times.filter(x => x !== t) : [...form.times, t].sort());
  
  const totalSlots = form.days.length * form.times.length;
  const movieTitle = form.movieId ? getMovieTitle(form.movieId) : "Chưa chọn phim";

  const handleSubmit = () => {
    const payload = {
      ...form,
      movieId: Number(form.movieId),
      roomId: Number(form.roomId),
      priceBase: Number(form.priceBase),
    };
    onSave(payload);
  };

  return (
    <div style={{ animation: "gscaleIn 0.3s ease both", paddingTop: "80px", paddingBottom: "100px" }}>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        marginBottom: 24,
        flexWrap: "wrap",
        position: "sticky",
        top: 0,
        background: "#f5f4f1",
        zIndex: 10,
        padding: "12px 0",
        marginTop: "-12px",
      }}>
        <Btn variant="ghost" icon="←" onClick={onCancel}>Quay lại</Btn>
        <div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#111827", letterSpacing: "-0.5px" }}>
            {isAdd ? "🗓 Tạo lịch chiếu định kỳ" : "✏️ Chỉnh sửa lịch chiếu"}
          </div>
          <div style={{ fontSize: 12.5, color: "#9ca3af", marginTop: 3 }}>
            {isAdd ? "Thiết lập lịch chiếu lặp lại theo tuần" : "Cập nhật thông tin lịch chiếu"}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 300px", gap: 18, alignItems: "start" }} className="resp-form-grid">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Movie & Location */}
          <Panel>
            <SectionTitle label="Phim & Địa điểm" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }} className="resp-grid-2">
              <FSelect label="Phim *" value={form.movieId} onChange={e => s("movieId")(e.target.value)}>
                <option value="">-- Chọn phim --</option>
                {movies.map(m => (
                  <option key={m.MovieId} value={m.MovieId}>{m.Title}</option>
                ))}
              </FSelect>
              <FSelect label="Phòng chiếu *" value={form.roomId} onChange={e => s("roomId")(e.target.value)}>
                <option value="">-- Chọn phòng --</option>
                {rooms.map(r => (
                  <option key={r.RoomId} value={r.RoomId}>{r.Name}</option>
                ))}
              </FSelect>
            </div>
          </Panel>

          {/* Days */}
          <Panel>
            <SectionTitle label="Ngày chiếu trong tuần" />
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
              {DAYS_OPTIONS_VI.map((d, idx) => (
                <DayBtn 
                  key={d} 
                  day={idx + 1} 
                  active={form.days.includes(d)} 
                  onClick={() => toggleDay(d)} 
                />
              ))}
            </div>
            {form.days.length > 0 && (
              <div style={{
                padding: "9px 13px",
                borderRadius: 9,
                background: "#fff3e8",
                border: "1px solid #fed7aa",
                fontSize: 12,
                fontWeight: 600,
                color: "#ea6c0a",
              }}>
                📅 {form.days.length} ngày/tuần: {form.days.join(", ")}
              </div>
            )}
          </Panel>

          {/* Times */}
          <Panel>
            <SectionTitle label="Suất chiếu trong ngày" />
            {["sáng", "chiều", "tối"].map(tier => {
              const label = {
                sáng: "🌅 Buổi sáng (trước 12:00)",
                chiều: "☀️ Buổi chiều (12:00–17:59)",
                tối: "🌙 Buổi tối (18:00–22:30)",
              }[tier];
              const col = { sáng: "#d97706", chiều: "#f97316", tối: "#7c3aed" }[tier];
              const times = ALL_TIMES.filter(t => timeTier(t) === tier);
              return (
                <div key={tier} style={{ marginBottom: 14 }}>
                  <div style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: col,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    marginBottom: 8,
                  }}>
                    {label}
                  </div>
                  <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                    {times.map(t => (
                      <TimeBubble key={t} time={t} active={form.times.includes(t)} onClick={() => toggleTime(t)} />
                    ))}
                  </div>
                </div>
              );
            })}
            {form.times.length > 0 && (
              <div style={{
                padding: "9px 13px",
                borderRadius: 9,
                background: "#ecfdf5",
                border: "1px solid #a7f3d0",
                fontSize: 12,
                fontWeight: 600,
                color: "#059669",
              }}>
                🕐 {form.times.length} suất/ngày: {form.times.join(" · ")}
              </div>
            )}
          </Panel>

          {/* Price */}
          <Panel>
            <SectionTitle label="Cài đặt giá vé" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }} className="resp-grid-2">
              <FInput label="Giá vé (đ) *" type="number" step="5000" value={form.priceBase} onChange={e => s("priceBase")(parseInt(e.target.value) || 0)} />
            </div>
          </Panel>

          {/* Validity */}
          <Panel>
            <SectionTitle label="Thời gian hiệu lực & Trạng thái" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 14 }} className="resp-grid-3">
              <FInput label="Ngày bắt đầu *" type="date" value={form.startDate} onChange={e => s("startDate")(e.target.value)} />
              <FInput label="Ngày kết thúc *" type="date" value={form.endDate} onChange={e => s("endDate")(e.target.value)} />
              <FSelect label="Trạng thái" value={form.status} onChange={e => s("status")(e.target.value)}>
                <option value="Active">Đang hoạt động</option>
                <option value="Inactive">Tạm dừng</option>
              </FSelect>
            </div>
          </Panel>
        </div>

        {/* Preview */}
        <div style={{ position: "sticky", top: 80, display: "flex", flexDirection: "column", gap: 14 }} className="resp-hide-preview">
          <Panel>
            <SectionTitle label="Xem trước" />
            <div style={{
              padding: "14px",
              borderRadius: 12,
              background: "#1a1a2e",
              marginBottom: 14,
              display: "flex",
              gap: 12,
              alignItems: "center",
            }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: `#f9731630`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                flexShrink: 0,
              }}>
                🎬
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", lineHeight: 1.3, marginBottom: 4 }}>
                  {movieTitle}
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>ID: {schedule?.ScheduleId || "Mới"}</div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
              {[
                ["Ngày/tuần", form.days.length + " ngày", "#2563eb"],
                ["Suất/ngày", form.times.length + " suất", "#059669"],
                ["Tổng/tuần", totalSlots + " suất", "#f97316"],
                ["Phòng", form.roomId ? getRoomName(form.roomId) : "Chưa chọn", "#7c3aed"],
              ].map(([l, v, c]) => (
                <div key={l} style={{
                  padding: "10px 12px",
                  borderRadius: 10,
                  background: `${c}10`,
                  border: `1px solid ${c}25`,
                }}>
                  <div style={{
                    fontSize: 9.5,
                    fontWeight: 700,
                    color: "#9ca3af",
                    textTransform: "uppercase",
                    letterSpacing: 0.8,
                    marginBottom: 3,
                  }}>
                    {l}
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 900, color: c }}>{v}</div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 7 }}>
                Ngày chiếu
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                {DAYS_OPTIONS_VI.map((d, idx) => (
                  <div key={d} style={{
                    flex: 1,
                    height: 26,
                    borderRadius: 7,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 9.5,
                    fontWeight: 800,
                    background: form.days.includes(d) ? "#f97316" : "#f3f4f6",
                    color: form.days.includes(d) ? "#fff" : "#9ca3af",
                  }}>
                    {DAYS_VI[idx + 1]}
                  </div>
                ))}
              </div>
            </div>

            {form.times.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 7 }}>
                  Suất chiếu
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {form.times.map(t => (
                    <div key={t} style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "5px 10px",
                      borderRadius: 7,
                      background: tierBg(t),
                      border: `1px solid ${tierBdr(t)}`,
                    }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: tierColor(t) }}>{t}</span>
                      <span style={{ fontSize: 10, color: "#9ca3af", textTransform: "capitalize" }}>
                        Buổi {timeTier(t)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{
              padding: "12px 14px",
              borderRadius: 11,
              background: "#fff3e8",
              border: "1px solid #fed7aa",
            }}>
              <div style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#ea6c0a",
                textTransform: "uppercase",
                letterSpacing: 0.8,
                marginBottom: 7,
              }}>
                Giá vé
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 10.5, color: "#ea6c0a" }}>Giá vé</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: "#f97316" }}>{fmt(form.priceBase)}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 10.5, color: "#ea6c0a" }}>Trạng thái</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: form.status === "Active" ? "#059669" : "#d97706" }}>
                    {form.status === "Active" ? "✅ Hoạt động" : "⏸ Tạm dừng"}
                  </div>
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </div>

      {/* Footer Actions */}
      <div style={{
        marginTop: 18,
        padding: "16px 22px",
        background: "#ffffff",
        borderRadius: 14,
        border: "1px solid #f3f4f6",
        boxShadow: "0 -2px 10px rgba(0,0,0,.05)",
        display: "flex",
        justifyContent: "flex-end",
        gap: 10,
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: "#ffffff",
      }}>
        <Btn variant="ghost" icon="✕" onClick={onCancel}>Hủy bỏ</Btn>
        <Btn variant="primary" icon="✓" onClick={handleSubmit}>
          {isAdd ? "🗓 Tạo lịch chiếu" : "💾 Lưu thay đổi"}
        </Btn>
      </div>
    </div>
  );
};