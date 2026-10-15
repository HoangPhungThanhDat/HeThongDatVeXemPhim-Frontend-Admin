// PhimForm.jsx - SỬA HOÀN CHỈNH
import { useState, useRef, useEffect } from "react";
import {
  Box, Grid, Text, Button, Flex, SimpleGrid, FormControl,
  Input, Select, Textarea, Icon, useColorModeValue,
  useBreakpointValue, Spinner, Image, Badge, Tag, TagLabel, TagCloseButton
} from "@chakra-ui/react";
import {
  MdArrowBack, MdClose, MdCheckCircle, MdAccessTime,
  MdCategory, MdPerson, MdImageSearch,
  MdCloudUpload, MdDelete, MdAdd
} from "react-icons/md";
import { SectionTitle } from "./shared/SectionTitle";
import { StatusBadge } from "./shared/StatusBadge";
import { AgeBadge } from "./shared/AgeBadge";
import { scaleIn, fadeIn } from "./shared/animations";
import { STATUS_OPTS, LANGUAGE_OPTS, AGE_MAP, FORMAT_OPTS } from "../constants";

export function PhimForm({ movie, genres = [], onCancel, onSave, isAdd = false }) {
  const isDark = useColorModeValue(false, true);
  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // ✅ State quản lý danh sách diễn viên/đạo diễn - TÁCH RIÊNG
  const [castMembers, setCastMembers] = useState([]);
  const [newCastName, setNewCastName] = useState("");
  const [newCastRole, setNewCastRole] = useState("Actor");

  const empty = {
    title: "",
    genre: "",
    duration: "",
    releaseDate: "",
    status: "NowShowing",
    rated: "P",
    format: "2D",
    director: "",
    country: "",
    distributor: "",
    poster: "",
    posterFile: null,
    trailer: "",
    description: "",
    language: [],
  };

  // ✅ Khởi tạo form và castMembers
  const [form, setForm] = useState(() => {
    if (movie) {
      let language = movie.Language || movie.language || [];
      if (!Array.isArray(language)) {
        language = language.split(",").filter(Boolean);
      }

      // ✅ Khởi tạo cast members từ movie
      let initialCast = [];
      if (movie.castMembers && Array.isArray(movie.castMembers)) {
        initialCast = movie.castMembers.map(c => ({
          id: c.CastId || c.castId || c.id || `cast_${Date.now()}_${Math.random()}`,
          name: c.Name || c.name || "",
          role: c.Role || c.role || "Actor",
          isNew: false,
        }));
      }
      
      // Nếu có chuỗi cast cũ
      if (initialCast.length === 0 && (movie.cast || movie.Cast)) {
        const castStr = movie.Cast || movie.cast || "";
        const names = castStr.split(",").filter(Boolean);
        initialCast = names.map((name, index) => ({
          id: `temp_${Date.now()}_${index}`,
          name: name.trim(),
          role: "Actor",
          isNew: true,
        }));
      }

      // ✅ Gán vào state
      setCastMembers(initialCast);

      return {
        title: movie.Title || movie.title || "",
        genre: movie.GenreId || movie.genreId || movie.genre || "",
        duration: movie.Duration || movie.duration || "",
        releaseDate: movie.ReleaseDate || movie.releaseDate || "",
        status: movie.Status || movie.status || "NowShowing",
        rated: movie.Rated || movie.rated || "P",
        format: movie.Format || movie.format || "2D",
        director: movie.Director || movie.director || "",
        country: movie.Country || movie.country || "",
        distributor: movie.Distributor || movie.distributor || "",
        poster: movie.PosterUrl || movie.posterUrl || movie.poster || "",
        posterFile: null,
        trailer: movie.TrailerUrl || movie.trailerUrl || movie.trailer || "",
        description: movie.Description || movie.description || "",
        language: language,
      };
    }
    return { ...empty };
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // ✅ Hàm thêm diễn viên/đạo diễn
  const handleAddCastMember = () => {
    const trimmedName = newCastName.trim();
    if (!trimmedName) {
      return;
    }

    // Kiểm tra trùng lặp
    const exists = castMembers.some(
      m => m.name.toLowerCase() === trimmedName.toLowerCase() && m.role === newCastRole
    );
    if (exists) {
      return;
    }

    const newMember = {
      id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      name: trimmedName,
      role: newCastRole,
      isNew: true,
    };

    setCastMembers(prev => [...prev, newMember]);
    setNewCastName("");
    setNewCastRole("Actor");
  };

  // ✅ Hàm xóa diễn viên/đạo diễn
  const handleRemoveCastMember = (id) => {
    setCastMembers(prev => prev.filter(m => m.id !== id));
  };

  // ✅ LOG: Kiểm tra castMembers khi thay đổi
  useEffect(() => {
    console.log('📊 [PhimForm] Current castMembers:', castMembers);
  }, [castMembers]);

  // ✅ Hàm submit
  const handleSubmit = async () => {
    console.log('🚀 [PhimForm] handleSubmit started');
    console.log('📊 [PhimForm] castMembers before submit:', castMembers);
    
    // Validation
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

    setIsSubmitting(true);

    try {
      let language = Array.isArray(form.language) ? form.language : [];
      if (language.length === 0) language = ["Vietsub"];
      const languageString = language.join(",");
      
      // ✅ Lấy danh sách cast members để gửi (CHỈ LẤY CAST MỚI)
      const castMembersToSend = castMembers
        .filter(m => m.isNew || m.id?.startsWith('temp_'))
        .map(m => ({
          name: m.name,
          role: m.role
        }));
      
      console.log('📤 [PhimForm] castMembersToSend:', castMembersToSend);
      
      const submitData = {
        Title: form.title.trim(),
        GenreId: form.genre,
        Duration: parseInt(form.duration),
        ReleaseDate: form.releaseDate,
        Status: form.status || "NowShowing",
        Rated: form.rated || "P",
        Format: form.format || "2D",
        Director: form.director || "",
        Country: form.country || "",
        Distributor: form.distributor || "",
        TrailerUrl: form.trailer || "",
        Description: form.description || "",
        Language: languageString,
        // ✅ Gửi CastMembers
        CastMembers: castMembersToSend,
      };

      console.log('📤 [PhimForm] Final submitData:', JSON.stringify(submitData, null, 2));

      if (form.posterFile instanceof File) {
        submitData.PosterFile = form.posterFile;
      }

      await onSave(submitData);
      console.log('✅ [PhimForm] Submit completed');
    } catch (error) {
      console.error("❌ [PhimForm] Lỗi khi submit form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==================== STYLES ====================
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

  // ✅ Render danh sách cast members - SỬA: dùng state castMembers
  const renderCastMembers = () => {
    if (castMembers.length === 0) {
      return (
        <Text fontSize="13px" color={textMuted} py="8px">
          Chưa có diễn viên/đạo diễn nào. Thêm bên dưới.
        </Text>
      );
    }

    return (
      <Flex flexWrap="wrap" gap="8px" mb="12px">
        {castMembers.map((member) => (
          <Tag
            key={member.id}
            size="md"
            borderRadius="full"
            variant="solid"
            bg={member.role === "Director" ? "purple.100" : "blue.100"}
            color={member.role === "Director" ? "purple.800" : "blue.800"}
            px="12px"
            py="4px"
          >
            <TagLabel fontSize="12px" fontWeight="600">
              {member.name}
              {member.isNew && (
                <Badge ml="1" fontSize="8px" color="green.500" bg="green.100">
                  mới
                </Badge>
              )}
            </TagLabel>
            <Badge
              ml="6px"
              fontSize="9px"
              bg={member.role === "Director" ? "purple.200" : "blue.200"}
              color={member.role === "Director" ? "purple.700" : "blue.700"}
              px="6px"
              borderRadius="full"
            >
              {member.role === "Director" ? "Đạo diễn" : "Diễn viên"}
            </Badge>
            <TagCloseButton onClick={() => handleRemoveCastMember(member.id)} />
          </Tag>
        ))}
      </Flex>
    );
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
          isDisabled={isSubmitting}
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
                    value={form.title} 
                    isDisabled={isSubmitting}
                    onChange={(e) => set("title", e.target.value)} />
                </FormControl>
              </Box>
            </Grid>
            <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap="14px" mb="14px">
              <Box>
                <Text sx={labelStyle}>Thể loại *</Text>
                <FormControl>
                  <Select {...inputStyle} value={form.genre}
                    isDisabled={isSubmitting}
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
                    isDisabled={isSubmitting}
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
                    value={form.duration} 
                    isDisabled={isSubmitting}
                    onChange={(e) => set("duration", e.target.value)} />
                </FormControl>
              </Box>
              <Box>
                <Text sx={labelStyle}>Ngày khởi chiếu *</Text>
                <FormControl>
                  <Input {...inputStyle} type="date" value={form.releaseDate}
                    isDisabled={isSubmitting}
                    onChange={(e) => set("releaseDate", e.target.value)} />
                </FormControl>
              </Box>
              <Box>
                <Text sx={labelStyle}>Định dạng</Text>
                <FormControl>
                  <Select {...inputStyle} value={form.format}
                    isDisabled={isSubmitting}
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
            <SectionTitle label="Diễn viên & Đạo diễn" />
            
            {/* Hiển thị danh sách */}
            {renderCastMembers()}

            {/* Form thêm mới */}
            <Grid templateColumns={{ base: "1fr", sm: "2fr 1fr auto" }} gap="10px" mt="12px">
              <Box>
                <FormControl>
                  <Input 
                    {...inputStyle} 
                    placeholder="Nhập tên diễn viên/đạo diễn..."
                    value={newCastName}
                    isDisabled={isSubmitting}
                    onChange={(e) => setNewCastName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCastMember();
                      }
                    }}
                  />
                </FormControl>
              </Box>
              <Box>
                <FormControl>
                  <Select 
                    {...inputStyle} 
                    value={newCastRole}
                    isDisabled={isSubmitting}
                    onChange={(e) => setNewCastRole(e.target.value)}
                  >
                    <option value="Actor">Diễn viên</option>
                    <option value="Director">Đạo diễn</option>
                  </Select>
                </FormControl>
              </Box>
              <Button
                leftIcon={<Icon as={MdAdd} />}
                bg="linear-gradient(135deg, #f97316 0%, #fb923c 60%, #fbbf24 100%)"
                color="#ffffff"
                borderRadius="10px"
                h="44px"
                px="20px"
                fontSize="12px"
                fontWeight="700"
                _hover={{ opacity: 0.9, transform: "translateY(-1px)" }}
                _active={{ transform: "translateY(0)" }}
                transition="all 0.2s"
                onClick={handleAddCastMember}
                isDisabled={isSubmitting || !newCastName.trim()}
                flexShrink={0}
              >
                Thêm
              </Button>
            </Grid>

            {/* Thông tin bổ sung */}
            <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap="14px" mt="14px">
              <Box>
                <Text sx={labelStyle}>Nhà phát hành</Text>
                <FormControl>
                  <Input {...inputStyle} placeholder="VD: Marvel Studios"
                    value={form.distributor} 
                    isDisabled={isSubmitting}
                    onChange={(e) => set("distributor", e.target.value)} />
                </FormControl>
              </Box>
              <Box>
                <Text sx={labelStyle}>Quốc gia sản xuất</Text>
                <FormControl>
                  <Input {...inputStyle} placeholder="VD: Mỹ"
                    value={form.country} 
                    isDisabled={isSubmitting}
                    onChange={(e) => set("country", e.target.value)} />
                </FormControl>
              </Box>
            </Grid>
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
                    isDisabled={isSubmitting}
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
                    value={form.trailer} 
                    isDisabled={isSubmitting}
                    onChange={(e) => set("trailer", e.target.value)} />
                </FormControl>
              </Box>
            </Grid>
            <Box mb="14px">
              <Text sx={labelStyle}>Ngôn ngữ</Text>
              <Flex gap="16px" flexWrap="wrap">
                {LANGUAGE_OPTS.map(lang => (
                  <label key={lang} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: isSubmitting ? "not-allowed" : "pointer" }}>
                    <input
                      type="checkbox"
                      checked={(form.language || []).includes(lang)}
                      onChange={() => {
                        const current = Array.isArray(form.language) ? form.language : [];
                        const newLangs = current.includes(lang)
                          ? current.filter(l => l !== lang)
                          : [...current, lang];
                        set("language", newLangs);
                      }}
                      disabled={isSubmitting}
                      style={{ width: "18px", height: "18px", cursor: isSubmitting ? "not-allowed" : "pointer" }}
                    />
                    <span style={{ opacity: isSubmitting ? 0.6 : 1 }}>{lang}</span>
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
                  value={form.description} 
                  isDisabled={isSubmitting}
                  onChange={(e) => set("description", e.target.value)}
                />
              </FormControl>
            </Box>
          </Box>
        </Flex>

        {/* Right - Poster */}
        <Flex direction="column" gap="14px">
          <Box {...cardStyle} borderRadius="16px" border={`1px solid ${cardBorder}`}
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "18px" }}
          >
            <SectionTitle label="Poster phim" />
            <Text sx={labelStyle} mb="7px">URL poster (dọc)</Text>
            <FormControl mb="10px">
              <Input {...inputStyle} placeholder="https://..."
                value={form.poster} 
                isDisabled={isSubmitting}
                onChange={(e) => set("poster", e.target.value)} />
            </FormControl>

            {(form.poster || imagePreview) && (
              <Box position="relative" mb="12px" borderRadius="10px" overflow="hidden" border={`1px solid ${cardBorder}`}>
                <Image 
                  src={imagePreview || form.poster} 
                  alt="Poster preview"
                  objectFit="cover"
                  w="100%"
                  h="250px"
                  fallbackSrc="https://via.placeholder.com/600x900?text=Không+có+ảnh"
                />
                <Button
                  position="absolute"
                  top="8px"
                  right="8px"
                  size="sm"
                  colorScheme="red"
                  borderRadius="full"
                  onClick={() => {
                    set("posterFile", null);
                    set("poster", null);
                    setImagePreview(null);
                  }}
                  isDisabled={isSubmitting}
                >
                  <Icon as={MdDelete} />
                </Button>
              </Box>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                if (!file.type.startsWith("image/")) {
                  alert("Vui lòng chọn file ảnh");
                  return;
                }
                if (file.size > 5 * 1024 * 1024) {
                  alert("Ảnh phải nhỏ hơn 5MB");
                  return;
                }
                set("posterFile", file);
                const reader = new FileReader();
                reader.onload = (ev) => {
                  setImagePreview(ev.target.result);
                  set("poster", ev.target.result);
                };
                reader.readAsDataURL(file);
                e.target.value = "";
              }}
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
              {form.posterFile ? 'Thay đổi ảnh' : 'Tải ảnh lên từ máy tính'}
            </Button>

            {!form.poster && !imagePreview && (
              <Flex direction="column" align="center" justify="center"
                h="100px" borderRadius="10px" bg={dashedBg} border={`2px dashed ${dashedBorder}`}
              >
                <Icon as={MdImageSearch} boxSize="28px" color={textFaint} mb="6px" />
                <Text fontSize="12px" color={textMuted}>Nhập URL hoặc tải ảnh lên</Text>
              </Flex>
            )}
          </Box>

          {/* Quick preview - SỬA: dùng state castMembers */}
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
                {castMembers.length > 0 && (
                  <Flex align="center" gap="6px" flexWrap="wrap">
                    <Icon as={MdPerson} boxSize="12px" color={textMuted} />
                    <Text fontSize="11px" color={textSecondary} fontWeight="500">
                      {castMembers.slice(0, 5).map(m => m.name).join(", ")}
                      {castMembers.length > 5 && ` +${castMembers.length - 5}`}
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
            isDisabled={isSubmitting}
          >
            Hủy bỏ
          </Button>
          <Button flex={{ base: "2", md: "none" }}
            h={{ base: "46px", md: "42px" }} px="28px" borderRadius="10px"
            fontWeight="700" fontSize="13px"
            bg="linear-gradient(135deg, #f97316 0%, #fb923c 60%, #fbbf24 100%)"
            color="#ffffff" boxShadow="0 4px 16px rgba(249,115,22,0.35)"
            _hover={{ boxShadow: isSubmitting ? "0 4px 16px rgba(249,115,22,0.35)" : "0 8px 24px rgba(249,115,22,0.45)", transform: isSubmitting ? "none" : "translateY(-1px)" }}
            _active={{ transform: "translateY(0)" }} transition="all 0.2s"
            leftIcon={isSubmitting ? <Spinner size="sm" color="white" /> : <Icon as={MdCheckCircle} />}
            onClick={handleSubmit}
            isDisabled={isSubmitting}
            opacity={isSubmitting ? 0.8 : 1}
          >
            {isSubmitting ? "Đang xử lý..." : (isAdd ? "Thêm phim" : "Lưu thay đổi")}
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}