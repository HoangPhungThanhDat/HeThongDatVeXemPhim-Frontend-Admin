import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import MainLayout from "../../layouts/MainLayout";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../styles/User.css";
import "../../styles/pagination.css";
import ShowtimeApi from "../../api/ShowtimeApi";
import MovieApi from "../../api/MovieApi";
import RoomApi from "../../api/RoomApi";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import "animate.css";
import Loader from "../../layouts/Loader";
import { deleteShowtime } from "./delete";
import { useServerPagination } from "../../hooks/useServerPagination";

// ─── CSS inject ───────────────────────────────────────────────────────────────
const SEARCH_BAR_CSS = `
.sf-wrap{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:1rem;}
.sf-search-box{
  display:flex;align-items:center;gap:8px;
  background:#fff;border:0.5px solid rgba(0,0,0,0.18);
  border-radius:12px;padding:0 14px;height:42px;flex:1;min-width:220px;
  transition:border-color .15s;
}
.sf-search-box:focus-within{border-color:rgba(0,0,0,0.38);}
.sf-search-box .sf-icon{flex-shrink:0;opacity:.45;display:flex;align-items:center;}
.sf-search-box input{border:none;outline:none;background:transparent;font-size:14px;color:inherit;width:100%;min-width:0;}
.sf-search-box input::placeholder{color:rgba(128,128,128,.65);}
.sf-clear{background:none;border:none;cursor:pointer;padding:2px;color:rgba(128,128,128,.65);display:flex;align-items:center;border-radius:4px;transition:color .15s;}
.sf-clear:hover{color:inherit;}
.sf-pills{display:flex;gap:6px;flex-wrap:wrap;align-items:center;}
.sf-pill{
  height:42px;padding:0 16px;border-radius:12px;
  border:0.5px solid rgba(0,0,0,0.12);background:#fff;
  color:rgba(80,80,80,.85);font-size:13px;font-weight:400;cursor:pointer;
  display:flex;align-items:center;gap:6px;
  transition:border-color .15s,background .15s,color .15s;
  white-space:nowrap;user-select:none;
}
.sf-pill:hover{border-color:rgba(0,0,0,0.28);color:inherit;}
.sf-pill.pill-all       {background:#f3f3f1;border-color:rgba(0,0,0,0.22);color:#333;font-weight:500;}
.sf-pill.pill-scheduled {background:#EAF3DE;border-color:#3B6D11;color:#27500A;font-weight:500;}
.sf-pill.pill-cancelled {background:#FAEEDA;border-color:#854F0B;color:#633806;font-weight:500;}
.sf-pill.pill-finished  {background:#F1EFE8;border-color:#5F5E5A;color:#444441;font-weight:500;}
.sf-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;}
@media (prefers-color-scheme:dark){
  .sf-search-box{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.15);}
  .sf-search-box:focus-within{border-color:rgba(255,255,255,.32);}
  .sf-search-box input{color:#e2e0d8;}
  .sf-pill{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.12);color:rgba(200,198,192,.9);}
  .sf-pill.pill-all      {background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.25);color:#e2e0d8;}
  .sf-pill.pill-scheduled{background:#1a2e0f;border-color:#3B6D11;color:#9FE1CB;}
  .sf-pill.pill-cancelled{background:#2e1f07;border-color:#854F0B;color:#FAC775;}
  .sf-pill.pill-finished {background:#1e1d1b;border-color:#5F5E5A;color:#B4B2A9;}
}
`;

function injectSearchBarCSS() {
  if (document.getElementById("__sf-showtime-css")) return;
  const s = document.createElement("style");
  s.id = "__sf-showtime-css";
  s.textContent = SEARCH_BAR_CSS;
  document.head.appendChild(s);
}

const PAGE_SIZE = 10;

const PILL_CONFIG = [
  { key: "",           label: "Tất cả",      cls: "pill-all",       dot: null      },
  { key: "Scheduled",  label: "Đã lên lịch", cls: "pill-scheduled", dot: "#3B6D11" },
  { key: "Cancelled",  label: "Đã hủy",      cls: "pill-cancelled", dot: "#854F0B" },
  { key: "Finished",   label: "Đã kết thúc", cls: "pill-finished",  dot: "#5F5E5A" },
];

// ─── Search + Filter Bar ──────────────────────────────────────────────────────
const SearchFilterBar = React.memo(({ searchInput, onSearchChange, onClear, statusFilter, onStatusChange }) => {
  useEffect(() => { injectSearchBarCSS(); }, []);
  return (
    <div className="sf-wrap">
      <div className="sf-search-box">
        <span className="sf-icon">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M10 10L13.5 13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </span>
        <input type="text" placeholder="Tìm theo tên phim..."
          value={searchInput} onChange={(e) => onSearchChange(e.target.value)} />
        {searchInput && (
          <button className="sf-clear" onClick={onClear} title="Xóa">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
      <div className="sf-pills">
        {PILL_CONFIG.map(({ key, label, cls, dot }) => (
          <button key={key} className={`sf-pill${statusFilter === key ? ` ${cls}` : ""}`}
            onClick={() => onStatusChange(key)}>
            {dot && <span className="sf-dot" style={{ background: dot }} />}
            {label}
          </button>
        ))}
      </div>
    </div>
  );
});

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
    const el = document.createElement("span");
    el.className = "cp-ripple";
    btn.appendChild(el);
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
      <div className="cp-progress-wrap">
        <div className="cp-progress-bar" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
});

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Showtime() {
  const [movies, setMovies]             = useState([]);
  const [rooms, setRooms]               = useState([]);
  const [showForm, setShowForm]         = useState(false);
  const [searchInput, setSearchInput]   = useState("");
  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const navigate = useNavigate();

  const [newShowtime, setNewShowtime] = useState({
    MovieId: "", RoomId: "", StartTime: "",
    EndTime: "", Price: "", Status: "Scheduled",
  });

  // ✅ useMemo — tránh object mới mỗi render
  const extraParams = useMemo(
    () => ({ search, status: statusFilter }),
    [search, statusFilter]
  );

  const { data: showtimes, total, totalPages, page, loading, goToPage, reload } =
    useServerPagination(ShowtimeApi.getPaged, { limit: PAGE_SIZE, extraParams });

  // Debounce search 400ms
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    RoomApi.getAll()
      .then((res) => setRooms(res.data.data))
      .catch((err) => console.error("Lỗi load rooms:", err));
    MovieApi.getAll()
      .then((res) => setMovies(res.data.data))
      .catch((err) => console.error("Lỗi load movies:", err));
  }, []);

  const showToast = useCallback((icon, message) => {
    Swal.fire({
      toast: true, position: "top-end", icon, title: message,
      showConfirmButton: false, timer: 3000, timerProgressBar: true,
      showClass: { popup: "animate__animated animate__slideInRight" },
      hideClass: { popup: "animate__animated animate__slideOutRight" },
    });
  }, []);

  const handleAddShowtime = useCallback(async (e) => {
    e.preventDefault();
    try {
      await ShowtimeApi.create(newShowtime);
      setNewShowtime({ MovieId: "", RoomId: "", StartTime: "", EndTime: "", Price: "", Status: "Scheduled" });
      setShowForm(false);
      reload();
      showToast("success", "🎉 Thêm suất chiếu thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm suất chiếu:", error);
      showToast("error", "❌ Thêm thất bại!");
    }
  }, [newShowtime, reload, showToast]);

  const toggleStatus = useCallback((showtimeId) => {
    const st = showtimes.find((s) => s.ShowtimeId === showtimeId);
    if (!st) return;
    const newStatus = st.Status === "Scheduled" ? "Cancelled" : "Scheduled";
    ShowtimeApi.update(showtimeId, { ...st, Status: newStatus })
      .then(() => reload())
      .catch(() => showToast("error", "❌ Không thể cập nhật trạng thái!"));
  }, [showtimes, reload, showToast]);

  const handleClear = useCallback(() => { setSearchInput(""); setSearch(""); }, []);

  if (loading && showtimes.length === 0) return <Loader />;

  return (
    <div>
      <MainLayout>
        <main>
          <div className="main-container">
            <div className="pd-ltr-20">

              {/* Header — giữ nguyên class gốc */}
              <div className="d-flex justify-content-between align-items-center mb-4 p-3 shadow-sm bg-gradient rounded-4 header-box">
                <h3 className="m-0 text-white fw-bold d-flex align-items-center">
                  <i className="fas fa-heart me-2"></i> Quản lý suất chiếu
                </h3>
                <div>
                  <button
                    className="btn btn-light me-2 shadow-sm rounded-pill px-3 fw-semibold"
                    onClick={() => setShowForm(!showForm)}
                  >
                    <i className="fas fa-plus me-1 text-success"></i> Thêm
                  </button>
                  <button className="btn btn-outline-light shadow-sm rounded-pill px-3 fw-semibold">
                    <i className="fas fa-trash me-1 text-danger"></i> Thùng rác
                  </button>
                </div>
              </div>

              {/* ✅ Search + Filter Bar */}
              <SearchFilterBar
                searchInput={searchInput}
                onSearchChange={setSearchInput}
                onClear={handleClear}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
              />

              {/* Số kết quả */}
              <div className="mb-3" style={{ fontSize: 13, color: "#6c757d", minHeight: 20 }}>
                {loading ? (
                  <span><i className="fas fa-spinner fa-spin me-1"></i>Đang tải...</span>
                ) : (
                  <span>
                    {search || statusFilter ? `Tìm thấy ${total} suất chiếu` : `Tổng cộng ${total} suất chiếu`}
                  </span>
                )}
              </div>

              {/* Form thêm — giữ nguyên class gốc */}
              <AnimatePresence>
                {showForm && (
                  <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="card border-0 shadow-lg rounded-4 mb-4 form-add-user"
                  >
                    <div className="card-body p-4">
                      <h4 className="fw-bold mb-4 text-primary d-flex align-items-center">
                        <i className="fas fa-plus-circle me-2"></i> Thêm suất chiếu
                      </h4>
                      <form onSubmit={handleAddShowtime}>
                        <div className="row g-4">

                          {/* Phim */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-film me-2 text-primary"></i>Phim được chiếu
                            </label>
                            <select className="form-select custom-input"
                              value={newShowtime.MovieId}
                              onChange={(e) => setNewShowtime({ ...newShowtime, MovieId: e.target.value })}
                              required>
                              <option value="">-- Chọn phim --</option>
                              {movies.map((m) => (
                                <option key={m.MovieId} value={m.MovieId}>{m.Title}</option>
                              ))}
                            </select>
                          </div>

                          {/* Phòng */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-door-open me-2 text-danger"></i>Phòng chiếu
                            </label>
                            <select className="form-select custom-input"
                              value={newShowtime.RoomId}
                              onChange={(e) => setNewShowtime({ ...newShowtime, RoomId: e.target.value })}
                              required>
                              <option value="">-- Chọn phòng --</option>
                              {rooms.map((r) => (
                                <option key={r.RoomId} value={r.RoomId}>{r.Name}</option>
                              ))}
                            </select>
                          </div>

                          {/* Giờ bắt đầu */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-clock me-2 text-success"></i>Giờ bắt đầu
                            </label>
                            <input type="datetime-local" className="form-control custom-input"
                              value={newShowtime.StartTime}
                              onChange={(e) => setNewShowtime({ ...newShowtime, StartTime: e.target.value })}
                              required />
                          </div>

                          {/* Giờ kết thúc */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-clock me-2 text-info"></i>Giờ kết thúc
                            </label>
                            <input type="datetime-local" className="form-control custom-input"
                              value={newShowtime.EndTime}
                              onChange={(e) => setNewShowtime({ ...newShowtime, EndTime: e.target.value })}
                              required />
                          </div>

                          {/* Giá vé */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-dollar-sign me-2 text-warning"></i>Giá vé cơ bản
                            </label>
                            <input type="number" className="form-control custom-input"
                              placeholder="Nhập giá vé"
                              value={newShowtime.Price}
                              onChange={(e) => setNewShowtime({ ...newShowtime, Price: e.target.value })}
                              required />
                          </div>

                          {/* Trạng thái */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-toggle-on me-2 text-success"></i>Trạng thái suất chiếu
                            </label>
                            <select className="form-select custom-input"
                              value={newShowtime.Status}
                              onChange={(e) => setNewShowtime({ ...newShowtime, Status: e.target.value })}>
                              <option value="Scheduled">Đã lên lịch</option>
                              <option value="Cancelled">Đã hủy</option>
                              <option value="Finished">Đã kết thúc</option>
                            </select>
                          </div>

                          {/* Nút hành động */}
                          <div className="col-12 text-end mt-3">
                            <motion.button
                              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                              type="submit" className="btn btn-gradient-success me-2 rounded-pill px-4">
                              <i className="fas fa-save me-1"></i> Lưu
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                              type="button" className="btn btn-gradient-secondary rounded-pill px-4"
                              onClick={() => setShowForm(false)}>
                              <i className="fas fa-times me-1"></i> Hủy
                            </motion.button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Card chứa bảng — giữ nguyên class gốc */}
              <div className="card border-0 shadow-sm rounded-4 animate__animated animate__fadeIn">
                <div className="card-body p-4">
                  <div className="table-responsive">
                    <table className="table align-middle table-hover table-striped">
                      <thead className="bg-light text-dark">
                        <tr>
                          <th>ID</th>
                          <th>Phim chiếu</th>
                          <th>Phòng chiếu</th>
                          <th>Giờ bắt đầu</th>
                          <th>Giờ kết thúc</th>
                          <th>Trạng thái</th>
                          <th className="text-center">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {showtimes.length > 0 ? (
                          showtimes.map((showtime, index) => (
                            <tr key={showtime.ShowtimeId} className="table-row-hover">
                              <td className="fw-bold px-4">{(page - 1) * PAGE_SIZE + index + 1}</td>
                              <td className="fw-semibold">
                                {showtime.MovieId?.Title ?? showtime.MovieId}
                              </td>
                              <td className="fw-semibold">
                                {showtime.RoomId?.Name ?? showtime.RoomId}
                              </td>
                              <td className="text-muted">{showtime.StartTime}</td>
                              <td className="text-muted">{showtime.EndTime}</td>
                              <td>
                                <label className="switch">
                                  <input
                                    type="checkbox"
                                    checked={showtime.Status === "Scheduled"}
                                    onChange={() => toggleStatus(showtime.ShowtimeId)}
                                  />
                                  <span className="slider"></span>
                                </label>
                                <span className={`ms-2 fw-semibold ${
                                  showtime.Status === "Scheduled" ? "text-success"
                                  : showtime.Status === "Cancelled" ? "text-warning"
                                  : "text-danger"
                                }`}>
                                  {showtime.Status === "Scheduled" ? "Đã lên lịch"
                                    : showtime.Status === "Cancelled" ? "Đã hủy"
                                    : "Đã kết thúc"}
                                </span>
                              </td>
                              <td className="text-center">
                                <button className="action-btn text-info" title="Chi tiết"
                                  onClick={() => navigate(`/Showtime/show/${showtime.ShowtimeId}`)}>
                                  <i className="fas fa-eye"></i>
                                </button>
                                <button className="action-btn text-primary" title="Sửa"
                                  onClick={() => navigate(`/Showtime/edit/${showtime.ShowtimeId}`)}>
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button className="action-btn text-danger" title="Xóa"
                                  onClick={() => deleteShowtime(showtime.ShowtimeId, () => reload())}>
                                  <i className="fas fa-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7" className="text-center py-5 text-muted">
                              <i className="fas fa-heart fa-2x mb-2 d-block"></i>
                              {search
                                ? `Không tìm thấy suất chiếu cho phim "${search}"`
                                : statusFilter
                                  ? "Không có suất chiếu nào ở trạng thái này."
                                  : "Không có dữ liệu"}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* ✅ Luxury Cinema Pagination */}
                  <CinemaPagination
                    page={page} totalPages={totalPages} total={total}
                    onPageChange={goToPage} label="Suất chiếu"
                  />
                </div>
              </div>

            </div>
          </div>
        </main>
      </MainLayout>
    </div>
  );
}