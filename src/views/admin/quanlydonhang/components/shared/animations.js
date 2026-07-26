// components/shared/animations.js
export const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Sora',system-ui,sans-serif;}
  @keyframes slideup{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadein{from{opacity:0}to{opacity:1}}
  @keyframes scalein{from{opacity:0;transform:scale(.96) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}
  @keyframes slidein{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  @keyframes slidefromright{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
  @keyframes op-pulse{0%,100%{opacity:1}50%{opacity:.3}}
  @keyframes toast-in{from{opacity:0;transform:translateX(-50%) translateY(12px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
  @keyframes realtime-ring{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}}
  ::-webkit-scrollbar{width:5px;height:5px}
  ::-webkit-scrollbar-track{background:#f1f5f9}
  ::-webkit-scrollbar-thumb{background:#d4d4d8;border-radius:99px}
  input,select,textarea{font-family:'Sora',system-ui,sans-serif;}
  select{appearance:auto}
  @media(max-width:767px){
    .stats-grid{grid-template-columns:1fr 1fr!important;}
    .tabs-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch;}
    .desktop-only{display:none!important;}
  }
`;