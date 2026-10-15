// views/admin/quanlybanner/components/BannerForm.jsx

import { useState, useRef, useEffect } from "react";
import {
  Box, Grid, Text, Button, Flex, SimpleGrid,
  Input, Select, Textarea,
  Icon, Switch, useColorModeValue,
} from "@chakra-ui/react";
import {
  MdArrowBack, MdClose, MdCheckCircle, MdLink,
  MdSchedule, MdImageSearch,
} from "react-icons/md";
import { SectionTitle } from "./shared/SectionTitle";
import { StatusBadge } from "./shared/StatusBadge";
import { LinkBadge } from "./shared/LinkBadge";
import { ImageUploadButton } from "./ImageUploadButton";
import { scaleIn, fadeIn } from "./shared/animations";
import { STATUS_MAP, POSITION_MAP } from "../constants";

export function BannerForm({ banner, onCancel, onSave, isAdd = false, isSubmitting = false }) {
  const emptyForm = {
    title: "", 
    image: "", 
    imageFile: null,
    status: "Active",
    linkType: "None", 
    linkTarget: "",
    scheduleStart: "", 
    scheduleEnd: "",
    scheduledOn: false, 
    note: "",
    position: "Home",
  };
  
  const [form, setForm] = useState(() => {
    if (banner) {
      return {
        title: banner.Title || banner.title || "",
        image: banner.ImageUrl || banner.image || "",
        imageFile: null,
        status: banner.Status || banner.status || "Active",
        linkType: banner.LinkType || banner.linkType || "None",
        linkTarget: banner.LinkTarget || banner.linkTarget || "",
        scheduleStart: banner.ScheduleStart || banner.scheduleStart || "",
        scheduleEnd: banner.ScheduleEnd || banner.scheduleEnd || "",
        scheduledOn: banner.ScheduledOn !== undefined ? banner.ScheduledOn : (banner.scheduledOn || false),
        note: banner.Note || banner.note || "",
        position: banner.Position || banner.position || "Home",
      };
    }
    return emptyForm;
  });
  
  // State để kiểm tra validate
  const [touched, setTouched] = useState({});
  
  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const setTouchedField = (field) => setTouched((prev) => ({ ...prev, [field]: true }));

  // Dark mode tokens
  const cardBg = useColorModeValue("white", "#0b1437");
  const cardBorder = useColorModeValue("#f1f5f9", "#1a2744");
  const titleColor = useColorModeValue("#0f172a", "#e2e8f0");
  const subColor = useColorModeValue("#94a3b8", "#6b7fa3");
  const inputBg = useColorModeValue("#fafafa", "#0d1f3c");
  const inputBorder = useColorModeValue("#e8edf3", "#1e3a5f");
  const inputColor = useColorModeValue("#1a202c", "#e2e8f0");
  const placeholderColor = useColorModeValue("#b0bac8", "#3d5a80");
  const btnBg = useColorModeValue("#f8fafc", "#132040");
  const btnBorder = useColorModeValue("#e2e8f0", "#1e3a5f");
  const btnColor = useColorModeValue("#64748b", "#6b7fa3");
  const hintColor = useColorModeValue("#94a3b8", "#3d5a80");
  const schedBg = useColorModeValue("#fffbf7", "#1a0f00");
  const schedBorder = useColorModeValue("#fed7aa", "#92400e");
  const schedColor2 = useColorModeValue("#b45309", "#fbbf24");
  const emptyBg = useColorModeValue("#f8fafc", "#0d1f3c");
  const emptyBorder = useColorModeValue("#e2e8f0", "#1e3a5f");

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
      border: "1.5px solid #f97316", 
      boxShadow: "0 0 0 3px rgba(249,115,22,0.10)", 
      bg: useColorModeValue("#ffffff", "#0d1f3c") 
    },
    _hover: { border: "1.5px solid #f97316", bg: useColorModeValue("#ffffff", "#0d1f3c") },
    transition: "all 0.2s",
  };
  
  const labelStyle = {
    fontSize: "10.5px", 
    fontWeight: "800", 
    letterSpacing: "0.9px",
    textTransform: "uppercase", 
    color: useColorModeValue("#64748b", "#4a6080"), 
    mb: "7px",
  };

  const handleImageLoaded = (dataUrl) => {
    set("image", dataUrl);
  };

  const handleFileSelected = (file) => {
    set("imageFile", file);
  };

  const positionOptions = [
    { value: "Home", label: "Trang chủ" },
    { value: "MoviePage", label: "Trang phim" },
    { value: "PromotionPage", label: "Trang khuyến mãi" },
  ];

  // Validation
  const validate = () => {
    const errors = {};
    if (!form.title?.trim()) errors.title = "Tiêu đề banner là bắt buộc";
    // ✅ CHỈ VALIDATE ẢNH KHI THÊM MỚI
    if (isAdd && !form.image?.trim()) errors.image = "URL ảnh banner là bắt buộc";
    if (!form.position) errors.position = "Vị trí hiển thị là bắt buộc";
    if (form.linkType !== "None" && !form.linkTarget?.trim()) {
      errors.linkTarget = "URL liên kết là bắt buộc";
    }
    if (form.scheduledOn) {
      if (!form.scheduleStart) errors.scheduleStart = "Thời gian bật là bắt buộc";
      if (!form.scheduleEnd) errors.scheduleEnd = "Thời gian tắt là bắt buộc";
      if (form.scheduleStart && form.scheduleEnd && form.scheduleStart >= form.scheduleEnd) {
        errors.scheduleEnd = "Thời gian tắt phải sau thời gian bật";
      }
    }
    return errors;
  };

  const errors = validate();
  const isValid = Object.keys(errors).length === 0;

  const showError = (field) => touched[field] && errors[field];

  // ✅ HÀM XỬ LÝ SUBMIT - KHÔNG GỬI ẢNH KHI SỬA NẾU KHÔNG CÓ FILE MỚI
  const handleSubmit = () => {
    // Đánh dấu tất cả fields đã touched
    const allFields = ["title", "image", "position", "linkTarget", "scheduleStart", "scheduleEnd"];
    allFields.forEach(field => setTouchedField(field));
    
    if (!isValid || isSubmitting) return;

    // Tạo FormData để gửi file
    const formData = new FormData();
    
    // Thêm các trường dữ liệu
    formData.append('Title', form.title || '');
    formData.append('Position', form.position || 'Home');
    formData.append('Status', form.status || 'Active');
    formData.append('LinkUrl', form.linkTarget || '');
    formData.append('Note', form.note || '');
    formData.append('ScheduledOn', form.scheduledOn ? '1' : '0');
    
    // Nếu có lịch hẹn giờ
    if (form.scheduledOn) {
      formData.append('ScheduleStart', form.scheduleStart || '');
      formData.append('ScheduleEnd', form.scheduleEnd || '');
    }
    
    // ✅ XỬ LÝ ẢNH - CHỈ GỬI KHI CÓ FILE MỚI HOẶC THÊM MỚI
    if (form.imageFile) {
      // Nếu có file mới (upload từ máy tính)
      formData.append('ImageUrl', form.imageFile);
    } else if (isAdd && form.image && form.image.startsWith('http')) {
      // Nếu là thêm mới và có URL ảnh
      formData.append('ImageUrl', form.image);
    }
    // ❌ KHI SỬA: KHÔNG GỬI ImageUrl NẾU KHÔNG CÓ FILE MỚI
    
    // Gọi callback với FormData
    onSave(formData);
  };

  // Xử lý khi nhấn Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isSubmitting) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const PreviewBlock = ({ maxH = "180px" }) => (
    <Box 
      bg={cardBg} 
      borderRadius="16px" 
      border={`1px solid ${cardBorder}`}
      boxShadow="0 1px 4px rgba(0,0,0,0.08)" 
      p={{ base: "14px", md: "18px" }}
    >
      <SectionTitle label="Xem trước banner" />
      {form.image ? (
        <Box borderRadius="10px" overflow="hidden" border={`1px solid ${cardBorder}`}>
          <img 
            src={form.image} 
            alt="preview"
            style={{ width: "100%", display: "block", maxHeight: maxH, objectFit: "cover" }} 
          />
        </Box>
      ) : (
        <Flex 
          direction="column" 
          align="center" 
          justify="center"
          h={{ base: "100px", md: "130px" }} 
          borderRadius="10px"
          bg={emptyBg} 
          border={`2px dashed ${emptyBorder}`}
        >
          <Icon as={MdImageSearch} boxSize="26px" color={emptyBorder} mb="6px" />
          <Text fontSize="12px" color={subColor}>Nhập URL hoặc tải ảnh lên để xem trước</Text>
        </Flex>
      )}
      <ImageUploadButton 
        onImageLoaded={handleImageLoaded}
        onFileSelected={handleFileSelected}
        isDisabled={isSubmitting}
      />
    </Box>
  );

  const SummaryBlock = () => form.title ? (
    <Box 
      bg={cardBg} 
      borderRadius="16px" 
      border={`1px solid ${cardBorder}`}
      boxShadow="0 1px 4px rgba(0,0,0,0.08)" 
      p="18px"
      sx={{ animation: `${fadeIn} 0.3s ease both` }}
    >
      <SectionTitle label="Tóm tắt" />
      <Flex direction="column" gap="10px">
        <Box>
          <Text fontSize="10px" color={subColor} fontWeight="700" letterSpacing="0.8px"
            textTransform="uppercase" mb="3px"
          >
            Tiêu đề
          </Text>
          <Text fontSize="13px" fontWeight="700" color={titleColor}>{form.title}</Text>
        </Box>
        <Flex gap="8px" flexWrap="wrap">
          <StatusBadge status={form.status} />
          <LinkBadge type={form.linkType} />
        </Flex>
        {form.linkTarget && (
          <Flex align="center" gap="6px">
            <Icon as={MdLink} boxSize="11px" color={subColor} />
            <Text fontSize="11.5px" color={useColorModeValue("#475569", "#8899b4")} fontWeight="600">
              {form.linkTarget}
            </Text>
          </Flex>
        )}
        {form.scheduledOn && form.scheduleStart && (
          <Flex align="center" gap="6px">
            <Icon as={MdSchedule} boxSize="11px" color="#f97316" />
            <Text fontSize="11px" color="#f97316" fontWeight="600">Hẹn giờ đang bật</Text>
          </Flex>
        )}
      </Flex>
    </Box>
  ) : null;

  return (
    <Box sx={{ animation: `${scaleIn} 0.3s ease both` }}>
      <Flex align="center" gap="10px" mb="18px" wrap="nowrap">
        <Button 
          leftIcon={<Icon as={MdArrowBack} />} 
          variant="ghost"
          color={btnColor} 
          borderRadius="10px" 
          h="38px" 
          fontSize="13px" 
          fontWeight="600"
          border={`1.5px solid ${btnBorder}`} 
          _hover={{ bg: useColorModeValue("#f8fafc", "#1a2744") }}
          flexShrink="0" 
          px={{ base: "10px", md: "16px" }} 
          onClick={onCancel}
          isDisabled={isSubmitting}
        >
          <Box display={{ base: "none", sm: "block" }}>Quay lại</Box>
        </Button>
        <Box minW="0">
          <Text fontSize={{ base: "16px", md: "20px" }} fontWeight="800" color={titleColor}
            letterSpacing="-0.4px" noOfLines={1}
          >
            {isAdd ? "Thêm banner mới" : "Chỉnh sửa banner"}
          </Text>
          <Text fontSize="11.5px" color={subColor} mt="1px" noOfLines={1}>
            {isAdd ? "Điền thông tin để thêm banner vào trang chủ" : banner?.title}
          </Text>
        </Box>
      </Flex>

      <Grid templateColumns={{ base: "1fr", lg: "1fr 300px" }} gap="14px">
        <Flex direction="column" gap="12px">
          <BasicInfoSection 
            form={form} 
            set={set} 
            inputStyle={inputStyle} 
            labelStyle={labelStyle} 
            hintColor={hintColor}
            positionOptions={positionOptions}
            errors={errors}
            showError={showError}
            setTouchedField={setTouchedField}
            handleKeyDown={handleKeyDown}
            isSubmitting={isSubmitting}
            isAdd={isAdd}
          />
          
          <Box display={{ base: "block", lg: "none" }}>
            <PreviewBlock maxH="160px" />
          </Box>

          <StatusSection 
            form={form} 
            set={set} 
            cardBg={cardBg} 
            cardBorder={cardBorder} 
            isSubmitting={isSubmitting}
          />

          <LinkSection 
            form={form} 
            set={set} 
            inputStyle={inputStyle} 
            labelStyle={labelStyle}
            errors={errors}
            showError={showError}
            setTouchedField={setTouchedField}
            handleKeyDown={handleKeyDown}
            isSubmitting={isSubmitting}
          />

          <ScheduleSection 
            form={form} 
            set={set} 
            inputStyle={inputStyle} 
            labelStyle={labelStyle}
            cardBg={cardBg} 
            cardBorder={cardBorder} 
            subColor={subColor}
            schedBg={schedBg} 
            schedBorder={schedBorder} 
            schedColor2={schedColor2}
            errors={errors}
            showError={showError}
            setTouchedField={setTouchedField}
            isSubmitting={isSubmitting}
          />
        </Flex>

        <Flex direction="column" gap="14px" display={{ base: "none", lg: "flex" }}>
          <PreviewBlock maxH="200px" />
          <SummaryBlock />
        </Flex>
      </Grid>

      {/* ✅ Save bar với handleSubmit và loader */}
      <SaveBar 
        onCancel={onCancel} 
        onSave={handleSubmit} 
        isAdd={isAdd}
        isSubmitting={isSubmitting}
        isValid={isValid}
      />
    </Box>
  );
}

// Sub-components (có thêm isDisabled và validation)
function BasicInfoSection({ 
  form, set, inputStyle, labelStyle, hintColor, positionOptions,
  errors, showError, setTouchedField, handleKeyDown, isSubmitting, isAdd 
}) {
  return (
    <Box bg={useColorModeValue("white", "#0b1437")} borderRadius="16px" 
      border={`1px solid ${useColorModeValue("#f1f5f9", "#1a2744")}`}
      boxShadow="0 1px 4px rgba(0,0,0,0.08)" p={{ base: "14px", md: "20px" }}
    >
      <SectionTitle label="Thông tin cơ bản" />
      <Flex direction="column" gap="12px">
        <Box>
          <Text sx={labelStyle}>Tiêu đề banner *</Text>
          <Input 
            {...inputStyle} 
            placeholder="VD: Banner Mùa Hè 2026"
            value={form.title} 
            onChange={(e) => set("title", e.target.value)}
            onBlur={() => setTouchedField("title")}
            onKeyDown={handleKeyDown}
            isInvalid={showError("title")}
            errorBorderColor="#ef4444"
            isDisabled={isSubmitting}
          />
          {showError("title") && (
            <Text fontSize="11px" color="#ef4444" mt="4px" fontWeight="600">
              {errors.title}
            </Text>
          )}
        </Box>
        <Box>
          <Text sx={labelStyle}>
            URL ảnh banner {isAdd && "*"}
            {!isAdd && <Text as="span" fontSize="10px" color={hintColor} fontWeight="400"> (Để trống nếu không muốn thay đổi)</Text>}
          </Text>
          <Input 
            {...inputStyle} 
            placeholder={isAdd ? "https://... (tỉ lệ 16:5 khuyến nghị)" : "Để trống nếu không đổi ảnh"}
            value={form.image} 
            onChange={(e) => set("image", e.target.value)}
            onBlur={() => setTouchedField("image")}
            onKeyDown={handleKeyDown}
            isInvalid={showError("image")}
            errorBorderColor="#ef4444"
            isDisabled={isSubmitting}
          />
          {showError("image") && (
            <Text fontSize="11px" color="#ef4444" mt="4px" fontWeight="600">
              {errors.image}
            </Text>
          )}
          <Text fontSize="10.5px" color={hintColor} mt="5px">
            Hoặc tải ảnh lên từ máy tính bên dưới (JPG, PNG, WebP – tối đa 5MB)
          </Text>
        </Box>
        <Box>
          <Text sx={labelStyle}>Vị trí hiển thị *</Text>
          <Select 
            {...inputStyle} 
            value={form.position} 
            onChange={(e) => set("position", e.target.value)}
            onBlur={() => setTouchedField("position")}
            isInvalid={showError("position")}
            errorBorderColor="#ef4444"
            isDisabled={isSubmitting}
          >
            {positionOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </Select>
          {showError("position") && (
            <Text fontSize="11px" color="#ef4444" mt="4px" fontWeight="600">
              {errors.position}
            </Text>
          )}
        </Box>
        <Box>
          <Text sx={labelStyle}>Ghi chú nội bộ</Text>
          <Textarea
            bg={useColorModeValue("#fafafa", "#0d1f3c")} 
            border={`1.5px solid ${useColorModeValue("#e8edf3", "#1e3a5f")}`} 
            borderRadius="10px"
            color={useColorModeValue("#1a202c", "#e2e8f0")} 
            fontSize="14px" 
            fontWeight="500" 
            px="14px" 
            py="10px"
            _placeholder={{ color: useColorModeValue("#b0bac8", "#3d5a80") }}
            _focus={{ 
              border: "1.5px solid #f97316", 
              boxShadow: "0 0 0 3px rgba(249,115,22,0.10)", 
              bg: useColorModeValue("#fff", "#0d1f3c") 
            }}
            _hover={{ border: "1.5px solid #f97316" }}
            transition="all 0.2s" 
            rows={2}
            placeholder="Ghi chú cho nhóm nội dung..."
            value={form.note} 
            onChange={(e) => set("note", e.target.value)}
            onKeyDown={handleKeyDown}
            isDisabled={isSubmitting}
          />
        </Box>
      </Flex>
    </Box>
  );
}

function StatusSection({ form, set, cardBg, cardBorder, isSubmitting }) {
  return (
    <Box bg={cardBg} borderRadius="16px" border={`1px solid ${cardBorder}`}
      boxShadow="0 1px 4px rgba(0,0,0,0.08)" p={{ base: "14px", md: "20px" }}
    >
      <SectionTitle label="Trạng thái hiển thị" />
      <SimpleGrid columns={2} spacing="10px">
        {["Active", "Inactive"].map((s) => {
          const isSelected = form.status === s;
          const label = s === "Active" ? "Đang hiện" : "Đã ẩn";
          const selBg = s === "Active"
            ? useColorModeValue("#ecfdf5", "#064e3b")
            : useColorModeValue("#f9fafb", "#1f2937");
          const selBorder = s === "Active"
            ? useColorModeValue("#6ee7b7", "#065f46")
            : useColorModeValue("#e5e7eb", "#374151");
          const idleBg = useColorModeValue("#f8fafc", "#132040");
          const idleBorder = useColorModeValue("#f1f5f9", "#1a2744");
          const selTextColor = s === "Active"
            ? useColorModeValue("#059669", "#34d399")
            : useColorModeValue("#374151", "#9ca3af");
          return (
            <Box key={s} p={{ base: "10px", md: "12px 14px" }} borderRadius="10px"
              cursor={isSubmitting ? "not-allowed" : "pointer"}
              bg={isSelected ? selBg : idleBg}
              border={`2px solid ${isSelected ? selBorder : idleBorder}`}
              transition="all 0.2s" 
              onClick={() => !isSubmitting && set("status", s)}
              opacity={isSubmitting ? 0.6 : 1}
            >
              <Flex align="center" gap="8px">
                <Box w="8px" h="8px" borderRadius="full" flexShrink="0"
                  bg={s === "Active" ? "#10b981" : "#9ca3af"}
                  sx={s === "Active" && isSelected ? { animation: "pulse 1.8s ease infinite" } : {}}
                />
                <Text fontSize={{ base: "12px", md: "13px" }} fontWeight="700"
                  color={isSelected ? selTextColor : useColorModeValue("#94a3b8", "#3d5a80")}
                >{label}</Text>
              </Flex>
            </Box>
          );
        })}
      </SimpleGrid>
    </Box>
  );
}

function LinkSection({ 
  form, set, inputStyle, labelStyle,
  errors, showError, setTouchedField, handleKeyDown, isSubmitting 
}) {
  return (
    <Box bg={useColorModeValue("white", "#0b1437")} borderRadius="16px" 
      border={`1px solid ${useColorModeValue("#f1f5f9", "#1a2744")}`}
      boxShadow="0 1px 4px rgba(0,0,0,0.08)" p={{ base: "14px", md: "20px" }}
    >
      <SectionTitle label="Liên kết banner" />
      <Flex direction="column" gap="12px">
        <Box>
          <Text sx={labelStyle}>Liên kết đến *</Text>
          <Select 
            {...inputStyle} 
            value={form.linkType}
            onChange={(e) => { set("linkType", e.target.value); set("linkTarget", ""); }}
            isDisabled={isSubmitting}
          >
            <option value="None">Không có</option>
            <option value="Movie">Phim</option>
            <option value="Promotion">Khuyến mãi</option>
          </Select>
        </Box>
        <Box opacity={form.linkType === "None" ? 0.45 : 1}
          pointerEvents={form.linkType === "None" ? "none" : "auto"} transition="opacity 0.2s"
        >
          <Text sx={labelStyle}>
            {form.linkType === "None" ? "Chọn đối tượng —" : `URL liên kết`}
          </Text>
          <Input 
            {...inputStyle} 
            placeholder={form.linkType === "None" ? "Không áp dụng" : "https://example.com/phim/1"}
            value={form.linkTarget} 
            onChange={(e) => set("linkTarget", e.target.value)}
            onBlur={() => setTouchedField("linkTarget")}
            onKeyDown={handleKeyDown}
            isDisabled={form.linkType === "None" || isSubmitting}
            isInvalid={showError("linkTarget")}
            errorBorderColor="#ef4444"
          />
          {showError("linkTarget") && (
            <Text fontSize="11px" color="#ef4444" mt="4px" fontWeight="600">
              {errors.linkTarget}
            </Text>
          )}
        </Box>
      </Flex>
    </Box>
  );
}

function ScheduleSection({ 
  form, set, inputStyle, labelStyle, cardBg, cardBorder, subColor, 
  schedBg, schedBorder, schedColor2,
  errors, showError, setTouchedField, isSubmitting 
}) {
  return (
    <Box bg={cardBg} borderRadius="16px" border={`1px solid ${cardBorder}`}
      boxShadow="0 1px 4px rgba(0,0,0,0.08)" p={{ base: "14px", md: "20px" }}
    >
      <Flex align="center" justify="space-between" mb="14px">
        <Flex align="center" gap="8px">
          <Box w="3px" h="14px" borderRadius="full" bg="linear-gradient(180deg, #f97316, #fbbf24)" />
          <Text fontSize="10.5px" fontWeight="800" color={useColorModeValue("#374151", "#a0aec0")}
            letterSpacing="1.2px" textTransform="uppercase"
          >Hẹn giờ bật/tắt</Text>
        </Flex>
        <Flex align="center" gap="8px">
          <Text fontSize="12px" fontWeight="600" color={form.scheduledOn ? "#f97316" : subColor}>
            {form.scheduledOn ? "Đã bật" : "Tắt"}
          </Text>
          <Switch 
            isChecked={form.scheduledOn} 
            colorScheme="orange" 
            size="md"
            onChange={(e) => set("scheduledOn", e.target.checked)}
            isDisabled={isSubmitting}
          />
        </Flex>
      </Flex>
      <Box h="1px" bg={useColorModeValue(
        "linear-gradient(90deg, #f1f5f9, transparent)",
        "linear-gradient(90deg, #1e3a5f, transparent)"
      )} mb="14px" />
      <Box opacity={form.scheduledOn ? 1 : 0.4}
        pointerEvents={form.scheduledOn ? "auto" : "none"} transition="opacity 0.2s"
      >
        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing="12px">
          {["scheduleStart", "scheduleEnd"].map((key, i) => (
            <Box key={key}>
              <Text sx={labelStyle}>{i === 0 ? "Thời gian bật" : "Thời gian tắt"}</Text>
              <Input 
                {...inputStyle} 
                type="datetime-local"
                fontSize={{ base: "13px", md: "14px" }} 
                px={{ base: "10px", md: "14px" }}
                value={form[key]} 
                onChange={(e) => set(key, e.target.value)}
                onBlur={() => setTouchedField(key)}
                isInvalid={showError(key)}
                errorBorderColor="#ef4444"
                isDisabled={!form.scheduledOn || isSubmitting}
              />
              {showError(key) && (
                <Text fontSize="11px" color="#ef4444" mt="4px" fontWeight="600">
                  {errors[key]}
                </Text>
              )}
            </Box>
          ))}
        </SimpleGrid>
        {form.scheduledOn && (
          <Box mt="10px" p="10px 13px" borderRadius="9px" bg={schedBg} border={`1px solid ${schedBorder}`}
            sx={{ animation: `${fadeIn} 0.2s ease both` }}
          >
            <Text fontSize={{ base: "11px", md: "11.5px" }} color={schedColor2} fontWeight="600">
              ⏱ Bật lúc <b>{form.scheduleStart || "?"}</b>{" – "}Tắt lúc <b>{form.scheduleEnd || "?"}</b>
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}

function SaveBar({ onCancel, onSave, isAdd, isSubmitting, isValid }) {
  const btnColor = useColorModeValue("#64748b", "#6b7fa3");
  const btnBorder = useColorModeValue("#e2e8f0", "#1e3a5f");
  const cardBg = useColorModeValue("white", "#0b1437");
  const cardBorder = useColorModeValue("#f1f5f9", "#1a2744");

  return (
    <Box 
      bg={cardBg} 
      borderRadius="14px" 
      border={`1px solid ${cardBorder}`}
      boxShadow="0 1px 4px rgba(0,0,0,0.08)"
      p={{ base: "12px 14px", md: "16px 20px" }} 
      mt="14px"
      opacity={isSubmitting ? 0.7 : 1}
      transition="opacity 0.3s"
      pointerEvents={isSubmitting ? "none" : "auto"}
    >
      <Flex gap="10px" direction={{ base: "column-reverse", sm: "row" }}
        justify={{ base: "stretch", sm: "flex-end" }}
      >
        <Button 
          h={{ base: "44px", md: "42px" }} 
          px="22px" 
          variant="ghost" 
          color={btnColor}
          borderRadius="10px" 
          fontWeight="600" 
          fontSize="13px"
          border={`1.5px solid ${btnBorder}`} 
          _hover={{ bg: useColorModeValue("#f8fafc", "#1a2744") }}
          transition="all 0.2s" 
          leftIcon={<Icon as={MdClose} />}
          w={{ base: "100%", sm: "auto" }} 
          onClick={onCancel}
          isDisabled={isSubmitting}
          opacity={isSubmitting ? 0.5 : 1}
          cursor={isSubmitting ? "not-allowed" : "pointer"}
        >
          Hủy bỏ
        </Button>
        <Button 
          h={{ base: "44px", md: "42px" }} 
          px="28px" 
          borderRadius="10px"
          fontWeight="700" 
          fontSize="13px"
          bg={isValid && !isSubmitting 
            ? "linear-gradient(135deg, #f97316 0%, #fb923c 60%, #fbbf24 100%)"
            : useColorModeValue("#e2e8f0", "#1a2744")
          }
          color={isValid && !isSubmitting ? "#ffffff" : useColorModeValue("#94a3b8", "#4a6080")}
          boxShadow={isValid && !isSubmitting ? "0 4px 16px rgba(249,115,22,0.35)" : "none"}
          _hover={isValid && !isSubmitting ? { 
            boxShadow: "0 8px 24px rgba(249,115,22,0.45)", 
            transform: "translateY(-1px)" 
          } : {}}
          _active={isValid && !isSubmitting ? { transform: "translateY(0)" } : {}}
          transition="all 0.2s"
          leftIcon={!isSubmitting && <Icon as={MdCheckCircle} />}
          w={{ base: "100%", sm: "auto" }} 
          onClick={onSave}
          isLoading={isSubmitting}
          loadingText={isAdd ? "Đang thêm..." : "Đang lưu..."}
          isDisabled={!isValid || isSubmitting}
          cursor={!isValid || isSubmitting ? "not-allowed" : "pointer"}
          opacity={!isValid || isSubmitting ? 0.6 : 1}
          _disabled={{
            opacity: 0.6,
            cursor: "not-allowed",
            _hover: {},
            _active: {}
          }}
        >
          {isAdd ? "Thêm banner" : "Lưu thay đổi"}
        </Button>
      </Flex>
    </Box>
  );
}