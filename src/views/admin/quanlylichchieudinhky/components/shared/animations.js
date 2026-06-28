// src/views/admin/quanlylichchieudinhky/components/shared/animations.js

export const ANIMATIONS = `
  @keyframes gfadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
  @keyframes gfadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes gscaleIn { from { opacity:0; transform:scale(.96) translateY(12px); } to { opacity:1; transform:scale(1) translateY(0); } }
  @keyframes gpulse { 0%,100%{opacity:1} 50%{opacity:.35} }
  @keyframes gshimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes gtoastIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
`;