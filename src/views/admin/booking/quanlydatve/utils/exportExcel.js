// src/views/admin/quanlydatve/utils/exportExcel.js

export const exportOrdersToExcel = (orders, filename = "DonDatVe") => {
    if (!orders || orders.length === 0) {
      alert("Không có dữ liệu để xuất");
      return;
    }
  
    const data = orders.map((o, i) => ({
      "STT": i + 1,
      "Mã đơn": o.id,
      "Khách hàng": o.customer,
      "Email": o.email,
      "SĐT": o.phone,
      "Phim": o.movie,
      "Rạp": o.cinema || "",
      "Phòng": o.room || "",
      "Suất chiếu": o.showtime || "",
      "Ghế": (o.seats || []).join(", "),
      "Combo": o.combo || "",
      "Tổng tiền": o.total,
      "Phương thức": o.payMethod || "",
      "Trạng thái": o.status,
      "Thanh toán": o.payStatus,
      "Ngày đặt": o.createdAt,
    }));
  
    const headers = Object.keys(data[0] || {});
    const rows = [headers, ...data.map(row => headers.map(h => row[h] || ""))];
    const csv = rows.map(row => row.join(",")).join("\n");
    
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };
  
  export const formatCurrency = (amount) => {
    return amount ? amount.toLocaleString("vi-VN") : "0";
  };
  
  export const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };