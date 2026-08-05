import React, { useState, useRef } from "react";
import {
  Box, Flex, Text, Button, Icon, Grid, Input, Select,
  Textarea, useColorMode, useColorModeValue,
  useToast, Spinner, Image
} from "@chakra-ui/react";
import {
  MdArrowBack, MdClose, MdCheckCircle, MdCloudUpload,
  MdDelete
} from "react-icons/md";
import SectionTitle from "./shared/SectionTitle";
import { scaleIn } from "./shared/animations";

const CinemaForm = ({ cinema, onCancel, onSave, isSubmitting, isDark }) => {
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // ✅ Sử dụng useColorModeValue
  const bg = useColorModeValue("white", "#0a1628");
  const cardBg = useColorModeValue("white", "#0f1f3a");
  const border = useColorModeValue("#f1f5f9", "#1a3a5c");
  const textColor = useColorModeValue("#0f172a", "#e8f4f8");
  const subColor = useColorModeValue("#64748b", "#88b4d8");
  const labelColor = useColorModeValue("#64748b", "#5a8ab5");
  const inputBg = useColorModeValue("#fafafa", "#0a1f35");
  const inputBorder = useColorModeValue("#e8edf3", "#1a3a5c");
  const inputColor = useColorModeValue("#1a202c", "#e8f4f8");
  const placeholderColor = useColorModeValue("#b0bac8", "#5a8ab5");
  const hoverBg = useColorModeValue("#f8fafc", "#142d4f");
  const accentColor = useColorModeValue("#f97316", "#4a9eff");
  const accentShadow = useColorModeValue("rgba(249,115,22,0.10)", "rgba(74, 158, 255, 0.25)");
  
  // ✅ Gradient cho nút
  const gradientBg = useColorModeValue(
    "linear-gradient(135deg,#f97316 0%,#fb923c 60%,#fbbf24 100%)",
    "linear-gradient(135deg, #4a9eff, #6ab0ff)"
  );
  const shadowColor = useColorModeValue(
    "0 4px 16px rgba(249,115,22,0.35)",
    "0 4px 16px rgba(74, 158, 255, 0.25)"
  );
  const shadowHover = useColorModeValue(
    "0 8px 24px rgba(249,115,22,0.45)",
    "0 8px 24px rgba(74, 158, 255, 0.35)"
  );

  const [form, setForm] = useState({
    Name: cinema.Name || "",
    Address: cinema.Address || "",
    City: cinema.City || "",
    Phone: cinema.Phone || "",
    Email: cinema.Email || "",
    OpenTime: cinema.OpenTime || "08:00 – 23:00",
    Status: cinema.Status || "Active",
    Description: cinema.Description || "",
    Manager: cinema.Manager || "",
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const inputStyle = {
    bg: inputBg,
    border: `1.5px solid ${inputBorder}`,
    borderRadius: "10px",
    color: inputColor,
    fontSize: "14px",
    fontWeight: "500",
    px: "14px",
    h: "44px",
    _placeholder: { color: placeholderColor, fontWeight: "400" },
    _focus: { 
      border: `1.5px solid ${accentColor}`, 
      boxShadow: `0 0 0 3px ${accentShadow}`, 
      bg: useColorModeValue("#fff", "#0a1f35") 
    },
    _hover: { border: `1.5px solid ${accentColor}`, bg: useColorModeValue("#fff", "#0a1f35") },
    transition: "all 0.2s ease",
  };

  const labelStyle = {
    fontSize: "10.5px",
    fontWeight: "800",
    letterSpacing: "0.9px",
    textTransform: "uppercase",
    color: labelColor,
    mb: "7px",
    display: "block",
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file ảnh (JPG, PNG, WEBP)");
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      alert("Ảnh phải nhỏ hơn 5MB");
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

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = () => {
    const submitData = {
      ...form,
      ImageFile: imageFile,
    };
    onSave(submitData);
  };

  const currentImage = imagePreview || cinema.ImageUrl;

  return (
    <Box sx={{ animation: `${scaleIn} 0.3s ease both}` }}>
      <Flex align="center" gap="12px" mb="20px">
        <Button leftIcon={<Icon as={MdArrowBack} />} variant="ghost"
          color={subColor} borderRadius="10px" h="38px" fontSize="13px" fontWeight="600"
          border={`1.5px solid ${border}`} 
          _hover={{ bg: hoverBg }} 
          onClick={onCancel}
          isDisabled={isSubmitting}>
          Quay lại
        </Button>
        <Box>
          <Text fontSize="20px" fontWeight="800" color={textColor} letterSpacing="-0.3px">
            Cập nhật thông tin rạp
          </Text>
          <Text fontSize="12px" color={subColor} mt="2px">{cinema.Name}</Text>
        </Box>
      </Flex>

      <Grid templateColumns={{ base: "1fr", lg: "1fr 320px" }} gap="16px">
        <Flex direction="column" gap="14px">
          {/* Thông tin cơ bản */}
          <Box bg={cardBg} borderRadius="16px" border={`1px solid ${border}`}
            boxShadow={isDark ? "0 1px 4px rgba(0,0,0,0.2)" : "0 1px 4px rgba(0,0,0,0.04)"} p="20px">
            <SectionTitle label="Thông tin rạp" isDark={isDark} />
            <Flex direction="column" gap="14px">
              <Box>
                <Text sx={labelStyle}>Tên rạp *</Text>
                <Input {...inputStyle} placeholder="Tên rạp chiếu phim"
                  value={form.Name} onChange={(e) => set("Name", e.target.value)}
                  isDisabled={isSubmitting} />
              </Box>
              <Box>
                <Text sx={labelStyle}>Địa chỉ *</Text>
                <Input {...inputStyle} placeholder="Địa chỉ đầy đủ"
                  value={form.Address} onChange={(e) => set("Address", e.target.value)}
                  isDisabled={isSubmitting} />
              </Box>
              <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap="14px">
                <Box>
                  <Text sx={labelStyle}>Thành phố</Text>
                  <Input {...inputStyle} placeholder="VD: Hồ Chí Minh"
                    value={form.City} onChange={(e) => set("City", e.target.value)}
                    isDisabled={isSubmitting} />
                </Box>
                <Box>
                  <Text sx={labelStyle}>Hotline</Text>
                  <Input {...inputStyle} placeholder="028 xxxx xxxx"
                    value={form.Phone} onChange={(e) => set("Phone", e.target.value)}
                    isDisabled={isSubmitting} />
                </Box>
              </Grid>
              <Box>
                <Text sx={labelStyle}>Email liên hệ</Text>
                <Input {...inputStyle} type="email" placeholder="contact@cinema.vn"
                  value={form.Email} onChange={(e) => set("Email", e.target.value)}
                  isDisabled={isSubmitting} />
              </Box>
              <Box>
                <Text sx={labelStyle}>Giờ mở cửa</Text>
                <Input {...inputStyle} placeholder="08:00 – 23:00"
                  value={form.OpenTime} onChange={(e) => set("OpenTime", e.target.value)}
                  isDisabled={isSubmitting} />
              </Box>
            </Flex>
          </Box>

          {/* Trạng thái & Mô tả */}
          <Box bg={cardBg} borderRadius="16px" border={`1px solid ${border}`}
            boxShadow={isDark ? "0 1px 4px rgba(0,0,0,0.2)" : "0 1px 4px rgba(0,0,0,0.04)"} p="20px">
            <SectionTitle label="Trạng thái & Mô tả" isDark={isDark} />
            <Box mb="14px">
              <Text sx={labelStyle}>Trạng thái hoạt động</Text>
              <Select {...inputStyle} value={form.Status} onChange={(e) => set("Status", e.target.value)}
                isDisabled={isSubmitting}>
                <option value="Active">✅ Hoạt động</option>
                <option value="Inactive">❌ Khóa</option>
              </Select>
            </Box>
            <Box mb="14px">
              <Text sx={labelStyle}>Quản lý rạp</Text>
              <Input {...inputStyle} placeholder="Họ tên người quản lý"
                value={form.Manager} onChange={(e) => set("Manager", e.target.value)}
                isDisabled={isSubmitting} />
            </Box>
            <Box>
              <Text sx={labelStyle}>Mô tả rạp</Text>
              <Textarea
                bg={inputBg}
                border={`1.5px solid ${inputBorder}`}
                borderRadius="10px"
                color={inputColor}
                fontSize="14px"
                fontWeight="500"
                px="14px"
                py="10px"
                _placeholder={{ color: placeholderColor }}
                _focus={{ border: `1.5px solid ${accentColor}`, boxShadow: `0 0 0 3px ${accentShadow}`, bg: useColorModeValue("#fff", "#0a1f35") }}
                _hover={{ border: `1.5px solid ${accentColor}` }}
                transition="all 0.2s"
                rows={4} placeholder="Mô tả về rạp chiếu..."
                value={form.Description} onChange={(e) => set("Description", e.target.value)}
                isDisabled={isSubmitting} />
            </Box>
          </Box>
        </Flex>

        {/* Right sidebar - Upload ảnh */}
        <Flex direction="column" gap="14px">
          <Box bg={cardBg} borderRadius="16px" border={`1px solid ${border}`}
            boxShadow={isDark ? "0 1px 4px rgba(0,0,0,0.2)" : "0 1px 4px rgba(0,0,0,0.04)"} p="18px">
            <SectionTitle label="Ảnh rạp" isDark={isDark} />
            
            {/* Preview */}
            {currentImage && (
              <Box position="relative" mb="12px" borderRadius="10px" overflow="hidden" border={`1px solid ${border}`}>
                <Image 
                  src={currentImage} 
                  alt={cinema.Name || "Cinema"}
                  objectFit="cover"
                  w="100%"
                  h="180px"
                  fallbackSrc="https://via.placeholder.com/800x400?text=Không+có+ảnh"
                />
                <Button
                  position="absolute"
                  top="8px"
                  right="8px"
                  size="sm"
                  colorScheme={useColorModeValue("red", "orange")}
                  borderRadius="full"
                  onClick={handleRemoveImage}
                  isDisabled={isSubmitting || isUploading}
                >
                  <Icon as={MdDelete} />
                </Button>
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
              bg={useColorModeValue("#f8fafc", "#142d4f")}
              color={subColor}
              border={`1.5px solid ${useColorModeValue("#e2e8f0", "#1a3a5c")}`}
              fontSize="12.5px" fontWeight="600"
              _hover={{ 
                bg: useColorModeValue("#fff7ed", "#0f1f3a"), 
                color: useColorModeValue("#f97316", "#4a9eff"), 
                border: `1.5px solid ${useColorModeValue("#fed7aa", "#4a9eff")}` 
              }}
              transition="all 0.2s"
              leftIcon={<Icon as={isUploading ? MdCheckCircle : MdCloudUpload} boxSize="16px" />}
              isLoading={isUploading}
              loadingText="Đang tải..."
              onClick={() => fileInputRef.current?.click()}
              isDisabled={isSubmitting}
              mb="8px"
            >
              {currentImage ? 'Thay đổi ảnh' : 'Tải ảnh lên từ máy tính'}
            </Button>

            <Text fontSize="11px" color={subColor} textAlign="center">
              JPG, PNG, WebP (tối đa 5MB)
            </Text>
          </Box>
        </Flex>
      </Grid>

      {/* Footer Actions */}
      <Box bg={cardBg} borderRadius="14px" border={`1px solid ${border}`}
        boxShadow={isDark ? "0 1px 4px rgba(0,0,0,0.2)" : "0 1px 4px rgba(0,0,0,0.04)"} p="16px 20px" mt="16px">
        <Flex justify="flex-end" gap="10px">
          <Button h="42px" px="22px" variant="ghost" color={subColor} borderRadius="10px"
            fontWeight="600" fontSize="13px" border={`1.5px solid ${border}`}
            _hover={{ bg: hoverBg }} transition="all 0.2s"
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
            {isSubmitting ? "Đang xử lý..." : "Lưu thay đổi"}
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default CinemaForm;