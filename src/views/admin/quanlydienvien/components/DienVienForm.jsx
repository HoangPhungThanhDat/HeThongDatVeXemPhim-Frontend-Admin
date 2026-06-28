

import { useState, useRef } from "react";
import {
  Box, Grid, Text, Button, Flex, SimpleGrid, FormControl,
  Input, Select, Textarea, Icon, useColorModeValue,
  useBreakpointValue
} from "@chakra-ui/react";
import {
  MdArrowBack, MdClose, MdCheckCircle, MdPerson,
  MdAdd, MdImageSearch, MdCloudUpload, MdSchedule,
  MdStar
} from "react-icons/md";
import { FaGlobe, FaFilm } from "react-icons/fa";
import { SectionTitle } from "./shared/SectionTitle";
import { StatusBadge } from "./shared/StatusBadge";
import { RoleBadge } from "./shared/RoleBadge";
import { scaleIn, fadeIn } from "./shared/animations";
import { ROLE_OPTS, STATUS_OPTS } from "../constants";

export function DienVienForm({ artist, movies = [], onCancel, onSave, isAdd = false }) {
  const isDark = useColorModeValue(false, true);
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const empty = {
    MovieId: "",
    Name: "",
    Role: "Actor",
    Nationality: "",
    Status: "Active",
    Photo: "",
    PhotoFile: null,
    Bio: "",
    Awards: "",
    movies: [],
  };

  const [form, setForm] = useState(() => {
    if (artist) {
      return {
        MovieId: artist.MovieId || artist.movieId || "",
        Name: artist.Name || artist.name || "",
        Role: artist.Role || artist.role || "Actor",
        Nationality: artist.Nationality || artist.nationality || "",
        Status: artist.Status || artist.status || "Active",
        Photo: artist.Photo || artist.photo || "",
        PhotoFile: null,
        Bio: artist.Bio || artist.bio || "",
        Awards: artist.Awards || artist.awards || "",
        movies: artist.movies || [],
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
  const chipBg = useColorModeValue("#fff7ed", "rgba(194,65,12,0.16)");
  const chipBorder = useColorModeValue("#fed7aa", "rgba(253,186,116,0.35)");

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
    const reader = new FileReader();
    reader.onload = (ev) => {
      set("Photo", ev.target.result);
      set("PhotoFile", file);
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
    // Kiểm tra các trường bắt buộc
    if (!form.Name.trim()) {
      alert("Vui lòng nhập tên nghệ sĩ");
      return;
    }
    
    if (!form.MovieId) {
      alert("Vui lòng chọn phim");
      return;
    }
    
    if (!form.Role) {
      alert("Vui lòng chọn vai trò");
      return;
    }

    const submitData = {
      MovieId: form.MovieId,
      Name: form.Name.trim(),
      Role: form.Role,
      Nationality: form.Nationality || "",
      Status: form.Status || "Active",
      Bio: form.Bio || "",
      Awards: form.Awards || "",
      movies: form.movies || [],
    };

    if (form.PhotoFile instanceof File) {
      submitData.PhotoFile = form.PhotoFile;
    } else if (form.Photo && typeof form.Photo === "string") {
      submitData.Photo = form.Photo;
    }

    console.log("📤 Dữ liệu gửi đi:", {
      ...submitData,
      PhotoFile: submitData.PhotoFile ? `[FILE] ${submitData.PhotoFile.name}` : "Không có ảnh mới"
    });

    onSave(submitData);
  };

  // Lấy tên phim theo MovieId
  const getMovieTitle = (id) => {
    const movie = movies.find(m => (m.MovieId || m.id) === id);
    return movie ? (movie.Title || movie.title) : "";
  };

  return (
    <Box sx={{ animation: `${scaleIn} 0.3s ease both` }}>
      {/* Header */}
      <Flex align={{ base: "flex-start", md: "center" }} gap="12px" mb="20px"
        direction={{ base: "column", sm: "row" }}
      >
        <Button leftIcon={<Icon as={MdArrowBack} />} variant="ghost"
          color={secondaryBtnColor} borderRadius="10px" h="38px" fontSize="13px" fontWeight="600"
          border={`1.5px solid ${secondaryBtnBorder}`} _hover={{ bg: secondaryBtnHoverBg }} flexShrink="0"
          onClick={onCancel}
        >
          Quay lại
        </Button>
        <Box>
          <Text fontSize={{ base: "17px", md: "20px" }} fontWeight="800" color={textPrimary} letterSpacing="-0.4px">
            {isAdd ? "Thêm nghệ sĩ mới" : `Chỉnh sửa: ${artist?.Name}`}
          </Text>
          <Text fontSize="12px" color={textMuted} mt="2px">
            {isAdd ? "Điền đầy đủ hồ sơ nghệ sĩ vào hệ thống" : "Cập nhật thông tin hồ sơ nghệ sĩ"}
          </Text>
        </Box>
      </Flex>

      <Grid templateColumns={{ base: "1fr", lg: "1fr 320px" }} gap="16px">
        {/* ── Left ── */}
        <Flex direction="column" gap="14px">
          {/* Basic info */}
          <Box {...cardStyle} borderRadius="16px" p={{ base: "16px", md: "20px" }}>
            <SectionTitle label="Thông tin cơ bản" />
            <Grid templateColumns="1fr" gap="14px" mb="14px">
              <Box>
                <Text sx={labelStyle}>Họ tên nghệ sĩ *</Text>
                <Input {...inputStyle} placeholder="VD: Tom Hanks"
                  value={form.Name} onChange={e => set("Name", e.target.value)} />
              </Box>
            </Grid>
            <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap="14px" mb="14px">
              <Box>
                <Text sx={labelStyle}>Chọn phim *</Text>
                <Select {...inputStyle} value={form.MovieId} 
                  onChange={e => set("MovieId", e.target.value)}
                  placeholder="-- Chọn phim --"
                >
                  {movies.map((m) => (
                    <option key={m.MovieId || m.id} value={m.MovieId || m.id}>
                      {m.Title || m.title}
                    </option>
                  ))}
                </Select>
              </Box>
              <Box>
                <Text sx={labelStyle}>Vai trò *</Text>
                <Select {...inputStyle} value={form.Role} 
                  onChange={e => set("Role", e.target.value)}
                >
                  {ROLE_OPTS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </Select>
              </Box>
            </Grid>
            <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap="14px">
              <Box>
                <Text sx={labelStyle}>Quốc tịch</Text>
                <Input {...inputStyle} placeholder="VD: Mỹ, Anh, Hàn Quốc..."
                  value={form.Nationality} onChange={e => set("Nationality", e.target.value)} />
              </Box>
              <Box>
                <Text sx={labelStyle}>Trạng thái</Text>
                <Select {...inputStyle} value={form.Status} onChange={e => set("Status", e.target.value)}>
                  {STATUS_OPTS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </Select>
              </Box>
            </Grid>
          </Box>

          {/* Bio & Awards */}
          <Box {...cardStyle} borderRadius="16px" p={{ base: "16px", md: "20px" }}>
            <SectionTitle label="Tiểu sử & Giải thưởng" />
            <Box mb="14px">
              <Text sx={labelStyle}>Tiểu sử</Text>
              <Textarea
                bg={inputBg} border={`1.5px solid ${inputBorder}`} borderRadius="10px"
                color={inputColor} fontSize="14px" fontWeight="500" px="14px" py="10px"
                _placeholder={{ color: placeholderColor }}
                _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.10)", bg: cardBg }}
                _hover={{ border: "1.5px solid #f97316" }}
                transition="all 0.2s" rows={4}
                placeholder="Nhập tiểu sử, sự nghiệp, thông tin nổi bật..."
                value={form.Bio} onChange={e => set("Bio", e.target.value)}
              />
            </Box>
            <Box>
              <Text sx={labelStyle}>Giải thưởng nổi bật</Text>
              <Input {...inputStyle} placeholder="VD: Oscar, Golden Globe, BAFTA..."
                value={form.Awards} onChange={e => set("Awards", e.target.value)} />
            </Box>
          </Box>

          {/* Linked movies */}
          <Box {...cardStyle} borderRadius="16px" p={{ base: "16px", md: "20px" }}>
            <SectionTitle label="Phim tham gia" />
            <Text fontSize="11px" color={textMuted} mb="10px">
              Phim hiện tại: <strong style={{ color: textPrimary }}>
                {getMovieTitle(form.MovieId) || "Chưa chọn"}
              </strong>
            </Text>
            
            {form.MovieId && (
              <Box p="10px 12px" borderRadius="9px"
                bg={chipBg} border={`1px solid ${chipBorder}`}
                sx={{ animation: `${fadeIn} 0.2s ease both` }}
              >
                <Flex align="center" gap="8px">
                  <Icon as={FaFilm} boxSize="12px" color="#f97316" />
                  <Text fontSize="12.5px" fontWeight="600" color={textPrimary}>
                    {getMovieTitle(form.MovieId)}
                  </Text>
                </Flex>
              </Box>
            )}

            {form.movies && form.movies.length > 0 && (
              <Box mt="10px">
                <Text fontSize="11px" color={textMuted} fontWeight="600" mb="6px">
                  Các phim khác đã tham gia:
                </Text>
                <Flex gap="6px" flexWrap="wrap">
                  {form.movies.slice(0, 5).map((m, i) => (
                    <Box key={i} px="8px" py="4px" borderRadius="6px"
                      bg={filterBg} border={`1px solid ${filterBorder}`}
                    >
                      <Text fontSize="11px" fontWeight="600" color={textSecondary}>{m}</Text>
                    </Box>
                  ))}
                  {form.movies.length > 5 && (
                    <Box px="8px" py="4px" borderRadius="6px"
                      bg={filterBg} border={`1px solid ${filterBorder}`}
                    >
                      <Text fontSize="11px" fontWeight="600" color={textSecondary}>
                        +{form.movies.length - 5} phim
                      </Text>
                    </Box>
                  )}
                </Flex>
              </Box>
            )}
          </Box>
        </Flex>

        {/* ── Right ── */}
        <Flex direction="column" gap="14px">
          {/* Photo */}
          <Box {...cardStyle} borderRadius="16px" p={{ base: "16px", md: "18px" }}>
            <SectionTitle label="Ảnh đại diện" />
            <Text sx={labelStyle} mb="7px">URL ảnh</Text>
            <FormControl mb="10px">
              <Input {...inputStyle} placeholder="https://..."
                value={form.Photo} onChange={e => set("Photo", e.target.value)} />
            </FormControl>

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

            {form.Photo ? (
              <Box borderRadius="12px" overflow="hidden" border={`1px solid ${cardBorder}`}
                h="220px" bg={inputBg}
              >
                <img src={form.Photo} alt="preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
                {form.PhotoFile && (
                  <Box p="6px 10px" bg="rgba(16,185,129,0.15)" borderTop={`1px solid ${cardBorder}`}>
                    <Flex align="center" gap="6px">
                      <Icon as={MdCheckCircle} boxSize="12px" color="#10b981" />
                      <Text fontSize="11px" color="#10b981" fontWeight="600">
                        Đã tải lên: {form.PhotoFile.name}
                      </Text>
                    </Flex>
                  </Box>
                )}
              </Box>
            ) : (
              <Flex direction="column" align="center" justify="center"
                h="160px" borderRadius="12px" bg={dashedBg} border={`2px dashed ${dashedBorder}`}
              >
                <Icon as={MdImageSearch} boxSize="28px" color={textFaint} mb="6px" />
                <Text fontSize="11.5px" color={textMuted}>Nhập URL hoặc tải ảnh lên</Text>
              </Flex>
            )}
          </Box>

          {/* Preview */}
          {form.Name && (
            <Box {...cardStyle} borderRadius="16px" p={{ base: "16px", md: "18px" }}
              sx={{ animation: `${fadeIn} 0.3s ease both` }}
            >
              <SectionTitle label="Xem trước" />
              <Flex direction="column" gap="10px">
                <Box>
                  <Text fontSize="9.5px" color={textMuted} fontWeight="700"
                    letterSpacing="0.8px" textTransform="uppercase" mb="3px">
                    Tên nghệ sĩ
                  </Text>
                  <Text fontSize="15px" fontWeight="800" color={textPrimary}>{form.Name}</Text>
                </Box>
                <Flex gap="7px" flexWrap="wrap">
                  {form.Role && <RoleBadge role={form.Role} />}
                  {form.Status && <StatusBadge status={form.Status} />}
                </Flex>
                {form.Nationality && (
                  <Flex align="center" gap="6px">
                    <Icon as={FaGlobe} boxSize="11px" color={textMuted} />
                    <Text fontSize="12px" color={textSecondary} fontWeight="600">{form.Nationality}</Text>
                  </Flex>
                )}
                {getMovieTitle(form.MovieId) && (
                  <Flex align="center" gap="6px">
                    <Icon as={FaFilm} boxSize="11px" color="#f97316" />
                    <Text fontSize="12px" color={textSecondary} fontWeight="600">
                      {getMovieTitle(form.MovieId)}
                    </Text>
                  </Flex>
                )}
                {form.movies && form.movies.length > 0 && (
                  <Flex align="center" gap="6px">
                    <Icon as={MdStar} boxSize="11px" color="#f59e0b" />
                    <Text fontSize="12px" color={textSecondary} fontWeight="600">
                      {form.movies.length} phim tham gia
                    </Text>
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
            border={`1.5px solid ${secondaryBtnBorder}`} _hover={{ bg: secondaryBtnHoverBg }} transition="all 0.2s"
            leftIcon={<Icon as={MdClose} />}
            onClick={onCancel}
          >
            Hủy bỏ
          </Button>
          <Button flex={{ base: "2", md: "none" }}
            h={{ base: "46px", md: "42px" }} px="28px" borderRadius="10px"
            fontWeight="700" fontSize="13px"
            bg="linear-gradient(135deg, #f97316 0%, #fb923c 60%, #fbbf24 100%)"
            color="#ffffff" boxShadow="0 4px 16px rgba(249,115,22,0.35)"
            _hover={{ boxShadow: "0 8px 24px rgba(249,115,22,0.45)", transform: "translateY(-1px)" }}
            _active={{ transform: "translateY(0)" }} transition="all 0.2s"
            leftIcon={<Icon as={MdCheckCircle} />}
            onClick={handleSubmit}
          >
            {isAdd ? "Thêm nghệ sĩ" : "Lưu thay đổi"}
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}