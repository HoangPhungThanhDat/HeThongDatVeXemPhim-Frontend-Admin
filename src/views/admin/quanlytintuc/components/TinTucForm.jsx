// views/admin/quanlytintuc/components/TinTucForm.jsx

import { useState, useRef } from "react";
import {
  Box, Grid, Text, Button, Flex, SimpleGrid, FormControl,
  Input, Select, Textarea, Icon, Switch, useColorModeValue,
  useBreakpointValue, Spinner, Image
} from "@chakra-ui/react";
import {
  MdArrowBack, MdClose, MdCheckCircle, MdCalendarToday,
  MdPerson, MdLink, MdImageSearch, MdLocalOffer, MdCloudUpload,
  MdSchedule, MdDelete
} from "react-icons/md";
import { FaNewspaper } from "react-icons/fa";
import { SectionTitle } from "./shared/SectionTitle";
import { StatusBadge } from "./shared/StatusBadge";
import { CategoryBadge } from "./shared/CategoryBadge";
import { scaleIn, fadeIn } from "./shared/animations";
import { CATEGORY_OPTS, STATUS_OPTS } from "../constants";

export function TinTucForm({ article, onCancel, onSave, isAdd = false }) {
  const isDark = useColorModeValue(false, true);
  const isMobile = useBreakpointValue({ base: true, xl: false });
  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const empty = {
    title: "",
    slug: "",
    category: "Tin tức",
    tags: "",
    status: "Draft",
    author: "",
    publishDate: "",
    scheduledDate: "",
    thumbnail: "",
    thumbnailFile: null,
    excerpt: "",
    content: "",
    linkedMovie: "",
    featured: false,
  };

  const [form, setForm] = useState(() => {
    if (article) {
      return {
        title: article.Title || article.title || "",
        slug: article.Slug || article.slug || "",
        category: article.Category || article.category || "Tin tức",
        tags: Array.isArray(article.Tags || article.tags) 
          ? (article.Tags || article.tags).join(", ") 
          : (article.Tags || article.tags || ""),
        status: article.Status || article.status || "Draft",
        author: article.Author || article.author || "",
        publishDate: article.PublishDate || article.publishDate || "",
        scheduledDate: article.ScheduledDate || article.scheduledDate || "",
        thumbnail: article.ImageUrl || article.imageUrl || article.thumbnail || "",
        thumbnailFile: null,
        excerpt: article.Excerpt || article.excerpt || "",
        content: article.Content || article.content || "",
        linkedMovie: article.LinkedMovie || article.linkedMovie || "",
        featured: article.Featured || article.featured || false,
      };
    }
    return empty;
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const inputBg = useColorModeValue("#fafafa", "#0B1437");
  const inputBorder = useColorModeValue("#e8edf3", "rgba(255,255,255,0.12)");
  const inputColor = useColorModeValue("#1a202c", "#ffffff");
  const placeholderColor = useColorModeValue("#b0bac8", "#8b9bc4");
  const cardBg = useColorModeValue("white", "#111C44");
  const cardBorder = useColorModeValue("#f1f5f9", "rgba(255,255,255,0.08)");
  const textPrimary = useColorModeValue("#0f172a", "#ffffff");
  const textSecondary = useColorModeValue("#475569", "#cbd5e1");
  const textMuted = useColorModeValue("#94a3b8", "#8b9bc4");
  const textFaint = useColorModeValue("#cbd5e1", "#3c4b70");
  const dashedBg = useColorModeValue("#f8fafc", "rgba(255,255,255,0.03)");
  const dashedBorder = useColorModeValue("#e2e8f0", "rgba(255,255,255,0.18)");
  const tagBg = useColorModeValue("#fff7ed", "rgba(194,65,12,0.16)");
  const tagBorder = useColorModeValue("#fed7aa", "rgba(253,186,116,0.35)");
  const tagText = useColorModeValue("#c2410c", "#fdba74");
  const secondaryBtnBg = useColorModeValue("#f8fafc", "rgba(255,255,255,0.05)");
  const secondaryBtnBorder = useColorModeValue("#e2e8f0", "rgba(255,255,255,0.14)");
  const secondaryBtnColor = useColorModeValue("#475569", "#cbd5e1");

  const inputStyle = {
    bg: inputBg,
    border: `1.5px solid ${inputBorder}`,
    borderRadius: "10px",
    color: inputColor,
    fontSize: "14px",
    fontWeight: "500",
    px: "14px",
    h: { base: "48px", md: "44px" },
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
    boxShadow: isDark ? "0 1px 4px rgba(0,0,0,0.3)" : "0 1px 4px rgba(0,0,0,0.04)",
  };

  // Xử lý chọn file ảnh
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
    
    set("thumbnailFile", file);
    
    // Tạo preview
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target.result);
      set("thumbnail", ev.target.result);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Xóa ảnh
  const handleRemoveImage = () => {
    set("thumbnailFile", null);
    set("thumbnail", null);
    setImagePreview(null);
  };

  //  HÀM XỬ LÝ SUBMIT VỚI LOADING
  const handleSubmit = async () => {
    // Kiểm tra validate
    if (!form.title.trim()) {
      alert("Vui lòng nhập tiêu đề bài viết");
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Chuẩn bị dữ liệu gửi đi
      const submitData = {
        Title: form.title.trim(),
        Slug: form.slug || generateSlug(form.title),
        Category: form.category || "Tin tức",
        Tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
        Status: form.status || "Draft",
        Author: form.author.trim() || "Unknown",
        Excerpt: form.excerpt || "",
        Content: form.content || "",
        LinkedMovie: form.linkedMovie || "",
        Featured: form.featured || false,
        ImageFile: form.thumbnailFile || null,
      };
      
      // Xử lý ngày tháng
      if (form.status === "Published") {
        submitData.PublishDate = form.publishDate || new Date().toISOString().slice(0, 10);
      }
      
      if (form.status === "Scheduled" && form.scheduledDate) {
        submitData.ScheduledDate = form.scheduledDate;
      }
      
      await onSave(submitData);
    } catch (error) {
      console.error("Lỗi khi submit form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ animation: `${scaleIn} 0.3s ease both` }}>
      {/* Header */}
      <Flex align={{ base: "flex-start", sm: "center" }} gap="12px" mb="20px"
        direction={{ base: "column", sm: "row" }}
      >
        <Button leftIcon={<Icon as={MdArrowBack} />} variant="ghost"
          color={secondaryBtnColor} borderRadius="10px" h="38px" fontSize="13px" fontWeight="600"
          border={`1.5px solid ${secondaryBtnBorder}`} _hover={{ bg: secondaryBtnBg }} flexShrink="0"
          onClick={onCancel}
          isDisabled={isSubmitting}
        >
          Quay lại
        </Button>
        <Box>
          <Text fontSize={{ base: "17px", md: "20px" }} fontWeight="800" color={textPrimary} letterSpacing="-0.4px">
            {isAdd ? "✍️ Viết bài mới" : `Chỉnh sửa: ${article?.title}`}
          </Text>
          <Text fontSize="12px" color={textMuted} mt="2px">
            {isAdd ? "Soạn và đăng bài tin tức, review phim, sự kiện" : "Cập nhật nội dung bài viết"}
          </Text>
        </Box>
      </Flex>

      <Grid templateColumns={{ base: "1fr", xl: "1fr 320px" }} gap="16px">
        {/* Left */}
        <Flex direction="column" gap="14px">
          {/* Basic info */}
          <Box {...cardStyle} borderRadius="16px" p={{ base: "16px", md: "20px" }}>
            <SectionTitle label="Thông tin bài viết" />
            <Box mb="14px">
              <Text sx={labelStyle}>Tiêu đề *</Text>
              <FormControl>
                <Input {...inputStyle} placeholder="Nhập tiêu đề bài viết..."
                  value={form.title}
                  isDisabled={isSubmitting}
                  onChange={(e) => {
                    set("title", e.target.value);
                    if (isAdd) set("slug", generateSlug(e.target.value));
                  }} />
              </FormControl>
            </Box>
            <Box mb="14px">
              <Text sx={labelStyle}>Slug (URL)</Text>
              <FormControl>
                <Input {...inputStyle} placeholder="ten-bai-viet-slug"
                  value={form.slug}
                  isDisabled={isSubmitting}
                  onChange={(e) => set("slug", e.target.value)} />
              </FormControl>
            </Box>
            <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap="14px" mb="14px">
              <Box>
                <Text sx={labelStyle}>Danh mục *</Text>
                <FormControl>
                  <Select {...inputStyle} value={form.category}
                    isDisabled={isSubmitting}
                    onChange={(e) => set("category", e.target.value)}>
                    {CATEGORY_OPTS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box>
                <Text sx={labelStyle}>Tác giả</Text>
                <FormControl>
                  <Input {...inputStyle} placeholder="Tên tác giả"
                    value={form.author} 
                    isDisabled={isSubmitting}
                    onChange={(e) => set("author", e.target.value)} />
                </FormControl>
              </Box>
            </Grid>
            <Box mb="14px">
              <Text sx={labelStyle}>Tags (phân cách bằng dấu phẩy)</Text>
              <FormControl>
                <Input {...inputStyle} placeholder="VD: Marvel, Avengers, Phòng vé"
                  value={form.tags} 
                  isDisabled={isSubmitting}
                  onChange={(e) => set("tags", e.target.value)} />
              </FormControl>
            </Box>
            <Box mb="14px">
              <Text sx={labelStyle}>Phim liên quan</Text>
              <FormControl>
                <Input {...inputStyle} placeholder="Tên phim (nếu có)"
                  value={form.linkedMovie} 
                  isDisabled={isSubmitting}
                  onChange={(e) => set("linkedMovie", e.target.value)} />
              </FormControl>
            </Box>
            {form.status === "Scheduled" && (
              <Box mb="14px" sx={{ animation: `${fadeIn} 0.25s ease both` }}>
                <Text sx={labelStyle}>Thời gian đăng bài *</Text>
                <FormControl>
                  <Input {...inputStyle} type="datetime-local"
                    value={form.scheduledDate} 
                    isDisabled={isSubmitting}
                    onChange={(e) => set("scheduledDate", e.target.value)} />
                </FormControl>
              </Box>
            )}
            {form.status === "Published" && (
              <Box mb="14px" sx={{ animation: `${fadeIn} 0.25s ease both` }}>
                <Text sx={labelStyle}>Ngày đăng</Text>
                <FormControl>
                  <Input {...inputStyle} type="date"
                    value={form.publishDate} 
                    isDisabled={isSubmitting}
                    onChange={(e) => set("publishDate", e.target.value)} />
                </FormControl>
              </Box>
            )}
          </Box>

          {/* Excerpt & Content */}
          <Box {...cardStyle} borderRadius="16px" p={{ base: "16px", md: "20px" }}>
            <SectionTitle label="Mô tả ngắn & Nội dung" />
            <Box mb="14px">
              <Text sx={labelStyle}>Mô tả ngắn (excerpt)</Text>
              <FormControl>
                <Textarea
                  bg={inputBg} border={`1.5px solid ${inputBorder}`} borderRadius="10px"
                  color={inputColor} fontSize="14px" fontWeight="500" px="14px" py="10px"
                  _placeholder={{ color: placeholderColor }}
                  _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.1)", bg: useColorModeValue("#ffffff", "#111C44") }}
                  _hover={{ border: "1.5px solid #f97316" }}
                  transition="all 0.2s" rows={3}
                  placeholder="Viết mô tả ngắn hiển thị trên trang danh sách..."
                  value={form.excerpt} 
                  isDisabled={isSubmitting}
                  onChange={(e) => set("excerpt", e.target.value)}
                />
              </FormControl>
            </Box>
            <Box>
              <Text sx={labelStyle}>Nội dung bài viết</Text>
              <FormControl>
                <Textarea
                  bg={inputBg} border={`1.5px solid ${inputBorder}`} borderRadius="10px"
                  color={inputColor} fontSize="14px" fontWeight="500" px="14px" py="10px"
                  _placeholder={{ color: placeholderColor }}
                  _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.1)", bg: useColorModeValue("#ffffff", "#111C44") }}
                  _hover={{ border: "1.5px solid #f97316" }}
                  transition="all 0.2s" rows={10}
                  placeholder="Nhập nội dung đầy đủ của bài viết..."
                  value={form.content} 
                  isDisabled={isSubmitting}
                  onChange={(e) => set("content", e.target.value)}
                />
              </FormControl>
            </Box>
          </Box>
        </Flex>

        {/* Right */}
        <Flex direction="column" gap="14px">
          {/* Thumbnail */}
          <Box {...cardStyle} borderRadius="16px" p={{ base: "16px", md: "18px" }}>
            <SectionTitle label="Ảnh đại diện" />
            
            {/* Hiển thị ảnh hiện tại */}
            {(form.thumbnail || imagePreview) && (
              <Box position="relative" mb="12px" borderRadius="10px" overflow="hidden" border={`1px solid ${cardBorder}`}>
                <Image 
                  src={imagePreview || form.thumbnail} 
                  alt="Thumbnail"
                  objectFit="cover"
                  w="100%"
                  h="160px"
                  fallbackSrc="https://via.placeholder.com/800x450?text=Không+có+ảnh"
                />
                <Button
                  position="absolute"
                  top="8px"
                  right="8px"
                  size="sm"
                  colorScheme="red"
                  borderRadius="full"
                  onClick={handleRemoveImage}
                  isDisabled={isSubmitting}
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
              bg={secondaryBtnBg} color={secondaryBtnColor} border={`1.5px solid ${secondaryBtnBorder}`}
              fontSize="12.5px" fontWeight="600"
              _hover={{ bg: "#fff7ed", color: "#f97316", border: "1.5px solid #fed7aa" }}
              transition="all 0.2s"
              leftIcon={<Icon as={MdCloudUpload} boxSize="16px" />}
              onClick={() => fileInputRef.current?.click()}
              isDisabled={isSubmitting}
              mb="12px"
            >
              {form.thumbnailFile ? 'Thay đổi ảnh' : 'Tải ảnh lên từ máy tính'}
            </Button>

            <Text sx={labelStyle}>Hoặc nhập URL ảnh</Text>
            <FormControl>
              <Input {...inputStyle} placeholder="https://..."
                value={form.thumbnail} 
                isDisabled={isSubmitting}
                onChange={(e) => set("thumbnail", e.target.value)} />
            </FormControl>
            <Text fontSize="11px" color={textMuted} mt="6px">
              JPG, PNG, WebP (tối đa 5MB)
            </Text>
          </Box>

          {/* Status */}
          <Box {...cardStyle} borderRadius="16px" p={{ base: "16px", md: "18px" }}>
            <SectionTitle label="Trạng thái" />
            <FormControl>
              <Select {...inputStyle} value={form.status}
                isDisabled={isSubmitting}
                onChange={(e) => set("status", e.target.value)}>
                {STATUS_OPTS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Settings */}
          <Box {...cardStyle} borderRadius="16px" p={{ base: "16px", md: "18px" }}>
            <SectionTitle label="Cài đặt bài viết" />
            <Flex align="center" justify="space-between" mb="16px">
              <Box>
                <Text fontSize="13px" fontWeight="700" color={textPrimary}>Bài viết nổi bật</Text>
                <Text fontSize="11px" color={textMuted} mt="2px">Hiển thị trên banner trang chủ</Text>
              </Box>
              <Switch colorScheme="orange" size="md"
                isChecked={form.featured}
                isDisabled={isSubmitting}
                onChange={(e) => set("featured", e.target.checked)}
              />
            </Flex>
          </Box>

          {/* Preview mini */}
          {form.title && (
            <Box {...cardStyle} borderRadius="16px" p={{ base: "16px", md: "18px" }}>
              <SectionTitle label="Xem trước" />
              <Flex direction="column" gap="8px">
                <Text fontSize="13px" fontWeight="700" color={textPrimary} noOfLines={2}>{form.title}</Text>
                <Flex gap="6px" flexWrap="wrap">
                  {form.status && <StatusBadge status={form.status} />}
                  {form.category && <CategoryBadge category={form.category} />}
                </Flex>
                {form.author && (
                  <Flex align="center" gap="5px">
                    <Icon as={MdPerson} boxSize="11px" color={textMuted} />
                    <Text fontSize="11.5px" color={textSecondary} fontWeight="600">{form.author}</Text>
                  </Flex>
                )}
                {form.tags && form.tags.split(",").filter(t => t.trim()).length > 0 && (
                  <Flex gap="5px" flexWrap="wrap">
                    {form.tags.split(",").filter(t => t.trim()).slice(0, 3).map(tg => (
                      <Box key={tg} px="6px" py="2px" borderRadius="5px" bg={tagBg} border={`1px solid ${tagBorder}`}>
                        <Text fontSize="10px" fontWeight="600" color={tagText}># {tg.trim()}</Text>
                      </Box>
                    ))}
                  </Flex>
                )}
              </Flex>
            </Box>
          )}
        </Flex>
      </Grid>

      {/* Save bar với loading state */}
      <Box {...cardStyle} borderRadius="14px" p={{ base: "14px 16px", md: "16px 20px" }} mt="16px"
        position={{ base: "sticky", md: "static" }} bottom={{ base: "0" }} zIndex="10"
      >
        <Flex justify={{ base: "stretch", md: "flex-end" }} gap="10px">
          <Button flex={{ base: "1", md: "none" }}
            h={{ base: "46px", md: "42px" }} px="22px" variant="ghost"
            color={secondaryBtnColor} borderRadius="10px" fontWeight="600" fontSize="13px"
            border={`1.5px solid ${secondaryBtnBorder}`} _hover={{ bg: secondaryBtnBg }} transition="all 0.2s"
            leftIcon={<Icon as={MdClose} />} onClick={onCancel}
            isDisabled={isSubmitting}>
            Hủy bỏ
          </Button>
          <Button flex={{ base: "2", md: "none" }}
            h={{ base: "46px", md: "42px" }} px="28px" borderRadius="10px"
            fontWeight="700" fontSize="13px"
            bg="linear-gradient(135deg, #f97316 0%, #fb923c 60%, #f97316 100%)"
            color="#ffffff" boxShadow="0 4px 16px rgba(249,115,22,0.35)"
            _hover={{ boxShadow: isSubmitting ? "0 4px 16px rgba(249,115,22,0.35)" : "0 8px 24px rgba(249,115,22,0.45)", transform: isSubmitting ? "none" : "translateY(-1px)" }}
            _active={{ transform: "translateY(0)" }} transition="all 0.2s"
            leftIcon={isSubmitting ? <Spinner size="sm" color="white" /> : <Icon as={MdCheckCircle} />}
            onClick={handleSubmit}
            isDisabled={isSubmitting}
            opacity={isSubmitting ? 0.8 : 1}
          >
            {isSubmitting ? "Đang xử lý..." : (isAdd ? "Đăng bài" : "Lưu thay đổi")}
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}