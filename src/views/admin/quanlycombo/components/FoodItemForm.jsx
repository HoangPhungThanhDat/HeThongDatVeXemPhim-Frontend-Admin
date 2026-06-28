// src/views/admin/quanlycombo/components/FoodItemForm.jsx

import React, { useState, useRef } from "react";
import {
  Box, Flex, Text, Button, Icon, Grid, Input, Select,
  Textarea, Switch, Image,
} from "@chakra-ui/react";
import {
  MdArrowBack, MdClose, MdCheckCircle, MdAdd,
  MdImageSearch, MdUpload, MdDelete,
} from "react-icons/md";
import { FaBoxOpen, FaPercent } from "react-icons/fa";
import Swal from "sweetalert2";
import { SectionTitle } from "./shared/SectionTitle";
import { TagBadge } from "./TagBadge";
import { DARK, EMPTY_FORM } from "../constants";
import { scaleIn, fadeIn } from "./shared/animations";

// Input styles
const inputStyle = (isDark) => ({
  bg: isDark ? DARK.ink6 : "#fafafa",
  border: isDark ? `1.5px solid ${DARK.ink5}` : "1.5px solid #e8edf3",
  borderRadius: "10px",
  color: isDark ? DARK.ink : "#1a202c",
  fontSize: "14px",
  fontWeight: "500",
  px: "14px",
  h: "44px",
  _placeholder: { color: isDark ? DARK.ink4 : "#b0bac8", fontWeight: "400" },
  _focus: {
    border: "1.5px solid #f97316",
    boxShadow: "0 0 0 3px rgba(249,115,22,0.10)",
    bg: isDark ? DARK.bgCard : "#ffffff"
  },
  _hover: {
    border: "1.5px solid #f97316",
    bg: isDark ? DARK.bgCard : "#ffffff"
  },
  transition: "all 0.2s ease",
});

const labelStyle = (isDark) => ({
  fontSize: "10.5px",
  fontWeight: "800",
  letterSpacing: "0.9px",
  textTransform: "uppercase",
  color: isDark ? DARK.ink3 : "#64748b",
  mb: "7px",
  display: "block",
});

export const ComboForm = ({ combo, onCancel, onSave, isAdd = false, isDark }) => {
  const fileInputRef = useRef(null);
  
  // ✅ Khởi tạo form với dữ liệu từ combo (nếu có)
  const [form, setForm] = useState(() => {
    if (combo) {
      return {
        ...combo,
        items: [...(combo.items || [])],
        imageFile: null,
        imageUrl: combo.image || "",
        image: combo.image || "",
      };
    }
    return {
      ...EMPTY_FORM,
      imageFile: null,
      imageUrl: "",
      image: "",
    };
  });
  
  const [imagePreview, setImagePreview] = useState(combo?.image || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const setItem = (i, val) => {
    const arr = [...form.items];
    arr[i] = val;
    set("items", arr);
  };
  
  const addItem = () => set("items", [...form.items, ""]);
  
  const removeItem = (i) => set("items", form.items.filter((_, idx) => idx !== i));

  const discount = form.originalPrice && form.price
    ? Math.round(((Number(form.originalPrice) - Number(form.price)) / Number(form.originalPrice)) * 100)
    : 0;

  // Xử lý chọn file ảnh
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Kiểm tra kích thước file (tối đa 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "warning",
          title: "File ảnh quá lớn! Tối đa 5MB",
          showConfirmButton: false,
          timer: 3000,
        });
        e.target.value = "";
        return;
      }
      
      // Kiểm tra định dạng file
      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "warning",
          title: "Định dạng không hỗ trợ! Chỉ JPG, PNG, GIF, WEBP",
          showConfirmButton: false,
          timer: 3000,
        });
        e.target.value = "";
        return;
      }
      
      // Lưu file và tạo preview
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      set("imageFile", file);
      set("imageUrl", ""); // Xóa URL cũ
      set("image", ""); // Xóa image cũ
    }
  };

  // Xóa ảnh đã chọn
  const handleRemoveImage = () => {
    setImagePreview("");
    set("image", "");
    set("imageUrl", "");
    set("imageFile", null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Xử lý nhập URL ảnh
  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    set("imageUrl", url);
    set("image", url);
    setImagePreview(url);
    set("imageFile", null); // Xóa file nếu có
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ✅ Hàm submit form
  const handleSubmit = async () => {
    try {
      // Kiểm tra các trường bắt buộc
      if (!form.name || form.name.trim() === "") {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "warning",
          title: "Vui lòng nhập tên combo!",
          showConfirmButton: false,
          timer: 3000,
        });
        return;
      }

      if (!form.price || Number(form.price) <= 0) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "warning",
          title: "Vui lòng nhập giá bán hợp lệ!",
          showConfirmButton: false,
          timer: 3000,
        });
        return;
      }

      if (!form.category) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "warning",
          title: "Vui lòng chọn danh mục!",
          showConfirmButton: false,
          timer: 3000,
        });
        return;
      }

      // Kiểm tra thành phần combo (ít nhất 1 mục)
      const validItems = form.items.filter(i => i.trim() !== "");
      if (validItems.length === 0) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "warning",
          title: "Vui lòng thêm ít nhất 1 thành phần!",
          showConfirmButton: false,
          timer: 3000,
        });
        return;
      }

      setIsSubmitting(true);

      // ✅ Chuẩn bị dữ liệu gửi đi
      const submitData = {
        name: form.name.trim(),
        description: form.description || "",
        price: Number(form.price),
        originalPrice: Number(form.originalPrice || form.price),
        category: form.category,
        maxPerOrder: Number(form.maxPerOrder || 3),
        isActive: form.isActive !== undefined ? form.isActive : true,
        isSeasonal: form.isSeasonal || false,
        tag: form.tag || "Mới",
        items: validItems,
        // ✅ QUAN TRỌNG: Chỉ gửi ảnh dưới dạng file hoặc URL thật
        imageFile: form.imageFile || null, // File ảnh (nếu có)
        imageUrl: form.imageUrl || "", // URL ảnh (nếu có)
        // ✅ Nếu không có ảnh và đang sửa, giữ nguyên ảnh cũ
        existingImage: combo?.image || "", // Ảnh cũ từ database
      };

      console.log("📤 Submit data:", {
        name: submitData.name,
        price: submitData.price,
        hasFile: !!submitData.imageFile,
        imageUrl: submitData.imageUrl,
        existingImage: submitData.existingImage,
      });

      await onSave(submitData);
    } catch (error) {
      console.error("❌ Lỗi submit form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const styles = inputStyle(isDark);
  const label = labelStyle(isDark);
  const bg = isDark ? DARK.bgCard : "white";
  const ink = isDark ? DARK.ink : "#0f172a";
  const ink3 = isDark ? DARK.ink3 : "#64748b";
  const ink4 = isDark ? DARK.ink4 : "#94a3b8";
  const ink5 = isDark ? DARK.ink5 : "#e2e8f0";
  const ink6 = isDark ? DARK.ink6 : "#f1f5f9";

  return (
    <Box sx={{ animation: `${scaleIn} 0.28s ease both` }}>
      <Flex
        align={{ base: "flex-start", sm: "center" }}
        gap="12px"
        mb="20px"
        direction={{ base: "column", sm: "row" }}
      >
        <Button
          leftIcon={<Icon as={MdArrowBack} />}
          variant="ghost"
          color={isDark ? DARK.ink3 : "#64748b"}
          borderRadius="10px"
          h="38px"
          fontSize="13px"
          fontWeight="600"
          border={isDark ? `1.5px solid ${DARK.ink5}` : "1.5px solid #e2e8f0"}
          _hover={{ bg: isDark ? DARK.ink6 : "#f8fafc" }}
          flexShrink="0"
          onClick={onCancel}
        >
          Quay lại
        </Button>
        <Box>
          <Text fontSize={{ base: "17px", md: "20px" }} fontWeight="800" color={ink} letterSpacing="-0.4px">
            {isAdd ? "Thêm Combo mới" : `Chỉnh sửa: ${combo?.name}`}
          </Text>
          <Text fontSize="12px" color={isDark ? DARK.ink4 : "#94a3b8"} mt="2px">
            {isAdd ? "Tạo gói combo mới cho hệ thống đặt vé" : "Cập nhật thông tin gói combo"}
          </Text>
        </Box>
      </Flex>

      <Grid templateColumns={{ base: "1fr", lg: "1fr 320px" }} gap="16px">
        <Flex direction="column" gap="14px">
          {/* Thông tin cơ bản */}
          <Box
            bg={bg}
            borderRadius="16px"
            border={`1px solid ${isDark ? DARK.ink5 : "#f1f5f9"}`}
            boxShadow={isDark ? "0 1px 4px rgba(0,0,0,.3)" : "0 1px 4px rgba(0,0,0,0.04)"}
            p={{ base: "16px", md: "20px" }}
          >
            <SectionTitle label="Thông tin cơ bản" isDark={isDark} />
            <Grid templateColumns="1fr" gap="14px" mb="14px">
              <Box>
                <Text sx={label}>Tên combo *</Text>
                <Input
                  {...styles}
                  placeholder="VD: Combo Đôi Lãng Mạn"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  required
                />
              </Box>
            </Grid>
            <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap="14px" mb="14px">
              <Box>
                <Text sx={label}>Danh mục *</Text>
                <Select
                  {...styles}
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  required
                >
                  <option value="">-- Chọn danh mục --</option>
                  <option value="Combo Solo">Combo Solo</option>
                  <option value="Combo Đôi">Combo Đôi</option>
                  <option value="Combo Gia Đình">Combo Gia Đình</option>
                  <option value="Combo VIP">Combo VIP</option>
                </Select>
              </Box>
              <Box>
                <Text sx={label}>Nhãn hiển thị</Text>
                <Select
                  {...styles}
                  value={form.tag}
                  onChange={(e) => set("tag", e.target.value)}
                >
                  <option value="Bán chạy">Bán chạy</option>
                  <option value="Mới">Mới</option>
                  <option value="Phổ biến">Phổ biến</option>
                  <option value="Theo mùa">Theo mùa</option>
                  <option value="VIP">VIP</option>
                </Select>
              </Box>
            </Grid>
            <Box>
              <Text sx={label}>Mô tả combo</Text>
              <Textarea
                bg={isDark ? DARK.ink6 : "#fafafa"}
                border={isDark ? `1.5px solid ${DARK.ink5}` : "1.5px solid #e8edf3"}
                borderRadius="10px"
                color={isDark ? DARK.ink : "#1a202c"}
                fontSize="13.5px"
                fontWeight="500"
                px="14px"
                py="10px"
                _placeholder={{ color: isDark ? DARK.ink4 : "#b0bac8" }}
                _focus={{
                  border: "1.5px solid #f97316",
                  boxShadow: "0 0 0 3px rgba(249,115,22,0.10)",
                  bg: isDark ? DARK.bgCard : "#fff"
                }}
                _hover={{
                  border: "1.5px solid #f97316",
                  bg: isDark ? DARK.bgCard : "#fff"
                }}
                transition="all 0.2s"
                rows={3}
                placeholder="Mô tả ngắn gọn, hấp dẫn về combo..."
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </Box>
          </Box>

          {/* Thành phần combo */}
          <Box
            bg={bg}
            borderRadius="16px"
            border={`1px solid ${isDark ? DARK.ink5 : "#f1f5f9"}`}
            boxShadow={isDark ? "0 1px 4px rgba(0,0,0,.3)" : "0 1px 4px rgba(0,0,0,0.04)"}
            p={{ base: "16px", md: "20px" }}
          >
            <Flex align="center" justify="space-between" mb="14px">
              <SectionTitle label="Thành phần combo" isDark={isDark} />
              <Button
                size="xs"
                h="28px"
                px="10px"
                borderRadius="7px"
                bg="linear-gradient(135deg, #f97316, #fb923c)"
                color="white"
                fontSize="11px"
                fontWeight="700"
                leftIcon={<Icon as={MdAdd} boxSize="11px" />}
                _hover={{ opacity: 0.88 }}
                onClick={addItem}
                mt="-14px"
              >
                Thêm mục
              </Button>
            </Flex>
            <Flex direction="column" gap="8px">
              {form.items.map((item, i) => (
                <Flex key={i} gap="8px" align="center">
                  <Box
                    w="24px"
                    h="24px"
                    borderRadius="7px"
                    flexShrink="0"
                    bg="linear-gradient(135deg, #f97316, #fb923c)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text fontSize="10px" fontWeight="800" color="white">{i + 1}</Text>
                  </Box>
                  <Input
                    flex="1"
                    {...styles}
                    h="38px"
                    placeholder="VD: 1 Bắp Lớn Bơ Mặn"
                    value={item}
                    onChange={(e) => setItem(i, e.target.value)}
                  />
                  {form.items.length > 1 && (
                    <Button
                      h="38px"
                      w="38px"
                      p="0"
                      borderRadius="9px"
                      bg="#fef2f2"
                      color="#dc2626"
                      border="1px solid #fca5a5"
                      _hover={{ bg: "#fee2e2" }}
                      flexShrink="0"
                      onClick={() => removeItem(i)}
                    >
                      <Icon as={MdClose} boxSize="13px" />
                    </Button>
                  )}
                </Flex>
              ))}
              {form.items.length === 0 && (
                <Text fontSize="12px" color={isDark ? DARK.ink4 : "#94a3b8"} textAlign="center" py="8px">
                  Chưa có thành phần nào. Nhấn "Thêm mục" để thêm.
                </Text>
              )}
            </Flex>
          </Box>

          {/* Giá & Số lượng */}
          <Box
            bg={bg}
            borderRadius="16px"
            border={`1px solid ${isDark ? DARK.ink5 : "#f1f5f9"}`}
            boxShadow={isDark ? "0 1px 4px rgba(0,0,0,.3)" : "0 1px 4px rgba(0,0,0,0.04)"}
            p={{ base: "16px", md: "20px" }}
          >
            <SectionTitle label="Giá & Số lượng" isDark={isDark} />
            <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr 1fr" }} gap="14px">
              <Box>
                <Text sx={label}>Giá bán (đ) *</Text>
                <Input
                  {...styles}
                  type="number"
                  placeholder="VD: 120000"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  required
                  min="0"
                  step="1000"
                />
              </Box>
              <Box>
                <Text sx={label}>Giá gốc (đ)</Text>
                <Input
                  {...styles}
                  type="number"
                  placeholder="VD: 150000"
                  value={form.originalPrice}
                  onChange={(e) => set("originalPrice", e.target.value)}
                  min="0"
                  step="1000"
                />
              </Box>
              <Box>
                <Text sx={label}>Tối đa / đơn hàng</Text>
                <Select
                  {...styles}
                  value={form.maxPerOrder}
                  onChange={(e) => set("maxPerOrder", Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
                </Select>
              </Box>
            </Grid>
            {discount > 0 && (
              <Flex
                align="center"
                gap="8px"
                mt="12px"
                p="10px 14px"
                borderRadius="10px"
                bg="#fff7ed"
                border="1px solid #fed7aa"
                sx={{ animation: `${fadeIn} 0.3s ease both` }}
              >
                <Icon as={FaPercent} boxSize="12px" color="#f97316" />
                <Text fontSize="12px" fontWeight="700" color="#c2410c">
                  Khách hàng tiết kiệm {discount}% –&nbsp;
                  {(Number(form.originalPrice) - Number(form.price)).toLocaleString("vi-VN")}đ
                </Text>
              </Flex>
            )}
          </Box>
        </Flex>

        {/* Sidebar */}
        <Flex direction="column" gap="14px">
          {/* Hình ảnh combo */}
          <Box
            bg={bg}
            borderRadius="16px"
            border={`1px solid ${isDark ? DARK.ink5 : "#f1f5f9"}`}
            boxShadow={isDark ? "0 1px 4px rgba(0,0,0,.3)" : "0 1px 4px rgba(0,0,0,0.04)"}
            p={{ base: "16px", md: "18px" }}
          >
            <SectionTitle label="Hình ảnh combo" isDark={isDark} />
            
            {/* Input file */}
            <Box mb="12px">
              <Text sx={label} mb="7px">Tải ảnh lên</Text>
              <Flex gap="10px" wrap="wrap">
                <Input
                  {...styles}
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  p="6px"
                  flex="1"
                  minW="200px"
                />
                {imagePreview && (
                  <Button
                    h="44px"
                    px="14px"
                    borderRadius="10px"
                    bg="#fef2f2"
                    color="#dc2626"
                    border="1px solid #fca5a5"
                    _hover={{ bg: "#fee2e2" }}
                    onClick={handleRemoveImage}
                    leftIcon={<Icon as={MdDelete} boxSize="16px" />}
                  >
                    Xóa ảnh
                  </Button>
                )}
              </Flex>
              <Text fontSize="11px" color={isDark ? DARK.ink4 : "#94a3b8"} mt="2px">
                Hỗ trợ định dạng: JPG, PNG, GIF, WEBP. Dung lượng tối đa 5MB
              </Text>
            </Box>

            {/* Preview ảnh */}
            {imagePreview ? (
              <Box
                borderRadius="12px"
                overflow="hidden"
                border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #f1f5f9"}
                position="relative"
                mb="12px"
              >
                <Image
                  src={imagePreview}
                  alt="preview"
                  w="100%"
                  maxH="200px"
                  objectFit="cover"
                />
                <Box
                  position="absolute"
                  top="8px"
                  right="8px"
                  px="8px"
                  py="4px"
                  borderRadius="6px"
                  bg="rgba(0,0,0,0.6)"
                  color="white"
                  fontSize="10px"
                  fontWeight="600"
                >
                  {form.imageFile ? "📷 Đã tải lên" : "🔗 URL ảnh"}
                </Box>
              </Box>
            ) : (
              <Flex
                direction="column"
                align="center"
                justify="center"
                h="120px"
                borderRadius="12px"
                bg="#fff7ed"
                border="2px dashed #fed7aa"
                cursor="pointer"
                onClick={() => fileInputRef.current?.click()}
                _hover={{ bg: "#ffedd5" }}
                transition="all 0.2s"
                mb="12px"
              >
                <Icon as={MdImageSearch} boxSize="26px" color="#fcd34d" mb="5px" />
                <Text fontSize="11.5px" color={isDark ? DARK.ink4 : "#94a3b8"}>
                  Nhấn để chọn ảnh
                </Text>
              </Flex>
            )}

            {/* URL ảnh */}
            <Box>
              <Text sx={label} mb="7px">Hoặc nhập URL ảnh</Text>
              <Input
                {...styles}
                placeholder="https://example.com/image.jpg"
                value={form.imageUrl || ""}
                onChange={handleImageUrlChange}
              />
              <Text fontSize="10px" color={isDark ? DARK.ink4 : "#94a3b8"} mt="1px">
                Nhập URL ảnh nếu bạn có link ảnh trực tuyến
              </Text>
            </Box>

            {/* Hiển thị ảnh hiện tại (khi sửa) */}
            {!isAdd && combo?.image && !imagePreview && (
              <Box mt="12px">
                <Text fontSize="10px" fontWeight="600" color={isDark ? DARK.ink4 : "#94a3b8"}>
                  Ảnh hiện tại:
                </Text>
                <Image
                  src={combo.image}
                  alt="current"
                  w="100%"
                  maxH="150px"
                  objectFit="cover"
                  borderRadius="8px"
                  mt="4px"
                  border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #f1f5f9"}
                />
              </Box>
            )}
          </Box>

          {/* Cài đặt hiển thị */}
          <Box
            bg={bg}
            borderRadius="16px"
            border={`1px solid ${isDark ? DARK.ink5 : "#f1f5f9"}`}
            boxShadow={isDark ? "0 1px 4px rgba(0,0,0,.3)" : "0 1px 4px rgba(0,0,0,0.04)"}
            p={{ base: "16px", md: "18px" }}
          >
            <SectionTitle label="Cài đặt hiển thị" isDark={isDark} />
            <Flex direction="column" gap="14px">
              {[
                {
                  key: "isActive",
                  label: "Đang bán",
                  sub: "Combo hiển thị và có thể chọn trên trang đặt vé",
                },
                {
                  key: "isSeasonal",
                  label: "Combo theo mùa",
                  sub: "Gắn nhãn theo mùa / sự kiện đặc biệt",
                },
              ].map(({ key, label, sub }) => (
                <Flex key={key} align="center" justify="space-between">
                  <Box>
                    <Text fontSize="13px" fontWeight="700" color={ink}>{label}</Text>
                    <Text fontSize="11px" color={isDark ? DARK.ink4 : "#94a3b8"} mt="1px">{sub}</Text>
                  </Box>
                  <Switch
                    isChecked={form[key]}
                    onChange={(e) => set(key, e.target.checked)}
                    colorScheme="orange"
                    size="md"
                  />
                </Flex>
              ))}
            </Flex>
          </Box>

          {/* Preview */}
          {form.name && (
            <Box
              bg={bg}
              borderRadius="16px"
              border={`1px solid ${isDark ? DARK.ink5 : "#f1f5f9"}`}
              boxShadow={isDark ? "0 1px 4px rgba(0,0,0,.3)" : "0 1px 4px rgba(0,0,0,0.04)"}
              p={{ base: "16px", md: "18px" }}
              sx={{ animation: `${fadeIn} 0.3s ease both` }}
            >
              <SectionTitle label="Xem trước" isDark={isDark} />
              <Box
                borderRadius="12px"
                border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #f1f5f9"}
                overflow="hidden"
              >
                <Box
                  h="80px"
                  bg="linear-gradient(135deg, #fff7ed, #ffedd5)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="preview"
                      w="100%"
                      h="100%"
                      objectFit="cover"
                    />
                  ) : (
                    <Icon as={FaBoxOpen} boxSize="28px" color="#fed7aa" />
                  )}
                </Box>
                <Box p="12px">
                  <Flex align="flex-start" justify="space-between" gap="6px" mb="5px">
                    <Text fontSize="12.5px" fontWeight="800" color={ink} flex="1">
                      {form.name || "Tên combo"}
                    </Text>
                    {form.tag && <TagBadge tag={form.tag} isDark={isDark} />}
                  </Flex>
                  {form.price && (
                    <Flex align="center" gap="6px">
                      <Text fontSize="14px" fontWeight="800" color="#f97316">
                        {Number(form.price).toLocaleString("vi-VN")}đ
                      </Text>
                      {discount > 0 && (
                        <Box px="5px" borderRadius="4px" bg="#fff7ed">
                          <Text fontSize="9.5px" fontWeight="800" color="#f97316">
                            -{discount}%
                          </Text>
                        </Box>
                      )}
                    </Flex>
                  )}
                  {form.category && (
                    <Text fontSize="10px" color={isDark ? DARK.ink4 : "#94a3b8"} mt="1px">
                      {form.category}
                    </Text>
                  )}
                </Box>
              </Box>
            </Box>
          )}
        </Flex>
      </Grid>

      {/* Footer Actions */}
      <Box
        bg={bg}
        borderRadius="14px"
        border={`1px solid ${isDark ? DARK.ink5 : "#f1f5f9"}`}
        boxShadow={isDark ? "0 1px 4px rgba(0,0,0,.3)" : "0 1px 4px rgba(0,0,0,0.04)"}
        p={{ base: "14px 16px", md: "16px 20px" }}
        mt="16px"
        position={{ base: "sticky", md: "static" }}
        bottom={{ base: "0", md: "auto" }}
        zIndex="10"
      >
        <Flex justify={{ base: "stretch", md: "flex-end" }} gap="10px">
          <Button
            flex={{ base: "1", md: "none" }}
            h={{ base: "46px", md: "42px" }}
            px="22px"
            variant="ghost"
            color={isDark ? DARK.ink3 : "#64748b"}
            borderRadius="10px"
            fontWeight="600"
            fontSize="13px"
            border={isDark ? `1.5px solid ${DARK.ink5}` : "1.5px solid #e2e8f0"}
            _hover={{ bg: isDark ? DARK.ink6 : "#f8fafc" }}
            leftIcon={<Icon as={MdClose} />}
            onClick={onCancel}
            isDisabled={isSubmitting}
          >
            Hủy bỏ
          </Button>
          <Button
            flex={{ base: "2", md: "none" }}
            h={{ base: "46px", md: "42px" }}
            px="28px"
            borderRadius="10px"
            fontWeight="700"
            fontSize="13px"
            bg="linear-gradient(135deg, #f97316 0%, #fb923c 60%, #fbbf24 100%)"
            color="white"
            boxShadow="0 4px 16px rgba(249,115,22,0.35)"
            _hover={{
              boxShadow: "0 8px 24px rgba(249,115,22,0.45)",
              transform: "translateY(-1px)"
            }}
            _active={{ transform: "translateY(0)" }}
            transition="all 0.2s"
            leftIcon={<Icon as={MdCheckCircle} />}
            onClick={handleSubmit}
            isLoading={isSubmitting}
            loadingText={isAdd ? "Đang thêm..." : "Đang lưu..."}
          >
            {isAdd ? "Thêm combo" : "Lưu thay đổi"}
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};