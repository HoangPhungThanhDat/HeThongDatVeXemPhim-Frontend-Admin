

import React from "react";
import { Box, Flex, Text, Button, Icon } from "@chakra-ui/react";
import {
  MdEdit, MdDelete,
} from "react-icons/md";
import { FaShieldAlt, FaTrash } from "react-icons/fa";
import StatusPill from "./StatusPill";
import { DARK } from "../constants";
import { fadeUp } from "./shared/animations";

const RoleCard = ({ role, index, onView, onEdit, onDelete, onToggle, isDark }) => {
  const bg = isDark ? DARK.bgCard : "white";
  const ink = isDark ? DARK.ink : "#0f172a";
  const ink3 = isDark ? DARK.ink3 : "#64748b";
  const ink4 = isDark ? DARK.ink4 : "#94a3b8";
  const ink5 = isDark ? DARK.ink5 : "#e2e8f0";
  const ink6 = isDark ? DARK.ink6 : "#f1f5f9";

  const isActive = role.Status === "Active";

  return (
    <Box
      borderRadius="16px"
      bg={bg}
      border={isActive ? `1.5px solid ${ink6}` : `1.5px solid ${ink6}`}
      boxShadow={isDark ? "0 1px 6px rgba(0,0,0,.3)" : "0 1px 6px rgba(0,0,0,0.05)"}
      overflow="hidden"
      transition="all 0.22s"
      opacity={isActive ? 1 : 0.65}
      _hover={{
        boxShadow: isDark ? "0 6px 24px rgba(0,0,0,.4)" : "0 6px 24px rgba(249,115,22,0.12)",
        transform: "translateY(-3px)",
        border: "1.5px solid #fed7aa"
      }}
      sx={{ animation: `${fadeUp} 0.35s ease ${index * 0.06}s both` }}
    >
      <Box h="3px" bg={`linear-gradient(90deg, ${isActive ? "#10b981" : "#6b7280"}, ${isActive ? "#6ee7b7" : "#d1d5db"})`} />

      <Box p="16px">
        <Flex align="flex-start" justify="space-between" gap="8px" mb="10px">
          <Box
            w="44px"
            h="44px"
            borderRadius="12px"
            bg={isActive ? "#fff7ed" : "#f3f4f6"}
            border={isActive ? "1px solid #fed7aa" : "1px solid #d1d5db"}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Icon as={FaShieldAlt} boxSize="18px" color={isActive ? "#f97316" : "#6b7280"} />
          </Box>
          <StatusPill status={role.Status} isDark={isDark} />
        </Flex>

        <Text fontSize="15px" fontWeight="800" color={ink} lineHeight="1.3" mb="4px">
          {role.RoleName}
        </Text>

        <Text fontSize="12px" color={isDark ? DARK.ink3 : "#64748b"} lineHeight="1.6" mb="12px" noOfLines={2}>
          {role.Description || "Không có mô tả"}
        </Text>

        <Box h="1px" bg={isDark ? DARK.ink5 : "#f8fafc"} mb="12px" />

        <Flex gap="6px">
          <Button
            flex="1"
            size="sm"
            h="32px"
            borderRadius="8px"
            fontSize="12px"
            fontWeight="700"
            bg="linear-gradient(135deg, #f97316, #fb923c)"
            color="white"
            leftIcon={<Icon as={MdEdit} boxSize="12px" />}
            _hover={{ opacity: 0.88, transform: "translateY(-1px)" }}
            boxShadow="0 2px 8px rgba(249,115,22,0.28)"
            transition="all 0.15s"
            onClick={() => onEdit(role)}
          >
            Sửa
          </Button>
          <Button
            flex="1"
            size="sm"
            h="32px"
            borderRadius="8px"
            fontSize="12px"
            fontWeight="700"
            bg={isActive ? "#fef2f2" : "#ecfdf5"}
            color={isActive ? "#dc2626" : "#059669"}
            border={isActive ? "1px solid #fca5a5" : "1px solid #6ee7b7"}
            _hover={{ opacity: 0.88 }}
            transition="all 0.15s"
            onClick={() => onToggle(role.RoleId, role.Status)}
          >
            {isActive ? "Khóa" : "Mở"}
          </Button>
        </Flex>

        <Button
          w="100%"
          mt="6px"
          size="xs"
          h="28px"
          borderRadius="8px"
          fontSize="10.5px"
          fontWeight="600"
          bg="#fef2f2"
          color="#dc2626"
          border="1px solid #fca5a5"
          leftIcon={<Icon as={FaTrash} boxSize="11px" />}
          _hover={{ bg: "#fee2e2" }}
          transition="all 0.15s"
          onClick={() => onDelete(role)}
        >
          Xóa vĩnh viễn
        </Button>
      </Box>
    </Box>
  );
};

export default RoleCard;