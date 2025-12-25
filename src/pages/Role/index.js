import React, { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../styles/User.css";
import RoleApi from "../../api/RoleApi"; // import API
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import "animate.css";
import "../../layouts/Loader";
import Loader from "../../layouts/Loader";
import { deleteRole } from "./delete";

export default function Role() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [newRole, setNewRole] = useState({
    RoleName: "",
    Description: "",
    Status: "",
  });

  useEffect(() => {
    RoleApi.getAll()
      .then((response) => {
        console.log("API roles:", response.data); // debug
        setRoles(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
        setLoading(false);
      });
  }, []);

  const handleAddRole = async (e) => {
    e.preventDefault();
    try {
      const res = await RoleApi.create(newRole); // gọi API thêm role
      const createdRole = res.data.data || res.data; // tùy cấu trúc API trả về

      // thêm role mới vào danh sách hiển thị
      setRoles([...roles, createdRole]);

      // reset form
      setNewRole({
        RoleName: "",
        Description: "",
        Status: "", // bạn có thể đặt mặc định
      });

      setShowForm(false);
      // ✅ Thông báo thành công
      showToast("success", "🎉 Thêm quyền thành công!");
    } catch (error) {
      console.error(
        "Lỗi khi thêm quyền:",
        error.response?.data || error.message
      );

      // ❌ Thông báo lỗi
      showToast("error", "❌ Thêm quyền thất bại!");
    }
  };

  // thông báo
  const showToast = (icon, message) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: icon, // success | error | warning | info
      title: message,
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
  };

  // Toggle trạng thái role
  const toggleStatus = async (RoleId, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";

    try {
      // Lấy role hiện tại trong state
      const role = roles.find((r) => r.RoleId === RoleId);

      // Gửi toàn bộ dữ liệu
      await RoleApi.update(RoleId, {
        RoleName: role.RoleName,
        Description: role.Description,
        Status: newStatus,
      });

      // Cập nhật UI
      setRoles((prev) =>
        prev.map((r) => (r.RoleId === RoleId ? { ...r, Status: newStatus } : r))
      );
    } catch (error) {
      console.error(
        "❌ Lỗi khi cập nhật trạng thái:",
        error.response?.data || error
      );
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
                  <i className="fas fa-user-shield me-2"></i> Quản lý phân quyền
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
                        <i className="fas fa-user-shield me-2"></i> Thêm phân
                        quyền
                      </h4>

                      <form onSubmit={handleAddRole}>
                        <div className="row g-4">
                          {/* Tên vai trò */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-id-card-alt me-2 text-primary"></i>{" "}
                              Tên vai trò
                            </label>
                            <input
                              type="text"
                              className="form-control custom-input"
                              placeholder="Nhập tên vai trò"
                              value={newRole.RoleName}
                              onChange={(e) =>
                                setNewRole({
                                  ...newRole,
                                  RoleName: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          {/* Mô tả */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-align-left me-2 text-info"></i>{" "}
                              Mô tả
                            </label>
                            <input
                              type="text"
                              className="form-control custom-input"
                              placeholder="Nhập mô tả vai trò"
                              value={newRole.Description}
                              onChange={(e) =>
                                setNewRole({
                                  ...newRole,
                                  Description: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          {/* Trạng thái */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-toggle-on me-2 text-success"></i>{" "}
                              Trạng thái
                            </label>
                            <select
                              className="form-select custom-input"
                              value={newRole.Status}
                              onChange={(e) =>
                                setNewRole({
                                  ...newRole,
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
                          <th>Tên vai trò</th>
                          <th>Mô tả</th>
                          <th>Trạng thái</th>
                          <th className="text-center">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {!loading && roles.length > 0
                          ? roles.map((role, index) => (
                              <tr key={role.RoleId} className="table-row-hover">
                                <td className="fw-bold px-4">{index + 1}</td>
                                <td className="fw-semibold">
                                  {role["RoleName"]}
                                </td>
                                <td className="text-muted">
                                  {role["Description"]}
                                </td>
                                <td>
                                  <label className="switch">
                                    <input
                                      type="checkbox"
                                      checked={role.Status === "Active"}
                                      onChange={() =>
                                        toggleStatus(role.RoleId, role.Status)
                                      }
                                    />
                                    <span className="slider"></span>
                                  </label>
                                  <span
                                    className={`ms-2 fw-semibold ${
                                      role.Status === "Active"
                                        ? "text-success"
                                        : "text-danger"
                                    }`}
                                  >
                                    {role.Status === "Active"
                                      ? "Hoạt động"
                                      : "Khóa"}
                                  </span>
                                </td>

                                <td className="text-center">
                                  <button
                                    className="action-btn text-info"
                                    title="Chi tiết"
                                    onClick={() =>
                                      navigate(`/role/show/${role.RoleId}`)
                                    }
                                  >
                                    <i className="fas fa-eye"></i>
                                  </button>
                                  <button
                                    className="action-btn text-primary"
                                    title="Sửa"
                                    onClick={() =>
                                      navigate(`/role/edit/${role.RoleId}`)
                                    }
                                  >
                                    <i className="fas fa-edit"></i>
                                  </button>
                                  <button
                                    onClick={() =>
                                      deleteRole(role.RoleId, setRoles)
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
