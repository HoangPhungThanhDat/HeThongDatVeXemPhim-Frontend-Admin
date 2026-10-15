// src/views/admin/quanlynguoidung/components/UserDetail.jsx

import React from "react";
import {
  Box, Flex, Text, Button, Icon, SimpleGrid,
} from "@chakra-ui/react";
import {
  MdArrowBack, MdEdit, MdLock, MdLockOpen,
  MdEmail, MdPhone, MdCalendarToday, MdPerson,
  MdCheckCircle, MdClose, MdAccessTime,
} from "react-icons/md";
import {
  FaBell, FaTrash, FaUserShield, FaVenusMars,
  FaBirthdayCake, FaUser,
} from "react-icons/fa";
import StatusDot from "./StatusDot";
import { DARK } from "../constants";
import { scaleIn, shimmer } from "./shared/animations";

const UserDetail = ({ user, onBack, onToggleLock, onDelete, onNotify, onEdit, isDark }) => {
  const bg = isDark ? DARK.bgCard : "white";
  const ink = isDark ? DARK.ink : "#0f172a";
  const ink3 = isDark ? DARK.ink3 : "#64748b";
  const ink4 = isDark ? DARK.ink4 : "#94a3b8";
  const ink5 = isDark ? DARK.ink5 : "#e2e8f0";
  const ink6 = isDark ? DARK.ink6 : "#f1f5f9";

  const isActive = user.Status === "Active";

  const getStatusText = (status) => {
    if (status === "Active") return "Hoạt động";
    if (status === "Inactive") return "Tạm khóa";
    if (status === "Banned") return "Đã cấm";
    return status;
  };

  const getGenderText = (gender) => {
    if (gender === "Male") return "Nam";
    if (gender === "Female") return "Nữ";
    if (gender === "Other") return "Khác";
    return gender || "Chưa cập nhật";
  };

  return (
    <Box sx={{ animation: `${scaleIn} 0.3s ease both` }}>
      {/* Header */}
      <Flex align={{ base: "flex-start", md: "center" }} justify="space-between"
        direction={{ base: "column", sm: "row" }} gap="12px" mb="20px"
      >
        <Button leftIcon={<Icon as={MdArrowBack} />} variant="ghost"
          color={isDark ? DARK.ink3 : "#64748b"} borderRadius="10px" h="38px" fontSize="13px" fontWeight="600"
          border={isDark ? `1.5px solid ${DARK.ink5}` : "1.5px solid #e2e8f0"}
          _hover={{ bg: isDark ? DARK.ink6 : "#f8fafc" }}
          onClick={onBack}
        >Quay lại</Button>

        <Flex gap="8px" flexWrap="wrap">
          <Button h="38px" px="14px" borderRadius="10px" fontWeight="700" fontSize="13px"
            bg="linear-gradient(135deg,#f97316,#fb923c)" color="white"
            boxShadow="0 4px 14px rgba(249,115,22,0.35)"
            leftIcon={<Icon as={MdEdit} />}
            _hover={{ opacity: 0.88 }} transition="all 0.2s"
            onClick={onEdit}
          >Chỉnh sửa</Button>
          <Button h="38px" px="14px" borderRadius="10px" fontWeight="700" fontSize="13px"
            bg="#fff7ed" color="#f97316" border="1px solid #fed7aa"
            leftIcon={<Icon as={FaBell} />}
            _hover={{ bg: "#ffedd5" }} transition="all 0.2s"
            onClick={() => onNotify(user)}
          >Thông báo</Button>
          <Button h="38px" px="14px" borderRadius="10px" fontWeight="700" fontSize="13px"
            bg={isActive ? "#fef2f2" : "#ecfdf5"}
            color={isActive ? "#dc2626" : "#059669"}
            border={`1px solid ${isActive ? "#fca5a5" : "#6ee7b7"}`}
            leftIcon={<Icon as={isActive ? MdLock : MdLockOpen} />}
            _hover={{ opacity: 0.88 }} transition="all 0.2s"
            onClick={() => onToggleLock(user.UserId)}
          >{isActive ? "Khóa tài khoản" : "Mở khóa"}</Button>
          <Button h="38px" px="14px" borderRadius="10px" fontWeight="700" fontSize="13px"
            bg="linear-gradient(135deg,#fef2f2,#fee2e2)" color="#dc2626"
            border="1px solid #fca5a5"
            leftIcon={<Icon as={FaTrash} />}
            _hover={{ opacity: 0.88, bg: "linear-gradient(135deg,#fee2e2,#fecaca)" }} transition="all 0.2s"
            onClick={() => onDelete(user)}
          >Xóa vĩnh viễn</Button>
        </Flex>
      </Flex>

      {/* Hero profile card */}
      <Box bg={bg} borderRadius="18px" border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #f1f5f9"}
        boxShadow={isDark ? "0 2px 12px rgba(0,0,0,.3)" : "0 2px 12px rgba(0,0,0,0.06)"} overflow="hidden" mb="16px"
      >
        <Box h="4px" bg="linear-gradient(90deg,#f97316,#fbbf24,#f97316)"
          bgSize="200% 100%" sx={{ animation: `${shimmer} 3s linear infinite` }}
        />
        <Flex direction={{ base: "column", md: "row" }} p={{ base: "20px", md: "28px" }} gap="24px" align="flex-start">
          {/* Avatar - Left Column */}
          <Flex direction="column" align={{ base: "center", md: "flex-start" }} gap="12px" flexShrink="0">
            <Box position="relative">
              <Box w={{ base: "80px", md: "96px" }} h={{ base: "80px", md: "96px" }}
                borderRadius="20px" overflow="hidden"
                border="3px solid #fed7aa" boxShadow="0 4px 16px rgba(249,115,22,0.2)"
                bg="linear-gradient(135deg,#f97316,#fb923c)"
                display="flex" alignItems="center" justifyContent="center"
              >
                {user.Avatar ? (
                  <img
                    src={user.Avatar}
                    alt={user.FullName}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <Icon as={FaUser} boxSize="40px" color="white" />
                )}
              </Box>
              {!isActive && (
                <Box position="absolute" bottom="-4px" right="-4px"
                  w="22px" h="22px" borderRadius="full" bg="#dc2626"
                  display="flex" alignItems="center" justifyContent="center"
                  border="2px solid white"
                ><Icon as={MdLock} boxSize="11px" color="white" /></Box>
              )}
            </Box>
            {/* Status Badge */}
            <Flex align="center" gap="8px" px="12px" py="6px" borderRadius="10px"
              bg={isActive ? "#ecfdf5" : "#fef2f2"}
              border={`1px solid ${isActive ? "#6ee7b7" : "#fca5a5"}`}
            >
              {isActive ? (
                <Icon as={MdCheckCircle} boxSize="14px" color="#059669" />
              ) : (
                <Icon as={MdClose} boxSize="14px" color="#dc2626" />
              )}
              <Text fontSize="13px" fontWeight="700" color={isActive ? "#059669" : "#dc2626"}>
                {getStatusText(user.Status)}
              </Text>
            </Flex>
          </Flex>

          {/* User Info - Right Column */}
          <Box flex="1" minW="0">
            <Flex align="center" gap="10px" mb="6px" flexWrap="wrap">
              <Text fontSize={{ base: "20px", md: "24px" }} fontWeight="800" color={ink} letterSpacing="-0.4px">
                {user.FullName}
              </Text>
            </Flex>
            <Text fontSize="12px" color={isDark ? DARK.ink4 : "#64748b"} fontFamily="mono" mb="14px">
              ID: {user.UserId}
            </Text>

            {/* Email - giống trang show */}
            <Box mb="14px">
              <Flex align="center" gap="8px" mb="4px">
                <Icon as={MdEmail} boxSize="14px" color="#f97316" />
                <Text fontSize="11px" fontWeight="700" color={isDark ? DARK.ink4 : "#94a3b8"}>
                  Email
                </Text>
              </Flex>
              <Text fontSize="14px" fontWeight="600" color={ink}>
                {user.Email || "Chưa cập nhật"}
              </Text>
            </Box>

            {/* Thông tin cá nhân - Grid 4 cột */}
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing="10px" mb="14px">
              {[
                { icon: MdPhone, val: user.PhoneNumber || "Chưa cập nhật", label: "Số điện thoại" },
                { icon: FaVenusMars, val: getGenderText(user.Gender), label: "Giới tính" },
                { icon: FaBirthdayCake, val: user.DateOfBirth || "Chưa cập nhật", label: "Ngày sinh" },
                { icon: FaUserShield, val: user.role?.RoleName || "User", label: "Vai trò" },
              ].map(({ icon: Ic, val, label }) => (
                <Box key={label} p="10px 12px" borderRadius="10px" bg={isDark ? DARK.ink6 : "#f8fafc"} 
                  border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #f1f5f9"}
                >
                  <Flex align="center" gap="5px" mb="3px">
                    <Icon as={Ic} boxSize="11px" color="#f97316" />
                    <Text fontSize="9px" fontWeight="700" color={isDark ? DARK.ink4 : "#94a3b8"}
                      letterSpacing="0.7px" textTransform="uppercase">{label}</Text>
                  </Flex>
                  <Text fontSize="12px" fontWeight="600" color={ink} noOfLines={1}>{val}</Text>
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        </Flex>
      </Box>

      {/* Thông tin tài khoản - giống trang show */}
      <Box bg={bg} borderRadius="16px" border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #f1f5f9"}
        boxShadow={isDark ? "0 1px 4px rgba(0,0,0,.3)" : "0 1px 4px rgba(0,0,0,0.04)"} p="20px"
      >
        <Flex align="center" gap="8px" mb="14px">
          <Box w="28px" h="28px" borderRadius="8px"
            bg="linear-gradient(135deg,#7c3aed,#8b5cf6)"
            display="flex" alignItems="center" justifyContent="center"
          >
            <Icon as={FaUser} boxSize="13px" color="white" />
          </Box>
          <Text fontSize="14px" fontWeight="800" color={ink}>Thông Tin Tài Khoản</Text>
          <Text fontSize="11px" color={isDark ? DARK.ink4 : "#94a3b8"} ml="auto">
            Lịch sử hoạt động
          </Text>
        </Flex>

        <Flex direction="column" gap="10px">
          {/* Người tạo */}
          <Flex align="center" gap="12px" p="10px 14px" borderRadius="10px" 
            bg={isDark ? DARK.ink6 : "#f8fafc"} 
            border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #f1f5f9"}
          >
            <Box w="32px" h="32px" borderRadius="8px" bg={isDark ? DARK.ink5 : "#e5e7eb"}
              display="flex" alignItems="center" justifyContent="center"
            >
              <Icon as={MdPerson} boxSize="14px" color="#7c3aed" />
            </Box>
            <Box flex="1">
              <Text fontSize="10px" fontWeight="700" color={isDark ? DARK.ink4 : "#94a3b8"}>
                Người tạo
              </Text>
              <Text fontSize="13px" fontWeight="600" color={ink}>
                {user.CreatedBy || "System"}
              </Text>
            </Box>
          </Flex>

          {/* Ngày tạo */}
          <Flex align="center" gap="12px" p="10px 14px" borderRadius="10px" 
            bg={isDark ? DARK.ink6 : "#f8fafc"} 
            border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #f1f5f9"}
          >
            <Box w="32px" h="32px" borderRadius="8px" bg={isDark ? DARK.ink5 : "#e5e7eb"}
              display="flex" alignItems="center" justifyContent="center"
            >
              <Icon as={MdCalendarToday} boxSize="14px" color="#7c3aed" />
            </Box>
            <Box flex="1">
              <Text fontSize="10px" fontWeight="700" color={isDark ? DARK.ink4 : "#94a3b8"}>
                Ngày tạo
              </Text>
              <Text fontSize="13px" fontWeight="600" color={ink}>
                {user.CreatedAt || "N/A"}
              </Text>
            </Box>
          </Flex>

          {/* Người cập nhật */}
          <Flex align="center" gap="12px" p="10px 14px" borderRadius="10px" 
            bg={isDark ? DARK.ink6 : "#f8fafc"} 
            border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #f1f5f9"}
          >
            <Box w="32px" h="32px" borderRadius="8px" bg={isDark ? DARK.ink5 : "#e5e7eb"}
              display="flex" alignItems="center" justifyContent="center"
            >
              <Icon as={MdPerson} boxSize="14px" color="#059669" />
            </Box>
            <Box flex="1">
              <Text fontSize="10px" fontWeight="700" color={isDark ? DARK.ink4 : "#94a3b8"}>
                Người cập nhật
              </Text>
              <Text fontSize="13px" fontWeight="600" color={ink}>
                {user.UpdatedBy || "N/A"}
              </Text>
            </Box>
          </Flex>

          {/* Cập nhật lần cuối */}
          <Flex align="center" gap="12px" p="10px 14px" borderRadius="10px" 
            bg={isDark ? DARK.ink6 : "#f8fafc"} 
            border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #f1f5f9"}
          >
            <Box w="32px" h="32px" borderRadius="8px" bg={isDark ? DARK.ink5 : "#e5e7eb"}
              display="flex" alignItems="center" justifyContent="center"
            >
              <Icon as={MdAccessTime} boxSize="14px" color="#059669" />
            </Box>
            <Box flex="1">
              <Text fontSize="10px" fontWeight="700" color={isDark ? DARK.ink4 : "#94a3b8"}>
                Cập nhật lần cuối
              </Text>
              <Text fontSize="13px" fontWeight="600" color={ink}>
                {user.UpdatedAt || "N/A"}
              </Text>
            </Box>
          </Flex>
        </Flex>
      </Box>

      {/* ID Người Dùng */}
      <Box mt="12px" p="12px 16px" borderRadius="10px"
        bg={isDark ? DARK.ink6 : "#f3f4f6"}
        border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #e5e7eb"}
      >
        <Flex align="center" justify="space-between">
          <Flex align="center" gap="6px">
            <Icon as={FaUser} boxSize="14px" color={isDark ? DARK.ink4 : "#94a3b8"} />
            <Text fontSize="11px" fontWeight="700" color={isDark ? DARK.ink4 : "#94a3b8"}>
              ID Người Dùng
            </Text>
          </Flex>
          <Text fontSize="13px" fontWeight="800" color={isDark ? DARK.ink : "#0f172a"} fontFamily="mono">
            {user.UserId}
          </Text>
        </Flex>
      </Box>
    </Box>
  );
};

export default UserDetail;