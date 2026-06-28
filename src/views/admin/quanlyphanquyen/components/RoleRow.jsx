

import React from "react";
import { Box, Flex, Text, Button, Icon } from "@chakra-ui/react";
import {
  MdVisibility, MdEdit, MdDelete,
} from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import StatusPill from "./StatusPill";
import { DARK } from "../constants";
import { fadeUp, pulse } from "./shared/animations";

const RoleRow = ({ role, index, onView, onEdit, onDelete, onToggle, isDark }) => {
  const bg = isDark ? DARK.bgCard : "white";
  const ink = isDark ? DARK.ink : "#0f172a";
  const ink2 = isDark ? DARK.ink2 : "#475569";
  const ink3 = isDark ? DARK.ink3 : "#64748b";
  const ink4 = isDark ? DARK.ink4 : "#94a3b8";
  const ink5 = isDark ? DARK.ink5 : "#e2e8f0";
  const ink6 = isDark ? DARK.ink6 : "#f1f5f9";

  const isActive = role.Status === "Active";

  return (
    <Box
      p="12px 18px"
      borderRadius="12px"
      bg={bg}
      border={isActive ? `1.5px solid ${ink6}` : `1.5px solid ${ink6}`}
      transition="all 0.18s"
      opacity={isActive ? 1 : 0.65}
      _hover={{
        border: "1.5px solid #f97316",
        boxShadow: isDark ? "0 2px 12px rgba(0,0,0,.3)" : "0 2px 12px rgba(249,115,22,0.1)",
        bg: isDark ? DARK.ink6 : "#fffbf7"
      }}
      sx={{ animation: `${fadeUp} 0.35s ease ${index * 0.05}s both` }}
    >
      <Flex align="center" gap="12px">
        <Box w="28px" flexShrink="0">
          <Text fontSize="11px" fontWeight="700" color={isDark ? DARK.ink4 : "#cbd5e1"}>
            {String(index + 1).padStart(2, "0")}
          </Text>
        </Box>

        <Box flex="2" minW="0" pr="12px">
          <Text fontSize="13.5px" fontWeight="700" color={ink} noOfLines={1}>
            {role.RoleName}
          </Text>
          <Text fontSize="11px" color={isDark ? DARK.ink3 : "#64748b"} noOfLines={1}>
            {role.Description || "Không có mô tả"}
          </Text>
        </Box>

        <Box flex="0.7" minW="0" pr="12px">
          <StatusPill status={role.Status} isDark={isDark} />
        </Box>

        <Flex gap="6px" flexShrink="0">
          <Button
            size="xs"
            h="30px"
            px="9px"
            borderRadius="8px"
            bg={isDark ? DARK.ink6 : "#f8fafc"}
            color={isDark ? DARK.ink3 : "#64748b"}
            border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #e5e7eb"}
            fontSize="11px"
            fontWeight="600"
            leftIcon={<Icon as={MdVisibility} boxSize="11px" />}
            _hover={{ bg: isDark ? DARK.ink6 : "#f1f5f9" }}
            onClick={() => onView(role)}
          >
            Xem
          </Button>
          <Button
            size="xs"
            h="30px"
            px="9px"
            borderRadius="8px"
            bg="linear-gradient(135deg, #f97316, #fb923c)"
            color="white"
            fontSize="11px"
            fontWeight="700"
            leftIcon={<Icon as={MdEdit} boxSize="11px" />}
            _hover={{ opacity: 0.88, transform: "translateY(-1px)" }}
            boxShadow="0 2px 8px rgba(249,115,22,0.28)"
            transition="all 0.15s"
            onClick={() => onEdit(role)}
          >
            Sửa
          </Button>
          <Button
            size="xs"
            h="30px"
            px="9px"
            borderRadius="8px"
            bg={isActive ? "#fef2f2" : "#ecfdf5"}
            color={isActive ? "#dc2626" : "#059669"}
            border={isActive ? "1px solid #fca5a5" : "1px solid #6ee7b7"}
            fontSize="11px"
            fontWeight="700"
            _hover={{ opacity: 0.88 }}
            transition="all 0.15s"
            onClick={() => onToggle(role.RoleId, role.Status)}
          >
            {isActive ? "Khóa" : "Mở"}
          </Button>
          <Button
            size="xs"
            h="30px"
            px="9px"
            borderRadius="8px"
            bg="#fef2f2"
            color="#dc2626"
            border="1px solid #fca5a5"
            fontSize="11px"
            fontWeight="700"
            leftIcon={<Icon as={MdDelete} boxSize="11px" />}
            _hover={{ bg: "#fee2e2" }}
            transition="all 0.15s"
            onClick={() => onDelete(role)}
          >
            Xóa
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default RoleRow;