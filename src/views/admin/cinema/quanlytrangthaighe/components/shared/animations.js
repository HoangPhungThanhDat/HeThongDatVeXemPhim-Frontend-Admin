// src/views/admin/quanlytrangthaighe/components/shared/animations.js

import { keyframes } from "@chakra-ui/react";

export const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

export const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
`;

export const pulseDot = keyframes`
  0%   { box-shadow: 0 0 0 0 rgba(16,185,129,.5); }
  70%  { box-shadow: 0 0 0 8px rgba(16,185,129,0); }
  100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); }
`;

export const pulseWarn = keyframes`
  0%,100% { opacity: 1; transform: scale(1); }
  50%     { opacity: .5; transform: scale(0.95); }
`;