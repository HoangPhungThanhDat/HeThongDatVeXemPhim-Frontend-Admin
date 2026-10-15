// views/admin/quanlytintuc/components/TinTucDetail.jsx

import {
    Box, Text, Button, Flex, SimpleGrid, Icon, useColorModeValue
  } from "@chakra-ui/react";
  import { 
    MdArrowBack, MdEdit, MdCalendarToday, MdPerson, 
    MdRemoveRedEye, MdThumbUp, MdComment, MdLink, MdLocalOffer,
    MdAccessTime, MdImage
  } from "react-icons/md";
  import { FaNewspaper } from "react-icons/fa";
  import { StatusBadge } from "./shared/StatusBadge";
  import { CategoryBadge } from "./shared/CategoryBadge";
  import { fadeIn, shimmer, fadeUp } from "./shared/animations";
  import { STATUS_MAP } from "../constants";
  
  export function TinTucDetail({ article, onBack, onEdit }) {
    const cardBg = useColorModeValue("white", "#0b1437");
    const cardBorder = useColorModeValue("#f1f5f9", "rgba(255,255,255,0.08)");
    const cardBg2 = useColorModeValue("#f8fafc", "#0B1437");
    const textPrimary = useColorModeValue("#0f172a", "#ffffff");
    const textSecondary = useColorModeValue("#475569", "#cbd5e1");
    const textMuted = useColorModeValue("#94a3b8", "#8b9bc4");
    const tagBg = useColorModeValue("#fff7ed", "rgba(194,65,12,0.16)");
    const tagBorder = useColorModeValue("#fed7aa", "rgba(253,186,116,0.35)");
    const tagText = useColorModeValue("#c2410c", "#fdba74");
    const featuredBg = useColorModeValue("#fef3c7", "rgba(245,158,11,0.18)");
    const featuredBorder = useColorModeValue("#fcd34d", "rgba(252,211,77,0.4)");
    const featuredText = useColorModeValue("#b45309", "#fcd34d");
    const secondaryBtnBg = useColorModeValue("#f8fafc", "rgba(255,255,255,0.05)");
    const secondaryBtnBorder = useColorModeValue("#e2e8f0", "rgba(255,255,255,0.14)");
    const secondaryBtnColor = useColorModeValue("#475569", "#cbd5e1");
    const secondaryBtnHoverBg = useColorModeValue("#f1f5f9", "rgba(255,255,255,0.1)");
  
    // Lấy dữ liệu từ article
    const id = article.NewsId || article.id;
    const status = article.Status || article.status || "Draft";
    const category = article.Category || article.category || "Tin tức";
    const title = article.Title || article.title || "";
    const image = article.ImageUrl || article.imageUrl || article.thumbnail || "";
    const author = article.Author || article.author || "N/A";
    const slug = article.Slug || article.slug || "";
    const excerpt = article.Excerpt || article.excerpt || "";
    const content = article.Content || article.content || "";
    const linkedMovie = article.LinkedMovie || article.linkedMovie || "";
    const views = article.views || 0;
    const likes = article.likes || 0;
    const comments = article.comments || 0;
    const tags = article.Tags || article.tags || [];
    const featured = article.Featured || article.featured || false;
    const createdAt = article.CreatedAt || article.createdAt || "";
    const updatedAt = article.UpdatedAt || article.updatedAt || "";
    const userId = article.UserId || article.userId || "";
    const createdBy = article.CreatedBy || article.createdBy || "";
    const updatedBy = article.UpdatedBy || article.updatedBy || "";
  
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
          <Button h="38px" px={{ base: "14px", md: "20px" }} borderRadius="10px"
            fontWeight="700" fontSize="13px"
            bg="linear-gradient(135deg, #f97316, #fb923c)" color="white"
            boxShadow="0 4px 14px rgba(249,115,22,0.3)"
            _hover={{ boxShadow: "0 6px 20px rgba(249,115,22,0.4)", transform: "translateY(-1px)" }}
            _active={{ transform: "translateY(0)" }} transition="all 0.2s"
            leftIcon={<Icon as={MdEdit} />} onClick={onEdit}
            w={{ base: "100%", sm: "auto" }}
          >
            Chỉnh sửa
          </Button>
        </Flex>
  
        {/* Hero Card */}
        <Box bg={cardBg} borderRadius="18px" border={`1px solid ${cardBorder}`}
          boxShadow="0 2px 14px rgba(0,0,0,0.06)" overflow="hidden" mb="16px"
        >
          <Box h="4px" bg="linear-gradient(90deg, #f97316, #f97316, #f97316)"
            bgSize="200% 100%" sx={{ animation: `${shimmer} 3s linear infinite` }}
          />
          
          {/* Image */}
          {image && (
            <Box w="100%" h={{ base: "200px", md: "280px" }} overflow="hidden">
              <img 
                src={image} 
                alt={title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                onError={(e) => { e.target.style.display = "none"; }}
              />
            </Box>
          )}
          
          <Box p={{ base: "18px", md: "28px" }}>
            {/* Badges */}
            <Flex gap="8px" mb="12px" flexWrap="wrap" align="center">
              <StatusBadge status={status} />
              <CategoryBadge category={category} />
              {featured && (
                <Box px="7px" py="3px" borderRadius="6px" bg={featuredBg} border={`1px solid ${featuredBorder}`}>
                  <Text fontSize="10px" fontWeight="800" color={featuredText}>✦ NỔI BẬT</Text>
                </Box>
              )}
            </Flex>
  
            {/* Title */}
            <Text fontSize={{ base: "20px", md: "26px" }} fontWeight="800" color={textPrimary}
              letterSpacing="-0.4px" lineHeight="1.3" mb="12px"
            >
              {title}
            </Text>
  
            {/* Meta */}
            <Flex gap="16px" flexWrap="wrap" mb="16px">
              <Flex align="center" gap="5px">
                <Icon as={MdPerson} boxSize="13px" color={textMuted} />
                <Text fontSize="12px" fontWeight="600" color={textSecondary}>{author}</Text>
              </Flex>
              {createdAt && (
                <Flex align="center" gap="5px">
                  <Icon as={MdCalendarToday} boxSize="13px" color={textMuted} />
                  <Text fontSize="12px" color={textMuted}>
                    {new Date(createdAt).toLocaleDateString("vi-VN")}
                  </Text>
                </Flex>
              )}
              {linkedMovie && (
                <Flex align="center" gap="5px">
                  <Icon as={MdLink} boxSize="13px" color="#f97316" />
                  <Text fontSize="12px" fontWeight="600" color="#f97316">{linkedMovie}</Text>
                </Flex>
              )}
            </Flex>
  
            <Box h="1px" bg={cardBorder} mb="16px" />
  
            {/* Stats */}
            <SimpleGrid columns={{ base: 3, md: 3 }} spacing="10px" mb="16px">
              {[
                { icon: MdRemoveRedEye, label: "Lượt xem", val: views.toLocaleString() },
                { icon: MdThumbUp, label: "Thích", val: likes },
                { icon: MdComment, label: "Bình luận", val: comments },
              ].map(({ icon: Ic, label, val }) => (
                <Box key={label} p="10px 12px" borderRadius="10px" bg={cardBg2} border={`1px solid ${cardBorder}`}>
                  <Flex align="center" gap="5px" mb="3px">
                    <Icon as={Ic} boxSize="11px" color="#f97316" />
                    <Text fontSize="9px" fontWeight="700" color={textMuted} letterSpacing="0.7px" textTransform="uppercase">
                      {label}
                    </Text>
                  </Flex>
                  <Text fontSize={{ base: "14px", md: "15px" }} fontWeight="800" color={textPrimary}>{val}</Text>
                </Box>
              ))}
            </SimpleGrid>
  
            {/* Excerpt */}
            {excerpt && (
              <Box p="14px 16px" borderRadius="12px" bg={tagBg} border={`1px solid ${tagBorder}`}>
                <Text fontSize="10px" fontWeight="800" color={tagText} letterSpacing="1px"
                  textTransform="uppercase" mb="6px">Mô tả ngắn</Text>
                <Text fontSize={{ base: "13px", md: "14px" }} color={textSecondary} lineHeight="1.75">
                  {excerpt}
                </Text>
              </Box>
            )}
  
            {/* Content */}
            {content && (
              <Box mt="14px" p="14px 16px" borderRadius="12px" bg={cardBg2} border={`1px solid ${cardBorder}`}>
                <Text fontSize="10px" fontWeight="800" color={textMuted} letterSpacing="1px"
                  textTransform="uppercase" mb="6px">Nội dung</Text>
                <Text fontSize={{ base: "13px", md: "14px" }} color={textSecondary} lineHeight="1.8" whiteSpace="pre-wrap">
                  {content}
                </Text>
              </Box>
            )}
  
            {/* Tags */}
            {tags && tags.length > 0 && (
              <Flex gap="7px" mt="14px" flexWrap="wrap" align="center">
                <Icon as={MdLocalOffer} boxSize="12px" color={textMuted} />
                {tags.map(tag => (
                  <Box key={tag} px="8px" py="3px" borderRadius="6px"
                    bg={tagBg} border={`1px solid ${tagBorder}`}
                  >
                    <Text fontSize="11px" fontWeight="600" color={tagText}># {tag}</Text>
                  </Box>
                ))}
              </Flex>
            )}
          </Box>
        </Box>
  
        {/* Additional Info - 2 columns */}
        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing="12px" mb="16px">
          {/* Left - Author Info */}
          <Box bg={cardBg} borderRadius="14px" border={`1px solid ${cardBorder}`}
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "14px 16px", md: "16px 20px" }}
            sx={{ animation: `${fadeUp} 0.4s ease both` }}
          >
            <Flex align="center" gap="8px" mb="10px">
              <Box w="28px" h="28px" borderRadius="8px" bg={tagBg}
                display="flex" alignItems="center" justifyContent="center"
              >
                <Icon as={MdPerson} boxSize="13px" color="#f97316" />
              </Box>
              <Text fontSize="10px" fontWeight="700" color={textMuted} letterSpacing="0.8px" textTransform="uppercase">
                Thông Tin Tác Giả
              </Text>
            </Flex>
            <Flex direction="column" gap="8px">
              <Box p="10px 12px" borderRadius="8px" bg={cardBg2} border={`1px solid ${cardBorder}`}>
                <Text fontSize="9px" fontWeight="700" color={textMuted} textTransform="uppercase" letterSpacing="0.6px" mb="2px">
                  Người đăng
                </Text>
                <Text fontSize="13px" fontWeight="600" color={textPrimary}>{userId || "N/A"}</Text>
              </Box>
              {createdBy && (
                <Box p="10px 12px" borderRadius="8px" bg={cardBg2} border={`1px solid ${cardBorder}`}>
                  <Text fontSize="9px" fontWeight="700" color={textMuted} textTransform="uppercase" letterSpacing="0.6px" mb="2px">
                    Người tạo
                  </Text>
                  <Text fontSize="13px" fontWeight="600" color={textPrimary}>{createdBy}</Text>
                </Box>
              )}
              {updatedBy && (
                <Box p="10px 12px" borderRadius="8px" bg={cardBg2} border={`1px solid ${cardBorder}`}>
                  <Text fontSize="9px" fontWeight="700" color={textMuted} textTransform="uppercase" letterSpacing="0.6px" mb="2px">
                    Người cập nhật
                  </Text>
                  <Text fontSize="13px" fontWeight="600" color={textPrimary}>{updatedBy}</Text>
                </Box>
              )}
            </Flex>
          </Box>
  
          {/* Right - System Info */}
          <Box bg={cardBg} borderRadius="14px" border={`1px solid ${cardBorder}`}
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "14px 16px", md: "16px 20px" }}
            sx={{ animation: `${fadeUp} 0.45s ease both` }}
          >
            <Flex align="center" gap="8px" mb="10px">
              <Box w="28px" h="28px" borderRadius="8px" bg={tagBg}
                display="flex" alignItems="center" justifyContent="center"
              >
                <Icon as={MdAccessTime} boxSize="13px" color="#f97316" />
              </Box>
              <Text fontSize="10px" fontWeight="700" color={textMuted} letterSpacing="0.8px" textTransform="uppercase">
                Thông Tin Hệ Thống
              </Text>
            </Flex>
            <Flex direction="column" gap="8px">
              <Box p="10px 12px" borderRadius="8px" bg={cardBg2} border={`1px solid ${cardBorder}`}>
                <Text fontSize="9px" fontWeight="700" color={textMuted} textTransform="uppercase" letterSpacing="0.6px" mb="2px">
                  Ngày tạo
                </Text>
                <Text fontSize="13px" fontWeight="600" color={textPrimary}>
                  {createdAt ? new Date(createdAt).toLocaleString("vi-VN") : "N/A"}
                </Text>
              </Box>
              <Box p="10px 12px" borderRadius="8px" bg={cardBg2} border={`1px solid ${cardBorder}`}>
                <Text fontSize="9px" fontWeight="700" color={textMuted} textTransform="uppercase" letterSpacing="0.6px" mb="2px">
                  Cập nhật lần cuối
                </Text>
                <Text fontSize="13px" fontWeight="600" color={textPrimary}>
                  {updatedAt ? new Date(updatedAt).toLocaleString("vi-VN") : "N/A"}
                </Text>
              </Box>
            </Flex>
          </Box>
        </SimpleGrid>
  
        {/* ID & Slug */}
        <Box bg={cardBg} borderRadius="14px" border={`1px solid ${cardBorder}`}
          boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "14px 16px", md: "16px 20px" }}
          sx={{ animation: `${fadeUp} 0.5s ease both` }}
        >
          <Flex align="center" justify="space-between" flexWrap="wrap" gap="10px">
            <Flex align="center" gap="8px">
              <Box w="28px" h="28px" borderRadius="8px" bg={tagBg}
                display="flex" alignItems="center" justifyContent="center"
              >
                <Icon as={FaNewspaper} boxSize="13px" color="#f97316" />
              </Box>
              <Text fontSize="10px" fontWeight="700" color={textMuted} letterSpacing="0.8px" textTransform="uppercase">
                Mã Tin Tức
              </Text>
            </Flex>
            <Text fontSize="13px" fontWeight="700" color={textPrimary} fontFamily="monospace">
              #{id}
            </Text>
          </Flex>
          <Box h="1px" bg={cardBorder} my="10px" />
          <Flex align="center" gap="8px">
            <Box w="28px" h="28px" borderRadius="8px" bg={cardBg2}
              display="flex" alignItems="center" justifyContent="center"
            >
              <Icon as={MdLink} boxSize="13px" color="#f97316" />
            </Box>
            <Text fontSize="10px" fontWeight="700" color={textMuted} letterSpacing="0.8px" textTransform="uppercase">
              Đường dẫn bài viết
            </Text>
            <Text fontSize="13px" fontWeight="600" color="#f97316" ml="auto" fontFamily="monospace">
              /tin-tuc/{slug}
            </Text>
          </Flex>
        </Box>
      </Box>
    );
  }