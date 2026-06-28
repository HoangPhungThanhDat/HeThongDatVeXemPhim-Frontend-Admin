// src/views/admin/quanlyrapchieu/components/AddCinemaPage.jsx

import React, { useState } from "react";
import {
  Box, Flex, Text, Button, Icon, Grid, Input, Select,
  Textarea, useColorMode, useToast,
} from "@chakra-ui/react";
import {
  MdArrowBack, MdClose, MdCheckCircle, MdLocationOn,
  MdPhone, MdAccessTime, MdInfo, MdImage,
} from "react-icons/md";
import { FaBuilding, FaUser, FaEnvelope } from "react-icons/fa";
import SectionTitle from "./shared/SectionTitle";
import { DARK } from "../constants";
import { scaleIn } from "./shared/animations";

const inputStyle = (isDark) => ({
  bg: isDark ? "#1e293b" : "#fafafa",
  border: isDark ? `1.5px solid #334155` : "1.5px solid #e8edf3",
  borderRadius: "10px",
  color: isDark ? "#f1f5f9" : "#1a202c",
  fontSize: "14px",
  fontWeight: "500",
  px: "14px",
  h: "44px",
  _placeholder: { color: isDark ? "#64748b" : "#b0bac8", fontWeight: "400" },
  _focus: { border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.10)", bg: isDark ? "#1e293b" : "#fff" },
  _hover: { border: "1.5px solid #f97316", bg: isDark ? "#1e293b" : "#fff" },
  transition: "all 0.2s ease",
});

const labelStyle = (isDark) => ({
  fontSize: "10.5px",
  fontWeight: "800",
  letterSpacing: "0.9px",
  textTransform: "uppercase",
  color: isDark ? "#94a3b8" : "#64748b",
  mb: "7px",
  display: "block",
});

const AddCinemaPage = ({ onCancel, onSave, isSubmitting, isDark }) => {
  const toast = useToast();
  const [form, setForm] = useState({
    Name: "",
    Address: "",
    City: "",
    Phone: "",
    Email: "",
    OpenTime: "08:00 – 23:00",
    Status: "Active",
    Description: "",
    Manager: "",
    ImageUrl: "",
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const styles = inputStyle(isDark);
  const label = labelStyle(isDark);
  const bg = isDark ? "#1e293b" : "white";
  const border = isDark ? "#334155" : "#f1f5f9";
  const textColor = isDark ? "#f1f5f9" : "#0f172a";
  const subColor = isDark ? "#94a3b8" : "#64748b";

  const handleSubmit = () => {
    if (!form.Name || !form.Address) {
      toast({
        title: "Vui lòng nhập đầy đủ thông tin",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
    onSave(form);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      set("ImageUrl", URL.createObjectURL(file));
      set("ImageFile", file);
    }
  };

  return (
    <Box sx={{ animation: `${scaleIn} 0.3s ease both}` }}>
      {/* Header */}
      <Flex align="center" gap="12px" mb="20px">
        <Button leftIcon={<Icon as={MdArrowBack} />} variant="ghost"
          color={subColor} borderRadius="10px" h="38px" fontSize="13px" fontWeight="600"
          border={`1.5px solid ${isDark ? "#334155" : "#e2e8f0"}`} 
          _hover={{ bg: isDark ? "#2d3748" : "#f8fafc" }} 
          onClick={onCancel}>
          Quay lại
        </Button>
        <Box>
          <Text fontSize="20px" fontWeight="800" color={textColor} letterSpacing="-0.3px">
            Thêm rạp chiếu mới
          </Text>
          <Text fontSize="12px" color={subColor} mt="2px">
            Tạo rạp chiếu phim mới cho hệ thống
          </Text>
        </Box>
      </Flex>

      <Grid templateColumns={{ base: "1fr", lg: "1fr 320px" }} gap="16px">
        <Flex direction="column" gap="14px">
          {/* Thông tin cơ bản */}
          <Box bg={bg} borderRadius="16px" border={`1px solid ${border}`}
            boxShadow={isDark ? "0 1px 4px rgba(0,0,0,0.2)" : "0 1px 4px rgba(0,0,0,0.04)"} p="20px">
            <SectionTitle label="Thông tin cơ bản" />
            <Flex direction="column" gap="14px">
              <Box>
                <Text sx={label}>Tên rạp *</Text>
                <Input {...styles} placeholder="VD: Gấu Phim - Buôn Ma Thuột"
                  value={form.Name} onChange={(e) => set("Name", e.target.value)} />
              </Box>
              <Box>
                <Text sx={label}>Địa chỉ *</Text>
                <Input {...styles} placeholder="Địa chỉ đầy đủ"
                  value={form.Address} onChange={(e) => set("Address", e.target.value)} />
              </Box>
              <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap="14px">
                <Box>
                  <Text sx={label}>Thành phố</Text>
                  <Input {...styles} placeholder="VD: Buôn Ma Thuột"
                    value={form.City} onChange={(e) => set("City", e.target.value)} />
                </Box>
                <Box>
                  <Text sx={label}>Hotline</Text>
                  <Input {...styles} placeholder="028 xxxx xxxx"
                    value={form.Phone} onChange={(e) => set("Phone", e.target.value)} />
                </Box>
              </Grid>
              <Box>
                <Text sx={label}>Email liên hệ</Text>
                <Input {...styles} type="email" placeholder="gauphim@gmail.com"
                  value={form.Email} onChange={(e) => set("Email", e.target.value)} />
              </Box>
              <Box>
                <Text sx={label}>Giờ mở cửa</Text>
                <Input {...styles} placeholder="08:00 – 23:00"
                  value={form.OpenTime} onChange={(e) => set("OpenTime", e.target.value)} />
              </Box>
            </Flex>
          </Box>

          {/* Trạng thái & Mô tả */}
          <Box bg={bg} borderRadius="16px" border={`1px solid ${border}`}
            boxShadow={isDark ? "0 1px 4px rgba(0,0,0,0.2)" : "0 1px 4px rgba(0,0,0,0.04)"} p="20px">
            <SectionTitle label="Trạng thái & Mô tả" />
            <Box mb="14px">
              <Text sx={label}>Trạng thái hoạt động</Text>
              <Select {...styles} value={form.Status} onChange={(e) => set("Status", e.target.value)}>
                <option value="Active">✅ Hoạt động</option>
                <option value="Inactive">❌ Khóa</option>
              </Select>
            </Box>
            <Box mb="14px">
              <Text sx={label}>Quản lý rạp</Text>
              <Input {...styles} placeholder="Họ tên người quản lý"
                value={form.Manager} onChange={(e) => set("Manager", e.target.value)} />
            </Box>
            <Box>
              <Text sx={label}>Mô tả rạp</Text>
              <Textarea
                bg={isDark ? "#1e293b" : "#fafafa"}
                border={`1.5px solid ${isDark ? "#334155" : "#e8edf3"}`}
                borderRadius="10px"
                color={isDark ? "#f1f5f9" : "#1a202c"}
                fontSize="14px"
                fontWeight="500"
                px="14px"
                py="10px"
                _placeholder={{ color: isDark ? "#64748b" : "#b0bac8" }}
                _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.10)", bg: isDark ? "#1e293b" : "#fff" }}
                _hover={{ border: "1.5px solid #f97316" }}
                transition="all 0.2s"
                rows={4} placeholder="Mô tả về rạp chiếu..."
                value={form.Description} onChange={(e) => set("Description", e.target.value)} />
            </Box>
          </Box>
        </Flex>

        <Flex direction="column" gap="14px">
          {/* Ảnh rạp */}
          <Box bg={bg} borderRadius="16px" border={`1px solid ${border}`}
            boxShadow={isDark ? "0 1px 4px rgba(0,0,0,0.2)" : "0 1px 4px rgba(0,0,0,0.04)"} p="18px">
            <SectionTitle label="Ảnh rạp" />
            
            {/* Preview ảnh */}
            <Box h="160px" borderRadius="12px" overflow="hidden" mb="10px"
              bg={isDark ? "#2d3748" : "#f1f5f9"}
              display="flex" alignItems="center" justifyContent="center"
              border={`2px dashed ${isDark ? "#4a5568" : "#d1d5db"}`}>
              {form.ImageUrl ? (
                <img src={form.ImageUrl} alt="preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <Flex direction="column" align="center" gap="6px" color={isDark ? "#64748b" : "#94a3b8"}>
                  <Icon as={MdImage} boxSize="32px" />
                  <Text fontSize="12px">Chưa có ảnh</Text>
                </Flex>
              )}
            </Box>

            {/* Upload ảnh */}
            <Input
              {...styles}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              p="6px"
            />
            <Text fontSize="10px" color={isDark ? "#64748b" : "#94a3b8"} mt="2px">
              Hỗ trợ định dạng: JPG, PNG, GIF. Dung lượng tối đa 5MB
            </Text>

            <Box mt="10px" p="10px 12px" borderRadius="10px" bg="#fef2f2" border="1px solid #fca5a5">
              <Text fontSize="11px" fontWeight="600" color="#dc2626" lineHeight="1.5">
                Thay đổi ảnh rạp thuộc quyền Admin. Vui lòng liên hệ Admin để cập nhật.
              </Text>
            </Box>
          </Box>

          {/* Lưu ý phân quyền */}
          <Box bg={bg} borderRadius="16px" border={`1px solid ${border}`}
            boxShadow={isDark ? "0 1px 4px rgba(0,0,0,0.2)" : "0 1px 4px rgba(0,0,0,0.04)"} p="18px">
            <SectionTitle label="Lưu ý phân quyền" />
            <Flex direction="column" gap="8px">
              {[
                { ok: true,  txt: "Cập nhật địa chỉ, SĐT, giờ mở cửa" },
                { ok: true,  txt: "Đánh dấu trạng thái phòng bảo trì" },
                { ok: false, txt: "Thêm hoặc xóa rạp (chỉ Admin)" },
                { ok: false, txt: "Chỉnh sửa layout phòng chiếu" },
                { ok: false, txt: "Quản lý nhân viên rạp" },
              ].map(({ ok, txt }) => (
                <Flex key={txt} align="flex-start" gap="7px">
                  <Box w="16px" h="16px" borderRadius="full"
                    bg={ok ? "#ecfdf5" : "#fef2f2"} border={ok ? "1px solid #6ee7b7" : "1px solid #fca5a5"}
                    display="flex" alignItems="center" justifyContent="center" flexShrink="0" mt="1px">
                    <Text fontSize="8px" fontWeight="900" color={ok ? "#059669" : "#dc2626"}>{ok ? "✓" : "✕"}</Text>
                  </Box>
                  <Text fontSize="11.5px" color={ok ? textColor : subColor} fontWeight={ok ? "600" : "500"}>{txt}</Text>
                </Flex>
              ))}
            </Flex>
          </Box>
        </Flex>
      </Grid>

      {/* Footer Actions */}
      <Box bg={bg} borderRadius="14px" border={`1px solid ${border}`}
        boxShadow={isDark ? "0 1px 4px rgba(0,0,0,0.2)" : "0 1px 4px rgba(0,0,0,0.04)"} p="16px 20px" mt="16px">
        <Flex justify="flex-end" gap="10px">
          <Button h="42px" px="22px" variant="ghost" color={subColor} borderRadius="10px"
            fontWeight="600" fontSize="13px" border={`1.5px solid ${isDark ? "#334155" : "#e2e8f0"}`}
            _hover={{ bg: isDark ? "#2d3748" : "#f8fafc" }} transition="all 0.2s"
            leftIcon={<Icon as={MdClose} />} onClick={onCancel}
            isDisabled={isSubmitting}>
            Hủy bỏ
          </Button>
          <Button h="42px" px="28px" borderRadius="10px" fontWeight="700" fontSize="13px"
            bg="linear-gradient(135deg,#f97316 0%,#fb923c 60%,#fbbf24 100%)"
            color="white" boxShadow="0 4px 16px rgba(249,115,22,0.35)"
            _hover={{ boxShadow: "0 8px 24px rgba(249,115,22,0.45)", transform: "translateY(-1px)" }}
            _active={{ transform: "translateY(0)" }} transition="all 0.2s"
            leftIcon={<Icon as={MdCheckCircle} />} onClick={handleSubmit}
            isLoading={isSubmitting}
            loadingText="Đang thêm...">
            Thêm rạp
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default AddCinemaPage;