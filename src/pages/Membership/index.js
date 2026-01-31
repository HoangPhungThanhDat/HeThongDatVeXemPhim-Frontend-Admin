import React, { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import Loader from "../../layouts/Loader";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../styles/User.css";
import MembershipApi from "../../api/MembershipApi";
import UserApi from "../../api/UserApi";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { deleteMembership } from "./delete";

export default function Membership() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newMembership, setNewMembership] = useState({
    UserId: "",
    Level: "",
    Points: 0,
    StartDate: "",
    EndDate: "",
    Benefits: "",
    Status: "Active",
  });

  // Toast thông báo
  const showToast = (icon, message) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: icon,
      title: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      customClass: { popup: "my-toast animated-toast" },
      showClass: { popup: "animate__animated animate__slideInRight" },
      hideClass: { popup: "animate__animated animate__slideOutRight" },
    });
  };
  // Toggle trạng thái Memberships
  const toggleStatus = (MembershipId) => {
    setMemberships((prev) =>
      prev.map((membership) =>
        membership.MembershipId === MembershipId
          ? {
              ...membership,
              Status: membership.Status === "Active" ? "Inactive" : "Active",
            }
          : membership
      )
    );
  };
  // Load danh sách Users + Memberships
  const fetchMemberships = async () => {
    try {
      setLoading(true);
      const userRes = await UserApi.getAll();
      setUsers(userRes.data.data || userRes.data);

      const res = await MembershipApi.getAll();
      setMemberships(res.data.data || res.data);
    } catch (error) {
      console.error("Lỗi khi load memberships:", error);
      showToast("error", "❌ Lỗi khi tải danh sách hội viên!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, []);

  // Xử lý thêm Membership
  const handleAddMembership = async (e) => {
    e.preventDefault();
    try {
      const response = await MembershipApi.create(newMembership);
      console.log("Thêm Membership thành công:", response.data);

      showToast("success", "🎉 Thêm  hội viên thành công!");

      // Reset form
      setNewMembership({
        UserId: "",
        Level: "",
        Points: 0,
        StartDate: "",
        EndDate: "",
        Benefits: "",
        Status: "Active",
      });

      setShowForm(false);
      fetchMemberships();
    } catch (error) {
      console.error("Lỗi khi thêm Membership:", error);
      showToast("error", "❌ Không thể thêm hội viên!");
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
                  <i className="fas fa-id-card me-2"></i> Quản lý hội viên
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
              {/* Form thêm membership */}
              <AnimatePresence>
                {showForm && (
                  <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="card border-0 shadow-lg rounded-4 mb-4 form-add-user"
                  >
                    <div className="card-body p-4">
                      <h4 className="fw-bold mb-4 text-primary d-flex align-items-center">
                        <i className="fas fa-id-card me-2"></i> Thêm Membership
                      </h4>

                      <form onSubmit={handleAddMembership}>
                        <div className="row g-4">
                          {/* Người dùng */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-user me-2 text-primary"></i>
                              Người dùng
                            </label>
                            <select
                              className="form-select custom-input"
                              value={newMembership.UserId}
                              onChange={(e) =>
                                setNewMembership({
                                  ...newMembership,
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

                          {/* Cấp bậc */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-layer-group me-2 text-info"></i>
                              Cấp bậc
                            </label>
                            <input
                              type="text"
                              className="form-control custom-input"
                              placeholder="VD: Silver, Gold, Platinum"
                              value={newMembership.Level}
                              onChange={(e) =>
                                setNewMembership({
                                  ...newMembership,
                                  Level: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          {/* Điểm tích lũy */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-star me-2 text-warning"></i>
                              Điểm tích lũy
                            </label>
                            <input
                              type="number"
                              min="0"
                              className="form-control custom-input"
                              placeholder="Nhập số điểm"
                              value={newMembership.Points}
                              onChange={(e) =>
                                setNewMembership({
                                  ...newMembership,
                                  Points: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          {/* Trạng thái */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-toggle-on me-2 text-success"></i>
                              Trạng thái
                            </label>
                            <select
                              className="form-select custom-input"
                              value={newMembership.Status}
                              onChange={(e) =>
                                setNewMembership({
                                  ...newMembership,
                                  Status: e.target.value,
                                })
                              }
                              required
                            >
                              <option value="">-- Chọn trạng thái --</option>
                              <option value="Active">Hoạt động</option>
                              <option value="Inactive">Khóa</option>
                              <option value="Banned">Cấm</option>
                            </select>
                          </div>

                          {/* Ngày bắt đầu */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-calendar-plus me-2 text-success"></i>
                              Ngày bắt đầu
                            </label>
                            <input
                              type="date"
                              className="form-control custom-input"
                              value={newMembership.StartDate}
                              onChange={(e) =>
                                setNewMembership({
                                  ...newMembership,
                                  StartDate: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          {/* Ngày kết thúc */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-calendar-times me-2 text-danger"></i>
                              Ngày kết thúc
                            </label>
                            <input
                              type="date"
                              className="form-control custom-input"
                              value={newMembership.EndDate}
                              onChange={(e) =>
                                setNewMembership({
                                  ...newMembership,
                                  EndDate: e.target.value,
                                })
                              }
                            />
                          </div>

                          {/* Quyền lợi - Full width */}
                          <div className="col-12">
                            <label className="form-label fw-bold">
                              <i className="fas fa-gift me-2 text-primary"></i>
                              Quyền lợi
                            </label>
                            <input
                              type="text"
                              className="form-control custom-input"
                              placeholder="Nhập quyền lợi (nếu có)"
                              value={newMembership.Benefits}
                              onChange={(e) =>
                                setNewMembership({
                                  ...newMembership,
                                  Benefits: e.target.value,
                                })
                              }
                            />
                          </div>

                          {/* Buttons */}
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
                          <th className="px-4">ID</th>
                          <th>Người sở hữu</th>
                          <th>Cấp bậc</th>
                          <th>Điểm tích lũy</th>
                          <th>Trạng thái</th>
                          <th className="text-center">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {!loading && memberships.length > 0 ? (
                          memberships.map((membership, index) => (
                            <tr
                              key={membership.MembershipId}
                              className="table-row-hover"
                            >
                              <td className="fw-bold px-4">
                                {membership.MembershipId}
                              </td>
                              <td className="fw-semibold">
                                {users.find(
                                  (u) => u.UserId === membership.UserId
                                )?.FullName || membership.UserId}
                              </td>
                              <td className="text-muted">{membership.Level}</td>
                              <td className="text-muted">
                                {membership.Points}
                              </td>

                              <td>
                                <label className="switch">
                                  <input
                                    type="checkbox"
                                    checked={membership.Status === "Active"}
                                    onChange={() =>
                                      toggleStatus(membership.MembershipId)
                                    }
                                  />
                                  <span className="slider"></span>
                                </label>
                                <span
                                  className={`ms-2 fw-semibold ${
                                    membership.Status === "Active"
                                      ? "text-success"
                                      : membership.Status === "Inactive"
                                      ? "text-warning"
                                      : "text-danger"
                                  }`}
                                >
                                  {membership.Status === "Active"
                                    ? "Hoạt động"
                                    : membership.Status === "Inactive"
                                    ? "Khóa"
                                    : "Cấm"}
                                </span>
                              </td>
                              <td className="text-center">
                                <button
                                  className="action-btn text-info"
                                  title="Chi tiết"
                                  onClick={() =>
                                    navigate(
                                      `/Membership/show/${membership.MembershipId}`
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
                                      `/Membership/edit/${membership.MembershipId}`
                                    )
                                  }
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button
                                  className="action-btn text-danger"
                                  title="Xóa"
                                  onClick={() =>
                                    deleteMembership(
                                      membership.MembershipId,
                                      setMemberships
                                    )
                                  }
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="text-center py-3">
                              {loading
                                ? "Đang tải dữ liệu..."
                                : "Không có hội viên"}
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
