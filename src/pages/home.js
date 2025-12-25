import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import Loader from "../layouts/Loader";
import { FiSearch } from "react-icons/fi";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";
import { BsGraphUp, BsTag, BsPeople, BsReceipt } from "react-icons/bs";
const Home = () => {
  const [loading, setLoading] = useState(true);
  const [chartKeys, setChartKeys] = useState({});
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  // Hàm tạo keys tự động
  const generateChartKeys = () => {
    const now = Date.now();
    return {
      mini1: now + "-mini1",
      mini2: now + "-mini2",
      mini3: now + "-mini3",
      mini4: now + "-mini4",
      monthly: now + "-monthly",
      pie1: now + "-pie1",
      barYear: now + "-bar-year",
      expenses: now + "-exp",
      budget: now + "-bud",
      balance: now + "-bal",
    };
  };

  const refreshCharts = () => {
    setChartKeys(generateChartKeys());
  };

  useEffect(() => {
    refreshCharts(); // refresh ngay khi mount
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  // Data cho các biểu đồ
  // 🎯 Dữ liệu mẫu
  const phimNoiBat = [
    { id: "01", name: "Avengers: Hồi Kết", color: "#3b82f6", value: 90 },
    { id: "02", name: "Spider-Man: No Way Home", color: "#10b981", value: 75 },
    {
      id: "03",
      name: "Ninja Rùa: Hỗn Loạn Tuổi Dậy Thì",
      color: "#a855f7",
      value: 60,
    },
    { id: "04", name: "Inside Out 2", color: "#f59e0b", value: 80 },
  ];

  // 🌍 2️⃣ Doanh thu theo quốc gia (nếu hệ thống có nhiều rạp quốc tế)
  const doanhThuQuocGia = [
    { name: "Mỹ", value: 400 },
    { name: "Việt Nam", value: 350 },
    { name: "Nhật Bản", value: 300 },
    { name: "Hàn Quốc", value: 250 },
    { name: "Pháp", value: 200 },
  ];

  const MAU = ["#3b82f6", "#10b981", "#a855f7", "#f59e0b", "#ef4444"];

  // 🎟️ 3️⃣ Số lượng vé bán & dịch vụ khách hàng mỗi tháng
  const veDichVu = [
    { name: "Tháng 1", Ve: 1200, DichVu: 900 },
    { name: "Tháng 2", Ve: 1000, DichVu: 850 },
    { name: "Tháng 3", Ve: 1500, DichVu: 1100 },
    { name: "Tháng 4", Ve: 1300, DichVu: 1200 },
    { name: "Tháng 5", Ve: 1700, DichVu: 1300 },
    { name: "Tháng 6", Ve: 1600, DichVu: 1250 },
    { name: "Tháng 7", Ve: 1900, DichVu: 1400 },
  ];

  const data = [
    { name: "Jan", Loyal: 300, New: 250, Unique: 310 },
    { name: "Feb", Loyal: 270, New: 200, Unique: 280 },
    { name: "Mar", Loyal: 250, New: 180, Unique: 270 },
    { name: "Apr", Loyal: 320, New: 220, Unique: 290 },
    { name: "May", Loyal: 290, New: 300, Unique: 310 },
    { name: "Jun", Loyal: 310, New: 310, Unique: 300 },
    { name: "Jul", Loyal: 270, New: 290, Unique: 290 },
    { name: "Aug", Loyal: 280, New: 260, Unique: 270 },
  ];

  const revenueData = [
    { name: "T1", Online: 4000, Offline: 2400 },
    { name: "T2", Online: 3000, Offline: 1398 },
    { name: "T3", Online: 2000, Offline: 9800 },
    { name: "T4", Online: 2780, Offline: 3908 },
    { name: "T5", Online: 1890, Offline: 4800 },
    { name: "T6", Online: 2390, Offline: 3800 },
    { name: "T7", Online: 3490, Offline: 4300 },
  ];

  const satisfactionData = [
    { name: "T1", LastMonth: 4000, ThisMonth: 2400 },
    { name: "T2", LastMonth: 3000, ThisMonth: 1398 },
    { name: "T3", LastMonth: 2000, ThisMonth: 9800 },
    { name: "T4", LastMonth: 2780, ThisMonth: 3908 },
    { name: "T5", LastMonth: 1890, ThisMonth: 4800 },
    { name: "T6", LastMonth: 2390, ThisMonth: 3800 },
    { name: "T7", LastMonth: 3490, ThisMonth: 4300 },
  ];

  const targetData = [
    { name: "Tháng 1", Reality: 8000, Target: 10000 },
    { name: "Tháng 2", Reality: 9500, Target: 12000 },
    { name: "Tháng 3", Reality: 7000, Target: 11000 },
    { name: "Tháng 4", Reality: 11000, Target: 13000 },
    { name: "Tháng 5", Reality: 8800, Target: 12500 },
  ];
  const COLORS = ["#3b82f6", "#10b981", "#a855f7", "#f59e0b", "#f43f5e"];
  // ===================== PRODUCT PERFORMANCE DATA =====================
  const productPerformanceData = [
    {
      id: 1,
      name: "Đặt vé phim Avengers",
      assigned: "Nguyễn Minh",
      role: "Quản lý rạp",
      priority: "Trung bình",
      budget: "24.5 triệu",
    },
    {
      id: 2,
      name: "Giao diện đặt vé",
      assigned: "Trần Long",
      role: "Thiết kế giao diện",
      priority: "Thấp",
      budget: "3.9 triệu",
    },
    {
      id: 3,
      name: "Tối ưu thanh toán",
      assigned: "Phạm Hùng",
      role: "Quản lý dự án",
      priority: "Cao",
      budget: "12.8 triệu",
    },
    {
      id: 4,
      name: "Cập nhật lịch chiếu",
      assigned: "Lê Nam",
      role: "Frontend",
      priority: "Khẩn cấp",
      budget: "2.4 triệu",
    },
    {
      id: 5,
      name: "Hệ thống API phim",
      assigned: "Trương An",
      role: "Backend",
      priority: "Cao",
      budget: "15 triệu",
    },
  ];

  const priorityColors = {
    Thấp: "#dcfce7",
    "Trung bình": "#bfdbfe",
    Cao: "#fee2e2",
    "Khẩn cấp": "#fef3c7",
  };

  const priorityTextColors = {
    Thấp: "#16a34a",
    "Trung bình": "#2563eb",
    Cao: "#dc2626",
    "Khẩn cấp": "#b45309",
  };

  const filteredData = productPerformanceData.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.assigned.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const p = payload[0];
      const data = p.payload || {};
      const name = data.name ?? p.name ?? "";
      const value = data.value ?? p.value ?? "";
      const color = data.color ?? (p.color || p.stroke || p.fill) ?? "#000";

      return (
        <div
          style={{
            background: "#fff",
            padding: "8px 12px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                display: "inline-block",
                width: "12px",
                height: "12px",
                backgroundColor: color,
                borderRadius: "50%",
              }}
            ></span>
            <span>
              {name}: {value}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <MainLayout>
      <main>
        <div className="main-container">
          <div className="pd-ltr-20">
            {/* Header + nút refresh chart */}
            <div className="d-flex justify-content-between align-items-center mb-20">
              <div>
                {/* <button
                  className="btn btn-outline-primary mr-2"
                  onClick={refreshCharts}
                >
                  Làm mới biểu đồ
                </button> */}
              </div>
            </div>

            {/* Row: Mini Cards */}
            {/* DOANH THU HÔM NAY */}
            <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
              <div
                style={{
                  flex: 1.2,
                  background: "white",
                  borderRadius: "15px",
                  padding: "20px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    <h4>Doanh thu hôm nay</h4>
                    <p>Tổng quan doanh số bán vé</p>
                  </div>

                  <button
                    style={{
                      border: "1px solid #ccc",
                      background: "white",
                      borderRadius: "20px",
                      padding: "6px 14px",
                      cursor: "pointer",
                      fontWeight: 500,
                    }}
                  >
                    ↓ Xuất dữ liệu
                  </button>
                </div>

                {/* 4 Ô NHỎ */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "15px",
                    marginTop: "20px",
                  }}
                >
                  <div
                    style={{
                      background: "#ffe4e6",
                      borderRadius: "15px",
                      padding: "20px",
                      textAlign: "center",
                    }}
                  >
                    <BsGraphUp size={30} color="#f43f5e" />
                    <h3>1.000.000₫</h3>
                    <p>Tổng doanh thu</p>
                    <span style={{ color: "#2563eb" }}>Hôm qua +8%</span>
                  </div>

                  <div
                    style={{
                      background: "#fef3c7",
                      borderRadius: "15px",
                      padding: "20px",
                      textAlign: "center",
                    }}
                  >
                    <BsReceipt size={30} color="#f59e0b" />
                    <h3>300</h3>
                    <p>Tổng đơn đặt vé</p>
                    <span style={{ color: "#2563eb" }}>Hôm qua +5%</span>
                  </div>

                  <div
                    style={{
                      background: "#dcfce7",
                      borderRadius: "15px",
                      padding: "20px",
                      textAlign: "center",
                    }}
                  >
                    <BsTag size={30} color="#16a34a" />
                    <h3>5</h3>
                    <p>Phim bán chạy</p>
                    <span style={{ color: "#2563eb" }}>Hôm qua +1.2%</span>
                  </div>

                  <div
                    style={{
                      background: "#ede9fe",
                      borderRadius: "15px",
                      padding: "20px",
                      textAlign: "center",
                    }}
                  >
                    <BsPeople size={30} color="#7c3aed" />
                    <h3>8</h3>
                    <p>Khách hàng mới</p>
                    <span style={{ color: "#2563eb" }}>Hôm qua +0.5%</span>
                  </div>
                </div>
              </div>

              {/* BIỂU ĐỒ KHÁCH HÀNG */}
              <div
                style={{
                  flex: 1,
                  background: "white",
                  borderRadius: "15px",
                  padding: "20px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                }}
              >
                <h4>Thống kê lượng khách xem phim</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="Loyal"
                      stroke="purple"
                      strokeWidth={3}
                    />
                    <Line
                      type="monotone"
                      dataKey="New"
                      stroke="red"
                      strokeWidth={3}
                    />
                    <Line
                      type="monotone"
                      dataKey="Unique"
                      stroke="green"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Row: Monthly Increase */}
            <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
              {/* 1️⃣ TỔNG DOANH THU */}
              <div
                style={{
                  flex: 1,
                  background: "#fff",
                  borderRadius: "20px",
                  padding: "24px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                }}
              >
                <h3 style={{ color: "#1e293b", marginBottom: "10px" }}>
                  Tổng Doanh Thu
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: "#94a3b8" }} />
                    <YAxis tick={{ fill: "#94a3b8" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        borderRadius: "10px",
                        border: "1px solid #e2e8f0",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="Online"
                      fill="#2563eb"
                      radius={[6, 6, 0, 0]}
                    />
                    <Bar
                      dataKey="Offline"
                      fill="#10b981"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "20px",
                    color: "#64748b",
                    marginTop: "10px",
                  }}
                >
                  <span>🟦 Vé đặt online</span>
                  <span>🟩 Vé mua trực tiếp</span>
                </div>
              </div>

              {/* 2️⃣ MỨC ĐỘ HÀI LÒNG KHÁCH HÀNG */}
              <div
                style={{
                  flex: 1,
                  background: "#fff",
                  borderRadius: "20px",
                  padding: "24px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                }}
              >
                <h3 style={{ color: "#1e293b", marginBottom: "10px" }}>
                  Mức Độ Hài Lòng Khách Hàng
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={satisfactionData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: "#94a3b8" }} />
                    <YAxis tick={{ fill: "#94a3b8" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        borderRadius: "10px",
                        border: "1px solid #e2e8f0",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="LastMonth"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="ThisMonth"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    color: "#334155",
                    marginTop: "10px",
                  }}
                >
                  <div>
                    <p style={{ margin: 0 }}>Tháng Trước</p>
                    <strong>1.017 lượt</strong>
                  </div>
                  <div>
                    <p style={{ margin: 0 }}>Tháng Này</p>
                    <strong>1.757 lượt</strong>
                  </div>
                </div>
              </div>

              {/* 3️⃣ DOANH THU MỤC TIÊU VS THỰC TẾ */}
              <div
                style={{
                  flex: 1,
                  background: "#fff",
                  borderRadius: "20px",
                  padding: "24px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                }}
              >
                <h3 style={{ color: "#1e293b", marginBottom: "10px" }}>
                  Doanh Thu: Mục Tiêu vs Thực Tế
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={targetData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: "#94a3b8" }} />
                    <YAxis tick={{ fill: "#94a3b8" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        borderRadius: "10px",
                        border: "1px solid #e2e8f0",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="Reality"
                      fill="#10b981"
                      radius={[6, 6, 0, 0]}
                    />
                    <Bar
                      dataKey="Target"
                      fill="#facc15"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    color: "#334155",
                    marginTop: "10px",
                  }}
                >
                  <div>
                    <p style={{ margin: 0 }}>Thực tế</p>
                    <strong style={{ color: "#10b981" }}>8,823 vé</strong>
                  </div>
                  <div>
                    <p style={{ margin: 0 }}>Mục tiêu</p>
                    <strong style={{ color: "#facc15" }}>12,122 vé</strong>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
              {/* 1️⃣ PHIM ĐƯỢC ĐẶT NHIỀU NHẤT */}
              <div
                style={{
                  flex: 1,
                  background: "#fff",
                  borderRadius: "20px",
                  padding: "24px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                }}
              >
                <h3 style={{ color: "#1e293b", marginBottom: "20px" }}>
                  Phim được đặt nhiều nhất
                </h3>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr
                      style={{
                        color: "#94a3b8",
                        textAlign: "left",
                        fontSize: "14px",
                      }}
                    >
                      <th style={{ width: "10%" }}>#</th>
                      <th style={{ width: "60%" }}>Tên phim</th>
                      <th>Độ phổ biến</th>
                    </tr>
                  </thead>
                  <tbody>
                    {phimNoiBat.map((item) => (
                      <tr
                        key={item.id}
                        style={{ borderBottom: "1px solid #f1f5f9" }}
                      >
                        <td style={{ padding: "12px 0" }}>{item.id}</td>
                        <td
                          style={{
                            padding: "12px 0",
                            fontWeight: "500",
                            color: "#334155",
                          }}
                        >
                          {item.name}
                        </td>
                        <td>
                          <div
                            style={{
                              height: "6px",
                              width: "100%",
                              background: "#f1f5f9",
                              borderRadius: "5px",
                            }}
                          >
                            <div
                              style={{
                                height: "6px",
                                width: `${item.value}%`,
                                background: item.color,
                                borderRadius: "5px",
                              }}
                            ></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 2️⃣ DOANH THU THEO QUỐC GIA */}
              <div
                style={{
                  flex: 1,
                  background: "#fff",
                  borderRadius: "20px",
                  padding: "24px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <h3 style={{ color: "#1e293b", marginBottom: "10px" }}>
                  Doanh thu theo quốc gia
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={doanhThuQuocGia}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {doanhThuQuocGia.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={MAU[index % MAU.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* 3️⃣ SỐ LƯỢNG VÉ & DỊCH VỤ */}
              <div
                style={{
                  flex: 1,
                  background: "#fff",
                  borderRadius: "20px",
                  padding: "24px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                }}
              >
                <h3 style={{ color: "#1e293b", marginBottom: "10px" }}>
                  Số lượng vé & dịch vụ
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={veDichVu}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: "#94a3b8" }} />
                    <YAxis tick={{ fill: "#94a3b8" }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Ve" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                    <Bar
                      dataKey="DichVu"
                      fill="#10b981"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    color: "#334155",
                    marginTop: "10px",
                  }}
                >
                  <div>
                    <p style={{ margin: 0 }}>Vé bán ra</p>
                    <strong style={{ color: "#3b82f6" }}>1.900</strong>
                  </div>
                  <div>
                    <p style={{ margin: 0 }}>Dịch vụ khách hàng</p>
                    <strong style={{ color: "#10b981" }}>1.400</strong>
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                background: "#fff",
                borderRadius: "20px",
                padding: "24px",
                margin: "20px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <h3>Hiệu suất công việc</h3>

                {/* Ô TÌM KIẾM */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    background: "#f8fafc",
                    padding: "8px 14px",
                    borderRadius: "12px",
                    width: "220px",
                  }}
                >
                  <FiSearch style={{ color: "#64748b", marginRight: "8px" }} />
                  <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                      border: "none",
                      outline: "none",
                      background: "transparent",
                      width: "100%",
                      color: "#334155",
                    }}
                  />
                </div>
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr
                    style={{
                      color: "#334155",
                      textAlign: "left",
                      fontSize: "14px",
                      borderBottom: "1px solid #e2e8f0",
                    }}
                  >
                    <th style={{ padding: "12px 0" }}>Người phụ trách</th>
                    <th>Công việc</th>
                    <th>Mức ưu tiên</th>
                    <th>Ngân sách</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((item) => (
                    <tr
                      key={item.id}
                      style={{ borderBottom: "1px solid #f1f5f9" }}
                    >
                      <td style={{ padding: "14px 0" }}>
                        <div style={{ fontWeight: 600, color: "#1e293b" }}>
                          {item.assigned}
                        </div>
                        <div style={{ color: "#64748b", fontSize: "13px" }}>
                          {item.role}
                        </div>
                      </td>
                      <td style={{ color: "#1e293b", fontWeight: 500 }}>
                        {item.name}
                      </td>
                      <td>
                        <span
                          style={{
                            background: priorityColors[item.priority],
                            color: priorityTextColors[item.priority],
                            padding: "4px 12px",
                            borderRadius: "10px",
                            fontWeight: 500,
                            fontSize: "13px",
                          }}
                        >
                          {item.priority}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600, color: "#1e293b" }}>
                        {item.budget}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </MainLayout>
  );
};

export default Home;
