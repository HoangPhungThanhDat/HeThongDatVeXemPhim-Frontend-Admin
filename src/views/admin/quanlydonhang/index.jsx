// index.jsx
import React, { useState, useEffect } from "react";
import { useColorMode, useToast } from "@chakra-ui/react";
import { C, DARK, fmt, fmtDate, ORDER_STATUS, getStatusConfig, getPaymentConfig, CINEMAS, MOVIES } from "./constants";
import { STYLES } from "./components/shared/animations";
import { useOrders } from "./hooks/useOrders";
import { exportToExcel } from "./utils/exportExcel";
import PageHeader from "./components/PageHeader";
import StatsRow from "./components/StatsRow";
import FilterBar from "./components/FilterBar";
import OrderCard from "./components/OrderCard";
import OrderRow from "./components/OrderRow";
import OrderDetail from "./components/OrderDetail";
import Btn from "./components/shared/Btn";

export default function QuanLyDonHang() {
  const { colorMode } = useColorMode();
  const toast = useToast();
  const isDark = colorMode === "dark";
  const G = isDark ? DARK : C;

  const {
    orders,
    users,
    promotions,
    loading,
    newCount,
    realtimePulse,
    toastMsg,
    toastFn,
    loadData,
    handleAddNote,
    handleRefund,
    handleMarkSeen,
    getStats,
    getUserName,
    getPromotionTitle,
  } = useOrders();

  const [detail, setDetail] = useState(null);
  const [search, setSearch] = useState("");
  const [fStatus, setFStatus] = useState("Tất cả");
  const [fCinema, setFCinema] = useState("Tất cả");
  const [fMovie, setFMovie] = useState("Tất cả");
  const [fDate, setFDate] = useState("");
  const [tab, setTab] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const isMobile = window.innerWidth < 768;

  // ─── Lấy màu sắc từ G ──────────────────────────────────────────
  const bg = isDark ? G.bg : C.bg;
  const bgCard = isDark ? G.bgCard : C.bgCard;
  const ink = isDark ? G.ink : C.ink;
  const ink2 = isDark ? G.ink2 : C.ink2;
  const ink3 = isDark ? G.ink3 : C.ink3;
  const ink4 = isDark ? G.ink4 : C.ink4;
  const ink5 = isDark ? G.ink5 : C.ink5;
  const ink6 = isDark ? G.ink6 : C.ink6;

  // ─── Helper: Safe toString and toLowerCase ──────────────────────
  const safeString = (value) => {
    if (value === undefined || value === null) return "";
    return String(value);
  };

  const safeLower = (value) => {
    return safeString(value).toLowerCase();
  };

  // ─── Filter orders ──────────────────────────────────────────────
  const filtered = orders.filter(o => {
    const q = search.toLowerCase();
    const userName = safeLower(getUserName(o.UserId));
    const promoTitle = safeLower(getPromotionTitle(o.PromotionId));
    const orderId = safeLower(o.OrderId || o.id);
    const movie = safeLower(o.Movie || o.movie);
    const cinema = safeLower(o.Cinema || o.cinema);
    const phone = safeLower(o.Phone || o.phone);
    const email = safeLower(o.Email || o.email);
    
    const mS = !q || 
      orderId.includes(q) || 
      userName.includes(q) || 
      phone.includes(q) || 
      email.includes(q) ||
      promoTitle.includes(q) ||
      movie.includes(q) ||
      cinema.includes(q);
    
    const status = o.Status || o.status || "";
    const mSt = fStatus === "Tất cả" || status === fStatus;
    const mC = fCinema === "Tất cả" || (o.Cinema || o.cinema || "") === fCinema;
    const mM = fMovie === "Tất cả" || (o.Movie || o.movie || "") === fMovie;
    const mD = !fDate || safeString(o.OrderDate || o.createdAt || o.CreatedAt).startsWith(fDate);
    const mT = tab === "all" || 
      (tab === "new" && o.isNew) || 
      (tab === "refund" && status === "Hoàn tiền") ||
      (tab === "pending" && (status === "Chờ thanh toán" || status === "Pending"));
    
    return mS && mSt && mC && mM && mD && mT;
  });

  const stats = getStats();
  const hasFilter = search || fStatus !== "Tất cả" || fCinema !== "Tất cả" || fMovie !== "Tất cả" || fDate;

  const resetFilters = () => {
    setSearch("");
    setFStatus("Tất cả");
    setFCinema("Tất cả");
    setFMovie("Tất cả");
    setFDate("");
  };

  const handleExport = () => {
    const exportData = filtered.map(o => ({
      ...o,
      CustomerName: getUserName(o.UserId),
      PromotionTitle: getPromotionTitle(o.PromotionId),
    }));
    exportToExcel(exportData, G);
    toastFn("📥 Đã xuất danh sách đơn hàng ra Excel!");
  };

  // Show toast from hook
  useEffect(() => {
    if (toastMsg) {
      toast({
        title: toastMsg,
        status: "info",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  }, [toastMsg, toast]);

  if (loading && orders.length === 0) {
    return (
      <div style={{
        minHeight: "100vh",
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Sora',system-ui,sans-serif"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 50,
            height: 50,
            borderRadius: "50%",
            border: `4px solid ${ink6}`,
            borderTop: `4px solid ${C.or1}`,
            animation: "spin 1s linear infinite",
            margin: "0 auto 20px"
          }} />
          <p style={{ color: ink4 }}>Đang tải danh sách đơn hàng...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: bg,
      fontFamily: "'Sora',system-ui,sans-serif",
      paddingTop: isMobile ? "90px" : "80px",
      paddingLeft: isMobile ? 12 : 20,
      paddingRight: isMobile ? 12 : 20,
      paddingBottom: 60
    }}>
      <style>{STYLES}</style>

      {detail && (
        <OrderDetail
          order={orders.find(o => (o.OrderId || o.id) === (detail.OrderId || detail.id)) || detail}
          onClose={() => setDetail(null)}
          onRefund={handleRefund}
          onAddNote={handleAddNote}
          toastFn={toastFn}
          G={G}
          getUserName={getUserName}
          getPromotionTitle={getPromotionTitle}
        />
      )}

      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <PageHeader
          isMobile={isMobile}
          newCount={newCount}
          realtimePulse={realtimePulse}
          handleMarkSeen={handleMarkSeen}
          handleExport={handleExport}
          G={G}
        />

        <StatsRow 
          stats={stats} 
          filteredCount={filtered.length} 
          G={G}
          fmt={fmt}
        />

        {/* Tabs */}
        <div className="tabs-wrap" style={{
          display: "flex",
          gap: 2,
          marginBottom: 12,
          background: isDark ? G.ink6 : "#e4e4e7",
          borderRadius: 11,
          padding: 3,
          width: isMobile ? "100%" : "fit-content"
        }}>
          {[
            { k: "all", l: "Tất cả", count: orders.length },
            { k: "new", l: "🔔 Mới", count: newCount },
            { k: "pending", l: "⏳ Chờ TT", count: orders.filter(o => (o.Status || o.status) === "Chờ thanh toán" || (o.Status || o.status) === "Pending").length },
            { k: "refund", l: "🔄 Hoàn tiền", count: orders.filter(o => (o.Status || o.status) === "Hoàn tiền").length }
          ].map(t => (
            <button
              key={t.k}
              onClick={() => setTab(t.k)}
              style={{
                flex: isMobile ? 1 : 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
                padding: "7px 14px",
                borderRadius: 8,
                fontSize: isMobile ? 11.5 : 12.5,
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                transition: "all 0.18s",
                background: tab === t.k ? C.or1 : "transparent",
                color: tab === t.k ? "#fff" : ink4,
                boxShadow: tab === t.k ? "0 2px 10px rgba(249,115,22,.35)" : "none",
                whiteSpace: "nowrap"
              }}
            >
              {t.l}
              {t.count > 0 && (
                <span style={{
                  fontSize: 10,
                  fontWeight: 800,
                  padding: "1px 5px",
                  borderRadius: 9,
                  background: tab === t.k ? "rgba(255,255,255,.3)" : ink6,
                  color: tab === t.k ? "#fff" : ink3
                }}>{t.count}</span>
              )}
            </button>
          ))}
        </div>

        <FilterBar
          search={search}
          setSearch={setSearch}
          fStatus={fStatus}
          setFStatus={setFStatus}
          fCinema={fCinema}
          setFCinema={setFCinema}
          fMovie={fMovie}
          setFMovie={setFMovie}
          fDate={fDate}
          setFDate={setFDate}
          hasFilter={hasFilter}
          resetFilters={resetFilters}
          isMobile={isMobile}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          G={G}
          CINEMAS={CINEMAS}
          MOVIES={MOVIES}
        />

        {/* List */}
        <div style={{
          background: bgCard,
          borderRadius: 14,
          border: `1px solid ${isDark ? G.ink6 : C.ink6}`,
          boxShadow: isDark ? "0 2px 8px rgba(0,0,0,.3)" : "0 2px 8px rgba(0,0,0,.04)",
        }}>
          <div style={{ padding: "10px 10px" }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 0", color: ink4 }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>🧾</div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>Không tìm thấy đơn hàng</div>
                <div style={{ fontSize: 12, marginTop: 5 }}>Thử thay đổi bộ lọc</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {filtered.map((order, idx) => {
                  // ─── Chuẩn hóa dữ liệu order ────────────────────
                  const orderData = {
                    ...order,
                    OrderId: order.OrderId || order.id || `GPF-${String(idx + 1).padStart(6, "0")}`,
                    customer: order.FullName || order.Name || order.customer || getUserName(order.UserId) || "Khách hàng",
                    movie: order.Movie || order.movie || "Phim đang cập nhật",
                    cinema: order.Cinema || order.cinema || "Rạp đang cập nhật",
                    room: order.Room || order.room || "Phòng đang cập nhật",
                    phone: order.Phone || order.phone || order.UserId || "N/A",
                    email: order.Email || order.email || "N/A",
                    seats: order.Seats || order.seats || ["Chưa có"],
                    combo: order.Combo || order.combo || "Không có",
                    payMethod: order.PayMethod || order.payMethod || "Chưa cập nhật",
                    notes: order.Notes || order.notes || [],
                    isNew: order.isNew || false,
                    refundReason: order.RefundReason || order.refundReason || "",
                    status: order.Status || order.status || "Chờ thanh toán",
                    total: order.TotalAmount || order.total || 0,
                    OrderDate: order.OrderDate || order.createdAt || order.CreatedAt || new Date().toISOString(),
                    UserId: order.UserId || order.userId || "",
                    PromotionId: order.PromotionId || order.promotionId || null,
                    showtime: order.Showtime || order.showtime || order.OrderDate || order.createdAt || new Date().toISOString(),
                  };
                  
                  return isMobile
                    ? <OrderCard 
                        key={order.OrderId || order.id || idx} 
                        order={orderData} 
                        idx={idx} 
                        onView={() => setDetail(orderData)} 
                        G={G} 
                      />
                    : <OrderRow 
                        key={order.OrderId || order.id || idx} 
                        order={orderData} 
                        idx={idx} 
                        onView={() => setDetail(orderData)} 
                        G={G} 
                      />;
                })}
              </div>
            )}
          </div>

          <div style={{
            padding: "10px 16px",
            borderTop: `1px solid ${isDark ? G.ink6 : C.ink6}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 8
          }}>
            <span style={{ fontSize: 12, color: ink4 }}>
              Hiển thị <strong style={{ color: ink }}>{filtered.length}</strong> / {orders.length} đơn hàng
            </span>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Btn variant="dark" size="sm" icon="📥" onClick={handleExport} G={G}>Xuất Excel</Btn>
              <Btn variant="ghost" size="sm" icon="🔄" onClick={loadData} G={G}>Làm mới</Btn>
              <span style={{ fontSize: 11, color: ink4 }}>Tự động cập nhật · 30s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}