

import { useState } from "react";
import {
  Box, Grid, Text, Button, Flex, SimpleGrid, FormControl,
  Input, Select, Textarea, Icon, Switch, useColorModeValue,
} from "@chakra-ui/react";
import {
  MdArrowBack, MdClose, MdCheckCircle, MdStar,
  MdCategory, MdEdit, MdAdd
} from "react-icons/md";
import { FaLayerGroup } from "react-icons/fa";
import { SectionTitle } from "./shared/SectionTitle";
import { StatusBadge } from "./shared/StatusBadge";
import { scaleIn, fadeIn } from "./shared/animations";
import { STATUS_OPTS, ICON_OPTIONS, GENRE_PALETTES } from "../constants";

export function TheLoaiForm({ genre, onCancel, onSave, isAdd = false }) {
  const isDark = useColorModeValue(false, true);
  
  const empty = {
    name: "",
    slug: "",
    color: "#f97316",
    icon: "FaTag",
    description: "",
    status: "Active",
    featured: false,
  };

  const [form, setForm] = useState(() => {
    if (genre) {
      return {
        name: genre.Name || genre.name || "",
        slug: genre.Slug || genre.slug || "",
        color: genre.Color || genre.color || "#f97316",
        icon: genre.Icon || genre.icon || "FaTag",
        description: genre.Description || genre.description || "",
        status: genre.Status || genre.status || "Active",
        featured: genre.featured || false,
      };
    }
    return empty;
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toSlug = (str) => {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  };

  const inputBg = useColorModeValue("#fafafa", "#0B1437");
  const inputBorder = useColorModeValue("#e8edf3", "rgba(255,255,255,0.12)");
  const inputColor = useColorModeValue("#1a202c", "#ffffff");
  const placeholderColor = useColorModeValue("#b0bac8", "#8b9bc4");
  const cardBg = useColorModeValue("white", "#111C44");
  const cardBorder = useColorModeValue("#f1f5f9", "rgba(255,255,255,0.08)");
  const textPrimary = useColorModeValue("#0f172a", "#ffffff");
  const textSecondary = useColorModeValue("#475569", "#cbd5e1");
  const textMuted = useColorModeValue("#94a3b8", "#8b9bc4");
  const filterBg = useColorModeValue("#f8fafc", "#1b2559");

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
      bg: useColorModeValue("#ffffff", "#111C44") 
    },
    _hover: { border: "1.5px solid #f97316", bg: useColorModeValue("#ffffff", "#111C44") },
    transition: "all 0.2s ease",
  };

  const labelStyle = {
    fontSize: "10.5px", 
    fontWeight: "800", 
    letterSpacing: "0.9px",
    textTransform: "uppercase", 
    color: useColorModeValue("#64748b", "#8b9bc4"), 
    mb: "7px",
  };

  const cardStyle = {
    bg: cardBg,
    border: `1px solid ${cardBorder}`,
    boxShadow: isDark ? "0 2px 10px rgba(0,0,0,0.3)" : "0 2px 10px rgba(0,0,0,0.04)",
  };

  // Lấy icon component
  const getIconComponent = (key) => {
    const found = ICON_OPTIONS.find(o => o.key === key);
    return found ? found.icon : null;
  };

  const PreviewIcon = getIconComponent(form.icon);

  const handleSubmit = () => {
    if (!form.name.trim()) {
      alert("Vui lòng nhập tên thể loại");
      return;
    }
    const submitData = {
      Name: form.name.trim(),
      Slug: form.slug || toSlug(form.name),
      Color: form.color,
      Icon: form.icon,
      Description: form.description,
      Status: form.status,
      Featured: form.featured,
    };
    onSave(submitData);
  };

  return (
    <Box sx={{ animation: `${scaleIn} 0.3s ease both` }}>
      {/* Header */}
      <Flex align={{ base: "flex-start", sm: "center" }} gap="12px" mb="22px"
        direction={{ base: "column", sm: "row" }}
      >
        <Button leftIcon={<Icon as={MdArrowBack} />} variant="ghost"
          color={textSecondary} borderRadius="10px" h="38px" fontSize="13px" fontWeight="600"
          border={`1.5px solid ${cardBorder}`}
          _hover={{ bg: filterBg }}
          flexShrink="0" onClick={onCancel}
        >
          Quay lại
        </Button>
        <Box>
          <Flex align="center" gap="8px">
            <Box w="30px" h="30px" borderRadius="8px"
              bg="linear-gradient(135deg, #f97316, #fbbf24)"
              display="flex" alignItems="center" justifyContent="center"
            >
              <Icon as={isAdd ? MdAdd : MdEdit} boxSize="14px" color="white" />
            </Box>
            <Text fontSize={{ base: "18px", md: "22px" }} fontWeight="800" color={textPrimary}>
              {isAdd ? "Thêm thể loại mới" : `Chỉnh sửa: ${genre?.name}`}
            </Text>
          </Flex>
          <Text fontSize="12px" color={textMuted} mt="2px" pl="38px">
            {isAdd ? "Tạo thể loại phim mới cho hệ thống" : "Cập nhật thông tin thể loại"}
          </Text>
        </Box>
      </Flex>

      <Grid templateColumns={{ base: "1fr", lg: "1fr 320px" }} gap="16px">
        {/* Left */}
        <Flex direction="column" gap="14px">
          {/* Basic info */}
          <Box {...cardStyle} borderRadius="16px" p={{ base: "16px", md: "22px" }}>
            <SectionTitle label="Thông tin cơ bản" />
            <Flex direction="column" gap="14px">
              <Box>
                <Text sx={labelStyle}>Tên thể loại *</Text>
                <Input {...inputStyle} placeholder="VD: Hành động, Kinh dị..."
                  value={form.name} 
                  onChange={(e) => {
                    set("name", e.target.value);
                    if (!form.slug || isAdd) set("slug", toSlug(e.target.value));
                  }} 
                />
              </Box>
              <Box>
                <Text sx={labelStyle}>Slug (URL)</Text>
                <Input {...inputStyle} placeholder="tu-dong-tao"
                  value={form.slug} 
                  onChange={(e) => set("slug", e.target.value)}
                  bg={form.slug ? (isDark ? "rgba(16,185,129,0.08)" : "#f0fdf4") : inputBg}
                />
                {form.slug && (
                  <Text fontSize="10px" color="#10b981" mt="4px" fontWeight="600">
                    ✓ URL: /the-loai/{form.slug}
                  </Text>
                )}
              </Box>
              <Box>
                <Text sx={labelStyle}>Mô tả thể loại</Text>
                <Textarea
                  bg={inputBg} border={`1.5px solid ${inputBorder}`} borderRadius="10px"
                  color={inputColor} fontSize="14px" fontWeight="500" px="14px" py="10px"
                  _placeholder={{ color: placeholderColor }}
                  _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.10)", bg: cardBg }}
                  _hover={{ border: "1.5px solid #f97316" }}
                  transition="all 0.2s"
                  rows={3} placeholder="Mô tả ngắn về thể loại phim này..."
                  value={form.description} onChange={(e) => set("description", e.target.value)}
                />
              </Box>
            </Flex>
          </Box>

          {/* Status & Featured */}
          <Box {...cardStyle} borderRadius="16px" p={{ base: "16px", md: "22px" }}>
            <SectionTitle label="Trạng thái & Cài đặt" />
            <Flex direction="column" gap="16px">
              <Box>
                <Text sx={labelStyle}>Trạng thái hiển thị</Text>
                <Flex gap="10px">
                  {STATUS_OPTS.map((s) => (
                    <Box
                      key={s.value}
                      flex="1" p="10px 14px" borderRadius="10px" cursor="pointer"
                      bg={form.status === s.value
                        ? (s.value === "Active"
                          ? (isDark ? "rgba(16,185,129,0.12)" : "#ecfdf5")
                          : (isDark ? "#1b2559" : "#f9fafb"))
                        : filterBg}
                      border={form.status === s.value
                        ? (s.value === "Active" ? "2px solid #6ee7b7" : `2px solid ${cardBorder}`)
                        : "2px solid transparent"}
                      onClick={() => set("status", s.value)}
                      transition="all 0.15s"
                    >
                      <Flex align="center" gap="6px">
                        <Box w="6px" h="6px" borderRadius="full"
                          bg={s.value === "Active" ? "#10b981" : "#9ca3af"} />
                        <Text fontSize="12px" fontWeight="700"
                          color={form.status === s.value ? (s.value === "Active" ? "#059669" : textSecondary) : textMuted}>
                          {s.label}
                        </Text>
                      </Flex>
                    </Box>
                  ))}
                </Flex>
              </Box>

              {/* Featured toggle */}
              <Box p="12px 14px" borderRadius="10px"
                bg={form.featured ? (isDark ? "rgba(249,115,22,0.08)" : "#fff7ed") : filterBg}
                border={`1.5px solid ${form.featured ? (isDark ? "rgba(249,115,22,0.3)" : "#fed7aa") : cardBorder}`}
                cursor="pointer"
                onClick={() => set("featured", !form.featured)}
                transition="all 0.2s"
              >
                <Flex align="center" justify="space-between">
                  <Box>
                    <Flex align="center" gap="6px" mb="2px">
                      <Icon as={MdStar} boxSize="14px" color={form.featured ? "#f59e0b" : textMuted} />
                      <Text fontSize="13px" fontWeight="700"
                        color={form.featured ? (isDark ? "#fbbf24" : "#b45309") : textPrimary}>
                        Thể loại nổi bật
                      </Text>
                    </Flex>
                    <Text fontSize="11px" color={textMuted}>Hiển thị badge HOT trên thẻ thể loại</Text>
                  </Box>
                  <Box w="38px" h="22px" borderRadius="full" transition="all 0.2s"
                    bg={form.featured ? "linear-gradient(135deg, #f97316, #fbbf24)" : (isDark ? "#1b2559" : "#e2e8f0")}
                    position="relative"
                    boxShadow={form.featured ? "0 2px 8px rgba(249,115,22,0.4)" : "none"}
                  >
                    <Box
                      w="18px" h="18px" borderRadius="full" bg="white"
                      position="absolute" top="2px"
                      left={form.featured ? "18px" : "2px"}
                      transition="all 0.2s"
                      boxShadow="0 1px 4px rgba(0,0,0,0.15)"
                    />
                  </Box>
                </Flex>
              </Box>
            </Flex>
          </Box>
        </Flex>

        {/* Right - Preview */}
        <Box {...cardStyle} borderRadius="16px" p={{ base: "16px", md: "20px" }}
          position={{ base: "static", lg: "sticky" }} top="90px"
        >
          <SectionTitle label="Xem trước" />
          {form.name ? (
            <Box sx={{ animation: `${fadeIn} 0.3s ease both` }}>
              <Text fontSize="10px" color={textMuted} fontWeight="700" letterSpacing="0.8px"
                textTransform="uppercase" mb="12px">
                Thẻ thể loại
              </Text>
              <Box borderRadius="14px" border={`1.5px solid ${form.color}40`}
                overflow="hidden"
                boxShadow={`0 4px 16px ${form.color}22`}
                bg={cardBg}
              >
                <Box h="3px" bg={`linear-gradient(90deg, ${form.color}, ${form.color}88)`} />
                <Box p="14px">
                  <Flex align="center" gap="8px" mb="8px">
                    <Box w="32px" h="32px" borderRadius="9px"
                      bg={`${form.color}18`}
                      border={`1.5px solid ${form.color}40`}
                      display="flex" alignItems="center" justifyContent="center"
                    >
                      {PreviewIcon && <Icon as={PreviewIcon} boxSize="12px" color={form.color} />}
                    </Box>
                    <Box>
                      <Flex align="center" gap="5px">
                        <Text fontSize="14px" fontWeight="800" color={textPrimary}>{form.name}</Text>
                        {form.featured && (
                          <Box px="4px" py="1px" borderRadius="4px"
                            bg="linear-gradient(135deg, #f97316, #fbbf24)">
                            <Text fontSize="7px" fontWeight="800" color="white">HOT</Text>
                          </Box>
                        )}
                      </Flex>
                      {form.slug && <Text fontSize="10px" color={textMuted}>/{form.slug}</Text>}
                    </Box>
                  </Flex>
                  {form.description && (
                    <Text fontSize="11.5px" color={textMuted} lineHeight="1.6" noOfLines={2}>
                      {form.description}
                    </Text>
                  )}
                  <Flex mt="10px" align="center" gap="6px">
                    <Box w="6px" h="6px" borderRadius="full"
                      bg={form.status === "Active" ? "#10b981" : "#9ca3af"} />
                    <Text fontSize="10px" fontWeight="600"
                      color={form.status === "Active" ? "#059669" : textMuted}>
                      {form.status === "Active" ? "Đang hiển thị" : "Đang ẩn"}
                    </Text>
                  </Flex>
                </Box>
              </Box>
            </Box>
          ) : (
            <Flex direction="column" align="center" justify="center" h="160px" color={textMuted}>
              <Icon as={MdCategory} boxSize="28px" mb="6px" />
              <Text fontSize="12px" color={textMuted}>Nhập tên thể loại để xem trước</Text>
            </Flex>
          )}
        </Box>
      </Grid>

      {/* Save bar */}
      <Box {...cardStyle} borderRadius="14px" p={{ base: "14px 16px", md: "16px 22px" }} mt="16px"
        position={{ base: "sticky", md: "static" }} bottom="0" zIndex="10"
      >
        <Flex justify={{ base: "stretch", md: "flex-end" }} gap="10px">
          <Button flex={{ base: "1", md: "none" }}
            h="44px" px="22px" variant="ghost" color={textSecondary} borderRadius="10px"
            fontWeight="600" fontSize="13px" border={`1.5px solid ${cardBorder}`}
            _hover={{ bg: filterBg }} transition="all 0.2s"
            leftIcon={<Icon as={MdClose} />}
            onClick={onCancel}
          >
            Hủy bỏ
          </Button>
          <Button flex={{ base: "2", md: "none" }}
            h="44px" px="28px" borderRadius="10px" fontWeight="700" fontSize="13px"
            bg="linear-gradient(135deg, #f97316 0%, #fb923c 60%, #fbbf24 100%)"
            color="white" boxShadow="0 4px 18px rgba(249,115,22,0.38)"
            _hover={{ boxShadow: "0 8px 28px rgba(249,115,22,0.48)", transform: "translateY(-1px)" }}
            _active={{ transform: "translateY(0)" }} transition="all 0.2s"
            leftIcon={<Icon as={MdCheckCircle} />}
            onClick={handleSubmit}
          >
            {isAdd ? "Thêm thể loại" : "Lưu thay đổi"}
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}