

import {
    Box, Text, Button, Flex, SimpleGrid, Icon, useColorModeValue
  } from "@chakra-ui/react";
  import { 
    MdArrowBack, MdEdit, MdDelete, MdCalendarToday, 
    MdPerson, MdCategory, MdStar, MdDescription
  } from "react-icons/md";
  import { FaLayerGroup, FaFilm } from "react-icons/fa";
  import { StatusBadge } from "./shared/StatusBadge";
  import { fadeIn, shimmer, fadeUp } from "./shared/animations";
  import { ICON_OPTIONS } from "../constants";
  
  function getIconComponent(key) {
    const icons = {
      FaFire: require("react-icons/fa").FaFire,
      FaBolt: require("react-icons/fa").FaBolt,
      FaHeart: require("react-icons/fa").FaHeart,
      FaGhost: require("react-icons/fa").FaGhost,
      FaSkull: require("react-icons/fa").FaSkull,
      FaChild: require("react-icons/fa").FaChild,
      FaRocket: require("react-icons/fa").FaRocket,
      FaCompass: require("react-icons/fa").FaCompass,
      FaLaugh: require("react-icons/fa").FaLaugh,
      FaBrain: require("react-icons/fa").FaBrain,
      FaDragon: require("react-icons/fa").FaDragon,
      FaTheaterMasks: require("react-icons/fa").FaTheaterMasks,
      FaClock: require("react-icons/fa").FaClock,
      FaMusic: require("react-icons/fa").FaMusic,
      FaFootballBall: require("react-icons/fa").FaFootballBall,
      FaLeaf: require("react-icons/fa").FaLeaf,
      FaSnowflake: require("react-icons/fa").FaSnowflake,
      FaCrown: require("react-icons/fa").FaCrown,
      FaStar: require("react-icons/fa").FaStar,
      FaGem: require("react-icons/fa").FaGem,
      FaMagic: require("react-icons/fa").FaMagic,
      FaEye: require("react-icons/fa").FaEye,
      FaGlobe: require("react-icons/fa").FaGlobe,
      FaTree: require("react-icons/fa").FaTree,
      FaPaw: require("react-icons/fa").FaPaw,
      FaFilm: require("react-icons/fa").FaFilm,
      FaTag: require("react-icons/fa").FaTag,
      FaLayerGroup: require("react-icons/fa").FaLayerGroup,
    };
    return icons[key] || FaTag;
  }
  
  export function TheLoaiDetail({ genre, onBack, onEdit, onDelete }) {
    const cardBg = useColorModeValue("white", "#0b1437");
    const cardBorder = useColorModeValue("#f1f5f9", "rgba(255,255,255,0.08)");
    const cardBg2 = useColorModeValue("#f8fafc", "#0B1437");
    const textPrimary = useColorModeValue("#0f172a", "#ffffff");
    const textSecondary = useColorModeValue("#475569", "#cbd5e1");
    const textMuted = useColorModeValue("#94a3b8", "#8b9bc4");
    const tagBg = useColorModeValue("#fff7ed", "rgba(194,65,12,0.16)");
    const tagBorder = useColorModeValue("#fed7aa", "rgba(253,186,116,0.35)");
    const tagText = useColorModeValue("#c2410c", "#fdba74");
    const secondaryBtnBg = useColorModeValue("#f8fafc", "rgba(255,255,255,0.05)");
    const secondaryBtnBorder = useColorModeValue("#e2e8f0", "rgba(255,255,255,0.14)");
    const secondaryBtnColor = useColorModeValue("#475569", "#cbd5e1");
    const secondaryBtnHoverBg = useColorModeValue("#f1f5f9", "rgba(255,255,255,0.1)");
  
    // Lấy dữ liệu từ genre
    const id = genre.GenreId || genre.id;
    const name = genre.Name || genre.name || "";
    const slug = genre.Slug || genre.slug || "";
    const color = genre.Color || genre.color || "#f97316";
    const iconKey = genre.Icon || genre.icon || "FaTag";
    const description = genre.Description || genre.description || "";
    const status = genre.Status || genre.status || "Active";
    const featured = genre.featured || false;
    const movieCount = genre.movieCount || 0;
    const createdAt = genre.CreatedAt || genre.createdAt || "";
    const updatedAt = genre.UpdatedAt || genre.updatedAt || "";
    const createdBy = genre.CreatedBy || genre.createdBy || "";
    const updatedBy = genre.UpdatedBy || genre.updatedBy || "";
  
    const IconComponent = getIconComponent(iconKey);
    const isActive = status === "Active";
  
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
            Quay lại danh sách
          </Button>
          <Flex gap="8px" w={{ base: "100%", sm: "auto" }}>
            <Button flex="1" h="38px" px={{ base: "12px", md: "16px" }} borderRadius="10px"
              fontWeight="700" fontSize="13px"
              bg={useColorModeValue("#fff5f5", "#2d0a0a")}
              color="#ef4444"
              border="1px solid #fca5a5"
              _hover={{ bg: "#fef2f2", border: "1px solid #ef4444", boxShadow: "0 4px 14px rgba(239,68,68,0.3)" }}
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
  
        {/* Hero Card - Icon + Info */}
        <Box bg={cardBg} borderRadius="18px" border={`1px solid ${cardBorder}`}
          boxShadow="0 2px 12px rgba(0,0,0,0.06)" overflow="hidden" mb="18px"
        >
          <Box h="4px" bg={`linear-gradient(90deg, ${color}, ${color}88, ${color})`}
            bgSize="200% 100%" sx={{ animation: `${shimmer} 3s linear infinite` }}
          />
          <Box p={{ base: "24px", md: "32px" }}>
            <Flex direction={{ base: "column", md: "row" }} gap="24px" align="flex-start">
              {/* Icon */}
              <Box w="80px" h="80px" borderRadius="20px"
                bg={`${color}18`}
                border={`2px solid ${color}44`}
                display="flex" alignItems="center" justifyContent="center"
                boxShadow={`0 4px 20px ${color}30`}
                flexShrink="0"
              >
                <Icon as={IconComponent} boxSize="32px" color={color} />
              </Box>
  
              {/* Info */}
              <Box flex="1">
                <Flex align="center" gap="12px" mb="8px" flexWrap="wrap">
                  <Text fontSize={{ base: "24px", md: "30px" }} fontWeight="900" color={textPrimary}>
                    {name}
                  </Text>
                  {featured && (
                    <Box px="10px" py="4px" borderRadius="6px"
                      bg="linear-gradient(135deg, #f97316, #fbbf24)"
                      boxShadow="0 2px 8px rgba(249,115,22,0.4)"
                    >
                      <Text fontSize="10px" fontWeight="800" color="white" letterSpacing="0.8px">✦ NỔI BẬT</Text>
                    </Box>
                  )}
                </Flex>
  
                {/* Slug */}
                <Text fontSize="14px" color={textMuted} fontWeight="500" mb="12px">
                  /{slug}
                </Text>
  
                {/* Status Badge */}
                <Flex gap="10px" flexWrap="wrap" mb="12px">
                  <StatusBadge status={status} />
                  <Box px="10px" py="5px" borderRadius="8px"
                    bg={tagBg} border={`1px solid ${tagBorder}`}
                  >
                    <Flex align="center" gap="6px">
                      <Icon as={FaFilm} boxSize="12px" color={tagText} />
                      <Text fontSize="12px" fontWeight="700" color={tagText}>
                        {movieCount} phim
                      </Text>
                    </Flex>
                  </Box>
                  <Box px="10px" py="5px" borderRadius="8px"
                    bg={tagBg} border={`1px solid ${tagBorder}`}
                  >
                    <Flex align="center" gap="6px">
                      <Box w="16px" h="16px" borderRadius="4px" bg={color} />
                      <Text fontSize="12px" fontWeight="700" color={tagText}>{color}</Text>
                    </Flex>
                  </Box>
                </Flex>
  
                <Box h="1px" bg={cardBorder} mb="16px" />
  
                {/* Description */}
                {description && (
                  <Box p="14px 16px" borderRadius="12px" bg={cardBg2} border={`1px solid ${cardBorder}`}>
                    <Flex align="center" gap="6px" mb="6px">
                      <Icon as={MdDescription} boxSize="14px" color="#f97316" />
                      <Text fontSize="10px" fontWeight="800" color={textMuted} letterSpacing="1px" textTransform="uppercase">
                        Mô tả thể loại
                      </Text>
                    </Flex>
                    <Text fontSize="14px" color={textSecondary} lineHeight="1.8">
                      {description}
                    </Text>
                  </Box>
                )}
              </Box>
            </Flex>
          </Box>
        </Box>
  
        {/* Additional Info - 3 columns */}
        <SimpleGrid columns={{ base: 1, sm: 3 }} spacing="12px" mb="16px">
          {[
            { icon: MdPerson, label: "Người tạo", val: createdBy || "N/A" },
            { icon: MdCalendarToday, label: "Ngày tạo", val: createdAt || "N/A" },
            { icon: MdCategory, label: "ID Thể loại", val: `#${id}` },
          ].map(({ icon: Ic, label, val }) => (
            <Box key={label} bg={cardBg} borderRadius="14px" border={`1px solid ${cardBorder}`}
              boxShadow="0 1px 4px rgba(0,0,0,0.04)" p="16px"
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
              <Text fontSize="13px" fontWeight="600" color={textPrimary}>{val}</Text>
            </Box>
          ))}
        </SimpleGrid>
  
        {/* Additional Info - 2 columns */}
        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing="12px" mb="16px">
          {[
            { icon: MdPerson, label: "Người cập nhật", val: updatedBy || "N/A" },
            { icon: MdCalendarToday, label: "Ngày cập nhật", val: updatedAt || "N/A" },
          ].map(({ icon: Ic, label, val }) => (
            <Box key={label} bg={cardBg} borderRadius="14px" border={`1px solid ${cardBorder}`}
              boxShadow="0 1px 4px rgba(0,0,0,0.04)" p="16px"
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
              <Text fontSize="13px" fontWeight="600" color={textPrimary}>{val}</Text>
            </Box>
          ))}
        </SimpleGrid>
  
        {/* Trạng thái chi tiết */}
        <Box bg={cardBg} borderRadius="14px" border={`1px solid ${cardBorder}`}
          boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "14px 16px", md: "16px 20px" }}
          sx={{ animation: `${fadeUp} 0.5s ease both` }}
        >
          <Flex align="center" gap="8px" mb="8px">
            <Box w="28px" h="28px" borderRadius="8px" bg={tagBg}
              display="flex" alignItems="center" justifyContent="center"
            >
              <Icon as={MdStar} boxSize="13px" color="#f97316" />
            </Box>
            <Text fontSize="10px" fontWeight="700" color={textMuted} letterSpacing="0.8px" textTransform="uppercase">
              Trạng thái & Cài đặt
            </Text>
          </Flex>
          <Flex gap="16px" flexWrap="wrap">
            <Box px="12px" py="8px" borderRadius="8px" bg={cardBg2} border={`1px solid ${cardBorder}`}>
              <Text fontSize="10px" color={textMuted}>Trạng thái</Text>
              <Text fontSize="13px" fontWeight="600" color={isActive ? "#10b981" : textMuted}>
                {isActive ? "🟢 Đang hoạt động" : "🔴 Không hoạt động"}
              </Text>
            </Box>
            <Box px="12px" py="8px" borderRadius="8px" bg={cardBg2} border={`1px solid ${cardBorder}`}>
              <Text fontSize="10px" color={textMuted}>Thể loại nổi bật</Text>
              <Text fontSize="13px" fontWeight="600" color={featured ? "#f59e0b" : textMuted}>
                {featured ? "⭐ Có" : "Không"}
              </Text>
            </Box>
            <Box px="12px" py="8px" borderRadius="8px" bg={cardBg2} border={`1px solid ${cardBorder}`}>
              <Text fontSize="10px" color={textMuted}>Số phim</Text>
              <Text fontSize="13px" fontWeight="600" color={textPrimary}>
                {movieCount} phim
              </Text>
            </Box>
          </Flex>
        </Box>
      </Box>
    );
  }