// src/views/admin/quanlynguoidung/components/UserRow.jsx

import React from "react";
import { Box, Flex, Text, Button, Icon } from "@chakra-ui/react";
import {
  MdVisibility, MdLock, MdLockOpen, MdDelete, MdNotifications,
} from "react-icons/md";
import { FaBell, FaTrash } from "react-icons/fa";
import StatusDot from "./StatusDot";
import { DARK } from "../constants";
import { fadeUp } from "./shared/animations";

const UserRow = ({ user, index, onView, onToggleLock, onDelete, onNotify, isDark }) => {
  const bg = isDark ? DARK.bgCard : "white";
  const ink = isDark ? DARK.ink : "#0f172a";
  const ink4 = isDark ? DARK.ink4 : "#94a3b8";
  const ink5 = isDark ? DARK.ink5 : "#e2e8f0";
  const ink6 = isDark ? DARK.ink6 : "#f1f5f9";

  return (
    <>
      {/* Mobile */}
      <Box display={{ base: "block", md: "none" }}
        p="14px" borderRadius="14px" bg={bg} border={isDark ? `1.5px solid ${DARK.ink5}` : "1.5px solid #f1f5f9"}
        transition="all 0.2s"
        _hover={{ border: "1.5px solid #f97316", boxShadow: isDark ? "0 2px 12px rgba(0,0,0,.3)" : "0 2px 12px rgba(249,115,22,0.1)" }}
        sx={{ animation: `${fadeUp} 0.3s ease ${Math.min(index * 0.04, 0.4)}s both` }}
      >
        <Flex gap="12px" mb="12px" align="flex-start">
          <Box flex="1" minW="0">
            <Text fontSize="14px" fontWeight="700" color={ink} noOfLines={1}>{user.FullName}</Text>
            <Text fontSize="11px" color={isDark ? DARK.ink4 : "#94a3b8"} noOfLines={1}>{user.Email}</Text>
            <Flex gap="6px" mt="6px" flexWrap="wrap">
              <StatusDot status={user.Status} isDark={isDark} />
            </Flex>
          </Box>
          <Box textAlign="right">
            <Text fontSize="12px" color={isDark ? DARK.ink4 : "#94a3b8"}>{user.role?.RoleName || "User"}</Text>
          </Box>
        </Flex>
        <Flex gap="6px" flexWrap="wrap">
          <Button flex="2" size="sm" h="32px" borderRadius="9px"
            bg="linear-gradient(135deg,#f97316,#fb923c)" color="white"
            fontSize="11.5px" fontWeight="700"
            leftIcon={<Icon as={MdVisibility} boxSize="12px" />}
            _hover={{ opacity: 0.88 }} boxShadow="0 2px 8px rgba(249,115,22,0.3)"
            onClick={() => onView(user)}
          >Chi tiết</Button>
          <Button flex="1" size="sm" h="32px" borderRadius="9px"
            bg="#fff7ed" color="#f97316" border="1px solid #fed7aa"
            fontSize="11.5px" fontWeight="700"
            leftIcon={<Icon as={FaBell} boxSize="11px" />}
            _hover={{ opacity: 0.88 }}
            onClick={() => onNotify(user)}
          >Thông báo</Button>
          <Button flex="1" size="sm" h="32px" borderRadius="9px"
            bg={user.Status === "Active" ? "#fef2f2" : "#ecfdf5"}
            color={user.Status === "Active" ? "#dc2626" : "#059669"}
            border={`1px solid ${user.Status === "Active" ? "#fca5a5" : "#6ee7b7"}`}
            fontSize="11.5px" fontWeight="700"
            leftIcon={<Icon as={user.Status === "Active" ? MdLock : MdLockOpen} boxSize="11px" />}
            _hover={{ opacity: 0.88 }}
            onClick={() => onToggleLock(user.UserId)}
          >{user.Status === "Active" ? "Khóa" : "Mở"}</Button>
        </Flex>
      </Box>

      {/* Desktop */}
      <Box display={{ base: "none", md: "block" }}
        px="18px" py="13px" borderRadius="12px" bg={bg} border={isDark ? `1.5px solid ${DARK.ink5}` : "1.5px solid #f1f5f9"}
        transition="all 0.2s"
        _hover={{ border: "1.5px solid #f97316", boxShadow: isDark ? "0 2px 12px rgba(0,0,0,.3)" : "0 2px 12px rgba(249,115,22,0.08)", bg: isDark ? DARK.ink6 : "#fffbf7" }}
        sx={{ animation: `${fadeUp} 0.3s ease ${Math.min(index * 0.04, 0.4)}s both` }}
      >
        <Flex align="center">
          <Box w="28px" flexShrink="0">
            <Text fontSize="11px" fontWeight="700" color={isDark ? DARK.ink4 : "#cbd5e1"}>{String(index + 1).padStart(2, "0")}</Text>
          </Box>
          <Box flex="2" minW="0" pr="12px">
            <Text fontSize="13px" fontWeight="700" color={ink} noOfLines={1}>{user.FullName}</Text>
            <Text fontSize="10.5px" color={isDark ? DARK.ink4 : "#94a3b8"} noOfLines={1}>{user.Email}</Text>
          </Box>
          <Box flex="0.9" minW="0" pr="12px">
            <Text fontSize="12px" fontWeight="600" color={isDark ? DARK.ink2 : "#374151"}>{user.PhoneNumber || "N/A"}</Text>
          </Box>
          <Box flex="0.6" minW="0" pr="12px">
            <Text fontSize="12px" fontWeight="700" color={isDark ? DARK.ink2 : "#374151"}>{user.role?.RoleName || "User"}</Text>
          </Box>
          <Box flex="0.8" minW="0" pr="12px">
            <StatusDot status={user.Status} isDark={isDark} />
          </Box>
          <Flex gap="5px" flexShrink="0">
            <Button size="xs" h="30px" px="11px" borderRadius="8px"
              bg="linear-gradient(135deg,#f97316,#fb923c)" color="white"
              fontSize="11.5px" fontWeight="700"
              leftIcon={<Icon as={MdVisibility} boxSize="12px" />}
              _hover={{ opacity: 0.88, transform: "translateY(-1px)" }}
              boxShadow="0 2px 8px rgba(249,115,22,0.3)" transition="all 0.15s"
              onClick={() => onView(user)}
            >Xem</Button>
            <Button size="xs" h="30px" px="9px" borderRadius="8px"
              bg="#fff7ed" color="#f97316" border="1px solid #fed7aa"
              fontSize="11.5px" fontWeight="700"
              _hover={{ opacity: 0.88 }} transition="all 0.15s"
              onClick={() => onNotify(user)}
              title="Gửi thông báo"
            ><Icon as={FaBell} boxSize="12px" /></Button>
            <Button size="xs" h="30px" px="9px" borderRadius="8px"
              bg={user.Status === "Active" ? "#fef2f2" : "#ecfdf5"}
              color={user.Status === "Active" ? "#dc2626" : "#059669"}
              border={`1px solid ${user.Status === "Active" ? "#fca5a5" : "#6ee7b7"}`}
              fontSize="11.5px" fontWeight="700"
              leftIcon={<Icon as={user.Status === "Active" ? MdLock : MdLockOpen} boxSize="12px" />}
              _hover={{ opacity: 0.88 }} transition="all 0.15s"
              onClick={() => onToggleLock(user.UserId)}
            >{user.Status === "Active" ? "Khóa" : "Mở"}</Button>
            <Button size="xs" h="30px" px="9px" borderRadius="8px"
              bg="#fef2f2" color="#dc2626" border="1px solid #fca5a5"
              fontSize="11.5px" fontWeight="700"
              _hover={{ opacity: 0.88, bg: "#fee2e2" }} transition="all 0.15s"
              onClick={() => onDelete(user)}
              title="Xóa vĩnh viễn"
            ><Icon as={FaTrash} boxSize="11px" /></Button>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default UserRow;