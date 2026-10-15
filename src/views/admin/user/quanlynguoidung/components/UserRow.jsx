// src/views/admin/quanlynguoidung/components/UserRow.jsx

import React from "react";
import { Box, Flex, Text, Button, Icon, Tooltip } from "@chakra-ui/react";
import {
  MdVisibility, MdLock, MdLockOpen, MdDelete, MdNotifications,
} from "react-icons/md";
import { FaBell, FaTrash } from "react-icons/fa";
import StatusDot from "./StatusDot";
import { DARK } from "../constants";
import { fadeUp } from "./shared/animations";

// ✅ Hàm lấy tên role từ nhiều nguồn khác nhau
const getRoleName = (user) => {
  // Ưu tiên 1: user.role.RoleName
  if (user.role?.RoleName) return user.role.RoleName;
  // Ưu tiên 2: user.RoleName (nếu có)
  if (user.RoleName) return user.RoleName;
  // Ưu tiên 3: user.role (nếu là string)
  if (typeof user.role === 'string') return user.role;
  // Ưu tiên 4: user.role?.name
  if (user.role?.name) return user.role.name;
  // Ưu tiên 5: user.role_id (map sang tên)
  if (user.RoleId) {
    const roleMap = {
      1: 'Admin',
      2: 'User',
      7: 'Staff'
    };
    return roleMap[user.RoleId] || 'User';
  }
  // Mặc định
  return 'User';
};

// ✅ Hàm lấy màu sắc cho role
const getRoleColor = (roleName) => {
  const colors = {
    'Admin': { bg: '#fef2f2', color: '#dc2626', border: '#fca5a5', label: 'Quản trị viên' },
    'Staff': { bg: '#eff6ff', color: '#2563eb', border: '#93c5fd', label: 'Nhân viên' },
    'User': { bg: '#f3f4f6', color: '#6b7280', border: '#d1d5db', label: 'Người dùng' },
  };
  return colors[roleName] || colors['User'];
};

const UserRow = ({ user, index, onView, onToggleLock, onDelete, onNotify, isDark }) => {
  const bg = isDark ? DARK.bgCard : "white";
  const ink = isDark ? DARK.ink : "#0f172a";
  const ink4 = isDark ? DARK.ink4 : "#94a3b8";
  const ink5 = isDark ? DARK.ink5 : "#e2e8f0";
  const ink6 = isDark ? DARK.ink6 : "#f1f5f9";

  // ✅ Lấy tên role
  const roleName = getRoleName(user);
  const roleColor = getRoleColor(roleName);
  const isActive = user.Status === "Active";

  return (
    <>
      {/* ─── Mobile ─── */}
      <Box 
        display={{ base: "block", md: "none" }}
        p="14px" 
        borderRadius="14px" 
        bg={bg} 
        border={isDark ? `1.5px solid ${DARK.ink5}` : "1.5px solid #f1f5f9"}
        transition="all 0.2s"
        _hover={{ 
          border: "1.5px solid #f97316", 
          boxShadow: isDark ? "0 2px 12px rgba(0,0,0,.3)" : "0 2px 12px rgba(249,115,22,0.1)" 
        }}
        sx={{ animation: `${fadeUp} 0.3s ease ${Math.min(index * 0.04, 0.4)}s both` }}
      >
        <Flex gap="12px" mb="12px" align="flex-start">
          <Box flex="1" minW="0">
            <Flex align="center" gap="8px">
              <Text fontSize="14px" fontWeight="700" color={ink} noOfLines={1}>
                {user.FullName || "Unknown"}
              </Text>
              <Box 
                px="6px" 
                py="1px" 
                borderRadius="full" 
                bg={roleColor.bg}
                color={roleColor.color}
                border={`1px solid ${roleColor.border}`}
                fontSize="9px"
                fontWeight="700"
              >
                {roleName}
              </Box>
            </Flex>
            <Text fontSize="11px" color={isDark ? DARK.ink4 : "#94a3b8"} noOfLines={1}>
              {user.Email || "No email"}
            </Text>
            <Flex gap="6px" mt="6px" flexWrap="wrap">
              <StatusDot status={user.Status} isDark={isDark} />
            </Flex>
          </Box>
        </Flex>
        
        <Flex gap="6px" flexWrap="wrap">
          <Button flex="2" size="sm" h="32px" borderRadius="9px"
            bg="linear-gradient(135deg,#f97316,#fb923c)" color="white"
            fontSize="11.5px" fontWeight="700"
            leftIcon={<Icon as={MdVisibility} boxSize="12px" />}
            _hover={{ opacity: 0.88, transform: "translateY(-1px)" }}
            boxShadow="0 2px 8px rgba(249,115,22,0.3)"
            onClick={() => onView(user)}
          >
            Chi tiết
          </Button>
          <Button flex="1" size="sm" h="32px" borderRadius="9px"
            bg="#fff7ed" color="#f97316" border="1px solid #fed7aa"
            fontSize="11.5px" fontWeight="700"
            leftIcon={<Icon as={FaBell} boxSize="11px" />}
            _hover={{ opacity: 0.88 }}
            onClick={() => onNotify(user)}
          >
            Thông báo
          </Button>
          <Button flex="1" size="sm" h="32px" borderRadius="9px"
            bg={isActive ? "#fef2f2" : "#ecfdf5"}
            color={isActive ? "#dc2626" : "#059669"}
            border={`1px solid ${isActive ? "#fca5a5" : "#6ee7b7"}`}
            fontSize="11.5px" fontWeight="700"
            leftIcon={<Icon as={isActive ? MdLock : MdLockOpen} boxSize="11px" />}
            _hover={{ opacity: 0.88 }}
            onClick={() => onToggleLock(user.UserId)}
          >
            {isActive ? "Khóa" : "Mở khóa"}
          </Button>
        </Flex>
      </Box>

      {/* ─── Desktop ─── */}
      <Box 
        display={{ base: "none", md: "block" }}
        px="18px" 
        py="12px" 
        borderRadius="10px" 
        bg={bg} 
        border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #f1f5f9"}
        transition="all 0.2s"
        _hover={{ 
          border: "1px solid #f97316", 
          boxShadow: isDark ? "0 2px 12px rgba(0,0,0,.2)" : "0 2px 12px rgba(249,115,22,0.06)", 
          bg: isDark ? DARK.ink6 : "#fafafa" 
        }}
        sx={{ animation: `${fadeUp} 0.3s ease ${Math.min(index * 0.04, 0.4)}s both` }}
      >
        <Flex align="center" gap="8px">
          {/* STT */}
          <Box w="28px" flexShrink="0">
            <Text fontSize="11px" fontWeight="700" color={isDark ? DARK.ink4 : "#cbd5e1"}>
              {String(index + 1).padStart(2, "0")}
            </Text>
          </Box>
          
          {/* Người dùng */}
          <Box flex="2" minW="0">
            <Text fontSize="13px" fontWeight="700" color={ink} noOfLines={1}>
              {user.FullName || "Unknown"}
            </Text>
            <Text fontSize="10.5px" color={isDark ? DARK.ink4 : "#94a3b8"} noOfLines={1}>
              {user.Email || "No email"}
            </Text>
          </Box>
          
          {/* SĐT */}
          <Box flex="0.9" minW="0">
            <Text fontSize="12px" fontWeight="600" color={isDark ? DARK.ink2 : "#374151"}>
              {user.PhoneNumber || "N/A"}
            </Text>
          </Box>
          
          {/* Vai trò */}
          <Box flex="0.6" minW="0">
            <Tooltip label={roleColor.label} placement="top" hasArrow>
              <Box 
                px="10px" 
                py="3px" 
                borderRadius="full" 
                bg={roleColor.bg}
                color={roleColor.color}
                border={`1px solid ${roleColor.border}`}
                fontSize="11px"
                fontWeight="700"
                display="inline-block"
                cursor="default"
              >
                {roleName}
              </Box>
            </Tooltip>
          </Box>
          
          {/* Trạng thái */}
          <Box flex="0.8" minW="0">
            <StatusDot status={user.Status} isDark={isDark} />
          </Box>
          
          {/* Actions */}
          <Flex gap="4px" flexShrink="0">
            <Tooltip label="Xem chi tiết" placement="top" hasArrow>
              <Button size="xs" h="30px" px="11px" borderRadius="8px"
                bg="linear-gradient(135deg,#f97316,#fb923c)" color="white"
                fontSize="11.5px" fontWeight="700"
                leftIcon={<Icon as={MdVisibility} boxSize="12px" />}
                _hover={{ opacity: 0.88, transform: "translateY(-1px)" }}
                boxShadow="0 2px 8px rgba(249,115,22,0.3)" 
                transition="all 0.15s"
                onClick={() => onView(user)}
              >
                Xem
              </Button>
            </Tooltip>
            
            <Tooltip label="Gửi thông báo" placement="top" hasArrow>
              <Button size="xs" h="30px" px="9px" borderRadius="8px"
                bg="#fff7ed" color="#f97316" border="1px solid #fed7aa"
                fontSize="11.5px" fontWeight="700"
                _hover={{ opacity: 0.88, transform: "translateY(-1px)" }} 
                transition="all 0.15s"
                onClick={() => onNotify(user)}
              >
                <Icon as={FaBell} boxSize="12px" />
              </Button>
            </Tooltip>
            
            <Tooltip label={isActive ? "Khóa tài khoản" : "Mở khóa tài khoản"} placement="top" hasArrow>
              <Button size="xs" h="30px" px="9px" borderRadius="8px"
                bg={isActive ? "#fef2f2" : "#ecfdf5"}
                color={isActive ? "#dc2626" : "#059669"}
                border={`1px solid ${isActive ? "#fca5a5" : "#6ee7b7"}`}
                fontSize="11.5px" fontWeight="700"
                leftIcon={<Icon as={isActive ? MdLock : MdLockOpen} boxSize="12px" />}
                _hover={{ opacity: 0.88, transform: "translateY(-1px)" }} 
                transition="all 0.15s"
                onClick={() => onToggleLock(user.UserId)}
              >
                {isActive ? "Khóa" : "Mở"}
              </Button>
            </Tooltip>
            
            <Tooltip label="Xóa vĩnh viễn" placement="top" hasArrow>
              <Button size="xs" h="30px" px="9px" borderRadius="8px"
                bg="#fef2f2" color="#dc2626" border="1px solid #fca5a5"
                fontSize="11.5px" fontWeight="700"
                _hover={{ opacity: 0.88, transform: "translateY(-1px)", bg: "#fee2e2" }} 
                transition="all 0.15s"
                onClick={() => onDelete(user)}
              >
                <Icon as={FaTrash} boxSize="11px" />
              </Button>
            </Tooltip>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default UserRow;