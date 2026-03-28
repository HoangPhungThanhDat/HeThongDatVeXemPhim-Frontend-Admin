import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import MainLayout from "../../layouts/MainLayout";
import Loader from "../../layouts/Loader";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../styles/User.css";
import "../../styles/pagination.css";
import PromotionApi from "../../api/PromotionApi";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import "animate.css";
import { deletePromotion } from "./delete";
import { useServerPagination } from "../../hooks/useServerPagination";

// ─── CSS inject ───────────────────────────────────────────────────────────────
const SEARCH_BAR_CSS = `
.sf-wrap{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:1rem;}
.sf-search-box{
  display:flex;align-items:center;gap:8px;
  background:#fff;
  border:0.5px solid rgba(0,0,0,0.18);
  border-radius:12px;
  padding:0 14px;height:42px;flex:1;min-width:220px;
  transition:border-color .15s;
}
.sf-search-box:focus-within{border-color:rgba(0,0,0,0.38);}
.sf-search-box .sf-icon{flex-shrink:0;opacity:.45;display:flex;align-items:center;}
.sf-search-box input{
  border:none;outline:none;background:transparent;
  font-size:14px;color:inherit;width:100%;min-width:0;
}
.sf-search-box input::placeholder{color:rgba(128,128,128,.65);}
.sf-clear{
  background:none;border:none;cursor:pointer;padding:2px;
  color:rgba(128,128,128,.65);display:flex;align-items:center;
  border-radius:4px;transition:color .15s;
}
.sf-clear:hover{color:inherit;}
.sf-pills{display:flex;gap:6px;flex-wrap:wrap;align-items:center;}
.sf-pill{
  height:42px;padding:0 16px;
  border-radius:12px;
  border:0.5px solid rgba(0,0,0,0.12);
  background:#fff;
  color:rgba(80,80,80,.85);
  font-size:13px;font-weight:400;cursor:pointer;
  display:flex;align-items:center;gap:6px;
  transition:border-color .15s,background .15s,color .15s;
  white-space:nowrap;user-select:none;
}
.sf-pill:hover{border-color:rgba(0,0,0,0.28);color:inherit;}
.sf-pill.pill-all     {background:#f3f3f1;border-color:rgba(0,0,0,0.22);color:#333;font-weight:500;}
.sf-pill.pill-active  {background:#EAF3DE;border-color:#3B6D11;color:#27500A;font-weight:500;}
.sf-pill.pill-inactive{background:#FAEEDA;border-color:#854F0B;color:#633806;font-weight:500;}
.sf-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;}

@media (prefers-color-scheme:dark){
  .sf-search-box{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.15);}
  .sf-search-box:focus-within{border-color:rgba(255,255,255,.32);}
  .sf-search-box input{color:#e2e0d8;}
  .sf-pill{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.12);color:rgba(200,198,192,.9);}
  .sf-pill.pill-all     {background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.25);color:#e2e0d8;}
  .sf-pill.pill-active  {background:#1a2e0f;border-color:#3B6D11;color:#9FE1CB;}
  .sf-pill.pill-inactive{background:#2e1f07;border-color:#854F0B;color:#FAC775;}
}
`;

function injectSearchBarCSS() {
  if (document.getElementById("__sf-promo-css")) return;
  const s = document.createElement("style");
  s.id = "__sf-promo-css";
  s.textContent = SEARCH_BAR_CSS;
  document.head.appendChild(s);
}

const PAGE_SIZE = 10;

const PILL_CONFIG = [
  { key: "",         label: "Tất cả",    cls: "pill-all",      dot: null      },
  { key: "Active",   label: "Hoạt động", cls: "pill-active",   dot: "#3B6D11" },
  { key: "Inactive", label: "Khóa",      cls: "pill-inactive", dot: "#854F0B" },
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
        <input
          type="text"
          placeholder="Tìm theo tên, mã khuyến mãi..."
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

// ─── Row ──────────────────────────────────────────────────────────────────────
const PromotionRow = React.memo(({ promotion, index, onToggle, onNavigate, onDelete }) => (
  <tr className="table-row-hover">
    <td className="fw-bold px-4">{index + 1}</td>
    <td className="fw-semibold">{promotion.Title}</td>
    <td>
      <span className="badge bg-secondary bg-opacity-75 rounded-pill px-3 py-1" style={{ fontSize: 12 }}>
        {promotion.Code}
      </span>
    </td>
    <td>
      {promotion.ImageUrl
        ? <img src={promotion.ImageUrl} alt={promotion.Title} className="img-thumbnail"
            style={{ width: 110, height: 65, objectFit: "cover", borderRadius: 8 }} />
        : <span className="text-muted" style={{ fontSize: 12 }}>Chưa có ảnh</span>}
    </td>
    <td>
      <label className="switch">
        <input type="checkbox" checked={promotion.Status === "Active"} onChange={() => onToggle(promotion.PromotionId)} />
        <span className="slider" />
      </label>
      <span className={`ms-2 fw-semibold ${
        promotion.Status === "Active" ? "text-success"
        : promotion.Status === "Inactive" ? "text-warning"
        : "text-danger"
      }`}>
        {promotion.Status === "Active" ? "Hoạt động"
          : promotion.Status === "Inactive" ? "Khóa"
          : "Cấm"}
      </span>
    </td>
    <td className="text-center">
      <button className="action-btn text-info" title="Chi tiết" onClick={() => onNavigate(`/Promotion/show/${promotion.PromotionId}`)}><i className="fas fa-eye" /></button>
      <button className="action-btn text-primary" title="Sửa" onClick={() => onNavigate(`/Promotion/edit/${promotion.PromotionId}`)}><i className="fas fa-edit" /></button>
      <button className="action-btn text-danger" title="Xóa" onClick={() => onDelete(promotion.PromotionId)}><i className="fas fa-trash" /></button>
    </td>
  </tr>
));

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Promotion() {
  const navigate = useNavigate();
  const [showForm, setShowForm]         = useState(false);
  const [searchInput, setSearchInput]   = useState("");
  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [newPromotion, setNewPromotion] = useState({
    Title: "", Code: "", Description: "", ImageUrl: null,
    DiscountType: "Percentage", DiscountValue: "",
    StartDate: "", EndDate: "", IsActive: true, Status: "Active",
  });

  // ✅ useMemo — tránh object mới mỗi render
  const extraParams = useMemo(
    () => ({ search, status: statusFilter }),
    [search, statusFilter]
  );

  const { data: promotions, total, totalPages, page, loading, goToPage, reload } =
    useServerPagination(PromotionApi.getPaged, { limit: PAGE_SIZE, extraParams });

  // Debounce search 400ms
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const showToast = useCallback((icon, msg) => Swal.fire({
    toast: true, position: "top-end", icon, title: msg,
    showConfirmButton: false, timer: 3000, timerProgressBar: true,
    showClass: { popup: "animate__animated animate__slideInRight" },
    hideClass: { popup: "animate__animated animate__slideOutRight" },
  }), []);

  const toggleStatus = useCallback((id) => {
    const promo = promotions.find((p) => p.PromotionId === id);
    if (!promo) return;
    const fd = new FormData();
    fd.append("Status", promo.Status === "Active" ? "Inactive" : "Active");
    PromotionApi.update(id, fd, { headers: { "Content-Type": "multipart/form-data" } })
      .then(() => reload())
      .catch(() => showToast("error", "❌ Không thể cập nhật trạng thái!"));
  }, [promotions, reload, showToast]);

  const handleNavigate = useCallback((path) => navigate(path), [navigate]);
  const handleDelete   = useCallback((id) => deletePromotion(id, () => reload()), [reload]);
  const handleClear    = useCallback(() => { setSearchInput(""); setSearch(""); }, []);
  const field          = useCallback((k, v) => setNewPromotion((p) => ({ ...p, [k]: v })), []);

  const handleAddPromotion = useCallback(async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(newPromotion).forEach(([k, v]) => {
        if (k === "IsActive") fd.append(k, v ? 1 : 0);
        else if (v !== null && v !== "") fd.append(k, v);
      });
      await PromotionApi.create(fd, { headers: { "Content-Type": "multipart/form-data" } });
      setNewPromotion({ Title: "", Code: "", Description: "", ImageUrl: null, DiscountType: "Percentage", DiscountValue: "", StartDate: "", EndDate: "", IsActive: true, Status: "Active" });
      setShowForm(false);
      reload();
      showToast("success", "🎉 Thêm khuyến mãi thành công!");
    } catch {
      showToast("error", "❌ Thêm khuyến mãi thất bại!");
    }
  }, [newPromotion, reload, showToast]);

  if (loading && promotions.length === 0) return <Loader />;

  return (
    <div><MainLayout><main><div className="main-container"><div className="pd-ltr-20">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 p-3 shadow-sm bg-gradient rounded-4 header-box">
        <h3 className="m-0 text-white fw-bold d-flex align-items-center">
          <i className="fas fa-gift me-2" />Quản lý khuyến mãi
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
        onClear={handleClear}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {/* Số kết quả */}
      <div className="mb-2" style={{ fontSize: 13, color: "var(--bs-secondary-color, #6c757d)", minHeight: 20 }}>
        {loading ? (
          <span><i className="fas fa-spinner fa-spin me-1" />Đang tải...</span>
        ) : (
          <span>
            {search || statusFilter ? `Tìm thấy ${total} khuyến mãi` : `Tổng cộng ${total} khuyến mãi`}
          </span>
        )}
      </div>

      {/* Form thêm */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }} transition={{ duration: 0.35, ease: "easeOut" }}
            className="card border-0 shadow-lg rounded-4 mb-4 form-add-promotion">
            <div className="card-body p-4">
              <h4 className="fw-bold mb-4 text-primary d-flex align-items-center">
                <i className="fas fa-gift me-2" />Thêm khuyến mãi
              </h4>
              <form onSubmit={handleAddPromotion}>
                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="form-label fw-bold"><i className="fas fa-tag me-1 text-primary" />Tên khuyến mãi</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light"><i className="fas fa-tag" /></span>
                      <input type="text" className="form-control custom-input" placeholder="VD: Black Friday..."
                        value={newPromotion.Title} onChange={(e) => field("Title", e.target.value)} required />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold"><i className="fas fa-code me-1 text-success" />Mã khuyến mãi</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light"><i className="fas fa-code" /></span>
                      <input type="text" className="form-control custom-input" placeholder="VD: SALE2024..."
                        value={newPromotion.Code} onChange={(e) => field("Code", e.target.value)} />
                    </div>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold"><i className="fas fa-align-left me-1 text-info" />Mô tả</label>
                    <textarea className="form-control custom-input" rows="3" placeholder="Mô tả chi tiết..."
                      value={newPromotion.Description} onChange={(e) => field("Description", e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold"><i className="fas fa-image me-1 text-warning" />Ảnh</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light"><i className="fas fa-image" /></span>
                      <input type="file" accept="image/*" className="form-control custom-input"
                        onChange={(e) => field("ImageUrl", e.target.files[0])} required />
                    </div>
                    {newPromotion.ImageUrl && (
                      <div className="mt-2 text-center">
                        <img src={URL.createObjectURL(newPromotion.ImageUrl)} alt="preview"
                          className="img-thumbnail" style={{ maxHeight: 150, objectFit: "cover" }} />
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold"><i className="fas fa-percentage me-1 text-danger" />Loại giảm giá</label>
                    <select className="form-select custom-input" value={newPromotion.DiscountType}
                      onChange={(e) => field("DiscountType", e.target.value)} required>
                      <option value="Percentage">Giảm theo %</option>
                      <option value="FixedAmount">Giảm số tiền cố định</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold"><i className="fas fa-dollar-sign me-1 text-success" />Giá trị giảm</label>
                    <input type="number" className="form-control custom-input" placeholder="VD: 20"
                      value={newPromotion.DiscountValue} onChange={(e) => field("DiscountValue", e.target.value)} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold"><i className="fas fa-calendar-alt me-1 text-primary" />Ngày bắt đầu</label>
                    <input type="date" className="form-control custom-input"
                      value={newPromotion.StartDate} onChange={(e) => field("StartDate", e.target.value)} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold"><i className="fas fa-calendar-times me-1 text-danger" />Ngày kết thúc</label>
                    <input type="date" className="form-control custom-input"
                      value={newPromotion.EndDate} onChange={(e) => field("EndDate", e.target.value)} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold"><i className="fas fa-toggle-on me-1 text-success" />Hiệu lực</label>
                    <select className="form-select custom-input" value={String(newPromotion.IsActive)}
                      onChange={(e) => field("IsActive", e.target.value === "true")}>
                      <option value="true">Có hiệu lực</option>
                      <option value="false">Không hiệu lực</option>
                    </select>
                  </div>
                </div>
                <div className="col-12 text-end mt-3">
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
                  <th>Tên chương trình</th>
                  <th>Mã khuyến mãi</th>
                  <th>Hình ảnh</th>
                  <th>Trạng thái</th>
                  <th className="text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {promotions.length > 0 ? promotions.map((promo, i) => (
                  <PromotionRow
                    key={promo.PromotionId}
                    promotion={promo}
                    index={(page - 1) * PAGE_SIZE + i}
                    onToggle={toggleStatus}
                    onNavigate={handleNavigate}
                    onDelete={handleDelete}
                  />
                )) : (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      <i className="fas fa-gift fa-2x mb-2 d-block" />
                      {search
                        ? `Không tìm thấy kết quả cho "${search}"`
                        : statusFilter
                          ? "Không có khuyến mãi nào ở trạng thái này."
                          : "Không có khuyến mãi nào."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <CinemaPagination
            page={page} totalPages={totalPages} total={total}
            onPageChange={goToPage} label="Khuyến mãi"
          />
        </div>
      </div>

    </div></div></main></MainLayout></div>
  );
}