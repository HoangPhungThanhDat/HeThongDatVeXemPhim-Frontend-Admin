// views/admin/quanlyphim/components/PhimDetail.jsx

import {
    Box, Text, Button, Flex, SimpleGrid, Grid, Icon, useColorModeValue
  } from "@chakra-ui/react";
  import { 
    MdArrowBack, MdEdit, MdDeleteOutline, MdAccessTime, 
    MdCalendarToday, MdPerson, MdPublic, MdStar,
    MdLanguage, MdMovie, MdCategory
  } from "react-icons/md";
  import { FaVideo, FaTicketAlt, FaUsers } from "react-icons/fa";
  import { StatusBadge } from "./shared/StatusBadge";
  import { AgeBadge } from "./shared/AgeBadge";
  import { fadeIn, shimmer, fadeUp } from "./shared/animations";
  
  export function PhimDetail({ movie, onBack, onEdit, onDelete }) {
    const cardBg = useColorModeValue("white", "#0b1437");
    const cardBorder = useColorModeValue("#f1f5f9", "rgba(255,255,255,0.08)");
    const cardBg2 = useColorModeValue("#f8fafc", "#0B1437");
    const textPrimary = useColorModeValue("#0f172a", "#ffffff");
    const textSecondary = useColorModeValue("#475569", "#cbd5e1");
    const textMuted = useColorModeValue("#94a3b8", "#8b9bc4");
    const descBg = useColorModeValue("#fffbf7", "rgba(194,65,12,0.10)");
    const descBorder = useColorModeValue("#fed7aa", "rgba(253,186,116,0.3)");
    const descTitleColor = useColorModeValue("#92400e", "#fdba74");
    const tagBg = useColorModeValue("#fff7ed", "rgba(194,65,12,0.16)");
    const tagBorder = useColorModeValue("#fed7aa", "rgba(253,186,116,0.35)");
    const secondaryBtnBg = useColorModeValue("#f8fafc", "rgba(255,255,255,0.05)");
    const secondaryBtnBorder = useColorModeValue("#e2e8f0", "rgba(255,255,255,0.14)");
    const secondaryBtnColor = useColorModeValue("#475569", "#cbd5e1");
    const secondaryBtnHoverBg = useColorModeValue("#f1f5f9", "rgba(255,255,255,0.1)");
  
    // Lấy dữ liệu từ movie (hỗ trợ cả 2 format)
    const id = movie.MovieId || movie.id;
    const title = movie.Title || movie.title || "";
    const slug = movie.Slug || movie.slug || "";
    const poster = movie.PosterUrl || movie.posterUrl || movie.poster || "";
    const description = movie.Description || movie.description || "";
    const trailer = movie.TrailerUrl || movie.trailerUrl || movie.trailer || "";
    const duration = movie.Duration || movie.duration || 0;
    const releaseDate = movie.ReleaseDate || movie.releaseDate || "";
    const status = movie.Status || movie.status || "Ended";
    const rated = movie.Rated || movie.rated || "P";
    const format = movie.Format || movie.format || "2D";
    const director = movie.Director || movie.director || "";
    const cast = movie.Cast || movie.cast || "";
    const country = movie.Country || movie.country || "";
    const distributor = movie.Distributor || movie.distributor || "";
    const language = movie.Language || movie.language || "";
    const genreName = movie.GenreName || movie.genreName || "";
    const ticketsSold = movie.TicketsSold || movie.ticketsSold || 0;
    const rating = movie.Rating || movie.rating || 0;
    const reviewCount = movie.ReviewCount || movie.reviewCount || 0;
    const genres = movie.Genres || movie.genres || [];
    const createdAt = movie.CreatedAt || movie.createdAt || "";
    const updatedAt = movie.UpdatedAt || movie.updatedAt || "";
  
    // Hàm xử lý TrailerUrl để tạo link YouTube đúng
    const getTrailerUrl = (trailerUrl) => {
      if (!trailerUrl) return null;
      if (trailerUrl.startsWith('http://') || trailerUrl.startsWith('https://')) {
        return trailerUrl;
      }
      return `https://www.youtube.com/watch?v=${trailerUrl}`;
    };
  
    return (
      <Box sx={{ animation: `${fadeIn} 0.3s ease both` }}>
        {/* Header - Back + Actions */}
        <Flex align="center" justify="space-between" mb="20px" gap="10px"
          direction={{ base: "column", sm: "row" }}
        >
          <Button leftIcon={<Icon as={MdArrowBack} />} variant="ghost"
            color={secondaryBtnColor} borderRadius="10px" h="38px" fontSize="13px" fontWeight="600"
            border={`1.5px solid ${secondaryBtnBorder}`} _hover={{ bg: secondaryBtnHoverBg }}
            onClick={onBack}
            w={{ base: "100%", sm: "auto" }}
          >
            <Box as="span" display={{ base: "none", sm: "inline" }}>Quay lại danh sách</Box>
            <Box as="span" display={{ base: "inline", sm: "none" }}>Quay lại</Box>
          </Button>
          <Flex gap="8px" w={{ base: "100%", sm: "auto" }}>
            <Button flex="1" h="38px" px={{ base: "12px", md: "16px" }} borderRadius="10px"
              fontWeight="700" fontSize="13px"
              bg={useColorModeValue("#fff5f5", "#2d0a0a")}
              color="#ef4444"
              border="1px solid #fca5a5"
              _hover={{ bg: "#fef2f2", border: "1px solid #ef4444", boxShadow: "0 4px 14px rgba(239,68,68,0.3)" }}
              transition="all 0.2s"
              leftIcon={<Icon as={MdDeleteOutline} />}
              onClick={onDelete}
            >
              Xóa
            </Button>
            <Button flex="1" h="38px" px={{ base: "14px", md: "20px" }} borderRadius="10px"
              fontWeight="700" fontSize="13px"
              bg="linear-gradient(135deg, #f97316, #fb923c)"
              color="white" boxShadow="0 4px 14px rgba(249,115,22,0.3)"
              _hover={{ boxShadow: "0 6px 20px rgba(249,115,22,0.4)", transform: "translateY(-1px)" }}
              _active={{ transform: "translateY(0)" }} transition="all 0.2s"
              leftIcon={<Icon as={MdEdit} />}
              onClick={onEdit}
            >
              Chỉnh sửa
            </Button>
          </Flex>
        </Flex>
  
        {/* Hero Card - Poster + Info */}
        <Box bg={cardBg} borderRadius="18px" border={`1px solid ${cardBorder}`}
          boxShadow="0 2px 12px rgba(0,0,0,0.06)" overflow="hidden" mb="18px"
        >
          <Box h="4px" bg="linear-gradient(90deg, #f97316, #fbbf24, #f97316)"
            bgSize="200% 100%" sx={{ animation: `${shimmer} 3s linear infinite` }}
          />
          <Flex direction={{ base: "column", md: "row" }}>
            {/* Poster */}
            <Box
              w={{ base: "100%", md: "220px" }}
              h={{ base: "220px", md: "auto" }}
              flexShrink="0"
              bg="#0f172a"
              overflow="hidden"
            >
              {poster ? (
                <img src={poster} alt={title}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              ) : (
                <Flex h="100%" align="center" justify="center" color="whiteAlpha.500">
                  <Icon as={MdMovie} boxSize="48px" />
                </Flex>
              )}
            </Box>
  
            {/* Info */}
            <Box p={{ base: "18px", md: "26px" }} flex="1">
              <Flex justify="space-between" align="flex-start" mb="12px" gap="8px">
                <Box flex="1" minW="0">
                  <Text fontSize={{ base: "20px", md: "24px" }} fontWeight="800" color={textPrimary}
                    letterSpacing="-0.4px" mb="8px" lineHeight="1.2"
                  >
                    {title}
                  </Text>
                  <Flex gap="8px" flexWrap="wrap" align="center">
                    <StatusBadge status={status} />
                    <AgeBadge age={rated} />
                    {genreName && (
                      <Box px="8px" py="4px" borderRadius="6px" bg={tagBg} border={`1px solid ${tagBorder}`}>
                        <Text fontSize="11px" fontWeight="600" color={textMuted}>{genreName}</Text>
                      </Box>
                    )}
                    {genres.length > 0 && genres.map((g) => (
                      <Box key={g} px="8px" py="4px" borderRadius="6px" bg={tagBg} border={`1px solid ${tagBorder}`}>
                        <Text fontSize="11px" fontWeight="600" color={textMuted}>{g}</Text>
                      </Box>
                    ))}
                  </Flex>
                </Box>
                <Box textAlign="right" flexShrink="0">
                  <Flex align="center" gap="4px" justify="flex-end">
                    <Icon as={MdStar} boxSize={{ base: "18px", md: "20px" }} color="#f59e0b" />
                    <Text fontSize={{ base: "22px", md: "24px" }} fontWeight="800" color={textPrimary}>{rating}</Text>
                  </Flex>
                  <Text fontSize="10px" color={textMuted}>{reviewCount} đánh giá</Text>
                </Box>
              </Flex>
  
              <Box h="1px" bg={cardBorder} mb="14px" />
  
              {/* Quick Stats */}
              <SimpleGrid columns={{ base: 2, md: 4 }} spacing="10px" mb="14px">
                {[
                  { icon: MdAccessTime, label: "Thời lượng", val: `${duration} phút` },
                  { icon: MdCalendarToday, label: "Khởi chiếu", val: releaseDate || "Chưa cập nhật" },
                  { icon: FaVideo, label: "Định dạng", val: format || "2D" },
                  { icon: FaTicketAlt, label: "Vé đã bán", val: ticketsSold.toLocaleString() },
                ].map(({ icon: Ic, label, val }) => (
                  <Box key={label} p="10px 12px" borderRadius="10px" bg={cardBg2} border={`1px solid ${cardBorder}`}>
                    <Flex align="center" gap="5px" mb="3px">
                      <Icon as={Ic} boxSize="11px" color="#f97316" />
                      <Text fontSize="9px" fontWeight="700" color={textMuted}
                        letterSpacing="0.7px" textTransform="uppercase" noOfLines={1}
                      >
                        {label}
                      </Text>
                    </Flex>
                    <Text fontSize={{ base: "12px", md: "13px" }} fontWeight="700" color={textPrimary}>{val}</Text>
                  </Box>
                ))}
              </SimpleGrid>
  
              {/* Description */}
              {description && (
                <Box p="12px 14px" borderRadius="12px" bg={descBg} border={`1px solid ${descBorder}`}>
                  <Text fontSize="10px" fontWeight="800" color={descTitleColor} letterSpacing="1px"
                    textTransform="uppercase" mb="6px"
                  >
                    Nội dung phim
                  </Text>
                  <Text fontSize={{ base: "12.5px", md: "13px" }} color={textSecondary} lineHeight="1.7">
                    {description}
                  </Text>
                </Box>
              )}
            </Box>
          </Flex>
        </Box>
  
        {/* Detail Info - 3 columns using Grid */}
        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap="12px" mb="16px">
          {[
            { icon: MdPerson, label: "Đạo diễn", val: director || "Chưa cập nhật" },
            { icon: FaUsers, label: "Diễn viên chính", val: cast || "Chưa cập nhật" },
            { icon: MdPublic, label: "Quốc gia / NXB", val: `${country || ""} ${country && distributor ? "•" : ""} ${distributor || ""}` || "Chưa cập nhật" },
          ].map(({ icon: Ic, label, val }) => (
            <Box key={label} bg={cardBg} borderRadius="14px" border={`1px solid ${cardBorder}`}
              boxShadow="0 1px 4px rgba(0,0,0,0.04)" p="14px"
              sx={{ animation: `${fadeUp} 0.4s ease both` }}
            >
              <Flex align="center" gap="8px" mb="8px">
                <Box w="28px" h="28px" borderRadius="8px" bg={tagBg}
                  display="flex" alignItems="center" justifyContent="center"
                >
                  <Icon as={Ic} boxSize="13px" color="#f97316" />
                </Box>
                <Text fontSize="10px" fontWeight="700" color={textMuted} letterSpacing="0.8px" textTransform="uppercase">
                  {label}
                </Text>
              </Flex>
              <Text fontSize="13px" fontWeight="600" color={textPrimary} lineHeight="1.5">{val}</Text>
            </Box>
          ))}
        </Grid>
  
        {/* Additional Info - 2 columns using Grid */}
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap="12px" mb="16px">
          {[
            { icon: MdLanguage, label: "Ngôn ngữ", val: language || "Chưa cập nhật" },
            { icon: MdMovie, label: "Slug", val: slug || "Chưa cập nhật" },
          ].map(({ icon: Ic, label, val }) => (
            <Box key={label} bg={cardBg} borderRadius="14px" border={`1px solid ${cardBorder}`}
              boxShadow="0 1px 4px rgba(0,0,0,0.04)" p="14px"
              sx={{ animation: `${fadeUp} 0.45s ease both` }}
            >
              <Flex align="center" gap="8px" mb="8px">
                <Box w="28px" h="28px" borderRadius="8px" bg={tagBg}
                  display="flex" alignItems="center" justifyContent="center"
                >
                  <Icon as={Ic} boxSize="13px" color="#f97316" />
                </Box>
                <Text fontSize="10px" fontWeight="700" color={textMuted} letterSpacing="0.8px" textTransform="uppercase">
                  {label}
                </Text>
              </Flex>
              <Text fontSize="13px" fontWeight="600" color={textPrimary} lineHeight="1.5">{val}</Text>
            </Box>
          ))}
        </Grid>
  
        {/* System Info */}
        <Box bg={cardBg} borderRadius="14px" border={`1px solid ${cardBorder}`}
          boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "14px 16px", md: "16px 20px" }}
          sx={{ animation: `${fadeUp} 0.5s ease both` }}
        >
          <Flex align="center" gap="8px" mb="8px">
            <Box w="28px" h="28px" borderRadius="8px" bg={tagBg}
              display="flex" alignItems="center" justifyContent="center"
            >
              <Icon as={MdCalendarToday} boxSize="13px" color="#f97316" />
            </Box>
            <Text fontSize="10px" fontWeight="700" color={textMuted} letterSpacing="0.8px" textTransform="uppercase">
              Thông tin hệ thống
            </Text>
          </Flex>
          <Flex gap="16px" flexWrap="wrap">
            <Box px="12px" py="8px" borderRadius="8px" bg={cardBg2} border={`1px solid ${cardBorder}`}>
              <Text fontSize="10px" color={textMuted}>Mã phim</Text>
              <Text fontSize="13px" fontWeight="600" color={textPrimary}>#{id}</Text>
            </Box>
            <Box px="12px" py="8px" borderRadius="8px" bg={cardBg2} border={`1px solid ${cardBorder}`}>
              <Text fontSize="10px" color={textMuted}>Ngày tạo</Text>
              <Text fontSize="13px" fontWeight="600" color={textPrimary}>
                {createdAt ? new Date(createdAt).toLocaleDateString("vi-VN") : "N/A"}
              </Text>
            </Box>
            <Box px="12px" py="8px" borderRadius="8px" bg={cardBg2} border={`1px solid ${cardBorder}`}>
              <Text fontSize="10px" color={textMuted}>Cập nhật lần cuối</Text>
              <Text fontSize="13px" fontWeight="600" color={textPrimary}>
                {updatedAt ? new Date(updatedAt).toLocaleDateString("vi-VN") : "N/A"}
              </Text>
            </Box>
          </Flex>
        </Box>
  
        {/* Trailer */}
        {trailer && (
          <Box bg={cardBg} borderRadius="14px" border={`1px solid ${cardBorder}`}
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "14px 16px", md: "16px 20px" }}
            mt="16px"
            sx={{ animation: `${fadeUp} 0.55s ease both` }}
          >
            <Flex align="center" gap="8px" mb="8px">
              <Box w="28px" h="28px" borderRadius="8px" bg={tagBg}
                display="flex" alignItems="center" justifyContent="center"
              >
                <Icon as={FaVideo} boxSize="13px" color="#f97316" />
              </Box>
              <Text fontSize="10px" fontWeight="700" color={textMuted} letterSpacing="0.8px" textTransform="uppercase">
                Trailer phim
              </Text>
            </Flex>
            <Box px="12px" py="8px" borderRadius="8px" bg={cardBg2} border={`1px solid ${cardBorder}`}>
              <Text fontSize="13px" fontWeight="600" color="#f97316">
                <a href={getTrailerUrl(trailer)} target="_blank" rel="noopener noreferrer">
                  🎬 Xem trailer trên YouTube
                </a>
              </Text>
            </Box>
          </Box>
        )}
      </Box>
    );
  }