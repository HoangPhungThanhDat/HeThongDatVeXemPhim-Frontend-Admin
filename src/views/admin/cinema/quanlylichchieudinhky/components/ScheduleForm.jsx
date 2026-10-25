// src/views/admin/quanlylichchieudinhky/components/ScheduleForm.jsx

import React, { useState, useEffect } from "react";
import { 
  DAYS_VI, DAYS_OPTIONS_VI, REVERSE_DAYS_MAP, fmt 
} from "../constants";
import { SectionTitle } from "./shared/SectionTitle";
import { Btn } from "./mini/Btn";
import { FInput } from "./mini/FInput";
import { FSelect } from "./mini/FSelect";
import { Panel } from "./mini/Panel";
import { DayBtn } from "./mini/DayBtn";

export const ScheduleForm = ({ 
  schedule, onCancel, onSave, isAdd, movies, rooms, getMovieTitle, getRoomName, isSubmitting 
}) => {
  const [form, setForm] = useState({
    movieId: "",
    roomId: "",
    days: [],
    priceBase: 80000,
    startDate: "",
    endDate: "",
    startTime: "08:00",
    endTime: "22:00",
    status: "Active",
  });

  useEffect(() => {
    if (schedule) {
      const daysVI = Array.isArray(schedule.DaysOfWeek) 
        ? schedule.DaysOfWeek.map(d => REVERSE_DAYS_MAP[d] || d) : [];
      
      setForm({
        movieId: schedule.MovieId || "",
        roomId: schedule.RoomId || "",
        days: daysVI,
        priceBase: Number(schedule.Price) || 0,
        startDate: schedule.StartDate?.split('T')[0] || schedule.StartDate || "",
        endDate: schedule.EndDate?.split('T')[0] || schedule.EndDate || "",
        startTime: schedule.StartTime?.slice(0, 5) || "08:00",
        endTime: schedule.EndTime?.slice(0, 5) || "22:00",
        status: schedule.Status || "Active",
      });
    }
  }, [schedule]);

  const s = k => v => setForm(f => ({ ...f, [k]: v }));
  const toggleDay = d => s("days")(form.days.includes(d) ? form.days.filter(x => x !== d) : [...form.days, d].sort());
  
  const totalSlots = form.days.length; 
  const movieTitle = form.movieId ? getMovieTitle(form.movieId) : "Chưa chọn phim";

  const handleSubmit = () => {
    if (!form.movieId || !form.roomId || form.days.length === 0 || !form.startDate || !form.endDate) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }
    onSave({
      ...form,
      movieId: Number(form.movieId),
      roomId: Number(form.roomId),
      priceBase: Number(form.priceBase),
    });
  };

  return (
    <div style={{ animation: "gscaleIn 0.3s ease both", paddingTop: "80px", paddingBottom: "100px" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 14, marginBottom: 24, flexWrap: "wrap",
        position: "sticky", top: 0, background: "#f5f4f1", zIndex: 10, padding: "12px 0", marginTop: "-12px",
      }}>
        <Btn variant="ghost" icon="←" onClick={onCancel}>Quay lại</Btn>
        <div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#111827", letterSpacing: "-0.5px" }}>
            {isAdd ? "🗓 Tạo lịch chiếu định kỳ" : "✏️ Chỉnh sửa lịch chiếu"}
          </div>
          <div style={{ fontSize: 12.5, color: "#9ca3af", marginTop: 3 }}>
            Thiết lập khung giờ hoạt động của phòng chiếu
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 300px", gap: 18, alignItems: "start" }} className="resp-form-grid">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Panel>
            <SectionTitle label="Phim & Địa điểm" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }} className="resp-grid-2">
              <FSelect label="Phim *" value={form.movieId} onChange={e => s("movieId")(e.target.value)}>
                <option value="">-- Chọn phim --</option>
                {movies.map(m => <option key={m.MovieId} value={m.MovieId}>{m.Title}</option>)}
              </FSelect>
              <FSelect label="Phòng chiếu *" value={form.roomId} onChange={e => s("roomId")(e.target.value)}>
                <option value="">-- Chọn phòng --</option>
                {rooms.map(r => <option key={r.RoomId} value={r.RoomId}>{r.Name}</option>)}
              </FSelect>
            </div>
          </Panel>

          <Panel>
            <SectionTitle label="Ngày chiếu trong tuần" />
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
              {DAYS_OPTIONS_VI.map((d, idx) => (
                <DayBtn key={d} day={idx + 1} active={form.days.includes(d)} onClick={() => toggleDay(d)} />
              ))}
            </div>
            {form.days.length > 0 && (
              <div style={{ padding: "9px 13px", borderRadius: 9, background: "#fff3e8", border: "1px solid #fed7aa", fontSize: 12, fontWeight: 600, color: "#ea6c0a" }}>
                📅 {form.days.length} ngày/tuần: {form.days.join(", ")}
              </div>
            )}
          </Panel>

          <Panel>
            <SectionTitle label="Khung giờ hoạt động" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }} className="resp-grid-2">
              <FInput label="Giờ mở cửa *" type="time" value={form.startTime} onChange={e => s("startTime")(e.target.value)} />
              <FInput label="Giờ đóng cửa *" type="time" value={form.endTime} onChange={e => s("endTime")(e.target.value)} />
            </div>
          </Panel>

          <Panel>
            <SectionTitle label="Cài đặt giá vé" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }} className="resp-grid-2">
              <FInput label="Giá vé (đ) *" type="number" step="5000" value={form.priceBase} onChange={e => s("priceBase")(parseInt(e.target.value) || 0)} />
            </div>
          </Panel>

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
            <div style={{ padding: "14px", borderRadius: 12, background: "#1a1a2e", marginBottom: 14, display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `#f9731630`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", lineHeight: 1.3, marginBottom: 4 }}>{movieTitle}</div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>ID: {schedule?.ScheduleId || "Mới"}</div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
              {[
                ["Ngày/tuần", form.days.length + " ngày", "#2563eb"],
                ["Khung giờ", form.startTime + " - " + form.endTime, "#7c3aed"],
                ["Phòng", form.roomId ? getRoomName(form.roomId) : "Chưa chọn", "#f97316"],
              ].map(([l, v, c]) => (
                <div key={l} style={{ padding: "10px 12px", borderRadius: 10, background: `${c}10`, border: `1px solid ${c}25` }}>
                  <div style={{ fontSize: 9.5, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 3 }}>{l}</div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: c }}>{v}</div>
                </div>
              ))}
            </div>

            <div style={{ padding: "12px 14px", borderRadius: 11, background: "#fff3e8", border: "1px solid #fed7aa" }}>
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

      <div style={{ marginTop: 18, padding: "16px 22px", background: "#ffffff", borderRadius: 14, border: "1px solid #f3f4f6", boxShadow: "0 -2px 10px rgba(0,0,0,.05)", display: "flex", justifyContent: "flex-end", gap: 10, position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100 }}>
        <Btn variant="ghost" icon="✕" onClick={onCancel}>Hủy bỏ</Btn>
        <Btn variant="primary" icon={isSubmitting ? "⏳" : "✓"} onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Đang lưu..." : isAdd ? "🗓 Tạo lịch chiếu" : "💾 Lưu thay đổi"}
        </Btn>
      </div>
    </div>
  );
};