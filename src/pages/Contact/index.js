import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../styles/User.css";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import "animate.css";
import Loader from "../../layouts/Loader";
import ContactApi from "../../api/ContactApi";

/* ── Badge helpers ── */
const statusBadgeClass = {
  "Chưa xử lý":
    "badge bg-danger-subtle text-danger border border-danger-subtle",
  "Đang xử lý":
    "badge bg-warning-subtle text-warning border border-warning-subtle",
  "Đã xử lý":
    "badge bg-success-subtle text-success border border-success-subtle",
};

/* ── Toast helper ── */
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

export default function Contact() {
  /* ── State ── */
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");

  /* ── Fetch all contacts ── */
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await ContactApi.getAll();
      const data = res.data?.data ?? res.data ?? [];
      setContacts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Lỗi load liên hệ:", err);
      showToast("error", "❌ Không thể tải danh sách liên hệ!");
    } finally {
      setLoading(false);
    }
  };

  /* ── Open detail panel ── */
  const handleViewDetail = (contact) => {
    setSelectedContact(contact);
    setSelectedStatus(contact.Status ?? contact.status ?? "Chưa xử lý");
    setReplyText("");
    setShowDetail(true);
  };

  /* ── Update status + send reply ── */
  const handleSubmitReply = async () => {
    if (!selectedContact) return;
    try {
      setSubmitting(true);
      const id = selectedContact.ContactId ?? selectedContact.id;

      await ContactApi.update(id, {
        Status: selectedStatus,
        Reply: replyText,
        Name: selectedContact.Name ?? selectedContact.name,
        Email: selectedContact.Email ?? selectedContact.email,
        Phone: selectedContact.Phone ?? selectedContact.phone,
        Subject: selectedContact.Subject ?? selectedContact.subject,
        Message: selectedContact.Message ?? selectedContact.message,
      });

      // Cập nhật local state
      setContacts((prev) =>
        prev.map((c) => {
          const cId = c.ContactId ?? c.id;
          return cId === id
            ? { ...c, Status: selectedStatus, status: selectedStatus }
            : c;
        })
      );

      showToast("success", "✅ Cập nhật thành công!");
      setShowDetail(false);
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      showToast("error", "❌ Cập nhật thất bại!");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Delete contact ── */
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Xác nhận xóa?",
      text: "Liên hệ này sẽ bị xóa vĩnh viễn!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e5383b",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });
    if (!confirm.isConfirmed) return;

    try {
      await ContactApi.delete(id);
      setContacts((prev) => prev.filter((c) => (c.ContactId ?? c.id) !== id));
      showToast("success", "🗑️ Đã xóa liên hệ!");
      if (
        selectedContact &&
        (selectedContact.ContactId ?? selectedContact.id) === id
      ) {
        setShowDetail(false);
      }
    } catch (err) {
      console.error("Lỗi xóa:", err);
      showToast("error", "❌ Xóa thất bại!");
    }
  };

  /* ── Filter & search ── */
  const filteredContacts = contacts.filter((c) => {
    const name = (c.Name ?? c.name ?? "").toLowerCase();
    const email = (c.Email ?? c.email ?? "").toLowerCase();
    const subject = (c.Subject ?? c.subject ?? "").toLowerCase();
    const status = c.Status ?? c.status ?? "";
    const q = searchText.toLowerCase();

    const matchSearch =
      !q || name.includes(q) || email.includes(q) || subject.includes(q);
    const matchStatus = filterStatus === "Tất cả" || status === filterStatus;

    return matchSearch && matchStatus;
  });

  /* ── Stats ── */
  const stats = [
    {
      label: "Tổng liên hệ",
      value: contacts.length,
      icon: "fas fa-inbox",
      color: "text-primary",
    },
    {
      label: "Chưa xử lý",
      value: contacts.filter((c) => (c.Status ?? c.status) === "Chưa xử lý")
        .length,
      icon: "fas fa-clock",
      color: "text-danger",
    },
    {
      label: "Đang xử lý",
      value: contacts.filter((c) => (c.Status ?? c.status) === "Đang xử lý")
        .length,
      icon: "fas fa-spinner",
      color: "text-warning",
    },
    {
      label: "Đã xử lý",
      value: contacts.filter((c) => (c.Status ?? c.status) === "Đã xử lý")
        .length,
      icon: "fas fa-check-circle",
      color: "text-success",
    },
  ];

  if (loading) return <Loader />;

  return (
    <div>
      <MainLayout>
        <main>
          <div className="main-container">
            <div className="pd-ltr-20">
              {/* ── Header ── */}
              <div className="d-flex justify-content-between align-items-center mb-4 p-3 shadow-sm bg-gradient rounded-4 header-box">
                <h3 className="m-0 text-white fw-bold d-flex align-items-center">
                  <i className="fas fa-envelope-open-text me-2"></i> Quản lý
                  liên hệ
                </h3>
                <button
                  className="btn btn-light shadow-sm rounded-pill px-3 fw-semibold"
                  onClick={fetchContacts}
                >
                  <i className="fas fa-sync-alt me-1 text-primary"></i> Làm mới
                </button>
              </div>

              {/* ── Thống kê nhanh ── */}
              <div className="row g-3 mb-4">
                {stats.map((stat, i) => (
                  <div className="col-md-3 col-6" key={i}>
                    <div className="card border-0 shadow-sm rounded-4 text-center p-3">
                      <i className={`${stat.icon} ${stat.color} fs-3 mb-2`}></i>
                      <h4 className="fw-bold mb-0">{stat.value}</h4>
                      <small className="text-muted">{stat.label}</small>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Search + Filter bar ── */}
              {/* ── Search + Filter bar ── */}
              <div
                className="d-flex align-items-center gap-2 mb-4 px-3 py-2 rounded-4"
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e5e7eb",
                  width: "fit-content",
                }}
              >
                <i
                  className="fas fa-search"
                  style={{ color: "#9ca3af", fontSize: 13 }}
                ></i>
                <input
                  type="text"
                  className="border-0 bg-transparent"
                  placeholder="Tìm tên, email, chủ đề..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{
                    outline: "none",
                    fontSize: 13.5,
                    color: "#374151",
                    width: 220,
                  }}
                />
                <div
                  style={{
                    width: 1,
                    height: 22,
                    background: "#e5e7eb",
                    flexShrink: 0,
                  }}
                />
                {["Tất cả", "Chưa xử lý", "Đang xử lý", "Đã xử lý"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    style={{
                      border: "none",
                      background:
                        filterStatus === s ? "#111827" : "transparent",
                      color: filterStatus === s ? "#fff" : "#6b7280",
                      borderRadius: 20,
                      padding: "5px 14px",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      transition: "all 0.18s ease",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* ── Panel chi tiết ── */}
              <AnimatePresence>
                {showDetail && selectedContact && (
                  <motion.div
                    initial={{ y: -80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -80, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="card border-0 shadow-lg rounded-4 mb-4 form-add-user"
                  >
                    <div className="card-body p-4">
                      <h4 className="fw-bold mb-4 text-primary d-flex align-items-center">
                        <i className="fas fa-envelope me-2"></i> Chi tiết liên
                        hệ
                      </h4>

                      <div className="row g-4">
                        <div className="col-md-6">
                          <label className="form-label fw-bold">
                            <i className="fas fa-user me-2 text-primary"></i> Họ
                            tên
                          </label>
                          <input
                            type="text"
                            className="form-control custom-input"
                            value={
                              selectedContact.FullName ?? selectedContact.fullname ?? ""
                            }
                            readOnly
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-bold">
                            <i className="fas fa-at me-2 text-danger"></i> Email
                          </label>
                          <input
                            type="text"
                            className="form-control custom-input"
                            value={
                              selectedContact.Email ??
                              selectedContact.email ??
                              ""
                            }
                            readOnly
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-bold">
                            <i className="fas fa-phone me-2 text-success"></i>{" "}
                            Số điện thoại
                          </label>
                          <input
                            type="text"
                            className="form-control custom-input"
                            value={
                              selectedContact.Phone ??
                              selectedContact.phone ??
                              ""
                            }
                            readOnly
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-bold">
                            <i className="fas fa-tag me-2 text-warning"></i> Chủ
                            đề
                          </label>
                          <input
                            type="text"
                            className="form-control custom-input"
                            value={
                              selectedContact.Message ??
                              selectedContact.message ??
                              ""
                            }
                            readOnly
                          />
                        </div>

                        <div className="col-12">
                          <label className="form-label fw-bold">
                            <i className="fas fa-comment-dots me-2 text-info"></i>{" "}
                            Nội dung
                          </label>
                          <textarea
                            className="form-control custom-input"
                            value={
                              selectedContact.Message ??
                              selectedContact.message ??
                              ""
                            }
                            rows="4"
                            readOnly
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-bold">
                            <i className="fas fa-calendar-alt me-2 text-secondary"></i>{" "}
                            Ngày gửi
                          </label>
                          <input
                            type="text"
                            className="form-control custom-input"
                            value={
                              selectedContact.CreatedAt ??
                              selectedContact.created_at ??
                              selectedContact.createdAt ??
                              ""
                            }
                            readOnly
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-bold">
                            <i className="fas fa-info-circle me-2 text-primary"></i>{" "}
                            Trạng thái
                          </label>
                          <select
                            className="form-select custom-input"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                          >
                            <option value="Chưa xử lý">Chưa xử lý</option>
                            <option value="Đang xử lý">Đang xử lý</option>
                            <option value="Đã xử lý">Đã xử lý</option>
                          </select>
                        </div>

                        <div className="col-12">
                          <label className="form-label fw-bold">
                            <i className="fas fa-reply me-2 text-success"></i>{" "}
                            Phản hồi khách hàng
                          </label>
                          <textarea
                            className="form-control custom-input"
                            placeholder="Nhập nội dung phản hồi tới khách hàng..."
                            rows="3"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="col-12 text-end mt-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          className="btn btn-gradient-success me-2 rounded-pill px-4"
                          onClick={handleSubmitReply}
                          disabled={submitting}
                        >
                          {submitting ? (
                            <>
                              <i className="fas fa-spinner fa-spin me-1"></i>{" "}
                              Đang gửi...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-paper-plane me-1"></i> Gửi
                              phản hồi
                            </>
                          )}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          className="btn btn-gradient-secondary rounded-pill px-4"
                          onClick={() => setShowDetail(false)}
                        >
                          <i className="fas fa-times me-1"></i> Đóng
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Bảng danh sách ── */}
              <div className="card border-0 shadow-sm rounded-4 animate__animated animate__fadeIn">
                <div className="card-body p-4">
                  {filteredContacts.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                      <i className="fas fa-inbox fs-1 mb-3 d-block"></i>
                      <p className="mb-0">Không có liên hệ nào</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table align-middle table-hover table-striped">
                        <thead className="bg-light text-dark border-bottom">
                          <tr>
                            <th className="px-4">STT</th>
                            <th>Họ tên</th>
                            <th>Email</th>
                            <th>Số điện thoại</th>
                            <th>Chủ đề</th>
                            <th>Ngày gửi</th>
                            <th>Trạng thái</th>
                            <th className="text-center">Hành động</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredContacts.map((contact, index) => {
                            const id = contact.ContactId ?? contact.id;
                            const name = contact.FullName ?? contact.fullname ?? "—";
                            const email = contact.Email ?? contact.email ?? "—";
                            const phone = contact.Phone ?? contact.phone ?? "—";
                            const subject =
                              contact.Message ?? contact.message ?? "—";
                            const status =
                              contact.Status ?? contact.status ?? "Chưa xử lý";
                            const date =
                              contact.CreatedAt ??
                              contact.created_at ??
                              contact.createdAt ??
                              "—";

                            return (
                              <tr key={id} className="table-row-hover">
                                <td className="fw-bold px-4">{index + 1}</td>
                                <td className="fw-semibold">{name}</td>
                                <td>{email}</td>
                                <td>{phone}</td>
                                <td>{subject}</td>
                                <td>{date}</td>
                                <td>
                                  <span
                                    className={
                                      statusBadgeClass[status] ??
                                      "badge bg-secondary"
                                    }
                                  >
                                    {status}
                                  </span>
                                </td>
                                <td className="text-center">
                                  <button
                                    className="action-btn text-info"
                                    title="Xem chi tiết"
                                    onClick={() => handleViewDetail(contact)}
                                  >
                                    <i className="fas fa-eye"></i>
                                  </button>
                                  <button
                                    className="action-btn text-success"
                                    title="Phản hồi"
                                    onClick={() => handleViewDetail(contact)}
                                  >
                                    <i className="fas fa-reply"></i>
                                  </button>
                                  <button
                                    className="action-btn text-danger"
                                    title="Xóa"
                                    onClick={() => handleDelete(id)}
                                  >
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </MainLayout>
    </div>
  );
}
