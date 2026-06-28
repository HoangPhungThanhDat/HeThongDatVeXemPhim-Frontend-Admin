// components/shared/animations.js
import { keyframes } from "@chakra-ui/react";

export const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(14px) }
  to { opacity: 1; transform: translateY(0) }
`;

export const fadeIn = keyframes`
  from { opacity: 0 }
  to { opacity: 1 }
`;

export const pulse = keyframes`
  0%, 100% { opacity: 1 }
  50% { opacity: 0.35 }
`;

export const shimmer = keyframes`
  0% { background-position: -200% center }
  100% { background-position: 200% center }
`;

export const popIn = keyframes`
  from { opacity: 0; transform: scale(0.85) }
  to { opacity: 1; transform: scale(1) }
`;

export const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-10px) }
  to { opacity: 1; transform: translateX(0) }
`;