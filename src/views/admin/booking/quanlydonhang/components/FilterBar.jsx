// components/FilterBar.jsx
import React from "react";
import { C } from "../constants";
import Btn from "./shared/Btn";
import Badge from "./shared/Badge";

export default function FilterBar({
  search, setSearch,
  fStatus, setFStatus,
  fCinema, setFCinema,
  fMovie, setFMovie,
  fDate, setFDate,
  hasFilter, resetFilters,
  isMobile, showFilters, setShowFilters,
  G,
  CINEMAS = [],
  MOVIES = []
}) {
  const isDark = G && G.ink === C.ink;
  const bgCard = isDark ? G.bgCard : C.bgCard;
  const ink = isDark ? G.ink : C.ink;
  const ink3 = isDark ? G.ink3 : C.ink3;
  const ink4 = isDark ? G.ink4 : C.ink4;
  const ink5 = isDark ? G.ink5 : C.ink5;
  const ink6 = isDark ? G.ink6 : C.ink6;

  return (
    <div style={{
      background: bgCard,
      borderRadius: 14,
      border: `1px solid ${ink6}`,
      boxShadow: isDark ? "0 2px 8px rgba(0,0,0,.3)" : "0 2px 8px rgba(0,0,0,.04)",
      marginBottom: 12,
      overflow: "hidden"
    }}>
      <div style={{
        padding: "12px 14px",
        borderBottom: `1px solid ${ink6}`,
        display: "flex",
        gap: 10,
        alignItems: "center",
        flexWrap: "wrap"
      }}>
        <div style={{ position: "relative", flex: "1 1 220px", minWidth: 0 }}>
          <span style={{
            position: "absolute",
            left: 10,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 13,
            pointerEvents: "none"
          }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm mã đơn, tên khách, SĐT, email..."
            style={{
              width: "100%",
              height: 38,
              paddingLeft: 32,
              paddingRight: 10,
              borderRadius: 9,
              fontSize: 12.5,
              fontWeight: 500,
              background: isDark ? G.ink6 : "#fafafa",
              border: `1.5px solid ${ink5}`,
              outline: "none",
              color: ink
            }}
            onFocus={e => e.target.style.border = `1.5px solid ${C.or1}`}
            onBlur={e => e.target.style.border = `1.5px solid ${ink5}`}
          />
        </div>

        {isMobile ? (
          <button
            onClick={() => setShowFilters(v => !v)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              height: 38,
              padding: "0 14px",
              borderRadius: 9,
              fontSize: 12,
              fontWeight: 700,
              border: `1.5px solid ${showFilters ? C.or1 : ink5}`,
              background: showFilters ? C.or3 : (isDark ? G.ink6 : "#fafafa"),
              color: showFilters ? C.or1 : ink3,
              cursor: "pointer"
            }}
          >
            ⚙️ Lọc {hasFilter && <Badge count={[fStatus !== "Tất cả", fCinema !== "Tất cả", fMovie !== "Tất cả", !!fDate].filter(Boolean).length} />}
          </button>
        ) : (
          <>
            <select
              value={fStatus}
              onChange={e => setFStatus(e.target.value)}
              style={{
                flex: "0 1 150px",
                height: 38,
                padding: "0 10px",
                borderRadius: 9,
                fontSize: 12.5,
                fontWeight: 600,
                background: isDark ? G.ink6 : "#fafafa",
                border: `1.5px solid ${ink5}`,
                outline: "none",
                color: ink3,
                cursor: "pointer"
              }}
              onFocus={e => e.target.style.border = `1.5px solid ${C.or1}`}
              onBlur={e => e.target.style.border = `1.5px solid ${ink5}`}
            >
              <option>Tất cả</option>
              <option>Đã thanh toán</option>
              <option>Chờ thanh toán</option>
              <option>Đã hủy</option>
              <option>Hoàn tiền</option>
              <option>Đang xử lý</option>
              <option>Đã check-in</option>
            </select>

            <select
              value={fCinema}
              onChange={e => setFCinema(e.target.value)}
              style={{
                flex: "0 1 170px",
                height: 38,
                padding: "0 10px",
                borderRadius: 9,
                fontSize: 12.5,
                fontWeight: 600,
                background: isDark ? G.ink6 : "#fafafa",
                border: `1.5px solid ${ink5}`,
                outline: "none",
                color: ink3,
                cursor: "pointer"
              }}
              onFocus={e => e.target.style.border = `1.5px solid ${C.or1}`}
              onBlur={e => e.target.style.border = `1.5px solid ${ink5}`}
            >
              <option>Tất cả</option>
              {CINEMAS.map(c => <option key={c}>{c}</option>)}
            </select>

            <select
              value={fMovie}
              onChange={e => setFMovie(e.target.value)}
              style={{
                flex: "1 1 160px",
                height: 38,
                padding: "0 10px",
                borderRadius: 9,
                fontSize: 12.5,
                fontWeight: 600,
                background: isDark ? G.ink6 : "#fafafa",
                border: `1.5px solid ${ink5}`,
                outline: "none",
                color: ink3,
                cursor: "pointer"
              }}
              onFocus={e => e.target.style.border = `1.5px solid ${C.or1}`}
              onBlur={e => e.target.style.border = `1.5px solid ${ink5}`}
            >
              <option>Tất cả</option>
              {MOVIES.map(m => <option key={m}>{m}</option>)}
            </select>

            <input
              type="date"
              value={fDate}
              onChange={e => setFDate(e.target.value)}
              style={{
                flex: "0 1 145px",
                height: 38,
                padding: "0 10px",
                borderRadius: 9,
                fontSize: 12.5,
                fontWeight: 600,
                background: isDark ? G.ink6 : "#fafafa",
                border: `1.5px solid ${ink5}`,
                outline: "none",
                color: ink3,
                cursor: "pointer"
              }}
              onFocus={e => e.target.style.border = `1.5px solid ${C.or1}`}
              onBlur={e => e.target.style.border = `1.5px solid ${ink5}`}
            />

            {hasFilter && (
              <Btn variant="ghost" size="sm" onClick={resetFilters} G={G}>✕ Xóa</Btn>
            )}
          </>
        )}
      </div>

      {/* Mobile filters expanded */}
      {isMobile && showFilters && (
        <div style={{
          padding: "12px 14px",
          borderBottom: `1px solid ${ink6}`,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          animation: "slidein 0.2s ease"
        }}>
          {[
            { label: "Trạng thái", val: fStatus, set: setFStatus, opts: ["Tất cả", "Đã thanh toán", "Chờ thanh toán", "Đã hủy", "Hoàn tiền", "Đang xử lý", "Đã check-in"] },
            { label: "Rạp chiếu", val: fCinema, set: setFCinema, opts: ["Tất cả", ...CINEMAS] },
            { label: "Phim", val: fMovie, set: setFMovie, opts: ["Tất cả", ...MOVIES] },
          ].map(f => (
            <div key={f.label}>
              <div style={{
                fontSize: 10,
                fontWeight: 800,
                color: ink4,
                textTransform: "uppercase",
                letterSpacing: "0.8px",
                marginBottom: 5
              }}>{f.label}</div>
              <select
                value={f.val}
                onChange={e => f.set(e.target.value)}
                style={{
                  width: "100%",
                  height: 40,
                  padding: "0 12px",
                  borderRadius: 9,
                  fontSize: 13,
                  fontWeight: 600,
                  background: isDark ? G.ink6 : "#fafafa",
                  border: `1.5px solid ${ink5}`,
                  outline: "none",
                  color: ink3,
                  cursor: "pointer"
                }}
              >
                {f.opts.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
          <div>
            <div style={{
              fontSize: 10,
              fontWeight: 800,
              color: ink4,
              textTransform: "uppercase",
              letterSpacing: "0.8px",
              marginBottom: 5
            }}>Ngày đặt</div>
            <input
              type="date"
              value={fDate}
              onChange={e => setFDate(e.target.value)}
              style={{
                width: "100%",
                height: 40,
                padding: "0 12px",
                borderRadius: 9,
                fontSize: 13,
                fontWeight: 600,
                background: isDark ? G.ink6 : "#fafafa",
                border: `1.5px solid ${ink5}`,
                outline: "none",
                color: ink3,
                cursor: "pointer"
              }}
            />
          </div>
          {hasFilter && (
            <Btn variant="danger" size="sm" full onClick={resetFilters} G={G}>
              ✕ Xóa tất cả bộ lọc
            </Btn>
          )}
        </div>
      )}

      {/* Desktop column headers */}
      {!isMobile && (
        <div className="desktop-only" style={{
          padding: "8px 18px 8px 20px",
          background: isDark ? G.ink6 : "#fafafa",
          borderBottom: `1px solid ${ink6}`,
          display: "grid",
          gridTemplateColumns: "140px 1fr 160px 110px 110px 140px 110px",
          gap: 10,
          alignItems: "center"
        }}>
          {["Mã đơn hàng", "Phim & Khách hàng", "Rạp / Suất", "Ghế", "Giá", "Thanh toán", "Thao tác"].map(col => (
            <div key={col} style={{
              fontSize: 9.5,
              fontWeight: 900,
              color: ink4,
              textTransform: "uppercase",
              letterSpacing: "1px"
            }}>{col}</div>
          ))}
        </div>
      )}
    </div>
  );
}