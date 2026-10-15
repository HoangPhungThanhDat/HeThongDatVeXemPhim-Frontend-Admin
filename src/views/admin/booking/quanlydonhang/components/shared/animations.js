// src/views/admin/quanlydonhang/components/shared/animations.js

import { keyframes } from "@chakra-ui/react";

export const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

export const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
`;

export const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.97) translateY(10px); }
  to   { opacity: 1; transform: scale(1)    translateY(0);    }
`;

export const popIn = keyframes`
  0%   { transform: scale(0); opacity: 0; }
  60%  { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
`;

export const ring = keyframes`
  0%   { box-shadow: 0 0 0 0 rgba(234,88,12,.35); }
  100% { box-shadow: 0 0 0 10px rgba(234,88,12,0); }
`;