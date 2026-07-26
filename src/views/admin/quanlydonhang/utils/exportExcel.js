// utils/exportExcel.js
export function exportToExcel(orders, G) {
    const data = orders.map((o, i) => ({
      "STT": i + 1,
      "Mã đơn hàng": o.id,
      "Khách hàng": o.customer,
      "SĐT": o.phone,
      "Email": o.email,
      "Phim": o.movie,
      "Rạp": o.cinema,
      "Phòng": o.room,
      "Suất chiếu": o.showtime,
      "Ghế": o.seats.join(", "),
      "Combo": o.combo,
      "Tổng tiền": o.total,
      "Phương thức": o.payMethod,
      "Trạng thái": o.status,
      "Ngày đặt": o.createdAt,
    }));
  
    const headers = Object.keys(data[0] || {});
    const rows = [headers, ...data.map(row => headers.map(h => row[h] || ""))];
    const csv = rows.map(row => row.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `DonHang_GauPhim_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }