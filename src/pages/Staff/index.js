import React, { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../styles/User.css";
import StaffApi from "../../api/StaffApi";
import CinemasApi from "../../api/CinemasApi";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import "animate.css";
import Loader from "../../layouts/Loader";
import { deleteStaff } from "./delete";
import Cinemas from "../Cinemas";

export default function Staff() {
  const [staffs, setStaffs] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [newStaff, setNewStaff] = useState({
    CinemaId: "",
    FullName: "",
    Email: "",
    Phone: "",
    Position: "",
    Status: "Active",
  });

  useEffect(() => {
    // Lấy tất cả staff
    StaffApi.getAll()
      .then((res) => {
        console.log("📡 Dữ liệu staff:", res.data.data);
        setStaffs(res.data.data);
      })
      .catch((err) => console.error("Lỗi load staff:", err))
      .finally(() => setLoading(false));

    // Lấy danh sách cinema
    CinemasApi.getAll()
      .then((res) => {
        console.log("📡 Dữ liệu cinemas:", res.data.data);
        setCinemas(res.data.data);
      })
      .catch((err) => console.error("Lỗi load cinemas:", err));
  }, []);

  const handleAddStaff = async (e) => {
    e.preventDefault();
    try {
      const res = await StaffApi.create(newStaff);
      const createdStaff = res.data.data || res.data;

      setStaffs([...staffs, createdStaff]);

      // reset form
      setNewStaff({
        CinemaId: "",
        FullName: "",
        Email: "",
        Phone: "",
        Position: "",
        Status: "Active",
      });
      setShowForm(false);

      showToast("success", "🎉 Thêm nhân viên thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm staff:", error);
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
  const toggleStatus = async (StaffId, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";

    try {
      const staff = staffs.find((s) => s.StaffId === StaffId);

      await StaffApi.update(StaffId, {
        CinemaId: staff.CinemaId?.CinemaId || staff.CinemaId, // ✅ Lấy ID thực sự
        FullName: staff.FullName,
        Email: staff.Email,
        Phone: staff.Phone,
        Position: staff.Position,
        Status: newStatus,
      });

      setStaffs((prev) =>
        prev.map((s) =>
          s.StaffId === StaffId ? { ...s, Status: newStatus } : s
        )
      );

      showToast("success", "✅ Cập nhật trạng thái thành công!");
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật trạng thái:", error);
      showToast("error", "❌ Không thể cập nhật trạng thái!");
    }
  };
  const getPositionBadgeClass = (position) => {
    const positionLower = position?.toLowerCase() || "";
    if (positionLower.includes("quản lý")) return "badge bg-danger";
    if (positionLower.includes("soát vé")) return "badge bg-primary";
    if (positionLower.includes("kỹ thuật")) return "badge bg-warning";
    if (positionLower.includes("bán hàng")) return "badge bg-success";
    return "badge bg-secondary";
  };

  if (loading) return <Loader />;

  return (
    <div>
      <MainLayout>
        <main>
          <div className="main-container">
            <div className="pd-ltr-20">
              {/* Header */}
              <div className="d-flex justify-content-between align-items-center mb-4 p-3 shadow-sm bg-gradient rounded-4 header-box">
                <h3 className="m-0 text-white fw-bold d-flex align-items-center">
                  <i className="fas fa-users me-2"></i> Quản lý nhân viên
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
                    className="card border-0 shadow-lg rounded-4 mb-4 form-add-user"
                  >
                    <div className="card-body p-4">
                      <h4 className="fw-bold mb-4 text-primary d-flex align-items-center">
                        <i className="fas fa-user-plus me-2"></i> Thêm nhân viên
                        mới
                      </h4>

                      <form onSubmit={handleAddStaff}>
                        <div className="row g-4">
                          {/* Rạp chiếu */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-film me-2 text-primary"></i>
                              Rạp chiếu
                            </label>
                            <select
                              className="form-select custom-input"
                              value={newStaff.CinemaId}
                              onChange={(e) =>
                                setNewStaff({
                                  ...newStaff,
                                  CinemaId: e.target.value,
                                })
                              }
                              required
                            >
                              <option value="">-- Chọn rạp làm việc --</option>
                              {cinemas.map((c) => (
                                <option key={c.CinemaId} value={c.CinemaId}>
                                  🎬 {c.Name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Họ tên */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-user me-2 text-danger"></i>
                              Họ và tên
                            </label>
                            <input
                              type="text"
                              className="form-control custom-input"
                              placeholder="VD: Nguyễn Văn A"
                              value={newStaff.FullName}
                              onChange={(e) =>
                                setNewStaff({
                                  ...newStaff,
                                  FullName: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          {/* Email */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-envelope me-2 text-success"></i>
                              Email
                            </label>
                            <input
                              type="email"
                              className="form-control custom-input"
                              placeholder="VD: nhanvien@cinema.vn"
                              value={newStaff.Email}
                              onChange={(e) =>
                                setNewStaff({
                                  ...newStaff,
                                  Email: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          {/* Số điện thoại */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-phone me-2 text-info"></i>
                              Số điện thoại
                            </label>
                            <input
                              type="tel"
                              className="form-control custom-input"
                              placeholder="VD: 0901234567"
                              value={newStaff.Phone}
                              onChange={(e) =>
                                setNewStaff({
                                  ...newStaff,
                                  Phone: e.target.value,
                                })
                              }
                            />
                          </div>

                          {/* Chức vụ */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-briefcase me-2 text-warning"></i>
                              Chức vụ
                            </label>
                            <select
                              className="form-select custom-input"
                              value={newStaff.Position}
                              onChange={(e) =>
                                setNewStaff({
                                  ...newStaff,
                                  Position: e.target.value,
                                })
                              }
                              required
                            >
                              <option value="">-- Chọn chức vụ --</option>
                              <option value="Quản lý">👔 Quản lý</option>
                              <option value="Soát vé">🎫 Soát vé</option>
                              <option value="Bán hàng">💰 Bán hàng</option>
                              <option value="Kỹ thuật viên">
                                🔧 Kỹ thuật viên
                              </option>
                              <option value="Lễ tân">👋 Lễ tân</option>
                              <option value="Bảo vệ">🛡️ Bảo vệ</option>
                            </select>
                          </div>

                          {/* Trạng thái */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-toggle-on me-2 text-success"></i>
                              Trạng thái
                            </label>
                            <select
                              className="form-select custom-input"
                              value={newStaff.Status}
                              onChange={(e) =>
                                setNewStaff({
                                  ...newStaff,
                                  Status: e.target.value,
                                })
                              }
                              required
                            >
                              <option value="Active">✅ Đang làm việc</option>
                              <option value="Inactive">❌ Nghỉ việc</option>
                            </select>
                          </div>

                          {/* Summary Box - Hiển thị khi có đủ thông tin */}
                          {newStaff.CinemaId &&
                            newStaff.FullName &&
                            newStaff.Email &&
                            newStaff.Position && (
                              <div className="col-12">
                                <div
                                  className="alert alert-warning"
                                  role="alert"
                                >
                                  <div className="d-flex align-items-center mb-3">
                                    <i className="fas fa-id-card me-2 fs-4"></i>
                                    <h5 className="mb-0 fw-bold">
                                      Thông tin nhân viên
                                    </h5>
                                  </div>
                                  <div className="ms-4">
                                    <p className="mb-2">
                                      <i className="fas fa-user me-2 text-danger"></i>
                                      Họ tên:{" "}
                                      <strong>{newStaff.FullName}</strong>
                                    </p>
                                    <p className="mb-2">
                                      <i className="fas fa-film me-2 text-primary"></i>
                                      Rạp:{" "}
                                      <strong>
                                        {
                                          cinemas.find(
                                            (c) =>
                                              c.CinemaId === newStaff.CinemaId
                                          )?.Name
                                        }
                                      </strong>
                                    </p>
                                    <p className="mb-2">
                                      <i className="fas fa-briefcase me-2 text-warning"></i>
                                      Chức vụ:{" "}
                                      <strong className="text-primary">
                                        {newStaff.Position === "Quản lý"
                                          ? "👔 Quản lý"
                                          : newStaff.Position === "Soát vé"
                                          ? "🎫 Soát vé"
                                          : newStaff.Position === "Bán hàng"
                                          ? "💰 Bán hàng"
                                          : newStaff.Position ===
                                            "Kỹ thuật viên"
                                          ? "🔧 Kỹ thuật viên"
                                          : newStaff.Position === "Lễ tân"
                                          ? "👋 Lễ tân"
                                          : "🛡️ Bảo vệ"}
                                      </strong>
                                    </p>
                                    <p className="mb-2">
                                      <i className="fas fa-envelope me-2 text-success"></i>
                                      Email:{" "}
                                      <strong className="text-success">
                                        {newStaff.Email}
                                      </strong>
                                    </p>
                                    {newStaff.Phone && (
                                      <p className="mb-2">
                                        <i className="fas fa-phone me-2 text-info"></i>
                                        Điện thoại:{" "}
                                        <strong>{newStaff.Phone}</strong>
                                      </p>
                                    )}
                                    <p className="mb-0">
                                      <i className="fas fa-tag me-2 text-warning"></i>
                                      Trạng thái:{" "}
                                      <strong
                                        className={
                                          newStaff.Status === "Active"
                                            ? "text-success"
                                            : "text-danger"
                                        }
                                      >
                                        {newStaff.Status === "Active"
                                          ? "✅ Đang làm việc"
                                          : "❌ Nghỉ việc"}
                                      </strong>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
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
                          <th className="px-4">STT</th>
                          <th>Họ tên</th>
                          <th>Rạp chiếu</th>
                          <th>Email</th>
                          <th>Số điện thoại</th>
                          <th>Chức vụ</th>
                          <th>Trạng thái</th>
                          <th className="text-center">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {!loading && staffs.length > 0
                          ? staffs.map((staff, index) => (
                              <tr
                                key={staff.StaffId}
                                className="table-row-hover"
                              >
                                <td className="fw-bold px-4">{index + 1}</td>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <span className="fw-semibold">
                                      {staff.FullName}
                                    </span>
                                  </div>
                                </td>
                                <td className="fw-semibold">
                                  {staff.CinemaId?.Name || "Không có rạp"}
                                </td>

                                <td>
                                  <i className="fw-semibold"></i>
                                  {staff.Email}
                                </td>
                                <td>
                                  <i className="fw-semibold"></i>
                                  {staff.Phone || "N/A"}
                                </td>
                                <td>
                                  <span
                                    className={getPositionBadgeClass(
                                      staff.Position
                                    )}
                                  >
                                    <i className={` ${staff.Position}`}></i>
                                    {staff.Position}
                                  </span>
                                </td>
                                <td>
                                  <label className="switch">
                                    <input
                                      type="checkbox"
                                      checked={staff.Status === "Active"}
                                      onChange={() =>
                                        toggleStatus(
                                          staff.StaffId,
                                          staff.Status
                                        )
                                      }
                                    />
                                    <span className="slider"></span>
                                  </label>
                                  <span
                                    className={`ms-2 fw-semibold ${
                                      staff.Status === "Active"
                                        ? "text-success"
                                        : "text-danger"
                                    }`}
                                  >
                                    {staff.Status === "Active"
                                      ? "Đang làm"
                                      : "Nghỉ việc"}
                                  </span>
                                </td>

                                <td className="text-center">
                                  <button
                                    className="action-btn text-info"
                                    title="Chi tiết"
                                    onClick={() =>
                                      navigate(`/staffs/show/${staff.StaffId}`)
                                    }
                                  >
                                    <i className="fas fa-eye"></i>
                                  </button>
                                  <button
                                    className="action-btn text-primary"
                                    title="Sửa"
                                    onClick={() =>
                                      navigate(`/staffs/edit/${staff.StaffId}`)
                                    }
                                  >
                                    <i className="fas fa-edit"></i>
                                  </button>
                                  <button
                                    onClick={() =>
                                      deleteStaff(staff.StaffId, setStaffs)
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
                                <td colSpan="8" className="py-3">
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
