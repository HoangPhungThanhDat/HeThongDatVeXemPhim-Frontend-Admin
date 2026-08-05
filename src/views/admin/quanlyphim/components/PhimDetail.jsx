// views/admin/quanlyphim/components/PhimDetail.jsx

import {
  Box, Text, Button, Flex, SimpleGrid, Grid, Icon, useColorModeValue,
  Avatar, HStack, VStack, Badge, useDisclosure
} from "@chakra-ui/react";
import { 
  MdArrowBack, MdEdit, MdDeleteOutline, MdAccessTime, 
  MdCalendarToday, MdPerson, MdPublic, MdStar,
  MdLanguage, MdMovie, MdCategory, MdDescription,
  MdPersonAdd, MdPersonOutline, MdLink, MdPlayArrow
} from "react-icons/md";
import { FaVideo, FaTicketAlt, FaUsers, FaClock } from "react-icons/fa";
import { StatusBadge } from "./shared/StatusBadge";
import { AgeBadge } from "./shared/AgeBadge";
import { fadeIn, shimmer, fadeUp } from "./shared/animations";
import { TrailerModal } from "./TrailerModal"; // ✅ Import modal

export function PhimDetail({ movie, onBack, onEdit, onDelete }) {
  // ✅ Hook để mở/đóng modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  
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

  // Lấy tất cả các trường từ bảng Movies
  const movieId = movie.MovieId || movie.id || "N/A";
  const title = movie.Title || movie.title || "Không có tiêu đề";
  const slug = movie.Slug || movie.slug || "";
  const description = movie.Description || movie.description || "";
  const duration = movie.Duration || movie.duration || 0;
  const releaseDate = movie.ReleaseDate || movie.releaseDate || "";
  const poster = movie.PosterUrl || movie.posterUrl || movie.poster || "";
  const trailer = movie.TrailerUrl || movie.trailerUrl || movie.trailer || "";
  const language = movie.Language || movie.language || "";
  const rated = movie.Rated || movie.rated || "P";
  const status = movie.Status || movie.status || "Ended";
  const createdAt = movie.CreatedAt || movie.createdAt || "";
  const updatedAt = movie.UpdatedAt || movie.updatedAt || "";
  const createdBy = movie.CreatedBy || movie.createdBy || "N/A";
  const updatedBy = movie.UpdatedBy || movie.updatedBy || "N/A";
  
  // Lấy thêm thông tin người tạo và cập nhật (nếu API có)
  const creator = movie.Creator || movie.creator || null;
  const updater = movie.Updater || movie.updater || null;

  // Lấy thể loại - từ API trả về object genre
  const genre = movie.genre || null;
  const genreName = genre?.Name || movie.GenreName || movie.genreName || "";
  const genreId = genre?.GenreId || null;
  const genreDescription = genre?.Description || "";
  
  // Các trường mở rộng (nếu có)
  const directors = movie.directors || [];
  const actors = movie.actors || [];
  const format = movie.Format || movie.format || "2D";
  const country = movie.Country || movie.country || "";
  const distributor = movie.Distributor || movie.distributor || "";
  const ticketsSold = movie.TicketsSold || movie.ticketsSold || 0;
  const rating = movie.Rating || movie.rating || 0;
  const reviewCount = movie.ReviewCount || movie.reviewCount || 0;

  // Lấy danh sách đạo diễn
  const directorNames = directors.map(d => d.Name || d.name).join(', ');
  // Lấy danh sách diễn viên
  const actorNames = actors.map(a => a.Name || a.name).join(', ');

  // Component hiển thị thông tin người dùng
  const UserInfoCard = ({ label, icon, user, userId, date, dateLabel }) => {
      const getDisplayName = () => {
          if (!user) return userId || 'N/A';
          if (typeof user === 'object') {
              return user.fullname || user.FullName || user.name || userId || 'N/A';
          }
          if (typeof user === 'string') return user;
          return userId || 'N/A';
      };
      
      const displayName = getDisplayName();
      const displayId = (typeof user === 'object' && (user?.id || user?.UserId)) || userId || 'N/A';
      const displayEmail = (typeof user === 'object' && (user?.email || user?.Email)) || '';
      const avatarColor = useColorModeValue('#f97316', '#fb923c');
      
      return (
          <Box bg={cardBg} borderRadius="14px" border={`1px solid ${cardBorder}`}
              p="16px" sx={{ animation: `${fadeUp} 0.4s ease both` }}
          >
              <Flex align="center" gap="8px" mb="10px">
                  <Box w="28px" h="28px" borderRadius="8px"
                      bg={useColorModeValue("#fff7ed", "#0f172a")}
                      display="flex" alignItems="center" justifyContent="center"
                  >
                      <Icon as={icon} boxSize="13px" color="#f97316" />
                  </Box>
                  <Text fontSize="10px" fontWeight="700" color={textMuted} 
                      letterSpacing="0.8px" textTransform="uppercase"
                  >
                      {label}
                  </Text>
              </Flex>
              
              <HStack spacing="10px">
                  <Avatar 
                      size="sm" 
                      name={String(displayName)}
                      bg={avatarColor} 
                      color="white"
                      fontSize="12px"
                      fontWeight="700"
                  />
                  <VStack align="start" spacing="0" flex="1">
                      <Text fontSize="14px" fontWeight="700" color={textPrimary}>
                          {String(displayName)}
                      </Text>
                      <Text fontSize="11px" color={textMuted} fontFamily="monospace">
                          ID: #{String(displayId)}
                      </Text>
                      {displayEmail && (
                          <Text fontSize="11px" color={textMuted}>
                              {String(displayEmail)}
                          </Text>
                      )}
                  </VStack>
              </HStack>
              
              <Box mt="8px" p="8px 12px" borderRadius="8px"
                  bg={useColorModeValue("#f8fafc", "#0f172a")}
                  border={useColorModeValue("1px solid #f1f5f9", "1px solid #2d3a6b")}
              >
                  <Text fontSize="9px" fontWeight="700" color={textMuted} 
                      textTransform="uppercase" letterSpacing="0.6px"
                  >
                      {dateLabel}
                  </Text>
                  <Text fontSize="13px" fontWeight="600" color={textPrimary}>
                      {formatDate(date)}
                  </Text>
              </Box>
          </Box>
      );
  };

  // Hàm format ngày tháng
  const formatDate = (dateStr) => {
      if (!dateStr) return "N/A";
      try {
          const date = new Date(dateStr);
          if (isNaN(date.getTime())) return dateStr;
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          return `${hours}:${minutes} ${day}/${month}/${year}`;
      } catch {
          return dateStr;
      }
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
                      position="relative"
                  >
                      {poster ? (
                          <>
                              <img src={poster} alt={title}
                                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                                  onError={(e) => { e.target.style.display = "none"; }}
                              />
                              {/* ✅ Nút play trên poster */}
                              {trailer && (
                                  <Box
                                      position="absolute"
                                      top="50%"
                                      left="50%"
                                      transform="translate(-50%, -50%)"
                                      w="56px"
                                      h="56px"
                                      borderRadius="full"
                                      bg="rgba(249,115,22,0.9)"
                                      display="flex"
                                      alignItems="center"
                                      justifyContent="center"
                                      cursor="pointer"
                                      onClick={onOpen}
                                      _hover={{
                                          transform: "translate(-50%, -50%) scale(1.1)",
                                          bg: "#f97316"
                                      }}
                                      transition="all 0.3s ease"
                                      boxShadow="0 4px 20px rgba(249,115,22,0.5)"
                                  >
                                      <Icon as={MdPlayArrow} boxSize="28px" color="white" />
                                  </Box>
                              )}
                          </>
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
                                  <Box px="10px" py="4px" borderRadius="6px" bg={tagBg} border={`1px solid ${tagBorder}`}>
                                      <Text fontSize="11px" fontWeight="600" color="#f97316">
                                          🎬 {genreName || "Chưa cập nhật"}
                                      </Text>
                                  </Box>
                                  {language && (
                                      <Box px="8px" py="4px" borderRadius="6px" bg={tagBg} border={`1px solid ${tagBorder}`}>
                                          <Text fontSize="11px" fontWeight="600" color={textMuted}>
                                              {language}
                                          </Text>
                                      </Box>
                                  )}
                              </Flex>
                          </Box>
                          <Box textAlign="right" flexShrink="0">
                              <Flex align="center" gap="4px" justify="flex-end">
                                  <Icon as={MdStar} boxSize={{ base: "18px", md: "20px" }} color="#f59e0b" />
                                  <Text fontSize={{ base: "22px", md: "24px" }} fontWeight="800" color={textPrimary}>
                                      {rating || 0}
                                  </Text>
                              </Flex>
                              <Text fontSize="10px" color={textMuted}>{reviewCount || 0} đánh giá</Text>
                          </Box>
                      </Flex>

                      <Box h="1px" bg={cardBorder} mb="14px" />

                      {/* Quick Stats */}
                      <SimpleGrid columns={{ base: 2, md: 5 }} spacing="10px" mb="14px">
                          {[
                              { icon: FaClock, label: "Thời lượng", val: duration ? `${duration} phút` : "N/A" },
                              { icon: MdCalendarToday, label: "Khởi chiếu", val: releaseDate ? formatDate(releaseDate) : "N/A" },
                              { icon: FaVideo, label: "Định dạng", val: format || "2D" },
                              { icon: MdLanguage, label: "Ngôn ngữ", val: language || "N/A" },
                              { icon: FaTicketAlt, label: "Vé đã bán", val: (ticketsSold || 0).toLocaleString() },
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
                                  <Text fontSize={{ base: "12px", md: "13px" }} fontWeight="700" color={textPrimary}>
                                      {val}
                                  </Text>
                              </Box>
                          ))}
                      </SimpleGrid>

                      {/* Description */}
                      {description && (
                          <Box p="12px 14px" borderRadius="12px" bg={descBg} border={`1px solid ${descBorder}`}>
                              <Flex align="center" gap="6px" mb="5px">
                                  <Icon as={MdDescription} boxSize="14px" color="#f97316" />
                                  <Text fontSize="10px" fontWeight="800" color={descTitleColor} 
                                      letterSpacing="1px" textTransform="uppercase"
                                  >
                                      Mô tả phim
                                  </Text>
                              </Flex>
                              <Text fontSize={{ base: "12.5px", md: "13px" }} color={textSecondary} lineHeight="1.7">
                                  {description}
                              </Text>
                          </Box>
                      )}
                  </Box>
              </Flex>
          </Box>

          {/* Detail Info */}
          <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap="12px" mb="16px">
              {[
                  { icon: MdPerson, label: "Đạo diễn", val: directorNames || "Chưa cập nhật" },
                  { icon: FaUsers, label: "Diễn viên chính", val: actorNames || "Chưa cập nhật" },
                  { icon: MdPublic, label: "Quốc gia / Nhà phát hành", val: `${country || ""} ${country && distributor ? "•" : ""} ${distributor || ""}` || "Chưa cập nhật" },
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
                      <Text fontSize="13px" fontWeight="600" color={textPrimary} lineHeight="1.5">
                          {val}
                      </Text>
                  </Box>
              ))}
          </Grid>

          {/* Additional Info */}
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap="12px" mb="16px">
              {[
                  { icon: MdLink, label: "Slug (SEO)", val: slug || "Chưa cập nhật" },
                  { 
                      icon: MdCategory, 
                      label: "Thể loại / Độ tuổi", 
                      val: genreName && rated ? `${genreName} (${rated})` : genreName || rated || "Chưa cập nhật"
                  },
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
                      <Text fontSize="13px" fontWeight="600" color={textPrimary} lineHeight="1.5">
                          {val}
                      </Text>
                      {genreDescription && label === "Thể loại / Độ tuổi" && (
                          <Text fontSize="11px" color={textMuted} mt="4px" fontStyle="italic">
                              {genreDescription}
                          </Text>
                      )}
                  </Box>
              ))}
          </Grid>

          {/* User Info */}
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap="12px" mb="16px">
              <UserInfoCard
                  label="Người tạo"
                  icon={MdPersonAdd}
                  user={creator}
                  userId={createdBy}
                  date={createdAt}
                  dateLabel="Ngày tạo"
              />
              <UserInfoCard
                  label="Người cập nhật"
                  icon={MdPersonOutline}
                  user={updater}
                  userId={updatedBy}
                  date={updatedAt}
                  dateLabel="Ngày cập nhật"
              />
          </Grid>

          {/* System Info */}
          <Box bg={cardBg} borderRadius="14px" border={`1px solid ${cardBorder}`}
              boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "14px 16px", md: "16px 20px" }}
              sx={{ animation: `${fadeUp} 0.5s ease both` }}
          >
              <Flex align="center" gap="8px" mb="10px">
                  <Box w="28px" h="28px" borderRadius="8px" bg={tagBg}
                      display="flex" alignItems="center" justifyContent="center"
                  >
                      <Icon as={MdMovie} boxSize="13px" color="#f97316" />
                  </Box>
                  <Text fontSize="10px" fontWeight="700" color={textMuted} letterSpacing="0.8px" textTransform="uppercase">
                      Thông tin hệ thống
                  </Text>
              </Flex>
              
              <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing="10px">
                  <Box px="12px" py="8px" borderRadius="8px" bg={cardBg2} border={`1px solid ${cardBorder}`}>
                      <Text fontSize="10px" color={textMuted}>Mã phim (ID)</Text>
                      <Text fontSize="13px" fontWeight="600" color={textPrimary} fontFamily="monospace">
                          #{movieId}
                      </Text>
                  </Box>
                  <Box px="12px" py="8px" borderRadius="8px" bg={cardBg2} border={`1px solid ${cardBorder}`}>
                      <Text fontSize="10px" color={textMuted}>Trạng thái</Text>
                      <StatusBadge status={status} />
                  </Box>
                  <Box px="12px" py="8px" borderRadius="8px" bg={cardBg2} border={`1px solid ${cardBorder}`}>
                      <Text fontSize="10px" color={textMuted}>Ngày tạo</Text>
                      <Text fontSize="13px" fontWeight="600" color={textPrimary}>
                          {formatDate(createdAt)}
                      </Text>
                  </Box>
                  <Box px="12px" py="8px" borderRadius="8px" bg={cardBg2} border={`1px solid ${cardBorder}`}>
                      <Text fontSize="10px" color={textMuted}>Cập nhật lần cuối</Text>
                      <Text fontSize="13px" fontWeight="600" color={textPrimary}>
                          {formatDate(updatedAt)}
                      </Text>
                  </Box>
              </SimpleGrid>
          </Box>

          {/* ✅ Trailer - Bấm vào để mở modal */}
          {trailer && (
              <Box 
                  bg={cardBg} 
                  borderRadius="14px" 
                  border={`1px solid ${cardBorder}`}
                  boxShadow="0 1px 4px rgba(0,0,0,0.04)" 
                  p={{ base: "14px 16px", md: "16px 20px" }}
                  mt="16px"
                  sx={{ animation: `${fadeUp} 0.55s ease both` }}
                  cursor="pointer"
                  onClick={onOpen}
                  _hover={{ 
                      borderColor: "#f97316",
                      boxShadow: "0 4px 14px rgba(249,115,22,0.15)"
                  }}
                  transition="all 0.3s ease"
              >
                  <Flex align="center" gap="8px" mb="10px">
                      <Box w="28px" h="28px" borderRadius="8px" bg={tagBg}
                          display="flex" alignItems="center" justifyContent="center"
                      >
                          <Icon as={MdPlayArrow} boxSize="13px" color="#f97316" />
                      </Box>
                      <Text fontSize="10px" fontWeight="700" color={textMuted} letterSpacing="0.8px" textTransform="uppercase">
                          Trailer phim
                      </Text>
                  </Flex>
                  <Flex 
                      align="center" 
                      justify="space-between" 
                      px="12px" 
                      py="10px" 
                      borderRadius="8px" 
                      bg={cardBg2} 
                      border={`1px solid ${cardBorder}`}
                  >
                      <Flex align="center" gap="10px">
                          <Box
                              w="36px"
                              h="36px"
                              borderRadius="full"
                              bg="rgba(249,115,22,0.15)"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                          >
                              <Icon as={MdPlayArrow} boxSize="20px" color="#f97316" />
                          </Box>
                          <Text fontSize="13px" fontWeight="600" color="#f97316">
                              Nhấn để xem trailer "{title}"
                          </Text>
                      </Flex>
                      <Text fontSize="11px" color={textMuted}>
                          ▶ Xem ngay
                      </Text>
                  </Flex>
              </Box>
          )}

          {/* Nếu không có trailer */}
          {!trailer && (
              <Box 
                  bg={cardBg} 
                  borderRadius="14px" 
                  border={`1px solid ${cardBorder}`}
                  boxShadow="0 1px 4px rgba(0,0,0,0.04)" 
                  p={{ base: "14px 16px", md: "16px 20px" }}
                  mt="16px"
                  sx={{ animation: `${fadeUp} 0.55s ease both` }}
                  opacity="0.6"
              >
                  <Flex align="center" gap="8px">
                      <Box w="28px" h="28px" borderRadius="8px" bg={tagBg}
                          display="flex" alignItems="center" justifyContent="center"
                      >
                          <Icon as={MdPlayArrow} boxSize="13px" color={textMuted} />
                      </Box>
                      <Text fontSize="13px" color={textMuted}>
                          🎬 Chưa có trailer cho phim này
                      </Text>
                  </Flex>
              </Box>
          )}

          {/* ✅ Trailer Modal */}
          <TrailerModal
              isOpen={isOpen}
              onClose={onClose}
              trailerUrl={trailer}
              title={title}
          />
      </Box>
  );
}