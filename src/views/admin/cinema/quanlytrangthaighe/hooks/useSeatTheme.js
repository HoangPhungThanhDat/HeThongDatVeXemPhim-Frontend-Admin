// src/views/admin/quanlytrangthaighe/hooks/useSeatTheme.js

import { useColorMode, useColorModeValue } from "@chakra-ui/react";

export function useSeatTheme() {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";
  
  return {
    isDark,
    toggleColorMode,
    bg: useColorModeValue("#f8fafc", "#0a0a18"),
    bgCard: useColorModeValue("white", "#141428"),
    bgSub: useColorModeValue("#fafbfc", "#1a1a30"),
    bgMuted: useColorModeValue("#f8fafc", "#1e1e35"),
    bgHover: useColorModeValue("#fff7ed", "rgba(234,88,12,0.1)"),
    border: useColorModeValue("#f1f5f9", "rgba(255,255,255,0.08)"),
    borderStrong: useColorModeValue("#e8edf3", "rgba(255,255,255,0.12)"),
    text: useColorModeValue("#0f172a", "#f7fafc"),
    textSub: useColorModeValue("#334155", "#e2e8f0"),
    textMuted: useColorModeValue("#94a3b8", "#718096"),
    inputBg: useColorModeValue("#fafafa", "#1a1a30"),
    shadow: useColorModeValue("0 1px 4px rgba(0,0,0,0.05)", "0 1px 4px rgba(0,0,0,0.3)"),
    shadowHover: useColorModeValue("0 4px 20px rgba(0,0,0,0.08)", "0 4px 20px rgba(0,0,0,0.4)"),
  };
}