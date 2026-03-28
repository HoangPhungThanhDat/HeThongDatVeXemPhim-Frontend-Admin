import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import MainLayout from "../../layouts/MainLayout";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../styles/User.css";
import "../../styles/pagination.css";
import MovieApi from "../../api/MovieApi";
import GenreApi from "../../api/GenreApi";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import "animate.css";
import Loader from "../../layouts/Loader";
import { deleteMovie } from "./delete";
import { useServerPagination } from "../../hooks/useServerPagination";

// ─── CSS inject (search + filter bar) ────────────────────────────────────────
const SEARCH_BAR_CSS = `
.sf-wrap { display:flex; gap:10px; align-items:center; flex-wrap:wrap; margin-bottom:1rem; }
.sf-search-box {
  display:flex; align-items:center; gap:8px;
  background:#fff;
  border:0.5px solid rgba(0,0,0,0.18);
  border-radius:12px;
  padding:0 14px; height:42px; flex:1; min-width:220px;
  transition:border-color .15s;
}
.sf-search-box:focus-within { border-color:rgba(0,0,0,0.38); }
.sf-search-box .sf-icon { flex-shrink:0; opacity:.45; display:flex; align-items:center; }
.sf-search-box input {
  border:none; outline:none; background:transparent;
  font-size:14px; color:inherit; width:100%; min-width:0;
}
.sf-search-box input::placeholder { color:rgba(128,128,128,.65); }
.sf-clear {
  background:none; border:none; cursor:pointer; padding:2px;
  color:rgba(128,128,128,.65); display:flex; align-items:center;
  border-radius:4px; transition:color .15s;
}
.sf-clear:hover { color:inherit; }
.sf-pills { display:flex; gap:6px; flex-wrap:wrap; align-items:center; }
.sf-pill {
  height:42px; padding:0 16px;
  border-radius:12px;
  border:0.5px solid rgba(0,0,0,0.12);
  background:#fff;
  color:rgba(80,80,80,.85);
  font-size:13px; font-weight:400; cursor:pointer;
  display:flex; align-items:center; gap:6px;
  transition:border-color .15s, background .15s, color .15s;
  white-space:nowrap; user-select:none;
}
.sf-pill:hover { border-color:rgba(0,0,0,0.28); color:inherit; }
.sf-pill.pill-all   { background:#f3f3f1; border-color:rgba(0,0,0,0.22); color:#333; font-weight:500; }
.sf-pill.pill-now   { background:#EAF3DE; border-color:#3B6D11; color:#27500A; font-weight:500; }
.sf-pill.pill-soon  { background:#FAEEDA; border-color:#854F0B; color:#633806; font-weight:500; }
.sf-pill.pill-ended { background:#F1EFE8; border-color:#5F5E5A; color:#444441; font-weight:500; }
.sf-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; }

@media (prefers-color-scheme: dark) {
  .sf-search-box { background:rgba(255,255,255,.06); border-color:rgba(255,255,255,.15); }
  .sf-search-box:focus-within { border-color:rgba(255,255,255,.32); }
  .sf-search-box input { color:#e2e0d8; }
  .sf-pill { background:rgba(255,255,255,.06); border-color:rgba(255,255,255,.12); color:rgba(200,198,192,.9); }
  .sf-pill.pill-all   { background:rgba(255,255,255,.1); border-color:rgba(255,255,255,.25); color:#e2e0d8; }
  .sf-pill.pill-now   { background:#1a2e0f; border-color:#3B6D11; color:#9FE1CB; }
  .sf-pill.pill-soon  { background:#2e1f07; border-color:#854F0B; color:#FAC775; }
  .sf-pill.pill-ended { background:#1e1d1b; border-color:#5F5E5A; color:#B4B2A9; }
}
`;

function injectSearchBarCSS() {
  if (document.getElementById("__sf-css")) return;
  const s = document.createElement("style");
  s.id = "__sf-css";
  s.textContent = SEARCH_BAR_CSS;
  document.head.appendChild(s);
}

const PAGE_SIZE = 10;

const PILL_CONFIG = [
  { key: "",            label: "Tất cả",      cls: "pill-all",   dot: null },
  { key: "NowShowing",  label: "Đang chiếu",  cls: "pill-now",   dot: "#3B6D11" },
  { key: "ComingSoon",  label: "Sắp chiếu",   cls: "pill-soon",  dot: "#854F0B" },
  { key: "Ended",       label: "Đã kết thúc", cls: "pill-ended", dot: "#5F5E5A" },
];

const STATUS_MAP = {
  NowShowing: { label: "Đang chiếu",  cls: "text-success" },
  ComingSoon:  { label: "Sắp chiếu",   cls: "text-warning" },
  Ended:       { label: "Đã kết thúc", cls: "text-secondary" },
};

// ─── Search + Filter Bar ──────────────────────────────────────────────────────
const SearchFilterBar = React.memo(({ searchInput, onSearchChange, onClear, statusFilter, onStatusChange }) => {
  useEffect(() => { injectSearchBarCSS(); }, []);

  return (
    <div className="sf-wrap">
      {/* Search box */}
      <div className="sf-search-box">
        <span className="sf-icon">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M10 10L13.5 13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Tìm theo tên phim, mô tả..."
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchInput && (
          <button className="sf-clear" onClick={onClear} title="Xóa">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {/* Status pills */}
      <div className="sf-pills">
        {PILL_CONFIG.map(({ key, label, cls, dot }) => (
          <button
            key={key}
            className={`sf-pill${statusFilter === key ? ` ${cls}` : ""}`}
            onClick={() => onStatusChange(key)}
          >
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
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M6.5 2L3.5 5L6.5 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {getPages().map((p, i) => p === "..." ? <span key={`e${i}`} className="cp-ellipsis">···</span> : (
              <button key={p} className={`cp-page${p === page ? " cp-active" : ""}`}
                onClick={(e) => { if (p !== page) { ripple(e); onPageChange(p); } }}>{p}</button>
            ))}
          </div>
          <button className="cp-nav" disabled={page === totalPages} onClick={() => page < totalPages && onPageChange(page + 1)}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M3.5 2L6.5 5L3.5 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
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

// ─── Movie Row ────────────────────────────────────────────────────────────────
const MovieRow = React.memo(({ movie, index, genreMap, onNavigate, onDelete }) => {
  const { label, cls } = STATUS_MAP[movie.Status] ?? { label: movie.Status, cls: "text-muted" };
  return (
    <tr className="table-row-hover">
      <td className="fw-bold px-4">{index + 1}</td>
      <td className="fw-semibold">{movie.Title}</td>
      <td>
        {movie.PosterUrl
          ? <img src={movie.PosterUrl} alt="poster" style={{ width: 55, height: 75, objectFit: "cover", borderRadius: 6 }} />
          : <span className="text-muted" style={{ fontSize: 12 }}>Chưa có</span>}
      </td>
      <td className="text-muted">{genreMap[movie.GenreId] ?? movie.GenreId}</td>
      <td className="text-muted">{movie.Duration} phút</td>
      <td><span className={`fw-semibold ${cls}`}>{label}</span></td>
      <td className="text-center">
        <button className="action-btn text-info" title="Chi tiết" onClick={() => onNavigate(`/movie/show/${movie.MovieId}`)}><i className="fas fa-eye" /></button>
        <button className="action-btn text-primary" title="Sửa" onClick={() => onNavigate(`/movie/edit/${movie.MovieId}`)}><i className="fas fa-edit" /></button>
        <button className="action-btn text-danger" title="Xóa" onClick={() => onDelete(movie.MovieId)}><i className="fas fa-trash" /></button>
      </td>
    </tr>
  );
});

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Movie() {
  const navigate = useNavigate();
  const [genres, setGenres]               = useState([]);
  const [showForm, setShowForm]           = useState(false);
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [searchInput, setSearchInput]     = useState("");
  const [search, setSearch]               = useState("");
  const [statusFilter, setStatusFilter]   = useState("");

  const [newMovie, setNewMovie] = useState({
    Title: "", Description: "", GenreId: "", Duration: "",
    ReleaseDate: "", PosterUrl: "", TrailerUrl: "",
    Language: [], Rated: "", Status: "",
  });

  // ✅ useMemo — tránh tạo object mới mỗi render
  const extraParams = useMemo(
    () => ({ search, status: statusFilter }),
    [search, statusFilter]
  );

  const { data: movies, total, totalPages, page, loading, goToPage, reload } =
    useServerPagination(MovieApi.getPaged, { limit: PAGE_SIZE, extraParams });

  const genreMap = useMemo(() => {
    const map = {};
    genres.forEach((g) => { map[g.GenreId] = g.Name; });
    return map;
  }, [genres]);

  // Debounce search 400ms
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    GenreApi.getAll()
      .then((res) => setGenres(res.data.data))
      .catch((err) => console.error("Lỗi load thể loại:", err));
  }, []);

  const showToast = useCallback((icon, message) => Swal.fire({
    toast: true, position: "top-end", icon, title: message,
    showConfirmButton: false, timer: 3000, timerProgressBar: true,
    showClass: { popup: "animate__animated animate__slideInRight" },
    hideClass: { popup: "animate__animated animate__slideOutRight" },
  }), []);

  const handleNavigate = useCallback((path) => navigate(path), [navigate]);
  const handleDelete   = useCallback((id) => deleteMovie(id, () => reload()), [reload]);
  const field          = useCallback((k, v) => setNewMovie((p) => ({ ...p, [k]: v })), []);

  const handleLanguageChange = useCallback((lang) => {
    setNewMovie((prev) => ({
      ...prev,
      Language: prev.Language.includes(lang)
        ? prev.Language.filter((l) => l !== lang)
        : [...prev.Language, lang],
    }));
  }, []);

  const generateSlug = (title) =>
    title.toLowerCase().normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "").replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-")
      .replace(/-+/g, "-").trim();

  const handleAddMovie = useCallback(async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("Title",       newMovie.Title);
      formData.append("Slug",        generateSlug(newMovie.Title));
      formData.append("Description", newMovie.Description);
      formData.append("GenreId",     newMovie.GenreId);
      formData.append("Duration",    newMovie.Duration);
      formData.append("ReleaseDate", newMovie.ReleaseDate);
      formData.append("TrailerUrl",  newMovie.TrailerUrl);
      formData.append("Language",    JSON.stringify(newMovie.Language));
      formData.append("Rated",       newMovie.Rated);
      if (selectedPoster) formData.append("PosterUrl", selectedPoster);

      await MovieApi.create(formData, { headers: { "Content-Type": "multipart/form-data" } });

      setNewMovie({ Title: "", Description: "", GenreId: "", Duration: "", ReleaseDate: "", PosterUrl: "", TrailerUrl: "", Language: [], Rated: "", Status: "" });
      setSelectedPoster(null);
      setShowForm(false);
      reload();
      showToast("success", "🎉 Thêm phim thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm phim:", error);
      showToast("error", "❌ Thêm thất bại!");
    }
  }, [newMovie, selectedPoster, reload, showToast]);

  const handleClearSearch = useCallback(() => {
    setSearchInput("");
    setSearch("");
  }, []);

  if (loading && movies.length === 0) return <Loader />;

  return (
    <div><MainLayout><main><div className="main-container"><div className="pd-ltr-20">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 p-3 shadow-sm bg-gradient rounded-4 header-box">
        <h3 className="m-0 text-white fw-bold d-flex align-items-center">
          <i className="fas fa-film me-2" />Quản lý phim
        </h3>
        <div>
          <button className="btn btn-light me-2 shadow-sm rounded-pill px-3 fw-semibold" onClick={() => setShowForm(!showForm)}>
            <i className="fas fa-plus me-1 text-success" />Thêm
          </button>
          <button className="btn btn-outline-light shadow-sm rounded-pill px-3 fw-semibold">
            <i className="fas fa-trash me-1 text-danger" />Thùng rác
          </button>
        </div>
      </div>

      {/* ✅ Search + Filter Bar đẹp */}
      <SearchFilterBar
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        onClear={handleClearSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {/* Số kết quả + trạng thái loading */}
      <div className="mb-2" style={{ fontSize: 13, color: "var(--bs-secondary-color, #6c757d)", minHeight: 20 }}>
        {loading ? (
          <span><i className="fas fa-spinner fa-spin me-1" />Đang tải...</span>
        ) : (
          <span>
            {search || statusFilter
              ? `Tìm thấy ${total} phim`
              : `Tổng cộng ${total} phim`}
          </span>
        )}
      </div>

      {/* Form thêm phim */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }} transition={{ duration: 0.35, ease: "easeOut" }}
            className="card border-0 shadow-lg rounded-4 mb-4 form-add-user"
          >
            <div className="card-body p-4">
              <h4 className="fw-bold mb-4 text-primary d-flex align-items-center">
                <i className="fas fa-film me-2" />Thêm phim mới
              </h4>
              <form onSubmit={handleAddMovie}>
                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="form-label fw-bold"><i className="fas fa-ticket-alt me-2 text-primary" />Tên phim</label>
                    <input type="text" className="form-control custom-input" placeholder="VD: Avengers: Endgame"
                      value={newMovie.Title} onChange={(e) => field("Title", e.target.value)} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold"><i className="fas fa-theater-masks me-2 text-danger" />Thể loại</label>
                    <select className="form-select custom-input" value={newMovie.GenreId} onChange={(e) => field("GenreId", e.target.value)} required>
                      <option value="">-- Chọn thể loại --</option>
                      {genres.map((g) => <option key={g.GenreId} value={g.GenreId}>{g.Name}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold"><i className="fas fa-clock me-2 text-success" />Thời lượng (phút)</label>
                    <input type="number" className="form-control custom-input" placeholder="VD: 120" min="1"
                      value={newMovie.Duration} onChange={(e) => field("Duration", e.target.value)} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold"><i className="fas fa-calendar-alt me-2 text-warning" />Ngày phát hành</label>
                    <input type="date" className="form-control custom-input"
                      value={newMovie.ReleaseDate} onChange={(e) => field("ReleaseDate", e.target.value)} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold"><i className="fas fa-user-shield me-2 text-info" />Giới hạn độ tuổi</label>
                    <select className="form-select custom-input" value={newMovie.Rated} onChange={(e) => field("Rated", e.target.value)} required>
                      <option value="">-- Chọn giới hạn độ tuổi --</option>
                      <option value="P">P - Phổ biến (Mọi lứa tuổi)</option>
                      <option value="C13">C13 - Trên 13 tuổi</option>
                      <option value="C16">C16 - Trên 16 tuổi</option>
                      <option value="C18">C18 - Trên 18 tuổi</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold"><i className="fas fa-play-circle me-2 text-danger" />Trailer YouTube ID</label>
                    <input type="text" className="form-control custom-input" placeholder="VD: dQw4w9WgXcQ"
                      value={newMovie.TrailerUrl} onChange={(e) => field("TrailerUrl", e.target.value.trim())} required />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold"><i className="fas fa-align-left me-2 text-primary" />Mô tả phim</label>
                    <textarea className="form-control custom-input" rows="4"
                      placeholder="Nhập mô tả chi tiết về cốt truyện, diễn viên, đạo diễn..."
                      value={newMovie.Description} onChange={(e) => field("Description", e.target.value)} required />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold"><i className="fas fa-language me-2 text-success" />Ngôn ngữ phụ đề</label>
                    <div className="d-flex gap-3">
                      {["Vietsub", "Lồng tiếng", "Phụ đề Anh"].map((lang) => (
                        <div key={lang} className="form-check">
                          <input type="checkbox" className="form-check-input" id={lang}
                            checked={newMovie.Language.includes(lang)}
                            onChange={() => handleLanguageChange(lang)} />
                          <label className="form-check-label" htmlFor={lang}>{lang}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold"><i className="fas fa-image me-2 text-warning" />Ảnh poster</label>
                    <input type="file" className="form-control custom-input" accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) { setSelectedPoster(file); field("PosterUrl", URL.createObjectURL(file)); }
                      }} required />
                    {newMovie.PosterUrl && (
                      <div className="mt-3">
                        <img src={newMovie.PosterUrl} alt="preview" style={{ maxWidth: 160, borderRadius: 8 }} />
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-12 text-end mt-4">
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} type="submit"
                    className="btn btn-gradient-success me-2 rounded-pill px-4">
                    <i className="fas fa-save me-1" />Lưu
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} type="button"
                    className="btn btn-gradient-secondary rounded-pill px-4" onClick={() => setShowForm(false)}>
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
                <tr>
                  <th className="px-4">STT</th>
                  <th>Tên phim</th>
                  <th>Poster</th>
                  <th>Thể loại</th>
                  <th>Thời lượng</th>
                  <th>Trạng thái</th>
                  <th className="text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {movies.length > 0 ? movies.map((movie, i) => (
                  <MovieRow
                    key={movie.MovieId}
                    movie={movie}
                    index={(page - 1) * PAGE_SIZE + i}
                    genreMap={genreMap}
                    onNavigate={handleNavigate}
                    onDelete={handleDelete}
                  />
                )) : (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-muted">
                      <i className="fas fa-film fa-2x mb-2 d-block" />
                      {search
                        ? `Không tìm thấy phim cho "${search}"`
                        : statusFilter
                          ? `Không có phim nào ở trạng thái này.`
                          : "Không có phim nào."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <CinemaPagination
            page={page} totalPages={totalPages} total={total}
            onPageChange={goToPage} label="Phim"
          />
        </div>
      </div>

    </div></div></main></MainLayout></div>
  );
}