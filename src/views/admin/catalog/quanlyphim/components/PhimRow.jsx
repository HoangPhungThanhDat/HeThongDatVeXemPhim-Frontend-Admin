import {
  Box, Flex, Text, Button, Icon, useColorModeValue,
  Menu, MenuButton, MenuList, MenuItem, Portal, // ✅ Thêm Portal
} from "@chakra-ui/react";
import { 
  MdVisibility, MdEdit, MdDeleteOutline, MdAccessTime, MdCalendarToday, 
  MdStar, MdKeyboardArrowDown, MdPlayCircle, MdTimer, MdDone 
} from "react-icons/md";
import { StatusBadge } from "./shared/StatusBadge";
import { AgeBadge } from "./shared/AgeBadge";
import { fadeUp } from "./shared/animations";

export function PhimRow({ 
  movie, index, onView, onEdit, onUpdateStatus, onDelete 
}) {
  const cardBg = useColorModeValue("white", "#0b1437");
  const cardBorder = useColorModeValue("#f1f5f9", "rgba(255,255,255,0.08)");
  const textPrimary = useColorModeValue("#0f172a", "#ffffff");
  const textSecondary = useColorModeValue("#475569", "#cbd5e1");
  const textMuted = useColorModeValue("#94a3b8", "#8b9bc4");
  const textFaint = useColorModeValue("#cbd5e1", "#3c4b70");
  const rowHoverBg = useColorModeValue("#fffbf7", "rgba(249,115,22,0.07)");
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

  const poster = movie.PosterUrl || movie.posterUrl || movie.poster || "";
  
  let genres = [];
  if (movie.Genres && Array.isArray(movie.Genres)) {
    genres = movie.Genres;
  } else if (movie.genreName) {
    genres = [movie.genreName];
  } else if (movie.GenreName) {
    genres = [movie.GenreName];
  } else if (movie.GenreId) {
    genres = [`Thể loại ${movie.GenreId}`];
  }

  const status = movie.Status || movie.status || "Ended";
  const rated = movie.Rated || movie.rated || "P";
  const duration = movie.Duration || movie.duration || 0;
  const releaseDate = movie.ReleaseDate || movie.releaseDate || "";
  const rating = movie.Rating || movie.rating || 0;
  const reviewCount = movie.ReviewCount || movie.reviewCount || 0;

  return (
    <Box 
      p="14px 18px" 
      borderRadius="12px"
      bg={cardBg}
      border={`1.5px solid ${cardBorder}`}
      transition="all 0.2s"
      _hover={{ 
        border: "1.5px solid #f97316", 
        boxShadow: "0 2px 12px rgba(249,115,22,0.1)", 
        bg: rowHoverBg 
      }}
      sx={{ animation: `${fadeUp} 0.35s ease ${index * 0.05}s both` }}
    >
      <Flex align="center" gap="0">
        <Box w="32px" flexShrink="0">
          <Text fontSize="12px" fontWeight="700" color={textFaint}>
            {String(index + 1).padStart(2, "0")}
          </Text>
        </Box>
        
        <Box w="44px" h="60px" borderRadius="8px" overflow="hidden" flexShrink="0" mr="14px">
          <img 
            src={poster} 
            alt={movie.Title || movie.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => { e.target.style.display = "none"; }}
          />
        </Box>
        
        <Box flex="2.2" minW="0" pr="12px">
          <Text fontSize="13.5px" fontWeight="700" color={textPrimary} noOfLines={1}>
            {movie.Title || movie.title}
          </Text>
          {genres.length > 0 ? (
            <Flex gap="6px" mt="4px" flexWrap="wrap">
              {genres.slice(0, 3).map((g, idx) => (
                <Box key={idx} px="7px" py="2px" borderRadius="5px" bg={chipBg}>
                  <Text fontSize="10px" fontWeight="600" color={chipColor}>{g}</Text>
                </Box>
              ))}
            </Flex>
          ) : (
            <Text fontSize="10px" color={textMuted} mt="4px">Chưa phân loại</Text>
          )}
        </Box>
        
        <Box flex="0.8" minW="0" pr="12px">
          <Flex align="center" gap="5px">
            <Icon as={MdAccessTime} boxSize="11px" color={textMuted} />
            <Text fontSize="12px" fontWeight="600" color={textSecondary}>{duration} phút</Text>
          </Flex>
          <Flex align="center" gap="5px" mt="3px">
            <Icon as={MdCalendarToday} boxSize="11px" color={textMuted} />
            <Text fontSize="11px" color={textMuted}>{releaseDate}</Text>
          </Flex>
        </Box>
        
        <Box flex="0.5" minW="0" pr="12px">
          <AgeBadge age={rated} />
        </Box>
        
        <Box flex="1" minW="0" pr="12px">
          <StatusBadge status={status} />
        </Box>
        
        <Box flex="0.7" minW="0" pr="12px">
          <Flex align="center" gap="4px">
            <Icon as={MdStar} boxSize="13px" color="#f59e0b" />
            <Text fontSize="12.5px" fontWeight="700" color={textPrimary}>{rating}</Text>
          </Flex>
          <Text fontSize="10px" color={textMuted}>{reviewCount} đánh giá</Text>
        </Box>
        
        <Flex gap="6px" flexShrink="0">
          <Button size="xs" h="30px" px="10px" borderRadius="8px"
            bg={secondaryBtnBg} color={secondaryBtnColor} border={`1px solid ${secondaryBtnBorder}`}
            fontSize="11.5px" fontWeight="600"
            leftIcon={<Icon as={MdVisibility} boxSize="12px" />}
            _hover={{ bg: secondaryBtnHoverBg, color: textPrimary }} transition="all 0.15s"
            onClick={() => onView(movie)}
          >
            Xem
          </Button>
          
          <Button size="xs" h="30px" px="10px" borderRadius="8px"
            bg="linear-gradient(135deg, #f97316, #fb923c)"
            color="white" fontSize="11.5px" fontWeight="600"
            leftIcon={<Icon as={MdEdit} boxSize="12px" />}
            _hover={{ opacity: 0.88, transform: "translateY(-1px)" }}
            boxShadow="0 2px 8px rgba(249,115,22,0.3)" transition="all 0.15s"
            onClick={() => onEdit(movie)}
          >
            Sửa
          </Button>
          
          {/* ✅ Menu Cập nhật trạng thái sử dụng Portal */}
          <Menu placement="bottom-end" isLazy>
            <MenuButton
              as={Button}
              size="xs" h="30px" px="10px" borderRadius="8px"
              bg={secondaryBtnBg} color={secondaryBtnColor} border={`1px solid ${secondaryBtnBorder}`}
              fontSize="11.5px" fontWeight="600"
              rightIcon={<Icon as={MdKeyboardArrowDown} boxSize="14px" />}
              _hover={{ bg: secondaryBtnHoverBg }} transition="all 0.15s"
            >
              Trạng thái
            </MenuButton>
            {/* ✅ Bọc MenuList trong Portal để thoát khỏi mọi khung giới hạn */}
            <Portal>
              <MenuList 
                minW="160px" 
                fontSize="13px" 
                borderRadius="10px" 
                p="2"
                zIndex={9999}
                boxShadow="0 10px 24px rgba(0,0,0,0.15)"
              >
                <MenuItem 
                  onClick={() => onUpdateStatus(movie, 'NowShowing')}
                  isDisabled={status === 'NowShowing'}
                  fontSize="13px" fontWeight="500"
                  icon={<Icon as={MdPlayCircle} boxSize="14px" color="#10b981" />}
                >
                  Đang chiếu
                </MenuItem>
                <MenuItem 
                  onClick={() => onUpdateStatus(movie, 'ComingSoon')}
                  isDisabled={status === 'ComingSoon'}
                  fontSize="13px" fontWeight="500"
                  icon={<Icon as={MdTimer} boxSize="14px" color="#f59e0b" />}
                >
                  Sắp chiếu
                </MenuItem>
                <MenuItem 
                  onClick={() => onUpdateStatus(movie, 'Ended')}
                  isDisabled={status === 'Ended'}
                  fontSize="13px" fontWeight="500"
                  icon={<Icon as={MdDone} boxSize="14px" color="#94a3b8" />}
                >
                  Ngừng chiếu
                </MenuItem>
              </MenuList>
            </Portal>
          </Menu>
          
          <Button size="xs" h="30px" px="10px" borderRadius="8px"
            bg={dangerBg} color={dangerColor} border={`1px solid ${dangerBorder}`}
            fontSize="11.5px" fontWeight="600"
            leftIcon={<Icon as={MdDeleteOutline} boxSize="12px" />}
            _hover={{ bg: dangerHoverBg }} transition="all 0.15s"
            onClick={() => onDelete(movie)}
          >
            Xóa
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}