import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import MainLayout from "../../layouts/MainLayout";
import "../../styles/Show.css";
import BannerApi from "../../api/BannerApi";
import UserApi from "../../api/UserApi";

export default function BannerShow() {
  const { BannerId } = useParams();
  const [banner, setBanner] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [bannerRes, userRes] = await Promise.all([
          BannerApi.getById(BannerId),
          UserApi.getAll(),
        ]);
        setBanner(bannerRes.data.data || bannerRes.data);
        setUsers(userRes.data.data || []);
      } catch (err) {
        console.error("❌ Lỗi khi lấy dữ liệu:", err);
        setError(
          err.response?.data?.message || "Không tìm thấy thông tin banner."
        );
      } finally {
        setLoading(false);
      }
    };
    if (BannerId) fetchData();
  }, [BannerId]);

  const getUserName = (id) =>
    users.find((u) => String(u.UserId) === String(id))?.FullName || id;

  if (loading) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="container user-show-container">
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
          <div className="container user-show-container">
            <div className="text-center p-5 text-muted">
              <i className="fa fa-id-card-slash fa-2x mb-2"></i>
              <p>Không có dữ liệu banner.</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <main>
        <div className="main-container">
          <div className="container user-show-container">
            <div className="card shadow-lg border-0 rounded-3">
              <div className="card-body p-5">
                <h5 className="user-info-title mb-4">
                  Thông tin chi tiết Banner
                </h5>
                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <th>Mã banner</th>
                      <td>{banner.BannerId}</td>
                    </tr>
                    <tr>
                      <th>Người tạo</th>
                      <td>{getUserName(banner.UserId)}</td>
                    </tr>
                    <tr>
                      <th>Tiêu đề</th>
                      <td>{banner.Title}</td>
                    </tr>
                    <tr>
                      <th>Hình ảnh</th>
                      <td>
                        {banner.ImageUrl ? (
                          <img
                            src={banner.ImageUrl}
                            alt="Banner"
                            style={{ maxWidth: "200px", borderRadius: "8px" }}
                          />
                        ) : (
                          <span className="text-muted">Không có hình ảnh</span>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th>Liên kết</th>
                      <td>
                        {banner.LinkUrl ? (
                          <a
                            href={banner.LinkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {banner.LinkUrl}
                          </a>
                        ) : (
                          <span className="text-muted">Không có liên kết</span>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th>Vị trí hiển thị</th>
                      <td>
                        {banner.Position === "Home"
                          ? "Trang chủ"
                          : banner.Position === "MoviePage"
                          ? "Trang phim"
                          : banner.Position === "PromotionPage"
                          ? "Trang khuyến mãi"
                          : banner.Position}
                      </td>
                    </tr>
                    <tr>
                      <th>Trạng thái</th>
                      <td>
                        <span
                          className={`fw-semibold px-3 py-1 rounded-pill text-white ${
                            banner.Status === "Active"
                              ? "bg-success"
                              : "bg-warning"
                          }`}
                        >
                          {banner.Status === "Active" ? "Hoạt động" : "Khóa"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <th>Ngày tạo</th>
                      <td>{banner.CreatedAt}</td>
                    </tr>
                    <tr>
                      <th>Cập nhật lần cuối</th>
                      <td>{banner.UpdatedAt}</td>
                    </tr>
                  </tbody>
                </table>
                <div className="mt-4 action-btns d-flex">
                  <button
                    className="btn btn-edit me-3"
                    onClick={() => navigate(`/banner/edit/${banner.BannerId}`)}
                  >
                    <i className="fa fa-edit me-2"></i> Chỉnh sửa
                  </button>
                  <button
                    className="btn btn-back"
                    onClick={() => navigate("/banner")}
                  >
                    <i className="fa fa-arrow-left me-2"></i> Quay lại
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </MainLayout>
  );
}
