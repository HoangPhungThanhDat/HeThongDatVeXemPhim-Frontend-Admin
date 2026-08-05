// src/views/admin/quanlydonhang/components/shared/useFieldStyles.js

import { OR } from "../../constants";

export const useFieldStyles = (isDark) => ({
  bg: isDark ? "#1B254B" : "#fafafa",
  border: isDark ? "1.5px solid #2D3A6B" : "1.5px solid #e8edf3",
  borderRadius: "10px",
  color: isDark ? "#e2e8f0" : "#0b1437",
  fontSize: "14px",
  fontWeight: "500",
  px: "14px",
  h: "44px",
  _placeholder: { color: isDark ? "#718096" : "#b0bac8", fontWeight: "400" },
  _focus: { border: `1.5px solid ${OR}`, boxShadow: `0 0 0 3px rgba(234,88,12,.1)`, bg: isDark ? "#1B254B" : "#fff" },
  _hover: { border: `1.5px solid ${OR}`, bg: isDark ? "#1B254B" : "#fff" },
  transition: "all .2s",
});