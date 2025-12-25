import React, { useState, useEffect } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import MainLayout from "../../layouts/MainLayout";
import { useParams, useNavigate } from "react-router-dom";
import DistributorApi from "../../api/DistributorApi";
import MovieApi from "../../api/MovieApi";
import Swal from "sweetalert2";
import "../../styles/Role/Edit.css";

export default function DistributorEdit() {
  const { DistributorId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [distributor, setDistributor] = useState({
    Name: "",
    MovieId: "",
    Country: "",
    Email: "",
    Phone: "",
    Website: "",
    Status: "",
  });

  const [movies, setMovies] = useState([]);

  // Load dữ liệu ban đầu
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!DistributorId) {
          setError("Thiếu DistributorId trong URL");
          return;
        }

        setLoading(true);

        const [distributorRes, movieRes] = await Promise.all([
          DistributorApi.getById(DistributorId),
          MovieApi.getAll(),
        ]);

        const d = distributorRes.data.data || distributorRes.data;
        setDistributor(d);
        setMovies(movieRes.data.data || []);
      } catch (err) {
        console.error("❌ Lỗi load distributor:", err);
        setError("Không thể tải dữ liệu nhà phát hành!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [DistributorId]);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDistributor((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    DistributorApi.update(DistributorId, distributor)
      .then(() => {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "🎉 Cập nhật nhà phát hành thành công!",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          customClass: {
            popup: "my-toast animated-toast",
          },
          showClass: {
            popup: "animate__animated animate__slideInRight",
          },
          hideClass: {
            popup: "animate__animated animate__slideOutRight",
          },
        }).then(() => {
          navigate("/distributor");
        });
      })
      .catch((err) => {
        console.error("❌ Lỗi khi cập nhật nhà phát hành:", err);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "❌ Cập nhật nhà phát hành thất bại!",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          customClass: {
            popup: "my-toast animated-toast",
          },
          showClass: {
            popup: "animate__animated animate__slideInRight",
          },
          hideClass: {
            popup: "animate__animated animate__slideOutRight",
          },
        });
      });
  };

  // ⏳ Loading
  if (loading) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="d-flex flex-column align-items-center justify-content-center p-5">
              <div
                className="spinner-border text-primary mb-3"
                role="status"
                style={{ width: "4rem", height: "4rem" }}
              ></div>
              <h5 className="text-primary">Đang tải dữ liệu nhà phát hành...</h5>
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

  // ❌ Nếu lỗi
  if (error) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="text-center p-5 text-danger">
              <i className="fa fa-exclamation-circle fa-3x mb-3"></i>
              <h5>{error}</h5>
              <button
                className="btn btn-outline-primary mt-3"
                onClick={() => window.location.reload()}
              >
                <i className="fa fa-sync-alt me-2"></i> Thử lại
              </button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // 📌 Không có dữ liệu
  if (!distributor) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="text-center p-5 text-muted">
              <i className="fa fa-building fa-2x mb-2"></i>
              <p>Không có dữ liệu nhà phát hành.</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="modern-cinema-page">
        <div className="cinema-container">
          {/* Breadcrumb */}
          <div className="breadcrumb-nav">
            <span className="breadcrumb-item" onClick={() => navigate("/")}>
              <i className="fas fa-home"></i> Trang chủ
            </span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item" onClick={() => navigate("/distributor")}>
              Nhà phát hành
            </span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">Chỉnh sửa</span>
          </div>

          {/* Main Content */}
          <div className="content-wrapper">
            {/* Left Column - Form */}
            <div className="form-section">
              <div className="section-header">
                <div className="header-icon">
                  <i className="fas fa-building"></i>
                </div>
                <div className="header-text">
                  <h2 className="section-title">Chỉnh Sửa Nhà Phát Hành</h2>
                  <p className="section-subtitle">Cập nhật thông tin nhà phát hành phim</p>
                </div>
              </div>

              <div className="form-card">
                {/* Tên nhà phát hành */}
                <div className="form-group">
                  <label className="field-label">
                    <i className="fas fa-building label-icon"></i>
                    Tên nhà phát hành
                  </label>
                  <input
                    type="text"
                    className="modern-input"
                    name="Name"
                    value={distributor.Name}
                    onChange={handleChange}
                    placeholder="Nhập tên nhà phát hành"
                    required
                  />
                </div>

                {/* Quốc gia */}
                <div className="form-group">
                  <label className="field-label">
                    <i className="fas fa-globe label-icon"></i>
                    Quốc gia
                  </label>
                  <input
                    type="text"
                    className="modern-input"
                    name="Country"
                    value={distributor.Country}
                    onChange={handleChange}
                    placeholder="Nhập quốc gia"
                    required
                  />
                </div>

                {/* Email */}
                <div className="form-group">
                  <label className="field-label">
                    <i className="fas fa-envelope label-icon"></i>
                    Email
                  </label>
                  <input
                    type="email"
                    className="modern-input"
                    name="Email"
                    value={distributor.Email}
                    onChange={handleChange}
                    placeholder="Nhập email liên hệ"
                    required
                  />
                </div>

                {/* Phone */}
                <div className="form-group">
                  <label className="field-label">
                    <i className="fas fa-phone label-icon"></i>
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    className="modern-input"
                    name="Phone"
                    value={distributor.Phone}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại"
                    required
                  />
                </div>

                {/* Website */}
                <div className="form-group">
                  <label className="field-label">
                    <i className="fas fa-link label-icon"></i>
                    Website
                  </label>
                  <input
                    type="text"
                    className="modern-input"
                    name="Website"
                    value={distributor.Website}
                    onChange={handleChange}
                    placeholder="Nhập website (tùy chọn)"
                  />
                </div>

                {/* Phim liên quan */}
                <div className="form-group">
                  <label className="field-label">
                    <i className="fas fa-film label-icon"></i>
                    Phim liên quan
                  </label>
                  <select
                    className="modern-input"
                    name="MovieId"
                    value={distributor.MovieId || ""}
                    onChange={handleChange}
                  >
                    <option value="">-- Chọn phim --</option>
                    {movies.map((m) => (
                      <option key={m.MovieId} value={m.MovieId}>
                        {m.Title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Trạng thái */}
                <div className="form-group">
                  <label className="field-label">
                    <i className="fas fa-power-off label-icon"></i>
                    Trạng thái
                  </label>
                  <div className="status-selector">
                    <div
                      className={`status-option ${distributor.Status === 'Active' ? 'active' : ''}`}
                      onClick={() => setDistributor({...distributor, Status: 'Active'})}
                    >
                      <div className="status-radio">
                        {distributor.Status === 'Active' && <div className="status-dot"></div>}
                      </div>
                      <div className="status-content">
                        <div className="status-badge active-badge">
                          <i className="fas fa-check-circle"></i>
                        </div>
                        <span className="status-label">Hoạt động</span>
                      </div>
                    </div>
                    <div
                      className={`status-option ${distributor.Status === 'Inactive' ? 'active' : ''}`}
                      onClick={() => setDistributor({...distributor, Status: 'Inactive'})}
                    >
                      <div className="status-radio">
                        {distributor.Status === 'Inactive' && <div className="status-dot"></div>}
                      </div>
                      <div className="status-content">
                        <div className="status-badge inactive-badge">
                          <i className="fas fa-times-circle"></i>
                        </div>
                        <span className="status-label">Không hoạt động</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn-cinema btn-cancel"
                    onClick={() => navigate("/distributor")}
                  >
                    <i className="fas fa-times"></i>
                    Hủy bỏ
                  </button>
                  <button 
                    type="button" 
                    className="btn-cinema btn-save"
                    onClick={handleSubmit}
                  >
                    <i className="fas fa-check"></i>
                    Lưu thay đổi
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Info */}
            <div className="info-section">
              <div className="info-card highlight-card">
                <div className="info-icon-wrapper">
                  <i className="fas fa-lightbulb"></i>
                </div>
                <h4 className="info-title">Lưu ý quan trọng</h4>
                <p className="info-text">
                  Thông tin nhà phát hành sẽ được sử dụng để quản lý và liên hệ. 
                  Vui lòng kiểm tra kỹ email và số điện thoại trước khi lưu.
                </p>
              </div>

              <div className="info-card">
                <div className="info-header">
                  <i className="fas fa-info-circle"></i>
                  <span>Thông tin hiện tại</span>
                </div>
                <div className="info-list">
                  <div className="info-item">
                    <span className="info-key">Tên nhà phát hành:</span>
                    <span className="info-value">{distributor.Name || "Chưa có"}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-key">Quốc gia:</span>
                    <span className="info-value">{distributor.Country || "Chưa có"}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-key">Trạng thái:</span>
                    <span className={`status-pill ${distributor.Status === 'Active' ? 'pill-active' : 'pill-inactive'}`}>
                      {distributor.Status === 'Active' ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="info-card tips-card">
                <div className="tip-item">
                  <i className="fas fa-check-circle tip-icon"></i>
                  <p>Tên nhà phát hành nên chính xác và đầy đủ</p>
                </div>
                <div className="tip-item">
                  <i className="fas fa-check-circle tip-icon"></i>
                  <p>Email và số điện thoại phải hợp lệ</p>
                </div>
                <div className="tip-item">
                  <i className="fas fa-check-circle tip-icon"></i>
                  <p>Website có thể để trống nếu không có</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}