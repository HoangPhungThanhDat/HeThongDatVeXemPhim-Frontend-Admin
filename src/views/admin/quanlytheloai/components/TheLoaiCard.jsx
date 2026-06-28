

import {
    Box, Flex, Text, Button, Icon, useColorModeValue
  } from "@chakra-ui/react";
  import { MdEdit, MdDelete, MdStar, MdLocalMovies, MdVisibility } from "react-icons/md";
  import { FaTag } from "react-icons/fa";
  import { StatusBadge } from "./shared/StatusBadge";
  import { fadeUp, pulse } from "./shared/animations";
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
  
  export function TheLoaiCard({ 
    genre, index, onView, onEdit, onDelete, onToggle 
  }) {
    const isDark = useColorModeValue(false, true);
    const cardBg = useColorModeValue("white", "#0b1437");
    const cardBorder = useColorModeValue("#f1f5f9", "rgba(255,255,255,0.08)");
    const textPrimary = useColorModeValue("#0f172a", "#e2e8f0");
    const textSub = useColorModeValue("#94a3b8", "#8f9bb3");
    const textMuted = useColorModeValue("#c0c8d4", "#4a5568");
  
    const color = genre.Color || genre.color || "#f97316";
    const status = genre.Status || genre.status || "Active";
    const isActive = status === "Active";
    const iconKey = genre.Icon || genre.icon || "FaTag";
    const IconComponent = getIconComponent(iconKey);
    const movieCount = genre.movieCount || 0;
    const featured = genre.featured || false;
  
    return (
      <Box
        borderRadius="18px" bg={cardBg}
        border={`1.5px solid ${isActive ? `${color}44` : cardBorder}`}
        boxShadow={isActive
          ? (isDark ? `0 2px 12px ${color}22` : `0 2px 12px ${color}18`)
          : "0 2px 10px rgba(0,0,0,0.04)"}
        overflow="hidden"
        sx={{ animation: `${fadeUp} 0.4s ease ${index * 0.06}s both` }}
        transition="all 0.25s"
        _hover={isActive
          ? { boxShadow: `0 8px 28px ${color}35`, transform: "translateY(-4px)", border: `1.5px solid ${color}` }
          : { transform: "translateY(-2px)" }
        }
        opacity={isActive ? 1 : (isDark ? 0.55 : 0.7)}
      >
        {/* Color accent bar */}
        <Box h="4px" bg={isActive
          ? `linear-gradient(90deg, ${color}, ${color}88)`
          : (isDark ? "#1b2559" : "#e5e7eb")}
        />
  
        <Box p={{ base: "16px", md: "18px" }}>
          {/* Header */}
          <Flex justify="space-between" align="flex-start" mb="12px">
            <Flex align="center" gap="10px">
              <Box w="40px" h="40px" borderRadius="12px"
                bg={isActive ? `${color}18` : (isDark ? "#1b2559" : "#f9fafb")}
                border={`1.5px solid ${isActive ? `${color}44` : cardBorder}`}
                display="flex" alignItems="center" justifyContent="center"
                boxShadow={isActive ? `0 2px 8px ${color}22` : "none"}
              >
                <Icon as={IconComponent} boxSize="14px" color={isActive ? color : textSub} />
              </Box>
              <Box>
                <Flex align="center" gap="6px">
                  <Text fontSize="15px" fontWeight="800" color={isActive ? textPrimary : textSub}>
                    {genre.Name || genre.name}
                  </Text>
                  {featured && isActive && (
                    <Box px="5px" py="1px" borderRadius="4px"
                      bg="linear-gradient(135deg, #f97316, #fbbf24)"
                      sx={{ animation: `${pulse} 2.5s ease infinite` }}
                    >
                      <Text fontSize="8px" fontWeight="800" color="white" letterSpacing="0.5px">HOT</Text>
                    </Box>
                  )}
                </Flex>
                <Text fontSize="10px" color={textSub} fontWeight="500">
                  /{genre.Slug || genre.slug || ""}
                </Text>
              </Box>
            </Flex>
  
            {/* Status toggle pill */}
            <Box
              px="9px" py="4px" borderRadius="8px" cursor="pointer"
              bg={isActive
                ? (isDark ? "rgba(16,185,129,0.15)" : "#ecfdf5")
                : (isDark ? "#1b2559" : "#f9fafb")}
              border={`1px solid ${isActive ? "#6ee7b7" : cardBorder}`}
              onClick={() => onToggle(genre.GenreId || genre.id)}
              transition="all 0.2s"
              _hover={{ opacity: 0.8 }}
            >
              <Flex align="center" gap="4px">
                <Box w="5px" h="5px" borderRadius="full"
                  bg={isActive ? "#10b981" : "#9ca3af"}
                  sx={isActive ? { animation: `${pulse} 1.8s ease infinite` } : {}}
                />
                <Text fontSize="10px" fontWeight="700"
                  color={isActive ? "#059669" : textSub}>
                  {isActive ? "Hiện" : "Ẩn"}
                </Text>
              </Flex>
            </Box>
          </Flex>
  
          {/* Description */}
          <Text fontSize="12.5px" color={textSub} lineHeight="1.65" mb="14px" noOfLines={2}>
            {genre.Description || genre.description || "Không có mô tả"}
          </Text>
  
          {/* Stats row */}
          <Flex gap="8px" mb="14px">
            <Box flex="1" p="8px 10px" borderRadius="9px"
              bg={isActive ? `${color}12` : (isDark ? "#1b2559" : "#f9fafb")}
              border={`1px solid ${isActive ? `${color}30` : cardBorder}`}
            >
              <Flex align="center" gap="5px" mb="2px">
                <Icon as={MdLocalMovies} boxSize="10px" color={isActive ? color : textSub} />
                <Text fontSize="9px" fontWeight="700" color={isActive ? color : textSub}
                  textTransform="uppercase" letterSpacing="0.5px">
                  Phim
                </Text>
              </Flex>
              <Text fontSize="16px" fontWeight="800" color={isActive ? textPrimary : textSub}>
                {movieCount}
              </Text>
            </Box>
            <Box flex="1" p="8px 10px" borderRadius="9px" 
              bg={isDark ? "#1b2559" : "#f8fafc"} 
              border={`1px solid ${cardBorder}`}
            >
              <Flex align="center" gap="5px" mb="2px">
                <Box w="10px" h="10px" borderRadius="4px" bg={color} />
                <Text fontSize="9px" fontWeight="700" color={textSub}
                  textTransform="uppercase" letterSpacing="0.5px">
                  Màu sắc
                </Text>
              </Flex>
              <Text fontSize="11px" fontWeight="700" color={isDark ? "#8f9bb3" : "#475569"}>
                {color}
              </Text>
            </Box>
          </Flex>
  
          {/* Created date */}
          <Text fontSize="10px" color={textMuted} mb="12px">
            Tạo: {genre.CreatedAt || genre.createdAt || "N/A"}
          </Text>
  
          {/* ✅ Action buttons - Thêm nút Xem chi tiết */}
          <Flex gap="7px">
            {/* ✅ Nút Xem chi tiết */}
            <Button flex="1" h="34px" borderRadius="9px"
              bg={isDark ? "#1b2559" : "#f8fafc"}
              color={textSub}
              border={`1px solid ${cardBorder}`}
              fontSize="11.5px" fontWeight="600"
              leftIcon={<Icon as={MdVisibility} boxSize="12px" />}
              _hover={{ bg: isDark ? "#243170" : "#f1f5f9", color: textPrimary }}
              transition="all 0.15s"
              onClick={() => onView(genre)}
            >
              Xem
            </Button>
            <Button flex="1" h="34px" borderRadius="9px"
              bg={isActive ? `${color}12` : (isDark ? "#1b2559" : "#f9fafb")}
              color={isActive ? color : textSub}
              border={`1px solid ${isActive ? `${color}40` : cardBorder}`}
              fontSize="11.5px" fontWeight="700"
              leftIcon={<Icon as={MdEdit} boxSize="12px" />}
              _hover={{ opacity: 0.8, transform: "translateY(-1px)" }}
              transition="all 0.15s"
              onClick={() => onEdit(genre)}
            >
              Sửa
            </Button>
            <Button h="34px" px="12px" borderRadius="9px"
              bg={isDark ? "rgba(239,68,68,0.12)" : "#fef2f2"}
              color="#dc2626"
              border={`1px solid ${isDark ? "rgba(239,68,68,0.3)" : "#fca5a5"}`}
              fontSize="11.5px" fontWeight="700"
              leftIcon={<Icon as={MdDelete} boxSize="12px" />}
              _hover={{ bg: isDark ? "rgba(239,68,68,0.2)" : "#fee2e2", transform: "translateY(-1px)" }}
              transition="all 0.15s"
              onClick={() => onDelete(genre.GenreId || genre.id)}
            >
              Xóa
            </Button>
          </Flex>
        </Box>
      </Box>
    );
  }