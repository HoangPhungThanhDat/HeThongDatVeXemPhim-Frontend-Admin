// components/OrderRow.jsx
import React, { useState } from "react";
import { C, fmt, fmtDate } from "../constants";
import Btn from "./shared/Btn";
import StatusChip from "./shared/StatusChip";
import PayChip from "./shared/PayChip";
import Tag from "./shared/Tag";

export default function OrderRow({ order, idx, onView, G }) {
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
  const createdAt = order?.createdAt || order?.CreatedAt || order?.OrderDate || new Date().toISOString();

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => onView(order)}
      style={{
        background: bgColor,
        borderRadius: 12,
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
      <div style={{
        padding: "12px 14px 12px 18px",
        display: "grid",
        gridTemplateColumns: "140px 1fr 160px 110px 110px 140px 110px",
        gap: 10,
        alignItems: "center"
      }}>
        <div>
          {isNew && (
            <span style={{
              padding: "1px 6px",
              borderRadius: 5,
              fontSize: 9.5,
              fontWeight: 800,
              background: C.or1,
              color: "#fff",
              display: "inline-block",
              marginBottom: 3
            }}>NEW</span>
          )}
          <div style={{
            fontFamily: "monospace",
            fontSize: 12,
            fontWeight: 700,
            color: C.or1
          }}>{orderId}</div>
          <div style={{ fontSize: 10, color: ink4, marginTop: 2 }}>{fmtDate(createdAt)}</div>
        </div>

        <div>
          <div style={{
            fontSize: 13,
            fontWeight: 700,
            color: ink,
            marginBottom: 2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}>{movie}</div>
          <div style={{ fontSize: 12, color: ink3 }}>👤 {customer}</div>
          <div style={{ fontSize: 11, color: ink4 }}>📱 {phone}</div>
        </div>

        <div>
          <div style={{
            fontSize: 11.5,
            fontWeight: 700,
            color: ink2,
            marginBottom: 2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}>{cinema}</div>
          <div style={{ fontSize: 11, color: ink4 }}>{room}</div>
          <div style={{ fontSize: 11, color: C.blue, fontWeight: 600 }}>{fmtDate(showtime)}</div>
        </div>

        <div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            {Array.isArray(seats) && seats.slice(0, 3).map(s => (
              <Tag key={s} color={C.blue} bg={C.blueBg} border={C.blueBdr}>{s}</Tag>
            ))}
            {Array.isArray(seats) && seats.length > 3 && (
              <Tag color={ink3} bg={isDark ? G.ink6 : C.ink6} border={isDark ? G.ink5 : C.ink5}>
                +{seats.length - 3}
              </Tag>
            )}
          </div>
          <div style={{ fontSize: 10, color: ink4, marginTop: 4 }}>{Array.isArray(seats) ? seats.length : 0} ghế</div>
        </div>

        <div>
          <div style={{
            fontSize: 15,
            fontWeight: 900,
            color: C.or1,
            letterSpacing: "-0.5px"
          }}>{fmt(total)}</div>
          {combo !== "Không có" && combo !== "Không có combo" && (
            <div style={{ fontSize: 10, color: C.or2, marginTop: 2, fontWeight: 600 }}>🍿 Combo</div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <StatusChip status={status} />
          <PayChip method={payMethod} />
        </div>

        <div onClick={e => e.stopPropagation()} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <Btn variant="primary" size="xs" icon="👁" onClick={() => onView(order)} G={G}>Chi tiết</Btn>
          {Array.isArray(notes) && notes.length > 0 && (
            <div style={{ fontSize: 10, color: ink4, textAlign: "center" }}>📝 {notes.length} ghi chú</div>
          )}
        </div>
      </div>
    </div>
  );
}