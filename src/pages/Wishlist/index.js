import React, { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../styles/User.css";
import WishlistApi from "../../api/WishlistApi";
import UserApi from "../../api/UserApi";
import MovieApi from "../../api/MovieApi";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import "animate.css";
import Loader from "../../layouts/Loader";
import { deleteWishlist } from "./delete";

export default function Wishlist() {
  const [wishlists, setWishlists] = useState([]);
  const [users, setUsers] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [newWishlist, setNewWishlist] = useState({
    UserId: "",
    MovieId: "",
    Status: "",
  });

  useEffect(() => {
    // Lấy tất cả wishlist
    WishlistApi.getAll()
      .then((res) => {
        setWishlists(res.data.data);
      })
      .catch((err) => console.error("Lỗi load wishlist:", err))
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

  const handleAddWishlist = async (e) => {
    e.preventDefault();
    try {
      const res = await WishlistApi.create(newWishlist);
      const createdWishlist = res.data.data || res.data;

      setWishlists([...wishlists, createdWishlist]);

      // reset form
      setNewWishlist({ UserId: "", MovieId: "", Status: "" });
      setShowForm(false);

      showToast("success", "🎉 Thêm danh sách yêu thích thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm wishlist:", error);
      showToast("error", "❌ Thêm thất bại!");
    }
  };

  const showToast = (icon, message) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      showClass: { popup: "animate__animated animate__slideInRight" },
      hideClass: { popup: "animate__animated animate__slideOutRight" },
    });
  };

  const toggleStatus = async (WishlistId, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";

    try {
      const wishlist = wishlists.find((r) => r.WishlistId === WishlistId);

      await WishlistApi.update(WishlistId, {
        UserId: wishlist.UserId,
        MovieId: wishlist.MovieId,
        Status: newStatus,
      });

      setWishlists((prev) =>
        prev.map((r) =>
          r.WishlistId === WishlistId ? { ...r, Status: newStatus } : r
        )
      );
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật trạng thái:", error);
      showToast("error", "❌ Không thể cập nhật trạng thái!");
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
                  <i className="fas fa-heart me-2"></i> Quản lý danh sách yêu
                  thích
                </h3>
                <div>
                  <button
                    className="btn btn-light me-2 shadow-sm rounded-pill px-3 fw-semibold"
                    onClick={() => setShowForm(!showForm)}
                  >
                    <i className="fas fa-plus me-1 text-success"></i> Thêm
                  </button>
                  <button className="btn btn-outline-light shadow-sm rounded-pill px-3 fw-semibold">
                    <i className="fas fa-trash me-1 text-danger"></i> Thùng rác
                  </button>
                </div>
              </div>

              {/* Form thêm */}
              <AnimatePresence>
                {showForm && (
                  <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="card border-0 shadow-lg rounded-4 mb-4 form-add-role"
                  >
                    <div className="card-body p-4">
                      <h4 className="fw-bold mb-4 text-primary d-flex align-items-center">
                        <i className="fas fa-heart me-2"></i> Thêm danh sách yêu
                        thích
                      </h4>

                      <form onSubmit={handleAddWishlist}>
                        <div className="row g-4">
                          {/* Người dùng */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-user me-2 text-primary"></i>{" "}
                              Người dùng
                            </label>
                            <select
                              className="form-control custom-input"
                              value={newWishlist.UserId}
                              onChange={(e) =>
                                setNewWishlist({
                                  ...newWishlist,
                                  UserId: e.target.value,
                                })
                              }
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
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-film me-2 text-info"></i>{" "}
                              Phim
                            </label>
                            <select
                              className="form-control custom-input"
                              value={newWishlist.MovieId}
                              onChange={(e) =>
                                setNewWishlist({
                                  ...newWishlist,
                                  MovieId: e.target.value,
                                })
                              }
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
                          <div className="col-md-3">
                            <label className="form-label fw-bold">
                              <i className="fas fa-toggle-on me-2 text-success"></i>{" "}
                              Trạng thái
                            </label>
                            <select
                              className="form-control custom-input"
                              value={newWishlist.Status}
                              onChange={(e) =>
                                setNewWishlist({
                                  ...newWishlist,
                                  Status: e.target.value,
                                })
                              }
                              required
                            >
                              <option value="">-- Chọn trạng thái --</option>
                              <option value="Active">Hoạt động</option>
                              <option value="Inactive">Khóa</option>
                            </select>
                          </div>

                          {/* Nút hành động */}
                          <div className="col-12 text-end mt-3">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              type="submit"
                              className="btn btn-gradient-success me-2 rounded-pill px-4"
                            >
                              <i className="fas fa-save me-1"></i> Lưu
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              type="button"
                              className="btn btn-gradient-secondary rounded-pill px-4"
                              onClick={() => setShowForm(false)}
                            >
                              <i className="fas fa-times me-1"></i> Hủy
                            </motion.button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Card chứa bảng */}
              <div className="card border-0 shadow-sm rounded-4 animate__animated animate__fadeIn">
                <div className="card-body p-4">
                  <div className="table-responsive">
                    <table className="table align-middle table-hover table-striped">
                      <thead className="bg-light text-dark border-bottom">
                        <tr>
                          <th className="px-4">id</th>
                          <th>Tên người dùng</th>
                          <th>Tên phim</th>
                          <th>Trạng thái</th>
                          <th className="text-center">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {!loading && wishlists.length > 0
                          ? wishlists.map((wishlist, index) => (
                              <tr
                                key={wishlist.WishlistId}
                                className="table-row-hover"
                              >
                                <td className="fw-bold px-4">{index + 1}</td>
                                <td className="fw-semibold">
                                  {users.find(
                                    (u) => u.UserId === wishlist.UserId
                                  )?.FullName || wishlist.UserId}
                                </td>
                                <td className="text-muted">
                                  {movies.find(
                                    (m) => m.MovieId === wishlist.MovieId
                                  )?.Title || wishlist.MovieId}
                                </td>
                                <td>
                                  <label className="switch">
                                    <input
                                      type="checkbox"
                                      checked={wishlist.Status === "Active"}
                                      onChange={() =>
                                        toggleStatus(
                                          wishlist.WishlistId,
                                          wishlist.Status
                                        )
                                      }
                                    />
                                    <span className="slider"></span>
                                  </label>
                                  <span
                                    className={`ms-2 fw-semibold ${
                                      wishlist.Status === "Active"
                                        ? "text-success"
                                        : "text-danger"
                                    }`}
                                  >
                                    {wishlist.Status === "Active"
                                      ? "Hoạt động"
                                      : "Khóa"}
                                  </span>
                                </td>

                                <td className="text-center">
                                  <button
                                    className="action-btn text-info"
                                    title="Chi tiết"
                                    onClick={() =>
                                      navigate(
                                        `/wishlist/show/${wishlist.WishlistId}`
                                      )
                                    }
                                  >
                                    <i className="fas fa-eye"></i>
                                  </button>
                                  <button
                                    className="action-btn text-primary"
                                    title="Sửa"
                                    onClick={() =>
                                      navigate(
                                        `/wishlist/edit/${wishlist.WishlistId}`
                                      )
                                    }
                                  >
                                    <i className="fas fa-edit"></i>
                                  </button>
                                  <button
                                    onClick={() =>
                                      deleteWishlist(
                                        wishlist.WishlistId,
                                        setWishlists
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
                          : // Loading skeleton
                            [...Array(3)].map((_, i) => (
                              <tr key={i}>
                                <td colSpan="5" className="py-3">
                                  <div className="skeleton w-100 h-20"></div>
                                </td>
                              </tr>
                            ))}
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