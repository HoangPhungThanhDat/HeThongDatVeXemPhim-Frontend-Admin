// src/views/admin/quanlylichchieudinhky/index.jsx

import React, { useState } from "react";
import { useColorMode, useColorModeValue } from "@chakra-ui/react";
import { BASE, CINEMAS } from "./constants";
import { useSchedule } from "./hooks/useSchedule";
import { ANIMATIONS } from "./components/shared/animations";
import { StatCard } from "./components/shared/StatCard";
import { Btn } from "./components/mini/Btn";
import { ScheduleList } from "./components/ScheduleList";
import { ScheduleDetail } from "./components/ScheduleDetail";
import { ScheduleForm } from "./components/ScheduleForm";
import { WeekView } from "./components/WeekView";
import { BulkEditPriceModal } from "./components/BulkEditPriceModal";
import { CloneWeekModal } from "./components/CloneWeekModal";
import Loader from "layouts/Loader";

// Màu sắc cho chế độ tối - tông xanh
const DARK_THEME = {
  bg: "#0a1628",
  cardBg: "#0f1f3a",
  border: "#1a3a5c",
  text: "#e8f4f8",
  textSecondary: "#88b4d8",
  labelColor: "#5a8ab5",
  inputBg: "#0a1f35",
  hoverBg: "#142d4f",
  accent: "#4a9eff",
  accentLight: "#6ab0ff",
  accentShadow: "rgba(74, 158, 255, 0.25)",
  gradientFrom: "#4a9eff",
  gradientTo: "#6ab0ff",
};

export default function LichChieuDinhKy() {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";

  // Dark theme colors
  const accentColor = isDark ? DARK_THEME.accent : "#f97316";
  const accentShadow = isDark ? DARK_THEME.accentShadow : "rgba(249,115,22,0.38)";
  const gradientBg = isDark 
    ? `linear-gradient(135deg, ${DARK_THEME.accent}, ${DARK_THEME.accentLight})`
    : `linear-gradient(135deg,${BASE.or1},#fbbf24)`;

  const bg = isDark ? DARK_THEME.bg : "#f5f4f1";
  const ink = isDark ? DARK_THEME.text : "#111827";
  const ink3 = isDark ? DARK_THEME.textSecondary : "#6b7280";
  const ink4 = isDark ? DARK_THEME.labelColor : "#9ca3af";
  const ink5 = isDark ? DARK_THEME.border : "#d1d5db";
  const ink6 = isDark ? DARK_THEME.inputBg : "#f3f4f6";
  const cardBg = isDark ? DARK_THEME.cardBg : "#ffffff";
  const cardBorder = isDark ? DARK_THEME.border : ink6;

  const [view, setView] = useState("list");
  const [sel, setSel] = useState(null);
  const [tab, setTab] = useState("list");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [filterCinema, setFilterCinema] = useState("all");
  const [filterMovie, setFilterMovie] = useState("all");
  const [showBulk, setShowBulk] = useState(false);
  const [showClone, setShowClone] = useState(false);

  const {
    schedules,
    movies,
    rooms,
    loading,
    toast,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    toggleScheduleStatus,
    cloneSchedule,
    getStats,
    getFiltered,
    getScheduleById,
    getMovieTitle,
    getRoomName,
  } = useSchedule();

  const stats = getStats();
  const filtered = getFiltered(filterStatus, filterCinema, filterMovie);

  const handleSave = async (formData) => {
    try {
      if (view === "add") {
        await addSchedule(formData);
      } else {
        await updateSchedule(sel.ScheduleId, formData);
        setSel(null);
      }
      setView("list");
    } catch (error) {
      console.error("Lỗi lưu lịch chiếu:", error);
    }
  };

  const handleDelete = async (id) => {
    const success = await deleteSchedule(id);
    if (success && view === "detail" && sel?.ScheduleId === id) {
      setView("list");
      setSel(null);
    }
  };

  const handleToggle = (id, status) => {
    toggleScheduleStatus(id, status);
  };

  const handleClone = (schedule) => {
    cloneSchedule(schedule);
  };

  const STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
    * { box-sizing: border-box; margin:0; padding:0; }
    body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; background: ${bg}; }
    ${ANIMATIONS}
    input[type=number]::-webkit-inner-spin-button { opacity:1; }
    select { appearance: auto; }
    ::-webkit-scrollbar { width:6px; height:6px; }
    ::-webkit-scrollbar-track { background: ${isDark ? DARK_THEME.inputBg : "#f3f4f6"}; }
    ::-webkit-scrollbar-thumb { background: ${isDark ? DARK_THEME.border : "#d1d5db"}; border-radius:99px; }

    @media (max-width: 992px) {
      .resp-form-grid { grid-template-columns: 1fr !important; }
      .resp-grid-detail { grid-template-columns: 1fr !important; }
      .resp-hide-preview { display: none !important; }
    }
    @media (max-width: 768px) {
      .resp-grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
      .resp-grid-2 { grid-template-columns: 1fr !important; }
      .resp-grid-3 { grid-template-columns: 1fr 1fr !important; }
      .resp-hide { display: none !important; }
      .resp-wrap { flex-wrap: wrap !important; }
      .resp-stack { flex-direction: column !important; }
    }
    @media (max-width: 480px) {
      .resp-grid-4 { grid-template-columns: 1fr 1fr !important; }
      .resp-grid-3 { grid-template-columns: 1fr !important; }
      .resp-sm-wrap { flex-wrap: wrap !important; }
    }
  `;

  // Loading state
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: bg }}>
        <Loader />
      </div>
    );
  }

  // Render Detail, Add, Edit views
  if (view !== "list") {
    return (
      <div style={{ minHeight: "100vh", background: bg, fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", padding: "24px 16px 48px" }}>
        <style>{STYLES}</style>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          {view === "add" && (
            <ScheduleForm 
              isAdd 
              onCancel={() => setView("list")} 
              onSave={handleSave}
              movies={movies}
              rooms={rooms}
              getMovieTitle={getMovieTitle}
              getRoomName={getRoomName}
            />
          )}
          {view === "edit" && sel && (
            <ScheduleForm 
              schedule={getScheduleById(sel.ScheduleId)} 
              onCancel={() => setView("detail")} 
              onSave={handleSave}
              movies={movies}
              rooms={rooms}
              getMovieTitle={getMovieTitle}
              getRoomName={getRoomName}
            />
          )}
          {view === "detail" && sel && (
            <ScheduleDetail 
              sch={getScheduleById(sel.ScheduleId) || sel} 
              onBack={() => setView("list")} 
              onEdit={() => setView("edit")}
              getMovieTitle={getMovieTitle}
              getRoomName={getRoomName}
            />
          )}
        </div>
      </div>
    );
  }

  // Main List View
  return (
    <div style={{ minHeight: "100vh", background: bg, fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif" }}>
      <style>{STYLES}</style>

      {toast && (
        <div style={{
          position: "fixed",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          padding: "13px 22px",
          borderRadius: 14,
          background: isDark ? DARK_THEME.cardBg : "#1a1a2e",
          color: isDark ? DARK_THEME.text : "#fff",
          fontSize: 13.5,
          fontWeight: 700,
          boxShadow: isDark ? `0 8px 32px ${DARK_THEME.accentShadow}` : "0 8px 32px rgba(0,0,0,.30)",
          zIndex: 9999,
          animation: "gtoastIn 0.3s ease",
          whiteSpace: "nowrap",
          border: isDark ? `1px solid ${DARK_THEME.border}` : "none",
        }}>
          {toast.message || toast}
        </div>
      )}

      {showBulk && (
        <BulkEditPriceModal 
          schedules={schedules.filter(s => s.Status === "Active")} 
          onClose={() => setShowBulk(false)} 
          onApply={() => {}} 
          isDark={isDark}
        />
      )}
      {showClone && (
        <CloneWeekModal 
          schedules={schedules.filter(s => s.Status === "Active")} 
          onClose={() => setShowClone(false)} 
          onClone={() => {}} 
          isDark={isDark}
        />
      )}

      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "85px 16px 48px" }}>
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
          gap: 14,
          flexWrap: "wrap",
          animation: "gfadeUp 0.4s ease both",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              width: 50,
              height: 50,
              borderRadius: 15,
              background: gradientBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              boxShadow: `0 6px 18px ${accentShadow}`,
              flexShrink: 0,
            }}>
              🗓
            </div>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: ink, letterSpacing: "-0.6px", lineHeight: 1.1 }}>
                Lịch chiếu định kỳ
              </h1>
              <p style={{ fontSize: 13, color: ink4, marginTop: 4, fontWeight: 500 }}>
                Quản lý lịch chiếu lặp lại · Nhân bản & Chỉnh giá hàng loạt
              </p>
            </div>
          </div>
          <div className="resp-wrap" style={{ display: "flex", gap: 10 }}>
            <button
              onClick={toggleColorMode}
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: isDark ? ink6 : "#fafafa",
                border: `1.5px solid ${ink5}`,
                cursor: "pointer",
                fontSize: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: isDark ? DARK_THEME.text : "#374151",
              }}
            >
              {isDark ? "☀️" : "🌙"}
            </button>
            <Btn variant="warn" icon="💰" onClick={() => setShowBulk(true)} isDark={isDark}>Chỉnh giá loạt</Btn>
            <Btn variant="warn" icon="📋" onClick={() => setShowClone(true)} isDark={isDark}>Nhân bản tuần</Btn>
            <Btn variant="primary" icon="+" onClick={() => setView("add")} isDark={isDark}>Tạo lịch chiếu</Btn>
          </div>
        </div>

        {/* Stats */}
        <div className="resp-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
          <StatCard label="Tổng lịch chiếu" value={stats.total} emoji="🗓" accent={isDark ? DARK_THEME.accent : BASE.or1} sub={`${stats.slots} suất/tuần`} isDark={isDark} />
          <StatCard label="Đang hoạt động" value={stats.active} emoji="▶" accent={isDark ? "#4ade80" : BASE.green} isDark={isDark} />
          <StatCard label="Tạm dừng" value={stats.paused} emoji="⏸" accent={isDark ? "#fbbf24" : BASE.amber} isDark={isDark} />
          <StatCard label="Suất chiếu/tuần" value={stats.slots} emoji="🎬" accent={isDark ? "#6ab0ff" : BASE.violet} isDark={isDark} />
        </div>

        {/* Tabs */}
        <div style={{ 
          display: "flex", 
          gap: 2, 
          marginBottom: 18, 
          background: ink6, 
          borderRadius: 12, 
          padding: 4, 
          width: "fit-content" 
        }}>
          {[
            { k: "list", l: "📋 Danh sách" },
            { k: "calendar", l: "📅 Lịch tuần" },
          ].map(({ k, l }) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              style={{
                padding: "8px 20px",
                borderRadius: 9,
                fontSize: 13,
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                transition: "all 0.18s",
                background: tab === k ? (isDark ? DARK_THEME.accent : BASE.or1) : "transparent",
                color: tab === k ? "#fff" : ink3,
                boxShadow: tab === k ? `0 2px 10px ${isDark ? DARK_THEME.accentShadow : "rgba(249,115,22,.35)"}` : "none",
              }}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Content */}
        {tab === "calendar" ? (
          <div style={{ animation: "gfadeIn 0.3s ease" }}>
            <WeekView schedules={schedules} isDark={isDark} />
          </div>
        ) : (
          <div style={{ animation: "gfadeIn 0.3s ease" }}>
            <div style={{
              background: cardBg,
              borderRadius: 16,
              border: `1px solid ${cardBorder}`,
              boxShadow: isDark ? `0 2px 8px ${DARK_THEME.accentShadow}` : "0 2px 8px rgba(0,0,0,.05)",
              marginBottom: 14,
            }}>
              {/* Filters */}
              <div style={{ padding: "16px 20px 14px", borderBottom: `1px solid ${cardBorder}` }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 12,
                  flexWrap: "wrap",
                  gap: 8,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: ink }}>Danh sách lịch chiếu</span>
                    <span style={{
                      padding: "3px 10px",
                      borderRadius: 20,
                      fontSize: 11.5,
                      fontWeight: 700,
                      background: isDark ? DARK_THEME.inputBg : BASE.or3,
                      border: `1px solid ${isDark ? DARK_THEME.border : BASE.or4}`,
                      color: isDark ? DARK_THEME.accent : BASE.or1,
                    }}>
                      {filtered.length} lịch
                    </span>
                  </div>
                </div>
                <div className="resp-sm-wrap" style={{ display: "flex", gap: 10 }}>
                  <select
                    value={filterCinema}
                    onChange={e => setFilterCinema(e.target.value)}
                    style={{
                      flex: 1,
                      minWidth: 0,
                      height: 38,
                      padding: "0 12px",
                      borderRadius: 10,
                      fontSize: 12.5,
                      fontWeight: 600,
                      border: `1.5px solid ${isDark ? DARK_THEME.border : ink5}`,
                      background: isDark ? DARK_THEME.inputBg : ink6,
                      color: isDark ? DARK_THEME.text : "#374151",
                      cursor: "pointer",
                      outline: "none",
                      transition: "all 0.2s",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = isDark ? DARK_THEME.accent : BASE.or1;
                      e.target.style.boxShadow = isDark ? `0 0 0 3px ${DARK_THEME.accentShadow}` : "0 0 0 3px rgba(249,115,22,0.12)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = isDark ? DARK_THEME.border : ink5;
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    <option value="all">Tất cả rạp</option>
                    {CINEMAS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <select
                    value={filterMovie}
                    onChange={e => setFilterMovie(e.target.value)}
                    style={{
                      flex: 2,
                      minWidth: 0,
                      height: 38,
                      padding: "0 12px",
                      borderRadius: 10,
                      fontSize: 12.5,
                      fontWeight: 600,
                      border: `1.5px solid ${isDark ? DARK_THEME.border : ink5}`,
                      background: isDark ? DARK_THEME.inputBg : ink6,
                      color: isDark ? DARK_THEME.text : "#374151",
                      cursor: "pointer",
                      outline: "none",
                      transition: "all 0.2s",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = isDark ? DARK_THEME.accent : BASE.or1;
                      e.target.style.boxShadow = isDark ? `0 0 0 3px ${DARK_THEME.accentShadow}` : "0 0 0 3px rgba(249,115,22,0.12)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = isDark ? DARK_THEME.border : ink5;
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    <option value="all">Tất cả phim</option>
                    {movies.map(m => <option key={m.MovieId} value={m.MovieId}>{m.Title}</option>)}
                  </select>
                  <select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                    style={{
                      flex: 1,
                      minWidth: 0,
                      height: 38,
                      padding: "0 12px",
                      borderRadius: 10,
                      fontSize: 12.5,
                      fontWeight: 600,
                      border: `1.5px solid ${isDark ? DARK_THEME.border : ink5}`,
                      background: isDark ? DARK_THEME.inputBg : ink6,
                      color: isDark ? DARK_THEME.text : "#374151",
                      cursor: "pointer",
                      outline: "none",
                      transition: "all 0.2s",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = isDark ? DARK_THEME.accent : BASE.or1;
                      e.target.style.boxShadow = isDark ? `0 0 0 3px ${DARK_THEME.accentShadow}` : "0 0 0 3px rgba(249,115,22,0.12)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = isDark ? DARK_THEME.border : ink5;
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    <option value="Tất cả">Tất cả trạng thái</option>
                    <option value="Đang hoạt động">Đang hoạt động</option>
                    <option value="Tạm dừng">Tạm dừng</option>
                    <option value="Hết hạn">Hết hạn</option>
                  </select>
                </div>
              </div>

              {/* Column Headers */}
              <div className="resp-hide" style={{
                padding: "9px 22px",
                background: isDark ? DARK_THEME.inputBg : ink6,
                borderBottom: `1px solid ${isDark ? DARK_THEME.border : ink6}`,
                display: "flex",
                gap: 16,
                alignItems: "center",
              }}>
                {[
                  ["Phim & Địa điểm", "flex:2.5"],
                  ["Ngày chiếu", "flex:1.2"],
                  ["Suất chiếu", "flex:1.2"],
                  ["Giá vé", "flex:0.9"],
                  ["Thời gian", "flex:0.9"],
                  ["Trạng thái", "flex:0.8"],
                  ["Hành động", "flex:1.5"],
                ].map(([l, f]) => (
                  <div key={l} style={{
                    fontSize: 9.5,
                    fontWeight: 900,
                    color: isDark ? DARK_THEME.labelColor : ink4,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    [f.startsWith("flex") ? "flex" : "width"]: f.split(":")[1],
                  }}>
                    {l}
                  </div>
                ))}
              </div>

              {/* List */}
              <div style={{ padding: 12 }}>
                <ScheduleList
                  schedules={filtered}
                  onView={x => { setSel(x); setView("detail"); }}
                  onEdit={x => { setSel(x); setView("edit"); }}
                  onClone={handleClone}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                  getMovieTitle={getMovieTitle}
                  getRoomName={getRoomName}
                  isDark={isDark}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}