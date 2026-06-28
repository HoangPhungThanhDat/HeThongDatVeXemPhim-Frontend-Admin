// src/views/admin/quanlysuatchieu/components/shared/animations.js

import { keyframes } from "@chakra-ui/react";

export const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.94) translateY(14px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
`;

export const slideLeft = keyframes`
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
`;

export const slideRight = keyframes`
  from { opacity: 0; transform: translateX(-12px); }
  to { opacity: 1; transform: translateX(0); }
`;

export const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
`;

export const shimmer = keyframes`
  0% { background-position: -400% 0; }
  100% { background-position: 400% 0; }
`;

export const glow = keyframes`
  0%, 100% { box-shadow: 0 0 12px rgba(249, 115, 22, 0.4); }
  50% { box-shadow: 0 0 24px rgba(249, 115, 22, 0.7); }
`;