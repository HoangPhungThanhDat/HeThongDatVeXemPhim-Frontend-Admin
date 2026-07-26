// src/views/auth/signIn/index.jsx
import React, { useState, useEffect } from "react";
import { 
  Film, Eye, EyeOff, ArrowRight, Ticket, Calendar, Users, 
  TrendingUp, Award, Clock, Shield, Star, Sparkles, 
  Zap, CheckCircle, Play, Circle, Layers,
  Monitor, Smartphone, Globe, Lock, Mail, User, 
  AlertCircle, Music, Clapperboard, XCircle
} from "lucide-react";
import AuthApi from "api/AuthApi";
import { jwtDecode } from "jwt-decode";
import "../../../assets/css/Login.css";

/* ── Live Clock ── */
function LiveClock() {
  const [time, setTime] = useState("--:--:--");
  useEffect(() => {
    const tick = () => {
      const n = new Date();
      const p = v => String(v).padStart(2, "0");
      setTime(`${p(n.getHours())}:${p(n.getMinutes())}:${p(n.getSeconds())}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="ga-clock">
      <Clock size={14} />
      <span className="ga-clock-text">{time} · HCMC</span>
    </div>
  );
}

/* ── CountUp ── */
function CountUp({ target, suffix = "" }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const step = Math.max(1, Math.ceil(target / 40));
    let n = 0;
    const id = setInterval(() => {
      n = Math.min(n + step, target);
      setVal(n);
      if (n >= target) clearInterval(id);
    }, 30);
    return () => clearInterval(id);
  }, [target]);
  return <>{val}{suffix}</>;
}

/* ── Field ── */
function Field({ label, delay, icon, error, errorMsg, children }) {
  return (
    <div className="ga-field" style={{ animationDelay: `${delay}s` }}>
      <div className="ga-field-label">
        {icon}
        <span>{label}</span>
      </div>
      <div className="ga-input-wrap">
        {children}
        <div className="ga-input-shimmer" />
      </div>
      {error && (
        <div className="ga-error-msg">
          <AlertCircle size={12} />
          {errorMsg || 'Vui lòng nhập thông tin'}
        </div>
      )}
    </div>
  );
}

/* ── Google Icon Component ── */
const GoogleIcon = () => (
  <svg viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
);

/* ── MAIN ── */
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [pwdError, setPwdError] = useState(false);
  const [googleError, setGoogleError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // ── DASHBOARD URL ──
  const DASHBOARD_URL = "/admin/default";

  // ============================================
  // XỬ LÝ GOOGLE CALLBACK
  // ============================================
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const error = urlParams.get('error');
    
    console.log("🔍 Page loaded - Token:", token ? "Yes (length: " + token.length + ")" : "No");
    console.log("🔍 Page loaded - Error:", error);
    console.log("🔍 Full URL:", window.location.href);
    
    if (error) {
      setGoogleError(decodeURIComponent(error));
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }
    
    if (token) {
      setIsProcessing(true);
      
      const processGoogleLogin = async () => {
        try {
          console.log("✅ Processing Google token...");
          
          const response = await AuthApi.verifyGoogleToken(token);
          console.log("✅ Response verify:", response.data);
          
          const { user } = response.data;
          
          // ✅ KIỂM TRA ROLE
          const roleId = user.RoleId;
          const roleName = user.RoleName || user.role;
          
          if (roleId !== 1 && roleName !== "Admin") {
            console.warn("❌ User is not admin:", { roleId, roleName });
            setGoogleError("Tài khoản không có quyền truy cập Admin! Vui lòng liên hệ quản trị viên.");
            setIsProcessing(false);
            localStorage.removeItem("token");
            window.history.replaceState({}, document.title, window.location.pathname);
            return;
          }
          
          if (user.Status !== "Active" && user.Status !== "active") {
            setGoogleError("Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên!");
            setIsProcessing(false);
            localStorage.removeItem("token");
            window.history.replaceState({}, document.title, window.location.pathname);
            return;
          }
          
          localStorage.setItem("token", token);
          localStorage.setItem("role", user.RoleName || "Admin");
          localStorage.setItem("fullname", user.FullName);
          localStorage.setItem("UserId", user.UserId);
          localStorage.setItem("email", user.Email);
          
          console.log("✅ Đã lưu thông tin user:", {
            roleId: user.RoleId,
            roleName: user.RoleName,
            fullname: user.FullName,
            email: user.Email,
            status: user.Status
          });
          
          window.history.replaceState({}, document.title, window.location.pathname);
          window.location.href = DASHBOARD_URL;
          
        } catch (err) {
          console.error("❌ Google login error:", err);
          setGoogleError("Xác thực Google thất bại. Vui lòng thử lại!");
          setIsProcessing(false);
        }
      };
      
      processGoogleLogin();
    }
  }, []);

  // ============================================
  // VALIDATE
  // ============================================
  const validate = () => {
    let valid = true;
    if (!email.trim()) { setEmailError(true); valid = false; } else setEmailError(false);
    if (!password.trim()) { setPwdError(true); valid = false; } else setPwdError(false);
    return valid;
  };

  // ============================================
  // LOGIN HANDLER (Email/Password)
  // ============================================
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setGoogleError(null);
    try {
      const response = await AuthApi.Login({ Email: email, Password: password });
      const { token, user } = response.data;
      const decoded = jwtDecode(token);
      const roleName = decoded.role || decoded.RoleName;
      if (roleName !== "Admin") {
        alert("Bạn không có quyền đăng nhập vào hệ thống!");
        setLoading(false);
        return;
      }
      localStorage.setItem("token", token);
      localStorage.setItem("role", roleName);
      localStorage.setItem("fullname", user.FullName);
      localStorage.setItem("UserId", user.UserId);
      localStorage.setItem("email", user.Email);
      window.location.href = DASHBOARD_URL;
    } catch (error) {
      if (error.response?.status === 401) {
        setEmailError(true);
        setPwdError(true);
        alert("Sai tên đăng nhập hoặc mật khẩu!");
      } else {
        alert("Đăng nhập thất bại. Vui lòng thử lại!");
      }
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // GOOGLE LOGIN HANDLER
  // ============================================
  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    setGoogleError(null);
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  // ============================================
  // RENDER LOADING STATE
  // ============================================
  if (isProcessing || googleLoading) {
    return (
      <div className="ga-root">
        <div className="ga-bg-gradient" />
        <div className="ga-bg-grid" />
        <div className="ga-bg-orb ga-bg-orb-1" />
        <div className="ga-bg-orb ga-bg-orb-2" />
        
        <div className="ga-loading-wrapper">
          <div className="ga-loading-card">
            <div className="ga-loading-logo">
              <div className="ga-loading-logo-icon">
                <Film />
              </div>
              <span className="ga-loading-logo-text"><span>Gấu</span>Phim</span>
            </div>

            <div className="ga-loading-spinner">
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
              <div className="spinner-center">
                <Film />
              </div>
            </div>

            <h2 className="ga-loading-title">Đang xử lý đăng nhập...</h2>
            <p className="ga-loading-sub">Vui lòng chờ trong giây lát</p>

            <div className="ga-loading-bar">
              <div className="ga-loading-bar-track">
                <div className="ga-loading-bar-fill"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const FEATURES = ["Phim chiếu rạp", "Suất chiếu", "Đặt vé", "Quản lý ghế", "Doanh thu", "Khuyến mãi"];

  return (
    <div className="ga-root">
      {/* Background */}
      <div className="ga-bg-gradient" />
      <div className="ga-bg-grid" />
      <div className="ga-bg-orb ga-bg-orb-1" />
      <div className="ga-bg-orb ga-bg-orb-2" />

      {/* Card */}
      <div className="ga-card">
        {/* ════ LEFT PANEL ════ */}
        <div className="ga-left">
          <div className="ga-left-glow" />
          <div className="ga-left-glow-2" />

          {/* Logo */}
          <div className="ga-logo">
            <div className="ga-logo-icon">
              <Film />
            </div>
            <div>
              <div className="ga-logo-text"><span>Gấu</span>Phim</div>
              <div className="ga-logo-sub">Cinema Management</div>
            </div>
          </div>

          {/* Hero */}
          <div className="ga-hero">
            <div className="ga-badge">
              <div className="ga-badge-dot" />
              <span className="ga-badge-text">Hệ thống đang hoạt động</span>
            </div>

            <div className="ga-title">
              Quản lý<br />
              <span className="ga-title-highlight">Rạp Phim</span>
            </div>
            <p className="ga-subtitle">
              Nền tảng quản trị toàn diện cho hệ thống rạp chiếu phim GấuPhim — 
              từ lịch chiếu, đặt vé đến báo cáo doanh thu.
            </p>
            <LiveClock />

            {/* Stats */}
            <div className="ga-stats">
              <div className="ga-stat-item">
                <div className="ga-stat-number"><CountUp target={12} /></div>
                <div className="ga-stat-label">Rạp chiếu</div>
              </div>
              <div className="ga-stat-item">
                <div className="ga-stat-number"><CountUp target={480} suffix="+" /></div>
                <div className="ga-stat-label">Suất/ngày</div>
              </div>
              <div className="ga-stat-item">
                <div className="ga-stat-number">24/7</div>
                <div className="ga-stat-label">Hoạt động</div>
              </div>
            </div>

            {/* Features */}
            <div className="ga-features">
              {FEATURES.map(f => (
                <div key={f} className="ga-feature">
                  <div className="ga-feature-dot" />
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="ga-footer">
            <div className="ga-footer-content">
              <span className="ga-footer-flag">🇻🇳</span>
              <div>
                <div className="ga-footer-text">
                  <strong>GấuPhim</strong> — Hệ thống rạp chiếu phim hàng đầu Việt Nam
                </div>
                <div className="ga-footer-text" style={{ fontSize: 10, opacity: 0.4 }}>
                  Hoàng Sa – Trường Sa là của Việt Nam
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ════ RIGHT PANEL ════ */}
        <div className="ga-right">
          {/* Header */}
          <div className="ga-right-header">
            <div className="ga-status-badge">
              <div className="ga-status-badge-dot" />
              <span className="ga-status-badge-text">Sẵn sàng</span>
            </div>
            <div className="ga-right-title">
              Đăng nhập <span>Admin</span>
            </div>
            <div className="ga-right-sub">Đăng nhập để quản lý hệ thống rạp phim</div>
          </div>

          {/* Form */}
          <form className="ga-form" onSubmit={handleLogin}>
            <Field 
              label="Email / Tên đăng nhập" 
              delay={0.25}
              icon={<Mail size={14} />}
              error={emailError}
              errorMsg="Vui lòng nhập email đăng nhập"
            >
              <input 
                className={`ga-input ${emailError ? 'error' : ''}`}
                type="text" 
                placeholder="admin@gauphim.com"
                value={email} 
                onChange={e => { setEmail(e.target.value); setEmailError(false); }} 
                autoComplete="email"
              />
            </Field>

            <Field 
              label="Mật khẩu" 
              delay={0.32}
              icon={<Lock size={14} />}
              error={pwdError}
              errorMsg="Vui lòng nhập mật khẩu"
            >
              <input 
                className={`ga-input ${pwdError ? 'error' : ''}`}
                type={showPwd ? "text" : "password"} 
                placeholder="Nhập mật khẩu"
                value={password} 
                onChange={e => { setPassword(e.target.value); setPwdError(false); }} 
                autoComplete="current-password"
              />
              <button 
                className="ga-eye-btn" 
                type="button" 
                onClick={() => setShowPwd(v => !v)}
                aria-label={showPwd ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </Field>

            <div className="ga-actions">
              <label className="ga-remember">
                <div className={`ga-checkbox ${remember ? 'checked' : ''}`} onClick={() => setRemember(v => !v)} />
                <span className="ga-remember-text">Ghi nhớ đăng nhập</span>
              </label>
              <button className="ga-forgot" type="button">Quên mật khẩu?</button>
            </div>

            <button className="ga-btn-primary" type="submit" disabled={loading}>
              <div className="ga-btn-primary-shimmer" />
              {loading ? (
                <>
                  <div className="ga-spinner" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  Đăng nhập
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            {/* ── Google Login Button ── */}
            <button 
              className="ga-btn-google" 
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
            >
              {googleLoading ? (
                <>
                  <div className="ga-spinner" />
                  Đang kết nối Google...
                </>
              ) : (
                <>
                  <GoogleIcon />
                  Đăng nhập với Google
                </>
              )}
            </button>

            {/* ── Google Error Message ── */}
            {googleError && (
              <div className="ga-error-msg" style={{ justifyContent: 'center', color: '#ef4444' }}>
                <XCircle size={16} />
                {googleError}
              </div>
            )}

            <div className="ga-divider">
              <div className="ga-divider-line" />
              <span className="ga-divider-text">Hoặc</span>
              <div className="ga-divider-line" />
            </div>

            <div className="ga-alt-btns">
              <button className="ga-btn-alt" type="button">
                <Shield size={16} />
                SSO Công ty
              </button>
              <button className="ga-btn-alt" type="button">
                <Users size={16} />
                Liên hệ IT
              </button>
            </div>

            <div className="ga-security">
              <div className="ga-security-icon">
                <Shield size={18} />
              </div>
              <p className="ga-security-text">
                <strong>Bảo mật 256-bit SSL</strong> — Dữ liệu được mã hóa và bảo vệ an toàn.
                Mọi hoạt động đều được ghi <span className="highlight">nhật ký</span>.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;