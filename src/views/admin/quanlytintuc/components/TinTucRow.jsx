

import {
    Box, Flex, Text, Button, Icon, useColorModeValue
  } from "@chakra-ui/react";
  import { MdVisibility, MdEdit, MdDeleteOutline, MdVisibilityOff, MdPublish, MdPerson, MdRemoveRedEye, MdThumbUp } from "react-icons/md";
  import { StatusBadge } from "./shared/StatusBadge";
  import { CategoryBadge } from "./shared/CategoryBadge";
  import { fadeUp } from "./shared/animations";
  
  export function TinTucRow({ 
    article, index, onView, onEdit, onToggleStatus, onDelete 
  }) {
    const cardBg = useColorModeValue("white", "#0b1437");
    const cardBorder = useColorModeValue("#f1f5f9", "rgba(255,255,255,0.08)");
    const textPrimary = useColorModeValue("#0f172a", "#ffffff");
    const textSecondary = useColorModeValue("#475569", "#cbd5e1");
    const textMuted = useColorModeValue("#94a3b8", "#8b9bc4");
    const textFaint = useColorModeValue("#cbd5e1", "#3c4b70");
    const rowHoverBg = useColorModeValue("#f8fbff", "rgba(249,115,22,0.07)");
    const dangerBg = useColorModeValue("#fef2f2", "rgba(239,68,68,0.13)");
    const dangerColor = useColorModeValue("#dc2626", "#f87171");
    const dangerBorder = useColorModeValue("#fecaca", "rgba(248,113,113,0.35)");
    const dangerHoverBg = useColorModeValue("#fee2e2", "rgba(239,68,68,0.2)");
    const warnBg = useColorModeValue("#fffbeb", "rgba(245,158,11,0.14)");
    const warnColor = useColorModeValue("#b45309", "#fcd34d");
    const warnBorder = useColorModeValue("#fcd34d", "rgba(252,211,77,0.35)");
    const successBg = useColorModeValue("#ecfdf5", "rgba(16,185,129,0.14)");
    const successColor = useColorModeValue("#059669", "#34d399");
    const successBorder = useColorModeValue("#6ee7b7", "rgba(110,231,183,0.35)");
    const featuredBg = useColorModeValue("#fef3c7", "rgba(245,158,11,0.18)");
    const featuredBorder = useColorModeValue("#fcd34d", "rgba(252,211,77,0.4)");
    const featuredText = useColorModeValue("#b45309", "#fcd34d");
    const secondaryBtnBg = useColorModeValue("#f8fafc", "rgba(255,255,255,0.05)");
    const secondaryBtnBorder = useColorModeValue("#e2e8f0", "rgba(255,255,255,0.14)");
    const secondaryBtnColor = useColorModeValue("#475569", "#cbd5e1");
    const secondaryBtnHoverBg = useColorModeValue("#f1f5f9", "rgba(255,255,255,0.1)");
  
    const isPublished = article.status === "Published";
  
    return (
      <Box 
        p="13px 18px" 
        borderRadius="12px"
        bg={cardBg}
        border={`1.5px solid ${cardBorder}`}
        transition="all 0.2s"
        _hover={{ 
          border: "1.5px solid #f97316", 
          boxShadow: "0 2px 14px rgba(249,115,22,0.08)", 
          bg: rowHoverBg 
        }}
        sx={{ animation: `${fadeUp} 0.35s ease ${index * 0.05}s both` }}
      >
        <Flex align="center">
          <Box w="30px" flexShrink="0">
            <Text fontSize="12px" fontWeight="700" color={textFaint}>
              {String(index + 1).padStart(2, "0")}
            </Text>
          </Box>
          
          <Box w="80px" h="52px" borderRadius="8px" overflow="hidden" flexShrink="0" mr="14px">
            <img 
              src={article.ImageUrl || article.imageUrl || article.thumbnail} 
              alt={article.Title || article.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => { e.target.style.background = cardBorder; e.target.style.display = "none"; }}
            />
          </Box>
          
          <Box flex="2.5" minW="0" pr="16px">
            <Flex align="center" gap="6px" mb="3px">
              {article.featured && (
                <Box px="5px" py="1px" borderRadius="4px" bg={featuredBg} border={`1px solid ${featuredBorder}`}>
                  <Text fontSize="9px" fontWeight="800" color={featuredText} letterSpacing="0.5px">NỔI BẬT</Text>
                </Box>
              )}
              <Text fontSize="13px" fontWeight="700" color={textPrimary} noOfLines={1}>
                {article.Title || article.title}
              </Text>
            </Flex>
            <Text fontSize="11.5px" color={textMuted} noOfLines={1}>
              {(article.Excerpt || article.excerpt || "").substring(0, 100)}...
            </Text>
          </Box>
          
          <Box flex="0.9" minW="0" pr="12px">
            <CategoryBadge category={article.Category || article.category || "Tin tức"} />
          </Box>
          
          <Box flex="0.9" minW="0" pr="12px">
            <StatusBadge status={article.Status || article.status || "Draft"} />
          </Box>
          
          <Box flex="1" minW="0" pr="12px">
            <Flex align="center" gap="4px" mb="2px">
              <Icon as={MdPerson} boxSize="11px" color={textMuted} />
              <Text fontSize="11.5px" fontWeight="600" color={textSecondary} noOfLines={1}>
                {article.Author || article.author || "N/A"}
              </Text>
            </Flex>
            <Text fontSize="10.5px" color={textMuted}>
              {article.CreatedAt ? new Date(article.CreatedAt).toLocaleDateString("vi-VN") : "—"}
            </Text>
          </Box>
          
          <Box flex="0.7" minW="0" pr="12px">
            <Flex align="center" gap="5px" mb="2px">
              <Icon as={MdRemoveRedEye} boxSize="11px" color={textMuted} />
              <Text fontSize="12px" fontWeight="700" color={textPrimary}>
                {(article.views || 0).toLocaleString()}
              </Text>
            </Flex>
            <Flex align="center" gap="5px">
              <Icon as={MdThumbUp} boxSize="11px" color={textMuted} />
              <Text fontSize="11px" color={textMuted}>{article.likes || 0}</Text>
            </Flex>
          </Box>
          
          <Flex gap="6px" flexShrink="0">
            <Button size="xs" h="30px" px="10px" borderRadius="8px"
              bg={secondaryBtnBg} color={secondaryBtnColor} border={`1px solid ${secondaryBtnBorder}`}
              fontSize="11.5px" fontWeight="600"
              leftIcon={<Icon as={MdVisibility} boxSize="12px" />}
              _hover={{ bg: secondaryBtnHoverBg }} transition="all 0.15s"
              onClick={() => onView(article)}
            >
              Xem
            </Button>
            <Button size="xs" h="30px" px="10px" borderRadius="8px"
              bg="linear-gradient(135deg, #f97316, #fb923c)" color="white"
              fontSize="11.5px" fontWeight="600"
              leftIcon={<Icon as={MdEdit} boxSize="12px" />}
              _hover={{ opacity: 0.88, transform: "translateY(-1px)" }}
              boxShadow="0 2px 8px rgba(249,115,22,0.3)" transition="all 0.15s"
              onClick={() => onEdit(article)}
            >
              Sửa
            </Button>
            <Button size="xs" h="30px" px="10px" borderRadius="8px"
              bg={isPublished ? warnBg : successBg}
              color={isPublished ? warnColor : successColor}
              border={`1px solid ${isPublished ? warnBorder : successBorder}`}
              fontSize="11.5px" fontWeight="600"
              leftIcon={<Icon as={isPublished ? MdVisibilityOff : MdPublish} boxSize="12px" />}
              _hover={{ opacity: 0.85 }} transition="all 0.15s"
              onClick={() => onToggleStatus(article)}
            >
              {isPublished ? "Ẩn" : "Đăng"}
            </Button>
            <Button size="xs" h="30px" px="10px" borderRadius="8px"
              bg={dangerBg} color={dangerColor} border={`1px solid ${dangerBorder}`}
              fontSize="11.5px" fontWeight="600"
              leftIcon={<Icon as={MdDeleteOutline} boxSize="12px" />}
              _hover={{ bg: dangerHoverBg }} transition="all 0.15s"
              onClick={() => onDelete(article)}
            >
              Xóa
            </Button>
          </Flex>
        </Flex>
      </Box>
    );
  }