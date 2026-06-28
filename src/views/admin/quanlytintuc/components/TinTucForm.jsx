

import { useState, useRef } from "react";
import {
  Box, Grid, Text, Button, Flex, SimpleGrid, FormControl,
  Input, Select, Textarea, Icon, Switch, useColorModeValue,
  useBreakpointValue
} from "@chakra-ui/react";
import {
  MdArrowBack, MdClose, MdCheckCircle, MdCalendarToday,
  MdPerson, MdLink, MdImageSearch, MdLocalOffer, MdCloudUpload,
  MdSchedule
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
  const [uploading, setUploading] = useState(false);

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
  const secondaryBtnHoverBg = useColorModeValue("#f1f5f9", "rgba(255,255,255,0.1)");

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
    
    setUploading(true);
    
    // ✅ Lưu file vào state để gửi lên server
    set("thumbnailFile", file);
    
    // ✅ Đọc file để hiển thị preview
    const reader = new FileReader();
    reader.onload = (ev) => {
      set("thumbnail", ev.target.result);
      setUploading(false);
    };
    reader.onerror = () => {
      alert("Lỗi đọc file");
      setUploading(false);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSubmit = () => {
    // Kiểm tra tiêu đề
    if (!form.title.trim()) {
      alert("Vui lòng nhập tiêu đề bài viết");
      return;
    }
    
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
    };
    
    // ⚠️ QUAN TRỌNG: Xử lý ảnh - CHỈ GỬI FILE
    if (form.thumbnailFile instanceof File) {
      // ✅ Nếu có file mới được chọn
      submitData.ImageFile = form.thumbnailFile;
    }
    // ❌ KHÔNG gửi ImageUrl nếu là URL string
    // Server chỉ chấp nhận file ảnh, không chấp nhận URL
    
    // Xử lý ngày tháng
    if (form.status === "Published") {
      submitData.PublishDate = form.publishDate || new Date().toISOString().slice(0, 10);
    }
    
    if (form.status === "Scheduled" && form.scheduledDate) {
      submitData.ScheduledDate = form.scheduledDate;
    }
    
    console.log("📤 DỮ LIỆU GỬI ĐI:", {
      ...submitData,
      ImageFile: submitData.ImageFile ? `[FILE] ${submitData.ImageFile.name}` : "Không có ảnh mới"
    });
    
    onSave(submitData);
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
                  onChange={(e) => set("slug", e.target.value)} />
              </FormControl>
            </Box>
            <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap="14px" mb="14px">
              <Box>
                <Text sx={labelStyle}>Danh mục *</Text>
                <FormControl>
                  <Select {...inputStyle} value={form.category}
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
                    value={form.author} onChange={(e) => set("author", e.target.value)} />
                </FormControl>
              </Box>
            </Grid>
            <Box mb="14px">
              <Text sx={labelStyle}>Tags (phân cách bằng dấu phẩy)</Text>
              <FormControl>
                <Input {...inputStyle} placeholder="VD: Marvel, Avengers, Phòng vé"
                  value={form.tags} onChange={(e) => set("tags", e.target.value)} />
              </FormControl>
            </Box>
            <Box mb="14px">
              <Text sx={labelStyle}>Phim liên quan</Text>
              <FormControl>
                <Input {...inputStyle} placeholder="Tên phim (nếu có)"
                  value={form.linkedMovie} onChange={(e) => set("linkedMovie", e.target.value)} />
              </FormControl>
            </Box>
            {form.status === "Scheduled" && (
              <Box mb="14px" sx={{ animation: `${fadeIn} 0.25s ease both` }}>
                <Text sx={labelStyle}>Thời gian đăng bài *</Text>
                <FormControl>
                  <Input {...inputStyle} type="datetime-local"
                    value={form.scheduledDate} onChange={(e) => set("scheduledDate", e.target.value)} />
                </FormControl>
                <Text fontSize="11px" color={textMuted} mt="6px">
                  Bài viết sẽ tự động chuyển sang "Đã đăng" khi đến đúng thời gian này.
                </Text>
              </Box>
            )}
            {form.status === "Published" && (
              <Box mb="14px" sx={{ animation: `${fadeIn} 0.25s ease both` }}>
                <Text sx={labelStyle}>Ngày đăng</Text>
                <FormControl>
                  <Input {...inputStyle} type="date"
                    value={form.publishDate} onChange={(e) => set("publishDate", e.target.value)} />
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
                  value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)}
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
                  value={form.content} onChange={(e) => set("content", e.target.value)}
                />
              </FormControl>
            </Box>
          </Box>
        </Flex>

        {/* Right */}
        <Flex direction="column" gap="14px">
          {/* Thumbnail - Có chọn ảnh từ máy */}
          <Box {...cardStyle} borderRadius="16px" p={{ base: "16px", md: "18px" }}>
            <SectionTitle label="Ảnh đại diện" />
            <Text sx={labelStyle} mb="7px">URL ảnh thumbnail</Text>
            <FormControl mb="10px">
              <Input {...inputStyle} placeholder="https://..."
                value={form.thumbnail} onChange={(e) => set("thumbnail", e.target.value)} />
            </FormControl>

            {/* Upload file từ máy */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileSelect}
            />
            <Button
              w="100%" h="40px" borderRadius="9px"
              bg={secondaryBtnBg} color={secondaryBtnColor} border={`1.5px solid ${secondaryBtnBorder}`}
              fontSize="12.5px" fontWeight="600"
              _hover={{ bg: "#fff7ed", color: "#f97316", border: "1.5px solid #fed7aa" }}
              transition="all 0.2s"
              leftIcon={<Icon as={uploading ? MdSchedule : MdCloudUpload} boxSize="16px" />}
              isLoading={uploading} loadingText="Đang tải..."
              onClick={() => fileInputRef.current?.click()}
              mb="12px"
            >
              Tải ảnh lên từ máy tính
            </Button>

            {/* Preview ảnh */}
            {form.thumbnail ? (
              <Box borderRadius="10px" overflow="hidden" border={`1px solid ${cardBorder}`}>
                <img src={form.thumbnail} alt="thumbnail"
                  style={{ width: "100%", display: "block", maxHeight: "180px", objectFit: "cover" }}
                  onError={(e) => { e.target.style.display = "none"; }} />
                {form.thumbnailFile && (
                  <Box p="6px 10px" bg="rgba(16,185,129,0.15)" borderTop={`1px solid ${cardBorder}`}>
                    <Flex align="center" gap="6px">
                      <Icon as={MdCheckCircle} boxSize="12px" color="#10b981" />
                      <Text fontSize="11px" color="#10b981" fontWeight="600">
                        Đã tải lên: {form.thumbnailFile.name}
                      </Text>
                    </Flex>
                  </Box>
                )}
              </Box>
            ) : (
              <Flex direction="column" align="center" justify="center"
                h="100px" borderRadius="10px" bg={dashedBg} border={`2px dashed ${dashedBorder}`}
              >
                <Icon as={MdImageSearch} boxSize="26px" color={textFaint} mb="6px" />
                <Text fontSize="11.5px" color={textMuted}>Chưa có ảnh đại diện</Text>
              </Flex>
            )}
          </Box>

          {/* Status */}
          <Box {...cardStyle} borderRadius="16px" p={{ base: "16px", md: "18px" }}>
            <SectionTitle label="Trạng thái" />
            <FormControl>
              <Select {...inputStyle} value={form.status}
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

      {/* Save bar */}
      <Box {...cardStyle} borderRadius="14px" p={{ base: "14px 16px", md: "16px 20px" }} mt="16px"
        position={{ base: "sticky", md: "static" }} bottom={{ base: "0" }} zIndex="10"
      >
        <Flex justify={{ base: "stretch", md: "flex-end" }} gap="10px">
          <Button flex={{ base: "1", md: "none" }}
            h={{ base: "46px", md: "42px" }} px="22px" variant="ghost"
            color={secondaryBtnColor} borderRadius="10px" fontWeight="600" fontSize="13px"
            border={`1.5px solid ${secondaryBtnBorder}`} _hover={{ bg: secondaryBtnBg }} transition="all 0.2s"
            leftIcon={<Icon as={MdClose} />} onClick={onCancel}>
            Hủy bỏ
          </Button>
          <Button flex={{ base: "2", md: "none" }}
            h={{ base: "46px", md: "42px" }} px="28px" borderRadius="10px"
            fontWeight="700" fontSize="13px"
            bg="linear-gradient(135deg, #f97316 0%, #fb923c 60%, #f97316 100%)"
            color="#ffffff" boxShadow="0 4px 16px rgba(249,115,22,0.35)"
            _hover={{ boxShadow: "0 8px 24px rgba(249,115,22,0.45)", transform: "translateY(-1px)" }}
            _active={{ transform: "translateY(0)" }} transition="all 0.2s"
            leftIcon={<Icon as={MdCheckCircle} />}
            onClick={handleSubmit}>
            {isAdd ? "Đăng bài" : "Lưu thay đổi"}
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}