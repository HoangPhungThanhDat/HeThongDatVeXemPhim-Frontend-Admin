// src/views/admin/quanlydonhang/utils/exportExcel.js

export const exportOrdersToCSV = (orders) => {
  if (!orders || orders.length === 0) {
    alert("Không có dữ liệu để xuất");
    return;
  }

  const headers = [
    "Mã đơn",
    "Khách hàng",
    "SĐT",
    "Email",
    "Phim",
    "Rạp",
    "Phòng",
    "Suất chiếu",
    "Ghế",
    "Tổng tiền",
    "Phương thức TT",
    "Trạng thái TT",
    "Trạng thái đơn",
    "Thời gian đặt",
  ];

  const rows = orders.map((o) => [
    o.code,
    o.customerName,
    o.customerPhone,
    o.customerEmail,
    o.movieTitle,
    o.cinema,
    o.room,
    o.showtime,
    (o.seats || []).join(", "),
    o.total,
    o.paymentMethod,
    o.paymentStatus,
    o.orderStatus,
    o.createdAt,
  ]);

  const csv = [headers, ...rows]
    .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `don-hang_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};