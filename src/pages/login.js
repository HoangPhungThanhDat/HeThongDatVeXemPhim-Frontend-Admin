import React, { useState } from "react";
import { Film, Mail, Lock, Eye, EyeOff, Sparkles, Shield, Zap, ChevronRight } from "lucide-react";
import AuthApi from "../api/AuthApi";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await AuthApi.Login({
        Email: email,
        Password: password,
      });
      console.log("Login response:", response.data);

      const { token, user } = response.data;
      const decodedToken = jwtDecode(token);
      console.log("Decoded Token:", decodedToken);

      const roleName = decodedToken.role || decodedToken.RoleName;
      console.log("RoleName:", roleName);

      const fullName = decodedToken.FullName || decodedToken.fullname;

      if (roleName !== "Admin") {
        alert("Bạn không có quyền đăng nhập vào hệ thống!");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", roleName);
      localStorage.setItem("fullname", user.FullName);
      localStorage.setItem("UserId", user.UserId);
      window.location.href = "http://localhost:3000/";
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      if (error.response && error.response.status === 401) {
        alert("Sai tên đăng nhập hoặc mật khẩu!");
      } else {
        alert("Đăng nhập thất bại. Vui lòng thử lại!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a0a 50%, #0a0a0a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Effects */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-10%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(220, 38, 38, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        animation: 'float 8s ease-in-out infinite'
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '-10%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(251, 146, 60, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        animation: 'floatReverse 8s ease-in-out infinite'
      }}></div>

      <div style={{
        width: '100%',
        maxWidth: '1400px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
        gap: 'clamp(30px, 5vw, 60px)',
        alignItems: 'center',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Left Section */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(20px, 3vw, 32px)',
          padding: '0 20px'
        }}>
          {/* Logo */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            padding: 'clamp(12px, 2vw, 16px) clamp(16px, 3vw, 24px)',
            background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(251, 146, 60, 0.1) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(220, 38, 38, 0.2)',
            maxWidth: 'fit-content'
          }}>
            <div style={{
              width: 'clamp(40px, 6vw, 56px)',
              height: 'clamp(40px, 6vw, 56px)',
              background: 'linear-gradient(135deg, #dc2626 0%, #fb923c 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 40px rgba(220, 38, 38, 0.3)'
            }}>
              <Film size={window.innerWidth < 768 ? 24 : 32} color="white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 style={{
                fontSize: 'clamp(20px, 3.5vw, 32px)',
                fontWeight: 900,
                color: 'white',
                margin: 0,
                letterSpacing: '-0.5px'
              }}>
                Gấu<span style={{ color: '#dc2626' }}>Phim</span>
              </h1>
              <p style={{
                fontSize: 'clamp(10px, 1.5vw, 12px)',
                color: '#9ca3af',
                margin: 0,
                fontWeight: 600,
                letterSpacing: '2px'
              }}>ADMIN DASHBOARD</p>
            </div>
          </div>

          {/* Hero Text */}
          <div>
            <h2 style={{
              fontSize: 'clamp(24px, 4vw, 48px)',
              fontWeight: 900,
              color: 'white',
              margin: '0 0 12px 0',
              lineHeight: 1.2,
              letterSpacing: '-1px'
            }}>
              Quản Lý<br />
              <span style={{
                background: 'linear-gradient(90deg, #dc2626 0%, #fb923c 50%, #dc2626 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'gradient 3s linear infinite'
              }}>
                Rạp Chiếu Phim
              </span><br />
              Chuyên Nghiệp
            </h2>
            <p style={{
              fontSize: 'clamp(14px, 2vw, 18px)',
              color: '#9ca3af',
              lineHeight: 1.6,
              margin: 0
            }}>
              Nền tảng quản trị toàn diện cho hệ thống đặt vé xem phim hiện đại
            </p>
          </div>

          {/* Features - Hidden on mobile */}
          <div style={{ 
            display: window.innerWidth < 768 ? 'none' : 'flex', 
            flexDirection: 'column', 
            gap: '12px' 
          }}>
            {[
              { icon: Sparkles, title: 'Quản Lý Thông Minh', desc: 'AI-powered analytics', color: '#dc2626' },
              { icon: Shield, title: 'Bảo Mật Tối Đa', desc: 'Enterprise security', color: '#fb923c' },
              { icon: Zap, title: 'Hiệu Suất Cao', desc: 'Lightning-fast', color: '#dc2626' }
            ].map((item, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: 'clamp(12px, 2vw, 16px)',
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(8px)';
                e.currentTarget.style.borderColor = 'rgba(220, 38, 38, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              }}>
                <div style={{
                  width: 'clamp(36px, 5vw, 44px)',
                  height: 'clamp(36px, 5vw, 44px)',
                  background: `linear-gradient(135deg, ${item.color}dd, ${item.color}bb)`,
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: `0 8px 24px ${item.color}33`
                }}>
                  <item.icon size={20} color="white" />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: 'clamp(13px, 1.8vw, 15px)',
                    fontWeight: 700,
                    color: 'white',
                    margin: '0 0 2px 0'
                  }}>{item.title}</h3>
                  <p style={{
                    fontSize: 'clamp(11px, 1.5vw, 13px)',
                    color: '#9ca3af',
                    margin: 0
                  }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats - Hidden on small laptops */}
          <div style={{
            display: window.innerWidth < 1024 ? 'none' : 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px'
          }}>
            {[
              { value: '99.9%', label: 'Uptime' },
              { value: '24/7', label: 'Support' },
              { value: '1M+', label: 'Tickets' }
            ].map((stat, idx) => (
              <div key={idx} style={{
                padding: 'clamp(12px, 2vw, 16px)',
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: 'clamp(20px, 3vw, 24px)',
                  fontWeight: 900,
                  color: 'white',
                  marginBottom: '4px'
                }}>{stat.value}</div>
                <div style={{
                  fontSize: '10px',
                  color: '#9ca3af',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontWeight: 600
                }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div style={{
          width: '100%',
          maxWidth: '480px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <div style={{ position: 'relative' }}>
            {/* Glow */}
            <div style={{
              position: 'absolute',
              inset: '-4px',
              background: 'linear-gradient(135deg, #dc2626, #fb923c)',
              borderRadius: '24px',
              filter: 'blur(24px)',
              opacity: 0.3
            }}></div>

            {/* Card */}
            <div style={{
              position: 'relative',
              background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%)',
              backdropFilter: 'blur(40px)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: 'clamp(24px, 5vw, 40px)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
            }}>
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: 'clamp(24px, 4vw, 32px)' }}>
                <div style={{
                  width: 'clamp(48px, 8vw, 64px)',
                  height: 'clamp(48px, 8vw, 64px)',
                  background: 'linear-gradient(135deg, #dc2626, #fb923c)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  boxShadow: '0 12px 40px rgba(220, 38, 38, 0.4)'
                }}>
                  <Lock size={window.innerWidth < 768 ? 24 : 32} color="white" strokeWidth={2.5} />
                </div>
                <h2 style={{
                  fontSize: 'clamp(24px, 4vw, 32px)',
                  fontWeight: 900,
                  color: 'white',
                  margin: '0 0 8px 0'
                }}>Đăng Nhập</h2>
                <p style={{
                  fontSize: 'clamp(12px, 2vw, 14px)',
                  color: '#9ca3af',
                  margin: 0
                }}>Chào mừng bạn trở lại hệ thống</p>
              </div>

              {/* Form */}
              <div>
                {/* Email */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: 'clamp(11px, 1.5vw, 12px)',
                    fontWeight: 700,
                    color: '#d1d5db',
                    marginBottom: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>Email / Username</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} color="#6b7280" style={{
                      position: 'absolute',
                      left: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none'
                    }} />
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@gauphim.com"
                      required
                      style={{
                        width: '100%',
                        padding: 'clamp(12px, 2vw, 14px) clamp(12px, 2vw, 14px) clamp(12px, 2vw, 14px) clamp(40px, 6vw, 44px)',
                        background: 'rgba(0, 0, 0, 0.4)',
                        border: '2px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        color: 'white',
                        fontSize: 'clamp(13px, 2vw, 15px)',
                        outline: 'none',
                        transition: 'all 0.3s ease',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#dc2626';
                        e.target.style.background = 'rgba(0, 0, 0, 0.6)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        e.target.style.background = 'rgba(0, 0, 0, 0.4)';
                      }}
                    />
                  </div>
                </div>

                {/* Password */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: 'clamp(11px, 1.5vw, 12px)',
                    fontWeight: 700,
                    color: '#d1d5db',
                    marginBottom: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} color="#6b7280" style={{
                      position: 'absolute',
                      left: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none'
                    }} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      style={{
                        width: '100%',
                        padding: 'clamp(12px, 2vw, 14px) clamp(40px, 6vw, 44px)',
                        background: 'rgba(0, 0, 0, 0.4)',
                        border: '2px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        color: 'white',
                        fontSize: 'clamp(13px, 2vw, 15px)',
                        outline: 'none',
                        transition: 'all 0.3s ease',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#dc2626';
                        e.target.style.background = 'rgba(0, 0, 0, 0.6)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        e.target.style.background = 'rgba(0, 0, 0, 0.4)';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#6b7280',
                        padding: 0
                      }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Remember & Forgot */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '24px',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontSize: 'clamp(12px, 1.8vw, 14px)',
                    color: '#9ca3af'
                  }}>
                    <input type="checkbox" style={{ marginRight: '8px' }} />
                    Ghi nhớ
                  </label>
                  <button
                    type="button"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#dc2626',
                      fontSize: 'clamp(12px, 1.8vw, 14px)',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Quên mật khẩu?
                  </button>
                </div>

                {/* Login Button */}
                <button
                  type="button"
                  onClick={handleLogin}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: 'clamp(14px, 2.5vw, 16px)',
                    background: 'linear-gradient(135deg, #dc2626, #fb923c)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: 'clamp(14px, 2vw, 16px)',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    opacity: loading ? 0.7 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 12px 40px rgba(220, 38, 38, 0.5)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {loading ? (
                    <>
                      <div style={{
                        width: '18px',
                        height: '18px',
                        border: '3px solid rgba(255,255,255,0.3)',
                        borderTop: '3px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      Đăng Nhập
                      <ChevronRight size={18} />
                    </>
                  )}
                </button>
              </div>

              {/* Footer */}
              <div style={{
                marginTop: 'clamp(20px, 3vw, 28px)',
                paddingTop: 'clamp(16px, 3vw, 20px)',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: 'clamp(11px, 1.5vw, 13px)',
                color: '#6b7280'
              }}>
                <Shield size={14} />
                Kết nối bảo mật AES-256
              </div>
            </div>
          </div>

          {/* Support */}
          <div style={{
            marginTop: '20px',
            textAlign: 'center',
            fontSize: 'clamp(12px, 1.8vw, 14px)',
            color: '#6b7280'
          }}>
            Cần hỗ trợ?{' '}
            <button style={{
              background: 'none',
              border: 'none',
              color: '#dc2626',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 'inherit'
            }}>
              Liên hệ IT →
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, -30px); }
        }
        @keyframes floatReverse {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-30px, 30px); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          body {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;