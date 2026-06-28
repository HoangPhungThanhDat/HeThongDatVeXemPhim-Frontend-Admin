import React, { useState, useEffect, useRef } from "react";
import { Film, Eye, EyeOff, ChevronRight } from "lucide-react";
import AuthApi from "api/AuthApi";
import { jwtDecode } from "jwt-decode";

/* ── Global CSS ── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@300;400;600;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap');
:root{--o:#FF5500;--o2:#FF8C00;--o3:#FF3300;}
@keyframes ga-cardIn{from{opacity:0;transform:translateY(36px) scale(.97)}to{opacity:1;transform:none}}
@keyframes ga-fu{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes ga-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes ga-scan{from{top:-2px}to{top:100%}}
@keyframes ga-ripple{0%{transform:scale(.5);opacity:1}100%{transform:scale(1);opacity:0}}
@keyframes ga-pulse{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes ga-shine{0%{left:-80%}35%,100%{left:130%}}
@keyframes ga-secPulse{0%,100%{box-shadow:0 0 0 0 rgba(255,85,0,0)}50%{box-shadow:0 0 0 6px rgba(255,85,0,.04)}}
@keyframes ga-fdot{0%{transform:translateY(0);opacity:0}10%{opacity:.3}90%{opacity:.15}100%{transform:translateY(-110px);opacity:0}}
@keyframes ga-glow{0%,100%{opacity:0}50%{opacity:.4}}
@keyframes ga-spinner{to{transform:rotate(360deg)}}

.ga-noise{position:fixed;inset:0;z-index:2;pointer-events:none;opacity:.04;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)'/%3E%3C/svg%3E");
  background-size:256px;}
.ga-vignette{position:fixed;inset:0;z-index:2;pointer-events:none;
  background:radial-gradient(ellipse at center,transparent 40%,rgba(0,0,0,.72) 100%);}
.ga-hlines{position:fixed;inset:0;z-index:2;pointer-events:none;opacity:.015;
  background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,85,0,1) 3px,rgba(255,85,0,1) 4px);}
.ga-scan{position:fixed;left:0;right:0;height:2px;z-index:3;pointer-events:none;
  background:linear-gradient(transparent,rgba(255,85,0,.5),transparent);
  animation:ga-scan 3.5s linear infinite;}

/* ── ROOT WRAPPER: luôn vừa 1 màn, không cuộn trang ── */
.ga-root{
  position:fixed;inset:0;
  display:flex;align-items:center;justify-content:center;
  padding:clamp(10px,2vh,24px) clamp(10px,2vw,20px);
  overflow:hidden;
  background:#050505;
  font-family:'Syne',sans-serif;
}

/* card */
.ga-card{
  width:100%;max-width:1080px;
  display:grid;grid-template-columns:1.2fr 1fr;
  border-radius:24px;overflow:hidden;position:relative;
  animation:ga-cardIn 1s cubic-bezier(.16,1,.3,1) both;
  /* Chiều cao tự co theo viewport, tối đa 98vh */
  max-height:calc(100svh - clamp(20px,4vh,48px));
}
.ga-card::before{content:'';position:absolute;inset:0;border-radius:24px;padding:1px;
  background:linear-gradient(135deg,rgba(255,85,0,.4),rgba(255,85,0,.05),rgba(255,140,0,.2));
  -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
  -webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;z-index:20;}

/* LEFT */
.ga-left{
  background:linear-gradient(145deg,#0A0A0A,#0D0D0D,#0F0808);
  padding:clamp(20px,3vh,52px) clamp(20px,3vw,48px);
  display:flex;flex-direction:column;
  position:relative;overflow:hidden;
  border-right:1px solid rgba(255,85,0,.08);
  min-height:0; /* allow flex shrink */
}
.ga-left::after{content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(to right,transparent,rgba(255,85,0,.5),transparent);}
.ga-watermark{position:absolute;right:-40px;bottom:-60px;
  font-family:'Bebas Neue',sans-serif;font-size:clamp(100px,16vw,240px);color:transparent;
  -webkit-text-stroke:1px rgba(255,85,0,.05);line-height:1;
  pointer-events:none;user-select:none;letter-spacing:-10px;}
.ga-ring{position:absolute;border-radius:50%;pointer-events:none;border:1px solid rgba(255,85,0,.06);}
.ga-ring1{width:400px;height:400px;right:-120px;top:-120px;animation:ga-spin 60s linear infinite;}
.ga-ring2{width:260px;height:260px;right:-60px;top:-60px;animation:ga-spin 40s linear infinite reverse;border-style:dashed;border-color:rgba(255,85,0,.04);}
.ga-ring3{width:140px;height:140px;right:20px;top:20px;animation:ga-spin 25s linear infinite;border-color:rgba(255,85,0,.08);}
.ga-ring4{width:300px;height:300px;left:-100px;bottom:-100px;animation:ga-spin 50s linear infinite reverse;border-color:rgba(255,85,0,.04);}
.ga-perfs{position:absolute;left:0;top:0;bottom:0;width:22px;
  display:flex;flex-direction:column;justify-content:space-around;
  padding:12px 4px;opacity:.08;pointer-events:none;}
.ga-perf{width:14px;height:10px;border-radius:2px;background:var(--o);flex-shrink:0;}
.ga-gem{width:clamp(36px,4vh,46px);height:clamp(36px,4vh,46px);border-radius:13px;
  background:linear-gradient(135deg,rgba(255,85,0,.22),rgba(255,85,0,.08));
  border:1px solid rgba(255,85,0,.28);
  display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;}
.ga-gem::before{content:'';position:absolute;top:-50%;left:-50%;width:200%;height:200%;
  background:conic-gradient(transparent,rgba(255,85,0,.14),transparent 30%);
  animation:ga-spin 4s linear infinite;}
.ga-gem svg{position:relative;z-index:1;}
.ga-h1-outline{display:block;color:transparent;-webkit-text-stroke:1.5px var(--o);
  letter-spacing:5px;font-size:clamp(36px,5.5vw,68px);position:relative;}
.ga-h1-outline::after{content:attr(data-text);position:absolute;left:0;top:0;
  color:transparent;-webkit-text-stroke:0;
  background:linear-gradient(90deg,var(--o),var(--o2));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  opacity:0;animation:ga-glow 3s ease-in-out infinite;}
.ga-pill{transition:all .3s;cursor:default;position:relative;overflow:hidden;}
.ga-pill::before{content:'';position:absolute;inset:0;
  background:linear-gradient(135deg,rgba(255,85,0,.08),transparent);opacity:0;transition:opacity .3s;}
.ga-pill:hover{border-color:rgba(255,85,0,.25)!important;color:rgba(255,255,255,.7)!important;}
.ga-pill:hover::before{opacity:1;}

/* LEFT hero text */
.ga-hero-title{
  font-family:'Bebas Neue',sans-serif;
  font-size:clamp(42px,5.5vw,76px);
  line-height:.88;color:#fff;letter-spacing:3px;
}

/* LEFT middle: fill available space, shrink if needed */
.ga-left-mid{
  flex:1;display:flex;flex-direction:column;justify-content:center;
  margin:clamp(12px,2vh,40px) 0;
  position:relative;z-index:2;
  animation:ga-fu .7s .2s both;
  min-height:0;overflow:hidden;
}

/* pills row: hide on very short screens */
.ga-pills-row{
  display:flex;flex-wrap:wrap;gap:7px;margin-top:clamp(10px,1.5vh,22px);
  position:relative;z-index:2;animation:ga-fu .7s .42s both;
}

/* stats */
.ga-stats{
  display:flex;background:rgba(255,255,255,.015);
  border:1px solid rgba(255,255,255,.05);border-radius:14px;overflow:hidden;
  animation:ga-fu .7s .35s both;flex-shrink:0;
}
.ga-stat-cell{
  flex:1;padding:clamp(8px,1.2vh,14px) clamp(10px,1.5vw,18px);
  border-right:1px solid rgba(255,255,255,.04);
}
.ga-stat-num{font-family:'Bebas Neue',sans-serif;font-size:clamp(18px,2.5vh,26px);color:#FF5500;letter-spacing:1;line-height:1;}
.ga-stat-lbl{font-family:'JetBrains Mono',monospace;font-size:clamp(7px,1vh,9px);color:rgba(255,255,255,.2);letter-spacing:1.5px;text-transform:uppercase;margin-top:3px;}

/* description text: hide on very small screens */
.ga-desc{
  font-size:clamp(11px,1.3vh,13.5px);color:rgba(255,255,255,.28);
  line-height:1.75;max-width:310px;margin-top:clamp(8px,1.5vh,20px);font-weight:300;
}

/* footer */
.ga-left-footer{
  padding-top:clamp(10px,1.5vh,20px);
  border-top:1px solid rgba(255,255,255,.04);
  margin-top:clamp(10px,1.5vh,22px);
  position:relative;z-index:2;animation:ga-fu .7s .5s both;flex-shrink:0;
}

/* RIGHT */
.ga-right{
  background:#070707;
  padding:clamp(20px,3vh,48px) clamp(20px,3vw,44px);
  display:flex;flex-direction:column;justify-content:center;
  position:relative;overflow:hidden;min-height:0;
}
.ga-corner-tl{position:absolute;top:0;right:0;width:56px;height:56px;
  border-top:1px solid rgba(255,85,0,.3);border-right:1px solid rgba(255,85,0,.3);
  border-radius:0 0 0 20px;pointer-events:none;}
.ga-corner-br{position:absolute;bottom:0;left:0;width:56px;height:56px;
  border-bottom:1px solid rgba(255,85,0,.15);border-left:1px solid rgba(255,85,0,.15);
  border-radius:0 20px 0 0;pointer-events:none;}
.ga-fdot{position:absolute;border-radius:50%;background:var(--o);animation:ga-fdot linear infinite;opacity:0;}
.ga-live-core{position:absolute;inset:0;border-radius:50%;background:var(--o);animation:ga-pulse 2s ease-in-out infinite;}
.ga-live-ring{position:absolute;inset:-4px;border-radius:50%;border:1.5px solid rgba(255,85,0,.5);animation:ga-ripple 2s ease-out infinite;}
.ga-live-ring2{position:absolute;inset:-8px;border-radius:50%;border:1px solid rgba(255,85,0,.2);animation:ga-ripple 2s ease-out infinite .4s;}

/* inputs */
.ga-inp,.ga-sel{width:100%;height:clamp(40px,5vh,48px);
  background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.06);
  border-radius:12px;color:#fff;font-size:clamp(12px,1.4vh,13.5px);font-family:'Syne',sans-serif;
  padding:0 48px 0 16px;outline:none;transition:all .25s;
  -webkit-appearance:none;appearance:none;}
.ga-inp::placeholder{color:rgba(255,255,255,.13);font-size:13px;}
.ga-inp:focus{border-color:rgba(255,85,0,.38);background:rgba(255,85,0,.025);
  box-shadow:0 0 0 4px rgba(255,85,0,.06),inset 0 1px 0 rgba(255,255,255,.04);}
.ga-inp-line{height:1px;margin-top:-1px;border-radius:0 0 12px 12px;
  background:linear-gradient(to right,transparent,var(--o),transparent);
  transform:scaleX(0);transform-origin:center;transition:transform .3s;opacity:.6;}
.ga-ibox:focus-within .ga-inp-line{transform:scaleX(1);}
.ga-eye{position:absolute;right:13px;top:50%;transform:translateY(-50%);
  background:none;border:none;cursor:pointer;color:rgba(255,85,0,.4);padding:4px;display:flex;transition:color .2s;}
.ga-eye:hover{color:var(--o);}

/* checkbox */
.ga-chk{width:16px;height:16px;border-radius:4px;border:1px solid rgba(255,255,255,.1);
  background:rgba(255,255,255,.02);display:flex;align-items:center;justify-content:center;
  transition:all .2s;flex-shrink:0;position:relative;overflow:hidden;cursor:pointer;}
.ga-chk.on::before{content:'';position:absolute;inset:0;
  background:linear-gradient(135deg,var(--o),var(--o3));border-radius:3px;}
.ga-chk.on::after{content:'';width:8px;height:5px;border-left:1.5px solid #fff;
  border-bottom:1.5px solid #fff;transform:rotate(-45deg) translateY(-1px);
  display:block;position:relative;z-index:1;}

/* main btn */
.ga-btn{width:100%;height:clamp(42px,5.5vh,52px);
  background:linear-gradient(135deg,#FF5500,#FF3300,#FF8C00);background-size:200% 100%;
  color:#fff;font-size:clamp(11px,1.3vh,13px);font-weight:700;font-family:'Syne',sans-serif;
  letter-spacing:1.5px;text-transform:uppercase;border:none;border-radius:13px;cursor:pointer;
  position:relative;overflow:hidden;transition:transform .15s,box-shadow .2s,background-position .4s;flex-shrink:0;}
.ga-btn::before{content:'';position:absolute;inset:0;border-radius:13px;
  background:linear-gradient(to bottom,rgba(255,255,255,.12),transparent 60%);}
.ga-btn:hover:not(:disabled){transform:translateY(-2px);background-position:100% 0;
  box-shadow:0 14px 44px rgba(255,85,0,.42),0 0 28px rgba(255,85,0,.18);}
.ga-btn:active:not(:disabled){transform:translateY(0);}
.ga-btn:disabled{opacity:.6;cursor:not-allowed;}
.ga-shine{position:absolute;top:0;left:-80%;width:60%;height:100%;
  background:linear-gradient(to right,transparent,rgba(255,255,255,.2),transparent);
  transform:skewX(-20deg);animation:ga-shine 3s infinite 1.5s;}

/* alt btns */
.ga-alt{flex:1;height:clamp(36px,4.5vh,44px);background:transparent;
  border:1px solid rgba(255,255,255,.06);border-radius:11px;
  color:rgba(255,255,255,.3);font-size:clamp(10px,1.2vh,12px);font-family:'Syne',sans-serif;
  cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;
  transition:all .25s;letter-spacing:.3px;position:relative;overflow:hidden;}
.ga-alt::before{content:'';position:absolute;inset:0;
  background:linear-gradient(135deg,rgba(255,85,0,.06),transparent);opacity:0;transition:opacity .3s;}
.ga-alt:hover{border-color:rgba(255,85,0,.2);color:rgba(255,255,255,.6);}
.ga-alt:hover::before{opacity:1;}

/* sec */
.ga-sec-icon{width:32px;height:32px;background:rgba(255,85,0,.05);
  border:1px solid rgba(255,85,0,.1);border-radius:9px;
  display:flex;align-items:center;justify-content:center;flex-shrink:0;
  animation:ga-secPulse 3s ease-in-out infinite;}
.ga-fgt{background:none;border:none;font-family:'Syne',sans-serif;
  font-size:12.5px;font-weight:600;color:rgba(255,85,0,.65);
  cursor:pointer;padding:0;transition:all .2s;}
.ga-fgt:hover{color:var(--o);text-shadow:0 0 12px rgba(255,85,0,.4);}
.ga-spinner{width:17px;height:17px;border:3px solid rgba(255,255,255,.3);
  border-top:3px solid #fff;border-radius:50%;animation:ga-spinner 1s linear infinite;}

/* Field margin responsive */
.ga-field-mb{margin-bottom:clamp(8px,1.5vh,14px);}
.ga-field-label{display:flex;align-items:center;gap:7px;margin-bottom:clamp(4px,0.8vh,8px);}
.ga-remember-row{display:flex;align-items:center;justify-content:space-between;margin:clamp(2px,0.5vh,4px) 0 clamp(8px,1.5vh,18px);}

/* Security row: hide on very short */
.ga-sec-row{display:flex;align-items:center;gap:10px;margin-top:clamp(8px,1.5vh,18px);padding-top:clamp(8px,1.5vh,18px);border-top:1px solid rgba(255,255,255,.03);}

/* OR divider */
.ga-or-row{display:flex;align-items:center;gap:12px;margin:clamp(8px,1.5vh,16px) 0;}

/* right header */
.ga-right-header{margin-bottom:clamp(10px,2vh,28px);}
.ga-right-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(28px,4.5vh,42px);letter-spacing:2px;color:#fff;line-height:1;margin-bottom:6px;}

/* Hide elements on short screens to avoid overflow */
@media(max-height:600px){
  .ga-pills-row{display:none!important;}
  .ga-left-footer{display:none!important;}
  .ga-sec-row{display:none!important;}
  .ga-or-row{margin:4px 0!important;}
  .ga-desc{display:none!important;}
}
@media(max-height:700px){
  .ga-pills-row{display:none!important;}
}

@media(max-width:740px){
  .ga-left{display:none!important;}
  .ga-card{grid-template-columns:1fr!important;}
  .ga-right{padding:clamp(20px,4vw,36px) clamp(16px,5vw,24px)!important;}
}
`;

/* ── Canvas: Particle BG ── */
function ParticleBg() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current, cx = cv.getContext("2d");
    let W, H, id;
    const resize = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; };
    resize(); addEventListener("resize", resize);
    class P {
      reset() {
        this.x = Math.random()*W; this.y = Math.random()*H;
        this.r = Math.random()*1.4+.2;
        this.vx = (Math.random()-.5)*.25; this.vy = -Math.random()*.5-.08;
        this.a = Math.random()*.32+.04;
        this.life = Math.random()*200+80; this.age = 0;
        this.hue = 10+Math.random()*25; this.sat = 70+Math.random()*30;
      }
      constructor() { this.reset(); this.age = Math.random()*this.life; }
    }
    const pts = Array.from({length:130}, () => new P());
    const draw = () => {
      cx.fillStyle="#050505"; cx.fillRect(0,0,W,H);
      [[W*.12,H*.18,W*.42,"rgba(255,70,0,.06)"],[W*.88,H*.82,W*.3,"rgba(255,120,0,.04)"],[W*.5,H*.5,W*.25,"rgba(255,50,0,.025)"]].forEach(([x,y,r,c]) => {
        const g = cx.createRadialGradient(x,y,0,x,y,r);
        g.addColorStop(0,c); g.addColorStop(1,"transparent");
        cx.fillStyle=g; cx.fillRect(0,0,W,H);
      });
      pts.forEach(p => {
        p.age++; if(p.age>p.life) p.reset();
        const f = p.age<20?p.age/20:p.age>p.life-20?(p.life-p.age)/20:1;
        cx.beginPath(); cx.arc(p.x+p.vx*p.age,p.y+p.vy*p.age,p.r,0,Math.PI*2);
        cx.fillStyle=`hsla(${p.hue},${p.sat}%,62%,${p.a*f})`; cx.fill();
      });
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{position:"fixed",inset:0,zIndex:0}} />;
}

/* ── Canvas: Film strip sides ── */
function FilmStripBg() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current, cx = cv.getContext("2d");
    let W, H, offset=0, id;
    const resize = () => { W=cv.width=innerWidth; H=cv.height=innerHeight; };
    resize(); addEventListener("resize", resize);
    const drawStrip = (x) => {
      const sw=34,sh=26,gap=8,ph=8,pw=8,pr=2,fH=sh+gap;
      cx.fillStyle="rgba(255,85,0,.03)"; cx.fillRect(x,0,sw,H);
      for(let i=0; i*fH-offset<H+fH; i++){
        const y=i*fH-(offset%fH);
        cx.fillStyle="rgba(255,85,0,.06)";
        cx.beginPath(); cx.roundRect(x+3,y,pw,ph,pr); cx.fill();
        cx.beginPath(); cx.roundRect(x+sw-pw-3,y,pw,ph,pr); cx.fill();
      }
    };
    const frame = () => {
      cx.clearRect(0,0,W,H); offset=(offset+.4)%(34+8);
      drawStrip(0); drawStrip(W-34);
      id = requestAnimationFrame(frame);
    };
    frame();
    return () => { cancelAnimationFrame(id); removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{position:"fixed",inset:0,zIndex:1}} />;
}

/* ── Live clock ── */
function LiveClock() {
  const [t, setT] = useState("— 00:00:00 · HCMC");
  useEffect(() => {
    const tick = () => {
      const n=new Date(), p=v=>String(v).padStart(2,"0");
      setT(`— ${p(n.getHours())}:${p(n.getMinutes())}:${p(n.getSeconds())} · HCMC`);
    };
    tick(); const id=setInterval(tick,1000); return () => clearInterval(id);
  }, []);
  return <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"rgba(255,85,0,.45)",letterSpacing:2.5,marginTop:clamp(6,14),display:"block"}}>{t}</span>;
}

function clamp(min,max){ return `clamp(${min}px,2vh,${max}px)`; }

/* ── Count-up ── */
function CountUp({ target, suffix="" }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const step=Math.ceil(target/40); let n=0;
    const id=setInterval(()=>{ n=Math.min(n+step,target); setVal(n); if(n>=target) clearInterval(id); },30);
    return () => clearInterval(id);
  }, [target]);
  return <>{val}{suffix}</>;
}

/* ── Field wrapper ── */
function Field({ label, delay, icon, children }) {
  return (
    <div className="ga-field-mb" style={{animation:`ga-fu .6s ${delay}s both`}}>
      <div className="ga-field-label">
        <svg viewBox="0 0 24 24" fill="none" stroke="#FF5500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:12,height:12,flexShrink:0}}>{icon}</svg>
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,fontWeight:500,color:"rgba(255,255,255,.3)",letterSpacing:1.2,textTransform:"uppercase"}}>{label}</span>
      </div>
      <div className="ga-ibox" style={{position:"relative"}}>
        {children}
        <div className="ga-inp-line" />
      </div>
    </div>
  );
}

/* ── MAIN ── */
const Login = () => {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [showPwd, setShowPwd]   = useState(false);
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    if (document.getElementById("ga-css")) return;
    const s = document.createElement("style");
    s.id = "ga-css"; s.textContent = GLOBAL_CSS;
    document.head.appendChild(s);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
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
      window.location.href = "http://localhost:3000/";
    } catch (error) {
      if (error.response?.status === 401) alert("Sai tên đăng nhập hoặc mật khẩu!");
      else alert("Đăng nhập thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const PILLS = ["Quản lý phim","Suất chiếu","Đặt vé","Người dùng","Doanh thu","Khuyến mãi"];

  return (
    <div className="ga-root">
      <ParticleBg />
      <FilmStripBg />
      <div className="ga-noise" /><div className="ga-vignette" />
      <div className="ga-hlines" /><div className="ga-scan" />

      <div style={{position:"relative",zIndex:10,width:"100%",maxWidth:1080}}>
        <div className="ga-card">

          {/* ════ LEFT ════ */}
          <div className="ga-left">
            <div className="ga-watermark">GP</div>
            <div className="ga-ring ga-ring1" /><div className="ga-ring ga-ring2" />
            <div className="ga-ring ga-ring3" /><div className="ga-ring ga-ring4" />
            <div className="ga-perfs">{Array.from({length:26}).map((_,i)=><div key={i} className="ga-perf"/>)}</div>

            {/* Logo */}
            <div style={{display:"flex",alignItems:"center",gap:13,position:"relative",zIndex:2,animation:"ga-fu .7s .1s both",flexShrink:0}}>
              <div className="ga-gem">
                <Film size={20} color="#FF5500" style={{position:"relative",zIndex:1}} />
              </div>
              <div>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(18px,2.5vh,24px)",color:"#FF5500",letterSpacing:3}}>GấuPhim</div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"rgba(255,255,255,.2)",letterSpacing:2}}>Admin Dashboard · v2.0</div>
              </div>
            </div>

            {/* Hero */}
            <div className="ga-left-mid">
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
                <div style={{width:28,height:1.5,background:"linear-gradient(to right,#FF5500,transparent)"}} />
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:500,color:"rgba(255,85,0,.7)",letterSpacing:3,textTransform:"uppercase"}}>Hệ thống quản trị</span>
              </div>
              <div className="ga-hero-title">
                QUẢN LÝ
                <span className="ga-h1-outline" data-text="RẠP PHIM">RẠP PHIM</span>
              </div>
              <LiveClock />
              <p className="ga-desc">
                Kiểm soát phim, suất chiếu, vé, ghế và doanh thu — tất cả trong một giao diện duy nhất.
              </p>
            </div>

            {/* Stats */}
            <div className="ga-stats" style={{flexShrink:0}}>
              {[["CountUp-12","Rạp"],["CountUp-480","Suất/ngày"],["24/7","Hoạt động"]].map(([n,l])=>(
                <div key={l} className="ga-stat-cell"
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(255,85,0,.02)"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <div className="ga-stat-num">
                    {n==="CountUp-12"?<CountUp target={12}/>:n==="CountUp-480"?<CountUp target={480} suffix="+"/>:n}
                  </div>
                  <div className="ga-stat-lbl">{l}</div>
                </div>
              ))}
            </div>

            {/* Pills */}
            <div className="ga-pills-row">
              {PILLS.map(p=>(
                <div key={p} className="ga-pill" style={{display:"flex",alignItems:"center",gap:6,padding:"6px 13px",background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.05)",borderRadius:100,fontSize:11,color:"rgba(255,255,255,.35)"}}>
                  <div style={{width:5,height:5,borderRadius:"50%",background:"rgba(255,85,0,.6)",flexShrink:0}}/>
                  {p}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="ga-left-footer">
              <div style={{display:"inline-flex",alignItems:"center",gap:10,padding:"8px 14px",background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.04)",borderRadius:100}}>
                <span style={{fontSize:17}}>🇻🇳</span>
                <div>
                  <div style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,.4)"}}>GấuPhim — Việt Nam</div>
                  <div style={{fontSize:10,color:"rgba(255,255,255,.15)"}}>Hoàng Sa – Trường Sa là của Việt Nam</div>
                </div>
              </div>
            </div>
          </div>

          {/* ════ RIGHT ════ */}
          <div className="ga-right">
            <div className="ga-corner-tl"/><div className="ga-corner-br"/>
            <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(to right,transparent,rgba(255,85,0,.3),transparent)"}}/>

            {/* Floating dots */}
            <div style={{position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden"}}>
              {Array.from({length:18}).map((_,i)=>{
                const s=Math.random()*3+1.5;
                return <div key={i} className="ga-fdot" style={{width:s,height:s,left:`${Math.random()*100}%`,bottom:-s,animationDuration:`${4+Math.random()*6}s`,animationDelay:`${Math.random()*5}s`}}/>;
              })}
            </div>

            {/* Header */}
            <div className="ga-right-header" style={{animation:"ga-fu .6s .2s both"}}>
              <div style={{display:"inline-flex",alignItems:"center",gap:7,padding:"5px 12px 5px 8px",background:"rgba(255,85,0,.07)",border:"1px solid rgba(255,85,0,.15)",borderRadius:100,marginBottom:clamp(8,16)}}>
                <div style={{position:"relative",width:8,height:8,flexShrink:0}}>
                  <div className="ga-live-core"/><div className="ga-live-ring"/><div className="ga-live-ring2"/>
                </div>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:500,color:"#FF7733",letterSpacing:1.5,textTransform:"uppercase"}}>Admin · Hệ thống đang hoạt động</span>
              </div>
              <div className="ga-right-title">ĐĂNG NHẬP</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:"rgba(255,255,255,.22)",fontWeight:300}}>// xác thực tài khoản quản trị viên</div>
            </div>

            {/* Email */}
            <Field label="Email / Username" delay={0.28} icon={<><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></>}>
              <input className="ga-inp" type="text" placeholder="admin@gauphim.com"
                value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email"/>
            </Field>

            {/* Password */}
            <Field label="Mật khẩu" delay={0.34} icon={<><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></>}>
              <input className="ga-inp" type={showPwd?"text":"password"} placeholder="••••••••••"
                value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password"/>
              <button className="ga-eye" type="button" onClick={()=>setShowPwd(v=>!v)}>
                {showPwd?<EyeOff size={15}/>:<Eye size={15}/>}
              </button>
            </Field>

            {/* Remember / Forgot */}
            <div className="ga-remember-row" style={{animation:"ga-fu .6s .44s both"}}>
              <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",userSelect:"none"}}>
                <div className={`ga-chk${remember?" on":""}`} onClick={()=>setRemember(v=>!v)}/>
                <span style={{fontSize:12.5,color:"rgba(255,255,255,.28)"}}>Ghi nhớ đăng nhập</span>
              </label>
              <button className="ga-fgt" type="button">Quên mật khẩu?</button>
            </div>

            {/* Login btn */}
            <button className="ga-btn" type="button" onClick={handleLogin} disabled={loading}
              style={{animation:"ga-fu .6s .47s both"}}>
              <div className="ga-shine"/>
              {loading
                ?<span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:9}}><div className="ga-spinner"/>Đang xử lý...</span>
                :<span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>Đăng Nhập Hệ Thống <ChevronRight size={16}/></span>
              }
            </button>

            {/* Or */}
            <div className="ga-or-row" style={{animation:"ga-fu .6s .52s both"}}>
              <div style={{flex:1,height:1,background:"rgba(255,255,255,.04)"}}/>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"rgba(255,255,255,.12)",letterSpacing:2,textTransform:"uppercase"}}>hoặc</span>
              <div style={{flex:1,height:1,background:"rgba(255,255,255,.04)"}}/>
            </div>

            {/* Alt btns */}
            <div style={{display:"flex",gap:9,animation:"ga-fu .6s .57s both"}}>
              {[
                {label:"SSO Công ty", d:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"},
                {label:"Liên hệ IT",  d:"M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 010 1.11 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"},
              ].map(({label,d})=>(
                <button key={label} className="ga-alt" type="button">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:15,height:15}}><path d={d}/></svg>
                  {label}
                </button>
              ))}
            </div>

            {/* Security */}
            <div className="ga-sec-row" style={{animation:"ga-fu .6s .62s both"}}>
              <div className="ga-sec-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#FF5500" strokeWidth="1.8" style={{width:14,height:14}}>
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>
                </svg>
              </div>
              <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"rgba(255,255,255,.16)",lineHeight:1.6,fontWeight:300}}>
                <b style={{color:"rgba(255,255,255,.28)",fontWeight:400}}>SSL 256-bit · AES · Zero-log.</b>{" "}
                Chỉ dành cho quản trị viên GấuPhim. Mọi hành động được ghi audit log.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;