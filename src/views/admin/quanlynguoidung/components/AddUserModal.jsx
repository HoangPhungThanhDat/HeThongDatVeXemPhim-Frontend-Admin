// src/views/admin/quanlynguoidung/components/AddUserModal.jsx

import React, { useState } from "react";
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

const AddUserModal = ({ isOpen, onClose, onAdd, roles, isDark, isSubmitting }) => {
  const [form, setForm] = useState({ ...EMPTY_USER });
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);

  const set = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: "" }));
  };

  const validate = () => {
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
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onAdd(form);
    setStep(2);
  };

  const handleClose = () => {
    setForm({ ...EMPTY_USER });
    setErrors({});
    setStep(1);
    onClose();
  };

  const bg = isDark ? DARK.bgCard : "white";
  const ink = isDark ? DARK.ink : "#0f172a";
  const ink3 = isDark ? DARK.ink3 : "#64748b";
  const ink4 = isDark ? DARK.ink4 : "#94a3b8";
  const ink5 = isDark ? DARK.ink5 : "#e2e8f0";
  const ink6 = isDark ? DARK.ink6 : "#f1f5f9";

  const statusOptions = [
    { value: "Active", label: "Hoạt động", color: "#10b981" },
    { value: "Inactive", label: "Khóa", color: "#f59e0b" },
    { value: "Banned", label: "Cấm", color: "#ef4444" },
  ];

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

        {step === 2 ? (
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
        ) : (
          <>
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
              {/* ✅ Preview Avatar - Giống form sửa */}
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
              </Flex>

              {/* ✅ Layout 2 cột giống UserForm */}
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
                      <Box>
                        <Text fontSize="10.5px" fontWeight="800" color={isDark ? DARK.ink3 : "#64748b"}
                          letterSpacing="0.9px" textTransform="uppercase" mb="7px">Họ và tên *</Text>
                        <Input {...inputSx(isDark)} placeholder="Nhập họ và tên"
                          value={form.FullName} onChange={(e) => set("FullName", e.target.value)}
                          borderColor={errors.FullName ? "#fca5a5" : undefined}
                        />
                        {errors.FullName && <Text fontSize="11px" color="#ef4444" mt="1">{errors.FullName}</Text>}
                      </Box>
                      <Box>
                        <Text fontSize="10.5px" fontWeight="800" color={isDark ? DARK.ink3 : "#64748b"}
                          letterSpacing="0.9px" textTransform="uppercase" mb="7px">Email *</Text>
                        <Input {...inputSx(isDark)} type="email" placeholder="email@example.com"
                          value={form.Email} onChange={(e) => set("Email", e.target.value)}
                          borderColor={errors.Email ? "#fca5a5" : undefined}
                        />
                        {errors.Email && <Text fontSize="11px" color="#ef4444" mt="1">{errors.Email}</Text>}
                      </Box>
                    </Grid>
                    <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="14px">
                      <Box>
                        <Text fontSize="10.5px" fontWeight="800" color={isDark ? DARK.ink3 : "#64748b"}
                          letterSpacing="0.9px" textTransform="uppercase" mb="7px">Số điện thoại</Text>
                        <Input {...inputSx(isDark)} placeholder="0912 345 678"
                          value={form.PhoneNumber} onChange={(e) => set("PhoneNumber", e.target.value)}
                          borderColor={errors.PhoneNumber ? "#fca5a5" : undefined}
                        />
                        {errors.PhoneNumber && <Text fontSize="11px" color="#ef4444" mt="1">{errors.PhoneNumber}</Text>}
                      </Box>
                      <Box>
                        <Text fontSize="10.5px" fontWeight="800" color={isDark ? DARK.ink3 : "#64748b"}
                          letterSpacing="0.9px" textTransform="uppercase" mb="7px">Ngày sinh</Text>
                        <Input {...inputSx(isDark)} type="date"
                          value={form.DateOfBirth} onChange={(e) => set("DateOfBirth", e.target.value)} />
                      </Box>
                    </Grid>
                  </Box>

                  {/* Giới tính & Vai trò */}
                  <Box bg={bg} borderRadius="16px" border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #f1f5f9"}
                    boxShadow={isDark ? "0 1px 4px rgba(0,0,0,.3)" : "0 1px 4px rgba(0,0,0,0.04)"}
                    p={{ base: "16px", md: "20px" }}
                  >
                    <SectionTitle label="Giới tính & Vai trò" isDark={isDark} />
                    <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="14px">
                      <Box>
                        <Text fontSize="10.5px" fontWeight="800" color={isDark ? DARK.ink3 : "#64748b"}
                          letterSpacing="0.9px" textTransform="uppercase" mb="7px">Giới tính</Text>
                        <Select {...inputSx(isDark)} value={form.Gender} onChange={(e) => set("Gender", e.target.value)}>
                          <option value="">-- Chọn giới tính --</option>
                          {GENDER_OPTIONS.map((g) => (
                            <option key={g} value={g}>{g === "Male" ? "Nam" : g === "Female" ? "Nữ" : "Khác"}</option>
                          ))}
                        </Select>
                      </Box>
                      <Box>
                        <Text fontSize="10.5px" fontWeight="800" color={isDark ? DARK.ink3 : "#64748b"}
                          letterSpacing="0.9px" textTransform="uppercase" mb="7px">Vai trò</Text>
                        <Select {...inputSx(isDark)} value={form.RoleId} onChange={(e) => set("RoleId", Number(e.target.value))}>
                          <option value="">-- Chọn vai trò --</option>
                          {roles.map((r) => <option key={r.RoleId} value={r.RoleId}>{r.RoleName}</option>)}
                        </Select>
                      </Box>
                    </Grid>
                  </Box>

                  {/* Bảo mật */}
                  <Box bg={bg} borderRadius="16px" border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #f1f5f9"}
                    boxShadow={isDark ? "0 1px 4px rgba(0,0,0,.3)" : "0 1px 4px rgba(0,0,0,0.04)"}
                    p={{ base: "16px", md: "20px" }}
                  >
                    <SectionTitle label="Bảo mật" isDark={isDark} />
                    <Box>
                      <Text fontSize="10.5px" fontWeight="800" color={isDark ? DARK.ink3 : "#64748b"}
                        letterSpacing="0.9px" textTransform="uppercase" mb="7px">Mật khẩu *</Text>
                      <Input {...inputSx(isDark)} type="password"
                        placeholder="Tối thiểu 8 ký tự" value={form.PasswordHash} 
                        onChange={(e) => set("PasswordHash", e.target.value)}
                        borderColor={errors.PasswordHash ? "#fca5a5" : undefined}
                      />
                      {errors.PasswordHash && <Text fontSize="11px" color="#ef4444" mt="1">{errors.PasswordHash}</Text>}
                    </Box>
                  </Box>

                  {/* Trạng thái tài khoản */}
                  <Box bg={bg} borderRadius="16px" border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #f1f5f9"}
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

                {/* Right Column - Sidebar giống form sửa */}
                <Flex direction="column" gap="14px">
                  {/* Xem trước */}
                  <Box bg={bg} borderRadius="16px" border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #f1f5f9"}
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

                  {/* Lưu ý */}
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
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AddUserModal;