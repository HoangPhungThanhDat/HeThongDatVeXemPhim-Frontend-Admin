// src/views/admin/quanlysuatchieu/components/FormField.jsx

import React from "react";
import { Box, FormControl, FormLabel, Icon } from "@chakra-ui/react";
import { fadeUp } from "./shared/animations";

export const FormField = ({ icon, label, children, delay = 0, isDark }) => {
  return (
    <Box sx={{ animation: `${fadeUp} 0.4s ease ${delay}s both` }}>
      <FormLabel
        fontSize="10.5px"
        fontWeight="800"
        letterSpacing="0.9px"
        textTransform="uppercase"
        color={isDark ? "#a0aec0" : "#64748b"}
        mb="7px"
        display="flex"
        alignItems="center"
        gap="6px"
      >
        {icon && <Icon as={icon} boxSize="10px" color="#f97316" />}
        {label}
      </FormLabel>
      <FormControl>{children}</FormControl>
    </Box>
  );
};

export const inputStyle = (isDark) => ({
  bg: isDark ? "#2d3748" : "#fafafa",
  border: isDark ? "1.5px solid #4a5568" : "1.5px solid #e8edf3",
  borderRadius: "10px",
  color: isDark ? "#e2e8f0" : "#1a202c",
  fontSize: "14px",
  fontWeight: "500",
  px: "14px",
  h: "44px",
  _placeholder: { color: isDark ? "#718096" : "#b0bac8", fontWeight: "400" },
  _focus: {
    border: "1.5px solid #f97316",
    boxShadow: "0 0 0 3px rgba(249,115,22,0.10)",
    bg: isDark ? "#2d3748" : "#ffffff"
  },
  _hover: {
    border: "1.5px solid #f97316",
    bg: isDark ? "#2d3748" : "#ffffff"
  },
  transition: "all 0.2s ease",
});