// views/admin/quanlykhuyenmai/components/KhuyenMaiForm.jsx

import { useState } from "react";
import {
  Box, Grid, Text, Button, Flex, SimpleGrid, FormControl,
  Input, Select, Textarea, Icon, useColorModeValue,
  useBreakpointValue, Collapse
} from "@chakra-ui/react";
import { 
  MdArrowBack, MdClose, MdCheckCircle, MdCalendarToday, 
  MdLocalOffer, MdAttachMoney, MdBarChart, MdExpandMore, MdExpandLess,
  MdCardGiftcard 
} from "react-icons/md";
import { FaTag, FaPercent } from "react-icons/fa";
import { SectionTitle } from "./shared/SectionTitle";
import { StatusBadge } from "./shared/StatusBadge";
import { TypeBadge } from "./shared/TypeBadge";
import { scaleIn, fadeIn, pulse } from "./shared/animations";  // <-- Thêm pulse
import { 
  STATUS_CONFIG,   // <-- Thêm STATUS_CONFIG
  TYPE_CONFIG, 
  TYPE_MAP, 
  DISCOUNT_TYPE_OPTS, 
  APPLY_FOR_OPTS 
} from "../constants";

export function KhuyenMaiForm({ promo, onCancel, onSave, isAdd = false }) {
  const isDark = useColorModeValue(false, true);
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const [previewOpen, setPreviewOpen] = useState(false);

  const empty = {
    Title: "",
    Code: "",
    Description: "",
    DiscountType: "Percentage",
    DiscountValue: "",
    StartDate: "",
    EndDate: "",
    IsActive: true,
    Status: "Scheduled",
    ApplyFor: "Tất cả phim",
    ApplyTarget: "",
    MinOrder: "",
    MaxDiscount: "",
    UsageLimit: "",
    ImageUrl: null,
    ImageFile: null,
  };

  const [form, setForm] = useState(() => {
    if (promo) {
      return {
        Title: promo.Title || promo.title || "",
        Code: promo.Code || promo.code || "",
        Description: promo.Description || promo.description || "",
        DiscountType: promo.DiscountType || promo.discountType || "Percentage",
        DiscountValue: promo.DiscountValue || promo.discountValue || "",
        StartDate: promo.StartDate || promo.startDate || "",
        EndDate: promo.EndDate || promo.endDate || "",
        IsActive: promo.IsActive !== undefined ? promo.IsActive : (promo.isActive !== undefined ? promo.isActive : true),
        Status: promo.Status || promo.status || "Scheduled",
        ApplyFor: promo.ApplyFor || promo.applyFor || "Tất cả phim",
        ApplyTarget: promo.ApplyTarget || promo.applyTarget || "",
        MinOrder: promo.MinOrder || promo.minOrder || "",
        MaxDiscount: promo.MaxDiscount || promo.maxDiscount || "",
        UsageLimit: promo.UsageLimit || promo.usageLimit || "",
        ImageUrl: promo.ImageUrl || promo.imageUrl || null,
        ImageFile: null,
      };
    }
    return empty;
  });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const inputBg = useColorModeValue("#fafafa", "#0f172a");
  const inputBorder = useColorModeValue("#e8edf3", "#2d3a6b");
  const inputColor = useColorModeValue("#1a202c", "#e2e8f0");
  const placeholderColor = useColorModeValue("#b0bac8", "#4a5568");
  const cardBg = useColorModeValue("white", "#1b2559");
  const cardBorder = useColorModeValue("#f1f5f9", "#2d3a6b");
  const textPrimary = useColorModeValue("#0f172a", "#e2e8f0");
  const textSecondary = useColorModeValue("#64748b", "#7c8db5");

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
      bg: useColorModeValue("#ffffff", "#1b2559") 
    },
    _hover: { border: "1.5px solid #f97316", bg: useColorModeValue("#ffffff", "#1b2559") },
    transition: "all 0.2s ease",
  };

  const labelStyle = {
    fontSize: "10.5px", 
    fontWeight: "800", 
    letterSpacing: "0.9px",
    textTransform: "uppercase", 
    color: useColorModeValue("#64748b", "#7c8db5"), 
    mb: "7px",
  };

  const cardStyle = {
    bg: cardBg,
    border: `1px solid ${cardBorder}`,
    boxShadow: isDark ? "0 1px 4px rgba(0,0,0,0.3)" : "0 1px 4px rgba(0,0,0,0.05)",
  };

  const formatValuePreview = () => {
    const val = form.DiscountValue;
    if (form.DiscountType === "Percentage") return `${val || 0}%`;
    if (form.DiscountType === "FixedAmount") return `${Number(val || 0).toLocaleString()}đ`;
    return "1+1";
  };

  const PreviewPanel = () => (
    <Box {...cardStyle} borderRadius="16px" p="18px">
      <SectionTitle label="Xem trước" />
      {form.Title ? (
        <Flex direction="column" gap="12px" sx={{ animation: `${fadeIn} 0.2s ease both` }}>
          <Box p="18px" borderRadius="12px"
            bg={useColorModeValue("linear-gradient(135deg, #fff7ed, #fffbeb)", "#0f172a")}
            border={useColorModeValue("1.5px solid #fed7aa", "1.5px solid #2d3a6b")}
            textAlign="center"
          >
            <Text fontSize="32px" fontWeight="900" color="#f97316" lineHeight="1">
              {formatValuePreview()}
            </Text>
            <Text fontSize="11px" color={useColorModeValue("#b45309", "#94a3b8")} fontWeight="700" mt="4px" letterSpacing="0.6px">
              {TYPE_MAP[form.DiscountType] || form.DiscountType}
            </Text>
          </Box>
          <Box>
            <Text fontSize="10px" color={textSecondary} fontWeight="700" letterSpacing="0.8px" textTransform="uppercase" mb="2px">
              Tên KM
            </Text>
            <Text fontSize="13px" fontWeight="700" color={textPrimary}>{form.Title}</Text>
          </Box>
          <Flex gap="7px" flexWrap="wrap">
            <StatusBadge status={form.Status} />
            <TypeBadge type={form.DiscountType} />
          </Flex>
          {form.StartDate && form.EndDate && (
            <Flex align="center" gap="6px">
              <Icon as={MdCalendarToday} boxSize="11px" color={textSecondary} />
              <Text fontSize="11px" color={textSecondary} fontWeight="600">
                {form.StartDate} → {form.EndDate}
              </Text>
            </Flex>
          )}
          {form.ApplyFor !== "Tất cả phim" && (
            <Flex align="center" gap="6px">
              <Icon as={MdLocalOffer} boxSize="11px" color={textSecondary} />
              <Text fontSize="11px" color={textSecondary} fontWeight="600">
                {form.ApplyFor}{form.ApplyTarget ? `: ${form.ApplyTarget}` : ""}
              </Text>
            </Flex>
          )}
          {form.UsageLimit && (
            <Flex align="center" gap="6px">
              <Icon as={MdBarChart} boxSize="11px" color={textSecondary} />
              <Text fontSize="11px" color={textSecondary} fontWeight="600">
                Giới hạn {Number(form.UsageLimit).toLocaleString()} lượt
              </Text>
            </Flex>
          )}
        </Flex>
      ) : (
        <Flex direction="column" align="center" justify="center" h="120px">
          <Icon as={FaTag} boxSize="24px" color={useColorModeValue("#e2e8f0", "#2d3a6b")} mb="6px" />
          <Text fontSize="12px" color={textSecondary}>Nhập tên để xem trước</Text>
        </Flex>
      )}
    </Box>
  );

  return (
    <Box sx={{ animation: `${scaleIn} 0.3s ease both` }}>
      <Flex align="center" gap="12px" mb="20px" flexWrap={{ base: "wrap", md: "nowrap" }}>
        <Button leftIcon={<Icon as={MdArrowBack} />} variant="ghost"
          color={useColorModeValue("#64748b", "#94a3b8")} 
          borderRadius="10px" h="38px" fontSize="13px" fontWeight="600"
          border={useColorModeValue("1.5px solid #e2e8f0", "1.5px solid #2d3a6b")}
          _hover={{ bg: useColorModeValue("#f8fafc", "#0f172a") }}
          flexShrink="0"
          onClick={onCancel}
        >
          Quay lại
        </Button>
        <Box>
          <Text fontSize={{ base: "17px", md: "20px" }} fontWeight="800" color={textPrimary} letterSpacing="-0.4px">
            {isAdd ? "Thêm khuyến mãi mới" : "Chỉnh sửa khuyến mãi"}
          </Text>
          <Text fontSize="12px" color={textSecondary} mt="2px" noOfLines={1}>
            {isAdd ? "Điền đầy đủ thông tin để tạo chương trình" : promo?.Title}
          </Text>
        </Box>
      </Flex>

      {isMobile && (
        <Box mb="14px">
          <Button w="100%" h="40px" borderRadius="12px" variant="outline"
            color="#f97316" border="1.5px solid #fed7aa"
            bg={useColorModeValue("#fff7ed", "#0f172a")}
            fontSize="13px" fontWeight="700"
            rightIcon={<Icon as={previewOpen ? MdExpandLess : MdExpandMore} />}
            onClick={() => setPreviewOpen(v => !v)}
          >
            {previewOpen ? "Ẩn xem trước" : "Xem trước khuyến mãi"}
          </Button>
          <Collapse in={previewOpen} animateOpacity>
            <Box mt="10px"><PreviewPanel /></Box>
          </Collapse>
        </Box>
      )}

      <Grid templateColumns={{ base: "1fr", lg: "1fr 300px" }} gap="20px">
        <Flex direction="column" gap="16px">
          {/* Thông tin cơ bản */}
          <Box {...cardStyle} borderRadius="16px" p={{ base: "16px", md: "20px" }}>
            <SectionTitle label="Thông tin cơ bản" />
            <Box mb="14px">
              <Text sx={labelStyle}>Tên chương trình *</Text>
              <Input {...inputStyle} placeholder="VD: Thứ 4 Vui Vẻ – Giảm 30%"
                value={form.Title} onChange={e => set("Title", e.target.value)} />
            </Box>
            <Box mb="14px">
              <Text sx={labelStyle}>Mã khuyến mãi</Text>
              <Input {...inputStyle} placeholder="VD: SALE2024"
                value={form.Code} onChange={e => set("Code", e.target.value)} />
            </Box>
            <Box>
              <Text sx={labelStyle}>Mô tả chương trình</Text>
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
                _focus={{ 
                  border: "1.5px solid #f97316", 
                  boxShadow: "0 0 0 3px rgba(249,115,22,0.10)", 
                  bg: useColorModeValue("#fff", "#1b2559") 
                }}
                _hover={{ border: "1.5px solid #f97316" }}
                transition="all 0.2s" 
                rows={3}
                placeholder="Mô tả chi tiết điều kiện và lợi ích của chương trình..."
                value={form.Description} 
                onChange={e => set("Description", e.target.value)}
              />
            </Box>
          </Box>

          {/* Loại khuyến mãi */}
          <Box {...cardStyle} borderRadius="16px" p={{ base: "16px", md: "20px" }}>
            <SectionTitle label="Loại khuyến mãi" />
            <Grid templateColumns={{ base: "1fr", sm: "repeat(3,1fr)" }} gap="10px" mb="18px">
              {DISCOUNT_TYPE_OPTS.map(({ value, label }) => {
                const cfg = TYPE_CONFIG[value];
                const isSelected = form.DiscountType === value;
                return (
                  <Box key={value} p="12px 14px" borderRadius="12px" cursor="pointer"
                    bg={isSelected ? useColorModeValue(cfg.bg, "#0f172a") : useColorModeValue("#f8fafc", "#0f172a")}
                    border={isSelected ? `2px solid ${cfg.border}` : (isDark ? "2px solid #2d3a6b" : "2px solid #f1f5f9")}
                    transition="all 0.2s"
                    onClick={() => { set("DiscountType", value); set("DiscountValue", ""); }}
                  >
                    <Flex align="center" gap="8px">
                      <Box w="28px" h="28px" borderRadius="8px"
                        bg={isSelected ? `${cfg.color}15` : useColorModeValue("#e8edf3", "#1b2559")}
                        display="flex" alignItems="center" justifyContent="center" flexShrink="0"
                      >
                        <Icon as={cfg.icon || FaPercent} boxSize="13px" color={isSelected ? cfg.color : "#94a3b8"} />
                      </Box>
                      <Text fontSize="12px" fontWeight="700" 
                        color={isSelected ? cfg.color : useColorModeValue("#94a3b8", "#7c8db5")}>
                        {label}
                      </Text>
                    </Flex>
                  </Box>
                );
              })}
            </Grid>

            {form.DiscountType !== "BuyOneGetOne" && (
              <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap="14px" mb="14px"
                sx={{ animation: `${fadeIn} 0.2s ease both` }}
              >
                <Box>
                  <Text sx={labelStyle}>
                    {form.DiscountType === "Percentage" ? "Mức giảm (%) *" : "Số tiền giảm (đ) *"}
                  </Text>
                  <Input {...inputStyle} type="number"
                    placeholder={form.DiscountType === "Percentage" ? "VD: 30" : "VD: 50000"}
                    value={form.DiscountValue} 
                    onChange={e => set("DiscountValue", e.target.value)} 
                  />
                </Box>
                <Box>
                  <Text sx={labelStyle}>
                    {form.DiscountType === "Percentage" ? "Giảm tối đa (đ)" : "Đơn tối thiểu (đ)"}
                  </Text>
                  <Input {...inputStyle} type="number"
                    placeholder={form.DiscountType === "Percentage" ? "VD: 50000" : "VD: 100000"}
                    value={form.DiscountType === "Percentage" ? form.MaxDiscount : form.MinOrder}
                    onChange={e => set(form.DiscountType === "Percentage" ? "MaxDiscount" : "MinOrder", e.target.value)} 
                  />
                </Box>
              </Grid>
            )}

            <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap="14px">
              <Box>
                <Text sx={labelStyle}>Đơn hàng tối thiểu (đ)</Text>
                <Input {...inputStyle} type="number" placeholder="VD: 100000 (0 = không giới hạn)"
                  value={form.MinOrder} onChange={e => set("MinOrder", e.target.value)} />
              </Box>
              <Box>
                <Text sx={labelStyle}>Giới hạn lượt dùng</Text>
                <Input {...inputStyle} type="number" placeholder="VD: 500 (0 = không giới hạn)"
                  value={form.UsageLimit} onChange={e => set("UsageLimit", e.target.value)} />
              </Box>
            </Grid>
          </Box>

          {/* Thời gian */}
          <Box {...cardStyle} borderRadius="16px" p={{ base: "16px", md: "20px" }}>
            <SectionTitle label="Thời gian hiệu lực" />
            <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap="14px" mb="14px">
              <Box>
                <Text sx={labelStyle}>Ngày bắt đầu *</Text>
                <Input {...inputStyle} type="date"
                  value={form.StartDate} onChange={e => set("StartDate", e.target.value)} />
              </Box>
              <Box>
                <Text sx={labelStyle}>Ngày kết thúc *</Text>
                <Input {...inputStyle} type="date"
                  value={form.EndDate} onChange={e => set("EndDate", e.target.value)} />
              </Box>
            </Grid>
            {form.StartDate && form.EndDate && (
              <Box p="10px 14px" borderRadius="9px"
                bg={useColorModeValue("#fff7ed", "#0f172a")}
                border={useColorModeValue("1px solid #fed7aa", "1px solid #2d3a6b")}
                sx={{ animation: `${fadeIn} 0.2s ease both` }}
              >
                <Flex align="center" gap="6px">
                  <Icon as={MdBarChart} boxSize="13px" color="#f97316" />
                  <Text fontSize="11.5px" color={useColorModeValue("#b45309", "#94a3b8")} fontWeight="600">
                    Hiệu lực từ <b>{form.StartDate}</b> đến <b>{form.EndDate}</b>
                  </Text>
                </Flex>
              </Box>
            )}
          </Box>

          {/* Đối tượng */}
          <Box {...cardStyle} borderRadius="16px" p={{ base: "16px", md: "20px" }}>
            <SectionTitle label="Đối tượng áp dụng" />
            <Box mb="14px">
              <Text sx={labelStyle}>Áp dụng cho *</Text>
              <Grid templateColumns={{ base: "1fr 1fr", sm: "repeat(4,1fr)" }} gap="8px">
                {APPLY_FOR_OPTS.map(opt => (
                  <Box key={opt} p="10px 12px" borderRadius="9px" cursor="pointer"
                    bg={form.ApplyFor === opt ? useColorModeValue("#fff7ed", "#0f172a") : useColorModeValue("#f8fafc", "#0f172a")}
                    border={form.ApplyFor === opt ? "2px solid #fed7aa" : (isDark ? "2px solid #2d3a6b" : "2px solid #f1f5f9")}
                    transition="all 0.2s"
                    onClick={() => { set("ApplyFor", opt); set("ApplyTarget", ""); }}
                  >
                    <Flex align="center" gap="6px">
                      <Icon as={MdLocalOffer} boxSize="13px"
                        color={form.ApplyFor === opt ? "#f97316" : "#94a3b8"} />
                      <Text fontSize="11px" fontWeight="700"
                        color={form.ApplyFor === opt ? useColorModeValue("#b45309", "#f97316") : useColorModeValue("#64748b", "#7c8db5")}>
                        {opt}
                      </Text>
                    </Flex>
                  </Box>
                ))}
              </Grid>
            </Box>
            {form.ApplyFor !== "Tất cả phim" && (
              <Box sx={{ animation: `${fadeIn} 0.2s ease both` }}>
                <Text sx={labelStyle}>Chọn {form.ApplyFor.replace(" cụ thể","")}</Text>
                <Input {...inputStyle} 
                  placeholder={`Nhập ${form.ApplyFor.replace(" cụ thể","")}...`}
                  value={form.ApplyTarget} 
                  onChange={e => set("ApplyTarget", e.target.value)} 
                />
              </Box>
            )}
          </Box>

          {/* Trạng thái */}
          <Box {...cardStyle} borderRadius="16px" p={{ base: "16px", md: "20px" }}>
            <SectionTitle label="Trạng thái" />
            <Grid templateColumns="repeat(2,1fr)" gap="8px">
              {["Active", "Scheduled", "Paused", "Inactive"].map(s => {
                const labels = {
                  "Active": "Đang diễn ra",
                  "Scheduled": "Sắp diễn ra",
                  "Paused": "Tạm dừng",
                  "Inactive": "Đã kết thúc"
                };
                const cfg = STATUS_CONFIG[s];
                const isSelected = form.Status === s;
                return (
                  <Box key={s} p="10px 14px" borderRadius="9px" cursor="pointer"
                    bg={isSelected ? useColorModeValue(cfg.bg, cfg.darkBg || "#0f172a") : useColorModeValue("#f8fafc", "#0f172a")}
                    border={isSelected ? `2px solid ${isDark ? cfg.darkBorder || cfg.border : cfg.border}` : (isDark ? "2px solid #2d3a6b" : "2px solid #f1f5f9")}
                    transition="all 0.2s"
                    onClick={() => set("Status", s)}
                  >
                    <Flex align="center" gap="7px">
                      <Box w="7px" h="7px" borderRadius="full" bg={cfg.dot}
                        sx={s === "Active" && isSelected ? { animation: `${pulse} 1.8s ease infinite` } : {}}
                      />
                      <Text fontSize="12px" fontWeight="700"
                        color={isSelected ? useColorModeValue(cfg.color, "#e2e8f0") : useColorModeValue("#94a3b8", "#7c8db5")}>
                        {labels[s]}
                      </Text>
                    </Flex>
                  </Box>
                );
              })}
            </Grid>
          </Box>
        </Flex>

        {!isMobile && (
          <Flex direction="column" gap="16px">
            <PreviewPanel />
          </Flex>
        )}
      </Grid>

      {/* Save bar */}
      <Box {...cardStyle} borderRadius="14px" p={{ base: "14px 16px", md: "16px 20px" }} mt="16px"
        position={{ base: "sticky", md: "static" }} bottom="0" zIndex="10"
      >
        <Flex justify={{ base: "stretch", md: "flex-end" }} gap="10px">
          <Button flex={{ base: "1", md: "none" }} h="42px" px="22px" variant="ghost"
            color={useColorModeValue("#64748b", "#94a3b8")} 
            borderRadius="10px" fontWeight="600" fontSize="13px"
            border={useColorModeValue("1.5px solid #e2e8f0", "1.5px solid #2d3a6b")}
            _hover={{ bg: useColorModeValue("#f8fafc", "#0f172a") }} 
            transition="all 0.2s"
            leftIcon={<Icon as={MdClose} />}
            onClick={onCancel}
          >
            Hủy
          </Button>
          <Button flex={{ base: "2", md: "none" }} h="42px" px="28px" borderRadius="10px"
            fontWeight="700" fontSize="13px"
            bg="linear-gradient(135deg, #f97316 0%, #fb923c 60%, #fbbf24 100%)"
            color="#ffffff" boxShadow="0 4px 16px rgba(249,115,22,0.35)"
            _hover={{ boxShadow: "0 8px 24px rgba(249,115,22,0.45)", transform: "translateY(-1px)" }}
            _active={{ transform: "translateY(0)" }} transition="all 0.2s"
            leftIcon={<Icon as={MdCheckCircle} />}
            onClick={() => onSave(form)}
          >
            {isAdd ? "Tạo khuyến mãi" : "Lưu thay đổi"}
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}