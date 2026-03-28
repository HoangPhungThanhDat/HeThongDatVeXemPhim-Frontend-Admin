import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import MainLayout from "../../layouts/MainLayout";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../styles/User.css";
import "../../styles/pagination.css";
import ShowtimeSeatApi from "../../api/ShowtimeSeatApi";
import ShowtimeApi from "../../api/ShowtimeApi";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import "animate.css";
import Loader from "../../layouts/Loader";
import { deleteShowtimeSeat } from "./delete";
import { useServerPagination } from "../../hooks/useServerPagination";

const PAGE_SIZE = 20;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getMovieTitle = (s) => {
  if (!s) return "Không rõ phim";
  if (s.Movie?.Title) return s.Movie.Title;
  if (typeof s.MovieId === "object") return s.MovieId?.Title ?? "Không rõ phim";
  return "Không rõ phim";
};
const getRoomName = (s) => {
  if (!s) return "";
  if (s.Room?.Name) return s.Room.Name;
  if (typeof s.RoomId === "object") return s.RoomId?.Name ?? "";
  return "";
};
const getSeatLabel = (seat) => {
  if (seat.Seat?.Row) return `Hàng ${seat.Seat.Row} — Ghế ${seat.Seat.Number} (${seat.Seat.SeatType})`;
  if (typeof seat.SeatId === "object") return `Hàng ${seat.SeatId?.Row} — Ghế ${seat.SeatId?.Number} (${seat.SeatId?.SeatType})`;
  return `SeatId: ${seat.SeatId}`;
};

const STATUS_CYCLE = { Available: "Reserved", Reserved: "Broken", Broken: "Available" };
const STATUS_LABEL = { Available: "Còn trống", Reserved: "Đã đặt", Broken: "Hỏng" };
const STATUS_CLASS = { Available: "text-success", Reserved: "text-warning", Broken: "text-danger" };

// ─── Luxury Cinema Pagination ─────────────────────────────────────────────────
const CinemaPagination = React.memo(({ page, totalPages, total, onPageChange, label }) => {
  const jumpRef = useRef(null);
  if (totalPages <= 1) return null;

  const start    = (page - 1) * PAGE_SIZE + 1;
  const end      = Math.min(page * PAGE_SIZE, total);
  const progress = Math.round((page / totalPages) * 100);

  const getPages = () => {
    const pages = [], d = 2;
    const l = Math.max(1, page - d), r = Math.min(totalPages, page + d);
    if (l > 1) { pages.push(1); if (l > 2) pages.push("..."); }
    for (let i = l; i <= r; i++) pages.push(i);
    if (r < totalPages) { if (r < totalPages - 1) pages.push("..."); pages.push(totalPages); }
    return pages;
  };

  const ripple = (e) => {
    const btn = e.currentTarget;
    btn.querySelector(".cp-ripple")?.remove();
    const el = document.createElement("span"); el.className = "cp-ripple"; btn.appendChild(el);
  };

  const onJump = (e) => {
    e.preventDefault();
    const v = parseInt(jumpRef.current?.value, 10);
    if (!isNaN(v) && v >= 1 && v <= totalPages) { onPageChange(v); jumpRef.current.value = ""; }
  };

  return (
    <div className="cp-wrap">
      <div className="cp-accent" />
      <div className="cp-body">
        <div className="cp-info">
          <span className="cp-info-label">Kết quả</span>
          <span className="cp-info-val">{label} <b>{start}–{end}</b> / {total}</span>
        </div>
        <div className="cp-controls">
          <button className="cp-nav" disabled={page === 1} onClick={() => page > 1 && onPageChange(page - 1)}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M6.5 2L3.5 5L6.5 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {getPages().map((p, i) => p === "..." ? <span key={`e${i}`} className="cp-ellipsis">···</span> : (
              <button key={p} className={`cp-page${p === page ? " cp-active" : ""}`}
                onClick={(e) => { if (p !== page) { ripple(e); onPageChange(p); } }}>{p}</button>
            ))}
          </div>
          <button className="cp-nav" disabled={page === totalPages} onClick={() => page < totalPages && onPageChange(page + 1)}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M3.5 2L6.5 5L3.5 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
        <form className="cp-jump" onSubmit={onJump}>
          <span className="cp-jump-label">Trang</span>
          <input ref={jumpRef} type="number" className="cp-jump-input" min={1} max={totalPages} placeholder="–" />
          <button type="submit" className="cp-jump-btn">Đến</button>
        </form>
      </div>
      <div className="cp-progress-wrap"><div className="cp-progress-bar" style={{ width: `${progress}%` }} /></div>
    </div>
  );
});

// ─── Row ──────────────────────────────────────────────────────────────────────
const SeatRow = React.memo(({ seat, showtime, index, animDelay, onToggle, onNavigate, onDelete }) => {
  const movieTitle = getMovieTitle(showtime);
  const time       = showtime?.StartTime ? new Date(showtime.StartTime).toLocaleString("vi-VN") : "";
  const seatLabel  = getSeatLabel(seat);
  return (
    <tr className="table-row-hover pag-row-anim" style={{ animationDelay: `${animDelay}s` }}>
      <td className="fw-bold px-4">{index + 1}</td>
      <td className="fw-semibold">{showtime ? `${movieTitle} — ${time}` : String(seat.ShowtimeId)}</td>
      <td className="text-muted">{seatLabel}</td>
      <td>
        <label className="switch"><input type="checkbox" checked={seat.Status === "Available"} onChange={() => onToggle(seat.ShowtimeSeatId, seat.Status)} /><span className="slider" /></label>
        <span className={`ms-2 fw-semibold ${STATUS_CLASS[seat.Status] ?? ""}`}>{STATUS_LABEL[seat.Status] ?? seat.Status}</span>
      </td>
      <td className="text-center">
        <button className="action-btn text-info" title="Chi tiết" onClick={() => onNavigate(`/showtimeseats/show/${seat.ShowtimeSeatId}`)}><i className="fas fa-eye" /></button>
        <button className="action-btn text-primary" title="Sửa" onClick={() => onNavigate(`/showtimeseats/edit/${seat.ShowtimeSeatId}`)}><i className="fas fa-edit" /></button>
        <button className="action-btn text-danger" title="Xóa" onClick={() => onDelete(seat.ShowtimeSeatId)}><i className="fas fa-trash" /></button>
      </td>
    </tr>
  );
});

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ShowtimeSeat() {
  const navigate = useNavigate();
  const [showtimes, setShowtimes]               = useState([]);
  const [showForm, setShowForm]                 = useState(false);
  const [generating, setGenerating]             = useState(false);
  const [selectedShowtimeId, setSelectedShowtimeId] = useState("");
  const [previewCount, setPreviewCount]         = useState(null);

  // ✅ Server-side pagination
  const { data: showtimeSeats, total, totalPages, page, loading, pageKey, goToPage, reload } =
    useServerPagination(ShowtimeSeatApi.getPaged, { limit: PAGE_SIZE, extraParams: {} });

  // O(1) lookup map từ showtimes đã load riêng (showtimes ít hơn nhiều so với seats)
  const showtimeMap = useMemo(() => {
    const map = {};
    showtimes.forEach((s) => { map[String(s.ShowtimeId)] = s; });
    return map;
  }, [showtimes]);

  const seatCountByShowtime = useMemo(() => {
    const count = {};
    showtimeSeats.forEach((s) => { const k = String(s.ShowtimeId); count[k] = (count[k] || 0) + 1; });
    return count;
  }, [showtimeSeats]);

  useEffect(() => {
    ShowtimeApi.getAll()
      .then((r) => setShowtimes(r.data.data || []))
      .catch(console.error);
  }, []);

  const showToast = (icon, msg) => Swal.fire({
    toast: true, position: "top-end", icon, title: msg,
    showConfirmButton: false, timer: 3000, timerProgressBar: true,
    showClass: { popup: "animate__animated animate__slideInRight" },
    hideClass: { popup: "animate__animated animate__slideOutRight" },
  });

  const handleSelectShowtime = (id) => {
    setSelectedShowtimeId(id);
    if (!id) { setPreviewCount(null); return; }
    setPreviewCount(seatCountByShowtime[String(id)] ?? 0);
  };

  const handleGenerateSeats = async (e) => {
    e.preventDefault();
    if (!selectedShowtimeId) return;
    const existingCount = seatCountByShowtime[String(selectedShowtimeId)] ?? 0;
    if (existingCount > 0) {
      const confirmed = await Swal.fire({
        title: "Suất chiếu đã có ghế!",
        html: `Suất chiếu này đã có <b>${existingCount} ghế</b>.<br/>Bạn có muốn tạo lại không?`,
        icon: "warning", showCancelButton: true,
        confirmButtonColor: "#e63946", cancelButtonColor: "#6b7280",
        confirmButtonText: "Tạo lại", cancelButtonText: "Hủy",
      });
      if (!confirmed.isConfirmed) return;
    }
    setGenerating(true);
    try {
      await ShowtimeSeatApi.generateByShowtime(selectedShowtimeId);
      showToast("success", "🎉 Tạo ghế hàng loạt thành công!");
      resetForm();
      reload();
    } catch {
      showToast("error", "❌ Tạo ghế thất bại! Kiểm tra lại phòng có ghế chưa.");
    } finally {
      setGenerating(false);
    }
  };

  const toggleStatus = useCallback(async (ShowtimeSeatId, currentStatus) => {
    const newStatus = STATUS_CYCLE[currentStatus];
    if (!newStatus) return;
    const seat = showtimeSeats.find((r) => r.ShowtimeSeatId === ShowtimeSeatId);
    if (!seat) return;
    try {
      await ShowtimeSeatApi.update(ShowtimeSeatId, { ShowtimeId: seat.ShowtimeId, SeatId: seat.SeatId, Status: newStatus });
      reload();
    } catch {
      showToast("error", "❌ Không thể cập nhật trạng thái!");
    }
  }, [showtimeSeats, reload]);

  const handleNavigate = useCallback((path) => navigate(path), [navigate]);
  const handleDelete   = useCallback((id) => deleteShowtimeSeat(id, () => reload()), [reload]);
  const resetForm      = () => { setShowForm(false); setSelectedShowtimeId(""); setPreviewCount(null); };

  if (loading && showtimeSeats.length === 0) return <Loader />;

  return (
    <div><MainLayout><main><div className="main-container"><div className="pd-ltr-20">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 p-3 shadow-sm bg-gradient rounded-4 header-box">
        <h3 className="m-0 text-white fw-bold d-flex align-items-center"><i className="fas fa-heart me-2" />Quản lý trạng thái ghế theo suất chiếu</h3>
        <div>
          <button className="btn btn-light me-2 shadow-sm rounded-pill px-3 fw-semibold"
            onClick={() => { setShowForm(!showForm); setSelectedShowtimeId(""); setPreviewCount(null); }}>
            <i className="fas fa-plus me-1 text-success" />Tạo ghế tự động
          </button>
          <button className="btn btn-outline-light shadow-sm rounded-pill px-3 fw-semibold">
            <i className="fas fa-trash me-1 text-danger" />Thùng rác
          </button>
        </div>
      </div>

      {/* Form tạo ghế */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }} transition={{ duration: 0.35, ease: "easeOut" }}
            className="card border-0 shadow-lg rounded-4 mb-4 form-add-user">
            <div className="card-body p-4">
              <h4 className="fw-bold mb-1 text-primary d-flex align-items-center"><i className="fas fa-magic me-2" />Tạo ghế tự động theo suất chiếu</h4>
              <p className="text-muted mb-4" style={{ fontSize: 13 }}>Chọn suất chiếu — hệ thống sẽ tự động tạo toàn bộ ghế của phòng đó.</p>
              <form onSubmit={handleGenerateSeats}>
                <div className="row g-4">
                  <div className="col-12">
                    <label className="form-label fw-bold"><i className="fas fa-film me-2 text-primary" />Chọn suất chiếu</label>
                    <select className="form-select custom-input" value={selectedShowtimeId}
                      onChange={(e) => handleSelectShowtime(e.target.value)} required>
                      <option value="">-- Chọn suất chiếu --</option>
                      {showtimes.map((s) => {
                        const count    = seatCountByShowtime[String(s.ShowtimeId)] ?? 0;
                        const title    = getMovieTitle(s);
                        const roomName = getRoomName(s);
                        const time     = s.StartTime ? new Date(s.StartTime).toLocaleString("vi-VN") : "";
                        const status   = count > 0 ? `✅ (đã có ${count} ghế)` : "⚠️ (chưa có ghế)";
                        return <option key={s.ShowtimeId} value={s.ShowtimeId}>{`🎬 ${title} — 🕐 ${time} — 🏠 ${roomName} — ${status}`}</option>;
                      })}
                    </select>
                  </div>
                  {selectedShowtimeId && (
                    <div className="col-12">
                      {previewCount > 0
                        ? <div className="alert alert-warning d-flex align-items-center"><i className="fas fa-exclamation-triangle me-2" />Suất chiếu này đã có <strong className="mx-1">{previewCount} ghế</strong>. Nếu tạo lại sẽ xóa và tạo mới toàn bộ.</div>
                        : <div className="alert alert-success d-flex align-items-center"><i className="fas fa-check-circle me-2" />Suất chiếu chưa có ghế — sẵn sàng tạo tự động!</div>}
                    </div>
                  )}
                </div>
                <div className="col-12 text-end mt-3">
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} type="submit"
                    className="btn btn-gradient-success me-2 rounded-pill px-4" disabled={!selectedShowtimeId || generating}>
                    {generating ? <><i className="fas fa-spinner fa-spin me-1" />Đang tạo ghế...</> : <><i className="fas fa-magic me-1" />Tạo ghế tự động</>}
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} type="button"
                    className="btn btn-gradient-secondary rounded-pill px-4" onClick={resetForm}>
                    <i className="fas fa-times me-1" />Hủy
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="card border-0 shadow-sm rounded-4 animate__animated animate__fadeIn">
        <div className="card-body p-4">
          <div className="table-responsive">
            <table className="table align-middle table-hover table-striped">
              <thead className="bg-light text-dark border-bottom">
                <tr><th className="px-4">STT</th><th>Suất chiếu</th><th>Ghế</th><th>Trạng thái</th><th className="text-center">Hành động</th></tr>
              </thead>
              <tbody key={pageKey}>
                {showtimeSeats.length > 0 ? showtimeSeats.map((seat, i) => (
                  <SeatRow key={seat.ShowtimeSeatId} seat={seat}
                    showtime={showtimeMap[String(seat.ShowtimeId)]}
                    index={(page - 1) * PAGE_SIZE + i} animDelay={i * 0.035}
                    onToggle={toggleStatus} onNavigate={handleNavigate} onDelete={handleDelete} />
                )) : (
                  <tr><td colSpan="5" className="text-center py-5 text-muted">
                    <i className="fas fa-chair fa-2x mb-2 d-block" />Chưa có dữ liệu ghế. Bấm "Tạo ghế tự động" để bắt đầu.
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
          <CinemaPagination page={page} totalPages={totalPages} total={total} onPageChange={goToPage} label="Ghế" />
        </div>
      </div>

    </div></div></main></MainLayout></div>
  );
}