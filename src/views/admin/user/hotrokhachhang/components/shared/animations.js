
import { keyframes } from "@chakra-ui/react";

export const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.97) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
`;

export const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

export const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

export const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-12px); }
  to { opacity: 1; transform: translateX(0); }
`;