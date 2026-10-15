// views/admin/quanlydienvien/components/DienVienDetail.jsx

import {
    Box, Text, Button, Flex, SimpleGrid, Icon, useColorModeValue
  } from "@chakra-ui/react";
  import { 
    MdArrowBack, MdEdit, MdDelete, MdCalendarToday, 
    MdPerson, MdStar, MdAccessTime
  } from "react-icons/md";
  import { FaFilm, FaGlobe, FaUserCircle } from "react-icons/fa";
  import { StatusBadge } from "./shared/StatusBadge";
  import { RoleBadge } from "./shared/RoleBadge";
  import { fadeIn, shimmer, fadeUp } from "./shared/animations";
  
  export function DienVienDetail({ artist, movies, onBack, onEdit, onDelete }) {
    const cardBg = useColorModeValue("white", "#0b1437");
    const cardBorder = useColorModeValue("#f1f5f9", "rgba(255,255,255,0.08)");
    const cardBg2 = useColorModeValue("#f8fafc", "#0B1437");
    const textPrimary = useColorModeValue("#0f172a", "#ffffff");
    const textSecondary = useColorModeValue("#475569", "#cbd5e1");
    const textMuted = useColorModeValue("#94a3b8", "#8b9bc4");
    const tagBg = useColorModeValue("#fff7ed", "rgba(194,65,12,0.16)");
    const tagBorder = useColorModeValue("#fed7aa", "rgba(253,186,116,0.35)");
    const descBg = useColorModeValue("#fffbf7", "rgba(194,65,12,0.10)");
    const descBorder = useColorModeValue("#fed7aa", "rgba(253,186,116,0.3)");
    const secondaryBtnBg = useColorModeValue("#f8fafc", "rgba(255,255,255,0.05)");
    const secondaryBtnBorder = useColorModeValue("#e2e8f0", "rgba(255,255,255,0.14)");
    const secondaryBtnColor = useColorModeValue("#475569", "#cbd5e1");
    const secondaryBtnHoverBg = useColorModeValue("#f1f5f9", "rgba(255,255,255,0.1)");
    const filterBg = useColorModeValue("#f8fafc", "#1b2559");
  
    // Lay du lieu
    const id = artist.CastId || artist.id;
    const name = artist.Name || artist.name || "";
    const role = artist.Role || artist.role || "Actor";
    const status = artist.Status || artist.status || "Active";
    const nationality = artist.Nationality || artist.nationality || "";
    const photo = artist.Photo || artist.photo || "";
    const bio = artist.Bio || artist.bio || "";
    const awards = artist.Awards || artist.awards || "";
    const createdAt = artist.CreatedAt || artist.createdAt || "";
    const updatedAt = artist.UpdatedAt || artist.updatedAt || "";
    const createdBy = artist.CreatedBy || artist.createdBy || "N/A";
    const updatedBy = artist.UpdatedBy || artist.updatedBy || "N/A";
    const movieId = artist.MovieId || artist.movieId || "";
    
    // Tim ten phim chinh
    const movieTitle = movies.find(function(m) {
      return (m.MovieId || m.id) === movieId;
    })?.Title || movieId || "N/A";
    
    // Tao danh sach phim tham gia
    var movieList = artist.movies || [];
    var displayMovies = movieList.length > 0 
      ? movieList 
      : (movieTitle && movieTitle !== "N/A" ? [movieTitle] : []);
    var displayMovieCount = displayMovies.length;
  
    var isActive = status === "Active";
  
    // Hien thi vai tro tieng Viet
    function getRoleLabel(role) {
      var map = {
        "Actor": "Diễn viên",
        "Director": "Đạo diễn",
        "Producer": "Nhà sản xuất",
        "Writer": "Biên kịch"
      };
      return map[role] || role;
    }
  
    return (
      <Box sx={{ animation: fadeIn + " 0.3s ease both" }}>
        {/* Header - Back + Actions */}
        <Flex align="center" justify="space-between" mb="20px" gap="10px"
          direction={{ base: "column", sm: "row" }}
        >
          <Button leftIcon={<Icon as={MdArrowBack} />} variant="ghost"
            color={secondaryBtnColor} borderRadius="10px" h="38px" fontSize="13px" fontWeight="600"
            border={"1.5px solid " + secondaryBtnBorder} _hover={{ bg: secondaryBtnHoverBg }}
            onClick={onBack}
            w={{ base: "100%", sm: "auto" }}
          >
            Quay lại danh sách
          </Button>
          <Flex gap="8px" w={{ base: "100%", sm: "auto" }}>
            <Button flex="1" h="38px" px={{ base: "12px", md: "18px" }} borderRadius="10px"
              fontWeight="700" fontSize="13px"
              bg={useColorModeValue("#fff5f5", "#2d0a0a")}
              color="#dc2626" border={"1px solid " + useColorModeValue("#fca5a5", "rgba(239,68,68,0.3)")}
              _hover={{ bg: useColorModeValue("#fee2e2", "rgba(239,68,68,0.22)"), transform: "translateY(-1px)" }}
              transition="all 0.2s"
              leftIcon={<Icon as={MdDelete} />}
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
  
        {/* Hero Card */}
        <Box bg={cardBg} borderRadius="18px" border={"1px solid " + cardBorder}
          boxShadow="0 2px 12px rgba(0,0,0,0.06)" overflow="hidden" mb="18px"
        >
          <Box h="4px" bg="linear-gradient(90deg, #f97316, #fbbf24, #f97316)"
            bgSize="200% 100%" sx={{ animation: shimmer + " 3s linear infinite" }}
          />
          
          <Flex direction={{ base: "column", md: "row" }}>
            {/* Left - Avatar */}
            <Box w={{ base: "100%", md: "200px" }} flexShrink="0"
              bg={useColorModeValue("#f8fafc", "#1b2559")}
              borderRight={{ base: "none", md: "1px solid " + cardBorder }}
              borderBottom={{ base: "1px solid " + cardBorder, md: "none" }}
              display="flex" flexDirection={{ base: "row", md: "column" }}
              alignItems="center" justifyContent="center"
              p={{ base: "18px 20px", md: "28px" }}
              gap={{ base: "14px", md: "0" }}
            >
              {photo ? (
                <Box w="80px" h="80px" borderRadius="full" overflow="hidden" 
                  border="3px solid #f97316" boxShadow="0 4px 16px rgba(249,115,22,0.3)"
                  flexShrink="0"
                >
                  <img src={photo} alt={name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
                </Box>
              ) : (
                <Box w="80px" h="80px" borderRadius="full"
                  bg={isActive ? "linear-gradient(135deg, #f97316, #fb923c)" : "#94a3b8"}
                  display="flex" alignItems="center" justifyContent="center"
                  flexShrink="0"
                  boxShadow="0 4px 16px rgba(249,115,22,0.3)"
                >
                  <Icon as={FaUserCircle} boxSize="40px" color="white" />
                </Box>
              )}
              <Box textAlign={{ base: "left", md: "center" }} ml={{ base: "10px", md: "0" }}>
                <Text fontSize={{ base: "16px", md: "18px" }} fontWeight="800" color={textPrimary}>
                  {name}
                </Text>
                <Flex gap="6px" flexWrap="wrap" justify={{ base: "flex-start", md: "center" }} mt="6px">
                  <StatusBadge status={status} />
                </Flex>
              </Box>
            </Box>
  
            {/* Right - Info */}
            <Box p={{ base: "18px", md: "26px" }} flex="1">
              <Flex justify="space-between" align="flex-start" mb="10px" gap="8px">
                <Box flex="1" minW="0">
                  <Text fontSize={{ base: "18px", md: "20px" }} fontWeight="800" color={textPrimary}
                    letterSpacing="-0.3px" mb="8px" lineHeight="1.2"
                  >
                    {name}
                  </Text>
                  <Flex gap="8px" flexWrap="wrap" mb="6px">
                    <RoleBadge role={role} />
                    <StatusBadge status={status} />
                  </Flex>
                </Box>
              </Flex>
  
              <Box h="1px" bg={cardBorder} mb="14px" />
  
              {/* Quick Stats */}
              <SimpleGrid columns={{ base: 2, md: 4 }} spacing="10px" mb="14px">
                {[
                  { icon: MdPerson, label: "Vai trò", val: getRoleLabel(role) },
                  { icon: FaGlobe, label: "Quốc tịch", val: nationality || "—" },
                  { icon: FaFilm, label: "Phim", val: movieTitle },
                  { icon: MdStar, label: "Số phim", val: displayMovieCount + " phim" },
                ].map(function(item) {
                  var Ic = item.icon;
                  var label = item.label;
                  var val = item.val;
                  return (
                    <Box key={label} p="10px 12px" borderRadius="10px"
                      bg={cardBg2} border={"1px solid " + cardBorder}
                    >
                      <Flex align="center" gap="5px" mb="3px">
                        <Icon as={Ic} boxSize="11px" color="#f97316" />
                        <Text fontSize="9px" fontWeight="700" color={textMuted}
                          letterSpacing="0.7px" textTransform="uppercase" noOfLines={1}
                        >
                          {label}
                        </Text>
                      </Flex>
                      <Text fontSize={{ base: "12px", md: "13px" }} fontWeight="700" color={textPrimary} noOfLines={1}>
                        {val}
                      </Text>
                    </Box>
                  );
                })}
              </SimpleGrid>
  
              {/* Bio */}
              {bio && (
                <Box p="12px 14px" borderRadius="12px"
                  bg={descBg} border={"1px solid " + descBorder}
                >
                  <Text fontSize="10px" fontWeight="800" color="#f97316" letterSpacing="1px"
                    textTransform="uppercase" mb="6px">Tiểu sử</Text>
                  <Text fontSize={{ base: "12.5px", md: "13px" }} color={textSecondary} lineHeight="1.75">
                    {bio}
                  </Text>
                </Box>
              )}
            </Box>
          </Flex>
        </Box>
  
        {/* Awards + Movies */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing="16px" mb="16px">
          {/* Awards */}
          <Box bg={cardBg} borderRadius="14px" border={"1px solid " + cardBorder}
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p="18px"
            sx={{ animation: fadeUp + " 0.4s ease both" }}
          >
            <Flex align="center" gap="8px" mb="12px">
              <Box w="30px" h="30px" borderRadius="9px"
                bg={useColorModeValue("#fff7ed", "rgba(249,115,22,0.12)")}
                display="flex" alignItems="center" justifyContent="center"
              >
                <Icon as={MdStar} boxSize="14px" color="#f97316" />
              </Box>
              <Text fontSize="12px" fontWeight="800" color={textPrimary}>Giải thưởng nổi bật</Text>
            </Flex>
            <Box h="1px" bg={cardBorder} mb="12px" />
            {awards ? (
              <Text fontSize="13px" fontWeight="600" color={textPrimary} lineHeight="1.6">{awards}</Text>
            ) : (
              <Text fontSize="12px" color={textMuted}>Chưa có thông tin</Text>
            )}
          </Box>
  
          {/* Movies */}
          <Box bg={cardBg} borderRadius="14px" border={"1px solid " + cardBorder}
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p="18px"
            sx={{ animation: fadeUp + " 0.4s ease 0.06s both" }}
          >
            <Flex align="center" justify="space-between" mb="12px">
              <Flex align="center" gap="8px">
                <Box w="30px" h="30px" borderRadius="9px"
                  bg={useColorModeValue("#fff7ed", "rgba(249,115,22,0.12)")}
                  display="flex" alignItems="center" justifyContent="center"
                >
                  <Icon as={FaFilm} boxSize="13px" color="#f97316" />
                </Box>
                <Text fontSize="12px" fontWeight="800" color={textPrimary}>Phim tham gia</Text>
              </Flex>
              <Box px="8px" py="2px" borderRadius="6px"
                bg={useColorModeValue("#fff7ed", "rgba(249,115,22,0.12)")}
                border={"1px solid " + useColorModeValue("#fed7aa", "rgba(249,115,22,0.3)")}
              >
                <Text fontSize="11px" fontWeight="700" color="#f97316">{displayMovieCount} phim</Text>
              </Box>
            </Flex>
            <Box h="1px" bg={cardBorder} mb="12px" />
            
            {displayMovieCount === 0 ? (
              <Text fontSize="12px" color={textMuted}>Chưa liên kết phim nào</Text>
            ) : (
              <Flex direction="column" gap="7px">
                {displayMovies.map(function(m, i) {
                  return (
                    <Flex key={i} align="center" gap="10px" p="8px 12px"
                      borderRadius="9px" bg={filterBg} border={"1px solid " + cardBorder}
                      sx={{ animation: fadeUp + " 0.3s ease " + (i * 0.05) + "s both" }}
                    >
                      <Box w="6px" h="6px" borderRadius="full" bg="#f97316" flexShrink="0" />
                      <Text fontSize="12.5px" fontWeight="600" color={textPrimary}>{m}</Text>
                    </Flex>
                  );
                })}
              </Flex>
            )}
          </Box>
        </SimpleGrid>
  
        {/* System Info */}
        <Box bg={cardBg} borderRadius="14px" border={"1px solid " + cardBorder}
          boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "14px 16px", md: "16px 20px" }}
          sx={{ animation: fadeUp + " 0.5s ease both" }}
        >
          <Flex align="center" gap="8px" mb="12px">
            <Box w="28px" h="28px" borderRadius="8px" bg={tagBg}
              display="flex" alignItems="center" justifyContent="center"
            >
              <Icon as={MdAccessTime} boxSize="13px" color="#f97316" />
            </Box>
            <Text fontSize="10px" fontWeight="700" color={textMuted} letterSpacing="0.8px" textTransform="uppercase">
              Thông tin hệ thống
            </Text>
          </Flex>
          
          <Flex gap="12px" flexWrap="wrap" direction={{ base: "column", sm: "row" }}>
            <Box flex="1" minW="0">
              <Box p="10px 12px" borderRadius="8px" bg={cardBg2} border={"1px solid " + cardBorder}>
                <Text fontSize="9px" fontWeight="700" color={textMuted} textTransform="uppercase" letterSpacing="0.6px" mb="2px">
                  Người tạo
                </Text>
                <Text fontSize="13px" fontWeight="600" color={textPrimary}>{createdBy}</Text>
              </Box>
            </Box>
            <Box flex="1" minW="0">
              <Box p="10px 12px" borderRadius="8px" bg={cardBg2} border={"1px solid " + cardBorder}>
                <Text fontSize="9px" fontWeight="700" color={textMuted} textTransform="uppercase" letterSpacing="0.6px" mb="2px">
                  Ngày tạo
                </Text>
                <Text fontSize="13px" fontWeight="600" color={textPrimary}>
                  {createdAt ? new Date(createdAt).toLocaleString("vi-VN") : "N/A"}
                </Text>
              </Box>
            </Box>
          </Flex>
          
          <Box h="1px" bg={cardBorder} my="10px" />
          
          <Flex gap="12px" flexWrap="wrap" direction={{ base: "column", sm: "row" }}>
            <Box flex="1" minW="0">
              <Box p="10px 12px" borderRadius="8px" bg={cardBg2} border={"1px solid " + cardBorder}>
                <Text fontSize="9px" fontWeight="700" color={textMuted} textTransform="uppercase" letterSpacing="0.6px" mb="2px">
                  Người cập nhật
                </Text>
                <Text fontSize="13px" fontWeight="600" color={textPrimary}>{updatedBy}</Text>
              </Box>
            </Box>
            <Box flex="1" minW="0">
              <Box p="10px 12px" borderRadius="8px" bg={cardBg2} border={"1px solid " + cardBorder}>
                <Text fontSize="9px" fontWeight="700" color={textMuted} textTransform="uppercase" letterSpacing="0.6px" mb="2px">
                  Cập nhật lần cuối
                </Text>
                <Text fontSize="13px" fontWeight="600" color={textPrimary}>
                  {updatedAt ? new Date(updatedAt).toLocaleString("vi-VN") : "N/A"}
                </Text>
              </Box>
            </Box>
          </Flex>
  
          <Box h="1px" bg={cardBorder} my="10px" />
  
          <Flex align="center" justify="space-between" flexWrap="wrap" gap="10px">
            <Flex align="center" gap="8px">
              <Box w="28px" h="28px" borderRadius="8px" bg={tagBg}
                display="flex" alignItems="center" justifyContent="center"
              >
                <Icon as={FaUserCircle} boxSize="13px" color="#f97316" />
              </Box>
              <Text fontSize="10px" fontWeight="700" color={textMuted} letterSpacing="0.8px" textTransform="uppercase">
                ID Diễn Viên
              </Text>
            </Flex>
            <Text fontSize="13px" fontWeight="700" color={textPrimary} fontFamily="monospace">
              #{id}
            </Text>
          </Flex>
        </Box>
      </Box>
    );
  }