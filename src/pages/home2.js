import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import Loader from "../layouts/Loader";
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

const Home2 = () => {
  const [loading, setLoading] = useState(true);
  const [chartKeys, setChartKeys] = useState({});

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
  const overallSalesData = [
    { name: "Gross Sales", value: 492, color: "#9C27B0" },
    { name: "Purchases", value: 8700, color: "#4CAF50" },
    { name: "Tax Return", value: 882, color: "#FF9800" },
  ];

  const expensesData = [
    { name: "Quý 1", value: 2200 },
    { name: "Quý 2", value: 1900 },
    { name: "Quý 3", value: 2400 },
    { name: "Quý 4", value: 2242 },
  ];

  const budgetData = [
    { name: "Quý 1", value: 12000 },
    { name: "Quý 2", value: 11000 },
    { name: "Quý 3", value: 13000 },
    { name: "Quý 4", value: 11840 },
  ];

  const balanceData = [
    { name: "Quý 1", value: 1800 },
    { name: "Quý 2", value: 2200 },
    { name: "Quý 3", value: 2100 },
    { name: "Quý 4", value: 2143 },
  ];

  const salesStatisticsData = [
    { year: "2014", sales: 50, expenses: 22 },
    { year: "2015", sales: 40, expenses: 45 },
    { year: "2016", sales: 33, expenses: 24 },
    { year: "2017", sales: 48, expenses: 50 },
    { year: "2018", sales: 60, expenses: 70 },
    { year: "2019", sales: 70, expenses: 60 },
    { year: "2020", sales: 91, expenses: 80 },
  ];

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
              <h4>Dashboard</h4>
              <div>
                <button
                  className="btn btn-outline-primary mr-2"
                  onClick={refreshCharts}
                >
                  Làm mới biểu đồ
                </button>
              </div>
            </div>

            {/* Row: Mini Cards */}
            <div className="row mb-30">
              {/* Transactions */}
              <div className="col-xl-3 col-md-6 mb-20">
                <div className="card-box pd-20">
                  <h6 className="mb-10">🎬 Số lượng phim hiện có</h6>
                  <h4>
                    1352 <span className="text-success">+1.37%</span>
                  </h4>
                  <ResponsiveContainer
                    width="100%"
                    height={60}
                    key={chartKeys.mini1}
                  >
                    <LineChart
                      data={[
                        { value: 100 },
                        { value: 120 },
                        { value: 90 },
                        { value: 110 },
                        { value: 130 },
                      ]}
                    >
                      <Line
                        dataKey="value"
                        stroke="#FF9800"
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive={true}
                        animationDuration={1200}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Sales / Orders / Revenue */}
              <div className="col-xl-3 col-md-6 mb-20">
                <div className="card-box pd-20">
                  <h6 className="mb-10">Vé đã bán / Đơn đặt vé / Doanh thu</h6>
                  <h4>563 / 720 / 5900</h4>
                  <ResponsiveContainer
                    width="100%"
                    height={60}
                    key={chartKeys.mini2}
                  >
                    <AreaChart
                      data={[
                        { sales: 200, orders: 300, revenue: 400 },
                        { sales: 250, orders: 320, revenue: 450 },
                        { sales: 230, orders: 310, revenue: 420 },
                        { sales: 280, orders: 350, revenue: 500 },
                      ]}
                    >
                      <Area
                        type="monotone"
                        dataKey="sales"
                        stackId="1"
                        stroke="#1976D2"
                        fill="#1976D2"
                        fillOpacity={0.6}
                        isAnimationActive={true}
                        animationDuration={1200}
                      />
                      <Area
                        type="monotone"
                        dataKey="orders"
                        stackId="1"
                        stroke="#4CAF50"
                        fill="#4CAF50"
                        fillOpacity={0.6}
                        isAnimationActive={true}
                        animationDuration={1200}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stackId="1"
                        stroke="#90CAF9"
                        fill="#90CAF9"
                        fillOpacity={0.6}
                        isAnimationActive={true}
                        animationDuration={1200}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Sales Analytics */}
              <div className="col-xl-3 col-md-6 mb-20">
                <div className="card-box pd-20">
                  <h6 className="mb-10">📈 Doanh thu theo tuần</h6>
                  <h4>
                    27632 <span className="text-info">78%</span>
                  </h4>
                  <ResponsiveContainer
                    width="100%"
                    height={60}
                    key={chartKeys.mini3}
                  >
                    <BarChart
                      data={[
                        { value: 50 },
                        { value: 70 },
                        { value: 65 },
                        { value: 90 },
                      ]}
                    >
                      <Bar
                        dataKey="value"
                        fill="#2196F3"
                        isAnimationActive={true}
                        animationDuration={1200}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* CPU & Memory */}
              <div className="col-xl-3 col-md-6 mb-20">
                <div className="card-box pd-20">
                  <h6 className="mb-10">Thành viên VIP</h6>
                  <h4>55% / 123,65</h4>
                  <ResponsiveContainer
                    width="100%"
                    height={60}
                    key={chartKeys.mini4}
                  >
                    <LineChart
                      data={[
                        { value: 40 },
                        { value: 60 },
                        { value: 55 },
                        { value: 70 },
                      ]}
                    >
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#E91E63"
                        dot={false}
                        isAnimationActive={true}
                        animationDuration={1200}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Row: Monthly Increase */}
            <div className="row">
              <div className="col-xl-12 mb-30">
                <div className="card-box pd-20">
                  <h6 className="mb-10">
                    📈 Tăng trưởng người dùng theo tháng
                  </h6>
                  <h4>67,842</h4>
                  <ResponsiveContainer
                    width="100%"
                    height={350}
                    key={chartKeys.monthly}
                  >
                    <AreaChart
                      data={[
                        { month: "Jan", register: 80, premium: 200 },
                        { month: "Feb", register: 160, premium: 320 },
                        { month: "Mar", register: 90, premium: 200 },
                        { month: "Apr", register: 180, premium: 320 },
                        { month: "May", register: 150, premium: 280 },
                        { month: "Jun", register: 170, premium: 300 },
                        { month: "Jul", register: 80, premium: 200 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend
                        formatter={(value) =>
                          value === "register" ? "Đăng ký mới" : "Mua vé"
                        }
                      />
                      <Area
                        type="monotone"
                        dataKey="register"
                        stroke="#9C27B0"
                        fill="#9C27B0"
                        fillOpacity={0.3}
                        isAnimationActive={true}
                        animationDuration={1400}
                      />
                      <Area
                        type="monotone"
                        dataKey="premium"
                        stroke="#00BCD4"
                        fill="#00BCD4"
                        fillOpacity={0.3}
                        isAnimationActive={true}
                        animationDuration={1400}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Row: Overall Sales + Sales Statistics */}
            <div className="row">
              {/* Doanh thu phim */}
              <div className="col-xl-6 mb-30">
                <div className="card-box pd-20 height-100-p">
                  <h6 className="mb-0 font-weight-bold text-uppercase">
                    Tỷ lệ doanh thu theo loại vé
                  </h6>
                  <ResponsiveContainer
                    width="100%"
                    height={400}
                    key={chartKeys.pie1}
                  >
                    <PieChart>
                      <Pie
                        data={overallSalesData}
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        dataKey="value"
                        isAnimationActive={true}
                        animationDuration={1200}
                      >
                        {overallSalesData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Thống kê doanh thu */}
              <div className="col-xl-6 mb-30">
                <div className="card-box pd-20 height-100-p">
                  <h6 className="mb-10">📊 Doanh thu & Chi phí theo năm</h6>
                  <ResponsiveContainer
                    width="100%"
                    height={350}
                    key={chartKeys.barYear}
                  >
                    <BarChart data={salesStatisticsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="sales"
                        fill="#9C27B0"
                        isAnimationActive={true}
                        animationDuration={1200}
                      />
                      <Bar
                        dataKey="expenses"
                        fill="#FF9800"
                        isAnimationActive={true}
                        animationDuration={1200}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            {/* Row: Expenses / Budget / Balance */}
            <div className="row">
              {/* Chi phí quảng bá phim */}
              <div className="col-xl-4 mb-30">
                <div className="card-box pd-20 height-100-p">
                  <h6>💸 Chi phí quảng bá phim</h6>
                  <h2>8,742</h2>
                  <div style={{ width: "100%", height: 100 }}>
                    <ResponsiveContainer key={chartKeys.expenses}>
                      <BarChart data={expensesData}>
                        <Tooltip />
                        <Bar
                          dataKey="value"
                          fill="#9C27B0"
                          radius={[4, 4, 0, 0]}
                          isAnimationActive={true}
                          animationDuration={1200}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Doanh thu phòng vé */}
              <div className="col-xl-4 mb-30">
                <div className="card-box pd-20 height-100-p">
                  <h6>💰 Doanh thu phòng vé</h6>
                  <h2>47,840</h2>
                  <div style={{ width: "100%", height: 100 }}>
                    <ResponsiveContainer key={chartKeys.budget}>
                      <BarChart data={budgetData}>
                        <Tooltip />
                        <Bar
                          dataKey="value"
                          fill="#4CAF50"
                          radius={[4, 4, 0, 0]}
                          isAnimationActive={true}
                          animationDuration={1200}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Lợi nhuận ròng */}
              <div className="col-xl-4 mb-30">
                <div className="card-box pd-20 height-100-p">
                  <h6>📊 Lợi nhuận ròng</h6>
                  <h2>7,243</h2>
                  <div style={{ width: "100%", height: 80 }}>
                    <ResponsiveContainer key={chartKeys.balance}>
                      <BarChart data={balanceData}>
                        <Tooltip />
                        <Bar
                          dataKey="value"
                          fill="#F44336"
                          radius={[4, 4, 0, 0]}
                          isAnimationActive={true}
                          animationDuration={1200}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* Table: Danh sách phim bán chạy */}
            <div className="card-box mb-30">
              <h3 className="h5 pd-20">🎥 Danh sách phim bán chạy nhất</h3>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="thead-light">
                    <tr>
                      <th>STT</th>
                      <th>Tên phim</th>
                      <th>Rạp</th>
                      <th>Vé đã bán</th>
                      <th>Doanh thu</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>#1</td>
                      <td>Avengers: Endgame</td>
                      <td>CGV</td>
                      <td>1200</td>
                      <td>$15,000</td>
                      <td>
                        <button className="btn btn-success btn-sm mr-2">
                          <i className="fa fa-edit"></i> Edit
                        </button>
                        <button className="btn btn-danger btn-sm">
                          <i className="fa fa-trash"></i> Delete
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>#2</td>
                      <td>Batman</td>
                      <td>Galaxy</td>
                      <td>950</td>
                      <td>$11,000</td>
                      <td>
                        <button className="btn btn-success btn-sm mr-2">
                          <i className="fa fa-edit"></i> Edit
                        </button>
                        <button className="btn btn-danger btn-sm">
                          <i className="fa fa-trash"></i> Delete
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>#3</td>
                      <td>Spiderman</td>
                      <td>BHD</td>
                      <td>1500</td>
                      <td>$18,500</td>
                      <td>
                        <button className="btn btn-success btn-sm mr-2">
                          <i className="fa fa-edit"></i> Edit
                        </button>
                        <button className="btn btn-danger btn-sm">
                          <i className="fa fa-trash"></i> Delete
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </MainLayout>
  );
};

export default Home2;
