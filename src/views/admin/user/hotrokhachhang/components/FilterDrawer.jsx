// components/FilterDrawer.jsx
import React from "react";
import {
  Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton,
  DrawerBody, Box, Flex, Text, Button, useColorMode
} from "@chakra-ui/react";
import { DARK } from "../constants";

const ORANGE = "#ea580c";
const ORANGE_LIGHT = "#fb923c";
const ORANGE_SHADOW = "rgba(234,88,12,0.25)";

export default function FilterDrawer({
  isOpen,
  onClose,
  filterStatus,
  setFilterStatus,
  // Xóa filterCategory và setFilterCategory
}) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const colors = DARK[isDark ? "dark" : "light"];

  const statuses = ["Tất cả", "Chưa xử lý", "Đang xử lý", "Đã xử lý"];

  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="bottom">
      <DrawerOverlay bg="rgba(15,23,42,0.5)" backdropFilter="blur(4px)" />
      <DrawerContent
        borderTopRadius="20px"
        pb="env(safe-area-inset-bottom, 16px)"
        bg={colors.bgCard}
      >
        <Box h="4px" bg={`linear-gradient(90deg, ${ORANGE}, ${ORANGE_LIGHT})`} />
        <Flex justify="center" pt="10px" pb="4px">
          <Box w="40px" h="4px" borderRadius="full" bg={isDark ? "#334155" : "#e2e8f0"} />
        </Flex>
        <DrawerCloseButton
          color={colors.textMuted}
          top="18px"
          right="16px"
          size="sm"
          borderRadius="10px"
          _hover={{ color: colors.textPrimary, bg: isDark ? "#2d3748" : "#f1f5f9" }}
        />
        <DrawerBody pt="8px" pb="24px">
          <Text fontSize="15px" fontWeight="800" color={colors.textPrimary} mb="18px">
            Bộ lọc
          </Text>

          <Text
            fontSize="10px"
            fontWeight="800"
            color={colors.textMuted}
            letterSpacing="1px"
            textTransform="uppercase"
            mb="8px"
          >
            Trạng thái
          </Text>
          <Flex gap="8px" flexWrap="wrap" mb="18px">
            {statuses.map(s => (
              <Button
                key={s}
                h="32px"
                px="12px"
                borderRadius="8px"
                fontSize="12px"
                fontWeight="600"
                bg={filterStatus === s ? `linear-gradient(135deg, ${ORANGE}, ${ORANGE_LIGHT})` : (isDark ? "#2d3748" : "#f8fafc")}
                color={filterStatus === s ? "white" : (isDark ? "#94a3b8" : "#64748b")}
                border={filterStatus === s ? "none" : `1px solid ${isDark ? "#374151" : "#e2e8f0"}`}
                boxShadow={filterStatus === s ? `0 2px 8px ${ORANGE_SHADOW}` : "none"}
                onClick={() => setFilterStatus(s)}
              >
                {s}
              </Button>
            ))}
          </Flex>

          <Button
            w="100%"
            h="44px"
            borderRadius="10px"
            fontWeight="700"
            fontSize="13px"
            bg={`linear-gradient(135deg, ${ORANGE}, ${ORANGE_LIGHT})`}
            color="white"
            boxShadow={`0 4px 14px ${ORANGE_SHADOW}`}
            onClick={onClose}
          >
            Áp dụng bộ lọc
          </Button>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}