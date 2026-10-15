import React from "react";
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Button,
  Flex,
  Text,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { MdClose, MdCheckCircle } from "react-icons/md";

const STATUS_CFG = {
  "Tất cả": { color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb", dot: "#9ca3af" },
  "Đã thanh toán": { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", dot: "#10b981" },
  "Đã check-in": { color: "#ea580c", bg: "#fff7ed", border: "#fed7aa", dot: "#fb923c" },
  "Đã hủy": { color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", dot: "#ef4444" },
  "Hết hạn": { color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb", dot: "#9ca3af" },
};

// Màu sắc cho chế độ tối - tông xanh
const DARK_THEME = {
  bg: "#0a1628", // nền xanh đậm
  cardBg: "#0f1f3a", // nền card xanh đậm hơn
  border: "#1a3a5c", // viền xanh dương
  text: "#e8f4f8", // text sáng
  textSecondary: "#88b4d8", // text phụ
  activeBg: "#0d2847", // nền active
  hoverBg: "#142d4f", // nền hover
  buttonBg: "#0a1f35", // nền button
  buttonBorder: "#1a3a5c", // viền button
  dotColor: "#4a9eff", // màu dot
};

export const FilterDrawer = ({ isOpen, onClose, filterStatus, setFilterStatus, isDark }) => {
  const statuses = ["Tất cả", "Đã thanh toán", "Đã check-in", "Đã hủy", "Hết hạn"];
  const ORPL = "#fff7ed";

  return (
    <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
      <DrawerOverlay backdropFilter="blur(4px)" />
      <DrawerContent
        borderRadius="20px 20px 0 0"
        bg={isDark ? DARK_THEME.bg : "white"}
        border={isDark ? `1px solid ${DARK_THEME.border}` : "none"}
        pb="env(safe-area-inset-bottom, 16px)"
      >
        <Box 
          h="4px" 
          bg={`linear-gradient(90deg, #4a9eff, #2d7dd2)`} 
          borderRadius="20px 20px 0 0" 
        />
        <DrawerHeader pt="16px" pb="8px">
          <Flex align="center" justify="space-between">
            <Text 
              fontSize="15px" 
              fontWeight="800" 
              color={isDark ? DARK_THEME.text : "#0f172a"}
            >
              Lọc trạng thái
            </Text>
            <Button
              size="sm"
              variant="ghost"
              borderRadius="8px"
              color={isDark ? DARK_THEME.textSecondary : "#94a3b8"}
              onClick={onClose}
              _hover={{ bg: isDark ? DARK_THEME.hoverBg : "transparent" }}
            >
              <Icon as={MdClose} boxSize="18px" />
            </Button>
          </Flex>
        </DrawerHeader>
        <DrawerBody pb="20px">
          <Flex direction="column" gap="8px">
            {statuses.map((s) => {
              const cfg = STATUS_CFG[s];
              const isActive = filterStatus === s;
              
              // Xác định màu sắc cho từng trạng thái trong chế độ tối
              const getDarkColors = () => {
                if (isActive) {
                  switch(s) {
                    case "Tất cả":
                      return { bg: "#0d2847", color: "#88b4d8", border: "#2d6b9e" };
                    case "Đã thanh toán":
                      return { bg: "#0a2a1a", color: "#4ade80", border: "#22c55e" };
                    case "Đã check-in":
                      return { bg: "#2a1a0a", color: "#fb923c", border: "#f97316" };
                    case "Đã hủy":
                      return { bg: "#2a0a0a", color: "#f87171", border: "#ef4444" };
                    case "Hết hạn":
                      return { bg: "#0d2847", color: "#88b4d8", border: "#2d6b9e" };
                    default:
                      return { bg: DARK_THEME.activeBg, color: DARK_THEME.text, border: DARK_THEME.border };
                  }
                }
                return { 
                  bg: DARK_THEME.buttonBg, 
                  color: DARK_THEME.textSecondary, 
                  border: DARK_THEME.buttonBorder 
                };
              };

              const darkColors = getDarkColors();

              return (
                <Button
                  key={s}
                  h="48px"
                  borderRadius="12px"
                  justifyContent="flex-start"
                  px="16px"
                  fontSize="13.5px"
                  fontWeight="600"
                  bg={isActive 
                    ? (isDark ? darkColors.bg : (cfg ? cfg.bg : ORPL))
                    : (isDark ? DARK_THEME.buttonBg : "#f8fafc")
                  }
                  color={isActive 
                    ? (isDark ? darkColors.color : (cfg ? cfg.color : "#ea580c"))
                    : (isDark ? DARK_THEME.textSecondary : "#374151")
                  }
                  border={`1.5px solid ${isActive 
                    ? (isDark ? darkColors.border : (cfg ? cfg.border : "#fed7aa"))
                    : (isDark ? DARK_THEME.buttonBorder : "#e8edf3")
                  }`}
                  _hover={{ 
                    bg: isActive 
                      ? (isDark ? darkColors.bg : (cfg ? cfg.bg : ORPL))
                      : (isDark ? DARK_THEME.hoverBg : "#f1f5f9")
                  }}
                  onClick={() => {
                    setFilterStatus(s);
                    onClose();
                  }}
                >
                  {cfg && (
                    <Box 
                      w="8px" 
                      h="8px" 
                      borderRadius="full" 
                      bg={isDark ? DARK_THEME.dotColor : cfg.dot} 
                      mr="10px" 
                    />
                  )}
                  {s}
                  {isActive && (
                    <Icon 
                      as={MdCheckCircle} 
                      boxSize="16px" 
                      color={isDark ? darkColors.color : (cfg ? cfg.color : "#ea580c")} 
                      ml="auto" 
                    />
                  )}
                </Button>
              );
            })}
          </Flex>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};