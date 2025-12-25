import React, { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import Loader from "../../layouts/Loader";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../styles/User.css";
import UserApi from "../../api/UserApi";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import "animate.css";
import { deleteUser } from "./delete";
import RoleApi from "../../api/RoleApi";

export default function User() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  // 👇 State cho form thêm user
  const [newUser, setNewUser] = useState({
    FullName: "",
    Email: "",
    PhoneNumber: "",
    Gender: "",
    DateOfBirth: "",
    PasswordHash: "", // bắt buộc
    RoleId: 2, // 1 = Admin, 2 = User (User mặc định)
    Status: "Active", // Active / Inactive / Banned
  });
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

  // Gọi API lấy danh sách user
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await UserApi.getAll();
        setUsers(res.data.data || res.data);
      } catch (error) {
        console.error("Lỗi khi load user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();

    // Lấy danh sách roles
    RoleApi.getAll()
      .then((res) => setRoles(res.data.data))
      .catch((err) => console.error("Lỗi load roles:", err));
  }, []);

  // Toggle trạng thái user
  const toggleStatus = (userId) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.UserId === userId
          ? {
              ...user,
              Status: user.Status === "Active" ? "Inactive" : "Active",
            }
          : user
      )
    );
  };

  // Xử lý submit thêm user
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const res = await UserApi.create(newUser); // gọi API thêm user
      const createdUser = res.data.data || res.data; // tùy cấu trúc API trả về

      setUsers([...users, createdUser]); // thêm vào danh sách hiển thị

      // Reset form (đủ các trường)
      setNewUser({
        FullName: "",
        Email: "",
        PhoneNumber: "",
        Gender: "",
        DateOfBirth: "",
        PasswordHash: "", // thêm password
        RoleId: 2, // mặc định User
        Status: "Active", // mặc định hoạt động
      });

      setShowForm(false);

      // ✅ Thông báo thành công
      showToast("success", "🎉 Thêm user thành công!");
    } catch (error) {
      console.error(
        "Lỗi khi thêm user:",
        error.response?.data || error.message
      );

      // ❌ Thông báo lỗi
      showToast("error", "❌ Thêm user thất bại!");
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
                  <i className="fas fa-users me-2"></i>  Quản lý người dùng
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

              {/* Form thêm user */}
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
                        <i className="fas fa-user-plus me-2"></i> Thêm người
                        dùng
                      </h4>

                      <form onSubmit={handleAddUser}>
                        <div className="row g-4">
                          {/* Họ tên */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-user me-2 text-primary"></i>{" "}
                              Họ tên
                            </label>
                            <input
                              type="text"
                              className="form-control custom-input"
                              placeholder="Nhập họ và tên"
                              value={newUser.FullName}
                              onChange={(e) =>
                                setNewUser({
                                  ...newUser,
                                  FullName: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          {/* Email */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-envelope me-2 text-danger"></i>{" "}
                              Email
                            </label>
                            <input
                              type="email"
                              className="form-control custom-input"
                              placeholder="Nhập email"
                              value={newUser.Email}
                              onChange={(e) =>
                                setNewUser({
                                  ...newUser,
                                  Email: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          {/* Số điện thoại */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-phone me-2 text-success"></i>{" "}
                              Số điện thoại
                            </label>
                            <input
                              type="text"
                              className="form-control custom-input"
                              placeholder="Nhập số điện thoại"
                              value={newUser.PhoneNumber}
                              onChange={(e) =>
                                setNewUser({
                                  ...newUser,
                                  PhoneNumber: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          {/* Giới tính */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-venus-mars me-2 text-info"></i>{" "}
                              Giới tính
                            </label>
                            <select
                              className="form-select custom-input"
                              value={newUser.Gender}
                              onChange={(e) =>
                                setNewUser({
                                  ...newUser,
                                  Gender: e.target.value,
                                })
                              }
                              required
                            >
                              <option value="">-- Chọn giới tính --</option>
                              <option value="Male">Nam</option>
                              <option value="Female">Nữ</option>
                              <option value="Other">Khác</option>
                            </select>
                          </div>

                          {/* Ngày sinh */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-calendar me-2 text-warning"></i>{" "}
                              Ngày sinh
                            </label>
                            <input
                              type="date"
                              className="form-control custom-input"
                              value={newUser.DateOfBirth}
                              onChange={(e) =>
                                setNewUser({
                                  ...newUser,
                                  DateOfBirth: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          {/* Mật khẩu */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-lock me-2 text-dark"></i> Mật
                              khẩu
                            </label>
                            <input
                              type="password"
                              className="form-control custom-input"
                              placeholder="Mật khẩu tối thiểu 8 ký tự"
                              value={newUser.PasswordHash}
                              onChange={(e) =>
                                setNewUser({
                                  ...newUser,
                                  PasswordHash: e.target.value,
                                })
                              }
                              required
                              minLength={8}
                            />
                          </div>

                          {/* Vai trò */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-user-shield me-2 text-secondary"></i>{" "}
                              Vai trò
                            </label>
                            <select
                              className="form-select custom-input"
                              value={newUser.RoleId}
                              onChange={(e) =>
                                setNewUser({
                                  ...newUser,
                                  RoleId: Number(e.target.value),
                                })
                              }
                              required
                            >
                              <option value="">-- Chọn vai trò --</option>
                              {roles.map((role) => (
                                <option key={role.RoleId} value={role.RoleId}>
                                  {role.RoleName}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Trạng thái */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-toggle-on me-2 text-success"></i>{" "}
                              Trạng thái
                            </label>
                            <select
                              className="form-select custom-input"
                              value={newUser.Status}
                              onChange={(e) =>
                                setNewUser({
                                  ...newUser,
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
                          <th>Họ tên</th>
                          <th>Email</th>
                          <th>Số điện thoại</th>
                          <th>Vai trò</th>
                          <th>Trạng thái</th>
                          <th className="text-center">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {!loading && users.length > 0 ? (
                          users.map((user, index) => (
                            <tr key={user.UserId} className="table-row-hover">
                              <td className="fw-bold px-4">{index + 1}</td>
                              <td className="fw-semibold">{user.FullName}</td>
                              <td className="text-muted">{user.Email}</td>
                              <td className="text-muted">{user.PhoneNumber}</td>
                              <td>
                                <span
                                  className={`badge role-badge ${
                                    user.role?.RoleName === "Admin"
                                      ? "bg-gradient-primary"
                                      : "bg-gradient-secondary"
                                  }`}
                                >
                                  {user.role?.RoleName || "User"}
                                </span>
                              </td>
                              <td>
                                <label className="switch">
                                  <input
                                    type="checkbox"
                                    checked={user.Status === "Active"}
                                    onChange={() => toggleStatus(user.UserId)}
                                  />
                                  <span className="slider"></span>
                                </label>
                                <span
                                  className={`ms-2 fw-semibold ${
                                    user.Status === "Active"
                                      ? "text-success"
                                      : user.Status === "Inactive"
                                      ? "text-warning"
                                      : "text-danger"
                                  }`}
                                >
                                  {user.Status === "Active"
                                    ? "Hoạt động"
                                    : user.Status === "Inactive"
                                    ? "Khóa"
                                    : "Cấm"}
                                </span>
                              </td>

                              <td className="text-center">
                                <button
                                  className="action-btn text-info"
                                  title="Chi tiết"
                                  onClick={() =>
                                    navigate(`/User/${user.UserId}`)
                                  }
                                >
                                  <i className="fas fa-eye"></i>
                                </button>
                                <button
                                  className="action-btn text-primary"
                                  title="Sửa"
                                  onClick={() =>
                                    navigate(`/User/edit/${user.UserId}`)
                                  }
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button
                                  className="action-btn text-danger"
                                  title="Xóa"
                                  onClick={() =>
                                    deleteUser(user.UserId, setUsers)
                                  }
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7" className="text-center py-3">
                              {loading
                                ? "Đang tải dữ liệu..."
                                : "Không có user"}
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
