// src/views/admin/quanlytrangthaighe/utils/seatGenerator.js

import { ROWS, SEATS_PER_ROW } from "../constants";

// ─── Deterministic pseudo-random seat generator ─────────────────────────────
export function generateSeatMap(showtimeId) {
  let seed = 0;
  for (let i = 0; i < showtimeId.length; i++) seed += showtimeId.charCodeAt(i) * (i + 7);
  const rand = (n) => { seed = (seed * 9301 + 49297) % 233280; return (seed / 233280) * n; };

  const seats = [];
  ROWS.forEach((row, ri) => {
    for (let n = 1; n <= SEATS_PER_ROW; n++) {
      const roll = rand(100);
      let status = "trong";
      if (roll < 28) status = "dat";
      else if (roll < 34) status = "giu";
      else if (roll < 38) status = "loi";
      else if (roll < 41) status = "baoTri";
      seats.push({
        id: `${row}${n}`,
        row,
        num: n,
        status,
        heldSince: status === "giu" ? `${5 + Math.floor(rand(14))} phút trước` : null,
        ticketCode: status === "dat" ? `VE${String(1000 + ri * 10 + n)}` : null,
        customer: status === "dat" ? ["Nguyễn Văn An", "Trần Thị Bình", "Lê Hoàng Cường", "Phạm Minh Đức"][Math.floor(rand(4))] : null,
        note: status === "loi" ? "Ghế bị kẹt do timeout thanh toán" : status === "baoTri" ? "Ghế hỏng, đang chờ sửa" : "",
      });
    }
  });
  return seats;
}