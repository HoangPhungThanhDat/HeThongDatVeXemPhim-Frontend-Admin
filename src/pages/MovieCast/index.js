import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import MainLayout from "../../layouts/MainLayout";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../styles/User.css";
import "../../styles/pagination.css";
import MovieCastApi from "../../api/MovieCastApi";
import MovieApi from "../../api/MovieApi";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import "animate.css";
import Loader from "../../layouts/Loader";
import { deleteCast } from "./delete";
import { useServerPagination } from "../../hooks/useServerPagination";

// ─── CSS inject (search + filter bar) ────────────────────────────────────────
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
.sf-pill.pill-all     {background:#f3f3f1;border-color:rgba(0,0,0,0.22);color:#333;font-weight:500;}
.sf-pill.pill-actor   {background:#E6F1FB;border-color:#185FA5;color:#0C447C;font-weight:500;}
.sf-pill.pill-director{background:#EEEDFE;border-color:#534AB7;color:#3C3489;font-weight:500;}
.sf-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;}
@media (prefers-color-scheme:dark){
  .sf-search-box{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.15);}
  .sf-search-box:focus-within{border-color:rgba(255,255,255,.32);}
  .sf-search-box input{color:#e2e0d8;}
  .sf-pill{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.12);color:rgba(200,198,192,.9);}
  .sf-pill.pill-all     {background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.25);color:#e2e0d8;}
  .sf-pill.pill-actor   {background:#042C53;border-color:#185FA5;color:#85B7EB;}
  .sf-pill.pill-director{background:#26215C;border-color:#534AB7;color:#AFA9EC;}
}
`;

function injectSearchBarCSS() {
  if (document.getElementById("__sf-cast-css")) return;
  const s = document.createElement("style");
  s.id = "__sf-cast-css";
  s.textContent = SEARCH_BAR_CSS;
  document.head.appendChild(s);
}

const PAGE_SIZE = 10;

const PILL_CONFIG = [
  { key: "",         label: "Tất cả",    cls: "pill-all",      dot: null      },
  { key: "Actor",    label: "Diễn viên", cls: "pill-actor",    dot: "#185FA5" },
  { key: "Director", label: "Đạo diễn", cls: "pill-director", dot: "#534AB7" },
];

// ─── Search + Filter Bar ──────────────────────────────────────────────────────
const SearchFilterBar = React.memo(({ searchInput, onSearchChange, onClear, roleFilter, onRoleChange }) => {
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
        <input type="text" placeholder="Tìm theo tên diễn viên, đạo diễn..."
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
          <button key={key} className={`sf-pill${roleFilter === key ? ` ${cls}` : ""}`}
            onClick={() => onRoleChange(key)}>
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
export default function MovieCast() {
  const [movies, setMovies]             = useState([]);
  const [showForm, setShowForm]         = useState(false);
  const [searchInput, setSearchInput]   = useState("");
  const [search, setSearch]             = useState("");
  const [roleFilter, setRoleFilter]     = useState("");
  const [newCast, setNewCast] = useState({
    MovieId: "", Name: "", Role: "", Status: "",
  });

  const navigate = useNavigate();

  // ✅ useMemo — tránh object mới mỗi render
  const extraParams = useMemo(
    () => ({ search, role: roleFilter }),
    [search, roleFilter]
  );

  const { data: moviecasts, total, totalPages, page, loading, goToPage, reload } =
    useServerPagination(MovieCastApi.getPaged, { limit: PAGE_SIZE, extraParams });

  // Movie lookup map O(1)
  const movieMap = useMemo(() => {
    const map = {};
    movies.forEach((m) => { map[m.MovieId] = m.Title; });
    return map;
  }, [movies]);

  // Debounce search 400ms
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    MovieApi.getAll()
      .then((res) => setMovies(res.data.data))
      .catch((err) => console.error("Lỗi load movies:", err));
  }, []);

  const showToast = useCallback((icon, message) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      showClass: { popup: "animate__animated animate__slideInRight" },
      hideClass: { popup: "animate__animated animate__slideOutRight" },
    });
  }, []);

  const handleAddCast = useCallback(async (e) => {
    e.preventDefault();
    try {
      await MovieCastApi.create(newCast);
      setNewCast({ MovieId: "", Name: "", Role: "", Status: "" });
      setShowForm(false);
      reload();
      showToast("success", "🎉 Đã thêm diễn viên/đạo diễn!");
    } catch (error) {
      console.error("Lỗi khi thêm cast:", error.response?.data || error);
      showToast("error", "❌ Không thể thêm!");
    }
  }, [newCast, reload, showToast]);

  const toggleStatus = useCallback(async (CastId, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    try {
      const cast = moviecasts.find((c) => c.CastId === CastId);
      await MovieCastApi.update(CastId, {
        MovieId: cast.MovieId,
        Name: cast.Name,
        Role: cast.Role,
        Status: newStatus,
      });
      reload();
      showToast("success", "✅ Cập nhật trạng thái thành công!");
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật trạng thái:", error);
      showToast("error", "❌ Không thể cập nhật trạng thái!");
    }
  }, [moviecasts, reload, showToast]);

  const handleClear = useCallback(() => { setSearchInput(""); setSearch(""); }, []);

  if (loading && moviecasts.length === 0) return <Loader />;

  return (
    <div>
      <MainLayout>
        <main>
          <div className="main-container">
            <div className="pd-ltr-20">

              {/* Header — giữ nguyên class gốc */}
              <div className="d-flex justify-content-between align-items-center mb-4 p-3 shadow-sm bg-gradient rounded-4 header-box">
                <h3 className="m-0 text-white fw-bold d-flex align-items-center">
                  <i className="fas fa-user me-2"></i> Quản lý diễn viên / đạo diễn
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
                roleFilter={roleFilter}
                onRoleChange={setRoleFilter}
              />

              {/* Số kết quả */}
              <div className="mb-3" style={{ fontSize: 13, color: "#6c757d", minHeight: 20 }}>
                {loading ? (
                  <span><i className="fas fa-spinner fa-spin me-1"></i>Đang tải...</span>
                ) : (
                  <span>
                    {search || roleFilter ? `Tìm thấy ${total} kết quả` : `Tổng cộng ${total} thành viên`}
                  </span>
                )}
              </div>

              {/* Form thêm thành viên đoàn phim — giữ nguyên class gốc */}
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
                        <i className="fas fa-users me-2"></i> Thêm thành viên đoàn phim
                      </h4>

                      <form onSubmit={handleAddCast}>
                        <div className="row g-4">

                          {/* Chọn phim */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-film me-2 text-primary"></i>Chọn phim
                            </label>
                            <select
                              className="form-select custom-input"
                              value={newCast.MovieId}
                              onChange={(e) => setNewCast({ ...newCast, MovieId: e.target.value })}
                              required
                            >
                              <option value="">-- Chọn phim --</option>
                              {movies.map((movie) => (
                                <option key={movie.MovieId} value={movie.MovieId}>{movie.Title}</option>
                              ))}
                            </select>
                          </div>

                          {/* Vai trò */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-user-tag me-2 text-success"></i>Vai trò
                            </label>
                            <select
                              className="form-select custom-input"
                              value={newCast.Role}
                              onChange={(e) => setNewCast({ ...newCast, Role: e.target.value })}
                              required
                            >
                              <option value="">-- Chọn vai trò --</option>
                              <option value="Actor">🎭 Diễn viên</option>
                              <option value="Director">🎬 Đạo diễn</option>
                            </select>
                          </div>

                          {/* Tên thành viên */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-user me-2 text-danger"></i>Tên thành viên
                            </label>
                            <input
                              type="text"
                              className="form-control custom-input"
                              placeholder="VD: Tom Cruise, Christopher Nolan..."
                              value={newCast.Name}
                              onChange={(e) => setNewCast({ ...newCast, Name: e.target.value })}
                              required
                            />
                          </div>

                          {/* Trạng thái */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-toggle-on me-2 text-info"></i>Trạng thái
                            </label>
                            <select
                              className="form-select custom-input"
                              value={newCast.Status}
                              onChange={(e) => setNewCast({ ...newCast, Status: e.target.value })}
                              required
                            >
                              <option value="">-- Chọn trạng thái --</option>
                              <option value="Active">✅ Hoạt động</option>
                              <option value="Inactive">⏸️ Tạm khóa</option>
                            </select>
                          </div>

                          {/* Nút hành động */}
                          <div className="col-12 text-end mt-3">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              type="submit"
                              className="btn btn-gradient-success me-2 rounded-pill px-4"
                            >
                              <i className="fas fa-save me-1"></i> Lưu
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              type="button"
                              className="btn btn-gradient-secondary rounded-pill px-4"
                              onClick={() => setShowForm(false)}
                            >
                              <i className="fas fa-times me-1"></i> Hủy
                            </motion.button>
                          </div>

                        </div>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bảng MovieCast — giữ nguyên class gốc */}
              <div className="card border-0 shadow-sm rounded-4 animate__animated animate__fadeIn">
                <div className="card-body p-4">
                  <div className="table-responsive">
                    <table className="table align-middle table-hover table-striped">
                      <thead className="bg-light text-dark border-bottom">
                        <tr>
                          <th>#</th>
                          <th>Tên phim</th>
                          <th>Tên thành viên</th>
                          <th>Vai trò</th>
                          <th>Trạng thái</th>
                          <th>Ngày tạo</th>
                          <th className="text-center">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {moviecasts.length > 0 ? (
                          moviecasts.map((cast, index) => (
                            <tr key={cast.CastId} className="table-row-hover">
                              <td>{(page - 1) * PAGE_SIZE + index + 1}</td>
                              <td>{movieMap[cast.MovieId] || cast.MovieId}</td>
                              <td>{cast.Name}</td>
                              <td>
                                {cast.Role === "Actor"
                                  ? "Diễn viên"
                                  : cast.Role === "Director"
                                  ? "Đạo diễn"
                                  : cast.Role}
                              </td>
                              <td>
                                <label className="switch">
                                  <input
                                    type="checkbox"
                                    checked={cast.Status === "Active"}
                                    onChange={() => toggleStatus(cast.CastId, cast.Status)}
                                  />
                                  <span className="slider"></span>
                                </label>
                                <span className={`ms-2 fw-semibold ${cast.Status === "Active" ? "text-success" : "text-danger"}`}>
                                  {cast.Status === "Active" ? "Hoạt động" : "Khóa"}
                                </span>
                              </td>
                              <td>{cast.CreatedAt}</td>
                              <td className="text-center">
                                <button
                                  className="action-btn text-info"
                                  title="Chi tiết"
                                  onClick={() => navigate(`/moviecast/show/${cast.CastId}`)}
                                >
                                  <i className="fas fa-eye"></i>
                                </button>
                                <button
                                  className="action-btn text-primary"
                                  title="Sửa"
                                  onClick={() => navigate(`/moviecast/edit/${cast.CastId}`)}
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button
                                  className="action-btn text-danger"
                                  title="Xóa"
                                  onClick={() => deleteCast(cast.CastId, () => reload())}
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7" className="text-center py-5 text-muted">
                              <i className="fas fa-users fa-2x mb-2 d-block"></i>
                              {search
                                ? `Không tìm thấy kết quả cho "${search}"`
                                : roleFilter
                                  ? `Không có ${roleFilter === "Actor" ? "diễn viên" : "đạo diễn"} nào.`
                                  : "Không có dữ liệu"}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* ✅ Luxury Cinema Pagination */}
                  <CinemaPagination
                    page={page}
                    totalPages={totalPages}
                    total={total}
                    onPageChange={goToPage}
                    label="Thành viên"
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