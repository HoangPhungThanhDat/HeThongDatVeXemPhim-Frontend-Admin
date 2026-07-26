// components/OrderCard.jsx
import React, { useState } from "react";
import { C, fmt, fmtDate } from "../constants";
import StatusChip from "./shared/StatusChip";
import PayChip from "./shared/PayChip";
import Tag from "./shared/Tag";

export default function OrderCard({ order, idx, onView, G }) {
  const [hover, setHover] = useState(false);
  const isNew = order?.isNew || false;
  const isDark = G && G.ink === C.ink;
  const bg = isDark ? G.bgCard : C.bgCard;
  const ink = isDark ? G.ink : C.ink;
  const ink2 = isDark ? G.ink2 : C.ink2;
  const ink3 = isDark ? G.ink3 : C.ink3;
  const ink4 = isDark ? G.ink4 : C.ink4;
  const ink6 = isDark ? G.ink6 : C.ink6;
  const border = hover ? C.or1 : (isNew ? C.or4 : ink6);
  const bgColor = isNew ? C.or3 : bg;

  // ─── Safe data access ──────────────────────────────────────────
  const orderId = order?.OrderId || order?.id || "N/A";
  const customer = order?.customer || order?.FullName || "N/A";
  const phone = order?.phone || order?.Phone || "N/A";
  const movie = order?.movie || order?.Movie || "N/A";
  const cinema = order?.cinema || order?.Cinema || "N/A";
  const room = order?.room || order?.Room || "N/A";
  const showtime = order?.showtime || order?.Showtime || order?.OrderDate || order?.CreatedAt || new Date().toISOString();
  const seats = order?.seats || order?.Seats || ["N/A"];
  const total = order?.total || order?.TotalAmount || order?.Total || 0;
  const combo = order?.combo || order?.Combo || "Không có";
  const status = order?.status || order?.Status || "Chờ thanh toán";
  const payMethod = order?.payMethod || order?.PayMethod || "Chưa cập nhật";
  const notes = order?.notes || order?.Notes || [];

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => onView(order)}
      style={{
        background: bgColor,
        borderRadius: 14,
        border: `1.5px solid ${border}`,
        boxShadow: hover
          ? "0 4px 20px rgba(249,115,22,.12)"
          : isNew
          ? "0 2px 8px rgba(249,115,22,.08)"
          : (isDark ? "0 1px 4px rgba(0,0,0,.3)" : "0 1px 4px rgba(0,0,0,.04)"),
        transition: "all 0.18s",
        cursor: "pointer",
        overflow: "hidden",
        animation: `slideup 0.35s ease ${idx * .04}s both`,
        position: "relative"
      }}
    >
      {isNew && (
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 3,
          bottom: 0,
          background: `linear-gradient(180deg,${C.or1},#fbbf24)`,
          borderRadius: "2px 0 0 2px"
        }} />
      )}
      <div style={{ padding: "14px 14px 14px 18px" }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
          gap: 8
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            {isNew && (
              <span style={{
                padding: "1px 6px",
                borderRadius: 5,
                fontSize: 9.5,
                fontWeight: 800,
                background: C.or1,
                color: "#fff"
              }}>NEW</span>
            )}
            <span style={{
              fontFamily: "monospace",
              fontSize: 12.5,
              fontWeight: 800,
              color: C.or1
            }}>{orderId}</span>
          </div>
          <StatusChip status={status} />
        </div>

        <div style={{ marginBottom: 10 }}>
          <div style={{
            fontSize: 14,
            fontWeight: 800,
            color: ink,
            marginBottom: 3,
            lineHeight: 1.3
          }}>{movie}</div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, color: ink3 }}>👤 {customer}</span>
            <span style={{ fontSize: 12, color: ink4 }}>📱 {phone}</span>
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
          marginBottom: 10
        }}>
          <div style={{
            padding: "8px 10px",
            borderRadius: 9,
            background: isDark ? G.ink6 : C.ink6
          }}>
            <div style={{
              fontSize: 9.5,
              color: ink4,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 0.6,
              marginBottom: 2
            }}>Rạp / Phòng</div>
            <div style={{ fontSize: 11.5, color: ink2, fontWeight: 700 }}>{cinema}</div>
            <div style={{ fontSize: 11, color: ink4 }}>{room}</div>
          </div>
          <div style={{
            padding: "8px 10px",
            borderRadius: 9,
            background: isDark ? G.ink6 : C.ink6
          }}>
            <div style={{
              fontSize: 9.5,
              color: ink4,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 0.6,
              marginBottom: 2
            }}>Suất chiếu</div>
            <div style={{
              fontSize: 11.5,
              color: C.blue,
              fontWeight: 700
            }}>{fmtDate(showtime)}</div>
          </div>
        </div>

        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 8
        }}>
          <div style={{
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
            alignItems: "center"
          }}>
            {Array.isArray(seats) && seats.slice(0, 3).map(s => (
              <Tag key={s} color={C.blue} bg={C.blueBg} border={C.blueBdr}>{s}</Tag>
            ))}
            {Array.isArray(seats) && seats.length > 3 && (
              <Tag color={ink3} bg={isDark ? G.ink6 : C.ink6} border={isDark ? G.ink5 : C.ink5}>
                +{seats.length - 3}
              </Tag>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <PayChip method={payMethod} />
            <span style={{ fontSize: 16, fontWeight: 900, color: C.or1 }}>{fmt(total)}</span>
          </div>
        </div>

        {Array.isArray(notes) && notes.length > 0 && (
          <div style={{ fontSize: 11, color: ink4, marginTop: 8 }}>
            📝 {notes.length} ghi chú nội bộ
          </div>
        )}
      </div>
    </div>
  );
}