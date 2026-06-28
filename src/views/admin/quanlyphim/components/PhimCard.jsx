

import {
    Box, Flex, Text, Button, Icon, useColorModeValue
  } from "@chakra-ui/react";
  import { MdVisibility, MdEdit, MdDeleteOutline, MdVisibilityOff, MdAccessTime, MdStar } from "react-icons/md";
  import { StatusBadge } from "./shared/StatusBadge";
  import { AgeBadge } from "./shared/AgeBadge";
  import { fadeUp } from "./shared/animations";
  
  export function PhimCard({ 
    movie, index, onView, onEdit, onHide, onDelete 
  }) {
    const cardBg = useColorModeValue("white", "#0b1437");
    const cardBorder = useColorModeValue("#f1f5f9", "rgba(255,255,255,0.08)");
    const textPrimary = useColorModeValue("#0f172a", "#ffffff");
    const textSecondary = useColorModeValue("#475569", "#cbd5e1");
    const textMuted = useColorModeValue("#94a3b8", "#8b9bc4");
    const chipBg = useColorModeValue("#f1f5f9", "rgba(255,255,255,0.07)");
    const chipColor = useColorModeValue("#64748b", "#b6c2e2");
    const dangerBg = useColorModeValue("#fef2f2", "rgba(239,68,68,0.13)");
    const dangerColor = useColorModeValue("#dc2626", "#f87171");
    const dangerBorder = useColorModeValue("#fca5a5", "rgba(248,113,113,0.35)");
    const dangerHoverBg = useColorModeValue("#fee2e2", "rgba(239,68,68,0.2)");
    const secondaryBtnBg = useColorModeValue("#f8fafc", "rgba(255,255,255,0.05)");
    const secondaryBtnBorder = useColorModeValue("#e2e8f0", "rgba(255,255,255,0.14)");
    const secondaryBtnColor = useColorModeValue("#475569", "#cbd5e1");
    const secondaryBtnHoverBg = useColorModeValue("#f1f5f9", "rgba(255,255,255,0.1)");
  
    const genres = movie.Genres || movie.genres || [];
    const poster = movie.PosterUrl || movie.posterUrl || movie.poster || "";
  
    return (
      <Box 
        p="14px" 
        borderRadius="14px"
        bg={cardBg}
        border={`1.5px solid ${cardBorder}`}
        transition="all 0.2s"
        _hover={{ 
          border: "1.5px solid #f97316", 
          boxShadow: "0 2px 12px rgba(249,115,22,0.1)" 
        }}
        sx={{ animation: `${fadeUp} 0.35s ease ${index * 0.05}s both` }}
      >
        <Flex gap="12px" mb="12px">
          <Box w="64px" h="88px" borderRadius="10px" overflow="hidden" flexShrink="0">
            <img 
              src={poster} 
              alt={movie.Title || movie.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => { e.target.style.display = "none"; }}
            />
          </Box>
          <Box flex="1" minW="0">
            <Text fontSize="14px" fontWeight="700" color={textPrimary} noOfLines={2} mb="6px" lineHeight="1.35">
              {movie.Title || movie.title}
            </Text>
            <Flex gap="6px" flexWrap="wrap" mb="6px">
              <StatusBadge status={movie.Status || movie.status || "Ended"} />
              <AgeBadge age={movie.Rated || movie.rated || "P"} />
            </Flex>
            <Flex gap="10px" flexWrap="wrap">
              <Flex align="center" gap="4px">
                <Icon as={MdAccessTime} boxSize="11px" color={textMuted} />
                <Text fontSize="11.5px" fontWeight="600" color={textSecondary}>
                  {movie.Duration || movie.duration || 0} phút
                </Text>
              </Flex>
              <Flex align="center" gap="4px">
                <Icon as={MdStar} boxSize="12px" color="#f59e0b" />
                <Text fontSize="11.5px" fontWeight="700" color={textPrimary}>
                  {movie.Rating || movie.rating || 0}
                </Text>
                <Text fontSize="10px" color={textMuted}>({movie.ReviewCount || movie.reviewCount || 0})</Text>
              </Flex>
            </Flex>
            {genres.length > 0 && (
              <Flex gap="5px" mt="5px" flexWrap="wrap">
                {genres.slice(0, 3).map((g) => (
                  <Box key={g} px="6px" py="2px" borderRadius="5px" bg={chipBg}>
                    <Text fontSize="10px" fontWeight="600" color={chipColor}>{g}</Text>
                  </Box>
                ))}
              </Flex>
            )}
          </Box>
        </Flex>
  
        <Flex gap="8px" mb="8px">
          <Button flex="1" size="sm" h="36px" borderRadius="9px"
            bg={secondaryBtnBg} color={secondaryBtnColor} border={`1px solid ${secondaryBtnBorder}`}
            fontSize="12px" fontWeight="600"
            leftIcon={<Icon as={MdVisibility} boxSize="13px" />}
            _hover={{ bg: secondaryBtnHoverBg }} transition="all 0.15s"
            onClick={() => onView(movie)}
          >
            Xem
          </Button>
          <Button flex="1" size="sm" h="36px" borderRadius="9px"
            bg="linear-gradient(135deg, #f97316, #fb923c)"
            color="white" fontSize="12px" fontWeight="600"
            leftIcon={<Icon as={MdEdit} boxSize="13px" />}
            _hover={{ opacity: 0.88 }} boxShadow="0 2px 8px rgba(249,115,22,0.3)"
            transition="all 0.15s"
            onClick={() => onEdit(movie)}
          >
            Sửa
          </Button>
          <Button flex="1" size="sm" h="36px" borderRadius="9px"
            bg={secondaryBtnBg} color={secondaryBtnColor} border={`1px solid ${secondaryBtnBorder}`}
            fontSize="12px" fontWeight="600"
            leftIcon={<Icon as={MdVisibilityOff} boxSize="13px" />}
            _hover={{ bg: dangerBg, color: dangerColor, border: `1px solid ${dangerBorder}` }}
            transition="all 0.15s"
            onClick={() => onHide(movie)}
          >
            Ẩn
          </Button>
        </Flex>
        <Button w="100%" size="sm" h="36px" borderRadius="9px" bg={dangerBg}
          color={dangerColor} border={`1px solid ${dangerBorder}`} fontSize="12px" fontWeight="600"
          leftIcon={<Icon as={MdDeleteOutline} boxSize="14px" />}
          _hover={{ bg: dangerHoverBg }} transition="all 0.15s"
          onClick={() => onDelete(movie)}
        >
          Xóa phim
        </Button>
      </Box>
    );
  }