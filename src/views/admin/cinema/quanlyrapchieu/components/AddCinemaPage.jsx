import React, { useState, useRef } from "react";
import {
  Box, Flex, Text, Button, Icon, Grid, Input, Select,
  Textarea, useColorMode, useToast, Image, Spinner
} from "@chakra-ui/react";
import {
  MdArrowBack, MdClose, MdCheckCircle, MdLocationOn,
  MdPhone, MdAccessTime, MdInfo, MdImage, MdCloudUpload,
  MdDelete
} from "react-icons/md";
import { FaBuilding, FaUser, FaEnvelope } from "react-icons/fa";
import SectionTitle from "./shared/SectionTitle";
import { DARK } from "../constants";
import { scaleIn } from "./shared/animations";

// Màu sắc cho chế độ tối - tông xanh
const DARK_THEME = {
  bg: "#0a1628",
  cardBg: "#0f1f3a",
  border: "#1a3a5c",
  text: "#e8f4f8",
  textSecondary: "#88b4d8",
  labelColor: "#5a8ab5",
  inputBg: "#0a1f35",
  inputBorder: "#1a3a5c",
  hoverBg: "#142d4f",
  accent: "#4a9eff",
  accentLight: "#6ab0ff",
  accentShadow: "rgba(74, 158, 255, 0.25)",
  gradientFrom: "#4a9eff",
  gradientTo: "#6ab0ff",
  noteBg: "#0d2847",
  noteBorder: "rgba(74, 158, 255, 0.2)",
  noteText: "#88b4d8",
  successBg: "rgba(74, 222, 128, 0.12)",
  successBorder: "rgba(74, 222, 128, 0.3)",
  successColor: "#4ade80",
  dangerBg: "rgba(248, 113, 113, 0.12)",
  dangerBorder: "rgba(248, 113, 113, 0.3)",
  dangerColor: "#f87171",
  previewBg: "#0a1f35",
  previewBorder: "#1a3a5c",
};

const inputStyle = (isDark) => ({
  bg: isDark ? DARK_THEME.inputBg : "#fafafa",
  border: isDark ? `1.5px solid ${DARK_THEME.inputBorder}` : "1.5px solid #e8edf3",
  borderRadius: "10px",
  color: isDark ? DARK_THEME.text : "#1a202c",
  fontSize: "14px",
  fontWeight: "500",
  px: "14px",
  h: "44px",
  _placeholder: { color: isDark ? DARK_THEME.labelColor : "#b0bac8", fontWeight: "400" },
  _focus: { 
    border: `1.5px solid ${isDark ? DARK_THEME.accent : "#f97316"}`, 
    boxShadow: isDark 
      ? `0 0 0 3px ${DARK_THEME.accentShadow}` 
      : "0 0 0 3px rgba(249,115,22,0.10)", 
    bg: isDark ? DARK_THEME.inputBg : "#fff" 
  },
  _hover: { 
    border: `1.5px solid ${isDark ? DARK_THEME.accent : "#f97316"}`, 
    bg: isDark ? DARK_THEME.inputBg : "#fff" 
  },
  transition: "all 0.2s ease",
});

const labelStyle = (isDark) => ({
  fontSize: "10.5px",
  fontWeight: "800",
  letterSpacing: "0.9px",
  textTransform: "uppercase",
  color: isDark ? DARK_THEME.labelColor : "#64748b",
  mb: "7px",
  display: "block",
});

const AddCinemaPage = ({ onCancel, onSave, isSubmitting, isDark }) => {
  const toast = useToast();
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

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
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const styles = inputStyle(isDark);
  const label = labelStyle(isDark);
  
  const bg = isDark ? DARK_THEME.cardBg : "white";
  const border = isDark ? DARK_THEME.border : "#f1f5f9";
  const textColor = isDark ? DARK_THEME.text : "#0f172a";
  const subColor = isDark ? DARK_THEME.textSecondary : "#64748b";
  const accentColor = isDark ? DARK_THEME.accent : "#f97316";
  const gradientBg = isDark 
    ? `linear-gradient(135deg, ${DARK_THEME.gradientFrom}, ${DARK_THEME.gradientTo})`
    : "linear-gradient(135deg,#f97316 0%,#fb923c 60%,#fbbf24 100%)";
  const shadowColor = isDark 
    ? `0 4px 16px ${DARK_THEME.accentShadow}`
    : "0 4px 16px rgba(249,115,22,0.35)";
  const shadowHover = isDark 
    ? `0 8px 24px ${DARK_THEME.accentShadow}`
    : "0 8px 24px rgba(249,115,22,0.45)";

  // Xử lý chọn file ảnh
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Vui lòng chọn file ảnh (JPG, PNG, WEBP)",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Ảnh phải nhỏ hơn 5MB",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
    
    setIsUploading(true);
    setImageFile(file);
    
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target.result);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Xóa ảnh
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = () => {
    if (!form.Name || !form.Address) {
      toast({
        title: "Vui lòng nhập tên rạp và địa chỉ",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
    
    const submitData = {
      ...form,
      ImageFile: imageFile,
    };
    onSave(submitData);
  };

  return (
    <Box sx={{ animation: `${scaleIn} 0.3s ease both}` }}>
      {/* Header */}
      <Flex align="center" gap="12px" mb="20px">
        <Button leftIcon={<Icon as={MdArrowBack} />} variant="ghost"
          color={subColor} borderRadius="10px" h="38px" fontSize="13px" fontWeight="600"
          border={`1.5px solid ${isDark ? DARK_THEME.border : "#e2e8f0"}`} 
          _hover={{ bg: isDark ? DARK_THEME.hoverBg : "#f8fafc" }} 
          onClick={onCancel}
          isDisabled={isSubmitting}>
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
            <SectionTitle label="Thông tin cơ bản" isDark={isDark} />
            <Flex direction="column" gap="14px">
              <Box>
                <Text sx={label}>Tên rạp *</Text>
                <Input {...styles} placeholder="VD: Gấu Phim - Buôn Ma Thuột"
                  value={form.Name} onChange={(e) => set("Name", e.target.value)}
                  isDisabled={isSubmitting} />
              </Box>
              <Box>
                <Text sx={label}>Địa chỉ *</Text>
                <Input {...styles} placeholder="Địa chỉ đầy đủ"
                  value={form.Address} onChange={(e) => set("Address", e.target.value)}
                  isDisabled={isSubmitting} />
              </Box>
              <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap="14px">
                <Box>
                  <Text sx={label}>Thành phố</Text>
                  <Input {...styles} placeholder="VD: Buôn Ma Thuột"
                    value={form.City} onChange={(e) => set("City", e.target.value)}
                    isDisabled={isSubmitting} />
                </Box>
                <Box>
                  <Text sx={label}>Hotline</Text>
                  <Input {...styles} placeholder="028 xxxx xxxx"
                    value={form.Phone} onChange={(e) => set("Phone", e.target.value)}
                    isDisabled={isSubmitting} />
                </Box>
              </Grid>
              <Box>
                <Text sx={label}>Email liên hệ</Text>
                <Input {...styles} type="email" placeholder="gauphim@gmail.com"
                  value={form.Email} onChange={(e) => set("Email", e.target.value)}
                  isDisabled={isSubmitting} />
              </Box>
              <Box>
                <Text sx={label}>Giờ mở cửa</Text>
                <Input {...styles} placeholder="08:00 – 23:00"
                  value={form.OpenTime} onChange={(e) => set("OpenTime", e.target.value)}
                  isDisabled={isSubmitting} />
              </Box>
            </Flex>
          </Box>

          {/* Trạng thái & Mô tả */}
          <Box bg={bg} borderRadius="16px" border={`1px solid ${border}`}
            boxShadow={isDark ? "0 1px 4px rgba(0,0,0,0.2)" : "0 1px 4px rgba(0,0,0,0.04)"} p="20px">
            <SectionTitle label="Trạng thái & Mô tả" isDark={isDark} />
            <Box mb="14px">
              <Text sx={label}>Trạng thái hoạt động</Text>
              <Select {...styles} value={form.Status} onChange={(e) => set("Status", e.target.value)}
                isDisabled={isSubmitting}>
                <option value="Active">✅ Hoạt động</option>
                <option value="Inactive">❌ Khóa</option>
              </Select>
            </Box>
            <Box mb="14px">
              <Text sx={label}>Quản lý rạp</Text>
              <Input {...styles} placeholder="Họ tên người quản lý"
                value={form.Manager} onChange={(e) => set("Manager", e.target.value)}
                isDisabled={isSubmitting} />
            </Box>
            <Box>
              <Text sx={label}>Mô tả rạp</Text>
              <Textarea
                bg={isDark ? DARK_THEME.inputBg : "#fafafa"}
                border={isDark ? `1.5px solid ${DARK_THEME.inputBorder}` : "1.5px solid #e8edf3"}
                borderRadius="10px"
                color={isDark ? DARK_THEME.text : "#1a202c"}
                fontSize="14px"
                fontWeight="500"
                px="14px"
                py="10px"
                _placeholder={{ color: isDark ? DARK_THEME.labelColor : "#b0bac8" }}
                _focus={{ 
                  border: `1.5px solid ${isDark ? DARK_THEME.accent : "#f97316"}`, 
                  boxShadow: isDark 
                    ? `0 0 0 3px ${DARK_THEME.accentShadow}` 
                    : "0 0 0 3px rgba(249,115,22,0.10)", 
                  bg: isDark ? DARK_THEME.inputBg : "#fff" 
                }}
                _hover={{ border: `1.5px solid ${isDark ? DARK_THEME.accent : "#f97316"}` }}
                transition="all 0.2s"
                rows={4} placeholder="Mô tả về rạp chiếu..."
                value={form.Description} onChange={(e) => set("Description", e.target.value)}
                isDisabled={isSubmitting} />
            </Box>
          </Box>
        </Flex>

        <Flex direction="column" gap="14px">
          {/* Ảnh rạp - Có upload */}
          <Box bg={bg} borderRadius="16px" border={`1px solid ${border}`}
            boxShadow={isDark ? "0 1px 4px rgba(0,0,0,0.2)" : "0 1px 4px rgba(0,0,0,0.04)"} p="18px">
            <SectionTitle label="Ảnh rạp" isDark={isDark} />
            
            {/* Preview ảnh */}
            {imagePreview ? (
              <Box position="relative" mb="12px" borderRadius="10px" overflow="hidden" border={`1px solid ${border}`}>
                <Image 
                  src={imagePreview} 
                  alt="Cinema preview"
                  objectFit="cover"
                  w="100%"
                  h="160px"
                  fallbackSrc="https://via.placeholder.com/800x400?text=Không+có+ảnh"
                />
                <Button
                  position="absolute"
                  top="8px"
                  right="8px"
                  size="sm"
                  colorScheme="red"
                  borderRadius="full"
                  onClick={handleRemoveImage}
                  isDisabled={isSubmitting || isUploading}
                >
                  <Icon as={MdDelete} />
                </Button>
              </Box>
            ) : (
              <Box 
                h="160px" borderRadius="12px" overflow="hidden" mb="10px"
                bg={isDark ? DARK_THEME.previewBg : "#f1f5f9"}
                display="flex" alignItems="center" justifyContent="center"
                border={`2px dashed ${isDark ? DARK_THEME.previewBorder : "#d1d5db"}`}>
                <Flex direction="column" align="center" gap="6px" color={isDark ? DARK_THEME.labelColor : "#94a3b8"}>
                  <Icon as={MdImage} boxSize="32px" />
                  <Text fontSize="12px">Chưa có ảnh</Text>
                </Flex>
              </Box>
            )}

            {/* Upload button */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileSelect}
              disabled={isSubmitting}
            />
            <Button
              w="100%" h="40px" borderRadius="9px"
              bg={isDark ? DARK_THEME.hoverBg : "#f8fafc"}
              color={subColor}
              border={`1.5px solid ${isDark ? DARK_THEME.border : "#e2e8f0"}`}
              fontSize="12.5px" fontWeight="600"
              _hover={{ bg: isDark ? DARK_THEME.accent : "#fff7ed", color: isDark ? DARK_THEME.text : "#f97316", border: `1.5px solid ${isDark ? DARK_THEME.accent : "#fed7aa"}` }}
              transition="all 0.2s"
              leftIcon={<Icon as={isUploading ? MdCheckCircle : MdCloudUpload} boxSize="16px" />}
              isLoading={isUploading}
              loadingText="Đang tải..."
              onClick={() => fileInputRef.current?.click()}
              isDisabled={isSubmitting}
              mb="8px"
            >
              {imagePreview ? 'Thay đổi ảnh' : 'Tải ảnh lên từ máy tính'}
            </Button>

            <Text fontSize="10px" color={isDark ? DARK_THEME.labelColor : "#94a3b8"} mt="2px">
              Hỗ trợ định dạng: JPG, PNG, WEBP. Dung lượng tối đa 5MB
            </Text>
          </Box>

          {/* Lưu ý phân quyền */}
          <Box bg={bg} borderRadius="16px" border={`1px solid ${border}`}
            boxShadow={isDark ? "0 1px 4px rgba(0,0,0,0.2)" : "0 1px 4px rgba(0,0,0,0.04)"} p="18px">
            <SectionTitle label="Lưu ý phân quyền" isDark={isDark} />
            <Flex direction="column" gap="8px">
              {[
                { ok: true,  txt: "Cập nhật địa chỉ, SĐT, giờ mở cửa" },
                { ok: true,  txt: "Đánh dấu trạng thái phòng bảo trì" },
                { ok: false, txt: "Thêm hoặc xóa rạp (chỉ Admin)" },
                { ok: false, txt: "Chỉnh sửa layout phòng chiếu" },
                { ok: false, txt: "Quản lý nhân viên rạp" },
              ].map(({ ok, txt }) => {
                const isSuccess = ok;
                const bgColor = isDark 
                  ? (isSuccess ? DARK_THEME.successBg : DARK_THEME.dangerBg)
                  : (isSuccess ? "#ecfdf5" : "#fef2f2");
                const borderColor = isDark 
                  ? (isSuccess ? DARK_THEME.successBorder : DARK_THEME.dangerBorder)
                  : (isSuccess ? "#6ee7b7" : "#fca5a5");
                const textColorItem = isDark 
                  ? (isSuccess ? DARK_THEME.text : DARK_THEME.textSecondary)
                  : (isSuccess ? textColor : subColor);
                const fontWeight = isSuccess ? "600" : "500";
                const iconColor = isDark 
                  ? (isSuccess ? DARK_THEME.successColor : DARK_THEME.dangerColor)
                  : (isSuccess ? "#059669" : "#dc2626");
                
                return (
                  <Flex key={txt} align="flex-start" gap="7px">
                    <Box w="16px" h="16px" borderRadius="full"
                      bg={bgColor} border={`1px solid ${borderColor}`}
                      display="flex" alignItems="center" justifyContent="center" flexShrink="0" mt="1px">
                      <Text fontSize="8px" fontWeight="900" color={iconColor}>
                        {ok ? "✓" : "✕"}
                      </Text>
                    </Box>
                    <Text fontSize="11.5px" color={textColorItem} fontWeight={fontWeight}>{txt}</Text>
                  </Flex>
                );
              })}
            </Flex>
          </Box>
        </Flex>
      </Grid>

      {/* Footer Actions */}
      <Box bg={bg} borderRadius="14px" border={`1px solid ${border}`}
        boxShadow={isDark ? "0 1px 4px rgba(0,0,0,0.2)" : "0 1px 4px rgba(0,0,0,0.04)"} p="16px 20px" mt="16px">
        <Flex justify="flex-end" gap="10px">
          <Button h="42px" px="22px" variant="ghost" color={subColor} borderRadius="10px"
            fontWeight="600" fontSize="13px" border={`1.5px solid ${isDark ? DARK_THEME.border : "#e2e8f0"}`}
            _hover={{ bg: isDark ? DARK_THEME.hoverBg : "#f8fafc" }} transition="all 0.2s"
            leftIcon={<Icon as={MdClose} />} onClick={onCancel}
            isDisabled={isSubmitting}>
            Hủy bỏ
          </Button>
          <Button h="42px" px="28px" borderRadius="10px" fontWeight="700" fontSize="13px"
            bg={gradientBg}
            color="white" boxShadow={shadowColor}
            _hover={{ boxShadow: shadowHover, transform: "translateY(-1px)" }}
            _active={{ transform: "translateY(0)" }} transition="all 0.2s"
            leftIcon={isSubmitting ? <Spinner size="sm" color="white" /> : <Icon as={MdCheckCircle} />}
            onClick={handleSubmit}
            isDisabled={isSubmitting}
            opacity={isSubmitting ? 0.8 : 1}>
            {isSubmitting ? "Đang xử lý..." : "Thêm rạp"}
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default AddCinemaPage;