import React, { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../styles/User.css";
import ReviewApi from "../../api/ReviewApi";
import UserApi from "../../api/UserApi";
import MovieApi from "../../api/MovieApi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Loader from "../../layouts/Loader";
import { deleteReview } from "./delete";

export default function Review() {
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load dữ liệu
  useEffect(() => {
    // Lấy tất cả Review
    ReviewApi.getAll()
      .then((res) => {
        setReviews(res.data.data);
      })
      .catch((err) => console.error("Lỗi load Review:", err))
      .finally(() => setLoading(false));

    // Lấy danh sách user
    UserApi.getAll()
      .then((res) => setUsers(res.data.data))
      .catch((err) => console.error("Lỗi load users:", err));

    // Lấy danh sách movie
    MovieApi.getAll()
      .then((res) => setMovies(res.data.data))
      .catch((err) => console.error("Lỗi load movies:", err));
  }, []);

  // Toggle trạng thái (Visible <-> Hidden)
  const toggleStatus = async (ReviewId, currentStatus) => {
    const newStatus = currentStatus === "Visible" ? "Hidden" : "Visible";
    try {
      await ReviewApi.update(ReviewId, { Status: newStatus });

      setReviews((prev) =>
        prev.map((r) =>
          r.ReviewId === ReviewId ? { ...r, Status: newStatus } : r
        )
      );

      Swal.fire("✅ Thành công", "Đã cập nhật trạng thái!", "success");
    } catch (error) {
      console.error("❌ Lỗi cập nhật trạng thái:", error);
      Swal.fire("❌ Lỗi", "Không thể cập nhật trạng thái!", "error");
    }
  };

  return (
    <div>
      <Loader />
      <MainLayout>
        <main>
          <div className="main-container">
            <div className="pd-ltr-20">
              {/* Header */}
              <div className="d-flex justify-content-between align-items-center mb-4 p-3 shadow-sm bg-gradient rounded-4 header-box">
                <h3 className="m-0 text-white fw-bold d-flex align-items-center">
                  <i className="fas fa-comments me-2"></i> Quản lý đánh giá phim
                </h3>
                <div>
                  <button className="btn btn-outline-light shadow-sm rounded-pill px-3 fw-semibold">
                    <i className="fas fa-trash me-1 text-danger"></i> Thùng rác
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="card border-0 shadow-sm rounded-4 animate__animated animate__fadeIn">
                <div className="card-body p-4">
                  <div className="table-responsive">
                    <table className="table align-middle table-hover table-striped">
                      <thead className="bg-light text-dark border-bottom">
                        <tr>
                          <th className="px-4">#</th>
                          <th>Người đánh giá</th>
                          <th>Phim</th>
                          <th>Số sao</th>
                          <th>Trạng thái</th>
                          <th className="text-center">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {!loading && reviews.length > 0 ? (
                          reviews.map((review, index) => (
                            <tr
                              key={review.ReviewId}
                              className="table-row-hover"
                            >
                              <td className="fw-bold px-4">{index + 1}</td>
                              <td className="fw-semibold">
                                {users.find((u) => u.UserId === review.UserId)
                                  ?.FullName || review.UserId}
                              </td>
                              <td>{review.MovieId.Title}</td>
                              <td className="text-warning fw-bold">
                                {"⭐".repeat(review.Rating)}
                              </td>
                              <td>
                                <label className="switch">
                                  <input
                                    type="checkbox"
                                    checked={review.Status === "Visible"}
                                    onChange={() =>
                                      toggleStatus(
                                        review.ReviewId,
                                        review.Status
                                      )
                                    }
                                  />
                                  <span className="slider"></span>
                                </label>
                                <span
                                  className={`ms-2 fw-semibold ${
                                    review.Status === "Visible"
                                      ? "text-success"
                                      : "text-danger"
                                  }`}
                                >
                                  {review.Status === "Visible"
                                    ? "Hiển thị"
                                    : "Ẩn"}
                                </span>
                              </td>
                              <td className="text-center">
                                <button
                                  className="action-btn text-info"
                                  title="Chi tiết"
                                  onClick={() =>
                                    navigate(`/review/show/${review.ReviewId}`)
                                  }
                                >
                                  <i className="fas fa-eye"></i>
                                </button>
                                <button
                                  className="action-btn text-primary"
                                  title="Sửa"
                                  onClick={() =>
                                    navigate(`/review/edit/${review.ReviewId}`)
                                  }
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button
                                  onClick={() =>
                                    deleteReview(
                                      review.ReviewId,
                                      setReviews
                                    )
                                  }
                                  className="action-btn text-danger"
                                  title="Xóa"
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : loading ? (
                          [...Array(3)].map((_, i) => (
                            <tr key={i}>
                              <td colSpan="6" className="py-3">
                                <div className="skeleton w-100 h-20"></div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="6"
                              className="text-center text-muted py-4"
                            >
                              Không có đánh giá nào.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </MainLayout>
    </div>
  );
}
