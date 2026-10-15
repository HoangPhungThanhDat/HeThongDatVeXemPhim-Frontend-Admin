// src/views/admin/quanlydatve/components/shared/animations.js

import { keyframes } from "@chakra-ui/react";

export const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

export const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.97) translateY(8px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
`;

export const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.45; }
`;

export const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

export const slideIn = keyframes`
  from { opacity: 0; transform: translateX(20px); }
  to   { opacity: 1; transform: translateX(0); }
`;

export const ping = keyframes`
  75%, 100% { transform: scale(1.8); opacity: 0; }
`;

export const glow = keyframes`
  0%, 100% { box-shadow: 0 0 12px rgba(249,115,22,0.4); }
  50% { box-shadow: 0 0 24px rgba(249,115,22,0.7); }
`;

export const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;