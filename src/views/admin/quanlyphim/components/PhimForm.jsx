import { useState, useRef } from "react";
import {
  Box, Grid, Text, Button, Flex, SimpleGrid, FormControl,
  Input, Select, Textarea, Icon, useColorModeValue,
  useBreakpointValue
} from "@chakra-ui/react";
import {
  MdArrowBack, MdClose, MdCheckCircle, MdCalendarToday,
  MdAccessTime, MdCategory, MdPerson, MdPublic, MdImageSearch,
  MdCloudUpload, MdSchedule
} from "react-icons/md";
import { FaFilm } from "react-icons/fa";
import { SectionTitle } from "./shared/SectionTitle";
import { StatusBadge } from "./shared/StatusBadge";
import { AgeBadge } from "./shared/AgeBadge";
import { scaleIn, fadeIn } from "./shared/animations";
import { STATUS_OPTS, GENRE_OPTS, LANGUAGE_OPTS, AGE_MAP, FORMAT_OPTS } from "../constants";

export function PhimForm({ movie, genres = [], onCancel, onSave, isAdd = false }) {
  const isDark = useColorModeValue(false, true);
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const empty = {
    title: "",
    genre: "",
    duration: "",
    releaseDate: "",
    status: "NowShowing",
    rated: "P",
    format: "2D",
    director: "",
    cast: "",
    country: "",
    distributor: "",
    poster: "",
    posterFile: null,
    trailer: "",
    description: "",
    language: [], // Luôn là array
  };

  const [form, setForm] = useState(() => {
    if (movie) {
      // ✅ Đảm bảo language luôn là array
      let language = movie.Language || movie.language || [];
      if (!Array.isArray(language)) {
        language = language.split(",").filter(Boolean);
      }
      
      return {
        title: movie.Title || movie.title || "",
        genre: movie.GenreId || movie.genreId || movie.genre || "",
        duration: movie.Duration || movie.duration || "",
        releaseDate: movie.ReleaseDate || movie.releaseDate || "",
        status: movie.Status || movie.status || "NowShowing",
        rated: movie.Rated || movie.rated || "P",
        format: movie.Format || movie.format || "2D",
        director: movie.Director || movie.director || "",
        cast: movie.Cast || movie.cast || "",
        country: movie.Country || movie.country || "",
        distributor: movie.Distributor || movie.distributor || "",
        poster: movie.PosterUrl || movie.posterUrl || movie.poster || "",
        posterFile: null,
        trailer: movie.TrailerUrl || movie.trailerUrl || movie.trailer || "",
        description: movie.Description || movie.description || "",
        language: language, // Luôn là array
      };
    }
    return empty;
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // ✅ SỬA LỖI: Đảm bảo current là array
  const handleLanguageChange = (lang) => {
    const current = Array.isArray(form.language) ? form.language : [];
    const newLangs = current.includes(lang)
      ? current.filter(l => l !== lang)
      : [...current, lang];
    set("language", newLangs);
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
    
    setUploading(true);
    
    // ✅ Lưu file để gửi lên server
    set("posterFile", file);
    
    // ✅ Đọc file để hiển thị preview
    const reader = new FileReader();
    reader.onload = (ev) => {
      set("poster", ev.target.result);
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
    if (!form.title.trim()) {
      alert("Vui lòng nhập tên phim");
      return;
    }
    
    if (!form.genre) {
      alert("Vui lòng chọn thể loại phim");
      return;
    }
    
    if (!form.duration || parseInt(form.duration) <= 0) {
      alert("Vui lòng nhập thời lượng phim hợp lệ");
      return;
    }
    
    if (!form.releaseDate) {
      alert("Vui lòng chọn ngày khởi chiếu");
      return;
    }

    // ✅ Đảm bảo language là array và có ít nhất 1 giá trị
    let language = Array.isArray(form.language) ? form.language : [];
    
    // ✅ Nếu language rỗng, thêm giá trị mặc định
    if (language.length === 0) {
      language = ["Vietsub"];
    }
    
    // ✅ Chuyển language thành string để gửi lên server
    const languageString = language.join(",");
    
    const submitData = {
      Title: form.title.trim(),
      GenreId: form.genre,
      Duration: parseInt(form.duration),
      ReleaseDate: form.releaseDate,
      Status: form.status || "NowShowing",
      Rated: form.rated || "P",
      Format: form.format || "2D",
      Director: form.director || "",
      Cast: form.cast || "",
      Country: form.country || "",
      Distributor: form.distributor || "",
      TrailerUrl: form.trailer || "",
      Description: form.description || "",
      Language: languageString, // ✅ Luôn có giá trị
    };

    // ✅ Nếu có file poster mới
    if (form.posterFile instanceof File) {
      submitData.PosterFile = form.posterFile;
    }

    console.log("📤 DỮ LIỆU GỬI ĐI:");
    console.log({
      ...submitData,
      PosterFile: submitData.PosterFile ? `[FILE] ${submitData.PosterFile.name}` : "Không có ảnh mới"
    });

    onSave(submitData);
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
  const textFaint = useColorModeValue("#cbd5e1", "#3c4b70");
  const dashedBg = useColorModeValue("#f8fafc", "rgba(255,255,255,0.03)");
  const dashedBorder = useColorModeValue("#e2e8f0", "rgba(255,255,255,0.18)");
  const tagBg = useColorModeValue("#fff7ed", "rgba(194,65,12,0.16)");
  const tagBorder = useColorModeValue("#fed7aa", "rgba(253,186,116,0.35)");
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

  return (
    <Box sx={{ animation: `${scaleIn} 0.3s ease both` }}>
      {/* Header */}
      <Flex align={{ base: "flex-start", md: "center" }} gap="12px" mb="20px"
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
            {isAdd ? "Thêm phim mới" : `Chỉnh sửa: ${movie?.title}`}
          </Text>
          <Text fontSize="12px" color={textMuted} mt="2px">
            {isAdd ? "Điền đầy đủ thông tin để thêm phim vào hệ thống" : "Cập nhật thông tin phim"}
          </Text>
        </Box>
      </Flex>

      <Grid templateColumns={{ base: "1fr", lg: "1fr 340px" }} gap="16px">
        {/* Left */}
        <Flex direction="column" gap="0">
          {/* Basic info */}
          <Box {...cardStyle} borderRadius="16px" border={`1px solid ${cardBorder}`}
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "20px" }} mb="14px"
          >
            <SectionTitle label="Thông tin cơ bản" />
            <Grid templateColumns="1fr" gap="14px" mb="14px">
              <Box>
                <Text sx={labelStyle}>Tên phim *</Text>
                <FormControl>
                  <Input {...inputStyle} placeholder="VD: Avengers: Endgame"
                    value={form.title} onChange={(e) => set("title", e.target.value)} />
                </FormControl>
              </Box>
            </Grid>
            <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap="14px" mb="14px">
              <Box>
                <Text sx={labelStyle}>Thể loại *</Text>
                <FormControl>
                  <Select {...inputStyle} value={form.genre}
                    onChange={(e) => set("genre", e.target.value)}>
                    <option value="">-- Chọn thể loại --</option>
                    {genres.map((g) => (
                      <option key={g.GenreId || g.id} value={g.GenreId || g.id}>
                        {g.Name || g.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box>
                <Text sx={labelStyle}>Phân loại tuổi *</Text>
                <FormControl>
                  <Select {...inputStyle} value={form.rated}
                    onChange={(e) => set("rated", e.target.value)}>
                    {Object.entries(AGE_MAP).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }} gap="14px">
              <Box>
                <Text sx={labelStyle}>Thời lượng (phút) *</Text>
                <FormControl>
                  <Input {...inputStyle} type="number" placeholder="VD: 120"
                    value={form.duration} onChange={(e) => set("duration", e.target.value)} />
                </FormControl>
              </Box>
              <Box>
                <Text sx={labelStyle}>Ngày khởi chiếu *</Text>
                <FormControl>
                  <Input {...inputStyle} type="date" value={form.releaseDate}
                    onChange={(e) => set("releaseDate", e.target.value)} />
                </FormControl>
              </Box>
              <Box>
                <Text sx={labelStyle}>Định dạng</Text>
                <FormControl>
                  <Select {...inputStyle} value={form.format}
                    onChange={(e) => set("format", e.target.value)}>
                    {FORMAT_OPTS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>
          </Box>

          {/* Cast & crew */}
          <Box {...cardStyle} borderRadius="16px" border={`1px solid ${cardBorder}`}
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "20px" }} mb="14px"
          >
            <SectionTitle label="Đội ngũ & Sản xuất" />
            <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap="14px" mb="14px">
              <Box>
                <Text sx={labelStyle}>Đạo diễn</Text>
                <FormControl>
                  <Input {...inputStyle} placeholder="VD: Christopher Nolan"
                    value={form.director} onChange={(e) => set("director", e.target.value)} />
                </FormControl>
              </Box>
              <Box>
                <Text sx={labelStyle}>Quốc gia sản xuất</Text>
                <FormControl>
                  <Input {...inputStyle} placeholder="VD: Mỹ"
                    value={form.country} onChange={(e) => set("country", e.target.value)} />
                </FormControl>
              </Box>
            </Grid>
            <Box mb="14px">
              <Text sx={labelStyle}>Diễn viên chính</Text>
              <FormControl>
                <Input {...inputStyle} placeholder="VD: Tom Hanks, Cate Blanchett (phân cách bằng dấu phẩy)"
                  value={form.cast} onChange={(e) => set("cast", e.target.value)} />
              </FormControl>
            </Box>
            <Box>
              <Text sx={labelStyle}>Nhà phát hành</Text>
              <FormControl>
                <Input {...inputStyle} placeholder="VD: Marvel Studios"
                  value={form.distributor} onChange={(e) => set("distributor", e.target.value)} />
              </FormControl>
            </Box>
          </Box>

          {/* Status & content */}
          <Box {...cardStyle} borderRadius="16px" border={`1px solid ${cardBorder}`}
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "20px" }}
          >
            <SectionTitle label="Trạng thái & Nội dung" />
            <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap="14px" mb="14px">
              <Box>
                <Text sx={labelStyle}>Trạng thái *</Text>
                <FormControl>
                  <Select {...inputStyle} value={form.status}
                    onChange={(e) => set("status", e.target.value)}>
                    {STATUS_OPTS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box>
                <Text sx={labelStyle}>Link trailer (YouTube)</Text>
                <FormControl>
                  <Input {...inputStyle} placeholder="https://youtu.be/..."
                    value={form.trailer} onChange={(e) => set("trailer", e.target.value)} />
                </FormControl>
              </Box>
            </Grid>
            <Box mb="14px">
              <Text sx={labelStyle}>Ngôn ngữ</Text>
              <Flex gap="16px" flexWrap="wrap">
                {LANGUAGE_OPTS.map(lang => (
                  <label key={lang} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={(form.language || []).includes(lang)}
                      onChange={() => handleLanguageChange(lang)}
                      style={{ width: "18px", height: "18px", cursor: "pointer" }}
                    />
                    <span>{lang}</span>
                  </label>
                ))}
              </Flex>
            </Box>
            <Box>
              <Text sx={labelStyle}>Mô tả / Nội dung phim</Text>
              <FormControl>
                <Textarea
                  bg={inputBg} border={`1.5px solid ${inputBorder}`} borderRadius="10px"
                  color={inputColor} fontSize="14px" fontWeight="500" px="14px" py="10px"
                  _placeholder={{ color: placeholderColor }}
                  _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.10)", bg: useColorModeValue("#ffffff", "#111C44") }}
                  _hover={{ border: "1.5px solid #f97316" }}
                  transition="all 0.2s"
                  rows={4} placeholder="Nhập mô tả nội dung phim..."
                  value={form.description} onChange={(e) => set("description", e.target.value)}
                />
              </FormControl>
            </Box>
          </Box>
        </Flex>

        {/* Right */}
        <Flex direction="column" gap="14px">
          {/* Poster */}
          <Box {...cardStyle} borderRadius="16px" border={`1px solid ${cardBorder}`}
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "18px" }}
          >
            <SectionTitle label="Poster phim" />
            <Text sx={labelStyle} mb="7px">URL poster (dọc)</Text>
            <FormControl mb="10px">
              <Input {...inputStyle} placeholder="https://..."
                value={form.poster} onChange={(e) => set("poster", e.target.value)} />
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

            {form.poster ? (
              <Box borderRadius="10px" overflow="hidden" border={`1px solid ${cardBorder}`}>
                <img src={form.poster} alt="poster preview"
                  style={{ width: "100%", display: "block", maxHeight: "300px", objectFit: "cover" }}
                  onError={(e) => { e.target.style.display = "none"; }} />
                {form.posterFile && (
                  <Box p="6px 10px" bg="rgba(16,185,129,0.15)" borderTop={`1px solid ${cardBorder}`}>
                    <Flex align="center" gap="6px">
                      <Icon as={MdCheckCircle} boxSize="12px" color="#10b981" />
                      <Text fontSize="11px" color="#10b981" fontWeight="600">
                        Đã tải lên: {form.posterFile.name}
                      </Text>
                    </Flex>
                  </Box>
                )}
              </Box>
            ) : (
              <Flex direction="column" align="center" justify="center"
                h="160px" borderRadius="10px" bg={dashedBg} border={`2px dashed ${dashedBorder}`}
              >
                <Icon as={MdImageSearch} boxSize="28px" color={textFaint} mb="6px" />
                <Text fontSize="12px" color={textMuted}>Nhập URL hoặc tải ảnh lên</Text>
              </Flex>
            )}
          </Box>

          {/* Quick preview */}
          {(form.title || form.status) && (
            <Box {...cardStyle} borderRadius="16px" border={`1px solid ${cardBorder}`}
              boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "18px" }}
              sx={{ animation: `${fadeIn} 0.3s ease both` }}
            >
              <SectionTitle label="Xem trước" />
              <Flex direction="column" gap="10px">
                {form.title && (
                  <Box>
                    <Text fontSize="10px" color={textMuted} fontWeight="700" letterSpacing="0.8px" textTransform="uppercase" mb="3px">
                      Tên phim
                    </Text>
                    <Text fontSize="14px" fontWeight="700" color={textPrimary}>{form.title}</Text>
                  </Box>
                )}
                <Flex gap="8px" flexWrap="wrap">
                  {form.status && <StatusBadge status={form.status} />}
                  {form.rated && <AgeBadge age={form.rated} />}
                </Flex>
                {form.duration && (
                  <Flex align="center" gap="6px">
                    <Icon as={MdAccessTime} boxSize="12px" color={textMuted} />
                    <Text fontSize="12px" color={textSecondary} fontWeight="600">{form.duration} phút</Text>
                  </Flex>
                )}
                {form.genre && genres.find(g => (g.GenreId || g.id) === form.genre) && (
                  <Flex align="center" gap="6px">
                    <Icon as={MdCategory} boxSize="12px" color={textMuted} />
                    <Text fontSize="12px" color={textSecondary} fontWeight="600">
                      {genres.find(g => (g.GenreId || g.id) === form.genre)?.Name || form.genre}
                    </Text>
                  </Flex>
                )}
              </Flex>
            </Box>
          )}
        </Flex>
      </Grid>

      {/* Save bar */}
      <Box {...cardStyle} borderRadius="14px" border={`1px solid ${cardBorder}`}
        boxShadow="0 1px 4px rgba(0,0,0,0.04)"
        p={{ base: "14px 16px", md: "16px 20px" }} mt="16px"
        position={{ base: "sticky", md: "static" }}
        bottom={{ base: "0", md: "auto" }}
        zIndex="10"
      >
        <Flex justify={{ base: "stretch", md: "flex-end" }} gap="10px"
          direction={{ base: "row", md: "row" }}
        >
          <Button flex={{ base: "1", md: "none" }}
            h={{ base: "46px", md: "42px" }} px="22px" variant="ghost"
            color={secondaryBtnColor} borderRadius="10px" fontWeight="600" fontSize="13px"
            border={`1.5px solid ${secondaryBtnBorder}`} _hover={{ bg: secondaryBtnBg }} transition="all 0.2s"
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
            {isAdd ? "Thêm phim" : "Lưu thay đổi"}
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}