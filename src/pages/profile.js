import { useEffect, useState } from "react";
import Loader from "../layouts/Loader";
import MainLayout from "../layouts/MainLayout";
import UserApi from "../api/UserApi";
import RoleApi from "../api/RoleApi";
import gau1 from "../vendors/images/gau1.jpg";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem('UserId');
        
        if (!userId) {
          setError("Không tìm thấy thông tin đăng nhập");
          setLoading(false);
          return;
        }

        const response = await UserApi.getById(userId);
        
        let userData = null;
        
        if (response.data && response.data.data) {
          userData = response.data.data;
        } else if (response.data && (response.data.UserId || response.data.FullName)) {
          userData = response.data;
        } else if (response.UserId || response.FullName) {
          userData = response;
        }
        
        if (!userData) {
          setError("Không thể tải thông tin tài khoản");
          setLoading(false);
          return;
        }
        
        setUser(userData);
        
        // Fetch role information if RoleId exists
        if (userData.RoleId) {
          try {
            const roleResponse = await RoleApi.getById(userData.RoleId);
            
            let roleData = null;
            
            if (roleResponse.data && roleResponse.data.data) {
              roleData = roleResponse.data.data;
            } else if (roleResponse.data) {
              roleData = roleResponse.data;
            } else {
              roleData = roleResponse;
            }
            
            setRole(roleData);
          } catch (roleErr) {
            console.error("Error fetching role:", roleErr);
          }
        }
        
        setError(null);
      } catch (err) {
        setError(`Không thể tải thông tin tài khoản: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    try {
      const parts = dateString.split('-');
      if (parts.length === 3) {
        return `${parts[0]}/${parts[1]}/${parts[2]}`;
      }
      return dateString;
    } catch (e) {
      return dateString;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'badge-success';
      case 'Inactive': return 'badge-warning';
      case 'Banned': return 'badge-danger';
      default: return 'badge-secondary';
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="alert alert-danger" role="alert">
              <h4>Lỗi!</h4>
              <p>{error}</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="alert alert-warning" role="alert">
              <h4>Không có dữ liệu người dùng</h4>
              <p>Vui lòng đăng nhập lại</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Loader />
      <div className="mobile-menu-overlay"></div>

      <div className="main-container">
        <div className="pd-ltr-20 xs-pd-20-10">
          <div className="min-height-200px">
            <div className="page-header">
              <div className="row">
                <div className="col-md-12 col-sm-12">
                  <div className="title">
                    <h4>Hồ Sơ</h4>
                  </div>
                  <nav aria-label="breadcrumb" role="navigation">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <a href="/">Trang chủ</a>
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
                        Hồ Sơ
                      </li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 mb-30">
                <div className="pd-20 card-box height-100-p">
                  <div className="profile-photo">
                    <img src={gau1} alt="Ảnh đại diện" />
                  </div>

                  <h5 className="text-center h5 mb-0">
                    {user?.FullName || "Chưa cập nhật"}
                  </h5>
                  <p className="text-center text-muted font-14">
                    <span className={`badge ${getStatusColor(user?.Status || 'Active')}`}>
                      {user?.Status === 'Active' ? 'Hoạt động' : 
                       user?.Status === 'Inactive' ? 'Không hoạt động' : 
                       user?.Status === 'Banned' ? 'Bị cấm' : user?.Status || "Hoạt động"}
                    </span>
                  </p>

                  <div className="profile-info">
                    <h5 className="mb-20 h5 text-blue">Thông Tin Liên Hệ</h5>
                    <ul>
                      <li>
                        <span>Email:</span> {user?.Email || "Chưa cập nhật"}
                      </li>
                      <li>
                        <span>Số điện thoại:</span> {user?.PhoneNumber || "Chưa cập nhật"}
                      </li>
                      <li>
                        <span>Giới tính:</span> {
                          user?.Gender === 'Male' ? 'Nam' : 
                          user?.Gender === 'Female' ? 'Nữ' : 
                          user?.Gender || "Chưa cập nhật"
                        }
                      </li>
                      <li>
                        <span>Ngày sinh:</span> {formatDate(user?.DateOfBirth)}
                      </li>
                    </ul>
                  </div>

                  <div className="profile-info">
                    <h5 className="mb-20 h5 text-blue">Chi Tiết Tài Khoản</h5>
                    <ul>
                      <li>
                        <span>Mã người dùng:</span> {user?.UserId || "Chưa cập nhật"}
                      </li>
                      <li>
                        <span>Vai trò:</span> {role?.RoleName || "Chưa cập nhật"}
                      </li>
                      <li>
                        <span>Ngày tạo:</span> {formatDate(user?.CreatedAt)}
                      </li>
                      <li>
                        <span>Cập nhật lần cuối:</span> {formatDate(user?.UpdatedAt)}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-xl-8 col-lg-8 col-md-8 col-sm-12 mb-30">
                <div className="card-box height-100-p overflow-hidden">
                  <div className="profile-tab height-100-p">
                    <div className="tab height-100-p">
                      <ul className="nav nav-tabs customtab" role="tablist">
                        <li className="nav-item">
                          <a
                            className="nav-link active"
                            data-toggle="tab"
                            href="#timeline"
                            role="tab"
                          >
                            Lịch Sử
                          </a>
                        </li>
                        <li className="nav-item">
                          <a className="nav-link" data-toggle="tab" href="#tasks" role="tab">
                            Công Việc
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            className="nav-link"
                            data-toggle="tab"
                            href="#setting"
                            role="tab"
                          >
                            Cài Đặt
                          </a>
                        </li>
                      </ul>

                      <div className="tab-content">
                        <div className="tab-pane fade show active" id="timeline" role="tabpanel">
                          <div className="pd-20">
                            <div className="profile-timeline">
                              <div className="timeline-month">
                                <h5>Lịch Sử Tài Khoản</h5>
                              </div>
                              <div className="profile-timeline-list">
                                <ul>
                                  <li>
                                    <div className="date">
                                      {formatDate(user?.CreatedAt)}
                                    </div>
                                    <div className="task-name">
                                      <i className="ion-android-alarm-clock"></i> Tạo Tài Khoản
                                    </div>
                                    <p>Tài khoản của bạn đã được tạo thành công.</p>
                                  </li>
                                  {user?.UpdatedAt && user?.UpdatedAt !== user?.CreatedAt && (
                                    <li>
                                      <div className="date">
                                        {formatDate(user?.UpdatedAt)}
                                      </div>
                                      <div className="task-name">
                                        <i className="ion-ios-clock"></i> Cập Nhật Hồ Sơ
                                      </div>
                                      <p>Thông tin hồ sơ của bạn đã được cập nhật.</p>
                                    </li>
                                  )}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="tab-pane fade" id="tasks" role="tabpanel">
                          <div className="pd-20 profile-task-wrap">
                            <div className="container pd-0">
                              <div className="task-title row align-items-center">
                                <div className="col-md-12">
                                  <h5>Công Việc Của Bạn</h5>
                                </div>
                              </div>
                              <div className="profile-task-list pb-30">
                                <p className="text-muted">Chưa có công việc nào</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="tab-pane fade height-100-p" id="setting" role="tabpanel">
                          <div className="profile-setting">
                            <div className="profile-edit-list row">
                              <div className="weight-500 col-md-6">
                                <h4 className="text-blue h5 mb-20">Thông Tin Cá Nhân</h4>
                                
                                <div className="mb-3">
                                  <label className="form-label">Họ và Tên</label>
                                  <input 
                                    className="form-control form-control-lg" 
                                    type="text"
                                    defaultValue={user?.FullName || ""}
                                    placeholder="Nhập họ và tên"
                                  />
                                </div>

                                <div className="mb-3">
                                  <label className="form-label">Email</label>
                                  <input 
                                    className="form-control form-control-lg" 
                                    type="email"
                                    defaultValue={user?.Email || ""}
                                    disabled
                                  />
                                  <small className="form-text text-muted">
                                    Email không thể thay đổi
                                  </small>
                                </div>

                                <div className="mb-3">
                                  <label className="form-label">Số Điện Thoại</label>
                                  <input 
                                    className="form-control form-control-lg" 
                                    type="text"
                                    defaultValue={user?.PhoneNumber || ""}
                                    placeholder="Nhập số điện thoại"
                                  />
                                </div>

                                <div className="mb-3">
                                  <button type="button" className="btn btn-primary">
                                    Cập Nhật Hồ Sơ
                                  </button>
                                </div>
                              </div>

                              <div className="weight-500 col-md-6">
                                <h4 className="text-blue h5 mb-20">Thông Tin Tài Khoản</h4>
                                
                                <div className="mb-3">
                                  <label className="form-label">Mã Người Dùng</label>
                                  <input
                                    className="form-control form-control-lg"
                                    type="text"
                                    value={user?.UserId || ""}
                                    disabled
                                  />
                                </div>

                                <div className="mb-3">
                                  <label className="form-label">Trạng Thái</label>
                                  <input
                                    className="form-control form-control-lg"
                                    type="text"
                                    value={
                                      user?.Status === 'Active' ? 'Hoạt động' : 
                                      user?.Status === 'Inactive' ? 'Không hoạt động' : 
                                      user?.Status === 'Banned' ? 'Bị cấm' : 'Hoạt động'
                                    }
                                    disabled
                                  />
                                </div>

                                <div className="mb-3">
                                  <label className="form-label">Ngày Tạo</label>
                                  <input
                                    className="form-control form-control-lg"
                                    type="text"
                                    value={formatDate(user?.CreatedAt)}
                                    disabled
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
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
};

export default Profile;