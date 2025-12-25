import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import MainLayout from "../../layouts/MainLayout";
import "../../styles/Edit.css";
import BannerApi from "../../api/BannerApi";
import UserApi from "../../api/UserApi";
import Swal from "sweetalert2";

export default function BannerEdit() {
  const { BannerId } = useParams();
  const navigate = useNavigate();

  const [banner, setBanner] = useState({
    BannerId: "",
    UserId: "",
    Title: "",
    ImageUrl: "",
    LinkUrl: "",
    Position: "",
    Status: "",
    ImageFile: null, // 📌 thêm thuộc tính để lưu file ảnh
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!BannerId) {
          setError("Thiếu BannerId trong URL");
          return;
        }
        setLoading(true);
        const currentUserId = localStorage.getItem("UserId") || "";
        const currentFullName = localStorage.getItem("fullname") || "";

        const [bannerRes, userRes] = await Promise.all([
          BannerApi.getById(BannerId),
          UserApi.getAll(),
        ]);
        const b = bannerRes.data.data || bannerRes.data;
        setBanner((prev) => ({
          ...prev,
          ...b,
          UserId: currentUserId,
          ImageFile: null, // reset file khi load
        }));
        setUsers(userRes.data.data || []);
      } catch (err) {
        console.error("❌ Lỗi load banner:", err);
        setError(err.response?.data?.message || "Không thể tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [BannerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBanner((prev) => ({ ...prev, [name]: value }));
  };

  // 📌 Khi người dùng chọn file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBanner((prev) => ({
        ...prev,
        ImageFile: file,
        ImageUrl: URL.createObjectURL(file), // để preview ảnh
      }));
    }
  };

  // 📤 Gửi dữ liệu có file
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("_method", "PUT");

      formData.append("UserId", banner.UserId);
      formData.append("Title", banner.Title);
      formData.append("LinkUrl", banner.LinkUrl || "");
      formData.append("Position", banner.Position);
      formData.append("Status", banner.Status);

      // 📁 Chỉ append file nếu có ảnh mới
      if (banner.ImageFile) {
        formData.append("ImageUrl", banner.ImageFile);
      }
      // Nếu không chọn ảnh → không append gì cả

      // 👀 Kiểm tra dữ liệu gửi đi
      for (let [k, v] of formData.entries()) {
        console.log(k + ":", v);
      }

      const res = await BannerApi.update(BannerId, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "🎉 Cập nhật banner thành công!",
        showConfirmButton: false,
        timer: 2000,
      }).then(() => navigate("/banner"));
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật banner:", err.response?.data || err);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "❌ Cập nhật banner thất bại!",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="container role-show-container">
            <div className="d-flex flex-column align-items-center justify-content-center p-5">
              <div
                className="spinner-border text-primary mb-3"
                role="status"
                style={{ width: "4rem", height: "4rem" }}
              ></div>
              <h5 className="text-primary">Đang tải dữ liệu banner...</h5>
              <p className="text-muted mt-2">Vui lòng chờ trong giây lát</p>
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

  if (error) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="container role-show-container">
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

  if (!banner) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="container role-show-container">
            <div className="text-center p-5 text-muted">
              <i className="fa fa-image fa-2x mb-2"></i>
              <p>Không có dữ liệu banner.</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="main-container fade-in">
        <div className="container role-edit-container py-5">
          <div className="card edit-card shadow-lg border-0 rounded-4 animate-card">
            <div className="card-header bg-gradient text-white text-center py-4 rounded-top-4 header-glow">
              <h3 className="mb-0 fw-bold">
                <i className="fas fa-image me-2"></i>Cập nhật Banner
              </h3>
            </div>
            <div className="card-body p-5">
              <form onSubmit={handleSubmit} className="row g-4">
                {/* Người tạo */}
                <div className="col-md-6">
                  <label className="form-label fw-bold mb-2">
                    <i className="fas fa-user me-2 text-primary"></i>Người tạo
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    value={
                      localStorage.getItem("fullname") || "Người dùng hiện tại"
                    }
                    disabled
                  />
                </div>

                {/* Tiêu đề */}
                <div className="col-md-6">
                  <label className="form-label fw-bold mb-2">
                    <i className="fas fa-heading me-2 text-info"></i>Tiêu đề
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    name="Title"
                    value={banner.Title}
                    onChange={handleChange}
                    required
                  />
                </div>
                {/* Hình ảnh */}
                <div className="col-md-6">
                  <label className="form-label fw-bold mb-2">
                    <i className="fas fa-image me-2 text-warning"></i>Hình ảnh
                  </label>
                  <input
                    type="file"
                    className="form-control form-control-lg"
                    name="ImageUrl"
                    onChange={handleFileChange}
                  />
                  {banner.ImageUrl && (
                    <div className="mt-2">
                      <img
                        src={banner.ImageUrl}
                        alt="Preview"
                        style={{ maxWidth: "150px", borderRadius: "8px" }}
                      />
                    </div>
                  )}
                </div>

                {/* Liên kết */}
                <div className="col-md-6">
                  <label className="form-label fw-bold mb-2">
                    <i className="fas fa-link me-2 text-secondary"></i>Liên kết
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    name="LinkUrl"
                    value={banner.LinkUrl}
                    onChange={handleChange}
                  />
                </div>
                {/* Vị trí hiển thị */}
                <div className="col-md-6">
                  <label className="form-label fw-bold mb-2">
                    <i className="fas fa-map-marker-alt me-2 text-danger"></i>Vị
                    trí hiển thị
                  </label>
                  <select
                    className="form-select form-select-lg"
                    name="Position"
                    value={banner.Position}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Chọn vị trí --</option>
                    <option value="Home">Trang chủ</option>
                    <option value="MoviePage">Trang phim</option>
                    <option value="PromotionPage">Trang khuyến mãi</option>
                  </select>
                </div>
                {/* Trạng thái */}
                <div className="col-md-6">
                  <label className="form-label fw-bold mb-2">
                    <i className="fas fa-toggle-on me-2 text-success"></i>Trạng
                    thái
                  </label>
                  <select
                    className="form-select form-select-lg"
                    name="Status"
                    value={banner.Status}
                    onChange={handleChange}
                  >
                    <option value="Active">Hoạt động</option>
                    <option value="Inactive">Không hoạt động</option>
                  </select>
                </div>
                {/* Nút hành động */}
                <div className="col-12 text-center mt-5">
                  <button
                    type="submit"
                    className="btn btn-gradient btn-xl px-5 me-4 shadow-lg action-btn"
                  >
                    <i className="fas fa-save me-2"></i>Lưu
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/banner")}
                    className="btn btn-secondary btn-xl px-5 shadow-lg action-btn cancel-btn"
                  >
                    <i className="fas fa-undo me-2"></i>Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
