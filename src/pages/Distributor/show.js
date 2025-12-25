import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import DistributorApi from "../../api/DistributorApi";
import MovieApi from "../../api/MovieApi";
import {
  Building2,
  Edit3,
  ArrowLeft,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  Clock,
  Mail,
  Phone,
  Globe,
  MapPin,
  Sparkles,
  Activity,
  Film,
} from "lucide-react";

export default function DistributorShow() {
  const { DistributorId } = useParams();
  const navigate = useNavigate();

  const [distributor, setDistributor] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [distributorRes, movieRes] = await Promise.all([
          DistributorApi.getById(DistributorId),
          MovieApi.getAll(),
        ]);

        setDistributor(distributorRes.data.data || distributorRes.data);
        setMovies(movieRes.data.data || []);
      } catch (err) {
        console.error("❌ Lỗi khi lấy dữ liệu:", err);
        setError("Không thể tải dữ liệu nhà phát hành!");
      } finally {
        setLoading(false);
      }
    };
    if (DistributorId) fetchData();
  }, [DistributorId]);

  const getMovieTitle = (id) =>
    movies.find((m) => m.MovieId === id)?.Title || id;

  // Loading State
  if (loading) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="d-flex flex-column align-items-center justify-content-center p-5">
              <div
                className="spinner-border text-primary mb-3"
                role="status"
                style={{ width: "4rem", height: "4rem", borderColor: "#f7931e", borderRightColor: "transparent" }}
              ></div>
              <h5 style={{ color: "#f7931e" }}>Đang tải dữ liệu nhà phát hành...</h5>
              <p className="text-muted mt-2">Vui lòng chờ trong giây lát</p>

              {/* Skeleton giả lập khi đang tải */}
              <div className="card shadow-sm border-0 mt-4 w-75">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-4 text-center">
                      <div
                        className="bg-light rounded-circle mx-auto"
                        style={{ width: "120px", height: "120px" }}
                      ></div>
                      <div
                        className="bg-light mt-3 rounded"
                        style={{
                          width: "80%",
                          height: "20px",
                          margin: "0 auto",
                        }}
                      ></div>
                    </div>
                    <div className="col-md-8">
                      <div
                        className="bg-light rounded mb-3"
                        style={{ width: "60%", height: "20px" }}
                      ></div>
                      <div
                        className="bg-light rounded mb-2"
                        style={{ width: "100%", height: "15px" }}
                      ></div>
                      <div
                        className="bg-light rounded mb-2"
                        style={{ width: "90%", height: "15px" }}
                      ></div>
                      <div
                        className="bg-light rounded mb-2"
                        style={{ width: "80%", height: "15px" }}
                      ></div>
                      <div
                        className="bg-light rounded mb-2"
                        style={{ width: "70%", height: "15px" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Error State
  if (error) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div
              style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                padding: "40px 20px",
              }}
            >
              <div
                style={{
                  maxWidth: "600px",
                  margin: "0 auto",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    background: "rgba(247, 147, 30, 0.1)",
                    backdropFilter: "blur(20px)",
                    borderRadius: "24px",
                    border: "1px solid rgba(247, 147, 30, 0.3)",
                    padding: "60px 40px",
                  }}
                >
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      background: "rgba(247, 147, 30, 0.2)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 24px",
                    }}
                  >
                    <XCircle size={40} color="#f7931e" />
                  </div>
                  <h3
                    style={{
                      fontSize: "24px",
                      fontWeight: 700,
                      color: "white",
                      marginBottom: "12px",
                    }}
                  >
                    {error}
                  </h3>
                  <button
                    onClick={() => window.location.reload()}
                    style={{
                      marginTop: "24px",
                      padding: "12px 32px",
                      background: "linear-gradient(135deg, #f7931e, #e67e22)",
                      border: "none",
                      borderRadius: "12px",
                      color: "white",
                      fontSize: "16px",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 24px rgba(247, 147, 30, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    Thử lại
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // No Data State
  if (!distributor) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div
              style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                padding: "40px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  color: "#94a3b8",
                }}
              >
                <Building2
                  size={64}
                  style={{ marginBottom: "16px", opacity: 0.5 }}
                />
                <p style={{ fontSize: "18px" }}>Không có dữ liệu nhà phát hành.</p>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const isActive = distributor.Status === "Active";

  return (
    <MainLayout>
      <div className="main-container">
        <div className="pd-ltr-20">
          <div
            style={{
              minHeight: "100vh",
              background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
              padding: "40px 20px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Background Effects */}
            <div
              style={{
                position: "absolute",
                top: "-10%",
                right: "-5%",
                width: "500px",
                height: "500px",
                background:
                  "radial-gradient(circle, rgba(247, 147, 30, 0.15) 0%, transparent 70%)",
                borderRadius: "50%",
                filter: "blur(80px)",
                pointerEvents: "none",
              }}
            ></div>

            <div
              style={{
                maxWidth: "1200px",
                margin: "0 auto",
                position: "relative",
                zIndex: 10,
              }}
            >
              {/* Header */}
              <div
                style={{
                  marginBottom: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "16px",
                }}
              >
                <div>
                  <button
                    onClick={() => navigate("/distributor")}
                    style={{
                      padding: "8px 16px",
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "8px",
                      color: "#94a3b8",
                      fontSize: "14px",
                      fontWeight: 500,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "16px",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255, 255, 255, 0.1)";
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255, 255, 255, 0.05)";
                      e.currentTarget.style.color = "#94a3b8";
                    }}
                  >
                    <ArrowLeft size={16} />
                    Quay lại danh sách
                  </button>
                  <h1
                    style={{
                      fontSize: "36px",
                      fontWeight: 900,
                      color: "white",
                      margin: "0 0 8px 0",
                      letterSpacing: "-0.5px",
                    }}
                  >
                    Chi Tiết Nhà Phát Hành
                  </h1>
                  <p
                    style={{
                      fontSize: "16px",
                      color: "#94a3b8",
                      margin: 0,
                    }}
                  >
                    Xem thông tin chi tiết về nhà phát hành phim
                  </p>
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    onClick={() => navigate(`/distributor/edit/${DistributorId}`)}
                    style={{
                      padding: "12px 24px",
                      background: "linear-gradient(135deg, #f7931e, #e67e22)",
                      border: "none",
                      borderRadius: "12px",
                      color: "white",
                      fontSize: "15px",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 24px rgba(247, 147, 30, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <Edit3 size={18} />
                    Chỉnh sửa
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "24px",
                }}
              >
                {/* Left Column - Distributor Summary */}
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(20px)",
                    borderRadius: "20px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    padding: "40px",
                    textAlign: "center",
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: "120px",
                      height: "120px",
                      background: `linear-gradient(135deg, ${
                        isActive ? "#f7931e" : "#6b7280"
                      }, ${isActive ? "#e67e22" : "#4b5563"})`,
                      borderRadius: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 24px",
                      boxShadow: `0 12px 40px ${
                        isActive
                          ? "rgba(247, 147, 30, 0.4)"
                          : "rgba(107, 114, 128, 0.4)"
                      }`,
                    }}
                  >
                    <Building2 size={56} color="white" strokeWidth={2} />
                  </div>

                  {/* Distributor Name */}
                  <h2
                    style={{
                      fontSize: "28px",
                      fontWeight: 800,
                      color: "white",
                      margin: "0 0 12px 0",
                    }}
                  >
                    {distributor.Name}
                  </h2>

                  {/* Status Badge */}
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 20px",
                      background: isActive
                        ? "rgba(34, 197, 94, 0.15)"
                        : "rgba(239, 68, 68, 0.15)",
                      border: `1px solid ${
                        isActive
                          ? "rgba(34, 197, 94, 0.3)"
                          : "rgba(239, 68, 68, 0.3)"
                      }`,
                      borderRadius: "20px",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: isActive ? "#22c55e" : "#ef4444",
                      marginBottom: "24px",
                    }}
                  >
                    {isActive ? (
                      <CheckCircle size={16} />
                    ) : (
                      <XCircle size={16} />
                    )}
                    {isActive ? "Hoạt động" : "Không hoạt động"}
                  </div>

                  {/* Contact Info */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                      marginBottom: "24px",
                    }}
                  >
                    <div
                      style={{
                        padding: "12px",
                        background: "rgba(0, 0, 0, 0.2)",
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <MapPin size={18} color="#94a3b8" />
                      <span style={{ fontSize: "14px", color: "#cbd5e1" }}>
                        {distributor.Country}
                      </span>
                    </div>

                    <div
                      style={{
                        padding: "12px",
                        background: "rgba(0, 0, 0, 0.2)",
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <Mail size={18} color="#94a3b8" />
                      <span style={{ fontSize: "14px", color: "#cbd5e1" }}>
                        {distributor.Email}
                      </span>
                    </div>

                    <div
                      style={{
                        padding: "12px",
                        background: "rgba(0, 0, 0, 0.2)",
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <Phone size={18} color="#94a3b8" />
                      <span style={{ fontSize: "14px", color: "#cbd5e1" }}>
                        {distributor.Phone}
                      </span>
                    </div>

                    {distributor.Website && (
                      <div
                        style={{
                          padding: "12px",
                          background: "rgba(0, 0, 0, 0.2)",
                          borderRadius: "12px",
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <Globe size={18} color="#94a3b8" />
                        <span style={{ fontSize: "14px", color: "#cbd5e1" }}>
                          {distributor.Website}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Movie */}
                  <div
                    style={{
                      padding: "20px",
                      background: "rgba(0, 0, 0, 0.2)",
                      borderRadius: "12px",
                      marginBottom: "24px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "8px",
                        justifyContent: "center",
                      }}
                    >
                      <Film size={18} color="#94a3b8" />
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "#94a3b8",
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                        }}
                      >
                        Phim liên quan
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: "15px",
                        color: "#cbd5e1",
                        margin: 0,
                        lineHeight: 1.6,
                      }}
                    >
                      {getMovieTitle(distributor.MovieId)}
                    </p>
                  </div>

                  {/* Distributor ID */}
                  <div
                    style={{
                      padding: "16px",
                      background: "rgba(0, 0, 0, 0.2)",
                      borderRadius: "12px",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#64748b",
                        marginBottom: "4px",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                      }}
                    >
                      ID Nhà Phát Hành
                    </div>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: 700,
                        color: "#f7931e",
                        fontFamily: "monospace",
                      }}
                    >
                      {distributor.DistributorId}
                    </div>
                  </div>
                </div>

                {/* Right Column - Details */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                  }}
                >
                  {/* Created Info */}
                  <div
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(20px)",
                      borderRadius: "20px",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      padding: "32px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "24px",
                      }}
                    >
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          background:
                            "linear-gradient(135deg, #f7931e, #e67e22)",
                          borderRadius: "12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Sparkles size={24} color="white" />
                      </div>
                      <div>
                        <h3
                          style={{
                            fontSize: "20px",
                            fontWeight: 700,
                            color: "white",
                            margin: 0,
                          }}
                        >
                          Thông Tin Tạo
                        </h3>
                        <p
                          style={{
                            fontSize: "14px",
                            color: "#94a3b8",
                            margin: 0,
                          }}
                        >
                          Chi tiết về người tạo nhà phát hành
                        </p>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "16px",
                          background: "rgba(0, 0, 0, 0.2)",
                          borderRadius: "12px",
                        }}
                      >
                        <User size={20} color="#94a3b8" />
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              marginBottom: "4px",
                            }}
                          >
                            Người tạo
                          </div>
                          <div
                            style={{
                              fontSize: "15px",
                              fontWeight: 600,
                              color: "white",
                            }}
                          >
                            {distributor.CreatedBy || "N/A"}
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "16px",
                          background: "rgba(0, 0, 0, 0.2)",
                          borderRadius: "12px",
                        }}
                      >
                        <Calendar size={20} color="#94a3b8" />
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              marginBottom: "4px",
                            }}
                          >
                            Ngày tạo
                          </div>
                          <div
                            style={{
                              fontSize: "15px",
                              fontWeight: 600,
                              color: "white",
                            }}
                          >
                            {distributor.CreatedAt || "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Updated Info */}
                  <div
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(20px)",
                      borderRadius: "20px",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      padding: "32px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "24px",
                      }}
                    >
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          background:
                            "linear-gradient(135deg, #f7931e, #e67e22)",
                          borderRadius: "12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Activity size={24} color="white" />
                      </div>
                      <div>
                        <h3
                          style={{
                            fontSize: "20px",
                            fontWeight: 700,
                            color: "white",
                            margin: 0,
                          }}
                        >
                          Cập Nhật Gần Nhất
                        </h3>
                        <p
                          style={{
                            fontSize: "14px",
                            color: "#94a3b8",
                            margin: 0,
                          }}
                        >
                          Lịch sử thay đổi nhà phát hành
                        </p>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "16px",
                          background: "rgba(0, 0, 0, 0.2)",
                          borderRadius: "12px",
                        }}
                      >
                        <User size={20} color="#94a3b8" />
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              marginBottom: "4px",
                            }}
                          >
                            Người cập nhật
                          </div>
                          <div
                            style={{
                              fontSize: "15px",
                              fontWeight: 600,
                              color: "white",
                            }}
                          >
                            {distributor.UpdatedBy || "N/A"}
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "16px",
                          background: "rgba(0, 0, 0, 0.2)",
                          borderRadius: "12px",
                        }}
                      >
                        <Clock size={20} color="#94a3b8" />
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              marginBottom: "4px",
                            }}
                          >
                            Ngày cập nhật
                          </div>
                          <div
                            style={{
                              fontSize: "15px",
                              fontWeight: 600,
                              color: "white",
                            }}
                          >
                            {distributor.UpdatedAt || "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}