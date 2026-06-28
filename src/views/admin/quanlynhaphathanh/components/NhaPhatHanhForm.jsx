

import { useState } from "react";
import {
  Box, Grid, Text, Button, Flex, SimpleGrid, FormControl,
  Input, Select, Textarea, Icon, useColorModeValue,
  useBreakpointValue
} from "@chakra-ui/react";
import {
  MdArrowBack, MdClose, MdCheckCircle, MdCalendarToday,
  MdBusiness, MdPerson, MdEmail, MdPhone, MdLink,
  MdLocationOn, MdInfo, MdWarning
} from "react-icons/md";
import { FaBuilding, FaGlobe } from "react-icons/fa";
import { SectionTitle } from "./shared/SectionTitle";
import { StatusBadge } from "./shared/StatusBadge";
import { RegionBadge } from "./shared/RegionBadge";
import { scaleIn, fadeIn } from "./shared/animations";
import { STATUS_OPTS, REGION_OPTS, COUNTRY_OPTS, FLAG_MAP } from "../constants";

export function NhaPhatHanhForm({ distributor, movies = [], onCancel, onSave, isAdd = false }) {
  const isDark = useColorModeValue(false, true);
  const isMobile = useBreakpointValue({ base: true, lg: false });

  const empty = {
    name: "",
    shortName: "",
    type: "International",
    country: "Mỹ",
    status: "Active",
    contactPerson: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    description: "",
    foundedYear: "",
    contractStart: "",
    contractEnd: "",
    notes: "",
    logoColor: "#f97316",
    movieId: "",
  };

  const [form, setForm] = useState(() => {
    if (distributor) {
      return {
        name: distributor.Name || distributor.name || "",
        shortName: distributor.ShortName || distributor.shortName || "",
        type: distributor.Type || distributor.type || "International",
        country: distributor.Country || distributor.country || "Mỹ",
        status: distributor.Status || distributor.status || "Active",
        contactPerson: distributor.ContactPerson || distributor.contactPerson || "",
        email: distributor.Email || distributor.email || "",
        phone: distributor.Phone || distributor.phone || "",
        website: distributor.Website || distributor.website || "",
        address: distributor.Address || distributor.address || "",
        description: distributor.Description || distributor.description || "",
        foundedYear: distributor.FoundedYear || distributor.foundedYear || "",
        contractStart: distributor.ContractStart || distributor.contractStart || "",
        contractEnd: distributor.ContractEnd || distributor.contractEnd || "",
        notes: distributor.Notes || distributor.notes || "",
        logoColor: distributor.LogoColor || distributor.logoColor || "#f97316",
        movieId: distributor.MovieId || distributor.movieId || "",
      };
    }
    return empty;
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Style tokens
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
  const filterBg = useColorModeValue("#f8fafc", "#1b2559");
  const filterBorder = useColorModeValue("#e2e8f0", "#243170");
  const secondaryBtnBg = useColorModeValue("#f8fafc", "rgba(255,255,255,0.05)");
  const secondaryBtnBorder = useColorModeValue("#e2e8f0", "rgba(255,255,255,0.14)");
  const secondaryBtnColor = useColorModeValue("#475569", "#cbd5e1");
  const secondaryBtnHoverBg = useColorModeValue("#f1f5f9", "rgba(255,255,255,0.1)");
  const dashedBg = useColorModeValue("#f8fafc", "rgba(255,255,255,0.03)");
  const dashedBorder = useColorModeValue("#e2e8f0", "rgba(255,255,255,0.18)");

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
    boxShadow: isDark ? "0 2px 10px rgba(0,0,0,0.3)" : "0 2px 10px rgba(0,0,0,0.04)",
  };

  // Kiểm tra hợp đồng sắp hết hạn
  const contractExpiring = form.contractEnd && (() => {
    const diff = (new Date(form.contractEnd) - new Date()) / 86400000;
    return diff < 90 && diff > 0;
  })();
  const contractExpired = form.contractEnd && new Date(form.contractEnd) < new Date();

  const handleSubmit = () => {
    // Kiểm tra các trường bắt buộc
    if (!form.name.trim()) {
      alert("Vui lòng nhập tên nhà phát hành");
      return;
    }
    
    if (!form.country) {
      alert("Vui lòng chọn quốc gia");
      return;
    }

    const submitData = {
      Name: form.name.trim(),
      ShortName: form.shortName || form.name.substring(0, 2).toUpperCase(),
      Type: form.type,
      Country: form.country,
      Status: form.status,
      ContactPerson: form.contactPerson || "",
      Email: form.email || "",
      Phone: form.phone || "",
      Website: form.website || "",
      Address: form.address || "",
      Description: form.description || "",
      FoundedYear: form.foundedYear || "",
      ContractStart: form.contractStart || "",
      ContractEnd: form.contractEnd || "",
      Notes: form.notes || "",
      LogoColor: form.logoColor || "#f97316",
      MovieId: form.movieId || null,
    };

    console.log("📤 Dữ liệu gửi đi:", submitData);
    onSave(submitData);
  };

  // Lấy tên phim theo MovieId
  const getMovieTitle = (id) => {
    if (!id) return "";
    const movie = movies.find(m => (m.MovieId || m.id) === id);
    return movie ? (movie.Title || movie.title) : "";
  };

  const colors = ["#f97316", "#2563eb", "#dc2626", "#059669", "#7c3aed", "#0f172a", "#9333ea", "#0891b2"];

  return (
    <Box sx={{ animation: `${scaleIn} 0.3s ease both` }}>
      {/* Header */}
      <Flex align={{ base: "flex-start", md: "center" }} gap="12px" mb="22px"
        direction={{ base: "column", sm: "row" }}
      >
        <Button leftIcon={<Icon as={MdArrowBack} />} variant="ghost"
          color={secondaryBtnColor} borderRadius="10px" h="40px" fontSize="13px" fontWeight="600"
          border={`1.5px solid ${secondaryBtnBorder}`} _hover={{ bg: secondaryBtnHoverBg }} flexShrink="0"
          onClick={onCancel}
        >
          Quay lại
        </Button>
        <Box>
          <Flex align="center" gap="10px">
            <Box w="34px" h="34px" borderRadius="10px"
              bg="linear-gradient(135deg, #f97316, #fbbf24)"
              display="flex" alignItems="center" justifyContent="center"
              boxShadow="0 4px 12px rgba(249,115,22,0.35)"
            >
              <Icon as={FaBuilding} boxSize="14px" color="white" />
            </Box>
            <Box>
              <Text fontSize={{ base: "17px", md: "20px" }} fontWeight="800" color={textPrimary} letterSpacing="-0.4px">
                {isAdd ? "Thêm nhà phát hành mới" : `Chỉnh sửa: ${distributor?.name}`}
              </Text>
              <Text fontSize="12px" color={textMuted} mt="1px">
                {isAdd ? "Điền thông tin để thêm nhà phát hành vào hệ thống" : "Cập nhật thông tin nhà phát hành"}
              </Text>
            </Box>
          </Flex>
        </Box>
      </Flex>

      <Grid templateColumns={{ base: "1fr", lg: "1fr 300px" }} gap="16px">
        {/* LEFT */}
        <Flex direction="column" gap="14px">
          {/* Basic Info */}
          <Box {...cardStyle} borderRadius="16px" p={{ base: "16px", md: "20px" }}>
            <SectionTitle label="Thông tin cơ bản" icon={MdBusiness} />
            <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap="14px" mb="14px">
              <Box>
                <Text sx={{ ...labelStyle, color: textMuted }}>Tên nhà phát hành *</Text>
                <Input {...inputStyle} placeholder="VD: Marvel Studios"
                  value={form.name} onChange={e => set("name", e.target.value)} />
              </Box>
              <Box>
                <Text sx={{ ...labelStyle, color: textMuted }}>Tên viết tắt</Text>
                <Input {...inputStyle} placeholder="VD: Marvel"
                  value={form.shortName} onChange={e => set("shortName", e.target.value)} />
              </Box>
            </Grid>
            <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr 1fr" }} gap="14px" mb="14px">
              <Box>
                <Text sx={{ ...labelStyle, color: textMuted }}>Loại *</Text>
                <Select {...inputStyle} value={form.type} onChange={e => set("type", e.target.value)}>
                  {REGION_OPTS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </Select>
              </Box>
              <Box>
                <Text sx={{ ...labelStyle, color: textMuted }}>Quốc gia *</Text>
                <Select {...inputStyle} value={form.country} onChange={e => set("country", e.target.value)}>
                  {COUNTRY_OPTS.map(c => (
                    <option key={c} value={c}>{FLAG_MAP[c] || "🌍"} {c}</option>
                  ))}
                </Select>
              </Box>
              <Box>
                <Text sx={{ ...labelStyle, color: textMuted }}>Năm thành lập</Text>
                <Input {...inputStyle} type="number" placeholder="VD: 1994"
                  value={form.foundedYear} onChange={e => set("foundedYear", e.target.value)} />
              </Box>
            </Grid>
            <Box>
              <Text sx={{ ...labelStyle, color: textMuted }}>Trụ sở / Địa chỉ</Text>
              <Input {...inputStyle} placeholder="Địa chỉ đầy đủ..."
                value={form.address} onChange={e => set("address", e.target.value)} />
            </Box>
          </Box>

          {/* Contact */}
          <Box {...cardStyle} borderRadius="16px" p={{ base: "16px", md: "20px" }}>
            <SectionTitle label="Thông tin liên hệ" icon={MdPerson} />
            <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap="14px" mb="14px">
              <Box>
                <Text sx={{ ...labelStyle, color: textMuted }}>Người đại diện</Text>
                <Input {...inputStyle} placeholder="Họ và tên"
                  value={form.contactPerson} onChange={e => set("contactPerson", e.target.value)} />
              </Box>
              <Box>
                <Text sx={{ ...labelStyle, color: textMuted }}>Email liên hệ</Text>
                <Input {...inputStyle} type="email" placeholder="email@example.com"
                  value={form.email} onChange={e => set("email", e.target.value)} />
              </Box>
            </Grid>
            <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap="14px">
              <Box>
                <Text sx={{ ...labelStyle, color: textMuted }}>Số điện thoại</Text>
                <Input {...inputStyle} placeholder="+84 xxx xxx xxx"
                  value={form.phone} onChange={e => set("phone", e.target.value)} />
              </Box>
              <Box>
                <Text sx={{ ...labelStyle, color: textMuted }}>Website</Text>
                <Input {...inputStyle} placeholder="https://..."
                  value={form.website} onChange={e => set("website", e.target.value)} />
              </Box>
            </Grid>
          </Box>

          {/* Contract */}
          <Box {...cardStyle} borderRadius="16px" p={{ base: "16px", md: "20px" }}>
            <SectionTitle label="Hợp đồng & Trạng thái" icon={MdCalendarToday} />
            <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr 1fr" }} gap="14px" mb="14px">
              <Box>
                <Text sx={{ ...labelStyle, color: textMuted }}>Trạng thái *</Text>
                <Select {...inputStyle} value={form.status} onChange={e => set("status", e.target.value)}>
                  {STATUS_OPTS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </Select>
              </Box>
              <Box>
                <Text sx={{ ...labelStyle, color: textMuted }}>Ngày bắt đầu HĐ</Text>
                <Input {...inputStyle} type="date"
                  value={form.contractStart} onChange={e => set("contractStart", e.target.value)} />
              </Box>
              <Box>
                <Text sx={{ ...labelStyle, color: textMuted }}>Ngày kết thúc HĐ</Text>
                <Input {...inputStyle} type="date"
                  value={form.contractEnd} onChange={e => set("contractEnd", e.target.value)} />
              </Box>
            </Grid>

            {/* Contract warning */}
            {(contractExpiring || contractExpired) && (
              <Box p="10px 14px" borderRadius="9px" mb="14px"
                bg={isDark ? (contractExpired ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)")
                           : (contractExpired ? "#fef2f2" : "#fffbeb")}
                border={`1px solid ${contractExpired
                  ? (isDark ? "rgba(239,68,68,0.3)" : "#fca5a5")
                  : (isDark ? "rgba(245,158,11,0.3)" : "#fcd34d")}`}
                sx={{ animation: `${fadeIn} 0.2s ease both` }}
              >
                <Flex align="center" gap="6px">
                  <Icon as={MdWarning} boxSize="14px" color={contractExpired ? "#dc2626" : "#d97706"} />
                  <Text fontSize="12px" fontWeight="600" color={contractExpired ? "#dc2626" : "#d97706"}>
                    {contractExpired ? "⚠️ Hợp đồng đã hết hạn — Cần gia hạn!" : "🔔 Hợp đồng sắp hết hạn trong 90 ngày"}
                  </Text>
                </Flex>
              </Box>
            )}

            <Box>
              <Text sx={{ ...labelStyle, color: textMuted }}>Ghi chú nội bộ</Text>
              <Textarea
                bg={inputBg} border={`1.5px solid ${inputBorder}`} borderRadius="10px"
                color={inputColor} fontSize="14px" fontWeight="500" px="14px" py="10px"
                _placeholder={{ color: placeholderColor }}
                _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.10)", bg: cardBg }}
                _hover={{ border: "1.5px solid #f97316" }}
                transition="all 0.2s" rows={2}
                placeholder="Ghi chú nội bộ về hợp đồng, điều kiện đặc biệt..."
                value={form.notes} onChange={e => set("notes", e.target.value)}
              />
            </Box>
          </Box>

          {/* Description & Movie */}
          <Box {...cardStyle} borderRadius="16px" p={{ base: "16px", md: "20px" }}>
            <SectionTitle label="Giới thiệu & Phim liên quan" icon={MdInfo} />
            <Box mb="14px">
              <Text sx={{ ...labelStyle, color: textMuted }}>Mô tả</Text>
              <Textarea
                bg={inputBg} border={`1.5px solid ${inputBorder}`} borderRadius="10px"
                color={inputColor} fontSize="14px" fontWeight="500" px="14px" py="10px"
                _placeholder={{ color: placeholderColor }}
                _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.10)", bg: cardBg }}
                _hover={{ border: "1.5px solid #f97316" }}
                transition="all 0.2s" rows={3}
                placeholder="Mô tả ngắn về nhà phát hành..."
                value={form.description} onChange={e => set("description", e.target.value)}
              />
            </Box>
            <Box>
              <Text sx={{ ...labelStyle, color: textMuted }}>Phim liên quan</Text>
              <Select {...inputStyle} value={form.movieId} 
                onChange={e => set("movieId", e.target.value)}
              >
                <option value="">-- Chọn phim (tùy chọn) --</option>
                {movies.map((m) => (
                  <option key={m.MovieId || m.id} value={m.MovieId || m.id}>
                    {m.Title || m.title}
                  </option>
                ))}
              </Select>
              {form.movieId && getMovieTitle(form.movieId) && (
                <Box mt="8px" p="8px 12px" borderRadius="8px"
                  bg={isDark ? "rgba(249,115,22,0.08)" : "#fff7ed"}
                  border={`1px solid ${isDark ? "rgba(249,115,22,0.25)" : "#fed7aa"}`}
                >
                  <Flex align="center" gap="6px">
                    <Icon as={FaBuilding} boxSize="11px" color="#f97316" />
                    <Text fontSize="12px" fontWeight="600" color={textSecondary}>
                      Phim: {getMovieTitle(form.movieId)}
                    </Text>
                  </Flex>
                </Box>
              )}
            </Box>
          </Box>
        </Flex>

        {/* RIGHT */}
        <Flex direction="column" gap="14px">
          {/* Logo Color */}
          <Box {...cardStyle} borderRadius="16px" p={{ base: "16px", md: "18px" }}>
            <SectionTitle label="Logo & Màu nhận diện" />
            <Text sx={{ ...labelStyle, color: textMuted }} mb="8px">Màu thương hiệu</Text>
            <Flex gap="8px" flexWrap="wrap" mb="14px">
              {colors.map(c => (
                <Box key={c} w="28px" h="28px" borderRadius="7px" bg={c} cursor="pointer"
                  border={form.logoColor === c ? "2.5px solid #f97316" : "2px solid transparent"}
                  boxShadow={form.logoColor === c ? "0 0 0 3px rgba(249,115,22,0.3)" : "none"}
                  transition="all 0.15s" _hover={{ transform: "scale(1.15)" }}
                  onClick={() => set("logoColor", c)}
                />
              ))}
            </Flex>

            {/* Preview */}
            {form.name && (
              <Box p="16px" borderRadius="12px"
                bg={filterBg} border={`1px solid ${cardBorder}`}
                sx={{ animation: `${fadeIn} 0.3s ease both` }}
              >
                <Text fontSize="10px" fontWeight="700" color={textMuted} letterSpacing="0.8px"
                  textTransform="uppercase" mb="10px">Xem trước</Text>
                <Flex align="center" gap="12px">
                  <Box w="48px" h="48px" borderRadius="12px"
                    bg={`${form.logoColor}18`} border={`2px solid ${form.logoColor}35`}
                    display="flex" alignItems="center" justifyContent="center" flexShrink="0"
                  >
                    <Text fontSize="16px" fontWeight="800" color={form.logoColor}>
                      {(form.shortName || form.name).substring(0, 2).toUpperCase()}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize="14px" fontWeight="700" color={textPrimary}>{form.name}</Text>
                    <Flex gap="6px" mt="5px" flexWrap="wrap">
                      {form.status && <StatusBadge status={form.status} />}
                      {form.type && <RegionBadge type={form.type} />}
                    </Flex>
                  </Box>
                </Flex>
                {form.country && (
                  <Flex align="center" gap="6px" mt="10px">
                    <Text fontSize="13px">{FLAG_MAP[form.country] || "🌍"}</Text>
                    <Text fontSize="12px" color={textSecondary} fontWeight="600">{form.country}</Text>
                  </Flex>
                )}
              </Box>
            )}
          </Box>

          {/* Quick Info */}
          <Box {...cardStyle} borderRadius="16px" p={{ base: "16px", md: "18px" }}>
            <SectionTitle label="Thông tin nhanh" />
            <Flex direction="column" gap="10px">
              {form.contactPerson && (
                <Flex align="center" gap="8px">
                  <Icon as={MdPerson} boxSize="13px" color="#f97316" />
                  <Text fontSize="12px" color={textSecondary} fontWeight="600">{form.contactPerson}</Text>
                </Flex>
              )}
              {form.email && (
                <Flex align="center" gap="8px">
                  <Icon as={MdEmail} boxSize="13px" color="#f97316" />
                  <Text fontSize="12px" color={textSecondary} fontWeight="600" noOfLines={1}>{form.email}</Text>
                </Flex>
              )}
              {form.phone && (
                <Flex align="center" gap="8px">
                  <Icon as={MdPhone} boxSize="13px" color="#f97316" />
                  <Text fontSize="12px" color={textSecondary} fontWeight="600">{form.phone}</Text>
                </Flex>
              )}
              {form.contractEnd && (
                <Box p="10px 12px" borderRadius="8px"
                  bg={isDark ? "rgba(249,115,22,0.1)" : "#fffbeb"}
                  border={`1px solid ${isDark ? "rgba(249,115,22,0.25)" : "#fed7aa"}`}
                >
                  <Text fontSize="10px" fontWeight="700" color="#f97316"
                    letterSpacing="0.8px" textTransform="uppercase" mb="3px">Hết hạn hợp đồng</Text>
                  <Text fontSize="12px" fontWeight="700" color="#b45309">
                    {new Date(form.contractEnd).toLocaleDateString("vi-VN")}
                  </Text>
                </Box>
              )}
            </Flex>
          </Box>
        </Flex>
      </Grid>

      {/* Save bar */}
      <Box bg={cardBg} borderRadius="14px" border={`1px solid ${cardBorder}`}
        boxShadow="0 2px 10px rgba(0,0,0,0.04)" p={{ base: "14px 16px", md: "16px 20px" }} mt="16px"
        position={{ base: "sticky", md: "static" }} bottom="0" zIndex="10"
      >
        <Flex justify={{ base: "stretch", md: "flex-end" }} gap="10px">
          <Button flex={{ base: "1", md: "none" }}
            h={{ base: "46px", md: "42px" }} px="22px" variant="ghost"
            color={secondaryBtnColor} borderRadius="10px" fontWeight="600" fontSize="13px"
            border={`1.5px solid ${secondaryBtnBorder}`} _hover={{ bg: secondaryBtnHoverBg }}
            leftIcon={<Icon as={MdClose} />} onClick={onCancel}
          >
            Hủy bỏ
          </Button>
          <Button flex={{ base: "2", md: "none" }}
            h={{ base: "46px", md: "42px" }} px="28px" borderRadius="10px"
            fontWeight="700" fontSize="13px"
            bg="linear-gradient(135deg, #f97316 0%, #fb923c 60%, #fbbf24 100%)"
            color="white" boxShadow="0 4px 16px rgba(249,115,22,0.35)"
            _hover={{ boxShadow: "0 8px 24px rgba(249,115,22,0.45)", transform: "translateY(-1px)" }}
            _active={{ transform: "translateY(0)" }} transition="all 0.2s"
            leftIcon={<Icon as={MdCheckCircle} />}
            onClick={handleSubmit}
          >
            {isAdd ? "Thêm nhà phát hành" : "Lưu thay đổi"}
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}