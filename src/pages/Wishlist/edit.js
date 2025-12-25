import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import MainLayout from "../../layouts/MainLayout";
import WishlistApi from "../../api/WishlistApi";
import UserApi from "../../api/UserApi";
import MovieApi from "../../api/MovieApi";
import Swal from "sweetalert2";

export default function WishlistEdit() {
  const { WishlistId } = useParams();
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState({
    WishlistId: "",
    UserId: "",
    MovieId: "",
    Status: "",
  });

  const [users, setUsers] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!WishlistId) {
          setError("Thiếu WishlistId trong URL");
          return;
        }

        setLoading(true);

        const [wishlistRes, userRes, movieRes] = await Promise.all([
          WishlistApi.getById(WishlistId),
          UserApi.getAll(),
          MovieApi.getAll(),
        ]);

        const w = wishlistRes.data.data || wishlistRes.data;
        setWishlist(w);
        setUsers(userRes.data.data || []);
        setMovies(movieRes.data.data || []);
      } catch (err) {
        console.error("❌ Lỗi load wishlist:", err);
        setError(err.response?.data?.message || "Không thể tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [WishlistId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWishlist((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    WishlistApi.update(WishlistId, wishlist)
      .then(() => {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "🎉 Cập nhật danh sách yêu thích thành công!",
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
          navigate("/wishlist");
        });
      })
      .catch((err) => {
        console.error("❌ Lỗi khi cập nhật danh sách yêu thích:", err);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "❌ Cập nhật danh sách yêu thích thất bại!",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      });
  };
  // ⏳ Loading
  if (loading) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="container role-show-container">
              <div className="d-flex flex-column align-items-center justify-content-center p-5">
                <div
                  className="spinner-border text-primary mb-3"
                  wishlist="status"
                  style={{ width: "4rem", height: "4rem" }}
                ></div>
                <h5 className="text-primary">
                  Đang tải dữ liệu danh sách yêu thích ...
                </h5>
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
            <div className="container user-show-container">
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
        </div>
      </MainLayout>
    );
  }
  // 📌 Không có dữ liệu
  if (!wishlist) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="container role-show-container">
              <div className="text-center p-5 text-muted">
                <i className="fa fa-user-shield fa-2x mb-2"></i>
                <p>Không có dữ liệu danh sách yêu thích.</p>
              </div>
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
          <nav className="breadcrumb-nav">
            <span className="breadcrumb-item" onClick={() => navigate("/")}>
              <i className="fas fa-home"></i>
              Trang chủ
            </span>
            <span className="breadcrumb-separator">/</span>
            <span
              className="breadcrumb-item"
              onClick={() => navigate("/wishlist")}
            >
              Wishlist
            </span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">Chỉnh sửa</span>
          </nav>

          <div className="content-wrapper">
            {/* Form Section */}
            <div className="form-section">
              <div className="section-header">
                <div className="header-icon">
                  <i className="fas fa-heart"></i>
                </div>
                <div className="header-text">
                  <h1 className="section-title">Cập nhật Wishlist</h1>
                  <p className="section-subtitle">
                    Chỉnh sửa thông tin danh sách yêu thích
                  </p>
                </div>
              </div>

              <div className="form-card">
                <form onSubmit={handleSubmit}>
                  {/* Người dùng */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-user label-icon"></i>
                      <span>Người dùng</span>
                    </label>
                    <select
                      className="modern-input"
                      name="UserId"
                      value={wishlist.UserId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Chọn người dùng --</option>
                      {users.map((u) => (
                        <option key={u.UserId} value={u.UserId}>
                          {u.FullName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Phim */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-film label-icon"></i>
                      <span>Phim</span>
                    </label>
                    <select
                      className="modern-input"
                      name="MovieId"
                      value={wishlist.MovieId}
                      onChange={handleChange}
                      required
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
                      <i className="fas fa-toggle-on label-icon"></i>
                      <span>Trạng thái</span>
                    </label>
                    <div className="status-selector">
                      <div
                        className={`status-option ${
                          wishlist.Status === "Active" ? "active" : ""
                        }`}
                        onClick={() =>
                          setWishlist((prev) => ({ ...prev, Status: "Active" }))
                        }
                      >
                        <div className="status-radio">
                          {wishlist.Status === "Active" && (
                            <div className="status-dot"></div>
                          )}
                        </div>
                        <div className="status-content">
                          <div className="status-badge active-badge">
                            <i className="fas fa-check"></i>
                          </div>
                          <span className="status-label">Hoạt động</span>
                        </div>
                      </div>

                      <div
                        className={`status-option ${
                          wishlist.Status === "Inactive" ? "active" : ""
                        }`}
                        onClick={() =>
                          setWishlist((prev) => ({
                            ...prev,
                            Status: "Inactive",
                          }))
                        }
                      >
                        <div className="status-radio">
                          {wishlist.Status === "Inactive" && (
                            <div className="status-dot"></div>
                          )}
                        </div>
                        <div className="status-content">
                          <div className="status-badge inactive-badge">
                            <i className="fas fa-times"></i>
                          </div>
                          <span className="status-label">Không hoạt động</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="form-actions">
                    <button type="submit" className="btn-cinema btn-save">
                      <i className="fas fa-save"></i>
                      <span>Lưu thay đổi</span>
                    </button>
                    <button
                      type="button"
                      className="btn-cinema btn-cancel"
                      onClick={() => navigate("/wishlist")}
                    >
                      <i className="fas fa-times"></i>
                      <span>Hủy bỏ</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Info Section */}
            <div className="info-section">
              {/* Highlight Card */}
              <div className="info-card highlight-card">
                <div className="info-icon-wrapper">
                  <i className="fas fa-lightbulb"></i>
                </div>
                <h3 className="info-title">Lưu ý quan trọng</h3>
                <p className="info-text">
                  Vui lòng kiểm tra kỹ thông tin trước khi lưu. Các thay đổi sẽ
                  được cập nhật ngay lập tức vào hệ thống.
                </p>
              </div>

              {/* Current Info */}
              <div className="info-card">
                <div className="info-header">
                  <i className="fas fa-info-circle"></i>
                  <span>Thông tin hiện tại</span>
                </div>
                <div className="info-list">
                  <div className="info-item">
                    <span className="info-key">ID Wishlist:</span>
                    <span className="info-value">{wishlist.WishlistId}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-key">Trạng thái:</span>
                    <span
                      className={`status-pill ${
                        wishlist.Status === "Active"
                          ? "pill-active"
                          : "pill-inactive"
                      }`}
                    >
                      {wishlist.Status === "Active"
                        ? "Hoạt động"
                        : "Không hoạt động"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="info-card tips-card">
                <div className="info-header">
                  <i className="fas fa-check-circle"></i>
                  <span>Hướng dẫn</span>
                </div>
                <div className="tip-item">
                  <i className="fas fa-check-circle tip-icon"></i>
                  <p>Chọn người dùng và phim từ danh sách có sẵn</p>
                </div>
                <div className="tip-item">
                  <i className="fas fa-check-circle tip-icon"></i>
                  <p>Trạng thái "Hoạt động" cho phép hiển thị wishlist</p>
                </div>
                <div className="tip-item">
                  <i className="fas fa-check-circle tip-icon"></i>
                  <p>Nhấn "Lưu thay đổi" để cập nhật thông tin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
