// src/views/admin/quanlynguoidung/components/AddUserModal.jsx

import React, { useState, useCallback, useMemo, memo } from "react";
import {
  Box, Flex, Text, Button, Icon, Grid, Input, Select,
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, ModalFooter, ModalCloseButton,
} from "@chakra-ui/react";
import {
  MdPerson, MdEmail, MdPhone, MdLock, MdCalendarToday,
  MdCheckCircle, MdClose, MdArrowBack,
} from "react-icons/md";
import { FaUserPlus, FaVenusMars, FaUserShield } from "react-icons/fa";
import SectionTitle from "./shared/SectionTitle";
import { DARK, GENDER_OPTIONS, EMPTY_USER } from "../constants";
import { scaleIn, shimmer } from "./shared/animations";
import { inputSx } from "./UserForm";

// ✅ Tách input riêng để tránh re-render toàn bộ
const FormInput = memo(({ label, name, value, onChange, error, type = "text", placeholder, isRequired, isDark }) => {
  const handleChange = useCallback((e) => {
    onChange(name, e.target.value);
  }, [name, onChange]);

  return (
    <Box>
      <Text fontSize="10.5px" fontWeight="800" color={isDark ? DARK.ink3 : "#64748b"}
        letterSpacing="0.9px" textTransform="uppercase" mb="7px">
        {label} {isRequired && "*"}
      </Text>
      <Input 
        {...inputSx(isDark)} 
        type={type} 
        placeholder={placeholder}
        value={value} 
        onChange={handleChange}
        borderColor={error ? "#fca5a5" : undefined}
      />
      {error && <Text fontSize="11px" color="#ef4444" mt="1">{error}</Text>}
    </Box>
  );
});

// ✅ Tách select riêng
const FormSelect = memo(({ label, name, value, onChange, options, isDark, placeholder, error }) => {
  const handleChange = useCallback((e) => {
    onChange(name, e.target.value);
  }, [name, onChange]);

  return (
    <Box>
      <Text fontSize="10.5px" fontWeight="800" color={isDark ? DARK.ink3 : "#64748b"}
        letterSpacing="0.9px" textTransform="uppercase" mb="7px">{label}</Text>
      <Select {...inputSx(isDark)} value={value} onChange={handleChange}>
        <option value="">{placeholder || "-- Chọn --"}</option>
        {options.map((opt) => (
          <option key={opt.value || opt} value={opt.value || opt}>
            {opt.label || opt}
          </option>
        ))}
      </Select>
      {error && <Text fontSize="11px" color="#ef4444" mt="1">{error}</Text>}
    </Box>
  );
});

// ✅ Tách Status Options
const StatusOptions = memo(({ value, onChange, isDark }) => {
  const statusOptions = [
    { value: "Active", label: "Hoạt động", color: "#10b981" },
    { value: "Inactive", label: "Khóa", color: "#f59e0b" },
    { value: "Banned", label: "Cấm", color: "#ef4444" },
  ];

  return (
    <Flex gap="10px">
      {statusOptions.map((s) => {
        const active = value === s.value;
        return (
          <Flex key={s.value} flex="1" align="center" gap="8px"
            p="10px 14px" borderRadius="10px" cursor="pointer"
            bg={active ? `${s.color}15` : (isDark ? DARK.ink6 : "#f8fafc")}
            border={`1.5px solid ${active ? s.color : (isDark ? DARK.ink5 : "#e2e8f0")}`}
            onClick={() => onChange("Status", s.value)}
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
  );
});

const AddUserModal = ({ isOpen, onClose, onAdd, roles, isDark, isSubmitting }) => {
  const [form, setForm] = useState({ ...EMPTY_USER });
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);

  // ✅ Sử dụng useCallback để tránh tạo hàm mới mỗi lần render
  const setField = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  }, []);

  const validate = useCallback(() => {
    const e = {};
    if (!form.FullName.trim()) e.FullName = "Họ tên không được để trống";
    if (!form.Email.trim()) e.Email = "Email không được để trống";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.Email)) e.Email = "Email không hợp lệ";
    if (!form.PhoneNumber.trim()) e.PhoneNumber = "SĐT không được để trống";
    else if (!/^(0|\+84)\d{9}$/.test(form.PhoneNumber.replace(/\s/g,""))) e.PhoneNumber = "SĐT không hợp lệ";
    if (!form.PasswordHash) e.PasswordHash = "Mật khẩu không được để trống";
    else if (form.PasswordHash.length < 8) e.PasswordHash = "Mật khẩu tối thiểu 8 ký tự";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [form]);

  const handleSubmit = useCallback(() => {
    if (!validate()) return;
    onAdd(form);
    setStep(2);
  }, [validate, onAdd, form]);

  const handleClose = useCallback(() => {
    setForm({ ...EMPTY_USER });
    setErrors({});
    setStep(1);
    onClose();
  }, [onClose]);

  // ✅ Memo hóa giá trị để tránh re-render
  const bg = useMemo(() => isDark ? DARK.bgCard : "white", [isDark]);
  const ink = useMemo(() => isDark ? DARK.ink : "#0f172a", [isDark]);
  const ink3 = useMemo(() => isDark ? DARK.ink3 : "#64748b", [isDark]);
  const ink4 = useMemo(() => isDark ? DARK.ink4 : "#94a3b8", [isDark]);
  const ink5 = useMemo(() => isDark ? DARK.ink5 : "#e2e8f0", [isDark]);
  const ink6 = useMemo(() => isDark ? DARK.ink6 : "#f1f5f9", [isDark]);

  const statusOptions = useMemo(() => [
    { value: "Active", label: "Hoạt động", color: "#10b981" },
    { value: "Inactive", label: "Khóa", color: "#f59e0b" },
    { value: "Banned", label: "Cấm", color: "#ef4444" },
  ], []);

  const selectedRoleName = useMemo(() => {
    return roles.find(r => r.RoleId === form.RoleId)?.RoleName || "User";
  }, [roles, form.RoleId]);

  // ✅ Render preview
  const renderPreview = useCallback(() => (
    <Flex align="center" gap="16px" p="14px 16px" borderRadius="14px"
      bg={isDark ? DARK.ink6 : "#f8fafc"} border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #f1f5f9"} mb="20px"
    >
      <Box w="56px" h="56px" borderRadius="14px" overflow="hidden" flexShrink="0"
        border="3px solid #fed7aa" bg="linear-gradient(135deg,#f97316,#fb923c)"
        display="flex" alignItems="center" justifyContent="center"
      >
        <Icon as={MdPerson} boxSize="28px" color="white" />
      </Box>
      <Box flex="1" minW="0">
        <Text fontSize="14px" fontWeight="700" color={ink} noOfLines={1}>
          {form.FullName || "Tên người dùng"}
        </Text>
        <Text fontSize="11px" color={isDark ? DARK.ink4 : "#94a3b8"} mt="2px" noOfLines={1}>
          {form.Email || "email@example.com"}
        </Text>
        <Flex gap="6px" mt="6px" flexWrap="wrap">
          <Box px="8px" py="2px" borderRadius="6px" bg="#fff7ed" border="1px solid #fed7aa">
            <Text fontSize="10px" fontWeight="700" color="#f97316">{selectedRoleName}</Text>
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
    </Flex>
  ), [form, isDark, ink, selectedRoleName, statusOptions]);

  // ✅ Render sidebar preview
  const renderSidebarPreview = useCallback(() => (
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
            <Text fontSize="10px" fontWeight="700" color="#f97316">{selectedRoleName}</Text>
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
  ), [form, isDark, ink, selectedRoleName, statusOptions]);

  // Nếu đang ở step 2 (thành công)
  if (step === 2) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} isCentered size="xl" scrollBehavior="inside">
        <ModalOverlay bg="rgba(0,0,0,0.45)" backdropFilter="blur(4px)" />
        <ModalContent 
          borderRadius="20px" 
          border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #fed7aa"} 
          overflow="hidden" 
          mx="16px" 
          maxW="900px"
          maxH="90vh" 
          bg={bg}
        >
          <Box py="48px" textAlign="center" sx={{ animation: `${scaleIn} 0.35s ease both` }}>
            <Box w="72px" h="72px" borderRadius="full"
              bg="linear-gradient(135deg,#ecfdf5,#d1fae5)"
              border="3px solid #6ee7b7"
              display="flex" alignItems="center" justifyContent="center"
              mx="auto" mb="18px"
              boxShadow="0 8px 24px rgba(16,185,129,0.25)"
            >
              <Icon as={MdCheckCircle} boxSize="34px" color="#059669" />
            </Box>
            <Text fontSize="20px" fontWeight="800" color={ink} mb="6px">Thêm thành công!</Text>
            <Text fontSize="13px" color={isDark ? DARK.ink4 : "#64748b"} mb="6px">Tài khoản đã được tạo cho</Text>
            <Text fontSize="15px" fontWeight="700" color="#f97316" mb="24px">{form.FullName}</Text>
            <Flex justify="center" gap="10px" flexWrap="wrap">
              <Button h="40px" px="20px" borderRadius="10px" fontWeight="700" fontSize="13px"
                bg="linear-gradient(135deg,#f97316,#fb923c)" color="white"
                boxShadow="0 4px 14px rgba(249,115,22,0.35)"
                _hover={{ opacity: 0.88 }}
                onClick={() => { setForm({ ...EMPTY_USER }); setErrors({}); setStep(1); }}
              >Thêm người dùng khác</Button>
              <Button h="40px" px="20px" borderRadius="10px" fontWeight="600" fontSize="13px"
                variant="ghost" color={isDark ? DARK.ink3 : "#64748b"} 
                border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #e2e8f0"}
                onClick={handleClose}
              >Đóng</Button>
            </Flex>
          </Box>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered size="xl" scrollBehavior="inside">
      <ModalOverlay bg="rgba(0,0,0,0.45)" backdropFilter="blur(4px)" />
      <ModalContent 
        borderRadius="20px" 
        border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #fed7aa"} 
        overflow="hidden" 
        mx="16px" 
        maxW="900px"
        maxH="90vh" 
        bg={bg}
      >
        <Box h="4px" bg="linear-gradient(90deg,#f97316,#fbbf24,#f97316)"
          bgSize="200% 100%" sx={{ animation: `${shimmer} 3s linear infinite` }}
        />

        <ModalHeader pt="20px" pb="6px" fontSize="16px" fontWeight="800" color={ink}>
          <Flex align="center" gap="12px">
            <Box w="38px" h="38px" borderRadius="11px"
              bg="linear-gradient(135deg,#f97316,#fb923c)"
              display="flex" alignItems="center" justifyContent="center"
              boxShadow="0 4px 12px rgba(249,115,22,0.35)"
            ><Icon as={FaUserPlus} boxSize="16px" color="white" /></Box>
            <Box>
              <Text fontSize="18px" fontWeight="800" color={ink}>Thêm người dùng mới</Text>
              <Text fontSize="12px" color={isDark ? DARK.ink4 : "#94a3b8"}>
                Tạo tài khoản người dùng mới cho hệ thống
              </Text>
            </Box>
          </Flex>
        </ModalHeader>
        <ModalCloseButton top="18px" right="16px" color={isDark ? DARK.ink4 : "#94a3b8"} />

        <ModalBody pb="6px" overflowY="auto">
          {renderPreview()}

          <Grid templateColumns={{ base: "1fr", lg: "1fr 300px" }} gap="16px">
            {/* Left Column - Form */}
            <Flex direction="column" gap="14px">
              {/* Thông tin cá nhân */}
              <Box bg={bg} borderRadius="16px" border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #f1f5f9"}
                boxShadow={isDark ? "0 1px 4px rgba(0,0,0,.3)" : "0 1px 4px rgba(0,0,0,0.04)"}
                p={{ base: "16px", md: "20px" }}
              >
                <SectionTitle label="Thông tin cá nhân" isDark={isDark} />
                <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="14px" mb="14px">
                  <FormInput
                    label="Họ và tên"
                    name="FullName"
                    value={form.FullName}
                    onChange={setField}
                    error={errors.FullName}
                    placeholder="Nhập họ và tên"
                    isRequired
                    isDark={isDark}
                  />
                  <FormInput
                    label="Email"
                    name="Email"
                    value={form.Email}
                    onChange={setField}
                    error={errors.Email}
                    type="email"
                    placeholder="email@example.com"
                    isRequired
                    isDark={isDark}
                  />
                </Grid>
                <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="14px">
                  <FormInput
                    label="Số điện thoại"
                    name="PhoneNumber"
                    value={form.PhoneNumber}
                    onChange={setField}
                    error={errors.PhoneNumber}
                    placeholder="0912 345 678"
                    isDark={isDark}
                  />
                  <FormInput
                    label="Ngày sinh"
                    name="DateOfBirth"
                    value={form.DateOfBirth}
                    onChange={setField}
                    type="date"
                    placeholder=""
                    isDark={isDark}
                  />
                </Grid>
              </Box>

              {/* Giới tính & Vai trò */}
              <Box bg={bg} borderRadius="16px" border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #f1f5f9"}
                boxShadow={isDark ? "0 1px 4px rgba(0,0,0,.3)" : "0 1px 4px rgba(0,0,0,0.04)"}
                p={{ base: "16px", md: "20px" }}
              >
                <SectionTitle label="Giới tính & Vai trò" isDark={isDark} />
                <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="14px">
                  <FormSelect
                    label="Giới tính"
                    name="Gender"
                    value={form.Gender}
                    onChange={setField}
                    options={GENDER_OPTIONS.map(g => ({ 
                      value: g, 
                      label: g === "Male" ? "Nam" : g === "Female" ? "Nữ" : "Khác" 
                    }))}
                    placeholder="-- Chọn giới tính --"
                    isDark={isDark}
                  />
                  <FormSelect
                    label="Vai trò"
                    name="RoleId"
                    value={form.RoleId}
                    onChange={setField}
                    options={roles.map(r => ({ value: r.RoleId, label: r.RoleName }))}
                    placeholder="-- Chọn vai trò --"
                    isDark={isDark}
                  />
                </Grid>
              </Box>

              {/* Bảo mật */}
              <Box bg={bg} borderRadius="16px" border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #f1f5f9"}
                boxShadow={isDark ? "0 1px 4px rgba(0,0,0,.3)" : "0 1px 4px rgba(0,0,0,0.04)"}
                p={{ base: "16px", md: "20px" }}
              >
                <SectionTitle label="Bảo mật" isDark={isDark} />
                <FormInput
                  label="Mật khẩu"
                  name="PasswordHash"
                  value={form.PasswordHash}
                  onChange={setField}
                  error={errors.PasswordHash}
                  type="password"
                  placeholder="Tối thiểu 8 ký tự"
                  isRequired
                  isDark={isDark}
                />
              </Box>

              {/* Trạng thái tài khoản */}
              <Box bg={bg} borderRadius="16px" border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #f1f5f9"}
                boxShadow={isDark ? "0 1px 4px rgba(0,0,0,.3)" : "0 1px 4px rgba(0,0,0,0.04)"}
                p={{ base: "16px", md: "20px" }}
              >
                <SectionTitle label="Trạng thái tài khoản" isDark={isDark} />
                <StatusOptions value={form.Status} onChange={setField} isDark={isDark} />
              </Box>
            </Flex>

            {/* Right Column - Sidebar */}
            <Flex direction="column" gap="14px">
              <Box bg={bg} borderRadius="16px" border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #f1f5f9"}
                boxShadow={isDark ? "0 1px 4px rgba(0,0,0,.3)" : "0 1px 4px rgba(0,0,0,0.04)"}
                p={{ base: "16px", md: "18px" }}
              >
                <SectionTitle label="Xem trước" isDark={isDark} />
                {renderSidebarPreview()}
              </Box>

              <Box bg={bg} borderRadius="16px" border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #f1f5f9"}
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
        </ModalBody>

        <ModalFooter gap="10px" pt="14px" pb="20px" borderTop={isDark ? `1px solid ${DARK.ink5}` : "1px solid #f1f5f9"}>
          <Button flex="1" h="42px" px="22px" borderRadius="10px" fontWeight="600" fontSize="13px"
            variant="ghost" color={isDark ? DARK.ink3 : "#64748b"} 
            border={isDark ? `1.5px solid ${DARK.ink5}` : "1.5px solid #e2e8f0"}
            leftIcon={<Icon as={MdClose} />}
            _hover={{ bg: isDark ? DARK.ink6 : "#f8fafc" }}
            onClick={handleClose}
          >Hủy bỏ</Button>
          <Button flex="2" h="42px" px="28px" borderRadius="10px" fontWeight="700" fontSize="13px"
            bg="linear-gradient(135deg,#f97316,#fb923c)" color="white"
            boxShadow="0 4px 14px rgba(249,115,22,0.35)"
            leftIcon={<Icon as={FaUserPlus} />}
            _hover={{ opacity: 0.88, transform: "translateY(-1px)" }} transition="all 0.2s"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            loadingText="Đang thêm..."
          >Tạo tài khoản</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default memo(AddUserModal);