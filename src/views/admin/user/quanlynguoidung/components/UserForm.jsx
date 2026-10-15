// src/views/admin/quanlynguoidung/components/UserForm.jsx

import React, { useState } from "react";
import {
  Box, Flex, Text, Button, Icon, Grid, Input, Select,
} from "@chakra-ui/react";
import {
  MdArrowBack, MdClose, MdCheckCircle, MdPerson,
  MdEmail, MdPhone, MdLock, MdCalendarToday,
} from "react-icons/md";
import { FaUserPlus, FaVenusMars, FaUserShield } from "react-icons/fa";
import SectionTitle from "./shared/SectionTitle";
import { DARK, GENDER_OPTIONS } from "../constants";
import { scaleIn } from "./shared/animations";

export const inputSx = (isDark) => ({
  bg: isDark ? DARK.ink6 : "#fafafa",
  border: isDark ? `1.5px solid ${DARK.ink5}` : "1.5px solid #e8edf3",
  borderRadius: "10px",
  color: isDark ? DARK.ink : "#1a202c",
  fontSize: "13px",
  fontWeight: "500",
  h: { base: "42px", md: "36px" },
  _placeholder: { color: isDark ? DARK.ink4 : "#b0bac8" },
  _focus: { border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.10)", bg: isDark ? DARK.bgCard : "#fff" },
  _hover: { border: "1.5px solid #f97316", bg: isDark ? DARK.bgCard : "#fff" },
  transition: "all 0.2s",
});

const labelSx = (isDark) => ({
  fontSize: "10.5px",
  fontWeight: "800",
  letterSpacing: "0.9px",
  textTransform: "uppercase",
  color: isDark ? DARK.ink3 : "#64748b",
  mb: "7px",
  display: "block",
});

const UserForm = ({ user, onCancel, onSave, isAdd = false, isDark, roles = [], isSubmitting }) => {
  const [form, setForm] = useState(
    user ? { ...user } : {
      FullName: "",
      Email: "",
      PhoneNumber: "",
      Gender: "",
      DateOfBirth: "",
      PasswordHash: "",
      RoleId: 2,
      Status: "Active",
    }
  );

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const styles = inputSx(isDark);
  const label = labelSx(isDark);
  const bg = isDark ? DARK.bgCard : "white";
  const ink = isDark ? DARK.ink : "#0f172a";
  const ink4 = isDark ? DARK.ink4 : "#94a3b8";

  const handleSubmit = () => {
    onSave(form);
  };

  const statusOptions = [
    { value: "Active", label: "Hoạt động", color: "#10b981" },
    { value: "Inactive", label: "Khóa", color: "#f59e0b" },
    { value: "Banned", label: "Cấm", color: "#ef4444" },
  ];

  return (
    <Box sx={{ animation: `${scaleIn} 0.28s ease both` }}>
      <Flex align={{ base: "flex-start", sm: "center" }} gap="12px" mb="20px" direction={{ base: "column", sm: "row" }}>
        <Button leftIcon={<Icon as={MdArrowBack} />} variant="ghost"
          color={isDark ? DARK.ink3 : "#64748b"} borderRadius="10px" h="38px" fontSize="13px" fontWeight="600"
          border={isDark ? `1.5px solid ${DARK.ink5}` : "1.5px solid #e2e8f0"}
          _hover={{ bg: isDark ? DARK.ink6 : "#f8fafc" }} flexShrink="0"
          onClick={onCancel}
        >Quay lại</Button>
        <Box>
          <Text fontSize={{ base: "17px", md: "20px" }} fontWeight="800" color={ink} letterSpacing="-0.4px">
            {isAdd ? "Thêm người dùng mới" : `Chỉnh sửa: ${user?.FullName}`}
          </Text>
          <Text fontSize="12px" color={isDark ? DARK.ink4 : "#94a3b8"} mt="2px">
            {isAdd ? "Tạo tài khoản người dùng mới cho hệ thống" : "Cập nhật thông tin người dùng"}
          </Text>
        </Box>
      </Flex>

      <Grid templateColumns={{ base: "1fr", lg: "1fr 300px" }} gap="16px">
        <Flex direction="column" gap="14px">
          {/* Thông tin cơ bản */}
          <Box bg={bg} borderRadius="16px" border={`1px solid ${isDark ? DARK.ink5 : "#f1f5f9"}`}
            boxShadow={isDark ? "0 1px 4px rgba(0,0,0,.3)" : "0 1px 4px rgba(0,0,0,0.04)"}
            p={{ base: "16px", md: "20px" }}
          >
            <SectionTitle label="Thông tin cá nhân" isDark={isDark} />
            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="14px" mb="14px">
              <Box>
                <Text sx={label}>Họ và tên *</Text>
                <Input {...styles} placeholder="Nhập họ và tên"
                  value={form.FullName} onChange={(e) => set("FullName", e.target.value)} required />
              </Box>
              <Box>
                <Text sx={label}>Email *</Text>
                <Input {...styles} type="email" placeholder="email@example.com"
                  value={form.Email} onChange={(e) => set("Email", e.target.value)} required />
              </Box>
            </Grid>
            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="14px" mb="14px">
              <Box>
                <Text sx={label}>Số điện thoại</Text>
                <Input {...styles} placeholder="0912 345 678"
                  value={form.PhoneNumber} onChange={(e) => set("PhoneNumber", e.target.value)} />
              </Box>
              <Box>
                <Text sx={label}>Ngày sinh</Text>
                <Input {...styles} type="date"
                  value={form.DateOfBirth || ""} onChange={(e) => set("DateOfBirth", e.target.value)} />
              </Box>
            </Grid>
            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="14px">
              <Box>
                <Text sx={label}>Giới tính</Text>
                <Select {...styles} value={form.Gender} onChange={(e) => set("Gender", e.target.value)}>
                  <option value="">-- Chọn giới tính --</option>
                  {GENDER_OPTIONS.map((g) => (
                    <option key={g} value={g}>{g === "Male" ? "Nam" : g === "Female" ? "Nữ" : "Khác"}</option>
                  ))}
                </Select>
              </Box>
              <Box>
                <Text sx={label}>Vai trò</Text>
                <Select {...styles} value={form.RoleId} onChange={(e) => set("RoleId", Number(e.target.value))}>
                  <option value="">-- Chọn vai trò --</option>
                  {roles.map((r) => <option key={r.RoleId} value={r.RoleId}>{r.RoleName}</option>)}
                </Select>
              </Box>
            </Grid>
          </Box>

          {/* Mật khẩu */}
          <Box bg={bg} borderRadius="16px" border={`1px solid ${isDark ? DARK.ink5 : "#f1f5f9"}`}
            boxShadow={isDark ? "0 1px 4px rgba(0,0,0,.3)" : "0 1px 4px rgba(0,0,0,0.04)"}
            p={{ base: "16px", md: "20px" }}
          >
            <SectionTitle label="Bảo mật" isDark={isDark} />
            <Box>
              <Text sx={label}>{isAdd ? "Mật khẩu *" : "Mật khẩu mới"}</Text>
              <Input {...styles} type="password" placeholder={isAdd ? "Tối thiểu 8 ký tự" : "Để trống nếu không muốn thay đổi"}
                value={form.PasswordHash} onChange={(e) => set("PasswordHash", e.target.value)} 
                required={isAdd} minLength={isAdd ? 8 : undefined} />
              {!isAdd && <Text fontSize="10.5px" color={isDark ? DARK.ink4 : "#94a3b8"} mt="2px">
                💡 Để trống nếu không muốn thay đổi mật khẩu
              </Text>}
            </Box>
          </Box>

          {/* Trạng thái */}
          <Box bg={bg} borderRadius="16px" border={`1px solid ${isDark ? DARK.ink5 : "#f1f5f9"}`}
            boxShadow={isDark ? "0 1px 4px rgba(0,0,0,.3)" : "0 1px 4px rgba(0,0,0,0.04)"}
            p={{ base: "16px", md: "20px" }}
          >
            <SectionTitle label="Trạng thái tài khoản" isDark={isDark} />
            <Flex gap="10px">
              {statusOptions.map((s) => {
                const active = form.Status === s.value;
                return (
                  <Flex key={s.value} flex="1" align="center" gap="8px"
                    p="10px 14px" borderRadius="10px" cursor="pointer"
                    bg={active ? `${s.color}15` : (isDark ? DARK.ink6 : "#f8fafc")}
                    border={`1.5px solid ${active ? s.color : (isDark ? DARK.ink5 : "#e2e8f0")}`}
                    onClick={() => set("Status", s.value)}
                    transition="all 0.15s"
                    _hover={{ border: `1.5px solid ${s.color}` }}
                  >
                    <Box w="8px" h="8px" borderRadius="full" bg={active ? s.color : (isDark ? DARK.ink4 : "#cbd5e1")} />
                    <Text fontSize="12.5px" fontWeight="700" color={active ? s.color : (isDark ? DARK.ink4 : "#94a3b8")}>
                      {s.label}
                    </Text>
                  </Flex>
                );
              })}
            </Flex>
          </Box>
        </Flex>

        {/* Sidebar - Preview */}
        <Flex direction="column" gap="14px">
          <Box bg={bg} borderRadius="16px" border={`1px solid ${isDark ? DARK.ink5 : "#f1f5f9"}`}
            boxShadow={isDark ? "0 1px 4px rgba(0,0,0,.3)" : "0 1px 4px rgba(0,0,0,0.04)"}
            p={{ base: "16px", md: "18px" }}
          >
            <SectionTitle label="Xem trước" isDark={isDark} />
            <Box borderRadius="12px" border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #f1f5f9"} overflow="hidden">
              <Box p="16px" textAlign="center">
                <Box w="64px" h="64px" borderRadius="full" mx="auto" mb="12px"
                  bg="linear-gradient(135deg,#f97316,#fb923c)"
                  display="flex" alignItems="center" justifyContent="center"
                >
                  <Icon as={MdPerson} boxSize="28px" color="white" />
                </Box>
                <Text fontSize="14px" fontWeight="800" color={ink}>{form.FullName || "Tên người dùng"}</Text>
                <Text fontSize="11px" color={isDark ? DARK.ink4 : "#94a3b8"} mt="2px">{form.Email || "email@example.com"}</Text>
                <Flex justify="center" gap="6px" mt="8px" flexWrap="wrap">
                  <Box px="8px" py="2px" borderRadius="6px" bg="#fff7ed" border="1px solid #fed7aa">
                    <Text fontSize="10px" fontWeight="700" color="#f97316">
                      {roles.find(r => r.RoleId === form.RoleId)?.RoleName || "User"}
                    </Text>
                  </Box>
                  <Box px="8px" py="2px" borderRadius="6px" 
                    bg={form.Status === "Active" ? "#ecfdf5" : "#fef2f2"}
                    border={`1px solid ${form.Status === "Active" ? "#6ee7b7" : "#fca5a5"}`}
                  >
                    <Text fontSize="10px" fontWeight="700" 
                      color={form.Status === "Active" ? "#059669" : "#dc2626"}>
                      {statusOptions.find(s => s.value === form.Status)?.label || "Hoạt động"}
                    </Text>
                  </Box>
                </Flex>
              </Box>
            </Box>
          </Box>

          <Box bg={bg} borderRadius="16px" border={`1px solid ${isDark ? DARK.ink5 : "#f1f5f9"}`}
            boxShadow={isDark ? "0 1px 4px rgba(0,0,0,.3)" : "0 1px 4px rgba(0,0,0,0.04)"}
            p={{ base: "16px", md: "18px" }}
          >
            <SectionTitle label="Lưu ý" isDark={isDark} />
            <Text fontSize="12px" color={isDark ? DARK.ink4 : "#94a3b8"} lineHeight="1.8">
              <Icon as={MdCheckCircle} boxSize="12px" color="#10b981" mr="6px" />
              Kiểm tra email và số điện thoại trước khi lưu<br />
              <Icon as={MdCheckCircle} boxSize="12px" color="#10b981" mr="6px" />
              Mật khẩu tối thiểu 8 ký tự<br />
              <Icon as={MdCheckCircle} boxSize="12px" color="#10b981" mr="6px" />
              Cân nhắc kỹ khi thay đổi vai trò và trạng thái
            </Text>
          </Box>
        </Flex>
      </Grid>

      {/* Footer Actions */}
      <Box bg={bg} borderRadius="14px" border={`1px solid ${isDark ? DARK.ink5 : "#f1f5f9"}`}
        boxShadow={isDark ? "0 1px 4px rgba(0,0,0,.3)" : "0 1px 4px rgba(0,0,0,0.04)"}
        p={{ base: "14px 16px", md: "16px 20px" }} mt="16px"
        position={{ base: "sticky", md: "static" }} bottom={{ base: "0", md: "auto" }} zIndex="10"
      >
        <Flex justify={{ base: "stretch", md: "flex-end" }} gap="10px">
          <Button flex={{ base: "1", md: "none" }} h={{ base: "46px", md: "42px" }} px="22px"
            variant="ghost" color={isDark ? DARK.ink3 : "#64748b"} borderRadius="10px" fontWeight="600" fontSize="13px"
            border={isDark ? `1.5px solid ${DARK.ink5}` : "1.5px solid #e2e8f0"}
            _hover={{ bg: isDark ? DARK.ink6 : "#f8fafc" }}
            leftIcon={<Icon as={MdClose} />} onClick={onCancel} isDisabled={isSubmitting}
          >Hủy bỏ</Button>
          <Button flex={{ base: "2", md: "none" }} h={{ base: "46px", md: "42px" }} px="28px"
            borderRadius="10px" fontWeight="700" fontSize="13px"
            bg="linear-gradient(135deg, #f97316 0%, #fb923c 60%, #fbbf24 100%)"
            color="white" boxShadow="0 4px 16px rgba(249,115,22,0.35)"
            _hover={{ boxShadow: "0 8px 24px rgba(249,115,22,0.45)", transform: "translateY(-1px)" }}
            _active={{ transform: "translateY(0)" }} transition="all 0.2s"
            leftIcon={<Icon as={FaUserPlus} />} onClick={handleSubmit} isLoading={isSubmitting}
            loadingText={isAdd ? "Đang thêm..." : "Đang lưu..."}
          >{isAdd ? "Thêm người dùng" : "Lưu thay đổi"}</Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default UserForm;